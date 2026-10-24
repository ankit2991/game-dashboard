import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Coins,
  Calendar
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockTransactions } from '../../../data/mock/adminData';

export const OperatorTransactions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const operatorTxs = mockTransactions.filter((tx) => tx.operatorId === 'op_asia_gaming');

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#00D4FF] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-[#00D4FF]" />
            Operator Gameplay Volume & GGR
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Real-time feed of player bets, payouts, and monthly revenue share settlements for Asia Gaming Ltd.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => showToast('Operator transaction CSV exported.')}
        >
          Export Statement
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Tx Identifier</th>
                <th className="py-3 px-3">Player ID</th>
                <th className="py-3 px-3">Game Title</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {operatorTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">{tx.id}</td>
                  <td className="py-3 px-3 text-[#00D4FF] font-mono">{tx.userId}</td>
                  <td className="py-3 px-3 text-white font-medium">{tx.gameTitle}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      tx.type === 'win'
                        ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        : 'bg-[#7C5CFC]/15 text-[#A885FF] border-[#7C5CFC]/30'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={tx.type === 'win' ? 'text-[#20C997]' : 'text-white'}>
                      {tx.type === 'win' ? '+' : '-'} {tx.currency} {tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant="success" size="sm" dot>{tx.status}</Badge>
                  </td>
                  <td className="py-3 px-3 text-[#98A5BF] font-mono text-[11px]">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
