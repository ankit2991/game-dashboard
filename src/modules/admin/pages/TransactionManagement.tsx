import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Coins,
  CreditCard,
  Building2,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { mockTransactions, mockOperators } from '../../../data/mock/adminData';
import type { Transaction, TransactionType, TransactionStatus } from '../../../types';

export const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.userName && tx.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.operatorName && tx.operatorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.gameTitle && tx.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#20C997] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-[#20C997]" />
            Transaction Ledger & Financial Settlement
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Real-time feed of player bets, jackpot payouts, operator credit transfers, and multi-currency reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => showToast('Full ledger CSV exported.')}
          >
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Today's Bet Turnover</span>
          <p className="text-xl font-bold text-white font-display mt-1">$4,892,100</p>
          <span className="text-[10px] text-[#20C997]">↑ 14.8% vs yesterday</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Total Payouts Won</span>
          <p className="text-xl font-bold text-[#00D4FF] font-display mt-1">$4,681,200</p>
          <span className="text-[10px] text-[#98A5BF]">Net Margin ~4.3% GGR</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Pending Settlements</span>
          <p className="text-xl font-bold text-[#FFB547] font-display mt-1">1 Batch</p>
          <span className="text-[10px] text-[#FFB547]">SEPA & USDT clearing</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Reconciliation Health</span>
          <p className="text-xl font-bold text-[#20C997] font-display mt-1">100.0%</p>
          <span className="text-[10px] text-[#98A5BF]">Zero balance mismatch</span>
        </div>
      </div>

      {/* Filters and Table */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by Tx ID, Player, Game, or Ref code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#20C997] outline-none"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['all', 'bet', 'win', 'deposit', 'withdrawal', 'operator_settlement'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl uppercase font-medium transition-all whitespace-nowrap text-[11px] ${
                  typeFilter === t
                    ? 'bg-[#20C997] text-[#0B1020] font-bold shadow-sm'
                    : 'bg-[#0B1020] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Player / Context</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3">Game / Detail</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#98A5BF]">
                    No transactions matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#182238]/60 transition-colors">
                    {/* Tx ID */}
                    <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">
                      {tx.id}
                    </td>

                    {/* Player */}
                    <td className="py-3 px-3 text-white">
                      {tx.userName ? (
                        <div>
                          <span className="font-semibold">{tx.userName}</span>
                          <span className="text-[10px] text-[#64748B] block font-mono">{tx.userId}</span>
                        </div>
                      ) : (
                        <span className="text-[#98A5BF] italic">Direct Gateway</span>
                      )}
                    </td>

                    {/* Operator */}
                    <td className="py-3 px-3 text-[#98A5BF]">
                      {tx.operatorName || 'Global Direct'}
                    </td>

                    {/* Game */}
                    <td className="py-3 px-3 text-white">
                      {tx.gameTitle ? (
                        <span className="font-medium text-[#A885FF]">{tx.gameTitle}</span>
                      ) : (
                        <span className="text-[#98A5BF]">{tx.paymentMethod || 'Settlement'}</span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                        tx.type === 'win'
                          ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                          : tx.type === 'bet'
                          ? 'bg-[#7C5CFC]/15 text-[#A885FF] border-[#7C5CFC]/30'
                          : tx.type === 'deposit'
                          ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30'
                          : tx.type === 'withdrawal'
                          ? 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30'
                          : 'bg-[#FF5D73]/15 text-[#FF5D73] border-[#FF5D73]/30'
                      }`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={tx.type === 'win' ? 'text-[#20C997]' : tx.type === 'bet' ? 'text-white' : 'text-[#00D4FF]'}>
                        {tx.type === 'win' ? '+' : tx.type === 'bet' ? '-' : ''}
                        {tx.currency} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        size="sm"
                        variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}
                        dot
                      >
                        {tx.status}
                      </Badge>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3 text-[#98A5BF] font-mono text-[11px]">
                      {tx.timestamp}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="p-1.5 rounded-lg text-[#98A5BF] hover:text-white hover:bg-[#182238] transition-colors"
                        title="View Audit Trail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Drawer Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title={`Transaction Audit: ${selectedTx.id}`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedTx(null)}>
              Dismiss
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#98A5BF]">Transaction ID:</span>
                <p className="font-mono font-bold text-white mt-0.5">{selectedTx.id}</p>
              </div>
              <div>
                <span className="text-[#98A5BF]">External Reference:</span>
                <p className="font-mono text-[#00D4FF] mt-0.5">{selectedTx.referenceId}</p>
              </div>
              <div>
                <span className="text-[#98A5BF]">Amount & Currency:</span>
                <p className="font-mono font-bold text-base text-[#20C997] mt-0.5">
                  {selectedTx.currency} {selectedTx.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-[#98A5BF]">Settlement Status:</span>
                <div className="mt-1">
                  <Badge variant="success" size="sm" dot>{selectedTx.status}</Badge>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="p-3.5 rounded-xl bg-[#182238] border border-[#233252]">
              <span className="font-semibold text-white block mb-2.5">Cryptographic Event Trail</span>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#20C997] mt-1" />
                  <div>
                    <p className="text-white font-medium">Provider Callback Confirmed</p>
                    <p className="text-[#98A5BF] text-[11px]">HMAC-SHA256 signature verified against provider public key.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00D4FF] mt-1" />
                  <div>
                    <p className="text-white font-medium">Wallet Balance Mutated</p>
                    <p className="text-[#98A5BF] text-[11px]">Ledger journal entry balanced with zero variance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
