import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Check, Copy, KeyRound, RefreshCcw } from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { operatorWorkspaceApi, type OperatorCredentials as Credentials, type OperatorClaimedKey } from '../../../lib/api/operator';

export const OperatorCredentials: React.FC = () => {
  const { user, getOperatorAccessToken } = useAuth();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [claimConfirm, setClaimConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [issued, setIssued] = useState<OperatorClaimedKey | null>(null);
  const [copied, setCopied] = useState(false);
  const load = useCallback(() => setRevision(i => i + 1), []);
  const clearIssued = () => { setIssued(null); setCopied(false); setPassword(''); setClaimConfirm(false); };
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
  useEffect(() => { clearIssued(); }, [user?.id]);
  async function requestRotation() {
    setBusy(true); setError(null);
    try { const token = await getOperatorAccessToken(); if (!token) throw new Error('Operator session required.');
      await operatorWorkspaceApi.requestRotation(token); load();
    } catch(e) { setError(e instanceof Error ? e.message : 'Unable to request rotation.'); }
    finally { setBusy(false); }
  }
  async function claimKey() {
    if (!password || busy || !claimConfirm) return;
    setBusy(true); setError(null);
    try {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator session required.');
      const result = await operatorWorkspaceApi.claimKey(token, password);
      setPassword(''); setClaimConfirm(false); setIssued(result); load();
    } catch(e) { setError(e instanceof Error ? e.message : 'Unable to claim API key.'); setPassword(''); }
    finally { setBusy(false); }
  }
  async function copyKey() {
    if (!issued) return;
    try { await navigator.clipboard.writeText(issued.apiKey); setCopied(true); }
    catch { setError('Copy failed. Select the secret manually and store it securely.'); }
  }
  return <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><KeyRound className="text-[#00D4FF]"/>Operator API Credentials</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Partner keys are server-to-server credentials and must never be used in website frontend code.</p></div>
      <Button variant="outline" size="sm" disabled={busy} onClick={load} leftIcon={<RefreshCcw className="w-4 h-4" />}>Refresh</Button>
    </div>
    <div className="p-4 bg-[#FFB547]/10 border border-[#FFB547]/30 rounded-xl text-xs text-[#FFB547] flex gap-2"><AlertTriangle className="w-5 h-5 shrink-0"/>Sandbox only. Admin approval/provisioning required. A key does not prove wallet readiness. Initial key can be claimed once with password confirmation; this revokes the earlier admin-issued key.</div>
    {error && <div role="alert" className="text-[#FF5D73] text-sm flex items-center gap-3">{error}<Button variant="outline" size="sm" onClick={load}>Retry</Button></div>}
    <Card><CardHeader title="Partner Provisioning" subtitle="Actual backend Partner status · not an E2E wallet test" />
      {!credentials ? (error ? <p className="text-[#98A5BF] text-sm">Credential status unavailable.</p> : <p role="status" className="text-[#98A5BF] text-sm">Loading credentials status…</p>) : <div className="space-y-3 text-sm">
        <p className="text-white">Status: <strong className="text-[#00D4FF]">{credentials.provisioned ? credentials.partner?.status : 'Not provisioned'}</strong></p>
        {credentials.partner && <><p className="text-[#98A5BF]">Partner ID: <code className="text-white break-all">{credentials.partner.id}</code></p>
          <p className="text-[#98A5BF]">API game permissions: {credentials.partner.allowedGames.length ? credentials.partner.allowedGames.join(', ') : 'None'}</p></>}
        <p className="text-[#98A5BF]">Requested games: {credentials.selectedGames.length ? credentials.selectedGames.join(', ') : 'None'}</p>
        {credentials.syncRequired && <p className="text-[#FFB547]">Game permission changes are pending administrator sync.</p>}
        {!credentials.provisioned && <p className="text-[#FFB547]">Select games and wait for an administrator to provision your partner.</p>}
        {credentials.credentialClaimedAt && <p className="text-[#20C997]">Initial key claimed: {new Date(credentials.credentialClaimedAt).toLocaleString()}</p>}
      </div>}
    </Card>
    {credentials?.credentialClaimableOnce && !issued && <Card><CardHeader title="Claim initial API key once" subtitle="Password confirmation · key visible only in this response" />
      <p className="text-[#98A5BF] text-xs mb-3">Claiming rotates the initial administrator-issued key, invalidating it immediately. Store the new key in your backend's secret manager. Anyone with browser access while it is visible could copy it. Never put it in frontend JS, a public repository or a chat message.</p>
      <label className="block text-[#98A5BF] text-xs mb-3">Operator account password
        <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2" /></label>
      <label className="flex items-start gap-2 text-[#98A5BF] text-xs mb-3"><input type="checkbox" checked={claimConfirm} onChange={e => setClaimConfirm(e.target.checked)} />I understand this is a one-time display and the previous key will be revoked.</label>
      <Button size="sm" disabled={busy || !password || !claimConfirm} onClick={() => void claimKey()}>Generate my one-time key</Button>
    </Card>}
    {issued && <Card><CardHeader title="New Partner API key — visible once" subtitle="Copy now and place it in your backend secret manager" />
      <p className="text-[#FFB547] text-xs mb-3">This secret cannot be retrieved again. Closing this panel removes it from the interface. The previous key is revoked immediately.</p>
      <p className="text-[#98A5BF] text-xs">Partner ID: {issued.partnerId}</p>
      <div className="flex flex-wrap items-center gap-2"><code className="select-all min-w-0 break-all flex-1 rounded-lg bg-[#0B1020] p-3 text-[#20C997]">{issued.apiKey}</code>
        <Button size="sm" variant="outline" leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} onClick={() => void copyKey()}>{copied ? 'Copied' : 'Copy'}</Button></div>
      <div className="mt-4"><Button onClick={clearIssued}>I saved my key — hide it</Button></div>
    </Card>}
    {credentials?.provisioned && !issued && <Card><CardHeader title="Credential Rotation" subtitle="Admin-mediated rotation after initial claim" />
      <p className="text-[#98A5BF] text-xs mb-3">Future rotations are handled by the administrator. The old key is revoked immediately after a rotation; coordinate secure delivery before the change.</p>
      {credentials.rotationRequestedAt ? <p className="text-[#FFB547] text-sm">Rotation requested: {new Date(credentials.rotationRequestedAt).toLocaleString()} · Awaiting administrator.</p>
        : <Button variant="outline" disabled={busy} onClick={() => void requestRotation()}>Request key rotation</Button>}
    </Card>}
  </div>;
};
