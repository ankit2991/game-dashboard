import { playerApi, type PlayerSessionResponse } from '../api/player';

// Only the opaque refresh token is persisted. Access tokens and user identities
// remain in React memory and are revalidated by the backend on page reload.
// Browser storage is vulnerable to XSS: HttpOnly cookie-based refresh flows are
// recommended before handling production financial or sensitive accounts.
const REMEMBER_KEY = 'game_provider_player_refresh_v1';
const LEGACY_MOCK_KEY = 'nexus_auth_session';

export interface PersistedRefresh { refreshToken: string; remember: boolean }

export function clearLegacyMockSession(): void {
  try { localStorage.removeItem(LEGACY_MOCK_KEY); } catch { /* private browsing */ }
}

export function clearPersistedRefresh(): void {
  try { localStorage.removeItem(REMEMBER_KEY); } catch { /* storage denied */ }
  try { sessionStorage.removeItem(REMEMBER_KEY); } catch { /* storage denied */ }
}

export function readPersistedRefresh(): PersistedRefresh | null {
  for (const remember of [true, false]) {
    try {
      const storage = remember ? localStorage : sessionStorage;
      const token = storage.getItem(REMEMBER_KEY);
      if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) return { refreshToken: token, remember };
      if (token) storage.removeItem(REMEMBER_KEY);
    } catch { /* storage denied */ }
  }
  return null;
}

export function persistRefresh(refreshToken: string, remember: boolean): void {
  clearPersistedRefresh();
  try { (remember ? localStorage : sessionStorage).setItem(REMEMBER_KEY, refreshToken); }
  catch { /* still authenticated in memory until next reload */ }
}

// React StrictMode mounts effects twice in development. A refresh token can be
// rotated only once, so duplicate concurrent restore calls must share a request.
const inFlightRefreshes = new Map<string, Promise<PlayerSessionResponse>>();
export function refreshOnce(token: string): Promise<PlayerSessionResponse> {
  const existing = inFlightRefreshes.get(token);
  if (existing) return existing;
  const pending = playerApi.refresh(token).finally(() => {
    if (inFlightRefreshes.get(token) === pending) inFlightRefreshes.delete(token);
  });
  inFlightRefreshes.set(token, pending);
  return pending;
}
