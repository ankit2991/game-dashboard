import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, KeyRound, RefreshCcw } from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { operatorWorkspaceApi, type OperatorCredentials as Credentials } from '../../../lib/api/operator';

export const OperatorCredentials: React.FC = () => {
  const { user, getOperatorAccessToken } = useAuth();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const load = useCallback(() => setRevision(i => i + 1), []);
  useEffect(() => {
    const controller = new AbortController(); setError(null); setCredentials(null);
    void (async () => {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator session required.');
      const result = await operatorWorkspaceApi.credentials(token, controller.signal);
      if (!controller.signal.aborted) setCredentials(result);
    })().catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Cannot load credentials.'); });
    return () => controller.abort();
  }, [getOperatorAccessToken, user?.id, revision]);
  async function requestRotation() {
    setBusy(true); setError(null);
    try { const token = await getOperatorAccessToken(); if (!token) throw new Error('Operator session required.');
      await operatorWorkspaceApi.requestRotation(token); load();
    } catch(e) { setError(e instanceof Error ? e.message : 'Unable to request rotation.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><KeyRound className="text-[#00D4FF]"/>Operator API Credentials</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Server-to-server partner keys are never displayed in browser JavaScript.</p></div>
      <Button variant="outline" size="sm" onClick={load} leftIcon={<RefreshCcw className="w-4 h-4" />}>Refresh</Button>
    </div>
    <div className="p-4 bg-[#FFB547]/10 border border-[#FFB547]/30 rounded-xl text-xs text-[#FFB547] flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0"/>Sandbox only. No live-money settlement, browser secret retrieval, fake production keys or simulated IP allowlist. Provisioning and rotation are administrator-only actions.</div>
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    <Card><CardHeader title="Partner Provisioning" subtitle="Live status retrieved from the backend" />
      {!credentials ? <p className="text-[#98A5BF] text-sm">Loading credentials status…</p> : <div className="space-y-3 text-sm">
        <p className="text-white">Status: <strong className="text-[#00D4FF]">{credentials.provisioned ? credentials.partner?.status : 'Not provisioned'}</strong></p>
        {credentials.partner && <><p className="text-[#98A5BF]">Partner ID: <code className="text-white">{credentials.partner.id}</code></p>
          <p className="text-[#98A5BF]">Current API permissions: {credentials.partner.allowedGames.length ? credentials.partner.allowedGames.join(', ') : 'None'}</p></>}
        <p className="text-[#98A5BF]">Selected games: {credentials.selectedGames.length ? credentials.selectedGames.join(', ') : 'None'}</p>
        {credentials.syncRequired && <p className="text-[#FFB547]">Selection differs from licensed games. Administrator sync required.</p>}
        {!credentials.provisioned && <p className="text-[#FFB547]">An administrator must provision your operator after selecting games.</p>}
      </div>}
    </Card>
    {credentials?.provisioned && <Card><CardHeader title="Credential Rotation" subtitle="Request an administrator to rotate your server-side key" />
      <p className="text-[#98A5BF] text-xs mb-3">Rotation revokes the existing key immediately once an administrator approves. Your backend must receive the new key through a secure channel.</p>
      {credentials.rotationRequestedAt ? <p className="text-[#FFB547] text-sm">Rotation requested: {new Date(credentials.rotationRequestedAt).toLocaleString()} · Awaiting administrator.</p>
        : <Button variant="outline" disabled={busy} onClick={() => void requestRotation()}>Request key rotation</Button>}
    </Card>}
  </div>;
};
