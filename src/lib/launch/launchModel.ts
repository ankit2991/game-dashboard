/** Strict link validation prevents opening untrusted game destinations from API responses. */
export type LaunchMode = 'demo' | 'provider';
export interface BrowserGameLaunch {
  gameId: string;
  mode: LaunchMode;
  launchUrl: string;
  walletMode: 'local_demo' | 'sandbox_only';
  launchId?: string;
  expiresAt?: string;
  status?: 'sandbox_launch_ready';
}

function safeGameUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : null;
  } catch { return null; }
}

/** Only open the exact game URL already published in the trusted backend catalog. */
export function validateLaunchResponse(raw: BrowserGameLaunch, expectedGameId: string, expectedMode: LaunchMode, catalogDemoUrl: string | null): BrowserGameLaunch {
  if (!raw || raw.gameId !== expectedGameId || raw.mode !== expectedMode ||
      typeof raw.launchUrl !== 'string') throw new Error('Invalid game launch response.');
  const catalogUrl = safeGameUrl(catalogDemoUrl);
  const candidateUrl = safeGameUrl(raw.launchUrl);
  if (!catalogUrl || !candidateUrl) throw new Error('Game launch URL is not safe.');
  const expected = new URL(catalogUrl);
  const candidate = new URL(candidateUrl);
  if (candidate.origin !== expected.origin || candidate.pathname !== expected.pathname ||
      candidate.search || expected.search || expected.hash) {
    throw new Error('Launch URL does not match the configured game.');
  }
  if (expectedMode === 'demo') {
    if (candidate.hash || raw.walletMode !== 'local_demo') throw new Error('Invalid demo launch.');
  } else {
    const fragment = new URLSearchParams(candidate.hash.slice(1));
    if (raw.walletMode !== 'sandbox_only' || raw.status !== 'sandbox_launch_ready' ||
        typeof raw.launchId !== 'string' || typeof raw.expiresAt !== 'string' ||
        !Number.isFinite(Date.parse(raw.expiresAt)) || Date.parse(raw.expiresAt) <= Date.now() ||
        fragment.size !== 2 || !/^[A-Za-z0-9_-]{43}$/.test(fragment.get('provider_launch_token') || '') ||
        fragment.get('provider_launch_id') !== raw.launchId) {
      throw new Error('Invalid provider launch handoff.');
    }
  }
  return raw;
}

