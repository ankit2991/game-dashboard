import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletApi } from '../api/wallet';
import { TRANSACTION_PAGE_SIZE, type PlayerTransactionPage, type WalletOverview,
  DEFAULT_TRANSACTION_FILTERS, type TransactionFilters } from './walletModel';

/** Data is never persisted in localStorage; logout or account changes clear the view. */
export function usePlayerWallet({ refreshOnResume = false }: { refreshOnResume?: boolean } = {}) {
  const { user, getPlayerAccessToken } = useAuth();
  const userId = user?.role === 'player' ? user.id : null;
  const [walletState, setWalletState] = useState<{ userId: string; value: WalletOverview } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(v => v + 1), []);
  // The player can finish a Provider game in another tab/window; refresh on return.
  // Never cache balance in browser storage, and avoid duplicate focus/visibility requests.
  useEffect(() => {
    if (!refreshOnResume || !userId) return;
    let lastCheck = Date.now();
    const onReturn = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastCheck < 3000) return;
      lastCheck = Date.now();
      refresh();
    };
    window.addEventListener('focus', onReturn);
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('pageshow', onReturn);
    return () => {
      window.removeEventListener('focus', onReturn);
      document.removeEventListener('visibilitychange', onReturn);
      window.removeEventListener('pageshow', onReturn);
    };
  }, [refreshOnResume, userId, refresh]);
  useEffect(() => {
    let active = true;
    const aborter = new AbortController();
    setWalletState(null); setError(null); setLoading(true);
    if (!userId) { setError('Sign in with a player account to view your sandbox wallet.'); setLoading(false); return; }
    void (async () => {
      try {
        const token = await getPlayerAccessToken();
        if (!token) throw new Error('Player session expired. Sign in again.');
        const result = await walletApi.overview(token, aborter.signal);
        if (active && !aborter.signal.aborted) setWalletState({ userId, value: result });
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Wallet service unavailable.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; aborter.abort(); };
  }, [getPlayerAccessToken, userId, revision]);
  return { wallet: walletState?.userId === userId ? walletState.value : null,
    loading: loading || Boolean(walletState && walletState.userId !== userId), error, refresh };
}

export function usePlayerTransactions(offset: number, filters: TransactionFilters = DEFAULT_TRANSACTION_FILTERS) {
  const { user, getPlayerAccessToken } = useAuth();
  const userId = user?.role === 'player' ? user.id : null;
  const [pageState, setPageState] = useState<{ key: string; value: PlayerTransactionPage } | null>(null);
  const key = `${userId ?? ''}:${offset}:${filters.operation}:${filters.status}`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(v => v + 1), []);
  useEffect(() => {
    let active = true;
    const aborter = new AbortController();
    setPageState(null); setError(null); setLoading(true);
    if (!userId) { setError('Sign in with a player account to view transactions.'); setLoading(false); return; }
    void (async () => {
      try {
        const token = await getPlayerAccessToken();
        if (!token) throw new Error('Player session expired. Sign in again.');
        const result = await walletApi.transactions(token, offset, aborter.signal, filters);
        if (active && !aborter.signal.aborted) setPageState({ key, value: result });
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Transaction history unavailable.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; aborter.abort(); };
  }, [getPlayerAccessToken, userId, offset, filters.operation, filters.status, revision]);
  return { page: pageState?.key === key ? pageState.value : null,
    loading: loading || Boolean(pageState && pageState.key !== key), error, refresh, pageSize: TRANSACTION_PAGE_SIZE };
}
