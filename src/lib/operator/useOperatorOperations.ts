import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/** The operator token is requested afresh (including refresh), never stored in a component. */
export function useOperatorOperations<T>(load: (token: string, signal: AbortSignal) => Promise<T>, deps: readonly unknown[] = []) {
  const { getOperatorAccessToken, user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(x => x + 1), []);
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true); setError(null);
    void (async () => {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator login required.');
      const response = await load(token, ctrl.signal);
      if (!ctrl.signal.aborted) setData(response);
    })().catch(e => {
      if (!ctrl.signal.aborted) { setData(null); setError(e instanceof Error ? e.message : 'Request failed'); }
    }).finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
    // load is expected to be a stable callback defined outside the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOperatorAccessToken, user?.id, revision, ...deps]);
  return { data, error, loading, refresh, getOperatorAccessToken };
}
