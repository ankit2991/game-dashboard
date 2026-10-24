import React from 'react';
import {Server, RefreshCw, ShieldAlert} from 'lucide-react';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {Button} from '../../../components/ui/Button';

/** The Game Provider is first-party. No upstream providers have an admin CRUD API. */
export const ProviderManagement:React.FC=()=>{
  const {data,loading,error,reload}=useAdminPortalData(adminApi.games);
  return <div className="space-y-5"><div className="flex items-center justify-between gap-3 border-b border-[#233252] pb-4">
    <div><h1 className="text-2xl text-white font-bold flex items-center gap-2"><Server className="text-[#00D4FF]"/>Game Provider Integration Status</h1><p className="text-[#98A5BF] text-xs mt-1">Real game catalog and per-game launch configuration from this backend.</p></div>
    <Button size="sm" variant="outline" onClick={()=>void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button></div>
    <div className="border border-[#233252] rounded-lg bg-[#121A2D] p-3 text-[#98A5BF] text-xs flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0"/>Upstream provider connections, latency tests and new-provider creation are not implemented. Enabling game launch requires server configuration and an end-to-end adapter test.</div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading games from backend…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {data && <div className="border border-[#233252] rounded-xl bg-[#121A2D] overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr><th className="p-3">Game</th><th className="p-3">Catalog</th><th className="p-3">Provider Launch</th><th className="p-3">Integration</th></tr></thead><tbody className="text-[#CDD6E8]">{data.games.map(game=><tr key={game.gameId} className="border-b border-[#233252]/50"><td className="p-3 text-white">{game.name}</td><td className="p-3">{game.enabled?'Enabled':'Disabled'}</td><td className="p-3">{game.providerLaunchAvailable?'Configured':'Not configured'}</td><td className="p-3">{game.integrationStatus}</td></tr>)}</tbody></table></div>}
  </div>;
};
