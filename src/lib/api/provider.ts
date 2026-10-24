import { apiRequest } from './client';
import type { ProviderGame, ProviderHealth, ProviderInfo, ProviderReadiness } from './types';

/** Public read-only endpoints; real login/launch/wallet integration follows in later patches. */
export const providerApi = {
  health: (signal?: AbortSignal) => apiRequest<ProviderHealth>('/health', { signal }),
  info: (signal?: AbortSignal) => apiRequest<ProviderInfo>('/provider', { signal }),
  games: async (signal?: AbortSignal): Promise<ProviderGame[]> => {
    const data = await apiRequest<{ games: ProviderGame[] }>('/games', { signal });
    if (!Array.isArray(data.games)) throw new Error('Invalid games catalog response');
    return data.games;
  },
  // A 503 readiness response is expected when sandbox wallet/adapter setup is incomplete.
  // Do not use readiness as a basic liveness/connection check.
  readiness: (signal?: AbortSignal) => apiRequest<ProviderReadiness>('/readiness', { signal }),
};
