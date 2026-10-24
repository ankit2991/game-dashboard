/** Public Game Provider API contract (never include server-only secrets). */
export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string };
  requestId?: string;
}

export interface ProviderHealth {
  service: string;
  status: string;
  version: string;
  uptimeSeconds: number;
}

export interface ProviderGame {
  gameId: string;
  name: string;
  order: number;
  gameMode: 'single_player' | 'multiplayer';
  demoUrl: string | null;
  integrationStatus: string;
  providerLaunchAvailable: boolean;
}

export interface ProviderInfo {
  service: string;
  apiVersion: string;
  gamesRegistered: number;
  walletTransactionsEnabled: boolean;
}

export interface ProviderReadiness {
  service: string;
  stagingIntegrationReady: boolean;
  persistentStore: boolean;
  walletMode: 'sandbox_only';
  liveMoneySupported: false;
  blockers: string[];
}
