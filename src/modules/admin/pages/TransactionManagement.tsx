import React, {useCallback, useState} from 'react';
import {ArrowLeftRight, RefreshCw, ShieldAlert} from 'lucide-react';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {Button} from '../../../components/ui/Button';

/** Read-only ledger snapshot: never show mock payments, balance, or reconciliation success. */
export const TransactionManagement: React.FC = () => {
  const [offset,setOffset]=useState(0);
  const fetchPage=useCallback((token:string, signal?:AbortSignal)=>adminApi.transactions(token,20,offset,signal),[offset]);
  const {data,loading,error,reload}=useAdminPortalData(fetchPage);
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex gap-2 items-center"><ArrowLeftRight className="text-[#20C997]"/>Sandbox Transaction Ledger</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Recorded wallet operations only. No live-money settlement or fake records.</p></div>
      <Button size="sm" variant="outline" onClick={()=>void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    <div className="rounded-lg border border-[#233252] p-3 text-[#98A5BF] text-xs flex gap-2 bg-[#121A2D]"><ShieldAlert className="w-4 h-4 shrink-0"/>These are sandbox ledger events, not proof of cash transfers. Financial adjustments and refunds from the admin browser are disabled.</div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Loading ledger from backend…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {data && !loading && <div className="border border-[#233252] rounded-xl bg-[#121A2D] overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr>{['Transaction','Partner','Game','Operation','Amount (minor units)','Status','Created'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead>
      <tbody className="text-[#CDD6E8]">{data.rows.map(tx=><tr key={tx.transaction_id} className="border-b border-[#233252]/50"><td className="p-3 break-all max-w-40">{tx.transaction_id}</td><td className="p-3">{tx.partner_id}</td><td className="p-3">{tx.game_id}</td><td className="p-3">{tx.operation}</td><td className="p-3">{tx.amount_minor} {tx.currency}</td><td className="p-3">{tx.status}</td><td className="p-3">{new Date(tx.created_ms).toLocaleString()}</td></tr>)}</tbody></table>
      {!data.rows.length && <p className="text-[#98A5BF] p-4 text-sm">No sandbox transactions have been recorded.</p>}</div>}
    {data && <div className="flex justify-between items-center text-[#98A5BF] text-xs"><span>{data.total} ledger entries · {data.total?offset+1:0}–{Math.min(offset+20,data.total)}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={loading||offset===0} onClick={()=>setOffset(n=>Math.max(0,n-20))}>Previous</Button><Button size="sm" variant="outline" disabled={loading||offset+20>=data.total} onClick={()=>setOffset(n=>n+20)}>Next</Button></div></div>}
  </div>;
};
