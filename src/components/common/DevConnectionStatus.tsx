import { useEffect, useState } from 'react';
import { providerApi } from '../../lib/api/provider';
import { apiBaseUrl, ApiError } from '../../lib/api/client';

type Check = { status: 'checking' | 'connected' | 'error'; version?: string; games?: number; message?: string };

/** Dev-only diagnostic: proves browser <-> backend for public endpoints. */
export function DevConnectionStatus() {
  const [attempt, setAttempt] = useState(0);
  const [check, setCheck] = useState<Check>({ status: 'checking' });

  useEffect(() => {
    const controller = new AbortController();
    setCheck({ status: 'checking' });
    Promise.all([providerApi.health(controller.signal), providerApi.games(controller.signal)])
      .then(([health, games]) => {
        if (!controller.signal.aborted) setCheck({ status: 'connected', version: health.version, games: games.length });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setCheck({ status: 'error', message: error instanceof ApiError ? `${error.code}: ${error.message}` : 'Invalid API response' });
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="border-y border-[#233252] py-2 space-y-1 text-[10px]" aria-live="polite">
      <div className="flex justify-between items-center gap-2">
        <strong className="text-[#DCE7FF]">Backend connection</strong>
        <button type="button" onClick={() => setAttempt(a => a + 1)} className="text-[#00D4FF] hover:underline">Retry</button>
      </div>
      <div className="break-all text-[#64748B]" title={apiBaseUrl}>{apiBaseUrl}</div>
      {check.status === 'connected' && <p className="text-[#20C997]">Connected · v{check.version} · {check.games} registered games</p>}
      {check.status === 'checking' && <p className="text-[#FFB547]">Checking health and game catalog…</p>}
      {check.status === 'error' && <p className="text-[#FF5D73] break-words">Disconnected · {check.message}</p>}
      <p className="text-[#64748B]">Checks public API only. B2C authentication requires backend configuration. Wallet and provider launch are not integrated yet.</p>
    </div>
  );
}
