import React from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { adminApi } from '../../../lib/api/admin';
import { useAdminPortalData } from '../../../lib/api/useAdminPortalData';

/** Status counts, not historical financial analytics. */
export const AnalyticsReports: React.FC = () => {
  const {data, loading, error, reload} = useAdminPortalData(adminApi.overview);
  const operatorData = data ? (['pending','approved','rejected','suspended'] as const).map(status => ({status, accounts:data.operators[status]})) : [];
  const gameData = data ? [
    {type:'Single player', games:data.games.singlePlayer}, {type:'Multiplayer',games:data.games.multiplayer},
    {type:'Disabled', games:data.games.disabled},
  ] : [];
  const exportCsv = () => {
    if (!data) return;
    const rows: (string | number)[][] = [
      ['Metric','Value'], ['Generated at',data.generatedAt],
      ['Registered players',data.players.registered ?? 'Unavailable'],
      ['Total operators',data.operators.total],
      ...operatorData.map(r => [`Operators ${r.status}`,r.accounts]),
      ['Total games',data.games.total],['Enabled games',data.games.enabled],
      ['Disabled games',data.games.disabled],['Provider launch configured',data.games.providerLaunchConfigured],
    ];
    const csv = rows.map(cols => cols.map(value => `"${String(value).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    const a = document.createElement('a'); a.href = href; a.download = 'provider-admin-snapshot.csv';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(href);
  };
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap items-center gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-white text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#7C5CFC]"/>Analytics & Reports</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Actual account status and game catalog snapshot, not simulated financial performance.</p></div>
      <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
        <Button size="sm" variant="cyan" onClick={exportCsv} disabled={!data} leftIcon={<Download className="w-4 h-4"/>}>Export Actual Counts CSV</Button></div>
    </div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading analytics…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {data && <>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card><h2 className="text-white font-semibold mb-2">Operator Approval Status</h2>
          <p className="text-[#98A5BF] text-xs mb-4">Current account counts ({data.operators.total} total)</p>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={operatorData} margin={{top:4,right:8,bottom:8,left:0}}>
            <CartesianGrid stroke="#233252" strokeDasharray="3 3"/><XAxis dataKey="status" tick={{fill:'#98A5BF',fontSize:11}}/>
            <YAxis allowDecimals={false} tick={{fill:'#98A5BF',fontSize:11}}/><Tooltip/><Bar dataKey="accounts" fill="#7C5CFC" radius={[5,5,0,0]}/>
          </BarChart></ResponsiveContainer></div></Card>
        <Card><h2 className="text-white font-semibold mb-2">Configured Game Catalog</h2>
          <p className="text-[#98A5BF] text-xs mb-4">Enabled by gameplay mode and disabled titles</p>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={gameData} margin={{top:4,right:8,bottom:8,left:0}}>
            <CartesianGrid stroke="#233252" strokeDasharray="3 3"/><XAxis dataKey="type" tick={{fill:'#98A5BF',fontSize:11}}/>
            <YAxis allowDecimals={false} tick={{fill:'#98A5BF',fontSize:11}}/><Tooltip/><Bar dataKey="games" fill="#00D4FF" radius={[5,5,0,0]}/>
          </BarChart></ResponsiveContainer></div></Card>
      </div>
      <Card><h2 className="text-white font-semibold">Financial reports unavailable</h2>
        <p className="text-sm text-[#98A5BF] mt-2">GMV, GGR, platform revenue, daily active users, API request history and time-series reporting need separate verified aggregation sources. No financial figures are calculated or shown here. Sandbox ledger activity is not real-money revenue.</p>
        <p className="text-xs text-[#64748B] mt-3">Data generated {new Date(data.generatedAt).toLocaleString()}</p></Card>
    </>}
  </div>;
};
