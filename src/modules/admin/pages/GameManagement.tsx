import React, {useMemo, useState} from 'react';
import {Gamepad2, Search, RefreshCw} from 'lucide-react';
import {Card} from '../../../components/ui/Card';
import {Badge} from '../../../components/ui/Badge';
import {Button} from '../../../components/ui/Button';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';

/** Catalog flags are environment-owned. UI never claims to save local-only toggles. */
export const GameManagement: React.FC = () => {
  const {data, error, loading, reload} = useAdminPortalData(adminApi.games);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all'|'enabled'|'disabled'>('all');
  const shown = useMemo(() => (data?.games || []).filter(g =>
    (filter === 'all' || (filter === 'enabled' ? g.enabled : !g.enabled)) &&
    `${g.name} ${g.gameId}`.toLowerCase().includes(query.toLowerCase())), [data,filter,query]);
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-white text-2xl font-bold flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-[#7C5CFC]"/>Game Catalog Management</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Current server configuration. Enable/disable games through protected Render environment settings and redeploy.</p></div>
      <Button size="sm" variant="outline" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading configured games…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {data && <><div className="grid grid-cols-3 gap-3">
      {([['Total',data.games.length],['Enabled',data.games.filter(g => g.enabled).length],['Disabled',data.games.filter(g => !g.enabled).length]] as const)
        .map(([name,count]) => <Card key={name}><p className="text-xs text-[#98A5BF]">{name}</p><p className="text-2xl text-white font-bold">{count}</p></Card>)}
    </div><Card><div className="flex flex-wrap gap-3 items-center mb-5">
      <div className="relative flex-1 min-w-44"><Search className="w-4 h-4 absolute top-2.5 left-3 text-[#98A5BF]"/>
        <input className="bg-[#0B1020] border border-[#233252] rounded-lg w-full pl-9 pr-3 py-2 text-sm text-white" placeholder="Search games" value={query} onChange={e => setQuery(e.target.value)}/></div>
      <select aria-label="Game enabled status" className="bg-[#0B1020] text-white border border-[#233252] rounded-lg p-2 text-sm" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
        <option value="all">All games</option><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select>
    </div><div className="overflow-x-auto"><table className="w-full text-left text-xs text-[#98A5BF]">
      <thead><tr className="border-b border-[#233252]"><th className="p-3">Game</th><th className="p-3">Mode</th><th className="p-3">Catalog</th><th className="p-3">Launch Configuration</th><th className="p-3">Demo URL</th></tr></thead>
      <tbody>{shown.map(g => <tr key={g.gameId} className="border-b border-[#233252]/60">
        <td className="p-3"><strong className="text-white">{g.name}</strong><div className="font-mono text-[11px]">{g.gameId}</div></td>
        <td className="p-3">{g.gameMode.replace('_',' ')}</td>
        <td className="p-3"><Badge variant={g.enabled?'success':'danger'}>{g.enabled?'Enabled':'Disabled'}</Badge></td>
        <td className="p-3">{g.providerLaunchAvailable ? 'Adapter configured (not verified live)' : 'Not connected'}</td>
        <td className="p-3">{g.demoUrl ? 'Configured' : 'Not configured'}</td>
      </tr>)}</tbody></table>{!shown.length && <p className="text-[#98A5BF] text-sm py-6 text-center">No matching games.</p>}</div></Card>
      <p className="text-xs text-[#FFB547]">Changes to enabled state, RTP and game rules are not supported through this admin API. No local-only edit or delete actions are presented.</p>
    </>}
  </div>;
};
