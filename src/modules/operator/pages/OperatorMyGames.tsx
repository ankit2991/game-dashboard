import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Search } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useOperatorWorkspace } from '../../../lib/operator/useOperatorWorkspace';
import { getCatalogArtwork } from '../../../lib/catalog/catalogModel';
import { gameActivationLabel } from '../../../lib/operator/integrationModel';

export const OperatorMyGames: React.FC = () => {
  const { games, selectedGames, integration, loading, saving, error, update } = useOperatorWorkspace();
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const mine = games.filter(g => selectedGames.includes(g.gameId) &&
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.gameId.includes(search.toLowerCase())));
  async function remove() {
    if (!pending) return;
    try { await update(selectedGames.filter(id => id !== pending)); setPending(null); }
    catch { /* Error shown below. */ }
  }
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><CheckCircle2 className="text-[#20C997]"/>My Selected Games ({loading ? '…' : selectedGames.length})</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Saved preferences, not proof that the Operator API key is provisioned or launches are enabled.</p></div>
      <Link to="/operator/catalog"><Button variant="cyan" size="sm">Add games</Button></Link>
    </div>
    <Card><div className="space-y-3">
      <input aria-label="Search selected games" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search selected titles" className="w-full max-w-sm bg-[#0B1020] border border-[#233252] text-white text-sm rounded-lg px-3 py-2" />
      {error && <p role="alert" className="text-[#FF5D73]">{error}</p>}
      {!loading && !mine.length && <p className="text-[#98A5BF] text-sm py-3">No selected games match your search. Choose titles from the catalog.</p>}
      {mine.map(g => <div key={g.gameId} className="flex items-center justify-between gap-4 border-t border-[#233252] pt-3">
        <div className="flex items-center gap-3 min-w-0"><img src={getCatalogArtwork(g.gameId).icon ?? undefined} alt={`${g.name} icon`} className="w-12 h-12 rounded-lg object-contain bg-[#0B1020] shrink-0" loading="lazy" /><div><h2 className="text-white text-sm font-bold">{g.name}</h2><p className="text-[#98A5BF] text-xs">{g.gameId} · {g.gameMode.replace('_',' ')}</p>
          <p className="text-[#00D4FF] text-xs">{gameActivationLabel(integration?.games.find(s => s.gameId === g.gameId))}</p></div></div>
        <Button variant="danger" size="sm" disabled={saving} onClick={() => setPending(g.gameId)}>Remove</Button>
      </div>)}
    </div></Card>
    {integration?.games.some(g => g.state === 'removal_pending') && <Card><p className="text-[#FFB547] text-sm">Removed game requests are awaiting administrator sync. Until then, those games may remain authorized on the Partner API.</p></Card>}
    {pending && <Card><p className="text-white text-sm mb-3">Remove {games.find(g => g.gameId === pending)?.name} from your requested games? Your partner permissions will not change until administrator sync.</p>
      <div className="flex gap-2"><Button variant="danger" onClick={() => void remove()} disabled={saving}>Confirm removal</Button><Button variant="outline" onClick={() => setPending(null)}>Cancel</Button></div>
    </Card>}
  </div>;
};
