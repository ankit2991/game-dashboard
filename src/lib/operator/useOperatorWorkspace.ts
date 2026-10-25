import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { operatorWorkspaceApi, type OperatorGame, type OperatorIntegration } from '../api/operator';
import { safeOperatorGames } from './workspaceModel';

export function useOperatorWorkspace() {
  const { user, getOperatorAccessToken } = useAuth();
  const [games, setGames] = useState<OperatorGame[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [integration, setIntegration] = useState<OperatorIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError(null); setGames([]); setSelectedGames([]); setIntegration(null);
    void (async () => {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator session required.');
      const [result, status] = await Promise.all([operatorWorkspaceApi.catalog(token, abort.signal), operatorWorkspaceApi.integration(token, abort.signal)]);
      if (!abort.signal.aborted) {
        setGames(safeOperatorGames(result.games));
        setSelectedGames(result.selectedGames);
        setIntegration(status);
      }
    })().catch(err => {
      if (!abort.signal.aborted) { setGames([]); setSelectedGames([]); setError(err instanceof Error ? err.message : 'Catalog unavailable.'); }
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [getOperatorAccessToken, user?.id, revision]);
  const update = useCallback(async (next: string[]) => {
    setSaving(true); setError(null);
    try {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator session required.');
      const result = await operatorWorkspaceApi.selectGames(token, next);
      setSelectedGames(result.selectedGames);
      const latest = await operatorWorkspaceApi.integration(token);
      setIntegration(latest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save selection.');
      throw err;
    } finally { setSaving(false); }
  }, [getOperatorAccessToken]);
  return { games, selectedGames, integration, loading, saving, error, update, refresh: () => setRevision(v => v + 1) };
}
