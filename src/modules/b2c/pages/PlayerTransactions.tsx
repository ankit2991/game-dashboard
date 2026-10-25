import React, { useEffect, useMemo, useState } from 'react';
import { Coins, RefreshCw, Search, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useAuth } from '../../../context/AuthContext';
import { usePlayerTransactions } from '../../../lib/wallet/usePlayerWallet';
import { transactionAmountLabel, transactionOperationLabel, type PlayerWalletTransaction, type WalletOperation, type WalletTransactionStatus } from '../../../lib/wallet/walletModel';

export const PlayerTransactions: React.FC = () => {
  const { user } = useAuth();
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<'all' | WalletOperation>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | WalletTransactionStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PlayerWalletTransaction | null>(null);
  const { page, loading, error, refresh, pageSize } = usePlayerTransactions(offset, { operation: typeFilter, status: statusFilter });
  useEffect(() => { setOffset(0); setSelected(null); }, [user?.id]);
  // Operation and status filtering is server-side BEFORE pagination; text search is page-local.
  const visible = useMemo(() => (page?.transactions || []).filter(tx =>
    `${tx.transactionId} ${tx.gameId}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [page, search]);
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#233252]/60">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Coins className="w-6 h-6 text-[#7C5CFC]" /> Sandbox Transaction History</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Read-only game wallet ledger. No fabricated deposits, payouts, certification or bank receipts.</p></div>
      <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={refresh}>Refresh</Button>
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      {(['all', 'bet', 'win', 'refund', 'loss'] as const).map(t => <button key={t} type="button" onClick={() => { setTypeFilter(t); setOffset(0); setSelected(null); }}
        className={`px-3.5 py-2 rounded-xl text-xs capitalize font-semibold ${typeFilter === t ? 'bg-[#7C5CFC] text-white' : 'bg-[#121A2D] text-[#98A5BF] border border-[#233252]'}`}>{t === 'all' ? 'All activity' : t === 'loss' ? 'Bot loss (0 COIN)' : t}</button>)}
      <label htmlFor="wallet-transaction-status" className="text-xs text-[#98A5BF] font-semibold">Status</label>
      <select id="wallet-transaction-status" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as 'all' | WalletTransactionStatus); setOffset(0); setSelected(null); }}
        className="bg-[#121A2D] border border-[#233252] rounded-xl px-3 py-2 text-xs text-white">
        {(['all', 'succeeded', 'rejected', 'inflight', 'indeterminate'] as const).map(state => <option key={state} value={state}>{state === 'all' ? 'All statuses' : state}</option>)}
      </select>
      <label className="flex items-center gap-2 ml-auto bg-[#121A2D] border border-[#233252] rounded-xl px-3 py-2 text-[#98A5BF]"><Search className="w-4 h-4" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search this page" className="bg-transparent outline-none text-white text-xs w-40" /></label>
    </div>
    <p className="text-[11px] text-[#98A5BF]">Operation and status filters apply to all server records before pagination. Text search checks this page only. Pending or indeterminate transfers are not confirmed payments. Bot loss is a zero-value bookkeeping record, not a debit from your wallet. Values are shown in minor units because historical ledger entries do not include decimals.</p>
    <Card>
      {loading ? <p role="status" className="text-sm text-[#98A5BF] p-4">Loading backend transactions…</p>
        : error ? <p role="alert" className="text-sm text-[#FFB547] p-4">{error}</p>
        : !page?.configured ? <p className="text-sm text-[#98A5BF] p-4">B2C operator not configured. Set B2C_LAUNCH_PARTNER_ID on the backend to access the provider ledger.</p>
        : page.total === 0 ? <p className="text-sm text-[#98A5BF] p-4">No sandbox transactions match the selected operation and status for this account.</p>
        : <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="border-b border-[#233252] text-[#98A5BF] uppercase"><tr>
          <th className="p-3">Transaction</th><th className="p-3">Game</th><th className="p-3">Type</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3">Details</th>
        </tr></thead><tbody className="divide-y divide-[#233252]/60">{visible.map(tx => <tr key={tx.transactionId} className="hover:bg-[#182238]/60">
          <td className="p-3 font-mono text-white">{tx.transactionId.slice(0, 12)}…</td><td className="p-3 text-white">{tx.gameId}</td><td className="p-3">{transactionOperationLabel(tx.operation)}</td>
          <td className="p-3 font-mono text-[#00D4FF]">{transactionAmountLabel(tx)}</td>
          <td className={`p-3 font-semibold ${tx.status === 'succeeded' ? 'text-[#20C997]' : tx.status === 'rejected' ? 'text-[#FF5D73]' : 'text-[#FFB547]'}`}>{tx.status}</td>
          <td className="p-3 text-[#98A5BF]">{new Date(tx.createdAt).toLocaleString()}</td>
          <td className="p-3"><button type="button" title="Show details" aria-label="Show transaction details" onClick={() => setSelected(tx)}><Eye className="w-4 h-4 text-[#00D4FF]" /></button></td>
        </tr>)}</tbody></table>{!visible.length && <p className="text-xs text-[#98A5BF] p-4">No results on this page for the selected filters.</p>}</div>}
    </Card>
    {page && page.total > 0 && <div className="flex items-center justify-between gap-3 text-xs text-[#98A5BF]"><span>{Math.min(offset + 1, page.total)}–{Math.min(offset + pageSize, page.total)} of {page.total} matching entries</span>
      <div className="flex gap-2"><Button size="sm" variant="outline" disabled={loading || offset === 0} onClick={() => setOffset(x => Math.max(0, x - pageSize))}>Previous</Button>
        <Button size="sm" variant="outline" disabled={loading || offset + pageSize >= page.total || offset + pageSize > 10000} onClick={() => setOffset(x => x + pageSize)}>Next</Button></div></div>}
    {selected && <Modal isOpen={true} onClose={() => setSelected(null)} title="Provider ledger entry" maxWidth="md" footer={<Button size="sm" onClick={() => setSelected(null)}>Close</Button>}>
      <dl className="text-sm text-[#98A5BF] space-y-3 break-all">{[
        ['Transaction ID', selected.transactionId], ['Game', selected.gameId], ['Operation', transactionOperationLabel(selected.operation)],
        ['Amount', transactionAmountLabel(selected)], ['State', selected.status],
        ['Created', new Date(selected.createdAt).toLocaleString()], ['Last updated', new Date(selected.updatedAt).toLocaleString()],
      ].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 border-b border-[#233252] pb-2"><dt>{label}</dt><dd className="text-white font-mono">{value}</dd></div>)}</dl>
    </Modal>}
  </div>;
};
