import { useEffect, useState } from 'react';
import { leaderboardApi } from '../api/leaderboard';
import type { LeaderboardListing } from './leaderboardModel';

export function useLeaderboard(gameId: string | null, offset: number) {
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<LeaderboardListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setLoading(true);
    setError(null);
    leaderboardApi.list(gameId, offset, controller.signal)
      .then(result => { if (!controller.signal.aborted) setData(result); })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Unable to load leaderboard.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [gameId, offset, revision]);

  return { data, loading, error, refresh: () => setRevision(i => i + 1) };
}
