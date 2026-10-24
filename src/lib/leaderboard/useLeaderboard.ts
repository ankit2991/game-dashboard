import { useEffect, useState } from 'react';
import { leaderboardApi } from '../api/leaderboard';
import type { LeaderboardListing } from './leaderboardModel';

export function useLeaderboard(gameId: string | null, offset: number) {
  const [revision, setRevision] = useState(0);
  const key = `${gameId ?? 'global'}:${offset}`;
  const [dataState, setDataState] = useState<{ key: string; value: LeaderboardListing } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setDataState(null);
    setLoading(true);
    setError(null);
    leaderboardApi.list(gameId, offset, controller.signal)
      .then(result => { if (!controller.signal.aborted) setDataState({ key, value: result }); })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Unable to load leaderboard.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [gameId, offset, revision]);

  return { data: dataState?.key === key ? dataState.value : null,
    loading: loading || Boolean(dataState && dataState.key !== key), error,
    refresh: () => setRevision(i => i + 1) };
}
