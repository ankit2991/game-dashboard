import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Building2, Gamepad2, Clock, Users, RefreshCw, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminApi } from '../../../lib/api/admin';
import { useAdminPortalData } from '../../../lib/api/useAdminPortalData';

export const AdminDashboard: React.FC = () => {
  const {data, loading, error, reload} = useAdminPortalData(adminApi.overview);
  const stats = data ? [
    {label:'Registered B2C Players', count:data.players.registered, detail:'Unavailable when B2C Auth is disabled', icon:<Users className="w-4 h-4"/>},
    {label:'Operator Applications', count:data.operators.total, detail:'Registered B2B operator accounts', icon:<Building2 className="w-4 h-4"/>},
    {label:'Pending Approval', count:data.operators.pending, detail:'Requires an admin review', icon:<Clock className="w-4 h-4"/>},
    {label:'Approved Operators', count:data.operators.approved, detail:'Approved accounts, not necessarily provisioned', icon:<Activity className="w-4 h-4"/>},
    {label:'Enabled Games', count:data.games.enabled, detail:`${data.games.total} configured titles`, icon:<Gamepad2 className="w-4 h-4"/>},
    {label:'Provider Launch Configured', count:data.games.providerLaunchConfigured, detail:'Configuration alone does not prove a live integration', icon:<ShieldAlert className="w-4 h-4"/>},
  ] : [];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white">Super Admin Overview</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Server-reported snapshot of player accounts, operator approvals and configured games.</p></div>
      <Button size="sm" variant="outline" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    {loading && <p className="text-[#98A5BF] text-sm" role="status">Loading live backend snapshot…</p>}
    {error && <p className="text-[#FF5D73] text-sm rounded-lg border border-[#FF5D73]/40 p-3" role="alert">{error}</p>}
    {data && <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => <Card key={s.label}><div className="flex gap-2 items-center text-[#98A5BF] text-xs">{s.icon}{s.label}</div>
          <p className="text-white text-3xl font-bold mt-3">{s.count === null ? 'N/A' : s.count.toLocaleString()}</p>
          <p className="text-[#98A5BF] text-xs mt-1">{s.detail}</p></Card>)}
      </div>
      <Card><div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-white font-semibold">Pending Operator Applications</h2>
        <Link className="text-[#00D4FF] text-xs hover:underline" to="/admin/operators">Review operators →</Link></div>
        {data.pendingApplications.length ? <div className="space-y-2">{data.pendingApplications.map(op => <div key={op.id} className="flex flex-wrap gap-3 justify-between items-center border-b border-[#233252] py-2">
          <div><p className="text-white text-sm font-medium">{op.companyName}</p><p className="text-[#98A5BF] text-xs">{op.email}</p></div>
          <Badge variant="warning">Pending</Badge></div>)}</div> : <p className="text-[#98A5BF] text-sm">No pending applications.</p>}
      </Card>
      <div className="rounded-lg border border-[#233252] bg-[#121A2D] p-4 text-xs text-[#98A5BF]">
        Financial revenue, API traffic, player activity, RTP and historical growth are not collected by these admin APIs. No estimated or simulated metrics are shown.
      </div>
      <p className="text-[11px] text-[#64748B]">Snapshot generated at {new Date(data.generatedAt).toLocaleString()} · Updates on refresh only</p>
    </>}
  </div>;
};
