import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Filter,
  Plus,
  Check,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Smartphone,
  Monitor,
  Code2
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { mockGames, mockProviders } from '../../../data/mock/gamesData';
import type { Game, GameCategory } from '../../../types';

export const OperatorCatalog: React.FC = () => {
  const [games] = useState<Game[]>(mockGames);
  const [integratedGameIds, setIntegratedGameIds] = useState<Record<string, boolean>>({
    game_gates_olympus: true,
    game_sweet_bonanza: true,
    game_aviator_turbo: true,
    game_lightning_roulette: true,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | GameCategory>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleIntegration = (game: Game) => {
    setIntegratedGameIds((prev) => {
      const isAlready = prev[game.id];
      const updated = { ...prev, [game.id]: !isAlready };
      showToast(
        !isAlready
          ? `Added "${game.title}" to your Operator integration catalog.`
          : `Removed "${game.title}" from your active games.`
      );
      return updated;
    });
  };

  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesProv = selectedProvider === 'all' || g.providerId === selectedProvider;
    return matchesSearch && matchesCat && matchesProv;
  });

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
            <Gamepad2 className="w-6 h-6 text-[#00D4FF]" />
            Game Aggregator Marketplace
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Browse 742 certified game titles. Click "Add to My Games" to enable launch tokens for your white-label portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-[#121A2D] p-1 rounded-xl border border-[#233252] flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#00D4FF] text-[#0B1020]' : 'text-[#98A5BF] hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-[#00D4FF] text-[#0B1020]' : 'text-[#98A5BF] hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filtering Controls */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search games by title, provider or Game ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-[#0B1020] text-xs text-white border border-[#233252] rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Studio Providers</option>
              {mockProviders.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-[#0B1020] text-xs text-white border border-[#233252] rounded-xl px-3 py-2 outline-none capitalize"
            >
              <option value="all">All Categories</option>
              <option value="slots">Slots</option>
              <option value="arcade">Arcade / Crash</option>
              <option value="live">Live Dealer</option>
              <option value="card">Card / Table</option>
              <option value="casual">Casual / Mines</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGames.map((game) => {
            const isIntegrated = integratedGameIds[game.id];

            return (
              <Card key={game.id} hoverEffect className="relative flex flex-col justify-between overflow-hidden group">
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-[#2D3E66]">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#0B1020]/80 text-[#00D4FF] backdrop-blur-sm border border-[#00D4FF]/30">
                        {game.category}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <Badge variant={isIntegrated ? 'success' : 'neutral'} size="sm">
                        {isIntegrated ? 'Integrated' : 'Available'}
                      </Badge>
                    </div>
                  </div>

                  {/* Title & Provider */}
                  <h3 className="font-bold text-white text-sm truncate font-display">{game.title}</h3>
                  <p className="text-xs text-[#98A5BF] truncate">{game.providerName}</p>

                  {/* Specs */}
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-2 pt-2 border-t border-[#233252]/60">
                    <span>RTP: <strong className="text-[#20C997] font-mono">{game.rtp}%</strong></span>
                    <span>Vol: <strong className="text-white">{game.volatility}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#233252]/60">
                  <Button
                    variant={isIntegrated ? 'secondary' : 'cyan'}
                    size="sm"
                    className="flex-1 text-xs"
                    leftIcon={isIntegrated ? <Check className="w-3.5 h-3.5 text-[#20C997]" /> : <Plus className="w-3.5 h-3.5" />}
                    onClick={() => toggleIntegration(game)}
                  >
                    {isIntegrated ? 'Active in My Games' : 'Add to My Games'}
                  </Button>

                  <button
                    onClick={() => setSelectedGame(game)}
                    className="p-2 rounded-xl bg-[#182238] hover:bg-[#233252] text-[#98A5BF] hover:text-white border border-[#2D3E66] transition-colors"
                    title="View Integration Schema"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
                <tr>
                  <th className="py-3 px-3">Game Title</th>
                  <th className="py-3 px-3">Studio Provider</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">RTP %</th>
                  <th className="py-3 px-3 text-center">Volatility</th>
                  <th className="py-3 px-3 text-center">Integration Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233252]/60">
                {filteredGames.map((game) => {
                  const isIntegrated = integratedGameIds[game.id];

                  return (
                    <tr key={game.id} className="hover:bg-[#182238]/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#2D3E66]"
                          />
                          <div>
                            <span className="font-semibold text-white block">{game.title}</span>
                            <span className="text-[10px] font-mono text-[#64748B]">ID: {game.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#98A5BF]">{game.providerName}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#0B1020] text-[#00D4FF] border border-[#233252]">
                          {game.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#20C997]">{game.rtp}%</td>
                      <td className="py-3 px-3 text-center text-white">{game.volatility}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={isIntegrated ? 'success' : 'neutral'} size="sm">
                          {isIntegrated ? 'Integrated' : 'Available'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant={isIntegrated ? 'secondary' : 'cyan'}
                            size="sm"
                            onClick={() => toggleIntegration(game)}
                          >
                            {isIntegrated ? 'Remove' : 'Add'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGame(game)}
                          >
                            Schema
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Game Details & Integration Schema Modal */}
      {selectedGame && (
        <Modal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          title={`Integration Spec: ${selectedGame.title}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-[#98A5BF]">Game ID: <code className="text-[#00D4FF] font-mono">{selectedGame.id}</code></span>
              <Button
                variant={integratedGameIds[selectedGame.id] ? 'secondary' : 'cyan'}
                size="sm"
                onClick={() => {
                  toggleIntegration(selectedGame);
                  setSelectedGame(null);
                }}
              >
                {integratedGameIds[selectedGame.id] ? 'Remove from My Games' : 'Add to My Games'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1020] border border-[#233252]">
              <img
                src={selectedGame.thumbnail}
                alt={selectedGame.title}
                className="w-14 h-14 rounded-xl object-cover border border-[#2D3E66]"
              />
              <div>
                <h4 className="font-bold text-white text-base font-display">{selectedGame.title}</h4>
                <p className="text-[#00D4FF]">{selectedGame.providerName} • Volatility: {selectedGame.volatility} • RTP: {selectedGame.rtp}%</p>
                <p className="text-[#98A5BF] text-[11px] mt-0.5">{selectedGame.description}</p>
              </div>
            </div>

            {/* Simulated Launch Payload preview */}
            <div>
              <span className="font-semibold text-white block mb-1">Sample Launch Request (POST /v1/games/launch)</span>
              <pre className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] text-[#00D4FF] font-mono text-[11px] overflow-x-auto">
{`{
  "game_id": "${selectedGame.id}",
  "operator_id": "op_asia_gaming",
  "player_id": "usr_9921048",
  "currency": "USD",
  "session_ip": "103.45.22.18",
  "return_url": "https://yourcasino.com/lobby"
}`}
              </pre>
            </div>

            {/* Launch Response */}
            <div>
              <span className="font-semibold text-white block mb-1">Gateway Response (200 OK)</span>
              <pre className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] text-[#20C997] font-mono text-[11px] overflow-x-auto">
{`{
  "status": "success",
  "launch_url": "https://play.nexus-provider.internal/launch?token=tok_live_7719ab294...",
  "session_token": "sess_8812a0fbc9901",
  "expires_in": 3600
}`}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
