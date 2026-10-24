import React, { useState } from 'react';
import {
  Coins,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeftRight
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { mockTransactions } from '../../../data/mock/adminData';
import type { Transaction, TransactionType } from '../../../types';

export const PlayerTransactions: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const playerTxs = mockTransactions.filter((tx) => {
    const matchesUser = !tx.userId || tx.userId === 'usr_882194';
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.gameTitle && tx.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesUser && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-[#7C5CFC]" />
            Game Bets & Transaction History
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Complete record of your spins, multiplier cashouts, deposits, and withdrawal settlements.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => alert('Statement downloaded as CSV.')}
        >
          Download PDF Statement
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        {(['all', 'bet', 'win', 'deposit', 'withdrawal'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition-all whitespace-nowrap ${
              typeFilter === t
                ? 'bg-[#7C5CFC] text-white shadow-md'
                : 'bg-[#121A2D] text-[#98A5BF] hover:text-white border border-[#233252]'
            }`}
          >
            {t === 'all' ? 'All Transactions' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Game / Detail</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {playerTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">{tx.id}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      tx.type === 'win'
                        ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        : tx.type === 'bet'
                        ? 'bg-[#7C5CFC]/15 text-[#A885FF] border-[#7C5CFC]/30'
                        : 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white font-medium">
                    {tx.gameTitle || tx.paymentMethod || 'Wallet Transaction'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={tx.type === 'win' ? 'text-[#20C997]' : 'text-white'}>
                      {tx.type === 'win' ? '+' : tx.type === 'bet' ? '-' : ''}
                      {tx.currency} {tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant="success" size="sm" dot>{tx.status}</Badge>
                  </td>
                  <td className="py-3 px-3 text-[#98A5BF] font-mono text-[11px]">{tx.timestamp}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-1.5 rounded-lg text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                      title="Inspect Receipt"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title={`Receipt: ${selectedTx.id}`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedTx(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#98A5BF]">Reference Hash:</span>
                <span className="font-mono text-[#00D4FF]">{selectedTx.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A5BF]">Game / Title:</span>
                <span className="font-semibold text-white">{selectedTx.gameTitle || 'Direct Wallet'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A5BF]">Settlement Amount:</span>
                <span className="font-mono font-bold text-base text-[#20C997]">
                  {selectedTx.currency} {selectedTx.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98A5BF]">RNG Validation:</span>
                <span className="text-[#20C997]">Pass (eCOGRA Certified)</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
