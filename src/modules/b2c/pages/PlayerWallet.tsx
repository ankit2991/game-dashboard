import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building2,
  Coins,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Copy,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockTransactions } from '../../../data/mock/adminData';
import type { Transaction } from '../../../types';

export const PlayerWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [walletBalance, setWalletBalance] = useState(8420.50);
  const [bonusBalance] = useState(250.00);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'crypto' | 'card' | 'ewallet'>('bank');
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200);
  const [bankName, setBankName] = useState('Maybank / CIMB');
  const [accountNumber, setAccountNumber] = useState('1140 2938 1092');
  const [accountHolder, setAccountHolder] = useState('Raymond Chen');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWalletBalance((prev) => prev + depositAmount);
      showToast(`Successfully deposited MYR ${depositAmount.toFixed(2)}! Funds are ready for play.`);
    }, 800);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > walletBalance) {
      showToast('Error: Withdrawal amount exceeds available balance.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWalletBalance((prev) => prev - withdrawAmount);
      showToast(`Withdrawal of MYR ${withdrawAmount.toFixed(2)} submitted. Scheduled for bank settlement.`);
    }, 800);
  };

  const recentTxs = mockTransactions.filter((tx) => tx.userId === 'usr_882194');

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
      <div className="pb-2 border-b border-[#233252]/60">
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
          <Wallet className="w-6 h-6 text-[#00D4FF]" />
          Player Wallet & Instant Cashier
        </h1>
        <p className="text-xs text-[#98A5BF] mt-1">
          Instant deposit via OpenBanking, USDT Crypto, and Credit Cards with zero platform processing fees.
        </p>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main Available Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#182238] to-[#121A2D] border border-[#00D4FF]/30 shadow-xl relative overflow-hidden">
          <span className="text-xs text-[#98A5BF] font-semibold uppercase tracking-wider block">
            Withdrawable Balance
          </span>
          <p className="text-3xl font-black font-mono text-white mt-2">
            <span className="text-[#00D4FF]">MYR</span> {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-[#20C997] mt-1 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Unlocked Real Money
          </span>
        </div>

        {/* Bonus Balance */}
        <div className="p-5 rounded-2xl bg-[#121A2D] border border-[#233252] shadow-xl">
          <span className="text-xs text-[#98A5BF] font-semibold uppercase tracking-wider block">
            Bonus Credits (Active Wagering)
          </span>
          <p className="text-3xl font-black font-mono text-[#A885FF] mt-2">
            MYR {bonusBalance.toFixed(2)}
          </p>
          <span className="text-[11px] text-[#98A5BF] mt-1 block">
            Wagering progress: 68% completed
          </span>
        </div>

        {/* Quick Total */}
        <div className="p-5 rounded-2xl bg-[#121A2D] border border-[#233252] shadow-xl">
          <span className="text-xs text-[#98A5BF] font-semibold uppercase tracking-wider block">
            Total Account Value
          </span>
          <p className="text-3xl font-black font-mono text-white mt-2">
            MYR {(walletBalance + bonusBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-[#00D4FF] mt-1 block">
            No withdrawal rollover lock
          </span>
        </div>
      </div>

      {/* Cashier Action Tabs (Deposit vs Withdraw) */}
      <div className="flex items-center gap-2 border-b border-[#233252] pb-1 text-sm font-bold">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'deposit'
              ? 'bg-[#00D4FF] text-[#0B1020] shadow-lg shadow-[#00D4FF]/20 font-display'
              : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Deposit Funds</span>
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'withdraw'
              ? 'bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/20 font-display'
              : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdrawal</span>
        </button>
      </div>

      {/* Tab 1: Deposit */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader
                title="Select Payment Method"
                subtitle="All deposit channels are instant with 0% gateway commission"
              />

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
                {[
                  { id: 'bank', label: 'Instant Bank / FPX', icon: Building2, tag: 'Instant' },
                  { id: 'crypto', label: 'USDT (TRC20 / ERC20)', icon: Coins, tag: '+5% Bonus' },
                  { id: 'card', label: 'Visa / Mastercard', icon: CreditCard, tag: 'Global' },
                  { id: 'ewallet', label: 'E-Wallet (GrabPay)', icon: Wallet, tag: 'Fast' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === m.id
                        ? 'bg-[#00D4FF]/10 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/10'
                        : 'bg-[#0B1020] border-[#233252] hover:border-[#2D3E66]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <m.icon className={`w-5 h-5 ${selectedMethod === m.id ? 'text-[#00D4FF]' : 'text-[#98A5BF]'}`} />
                      <span className="text-[10px] text-[#20C997] font-semibold">{m.tag}</span>
                    </div>
                    <span className="font-semibold text-white">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Preset Amounts & Custom Input */}
              <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-2">
                    Quick Preset Amounts
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[50, 100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2 rounded-xl font-mono font-bold text-xs transition-all ${
                          depositAmount === amt
                            ? 'bg-[#7C5CFC] text-white shadow-md'
                            : 'bg-[#0B1020] text-[#98A5BF] hover:text-white border border-[#233252]'
                        }`}
                      >
                        MYR {amt}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Custom Deposit Amount (MYR)"
                  type="number"
                  min="20"
                  max="50000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                  required
                />

                <Button
                  type="submit"
                  variant="cyan"
                  size="lg"
                  isLoading={isProcessing}
                  className="w-full text-sm font-display tracking-wide font-bold"
                >
                  Confirm & Deposit MYR {depositAmount.toFixed(2)}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Info Box */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-white text-sm font-display mb-2">Deposit Guarantee</h3>
              <ul className="space-y-2.5 text-xs text-[#98A5BF]">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#20C997] flex-shrink-0 mt-0.5" />
                  <span>256-bit SSL encrypted financial transactions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                  <span>Instant balance credit upon confirmation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Coins className="w-4 h-4 text-[#FFB547] flex-shrink-0 mt-0.5" />
                  <span>Crypto deposits receive 5% extra bonus chip credit.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Withdrawal */}
      {activeTab === 'withdraw' && (
        <Card className="max-w-xl">
          <CardHeader
            title="Request Instant Bank Payout"
            subtitle="Funds will be wired directly to your verified bank account within 15 minutes"
          />

          <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
            <Input
              label="Withdrawal Amount (MYR)"
              type="number"
              min="50"
              max={walletBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
              required
            />

            <Input
              label="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />

            <Input
              label="Account Holder Name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              required
            />

            <Input
              label="Bank Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              className="w-full text-sm font-display tracking-wide font-bold"
            >
              Submit Payout Request (MYR {withdrawAmount.toFixed(2)})
            </Button>
          </form>
        </Card>
      )}

      {/* Recent Cashier Transactions */}
      <Card>
        <CardHeader
          title="Recent Cashier Activity"
          subtitle="Latest deposits and withdrawals on your player profile"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {recentTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white text-[11px]">{tx.id}</td>
                  <td className="py-2.5 px-3 capitalize font-semibold text-[#00D4FF]">{tx.type}</td>
                  <td className="py-2.5 px-3 text-[#98A5BF]">{tx.paymentMethod || 'In-Game Wallet'}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                    {tx.currency} {tx.amount.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} size="sm" dot>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[#98A5BF] font-mono text-[11px]">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
