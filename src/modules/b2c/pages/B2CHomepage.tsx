import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, Layers, ShieldCheck, Users, Zap } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { CatalogStatus } from '../../../components/catalog/CatalogStatus';
import { ProviderGameCard } from '../../../components/catalog/ProviderGameCard';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';
import { getCatalogArtwork } from '../../../lib/catalog/catalogModel';

export const B2CHomepage: React.FC = () => {
  const { games, loading, error, refresh } = useProviderCatalog();
  const featured = games[0];
  const multiplayer = games.filter((game) => game.gameMode === 'multiplayer').length;
  return (
    <div className="space-y-10 pb-16">
      <section className="px-4 sm:px-6 pt-6">
        <div className="max-w-7xl mx-auto rounded-3xl border border-[#2D3E66] bg-gradient-to-br from-[#233252] via-[#121A2D] to-[#0B1020] min-h-[340px] flex flex-col justify-center gap-6 p-8 md:p-14 overflow-hidden relative">
          <div className="absolute top-[-90px] right-[-80px] w-80 h-80 bg-[#7C5CFC]/15 blur-3xl rounded-full pointer-events-none" />
          <Badge variant="cyan" className="w-fit">Live catalog data · B2C</Badge>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white max-w-2xl">Explore our <span className="text-[#00D4FF]">game collection</span></h1>
          <p className="text-sm text-[#98A5BF] max-w-xl">Discover games published by the Game Provider API. Listings, availability and game modes are supplied by the backend, not demo inventory.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/games"><Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>Browse games</Button></Link>
            {featured && <Link to={`/play/${featured.gameId}`}><Button variant="outline" size="lg">Featured: {featured.name}</Button></Link>}
          </div>
        </div>
      </section>
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="p-5 rounded-2xl border border-[#233252] bg-[#121A2D] flex items-center gap-4"><Layers className="w-7 h-7 text-[#00D4FF]"/><div><div className="text-2xl text-white font-bold">{loading || error ? '—' : games.length}</div><div className="text-xs text-[#98A5BF]">Enabled games</div></div></div>
          <div className="p-5 rounded-2xl border border-[#233252] bg-[#121A2D] flex items-center gap-4"><Users className="w-7 h-7 text-[#20C997]"/><div><div className="text-2xl text-white font-bold">{loading || error ? '—' : multiplayer}</div><div className="text-xs text-[#98A5BF]">Multiplayer games</div></div></div>
          <div className="p-5 rounded-2xl border border-[#233252] bg-[#121A2D] flex items-center gap-4"><ShieldCheck className="w-7 h-7 text-[#A885FF]"/><div><div className="text-sm text-white font-bold">Provider API</div><div className="text-xs text-[#98A5BF]">Read-only public catalog</div></div></div>
        </div>
      </section>
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex justify-between gap-3 items-center"><h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2"><Zap className="w-5 h-5 text-[#FFB547]"/> Explore games</h2><Link to="/games" className="text-[#00D4FF] text-xs flex gap-1 items-center hover:underline">View all <ArrowRight className="w-3 h-3"/></Link></div>
          <CatalogStatus loading={loading} error={error} empty={!games.length} retry={refresh} />
          {!loading && !error && games.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{games.slice(0, 4).map((game) => <ProviderGameCard key={game.gameId} game={game} />)}</div>}
        </div>
      </section>
      {!loading && !error && games.length > 0 && <section className="px-4 sm:px-6"><div className="max-w-7xl mx-auto p-6 rounded-2xl border border-[#233252] bg-[#121A2D]"><h2 className="text-white font-bold font-display flex items-center gap-2 mb-4"><Gamepad2 className="w-5 h-5 text-[#00D4FF]"/> Available game types</h2><div className="flex flex-wrap gap-2">{[...new Set(games.map((game) => getCatalogArtwork(game.gameId).genre))].map((genre) => <Link key={genre} className="px-4 py-2 rounded-xl bg-[#182238] border border-[#233252] text-[#98A5BF] hover:text-white" to={`/games?search=${encodeURIComponent(genre)}`}>{genre}</Link>)}</div></div></section>}
      <section className="px-4 sm:px-6"><p className="max-w-7xl mx-auto text-xs text-[#64748B]">Catalog availability does not imply that provider launch, financial transactions, or game backend integrations are ready. Demo links are configured by the backend and may open external applications.</p></section>
    </div>
  );
};
