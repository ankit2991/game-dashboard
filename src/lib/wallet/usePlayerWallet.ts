import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletApi } from '../api/wallet';
import { TRANSACTION_PAGE_SIZE, type PlayerTransactionPage, type WalletOverview } from './walletModel';

/** Data is never persisted in localStorage; logout or account changes clear the view. */
export function usePlayerWallet() {
  const { user, getPlayerAccessToken } = useAuth();
  const userId = user?.role === 'player' ? user.id : null;
  const [wallet, setWallet] = useState<WalletOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(v => v + 1), []);
  useEffect(() => {
    let active = true;
    const aborter = new AbortController();
    setWallet(null); setError(null); setLoading(true);
    if (!userId) { setError('Sign in with a player account to view your sandbox wallet.'); setLoading(false); return; }
    void (async () => {
      try {
        const token = await getPlayerAccessToken();
        if (!token) throw new Error('Player session expired. Sign in again.');
        const result = await walletApi.overview(token, aborter.signal);
        if (active) setWallet(result);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Wallet service unavailable.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; aborter.abort(); };
  }, [getPlayerAccessToken, userId, revision]);
  return { wallet, loading, error, refresh };
}

export function usePlayerTransactions(offset: number) {
  const { user, getPlayerAccessToken } = useAuth();
  const userId = user?.role === 'player' ? user.id : null;
  const [page, setPage] = useState<PlayerTransactionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(v => v + 1), []);
  useEffect(() => {
    let active = true;
    const aborter = new AbortController();
    setPage(null); setError(null); setLoading(true);
    if (!userId) { setError('Sign in with a player account to view transactions.'); setLoading(false); return; }
    void (async () => {
      try {
        const token = await getPlayerAccessToken();
        if (!token) throw new Error('Player session expired. Sign in again.');
        const result = await walletApi.transactions(token, offset, aborter.signal);
        if (active) setPage(result);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Transaction history unavailable.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; aborter.abort(); };
  }, [getPlayerAccessToken, userId, offset, revision]);
  return { page, loading, error, refresh, pageSize: TRANSACTION_PAGE_SIZE };
}
