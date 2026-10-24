import React, { useState } from 'react';
import {
  CheckCircle,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Play,
  Settings,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { mockGames } from '../../../data/mock/gamesData';
import type { Game } from '../../../types';

export const OperatorMyGames: React.FC = () => {
  const [activeGames, setActiveGames] = useState<Game[]>(mockGames.slice(0, 5));
  const [gameToRemove, setGameToRemove] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveGame = (id: string) => {
    setActiveGames((prev) => prev.filter((g) => g.id !== id));
    showToast(`Removed "${gameToRemove?.title}" from your active integration.`);
    setGameToRemove(null);
  };

  const filteredGames = activeGames.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <CheckCircle className="w-6 h-6 text-[#20C997]" />
            Integrated & Active Games (420)
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Titles currently activated on your Operator API key. Live tokens can be launched by your frontends.
          </p>
        </div>

        <Link to="/operator/catalog">
          <Button variant="cyan" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add More Games
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <div className="relative max-w-md mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search within your integrated games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Game Title</th>
                <th className="py-3 px-3">Studio Provider</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Theoretical RTP</th>
                <th className="py-3 px-3 text-center">Launch Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#98A5BF]">
                    No integrated games found.
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-[#182238]/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#2D3E66]"
                        />
                        <div>
                          <p className="font-semibold text-white">{game.title}</p>
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

                    <td className="py-3 px-3 text-center font-mono font-bold text-[#20C997]">
                      {game.rtp}%
                    </td>

                    <td className="py-3 px-3 text-center">
                      <Badge variant="success" size="sm" dot>
                        Ready to Launch
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setGameToRemove(game)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Remove Confirmation Modal */}
      {gameToRemove && (
        <Modal
          isOpen={!!gameToRemove}
          onClose={() => setGameToRemove(null)}
          title={`Remove Game: ${gameToRemove.title}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setGameToRemove(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveGame(gameToRemove.id)}
              >
                Confirm Removal
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-white">
              Are you sure you want to remove <strong className="text-[#00D4FF]">{gameToRemove.title}</strong> from your integrated catalog?
            </p>
            <p className="text-[#98A5BF]">
              New player launch requests for this Game ID will return a <code className="text-[#FF5D73]">403_GAME_NOT_LICENSED</code> error until re-added.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
