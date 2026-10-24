import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  Coins,
  TrendingUp,
  Trophy,
  ShieldCheck,
  Edit2,
  Play,
  Heart,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Plus
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { mockGames } from '../../../data/mock/gamesData';
import { mockTransactions } from '../../../data/mock/adminData';

export const PlayerOverview: React.FC = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Raymond Chen');
  const [playerEmail, setPlayerEmail] = useState('raymond.chen@gmail.com');
  const [playerPhone, setPlayerPhone] = useState('+60 17-882 1940');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    showToast('Profile information saved successfully.');
  };

  const favoriteGames = mockGames.slice(0, 3);
  const playerTxs = mockTransactions.filter((tx) => tx.userId === 'usr_882194').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#20C997] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#182238] via-[#1F2C49] to-[#182238] border border-[#2D3E66] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80"
            alt="Raymond"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-[#7C5CFC]/40 shadow-2xl flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">{playerName}</h1>
              <Badge variant="success" size="sm" dot>Verified KYC</Badge>
            </div>
            <p className="text-xs text-[#00D4FF] font-mono mt-0.5">@raymond_vip99 • Member since August 2023</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#7C5CFC]/20 text-[#A885FF] border border-[#7C5CFC]/40 font-semibold">
                VIP Platinum Level 4
              </span>
              <span className="text-[11px] text-[#98A5BF]">Next Tier: 72% XP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
          <Link to="/player/wallet">
            <Button
              variant="cyan"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Deposit Funds
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Player Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#00D4FF]" /> Available Balance
          </span>
          <p className="text-2xl font-bold font-mono text-[#00D4FF] mt-1.5">MYR 8,420.50</p>
          <span className="text-[10px] text-[#20C997]">Withdrawable instantly</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#FFB547]" /> Total Wagered
          </span>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">MYR 142,800</p>
          <span className="text-[10px] text-[#98A5BF]">1,482 game spins</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#20C997]" /> Total Won
          </span>
          <p className="text-2xl font-bold font-mono text-[#20C997] mt-1.5">MYR 138,940</p>
          <span className="text-[10px] text-[#20C997]">97.3% Player RTP</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#A885FF]" /> Global Ranking
          </span>
          <p className="text-2xl font-bold font-mono text-white mt-1.5">#14</p>
          <span className="text-[10px] text-[#A885FF]">Top 1% Tournament</span>
        </div>
      </div>

      {/* Two Column Grid: Favorite Games & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Games Card */}
        <Card>
          <CardHeader
            title="My Favorite Games"
            subtitle="Quick launch your most played titles"
            action={
              <Link to="/games" className="text-xs text-[#00D4FF] hover:underline font-semibold">
                Explore More →
              </Link>
            }
          />

          <div className="space-y-3">
            {favoriteGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/play/${game.id}`)}
                className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] hover:border-[#7C5CFC]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-12 h-12 rounded-xl object-cover border border-[#2D3E66] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-xs truncate group-hover:text-[#00D4FF]">{game.title}</p>
                    <span className="text-[11px] text-[#98A5BF]">{game.providerName} • RTP: {game.rtp}%</span>
                  </div>
                </div>

                <Button variant="primary" size="sm" leftIcon={<Play className="w-3 h-3 fill-current" />}>
                  Play
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Game Activity Ledger */}
        <Card>
          <CardHeader
            title="Recent Activity & Game Spins"
            subtitle="Real-time session outcomes"
            action={
              <Link to="/player/transactions" className="text-xs text-[#00D4FF] hover:underline font-semibold">
                Full Statement →
              </Link>
            }
          />

          <div className="space-y-3">
            {playerTxs.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{tx.gameTitle || tx.type.toUpperCase()}</p>
                  <span className="text-[10px] text-[#64748B] font-mono">{tx.timestamp}</span>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-bold ${tx.type === 'win' ? 'text-[#20C997]' : 'text-white'}`}>
                    {tx.type === 'win' ? '+' : '-'} {tx.currency} {tx.amount.toFixed(2)}
                  </span>
                  <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} size="sm" className="ml-2">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Player Profile"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <Input
              label="Full Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={playerPhone}
              onChange={(e) => setPlayerPhone(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
