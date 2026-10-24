import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowLeftRight, RefreshCw, Info } from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { usePlayerWallet, usePlayerTransactions } from '../../../lib/wallet/usePlayerWallet';
import { amountLabel } from '../../../lib/wallet/walletModel';

export const PlayerWallet: React.FC = () => {
  const { wallet, loading, error, refresh } = usePlayerWallet();
  const activity = usePlayerTransactions(0);
  return <div className="space-y-6">
    <div className="pb-3 border-b border-[#233252]/60 flex flex-wrap justify-between items-center gap-3">
      <div><h1 className="text-2xl font-bold text-white flex gap-2 items-center"><Wallet className="w-6 h-6 text-[#00D4FF]" /> Sandbox Wallet</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Read-only view of your account's provider ledger activity. No real-money services.</p></div>
      <Button variant="outline" size="sm" onClick={() => { refresh(); activity.refresh(); }} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-5 rounded-2xl bg-[#182238] border border-[#00D4FF]/30 space-y-2">
        <p className="text-xs text-[#98A5BF] font-semibold uppercase">Verified account balance</p>
        <p className="text-2xl font-black text-[#FFB547]">Not available</p>
        <p className="text-xs text-[#98A5BF]">The operator wallet owns this balance. Transaction history is not a substitute for its authoritative balance endpoint.</p>
      </div>
      <div className="p-5 rounded-2xl bg-[#121A2D] border border-[#233252] space-y-2">
        <p className="text-xs text-[#98A5BF] font-semibold uppercase">Provider sandbox</p>
        <p className="text-xl font-bold text-white">{loading ? 'Checking…' : error ? 'Unavailable' : wallet?.configured ? 'Operator configured' : 'Not configured'}</p>
        <p className="text-xs text-[#98A5BF]">{wallet?.configured ? 'Provider-ledger read is scoped to your account' : 'Requires B2C_LAUNCH_PARTNER_ID on the backend'}</p>
      </div>
    </div>
    {error && <Card><div role="alert" className="text-[#FFB547] text-sm">{error}</div></Card>}
    <Card><CardHeader title="Deposits & withdrawals" subtitle="Bank, card, crypto and cash withdrawal methods are not available in Sandbox" />
      <div className="flex gap-3 p-3 rounded-xl bg-[#182238] text-xs text-[#98A5BF] border border-[#233252]"><ShieldCheck className="w-5 h-5 shrink-0 text-[#20C997]" />
        This provider does not expose a player cashier API. No fake deposit or withdrawal buttons or simulated successful settlements are offered.
      </div>
    </Card>
    <Card><CardHeader title="Recent provider activity" subtitle="Only server-verified ledger entries tied to your B2C account" action={<Link to="/player/transactions" className="text-[#00D4FF] text-xs">View history →</Link>} />
      {activity.loading ? <p role="status" className="text-sm text-[#98A5BF]">Loading transactions…</p>
        : activity.error ? <p role="alert" className="text-sm text-[#FFB547]">{activity.error}</p>
        : !activity.page?.configured ? <p className="text-sm text-[#98A5BF]">B2C provider operator is not configured yet.</p>
        : !activity.page.transactions.length ? <p className="text-sm text-[#98A5BF]">No provider wallet transactions recorded for this account.</p>
        : <div className="space-y-2">{activity.page.transactions.slice(0, 5).map(tx => <div key={tx.transactionId} className="flex justify-between items-center p-3 rounded-xl bg-[#121A2D] border border-[#233252] gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0"><ArrowLeftRight className="w-4 h-4 shrink-0 text-[#00D4FF]" /><span className="text-white truncate">{tx.gameId} · {tx.operation} · {tx.status}</span></div>
          <span className="font-mono text-[#98A5BF] shrink-0">{amountLabel(tx.amountMinor, tx.currency)}</span>
        </div>)}</div>}
    </Card>
    <div className="flex items-start gap-2 text-xs text-[#98A5BF]"><Info className="w-4 h-4 shrink-0" /> Demo games run outside the provider ledger; their local balances and gameplay do not appear here.</div>
  </div>;
};
