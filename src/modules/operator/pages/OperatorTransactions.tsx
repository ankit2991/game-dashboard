import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { operatorOperationsApi, type OperatorLedgerTx } from '../../../lib/api/operator';
import { useOperatorOperations } from '../../../lib/operator/useOperatorOperations';

const PAGE_SIZE = 20;
export const OperatorTransactions: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const { data, error, loading, refresh } = useOperatorOperations(
    (token, signal) => operatorOperationsApi.transactions(token, PAGE_SIZE, offset, signal), [offset]);
  const [search, setSearch] = useState('');
  const transactions = (data?.transactions || []).filter(tx =>
    [tx.transactionId, tx.playerId, tx.gameId, tx.operation, tx.status].some(x => x.toLowerCase().includes(search.toLowerCase())));
  const saveCsv = () => {
    if (!transactions.length) return;
    const cols: (keyof OperatorLedgerTx)[] = ['transactionId','playerId','gameId','operation','amountMinor','currency','status','createdAt'];
    const csv = [cols.join(','), ...transactions.map(tx => cols.map(key => `"${String(tx[key]).replaceAll('"','""')}"`).join(','))].join('\r\n');
    const href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = href; link.download = 'operator-sandbox-transactions.csv'; link.click(); URL.revokeObjectURL(href);
  };
  return <div className="space-y-6">
    <div className="flex justify-between items-start flex-wrap gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><ArrowLeftRight className="text-[#00D4FF]"/>Sandbox Transactions</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Recorded wallet ledger operations for your provisioned partner only. No live-money or GGR statements.</p></div>
      <div className="flex gap-2"><Button variant="outline" size="sm" onClick={refresh}><RefreshCw className="w-4 h-4"/> Refresh</Button>
        <Button variant="outline" size="sm" disabled={!transactions.length} onClick={saveCsv}>Export displayed CSV</Button></div>
    </div>
    <Card><input aria-label="Filter current page" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter current page" className="w-full max-w-sm rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2 mb-3 text-sm" />
      {error && <p role="alert" className="text-[#FF5D73]">{error}</p>}
      {loading ? <p className="text-[#98A5BF]">Loading transactions…</p> : !data?.configured ? <p className="text-[#98A5BF]">No partner has been provisioned. Transactions are unavailable until an administrator provisions the partner.</p> : !transactions.length ? <p className="text-[#98A5BF]">No recorded transactions on this page.</p> :
      <div className="overflow-x-auto"><table className="w-full text-xs text-left text-white"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr>{['ID','Player','Game','Operation','Amount (minor units)','Status','Timestamp'].map(x => <th key={x} className="p-3">{x}</th>)}</tr></thead>
        <tbody>{transactions.map(tx => <tr key={tx.transactionId} className="border-t border-[#233252]"><td className="p-3 font-mono">{tx.transactionId}</td><td className="p-3">{tx.playerId}</td><td className="p-3">{tx.gameId}</td><td className="p-3">{tx.operation}</td><td className="p-3 font-mono">{tx.amountMinor} {tx.currency}</td><td className="p-3">{tx.status}</td><td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
      <div className="flex justify-between items-center gap-3 pt-4 text-xs text-[#98A5BF]"><span>Showing {data ? Math.min(data.total, offset + 1) : 0}–{data ? Math.min(data.total, offset + PAGE_SIZE) : 0} of {data?.total ?? 0}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={!offset || loading} onClick={() => setOffset(v => Math.max(0,v-PAGE_SIZE))}>Previous</Button><Button size="sm" variant="outline" disabled={loading || !data || offset + PAGE_SIZE >= data.total} onClick={() => setOffset(v => v + PAGE_SIZE)}>Next</Button></div></div>
    </Card>
  </div>;
};
