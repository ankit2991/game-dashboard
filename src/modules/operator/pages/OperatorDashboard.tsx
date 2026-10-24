import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, KeyRound, Users, Webhook, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { operatorOperationsApi } from '../../../lib/api/operator';
import { useOperatorOperations } from '../../../lib/operator/useOperatorOperations';

export const OperatorDashboard: React.FC = () => {
  const { data, error, loading, refresh } = useOperatorOperations(operatorOperationsApi.dashboard);
  const metrics = [
    { label: 'Available games', value: data?.availableGames, icon: Gamepad2 },
    { label: 'My selected games', value: data?.selectedGames.length, icon: Gamepad2 },
    { label: 'Authorized for partner', value: data?.authorizedGames.length, icon: KeyRound },
    { label: 'Recorded sandbox transactions', value: data?.transactionsTotal, icon: ArrowLeftRight },
    { label: 'Proposed team members', value: data?.teamDraftCount, icon: Users },
  ];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white">{data?.account.companyName || 'Operator overview'}</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Account overview from the provider backend. Sandbox only; no production wallet or financial reporting.</p></div>
      <div className="flex flex-wrap items-center gap-2"><Badge variant="cyan" size="sm">Sandbox only</Badge>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading} leftIcon={<RefreshCw size={14}/>}>Refresh</Button></div>
    </div>
    {error && <Card role="alert"><p className="text-[#FF5D73]">{error}</p><Button size="sm" variant="outline" onClick={refresh}>Retry</Button></Card>}
    {loading && <p role="status" className="text-[#98A5BF]">Loading operator data from the backend…</p>}
    {!error && <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {metrics.map(({label,value,icon:Icon}) => <Card key={label} className="min-w-0">
        <div className="flex gap-2 items-center text-[#98A5BF] text-xs"><Icon size={15}/>{label}</div>
        <p className="text-2xl font-bold text-white mt-2">{data ? value : '—'}</p></Card>)}
    </div>}
    {data && !error && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card><CardHeader title="Integration status" subtitle="Operator selection and partner permissions are separate"/>
        <div className="space-y-3 text-sm">
          <p className="text-white">Partner: <span className="text-[#98A5BF]">{data.partnerProvisioned ? data.partnerStatus : 'Not provisioned'}</span></p>
          <p className="text-white">Webhook: <span className="text-[#98A5BF]">{data.webhookDraftConfigured ? 'Draft saved; delivery disabled' : 'No draft saved'}</span></p>
          <p className="text-[#98A5BF] text-xs">Selecting a game does not activate its provider adapter or authorize its wallet. No production traffic or GGR analytics are available.</p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#00D4FF]"><Link to="/operator/catalog">Browse catalog →</Link><Link to="/operator/credentials">Credentials →</Link><Link to="/operator/webhooks"><Webhook className="inline w-3 h-3"/> Webhooks →</Link></div>
        </div>
      </Card>
      <Card><CardHeader title="Recent wallet activity" subtitle="Last five recorded sandbox ledger events, not HTTP access logs" action={<Link to="/operator/logs" className="text-xs text-[#00D4FF]">Full activity →</Link>}/>
        {data.recentActivity.length === 0 ? <p className="text-[#98A5BF] text-sm">No ledger transactions recorded for this operator.</p> :
        <ul className="space-y-3">{data.recentActivity.map(x => <li key={x.id} className="flex justify-between gap-2 border-b border-[#233252] pb-2 text-xs">
          <span className="text-white">{x.type} · {x.gameId} <span className="text-[#98A5BF]">({x.status})</span></span>
          <time className="text-[#98A5BF]">{new Date(x.occurredAt).toLocaleString()}</time>
        </li>)}</ul>}
      </Card>
    </div>}
  </div>;
};
