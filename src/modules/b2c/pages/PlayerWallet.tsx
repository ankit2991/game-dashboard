import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ShieldCheck,
  ArrowLeftRight,
  RefreshCw,
  TrendingUp,
  Send,
  Smartphone,
  Building2,
  CheckCircle2,
  DollarSign,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { usePlayerWallet, usePlayerTransactions } from '../../../lib/wallet/usePlayerWallet';
import { transactionAmountLabel, transactionOperationLabel } from '../../../lib/wallet/walletModel';

interface CashierTransaction {
  id: string;
  type: 'advance' | 'transfer' | 'deposit';
  method: string;
  amount: number;
  fee: string;
  recipientOrRef: string;
  status: 'completed' | 'processing';
  timestamp: string;
}

const STORAGE_KEY_BALANCE = 'nexus_player_available_balance';
const STORAGE_KEY_TRANSACTIONS = 'nexus_player_transactions';

const INITIAL_TRANSACTIONS: CashierTransaction[] = [
  {
    id: 'TX-ADV-9821',
    type: 'advance',
    method: 'Instant Advance',
    amount: 250,
    fee: '10 MYR',
    recipientOrRef: 'Wallet Advance Credit',
    status: 'completed',
    timestamp: 'Today, 02:45 PM'
  },
  {
    id: 'TX-TRF-6412',
    type: 'transfer',
    method: 'Touch and Go',
    amount: 150,
    fee: 'Free',
    recipientOrRef: '+60 12-883 9122',
    status: 'completed',
    timestamp: 'Yesterday, 07:15 PM'
  },
  {
    id: 'TX-TRF-5390',
    type: 'transfer',
    method: 'Merchant Trade',
    amount: 300,
    fee: 'Free',
    recipientOrRef: 'MTR-88219-ASIA',
    status: 'completed',
    timestamp: '22 Oct 2026, 11:30 AM'
  },
  {
    id: 'TX-DEP-1049',
    type: 'deposit',
    method: 'Instant FPX Bank',
    amount: 1000,
    fee: 'Free',
    recipientOrRef: 'Maybank2u Gateway',
    status: 'completed',
    timestamp: '20 Oct 2026, 09:12 AM'
  }
];

export const PlayerWallet: React.FC = () => {
  const { wallet: backendWallet, loading: backendLoading, refresh: refreshBackend } = usePlayerWallet();
  const activity = usePlayerTransactions(0);

  // Balance initialized to 1000 as in user example (or persisted balance)
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 1000;
  });

  // Available advance is strictly 50% of available balance in wallet
  const availableAdvance = Math.floor(availableBalance * 0.5);

  // Tabs: 'advance' | 'transfer' | 'deposit'
  const [activeTab, setActiveTab] = useState<'advance' | 'transfer' | 'deposit'>('advance');

  // Advance Form State
  const [advanceAmount, setAdvanceAmount] = useState<number>(250);
  const ADVANCE_FEE = 10; // 10 MYR per transaction

  // Transfer Form State
  const [transferOption, setTransferOption] = useState<'merchant' | 'touch_and_go'>('touch_and_go');
  const [transferAmount, setTransferAmount] = useState<number>(100);
  // Merchant Trade Fields
  const [merchantId, setMerchantId] = useState('MTR-88219-ASIA');
  const [merchantName, setMerchantName] = useState('Pacific Gaming Trade Partner');
  const [merchantNote, setMerchantNote] = useState('');
  // Touch and Go Fields
  const [tngPhone, setTngPhone] = useState('+60 12-883 9122');
  const [tngName, setTngName] = useState('Raymond Chen');
  const [tngNote, setTngNote] = useState('');

  // Deposit State
  const [depositAmount, setDepositAmount] = useState<number>(500);

  // UI Processing & Modals
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalDetails, setModalDetails] = useState<{
    title: string;
    amount: number;
    fee: string;
    newBalance: number;
    method: string;
    reference: string;
  } | null>(null);

  // Transactions list
  const [transactions, setTransactions] = useState<CashierTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback to initial
        }
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Sync balance to localStorage and notify app headers
  const updateBalanceState = (newBalance: number) => {
    const formatted = Math.max(0, parseFloat(newBalance.toFixed(2)));
    setAvailableBalance(formatted);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_BALANCE, formatted.toString());
      window.dispatchEvent(new Event('wallet-balance-updated'));
    }
  };

  const addTransaction = (tx: CashierTransaction) => {
    setTransactions(prev => {
      const updated = [tx, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated.slice(0, 50)));
      }
      return updated;
    });
  };

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Advance Submission
  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advanceAmount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid advance amount.', 'info');
      return;
    }
    if (advanceAmount > availableAdvance) {
      showToast('Limit Exceeded', `Maximum available advance is MYR ${availableAdvance.toFixed(2)} (50% of available balance).`, 'info');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // User A has 1000 balance -> available advance 500 -> clicks 250 advance -> available balance becomes 1250!
      const newBal = availableBalance + advanceAmount;
      updateBalanceState(newBal);

      const refId = `TX-ADV-${Math.floor(1000 + Math.random() * 9000)}`;
      addTransaction({
        id: refId,
        type: 'advance',
        method: 'Instant Advance',
        amount: advanceAmount,
        fee: `${ADVANCE_FEE} MYR`,
        recipientOrRef: 'Wallet Advance Credit',
        status: 'completed',
        timestamp: 'Just now'
      });

      setIsProcessing(false);
      setModalDetails({
        title: 'Advance Approved & Credited',
        amount: advanceAmount,
        fee: `${ADVANCE_FEE} MYR per transaction`,
        newBalance: newBal,
        method: 'Instant Advance',
        reference: refId
      });
      setShowSuccessModal(true);
      showToast('Advance Added', `MYR ${advanceAmount.toFixed(2)} credited to your wallet balance.`);
    }, 700);
  };

  // Handle Transfer Submission
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid transfer amount.', 'info');
      return;
    }
    if (transferAmount > availableBalance) {
      showToast('Insufficient Balance', `Transfer amount cannot exceed your available balance of MYR ${availableBalance.toFixed(2)}.`, 'info');
      return;
    }

    const methodName = transferOption === 'touch_and_go' ? 'Touch and Go' : 'Merchant Trade';
    const recipient = transferOption === 'touch_and_go' ? tngPhone : merchantId;

    setIsProcessing(true);
    setTimeout(() => {
      const newBal = availableBalance - transferAmount;
      updateBalanceState(newBal);

      const refId = `TX-TRF-${Math.floor(1000 + Math.random() * 9000)}`;
      addTransaction({
        id: refId,
        type: 'transfer',
        method: methodName,
        amount: transferAmount,
        fee: 'Free',
        recipientOrRef: recipient,
        status: 'completed',
        timestamp: 'Just now'
      });

      setIsProcessing(false);
      setModalDetails({
        title: `Transfer to ${methodName} Successful`,
        amount: transferAmount,
        fee: 'Free',
        newBalance: newBal,
        method: methodName,
        reference: refId
      });
      setShowSuccessModal(true);
      showToast('Transfer Sent', `MYR ${transferAmount.toFixed(2)} successfully sent to ${methodName}.`);
    }, 700);
  };

  // Handle Deposit Submission
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newBal = availableBalance + depositAmount;
      updateBalanceState(newBal);

      const refId = `TX-DEP-${Math.floor(1000 + Math.random() * 9000)}`;
      addTransaction({
        id: refId,
        type: 'deposit',
        method: 'DuitNow / FPX Bank',
        amount: depositAmount,
        fee: 'Free',
        recipientOrRef: 'Direct Cashier Top-Up',
        status: 'completed',
        timestamp: 'Just now'
      });

      setIsProcessing(false);
      setModalDetails({
        title: 'Deposit Completed',
        amount: depositAmount,
        fee: 'Free',
        newBalance: newBal,
        method: 'DuitNow / FPX Bank',
        reference: refId
      });
      setShowSuccessModal(true);
      showToast('Deposit Added', `MYR ${depositAmount.toFixed(2)} has been added to your balance.`);
    }, 600);
  };

  // Reset wallet demo data to default 1000 MYR
  const handleResetDemoBalance = () => {
    updateBalanceState(1000);
    setAdvanceAmount(250);
    setTransferAmount(100);
    showToast('Reset Complete', 'Available balance reset to default MYR 1,000.00.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#121A2D] border border-[#20C997] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-[#20C997]/20 text-[#20C997] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-[#20C997]">{toastMessage.title}</p>
            <p className="text-[11px] text-[#98A5BF]">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-3 border-b border-[#233252]/60 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex gap-2.5 items-center">
            <Wallet className="w-6 h-6 text-[#00D4FF]" /> Player Wallet & Cashier
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Manage your available balance, instant cash advance, and transfers via Touch 'n Go or Merchant Trade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDemoBalance}
            title="Reset balance to MYR 1,000.00 demo state"
          >
            Reset (MYR 1,000)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refreshBackend();
              showToast('Refreshed', 'Wallet balance and limits synchronized.');
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
        </div>
      </div>

      {/* Main Balances Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Available Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#182238] via-[#1A2640] to-[#121A2D] border border-[#2D3E66] relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#98A5BF] flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#00D4FF]" /> Available Balance
            </span>
            <Badge variant="cyan" size="sm" dot>Active Wallet</Badge>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm font-bold text-[#00D4FF]">MYR</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
              {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#233252]/80 text-[11px] text-[#98A5BF]">
            <span>Verified player cashier balance</span>
            <span className="text-[#20C997] font-semibold">100% Usable for Gameplay</span>
          </div>
        </div>

        {/* Card 2: Available Advance (Requirement: it must show "available advance : amount") */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#171D38] to-[#121A2D] border border-[#7C5CFC]/50 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C5CFC]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A885FF] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FFB547]" /> Cash Advance Feature
            </span>
            <span className="text-[11px] font-bold text-[#FFB547] bg-[#FFB547]/15 px-2 py-0.5 rounded-full border border-[#FFB547]/30">
              50% of Wallet Balance
            </span>
          </div>

          {/* Explicit label: "available advance : amount" */}
          <div className="mb-2">
            <p className="text-xs font-bold text-[#A885FF] uppercase tracking-wide">Available Advance :</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm font-bold text-[#FFB547]">MYR</span>
              <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                {availableAdvance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#7C5CFC]/30 text-[11px] text-[#98A5BF]">
            <span>Fee: <strong className="text-white">10 MYR</strong> per transaction</span>
            <button
              onClick={() => {
                setActiveTab('advance');
                setAdvanceAmount(Math.min(250, availableAdvance));
              }}
              className="text-[#00D4FF] hover:underline font-bold flex items-center gap-1"
            >
              Get Advance Now →
            </button>
          </div>
        </div>
      </div>

      {/* Main Action Tabs: Advance | Transfer | Deposit */}
      <div className="bg-[#121A2D] border border-[#233252] rounded-3xl p-1.5 flex gap-1 text-xs">
        <button
          onClick={() => setActiveTab('advance')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'advance'
              ? 'bg-gradient-to-r from-[#7C5CFC] to-[#6947eb] text-white shadow-lg shadow-[#7C5CFC]/30'
              : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
          }`}
        >
          <Zap className="w-4 h-4 text-[#FFB547]" />
          <span>Advance</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md hidden sm:inline">50% Available</span>
        </button>

        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'transfer'
              ? 'bg-gradient-to-r from-[#00D4FF] to-[#00B4D8] text-[#0B1020] shadow-lg shadow-[#00D4FF]/30'
              : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Transfer</span>
          <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-md hidden sm:inline">Merchant / TNG</span>
        </button>

        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'deposit'
              ? 'bg-[#182238] text-white border border-[#2D3E66]'
              : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#20C997]" />
          <span>Deposit Top-Up</span>
        </button>
      </div>

      {/* Tab 1: ADVANCE PANEL */}
      {activeTab === 'advance' && (
        <Card className="border-[#7C5CFC]/40 shadow-2xl bg-gradient-to-b from-[#151B2E] to-[#121A2D]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-[#233252]/80">
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFB547]" /> Cashier Advance
              </h2>
              <p className="text-xs text-[#98A5BF] mt-0.5">
                Instant credit up to 50% of your current wallet balance. Transaction fee: 10 MYR per transaction.
              </p>
            </div>
            {/* Prominent requirement badge */}
            <div className="px-4 py-2 rounded-2xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/40 flex items-center gap-2">
              <span className="text-xs text-[#A885FF] font-semibold">available advance :</span>
              <span className="text-base font-bold font-mono text-[#FFB547]">
                MYR {availableAdvance.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleAdvanceSubmit} className="space-y-6 pt-5">
            {/* Rule Explainer Box with User's Example */}
            <div className="p-4 rounded-2xl bg-[#182238] border border-[#2D3E66] text-xs space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Info className="w-4 h-4 text-[#00D4FF]" />
                <span>How Advance Works:</span>
              </div>
              <ul className="space-y-1 text-[#98A5BF] pl-5 list-disc">
                <li>You can advance up to <strong className="text-white">50%</strong> of your available balance.</li>
                <li>Each advance incurs a <strong className="text-[#FFB547]">10 MYR</strong> per transaction fee.</li>
                <li>
                  <strong className="text-white">Example:</strong> If your available balance is 1,000 MYR, your available advance is 500 MYR. When you click 250 to advance, your available balance becomes <strong className="text-[#20C997]">1,250 MYR</strong>.
                </li>
              </ul>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-2.5">
                Quick Preset Amounts
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: '25% Advance', value: Math.floor(availableAdvance * 0.25) },
                  { label: '50% (MYR 250)', value: Math.min(250, availableAdvance) },
                  { label: '75% Advance', value: Math.floor(availableAdvance * 0.75) },
                  { label: 'Max (100%)', value: availableAdvance }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAdvanceAmount(preset.value)}
                    disabled={preset.value <= 0}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      advanceAmount === preset.value && preset.value > 0
                        ? 'bg-[#7C5CFC] text-white border-[#7C5CFC] shadow-lg shadow-[#7C5CFC]/25 font-bold'
                        : 'bg-[#182238] text-[#98A5BF] hover:text-white border-[#233252] hover:border-[#2D3E66]'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span className="block text-[11px] font-medium">{preset.label}</span>
                    <span className="block text-sm font-mono font-bold mt-0.5 text-white">
                      MYR {preset.value.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-1.5">
              <Input
                label="Custom Advance Amount (MYR)"
                type="number"
                min="10"
                max={availableAdvance}
                step="1"
                value={advanceAmount || ''}
                onChange={(e) => setAdvanceAmount(Math.min(availableAdvance, parseFloat(e.target.value) || 0))}
                required
              />
              <div className="flex justify-between items-center text-[11px] text-[#98A5BF]">
                <span>Min: MYR 10.00</span>
                <span>Max Available Advance: <strong className="text-[#FFB547]">MYR {availableAdvance.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Calculation Preview Summary */}
            <div className="p-4 rounded-2xl bg-[#0B1020]/80 border border-[#233252] space-y-2 text-xs">
              <div className="flex justify-between text-[#98A5BF]">
                <span>Current Available Balance:</span>
                <span className="font-mono text-white">MYR {availableBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#20C997] font-semibold">
                <span>Requested Advance Credit:</span>
                <span className="font-mono">+ MYR {advanceAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#FFB547]">
                <span>Transaction Processing Fee:</span>
                <span className="font-mono">10 MYR per transaction</span>
              </div>
              <div className="pt-2 border-t border-[#233252] flex justify-between text-sm font-bold">
                <span className="text-white">New Available Balance:</span>
                <span className="font-mono text-[#00D4FF]">
                  MYR {(availableBalance + advanceAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#A885FF]">
                <span>New Available Advance Limit:</span>
                <span className="font-mono">
                  MYR {((availableBalance + advanceAmount) * 0.5).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              disabled={advanceAmount <= 0 || advanceAmount > availableAdvance}
              className="w-full text-sm font-bold tracking-wide"
            >
              Confirm & Advance MYR {advanceAmount.toFixed(2)}
            </Button>
          </form>
        </Card>
      )}

      {/* Tab 2: TRANSFER PANEL (Withdraw changed to Transfer with 2 options) */}
      {activeTab === 'transfer' && (
        <Card className="border-[#00D4FF]/40 shadow-2xl bg-gradient-to-b from-[#151B2E] to-[#121A2D]">
          <div className="pb-4 border-b border-[#233252]/80">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#00D4FF]" /> Transfer Wallet Funds
            </h2>
            <p className="text-xs text-[#98A5BF] mt-0.5">
              Select your transfer destination (Merchant Trade or Touch 'n Go), enter the amount, and submit.
            </p>
          </div>

          <form onSubmit={handleTransferSubmit} className="space-y-6 pt-5">
            {/* 2 Options Selection: Merchant Trade OR Touch and Go */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-2.5">
                Select Transfer Destination (2 Options)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Merchant Trade */}
                <button
                  type="button"
                  onClick={() => setTransferOption('merchant')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    transferOption === 'merchant'
                      ? 'bg-[#00D4FF]/10 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/15 ring-1 ring-[#00D4FF]'
                      : 'bg-[#182238] border-[#233252] hover:border-[#2D3E66]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transferOption === 'merchant' ? 'bg-[#00D4FF] text-[#0B1020]' : 'bg-[#233252] text-[#98A5BF]'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm">Merchant Trade</p>
                      <span className="text-[10px] text-[#00D4FF] font-semibold bg-[#00D4FF]/15 px-2 py-0.5 rounded-md">
                        B2B Settlement
                      </span>
                    </div>
                    <p className="text-xs text-[#98A5BF] mt-1 leading-snug">
                      Transfer directly to an authorized B2B Merchant Trade account.
                    </p>
                  </div>
                </button>

                {/* Option 2: Touch and Go */}
                <button
                  type="button"
                  onClick={() => setTransferOption('touch_and_go')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    transferOption === 'touch_and_go'
                      ? 'bg-[#00D4FF]/10 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/15 ring-1 ring-[#00D4FF]'
                      : 'bg-[#182238] border-[#233252] hover:border-[#2D3E66]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transferOption === 'touch_and_go' ? 'bg-[#00D4FF] text-[#0B1020]' : 'bg-[#233252] text-[#98A5BF]'
                  }`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm">Touch and Go</p>
                      <span className="text-[10px] text-[#20C997] font-semibold bg-[#20C997]/15 px-2 py-0.5 rounded-md">
                        TNG eWallet
                      </span>
                    </div>
                    <p className="text-xs text-[#98A5BF] mt-1 leading-snug">
                      Instant transfer to Touch 'n Go Malaysia registered mobile number.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Option-Specific Fields */}
            {transferOption === 'merchant' ? (
              <div className="p-4 rounded-2xl bg-[#182238]/70 border border-[#233252] space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00D4FF]" /> Merchant Trade Details:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Merchant Trade ID"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="e.g. MTR-88219-ASIA"
                    required
                  />
                  <Input
                    label="Merchant Name / Company"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="e.g. Pacific Gaming Partner"
                    required
                  />
                </div>
                <Input
                  label="Reference / Settlement Note (Optional)"
                  value={merchantNote}
                  onChange={(e) => setMerchantNote(e.target.value)}
                  placeholder="e.g. Trade batch #9041 settlement"
                />
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#182238]/70 border border-[#233252] space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00D4FF]" /> Touch and Go Account Details:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Touch and Go Mobile Number"
                    value={tngPhone}
                    onChange={(e) => setTngPhone(e.target.value)}
                    placeholder="e.g. +60 12-345 6789"
                    required
                  />
                  <Input
                    label="Account Holder Name"
                    value={tngName}
                    onChange={(e) => setTngName(e.target.value)}
                    placeholder="e.g. Raymond Chen"
                    required
                  />
                </div>
                <Input
                  label="Transfer Description (Optional)"
                  value={tngNote}
                  onChange={(e) => setTngNote(e.target.value)}
                  placeholder="e.g. Personal eWallet withdrawal"
                />
              </div>
            )}

            {/* Quick Amount Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-2.5">
                Quick Transfer Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[50, 100, 250, 500, availableBalance].map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTransferAmount(amt)}
                    disabled={amt > availableBalance}
                    className={`py-2 px-2 rounded-xl font-mono text-xs transition-all ${
                      transferAmount === amt
                        ? 'bg-[#00D4FF] text-[#0B1020] font-bold shadow-md'
                        : 'bg-[#182238] text-[#98A5BF] hover:text-white border border-[#233252]'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {idx === 4 ? `Max (MYR ${amt.toFixed(2)})` : `MYR ${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <Input
                label="Transfer Amount (MYR)"
                type="number"
                min="10"
                max={availableBalance}
                step="1"
                value={transferAmount || ''}
                onChange={(e) => setTransferAmount(Math.min(availableBalance, parseFloat(e.target.value) || 0))}
                required
              />
              <div className="flex justify-between items-center text-[11px] text-[#98A5BF]">
                <span>Min: MYR 10.00</span>
                <span>Max Available Balance: <strong className="text-white">MYR {availableBalance.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-[#0B1020]/80 border border-[#233252] space-y-2 text-xs">
              <div className="flex justify-between text-[#98A5BF]">
                <span>Selected Destination:</span>
                <span className="font-bold text-white capitalize">
                  {transferOption === 'touch_and_go' ? 'Touch and Go eWallet' : 'Merchant Trade'}
                </span>
              </div>
              <div className="flex justify-between text-[#FF5D73] font-semibold">
                <span>Transfer Amount:</span>
                <span className="font-mono">- MYR {transferAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#20C997]">
                <span>Transfer Processing Fee:</span>
                <span className="font-mono">FREE (0 MYR)</span>
              </div>
              <div className="pt-2 border-t border-[#233252] flex justify-between text-sm font-bold">
                <span className="text-white">Remaining Available Balance:</span>
                <span className="font-mono text-[#00D4FF]">
                  MYR {Math.max(0, availableBalance - transferAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={isProcessing}
              disabled={transferAmount <= 0 || transferAmount > availableBalance}
              className="w-full text-sm font-bold tracking-wide"
            >
              Confirm & Transfer to {transferOption === 'touch_and_go' ? 'Touch and Go' : 'Merchant'} (MYR {transferAmount.toFixed(2)})
            </Button>
          </form>
        </Card>
      )}

      {/* Tab 3: DEPOSIT TOP-UP PANEL */}
      {activeTab === 'deposit' && (
        <Card>
          <CardHeader
            title="Add Funds / Top-Up Wallet"
            subtitle="Instant FPX Online Banking, DuitNow QR, or USDT crypto deposit"
          />

          <form onSubmit={handleDepositSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    depositAmount === amt
                      ? 'bg-[#20C997]/15 border-[#20C997] text-white font-bold'
                      : 'bg-[#182238] border-[#233252] text-[#98A5BF] hover:text-white'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">MYR {amt}</span>
                </button>
              ))}
            </div>

            <Input
              label="Deposit Amount (MYR)"
              type="number"
              min="20"
              max="50000"
              value={depositAmount || ''}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              className="w-full text-sm font-bold"
            >
              Deposit MYR {depositAmount.toFixed(2)}
            </Button>
          </form>
        </Card>
      )}

      {/* Cashier & Transactions Ledger */}
      <Card>
        <CardHeader
          title="Recent Cashier Activity"
          subtitle="Real-time record of all Advances, Transfers (Touch 'n Go & Merchant Trade), and Deposits"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Method / Destination</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Fee</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white text-[11px] flex items-center gap-2">
                    {tx.type === 'advance' && <ArrowDownLeft className="w-3.5 h-3.5 text-[#FFB547]" />}
                    {tx.type === 'transfer' && <ArrowUpRight className="w-3.5 h-3.5 text-[#00D4FF]" />}
                    {tx.type === 'deposit' && <ArrowDownLeft className="w-3.5 h-3.5 text-[#20C997]" />}
                    <span>{tx.id}</span>
                  </td>
                  <td className="py-3 px-4 uppercase font-bold text-[11px]">
                    {tx.type === 'advance' && (
                      <span className="text-[#FFB547] bg-[#FFB547]/10 px-2 py-0.5 rounded-md border border-[#FFB547]/20">
                        Advance
                      </span>
                    )}
                    {tx.type === 'transfer' && (
                      <span className="text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-md border border-[#00D4FF]/20">
                        Transfer
                      </span>
                    )}
                    {tx.type === 'deposit' && (
                      <span className="text-[#20C997] bg-[#20C997]/10 px-2 py-0.5 rounded-md border border-[#20C997]/20">
                        Deposit
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{tx.method}</span>
                    <span className="text-[10px] text-[#98A5BF] font-mono">{tx.recipientOrRef}</span>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                    tx.type === 'transfer' ? 'text-[#FF5D73]' : 'text-[#20C997]'
                  }`}>
                    {tx.type === 'transfer' ? '-' : '+'} MYR {tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[11px] text-[#98A5BF]">
                    {tx.fee}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} size="sm" dot>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-[#98A5BF] font-mono text-[11px]">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provider Sandbox Ledger */}
      {activity.page?.transactions && activity.page.transactions.length > 0 && (
        <Card>
          <CardHeader
            title="Provider Sandbox Ledger"
            subtitle="Verified backend game round transactions"
            action={<Link to="/player/transactions" className="text-[#00D4FF] text-xs">View all →</Link>}
          />
          <div className="space-y-2">
            {activity.page.transactions.slice(0, 5).map((tx) => (
              <div key={tx.transactionId} className="flex justify-between items-center p-3 rounded-xl bg-[#121A2D] border border-[#233252] text-xs">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span className="text-white font-medium">{tx.gameId} · {transactionOperationLabel(tx.operation)}</span>
                </div>
                <span className="font-mono text-[#98A5BF]">{transactionAmountLabel(tx)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Success Modal */}
      {showSuccessModal && modalDetails && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={modalDetails.title}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#182238] border border-[#20C997]/40 text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#20C997]/20 text-[#20C997] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xl font-black font-mono text-white">
                MYR {modalDetails.amount.toFixed(2)}
              </p>
              <p className="text-xs text-[#20C997] font-semibold">{modalDetails.method}</p>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-[#0B1020] border border-[#233252] text-xs">
              <div className="flex justify-between text-[#98A5BF]">
                <span>Reference ID:</span>
                <span className="font-mono text-white">{modalDetails.reference}</span>
              </div>
              <div className="flex justify-between text-[#98A5BF]">
                <span>Fee Charged:</span>
                <span className="font-mono text-white">{modalDetails.fee}</span>
              </div>
              <div className="flex justify-between text-[#98A5BF] pt-2 border-t border-[#233252]">
                <span className="font-bold text-white">New Available Balance:</span>
                <span className="font-mono font-bold text-[#00D4FF]">
                  MYR {modalDetails.newBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#A885FF] text-[11px]">
                <span>New Available Advance:</span>
                <span className="font-mono">
                  MYR {(modalDetails.newBalance * 0.5).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full text-xs font-bold"
              onClick={() => setShowSuccessModal(false)}
            >
              Done & Return to Wallet
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
