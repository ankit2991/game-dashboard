import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/** Backend is always the source of truth; abort stale requests on unmount/navigation. */
export function useAdminPortalData<T>(fetchData: (access: string, signal?: AbortSignal) => Promise<T>) {
  const {getAdminAccessToken} = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError('');
    try {
      const access = await getAdminAccessToken();
      if (!access) throw new Error('Admin session expired. Sign in again.');
      if (signal?.aborted) return;
      const result = await fetchData(access, signal);
      if (!signal?.aborted) setData(result);
    } catch (e) {
      if (!signal?.aborted) {setData(null); setError(e instanceof Error ? e.message : 'Unable to load data.');}
    } finally {if (!signal?.aborted) setLoading(false);}
  }, [fetchData, getAdminAccessToken]);
  useEffect(() => {
    const ctrl = new AbortController(); void reload(ctrl.signal);
    return () => ctrl.abort();
  }, [reload]);
  return {data, loading, error, reload};
}
