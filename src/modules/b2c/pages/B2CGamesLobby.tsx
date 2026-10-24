import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gamepad2, Search, SlidersHorizontal } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { CatalogStatus } from '../../../components/catalog/CatalogStatus';
import { ProviderGameCard } from '../../../components/catalog/ProviderGameCard';
import { filterCatalog, type GameFilter, type GameSort } from '../../../lib/catalog/catalogModel';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';

const filters: { key: GameFilter; label: string }[] = [
  { key: 'all', label: 'All games' },
  { key: 'single_player', label: 'Single player' },
  { key: 'multiplayer', label: 'Multiplayer' },
];

export const B2CGamesLobby: React.FC = () => {
  const { games, loading, error, refresh } = useProviderCatalog();
  const [params, setParams] = useSearchParams();
  const rawMode = params.get('mode');
  const filter: GameFilter = rawMode === 'single_player' || rawMode === 'multiplayer' ? rawMode : 'all';
  const search = params.get('search') || '';
  const sort: GameSort = params.get('sort') === 'az' || params.get('sort') === 'za' ? params.get('sort') as GameSort : 'order';
  const filtered = filterCatalog(games, search, filter, sort);

  const updateParams = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || (key === 'mode' && value === 'all') || (key === 'sort' && value === 'order')) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-[#233252]/60 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black font-display text-white flex items-center gap-3"><Gamepad2 className="w-7 h-7 text-[#7C5CFC]" />Games Lobby</h1>
        <p className="text-xs text-[#98A5BF] mt-2">Browse games currently enabled in the Game Provider API.</p>
        {!loading && !error && <p className="text-xs mt-2 text-[#00D4FF]">{filtered.length} of {games.length} games</p>}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">{filters.map(({ key, label }) => <button key={key} type="button" onClick={() => updateParams('mode', key)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${filter === key ? 'bg-[#7C5CFC] text-white' : 'bg-[#121A2D] text-[#98A5BF] border border-[#233252] hover:text-white'}`}>{label}{!loading && !error ? ` (${key === 'all' ? games.length : games.filter((game) => game.gameMode === key).length})` : ''}</button>)}</div>
      <Card><div className="flex flex-col sm:flex-row sm:items-center gap-4"><div className="relative flex-1"><Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3.5 text-[#64748B]"/><input className="w-full bg-[#0B1020] border border-[#233252] text-white rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#7C5CFC]" placeholder="Search by title or type..." type="search" value={search} onChange={(event) => updateParams('search', event.target.value)} aria-label="Search games"/></div><div className="flex items-center gap-2 text-xs text-[#98A5BF]"><SlidersHorizontal className="w-4 h-4"/><label htmlFor="catalog-sort">Sort</label><select id="catalog-sort" className="bg-[#0B1020] border border-[#233252] rounded-xl text-white px-3 py-2.5" value={sort} onChange={(event) => updateParams('sort', event.target.value)}><option value="order">Provider order</option><option value="az">Title A–Z</option><option value="za">Title Z–A</option></select></div></div></Card>
      <CatalogStatus loading={loading} error={error} empty={!games.length} retry={refresh}/>
      {!loading && !error && games.length > 0 && (filtered.length ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">{filtered.map((game) => <ProviderGameCard key={game.gameId} game={game}/>)}</div> : <div className="text-center p-10 text-sm text-[#98A5BF] border border-[#233252] rounded-2xl">No enabled games match these filters. <button className="text-[#00D4FF] hover:underline" onClick={() => setParams({})}>Reset filters</button></div>)}
      <p className="text-xs text-[#64748B]">Select a game to request a backend-approved demo launch. Provider sandbox launch is available only when separately enabled and fully configured.</p>
    </div>
  );
};
