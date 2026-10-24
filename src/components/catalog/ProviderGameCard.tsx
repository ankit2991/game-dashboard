import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, UserRound } from 'lucide-react';
import type { ProviderGame } from '../../lib/api/types';
import { getCatalogArtwork, getSafeDemoUrl } from '../../lib/catalog/catalogModel';
import { Badge } from '../ui/Badge';

export const ProviderGameCard: React.FC<{ game: ProviderGame }> = ({ game }) => {
  const art = getCatalogArtwork(game.gameId);
  const demo = getSafeDemoUrl(game.demoUrl);
  return (
    <article className="group rounded-2xl overflow-hidden bg-[#182238] border border-[#233252] hover:border-[#7C5CFC]/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7C5CFC]/10">
      <Link to={`/play/${encodeURIComponent(game.gameId)}`} className="block focus-visible:outline-2 focus-visible:outline-[#00D4FF]" aria-label={`Details for ${game.name}`}>
        <div className="aspect-[16/10] relative flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 30% 30%, ${art.accent}55, #121A2D 70%)` }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(35deg, transparent 48%, #ffffff28 49%, transparent 51%)', backgroundSize: '20px 20px' }} />
          <span className="text-6xl font-black select-none" style={{ color: art.accent }} aria-hidden="true">{art.symbol}</span>
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] uppercase font-bold rounded-md bg-[#0B1020]/85 text-white">{art.genre}</span>
          <span className="absolute right-3 top-3"><Badge variant={game.providerLaunchAvailable ? 'success' : 'neutral'} size="sm">{game.providerLaunchAvailable ? 'Provider configured' : 'Catalog listed'}</Badge></span>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-white font-bold font-display text-sm group-hover:text-[#00D4FF] transition-colors">{game.name}</h3>
          <p className="text-xs text-[#98A5BF] min-h-8">{art.blurb}</p>
          <p className="text-[11px] flex items-center gap-1 text-[#98A5BF]">{game.gameMode === 'multiplayer' ? <Users className="w-3.5 h-3.5" /> : <UserRound className="w-3.5 h-3.5" />}{game.gameMode === 'multiplayer' ? 'Multiplayer' : 'Single player'}</p>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <Link className="text-[#00D4FF] text-xs hover:underline" to={`/play/${encodeURIComponent(game.gameId)}`}>Details</Link>
        {demo ? <a className="text-white text-xs px-3 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6947eb] inline-flex items-center gap-1" href={demo} target="_blank" rel="noopener noreferrer" aria-label={`Open ${game.name} demo in a new tab`}>Open demo <ArrowUpRight className="w-3 h-3" /></a> : <span className="text-[#64748B] text-[11px]">Demo not configured</span>}
      </div>
    </article>
  );
};
