import React, { useState } from 'react';
import { Check, Plus, RefreshCcw, Search, Gamepad2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useOperatorWorkspace } from '../../../lib/operator/useOperatorWorkspace';
import { getCatalogArtwork } from '../../../lib/catalog/catalogModel';
import { makeSelection } from '../../../lib/operator/workspaceModel';
import { gameActivationLabel } from '../../../lib/operator/integrationModel';

export const OperatorCatalog: React.FC = () => {
  const { games, selectedGames, integration, loading, saving, error, update, refresh } = useOperatorWorkspace();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'all' | 'single_player' | 'multiplayer'>('all');
  const [message, setMessage] = useState('');
  const filtered = games.filter(g => (mode === 'all' || g.gameMode === mode) &&
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.gameId.includes(search.toLowerCase())));
  async function toggle(id: string) {
    setMessage('');
    try { await update(makeSelection(selectedGames, id, games)); setMessage('Game request saved. Admin approval/sync is required before API authorization changes.'); }
    catch { /* Error is presented by hook. */ }
  }
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl text-white font-bold flex items-center gap-2"><Gamepad2 className="text-[#00D4FF]" />Operator Game Catalog</h1>
      <p className="text-sm text-[#98A5BF] mt-1">{loading ? 'Loading provider catalog…' : `${games.length} enabled games · ${selectedGames.length} selected`}. Selection is not launch authorization.</p></div>
      <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCcw className="w-4 h-4" />}>Refresh</Button>
    </div>
    <Card><div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[180px] relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-[#98A5BF]" />
        <input aria-label="Search games" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by game or ID" className="w-full bg-[#0B1020] border border-[#233252] rounded-lg pl-9 pr-3 py-2 text-white text-sm" /></div>
      <select aria-label="Game type" value={mode} onChange={e => setMode(e.target.value as typeof mode)} className="bg-[#0B1020] border border-[#233252] text-white rounded-lg px-3">
        <option value="all">All games</option><option value="single_player">Single Player</option><option value="multiplayer">Multiplayer</option>
      </select></div></Card>
    {error && <p role="alert" className="text-[#FF5D73] text-sm">{error}</p>}
    {message && <p role="status" className="text-[#20C997] text-sm">{message}</p>}
    {!loading && !filtered.length && <Card><p className="text-[#98A5BF] text-sm">No matching games in the live backend catalog.</p></Card>}
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(game => {
      const chosen = selectedGames.includes(game.gameId), art = getCatalogArtwork(game.gameId);
      return <Card key={game.gameId} className="flex flex-col gap-3">
        <div className="h-28 rounded-xl flex items-center justify-center bg-[#0B1020]" style={{color: art.accent}}><img src={art.icon ?? undefined} alt={`${game.name} icon`} className="h-full w-full object-contain p-2" loading="lazy" /></div>
        <div><h2 className="text-white font-semibold">{game.name}</h2><p className="text-[#98A5BF] text-xs font-mono">{game.gameId} · {game.gameMode.replace('_',' ')}</p></div>
        <p className="text-[#00D4FF] text-xs font-semibold">{gameActivationLabel(integration?.games.find(g => g.gameId === game.gameId))}</p>
        <p className="text-[#98A5BF] text-xs">API authorization and successful wallet/game launch are separate. This status is configuration-only.</p>
        <Button variant={chosen ? 'outline' : 'cyan'} size="sm" disabled={saving || loading} onClick={() => void toggle(game.gameId)} leftIcon={chosen ? <Check className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}>{chosen ? 'Remove selection' : 'Select game'}</Button>
      </Card>;
    })}</div>
  </div>;
};
