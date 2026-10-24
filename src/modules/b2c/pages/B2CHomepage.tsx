import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Flame,
  Sparkles,
  Trophy,
  Star,
  Heart,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Gift,
  Coins,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockGames, mockProviders } from '../../../data/mock/gamesData';
import type { Game } from '../../../types';

export const B2CHomepage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    game_gates_olympus: true,
    game_aviator_turbo: true
  });

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const featuredHeroGame = mockGames[0]; // Gates of Olympus 1000

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative px-4 sm:px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-[#2D3E66] shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center bg-[#121A2D]">
            {/* Background Graphic with gradient overlay */}
            <div className="absolute inset-0">
              <img
                src={featuredHeroGame.bannerImage}
                alt={featuredHeroGame.title}
                className="w-full h-full object-cover object-center filter brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent" />
            </div>

            {/* Hero Text Content */}
            <div className="relative z-10 p-6 sm:p-12 max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="md" dot>
                  Featured Game of the Week
                </Badge>
                <span className="text-xs text-[#00D4FF] font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#FFB547]" /> 1,000x Max Multiplier
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
                {featuredHeroGame.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#98A5BF] line-clamp-3 leading-relaxed">
                {featuredHeroGame.description} Powered by {featuredHeroGame.providerName} with tumbling reels and thunderous multiplier drops.
              </p>

              {/* Specs pill */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#182238]/80 backdrop-blur-md border border-[#2D3E66] text-white">
                  RTP: <strong className="text-[#20C997] font-mono">{featuredHeroGame.rtp}%</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#182238]/80 backdrop-blur-md border border-[#2D3E66] text-white">
                  Volatility: <strong className="text-[#FF5D73]">{featuredHeroGame.volatility}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#182238]/80 backdrop-blur-md border border-[#2D3E66] text-white">
                  Rating: <strong className="text-[#FFB547]">★ {featuredHeroGame.rating}</strong>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to={`/play/${featuredHeroGame.id}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Play className="w-4 h-4 fill-current" />}
                    className="shadow-xl shadow-[#7C5CFC]/30 text-sm font-display tracking-wider"
                  >
                    Play Now
                  </Button>
                </Link>

                <Link to="/games">
                  <Button variant="outline" size="lg" className="text-sm">
                    Explore All 700+ Games
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Game Categories Ribbon */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Slots', icon: Sparkles, cat: 'slots', color: '#7C5CFC', count: '480 Games' },
              { label: 'Crash / Aviator', icon: Zap, cat: 'arcade', color: '#00D4FF', count: '64 Games' },
              { label: 'Live Roulette', icon: Flame, cat: 'live', color: '#20C997', count: '92 Tables' },
              { label: 'VIP Blackjack', icon: Coins, cat: 'card', color: '#FFB547', count: '48 Tables' },
              { label: 'Casual / Mines', icon: Trophy, cat: 'casual', color: '#FF5D73', count: '35 Games' },
              { label: 'Jackpots', icon: Gift, cat: 'slots', color: '#A885FF', count: '12 Megaways' }
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.label}
                  to={`/games?category=${category.cat}`}
                  className="p-4 rounded-2xl bg-[#121A2D] border border-[#233252] hover:border-[#7C5CFC]/50 hover:bg-[#182238] transition-all group hover:-translate-y-1 shadow-lg flex flex-col items-center text-center"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-xs font-display">{category.label}</span>
                  <span className="text-[10px] text-[#98A5BF] mt-0.5">{category.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5D73] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                Popular & Trending Titles
              </h2>
            </div>
            <Link to="/games" className="text-xs text-[#00D4FF] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {mockGames.slice(0, 4).map((game) => {
              const isFav = favorites[game.id];

              return (
                <div
                  key={game.id}
                  onClick={() => navigate(`/play/${game.id}`)}
                  className="group relative rounded-2xl overflow-hidden bg-[#182238] border border-[#233252] hover:border-[#7C5CFC]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7C5CFC]/15 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A2D] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#0B1020]/90 text-[#00D4FF] backdrop-blur-md border border-[#00D4FF]/30">
                        {game.category}
                      </span>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, game.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-xl backdrop-blur-md transition-all ${
                        isFav ? 'bg-[#FF5D73]/30 text-[#FF5D73]' : 'bg-[#0B1020]/70 text-white/70 hover:text-white'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Hover Play Icon Overlay */}
                    <div className="absolute inset-0 bg-[#0B1020]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg shadow-[#7C5CFC]/50 transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Stats */}
                  <div className="p-3">
                    <h3 className="font-bold text-white text-xs truncate group-hover:text-[#00D4FF] transition-colors font-display">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-[#98A5BF] truncate">{game.providerName}</p>

                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-[#233252]/60">
                      <span className="text-[#20C997] font-mono font-semibold">{game.rtp}% RTP</span>
                      <span className="text-[#64748B]">★ {game.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upstream Studio Provider Logos Row */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto p-6 rounded-3xl bg-[#121A2D] border border-[#233252]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Certified Provider Studios
            </h3>
            <span className="text-xs text-[#00D4FF]">742 Games Aggregated</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mockProviders.map((prov) => (
              <div
                key={prov.id}
                className="p-3 rounded-xl bg-[#182238] border border-[#233252] flex items-center gap-2.5 hover:border-[#00D4FF]/40 transition-colors"
              >
                <img
                  src={prov.logo}
                  alt={prov.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#2D3E66] flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-white text-xs truncate">{prov.name}</p>
                  <span className="text-[10px] text-[#98A5BF] block">{prov.activeGames} Games</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Campaign Cards */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#7C5CFC]/30 to-[#182238] border border-[#7C5CFC]/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2 relative z-10 max-w-sm">
              <Badge variant="purple" size="sm">Welcome Player Package</Badge>
              <h3 className="text-2xl font-black font-display text-white tracking-tight">
                100% Match Deposit up to $1,000 + 50 Free Spins
              </h3>
              <p className="text-xs text-[#98A5BF]">
                Double your balance instantly on your first deposit with 35x wagering requirements.
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <Link to="/player/wallet">
                <Button variant="primary" size="md">Claim Bonus Now</Button>
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#00D4FF]/20 to-[#182238] border border-[#00D4FF]/30 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2 relative z-10 max-w-sm">
              <Badge variant="cyan" size="sm">Daily Cash Drops</Badge>
              <h3 className="text-2xl font-black font-display text-white tracking-tight">
                $50,000 Weekly Multiplier Leaderboard
              </h3>
              <p className="text-xs text-[#98A5BF]">
                Play any Pragmatic Nexus or Spribe Crash game and climb the global podium rankings.
              </p>
            </div>
            <div className="mt-6 relative z-10">
              <Link to="/leaderboard">
                <Button variant="cyan" size="md">View Leaderboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
