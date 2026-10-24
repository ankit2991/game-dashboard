import { useEffect, useState } from 'react';
import { providerApi } from '../api/provider';
import type { ProviderGame } from '../api/types';
import { normalizeCatalog } from './catalogModel';

export type CatalogState = {
  games: ProviderGame[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useProviderCatalog(): CatalogState {
  const [revision, setRevision] = useState(0);
  const [games, setGames] = useState<ProviderGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    providerApi.games(controller.signal)
      .then((response) => { if (!controller.signal.aborted) setGames(normalizeCatalog(response)); })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setGames([]); // Never serve stale catalog content as if the backend were online.
        setError(cause instanceof Error ? cause.message : 'Unable to load games from the backend.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  return { games, loading, error, refresh: () => setRevision((value) => value + 1) };
}
