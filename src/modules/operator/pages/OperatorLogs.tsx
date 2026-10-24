import React, { useState } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { operatorOperationsApi } from '../../../lib/api/operator';
import { useOperatorOperations } from '../../../lib/operator/useOperatorOperations';
const PAGE_SIZE = 20;
export const OperatorLogs: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const { data, error, loading, refresh } = useOperatorOperations(
    (token, signal) => operatorOperationsApi.logs(token, PAGE_SIZE, offset, signal), [offset]);
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-3 border-b border-[#233252] pb-4"><div>
      <h1 className="text-2xl text-white font-bold flex items-center gap-2"><Terminal className="text-[#00D4FF]"/>Wallet Activity</h1>
      <p className="text-[#98A5BF] text-xs mt-1">Read-only lifecycle events derived from the sandbox wallet ledger. Raw HTTP request logs, headers, latency and payloads are not recorded by this endpoint.</p>
    </div><Button size="sm" variant="outline" onClick={refresh}><RefreshCw className="w-4 h-4"/> Refresh</Button></div>
    <Card>{error && <p role="alert" className="text-[#FF5D73]">{error}</p>}
      {loading ? <p className="text-[#98A5BF]">Loading recorded activity…</p> : !data?.configured ? <p className="text-[#98A5BF]">Partner not provisioned. No ledger activity is available.</p> : !data.entries.length ? <p className="text-[#98A5BF]">No recorded wallet activity yet.</p> :
      <div className="overflow-x-auto"><table className="w-full text-xs text-white text-left"><thead className="text-[#98A5BF]"><tr>{['Transaction','Event','Game','Status','Updated at'].map(v => <th className="p-3" key={v}>{v}</th>)}</tr></thead><tbody>
        {data.entries.map(v => <tr className="border-t border-[#233252]" key={v.id}><td className="p-3 font-mono">{v.id}</td><td className="p-3">{v.type}</td><td className="p-3">{v.gameId}</td><td className="p-3">{v.status}</td><td className="p-3">{new Date(v.occurredAt).toLocaleString()}</td></tr>)}
      </tbody></table></div>}
      <div className="flex justify-between gap-2 items-center mt-4 text-[#98A5BF] text-xs"><span>{data?.total ?? 0} ledger entries</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={!offset || loading} onClick={() => setOffset(x => Math.max(0,x-PAGE_SIZE))}>Previous</Button><Button size="sm" variant="outline" disabled={loading || !data || offset+PAGE_SIZE >= data.total} onClick={() => setOffset(x => x+PAGE_SIZE)}>Next</Button></div></div>
    </Card>
  </div>;
};
