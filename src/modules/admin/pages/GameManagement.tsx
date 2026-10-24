import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Filter,
  Plus,
  Star,
  CheckCircle2,
  Edit2,
  Trash2,
  Eye,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockGames, mockProviders } from '../../../data/mock/gamesData';
import type { Game, GameCategory } from '../../../types';

export const GameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | GameCategory>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesProvider = selectedProvider === 'all' || g.providerId === selectedProvider;
    return matchesSearch && matchesCategory && matchesProvider;
  });

  const toggleFeatured = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const updated = !g.featured;
          showToast(`${g.title} ${updated ? 'added to Featured Showcase' : 'removed from Featured'}`);
          return { ...g, featured: updated };
        }
        return g;
      })
    );
  };

  const toggleStatus = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const newStatus = g.status === 'active' ? 'disabled' : 'active';
          showToast(`${g.title} status changed to ${newStatus.toUpperCase()}`);
          return { ...g, status: newStatus };
        }
        return g;
      })
    );
  };

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
            <Gamepad2 className="w-6 h-6 text-[#7C5CFC]" />
            Game Catalog & Title Management
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Manage 742 aggregated titles, configure theoretical RTPs, toggle featured placements, and control launch states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Title
          </Button>
        </div>
      </div>

      {/* Categories quick filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['all', 'slots', 'arcade', 'live', 'card', 'casual'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl capitalize font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#7C5CFC] text-white shadow-sm'
                : 'bg-[#121A2D] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
            }`}
          >
            {cat === 'all' ? 'All Categories (742)' : cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by game title, provider or Game ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#7C5CFC] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-[#0B1020] text-xs text-white border border-[#233252] rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Providers</option>
              {mockProviders.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Games Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Game Details</th>
                <th className="py-3 px-3">Provider</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">RTP %</th>
                <th className="py-3 px-3 text-center">Volatility</th>
                <th className="py-3 px-3 text-right">Plays Count</th>
                <th className="py-3 px-3 text-center">Featured</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#98A5BF]">
                    No games found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-[#182238]/60 transition-colors">
                    {/* Game Details */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#2D3E66] shadow-sm flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white text-sm">{game.title}</p>
                          <span className="text-[10px] font-mono text-[#64748B]">ID: {game.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3 px-3">
                      <span className="text-white font-medium">{game.providerName}</span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#0B1020] text-[#A885FF] border border-[#233252]">
                        {game.category}
                      </span>
                    </td>

                    {/* RTP */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#20C997]">
                      {game.rtp}%
                    </td>

                    {/* Volatility */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        size="sm"
                        variant={
                          game.volatility === 'Very High'
                            ? 'danger'
                            : game.volatility === 'High'
                            ? 'warning'
                            : 'cyan'
                        }
                      >
                        {game.volatility}
                      </Badge>
                    </td>

                    {/* Play Count */}
                    <td className="py-3 px-3 text-right font-mono text-[#98A5BF]">
                      {(game.playCount / 1000000).toFixed(2)}M
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleFeatured(game.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          game.featured
                            ? 'bg-[#FFB547]/20 text-[#FFB547] hover:bg-[#FFB547]/30'
                            : 'text-[#64748B] hover:text-white'
                        }`}
                        title={game.featured ? 'Featured on Homepage' : 'Not Featured'}
                      >
                        <Star className={`w-4 h-4 ${game.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleStatus(game.id)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge
                          size="sm"
                          variant={game.status === 'active' ? 'success' : 'danger'}
                          dot
                        >
                          {game.status}
                        </Badge>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedGame(game);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#98A5BF] hover:text-[#00D4FF] hover:bg-[#182238] transition-colors"
                          title="Edit Game"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Game Modal */}
      {selectedGame && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Game: ${selectedGame.title}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast(`Parameters for ${selectedGame.title} updated.`);
                  setIsEditModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <Input label="Game Title" defaultValue={selectedGame.title} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Theoretical RTP (%)" defaultValue={selectedGame.rtp.toString()} />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Volatility
                </label>
                <select
                  defaultValue={selectedGame.volatility}
                  className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Min Bet ($)" defaultValue={selectedGame.minBet.toString()} />
              <Input label="Max Bet ($)" defaultValue={selectedGame.maxBet.toString()} />
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Game Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Title to Aggregated Catalog"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  showToast('New title registered in catalog.');
                  setIsAddModalOpen(false);
                }}
              >
                Publish Game
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <Input label="Game Title" placeholder="e.g. Cyber Zeus Megaways" required />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Provider Studio
                </label>
                <select className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none">
                  {mockProviders.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Category
                </label>
                <select className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none">
                  <option value="slots">Slots</option>
                  <option value="arcade">Arcade / Crash</option>
                  <option value="live">Live Dealer</option>
                  <option value="card">Card / Blackjack</option>
                  <option value="casual">Casual / Mines</option>
                </select>
              </div>
            </div>
            <Input label="Thumbnail Image URL" placeholder="https://..." />
            <div className="grid grid-cols-2 gap-3">
              <Input label="RTP %" placeholder="96.50" />
              <Input label="Max Exposure / Payout" placeholder="50,000x" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
