/** Read-only launch readiness; configuration isn't a deployed end-to-end certification. */
export interface LaunchCapability {
  gameId: string;
  demoAvailable: boolean;
  providerHandoffConfigured: boolean;
  gameBackendConfigured: boolean;
  adapterKeyConfigured?: boolean;
  adapterHandshakeVerified?: false;
  pinballSandboxPilotConfigured?: boolean;
  sandboxPilotConfigured?: boolean;
  browserE2eVerified: false;
  liveMoneySupported: false;
  blockers: string[];
}
export interface LaunchCapabilitiesResponse {
  scope: 'configuration_only';
  games: LaunchCapability[];
}
export function validateLaunchCapabilities(value: unknown): LaunchCapabilitiesResponse {
  if (!value || typeof value !== 'object') throw new Error('Invalid launch capabilities response');
  const raw = value as Record<string, unknown>;
  if (raw.scope !== 'configuration_only' || !Array.isArray(raw.games) || raw.games.length > 7) {
    throw new Error('Invalid launch capabilities response');
  }
  const seen = new Set<string>();
  for (const item of raw.games) {
    if (!item || typeof item !== 'object') throw new Error('Invalid launch capabilities response');
    const game = item as Record<string, unknown>;
    if (typeof game.gameId !== 'string' || !/^[a-z0-9-]{2,64}$/.test(game.gameId) || seen.has(game.gameId) ||
        typeof game.demoAvailable !== 'boolean' || typeof game.providerHandoffConfigured !== 'boolean' ||
        typeof game.gameBackendConfigured !== 'boolean' ||
        (game.adapterKeyConfigured !== undefined && typeof game.adapterKeyConfigured !== 'boolean') ||
        (game.adapterHandshakeVerified !== undefined && game.adapterHandshakeVerified !== false) ||
        (game.pinballSandboxPilotConfigured !== undefined && typeof game.pinballSandboxPilotConfigured !== 'boolean') ||
        (game.sandboxPilotConfigured !== undefined && typeof game.sandboxPilotConfigured !== 'boolean') ||
        game.browserE2eVerified !== false ||
        game.liveMoneySupported !== false || !Array.isArray(game.blockers) ||
        game.blockers.some(code => typeof code !== 'string' || !/^[A-Z_]+$/.test(code))) {
      throw new Error('Invalid launch capabilities response');
    }
    seen.add(game.gameId);
  }
  return raw as unknown as LaunchCapabilitiesResponse;
}
