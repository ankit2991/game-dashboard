import React from 'react';
import {KeyRound, RefreshCw, ShieldAlert} from 'lucide-react';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {Button} from '../../../components/ui/Button';

/** No API key contents or management secrets are ever exposed to browser UI. */
export const ApiKeyManagement:React.FC=()=>{
  const {data,loading,error,reload}=useAdminPortalData(adminApi.operators);
  return <div className="space-y-5"><div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#233252] pb-4">
    <div><h1 className="text-2xl text-white font-bold flex gap-2 items-center"><KeyRound className="text-[#00D4FF]"/>Operator Credential Provisioning</h1><p className="text-[#98A5BF] text-xs mt-1">Read-only partner provisioning status from real operator accounts.</p></div><Button size="sm" variant="outline" onClick={()=>void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button></div>
    <div className="bg-[#121A2D] border border-[#233252] rounded-lg p-3 text-[#98A5BF] text-xs flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0"/>Creating, revealing, copying, rotating or revoking partner API keys is restricted to trusted server-to-server administration. No keys are exposed to React. Provisioned does not guarantee active integration.</div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading operator provisioning status…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {data && <div className="border border-[#233252] rounded-xl bg-[#121A2D] overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr><th className="p-3">Operator</th><th className="p-3">Email</th><th className="p-3">Approval</th><th className="p-3">Partner Credential</th></tr></thead><tbody className="text-[#CDD6E8]">{data.operators.map(op=><tr key={op.id} className="border-b border-[#233252]/50"><td className="p-3 text-white">{op.companyName}</td><td className="p-3">{op.email}</td><td className="p-3">{op.status}</td><td className="p-3">{op.partnerProvisioned?'Provisioned (secret hidden)':'Not provisioned'}</td></tr>)}</tbody></table>{!data.operators.length && <p className="p-4 text-[#98A5BF] text-sm">No operator accounts registered.</p>}</div>}
  </div>;
};
