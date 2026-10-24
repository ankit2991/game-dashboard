import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Search,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Coins,
  Crown
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  score: number;
  change: 'up' | 'down' | 'same';
  changeVal?: number;
  prize: string;
  isCurrentUser?: boolean;
}

export const B2CLeaderboard: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const entries: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'vikram_highroller',
      name: 'Vikram Sharma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      score: 489200,
      change: 'same',
      prize: '$15,000 Cash'
    },
    {
      rank: 2,
      username: 'sarah_spinqueen',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      score: 398200,
      change: 'up',
      changeVal: 2,
      prize: '$10,000 Cash'
    },
    {
      rank: 3,
      username: 'lucas_crash_king',
      name: 'Lucas Morel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      score: 312500,
      change: 'down',
      changeVal: 1,
      prize: '$5,000 Cash'
    },
    {
      rank: 4,
      username: 'apex_dragon',
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      score: 284100,
      change: 'up',
      changeVal: 3,
      prize: '$2,500'
    },
    {
      rank: 5,
      username: 'crypto_valkyrie',
      name: 'Freja Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      score: 241900,
      change: 'same',
      prize: '$1,500'
    },
    {
      rank: 14,
      username: 'raymond_vip99',
      name: 'Raymond Chen (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      score: 148200,
      change: 'up',
      changeVal: 4,
      prize: '$500 Bonus',
      isCurrentUser: true
    }
  ];

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="purple" size="md">Global Multiplier Tournament</Badge>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          $100,000 Grand Leaderboard
        </h1>
        <p className="text-xs text-[#98A5BF]">
          Spin on any slot or cashout on Spribe crash games. Highest total multiplier points win cash prizes!
        </p>

        {/* Period Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl capitalize font-bold text-xs transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF] text-white shadow-lg shadow-[#7C5CFC]/25'
                  : 'bg-[#182238] text-[#98A5BF] hover:text-white border border-[#233252]'
              }`}
            >
              {p} Tournament
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Player Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto items-end pt-8">
        {/* 2nd Place Podium */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182238] to-[#121A2D] border border-[#2D3E66] shadow-xl text-center relative order-2 md:order-1 flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={top3[1].avatar}
              alt={top3[1].name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#98A5BF] shadow-lg"
            />
            <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-[#98A5BF] text-[#0B1020] font-black font-display flex items-center justify-center text-xs shadow-md">
              2
            </div>
          </div>
          <h3 className="font-bold text-white text-sm font-display">{top3[1].name}</h3>
          <p className="text-[11px] text-[#A885FF] font-mono">@{top3[1].username}</p>
          <div className="mt-3 p-2 rounded-xl bg-[#0B1020] border border-[#233252] w-full">
            <span className="text-[10px] text-[#64748B] block">Multiplier Points</span>
            <span className="font-mono font-bold text-base text-white">{top3[1].score.toLocaleString()}</span>
          </div>
          <Badge variant="cyan" size="sm" className="mt-2.5">{top3[1].prize}</Badge>
        </div>

        {/* 1st Place Podium (Elevated Champion) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#7C5CFC]/30 via-[#182238] to-[#121A2D] border-2 border-[#FFB547] shadow-2xl text-center relative order-1 md:order-2 flex flex-col items-center transform md:-translate-y-4">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center text-[#FFB547]">
            <Crown className="w-8 h-8 fill-current animate-bounce" />
          </div>

          <div className="relative mb-3 mt-2">
            <img
              src={top3[0].avatar}
              alt={top3[0].name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#FFB547] shadow-2xl"
            />
            <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-[#FFB547] text-[#0B1020] font-black font-display flex items-center justify-center text-sm shadow-lg">
              1
            </div>
          </div>
          <h3 className="font-black text-white text-base font-display">{top3[0].name}</h3>
          <p className="text-[11px] text-[#FFB547] font-mono">@{top3[0].username}</p>
          <div className="mt-3 p-2.5 rounded-xl bg-[#0B1020] border border-[#233252] w-full">
            <span className="text-[10px] text-[#64748B] block">Tournament Champion</span>
            <span className="font-mono font-bold text-lg text-[#00D4FF]">{top3[0].score.toLocaleString()} PTS</span>
          </div>
          <Badge variant="warning" size="md" className="mt-3 font-bold">{top3[0].prize}</Badge>
        </div>

        {/* 3rd Place Podium */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#182238] to-[#121A2D] border border-[#2D3E66] shadow-xl text-center relative order-3 flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={top3[2].avatar}
              alt={top3[2].name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#FFB547]/60 shadow-lg"
            />
            <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-[#FFB547]/80 text-[#0B1020] font-black font-display flex items-center justify-center text-xs shadow-md">
              3
            </div>
          </div>
          <h3 className="font-bold text-white text-sm font-display">{top3[2].name}</h3>
          <p className="text-[11px] text-[#A885FF] font-mono">@{top3[2].username}</p>
          <div className="mt-3 p-2 rounded-xl bg-[#0B1020] border border-[#233252] w-full">
            <span className="text-[10px] text-[#64748B] block">Multiplier Points</span>
            <span className="font-mono font-bold text-base text-white">{top3[2].score.toLocaleString()}</span>
          </div>
          <Badge variant="purple" size="sm" className="mt-2.5">{top3[2].prize}</Badge>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card className="max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3 text-center">Trend</th>
                <th className="py-3 px-3 text-right">Tournament Score</th>
                <th className="py-3 px-3 text-right">Prize</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {remaining.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-[#7C5CFC]/20 border-l-4 border-[#00D4FF]'
                      : 'hover:bg-[#182238]/60'
                  }`}
                >
                  <td className="py-3 px-3 text-center font-mono font-bold text-sm text-white">
                    #{entry.rank}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#2D3E66]"
                      />
                      <div>
                        <p className={`font-semibold ${entry.isCurrentUser ? 'text-[#00D4FF]' : 'text-white'}`}>
                          {entry.name}
                        </p>
                        <span className="text-[10px] text-[#98A5BF] font-mono">@{entry.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {entry.change === 'up' ? (
                      <span className="text-[#20C997] font-bold text-[11px] inline-flex items-center gap-0.5">
                        <ArrowUp className="w-3 h-3" /> {entry.changeVal}
                      </span>
                    ) : entry.change === 'down' ? (
                      <span className="text-[#FF5D73] font-bold text-[11px] inline-flex items-center gap-0.5">
                        <ArrowDown className="w-3 h-3" /> {entry.changeVal}
                      </span>
                    ) : (
                      <span className="text-[#98A5BF] inline-flex items-center">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {entry.score.toLocaleString()} PTS
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#20C997]">
                    {entry.prize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
