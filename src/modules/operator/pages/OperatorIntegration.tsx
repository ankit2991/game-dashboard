import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';
import { operatorWorkspaceApi, type OperatorIntegration as IntegrationData } from '../../../lib/api/operator';
import { gameActivationLabel } from '../../../lib/operator/integrationModel';

/** Configuration status is never an E2E health check or proof of wallet connectivity. */
export const OperatorIntegration: React.FC = () => {
  const { user, getOperatorAccessToken } = useAuth();
  const [data, setData] = useState<IntegrationData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [walletUrl, setWalletUrl] = useState('');
  const [walletApiKey, setWalletApiKey] = useState('');
  const [walletPassword, setWalletPassword] = useState('');
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletMessage, setWalletMessage] = useState('');
  const [walletError, setWalletError] = useState('');
  const submitWallet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (walletBusy) return;
    setWalletBusy(true); setWalletMessage(''); setWalletError('');
    try {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator session expired.');
      const response = await operatorWorkspaceApi.submitWallet(token, {
        baseUrl: walletUrl, apiKey: walletApiKey, password: walletPassword,
      });
      setWalletApiKey(''); setWalletPassword(''); setWalletUrl('');
      setWalletMessage(`Wallet submitted: ${response.status}. Administrator balance verification required.`);
      setRevision(value => value + 1);
    } catch (cause) {
      setWalletApiKey(''); setWalletPassword('');
      setWalletError(cause instanceof Error ? cause.message : 'Wallet submission failed.');
    } finally { setWalletBusy(false); }
  };
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setData(null);
    void (async () => {
      const token = await getOperatorAccessToken();
      if (!token) throw new Error('Operator sign-in is required.');
      const result = await operatorWorkspaceApi.integration(token, controller.signal);
      if (!controller.signal.aborted) setData(result);
    })().catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Integration status unavailable.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [user?.id, getOperatorAccessToken, revision]);
  const refresh = () => setRevision(i => i + 1);
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl text-white font-bold flex items-center gap-2"><Activity className="text-[#00D4FF]"/>Integration Setup</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Live authorization records from the backend. These are configuration checks, not wallet or launch E2E tests.</p></div>
      <Button size="sm" variant="outline" disabled={loading} onClick={refresh} leftIcon={<RefreshCcw className="h-4 w-4"/>}>Refresh</Button>
    </div>
    {error && <Card><p role="alert" className="text-[#FF5D73] text-sm">{error}</p><Button variant="outline" size="sm" onClick={refresh}>Retry</Button></Card>}
    {loading && <p role="status" className="text-[#98A5BF]">Loading integration status…</p>}
    {data && <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-[#98A5BF] text-xs">Partner API status</p><p className="text-white font-semibold mt-2">{data.provisioned ? data.partnerStatus : 'Not provisioned'}</p>
          <p className="text-[#98A5BF] text-xs mt-2 break-all">{data.partnerId || 'Admin provisioning required'}</p></Card>
        <Card><p className="text-[#98A5BF] text-xs">Games requested / authorized</p><p className="text-xl text-white font-bold mt-2">{data.selectedGames.length} / {data.authorizedGames.length}</p>
          <p className="text-[#FFB547] text-xs mt-2">{data.syncRequired ? 'Awaiting admin sync' : 'No game changes pending'}</p></Card>
        <Card><p className="text-[#98A5BF] text-xs">Credential handoff</p><p className="text-white font-semibold mt-2">{data.credentialClaimedAt ? 'Initial key claimed' : data.credentialClaimableOnce ? 'Ready for one-time claim' : 'Not claimed in portal'}</p>
          <Link to="/operator/credentials" className="text-[#00D4FF] text-xs underline mt-2 inline-block">Manage credentials</Link></Card>
      </div>
      <Card><h2 className="text-white font-semibold mb-3">Activation checklist</h2>
        <div className="space-y-2 text-sm">
          <p className="text-[#20C997]"><CheckCircle2 className="h-4 w-4 inline mr-2"/>Company approved</p>
          <p className={data.selectedGames.length ? 'text-[#20C997]' : 'text-[#FFB547]'}>1. <Link to="/operator/catalog" className="underline">Request games</Link> — {data.selectedGames.length} requested</p>
          <p className={data.provisioned ? 'text-[#20C997]' : 'text-[#FFB547]'}>2. Administrator provisions Partner API — {data.provisioned ? 'complete' : 'pending'}</p>
          <p className={!data.syncRequired && data.authorizedGames.length ? 'text-[#20C997]' : 'text-[#FFB547]'}>3. Administrator approves and syncs games — {data.syncRequired ? 'pending changes' : `${data.authorizedGames.length} authorized`}</p>
          <p className="text-[#FFB547]">4. <Link to="/operator/credentials" className="underline">Securely claim or receive API key</Link> — never embed in frontend code</p>
          <p className="text-[#FFB547]">5. <Link to="/operator/docs" className="underline">Integrate on your backend</Link> — sandbox wallet E2E not yet verified</p>
        </div>
      </Card>
      <Card>
        <h2 className="text-white font-semibold mb-2">B2B Sandbox Wallet Integration</h2>
        <p className="text-[#98A5BF] text-xs mb-3">Managed separately for your Operator account. FAKE COIN only. The backend restricts wallet endpoints to administrator-allowlisted HTTPS hosts. No wallet keys are returned or stored in the browser after submission.</p>
        <p className="text-white text-sm mb-2">Current status: <strong>{data.wallet?.status || 'not_configured'}</strong> · Host: {data.wallet?.host || 'None'}</p>
        {data.wallet?.failureCode && <p className="text-[#FFB547] text-xs mb-2">Last check: {data.wallet.failureCode}</p>}
        {data.wallet?.verifiedAt && <p className="text-[#20C997] text-xs mb-2">Balance verified: {new Date(data.wallet.verifiedAt).toLocaleString()}. This does not verify Bet/Win/Refund.</p>}
        {!data.wallet?.featureEnabled ? <p className="text-[#FFB547] text-xs">B2B wallet configuration is disabled on the backend. The administrator must configure the sandbox wallet environment first.</p> :
          <form onSubmit={event => void submitWallet(event)} className="grid gap-3 max-w-xl" autoComplete="off">
            <label className="text-[#98A5BF] text-xs">Approved HTTPS wallet base URL
              <input type="url" required placeholder="https://sandbox-wallet.example.org" value={walletUrl} onChange={event=>setWalletUrl(event.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-[#0B1020] border border-[#233252] text-white"/></label>
            <label className="text-[#98A5BF] text-xs">Wallet callback API key (secret)
              <input type="password" required minLength={32} maxLength={256} autoComplete="off" value={walletApiKey} onChange={event=>setWalletApiKey(event.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-[#0B1020] border border-[#233252] text-white"/></label>
            <label className="text-[#98A5BF] text-xs">Confirm Operator password
              <input type="password" required autoComplete="current-password" value={walletPassword} onChange={event=>setWalletPassword(event.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-[#0B1020] border border-[#233252] text-white"/></label>
            <Button variant="primary" type="submit" isLoading={walletBusy} disabled={walletBusy}>Submit for Admin Balance Check</Button>
          </form>}
        {walletError && <p role="alert" className="text-[#FF5D73] text-xs mt-2">{walletError}</p>}
        {walletMessage && <p role="status" className="text-[#20C997] text-xs mt-2">{walletMessage}</p>}
      </Card>
      <Card><div className="flex items-center gap-2 text-[#FFB547] text-sm mb-3"><AlertTriangle className="w-4 h-4"/>Wallet and real end-to-end launch are NOT verified or enabled by this status.</div>
        <h2 className="text-white font-semibold mb-3">Game authorization status</h2>
        <div className="space-y-2">{data.games.map(game => <div key={game.gameId} className="border-t border-[#233252] py-3 flex justify-between flex-wrap gap-2 text-sm">
          <div><p className="text-white font-medium">{game.name}</p><p className="text-[#98A5BF] text-xs">Requested: {game.requested ? 'Yes' : 'No'} · Authorized: {game.authorized ? 'Yes' : 'No'}</p></div>
          <span className={game.state === 'authorized_config_only' ? 'text-[#20C997] text-xs' : 'text-[#FFB547] text-xs'}>{gameActivationLabel(game)}</span>
        </div>)}</div>
      </Card>
    </>}
  </div>;
};
