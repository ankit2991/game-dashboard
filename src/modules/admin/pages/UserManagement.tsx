import React, {useCallback, useState} from 'react';
import {Users, RefreshCw, Search, ShieldAlert} from 'lucide-react';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {Button} from '../../../components/ui/Button';

/** Account directory only. KYC, balance adjustments and user suspension are not implemented. */
export const UserManagement: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const fetchPage = useCallback((token: string, signal?: AbortSignal) => adminApi.players(token,20,offset,signal), [offset]);
  const {data, loading, error, reload} = useAdminPortalData(fetchPage);
  const visible = (data?.players || []).filter(player =>
    [player.username,player.email,player.displayName,player.id].some(value => value.toLowerCase().includes(search.toLowerCase())));
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-[#7C5CFC]"/>Registered B2C Players</h1>
        <p className="text-[#98A5BF] text-xs mt-2">Accounts read from the backend. Search filters this page only.</p></div>
      <Button size="sm" variant="outline" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    <div className="rounded-lg border border-[#233252] bg-[#121A2D] p-3 text-xs text-[#98A5BF] flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0"/>Account editing, KYC decisions, suspension and balance changes are not supported by this API and are intentionally unavailable.</div>
    <input aria-label="Search current player page" placeholder="Search this page of accounts" className="bg-[#0B1020] border border-[#233252] rounded-lg px-3 py-2.5 text-white text-sm w-full max-w-sm" value={search} onChange={e=>setSearch(e.target.value)} />
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading player accounts from backend…</p>}
    {error && <p role="alert" className="text-[#FF5D73]">{error}</p>}
    {!loading && data && <div className="rounded-xl border border-[#233252] bg-[#121A2D] overflow-x-auto">
      <table className="w-full text-left text-sm"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr><th className="p-3">Username</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Locale</th><th className="p-3">Created</th></tr></thead>
        <tbody className="text-[#CDD6E8]">{visible.map(player=><tr key={player.id} className="border-b border-[#233252]/50"><td className="p-3 text-white">{player.username}</td><td className="p-3">{player.displayName}</td><td className="p-3">{player.email}</td><td className="p-3">{player.locale}</td><td className="p-3">{new Date(player.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
      {!visible.length && <p className="text-[#98A5BF] text-sm p-4">No matching accounts on this page.</p>}
    </div>}
    {data && <div className="flex items-center gap-3 justify-between text-xs text-[#98A5BF]">
      <span>{data.total} registered players · {data.total ? offset+1 : 0}–{Math.min(offset+20,data.total)}</span>
      <div className="flex gap-2"><Button size="sm" variant="outline" disabled={loading || offset===0} onClick={()=>setOffset(n=>Math.max(0,n-20))}>Previous</Button><Button size="sm" variant="outline" disabled={loading || offset+20>=data.total} onClick={()=>setOffset(n=>n+20)}>Next</Button></div>
    </div>}
  </div>;
};
