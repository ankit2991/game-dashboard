import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Filter,
  Play,
  Heart,
  Sparkles,
  Flame,
  Star,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockGames, mockProviders } from '../../../data/mock/gamesData';
import type { Game, GameCategory } from '../../../types';

export const B2CGamesLobby: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as GameCategory | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | GameCategory>(categoryParam || 'all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rtp' | 'az'>('popular');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    game_gates_olympus: true,
    game_aviator_turbo: true
  });

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const categories: { id: 'all' | GameCategory; label: string }[] = [
    { id: 'all', label: 'All Games (742)' },
    { id: 'slots', label: 'Video Slots' },
    { id: 'arcade', label: 'Crash / Aviator' },
    { id: 'live', label: 'Live Dealer' },
    { id: 'card', label: 'Blackjack & Cards' },
    { id: 'casual', label: 'Mines & Casual' },
  ];

  const filteredGames = mockGames
    .filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.providerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
      const matchesProvider = selectedProvider === 'all' || g.providerId === selectedProvider;
      return matchesSearch && matchesCategory && matchesProvider;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.playCount - a.playCount;
      if (sortBy === 'rtp') return b.rtp - a.rtp;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2.5">
            <Gamepad2 className="w-7 h-7 text-[#7C5CFC]" />
            Complete Games Lobby
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Discover certified high-RTP slots, crash games, and real-time live dealers with instant play.
          </p>
        </div>
      </div>

      {/* Filter Ribbon: Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (cat.id !== 'all') setSearchParams({ category: cat.id });
              else setSearchParams({});
            }}
            className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF] text-white shadow-lg shadow-[#7C5CFC]/25'
                : 'bg-[#121A2D] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search, Provider Select & Sort Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by game name or studio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#7C5CFC] outline-none"
            />
          </div>

          {/* Provider Filter & Sort By Dropdowns */}
          <div className="flex items-center gap-2.5 text-xs">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-[#0B1020] text-white border border-[#233252] rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Studio Providers</option>
              {mockProviders.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B1020] text-white border border-[#233252] rounded-xl px-3 py-2 outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">New Releases</option>
              <option value="rtp">Highest RTP (%)</option>
              <option value="az">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Games Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredGames.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[#98A5BF] text-xs">
            No games found matching your search. Try resetting your filters.
          </div>
        ) : (
          filteredGames.map((game) => {
            const isFav = favorites[game.id];

            return (
              <div
                key={game.id}
                onClick={() => navigate(`/play/${game.id}`)}
                className="group relative rounded-2xl overflow-hidden bg-[#182238] border border-[#233252] hover:border-[#7C5CFC]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7C5CFC]/20 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#182238] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#0B1020]/90 text-[#00D4FF] backdrop-blur-md border border-[#00D4FF]/30">
                      {game.category}
                    </span>
                    {game.isNew && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#20C997]/90 text-[#0B1020]">
                        NEW
                      </span>
                    )}
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

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-[#0B1020]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg shadow-[#7C5CFC]/50 transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
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
          })
        )}
      </div>
    </div>
  );
};
