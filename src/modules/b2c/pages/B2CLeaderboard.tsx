import React, { useState } from 'react';
import { Trophy, Medal, RotateCw, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';
import { useLeaderboard } from '../../../lib/leaderboard/useLeaderboard';
import { PAGE_SIZE, type LeaderboardEntry } from '../../../lib/leaderboard/leaderboardModel';

const fmt = (value: number) => value.toLocaleString('en-US');

export const B2CLeaderboard: React.FC = () => {
  const catalog = useProviderCatalog();
  const [gameId, setGameId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const { data, loading, error, refresh } = useLeaderboard(gameId, offset);
  const firstPage = offset === 0;
  const podium = firstPage ? (data?.entries ?? []).slice(0, 3) : [];
  const entries = firstPage ? (data?.entries ?? []).slice(3) : data?.entries ?? [];
  const isGameBoard = gameId !== null;
  const changeGame = (value: string) => {
    setGameId(value || null);
    setOffset(0);
  };
  const scoreValue = (item: LeaderboardEntry) => isGameBoard ? item.bestScore : item.wins;
  const scoreLabel = isGameBoard ? 'Best score' : 'Wins';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      <div className="text-center space-y-3">
        <Badge variant="purple" size="md">Verified game results</Badge>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Game Provider Leaderboard</h1>
        <p className="text-sm text-[#98A5BF] max-w-2xl mx-auto">
          Rankings reflect results submitted by trusted game servers. Player names are pseudonymous.
          There are no cash prizes or daily tournaments attached to this leaderboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <label htmlFor="leaderboard-game" className="text-xs text-[#98A5BF] font-semibold">Ranking</label>
        <select id="leaderboard-game" value={gameId ?? ''} onChange={event => changeGame(event.target.value)}
          className="bg-[#182238] border border-[#2D3E66] rounded-xl px-4 py-2.5 text-sm text-white max-w-full">
          <option value="">Global — most wins</option>
          {catalog.games.map(game => <option key={game.gameId} value={game.gameId}>{game.name} — best score</option>)}
        </select>
        <Button size="sm" variant="outline" disabled={loading} leftIcon={<RotateCw className="w-3.5 h-3.5" />} onClick={refresh}>Refresh</Button>
      </div>
      {catalog.error && <p role="status" className="text-center text-xs text-[#FFB547]">Game list unavailable: {catalog.error}. Global rankings remain accessible.</p>}

      {loading ? (
        <div role="status" className="py-16 text-center text-[#98A5BF]">Loading verified results…</div>
      ) : error ? (
        <Card className="max-w-3xl mx-auto text-center">
          <div role="alert" className="space-y-3 py-8">
            <AlertTriangle className="w-7 h-7 mx-auto text-[#FFB547]" />
            <h2 className="text-white font-bold">Leaderboard unavailable</h2>
            <p className="text-xs text-[#98A5BF]">{error}</p>
            <p className="text-xs text-[#98A5BF]">The backend requires LEADERBOARD_ENABLED=true. Results must come from authorized game backends.</p>
            <Button variant="outline" onClick={refresh}>Try again</Button>
          </div>
        </Card>
      ) : data && data.totalPlayers === 0 ? (
        <Card className="max-w-3xl mx-auto text-center">
          <div role="status" className="py-12 space-y-2">
            <Trophy className="w-8 h-8 mx-auto text-[#7C5CFC]" />
            <h2 className="text-white font-bold">No verified results yet</h2>
            <p className="text-[#98A5BF] text-sm">Rankings will appear after game backends submit valid completed rounds.</p>
          </div>
        </Card>
      ) : data ? (
        <>
          <div className="flex justify-between items-center text-xs text-[#98A5BF] max-w-4xl mx-auto">
            <span>{fmt(data.totalPlayers)} ranked players</span>
            <span>Sorted by {isGameBoard ? 'best score' : 'total wins'}</span>
          </div>
          {podium.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto items-end">
              {podium.map((entry, index) => (
                <div key={entry.rank} className={`p-6 rounded-3xl bg-gradient-to-b from-[#182238] to-[#121A2D] border shadow-xl text-center ${index === 0 ? 'border-[#FFB547] sm:order-2' : 'border-[#2D3E66]'} ${index === 1 ? 'sm:order-1' : 'sm:order-3'}`}>
                  {index === 0 ? <Trophy className="w-8 h-8 text-[#FFB547] mx-auto mb-3" /> : <Medal className="w-7 h-7 text-[#A885FF] mx-auto mb-3" />}
                  <p className="font-mono font-bold text-[#00D4FF]">#{entry.rank}</p>
                  <p className="font-semibold text-white text-sm mt-2 break-all">{entry.player.label}</p>
                  <div className="mt-3 p-3 rounded-xl bg-[#0B1020] border border-[#233252]">
                    <span className="block text-[11px] text-[#98A5BF]">{scoreLabel}</span>
                    <span className="text-xl text-white font-bold font-mono">{fmt(scoreValue(entry))}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#98A5BF]">{fmt(entry.rounds)} verified rounds</p>
                </div>
              ))}
            </div>
          )}
          <Card className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#121A2D] text-[#98A5BF] uppercase border-b border-[#233252]">
                  <tr>
                    <th className="py-3 px-4">Rank</th><th className="py-3 px-4">Player</th>
                    <th className="py-3 px-4 text-right">Wins</th><th className="py-3 px-4 text-right">Rounds</th>
                    <th className="py-3 px-4 text-right">Best score</th><th className="py-3 px-4 text-right">Total score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233252]/70">
                  {entries.map(entry => (
                    <tr key={entry.rank} className="hover:bg-[#182238]/60">
                      <td className="py-3 px-4 font-mono text-[#00D4FF]">#{entry.rank}</td>
                      <td className="py-3 px-4 font-semibold text-white">{entry.player.label}</td>
                      <td className="py-3 px-4 text-right text-white font-mono">{fmt(entry.wins)}</td>
                      <td className="py-3 px-4 text-right text-white font-mono">{fmt(entry.rounds)}</td>
                      <td className="py-3 px-4 text-right text-white font-mono">{fmt(entry.bestScore)}</td>
                      <td className="py-3 px-4 text-right text-white font-mono">{fmt(entry.totalScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!entries.length && !podium.length && <p className="text-center py-6 text-[#98A5BF]">No entries on this page.</p>}
            </div>
            <div className="flex justify-between items-center gap-3 pt-5">
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(current => Math.max(0, current - PAGE_SIZE))}>Previous</Button>
              <span className="text-xs text-[#98A5BF]">Page {offset / PAGE_SIZE + 1}</span>
              <Button variant="outline" size="sm" disabled={offset + PAGE_SIZE >= data.totalPlayers || offset + PAGE_SIZE > 1000} onClick={() => setOffset(current => current + PAGE_SIZE)}>Next</Button>
            </div>
          </Card>
        </>
      ) : null}
      <p className="text-center text-xs text-[#64748B] max-w-3xl mx-auto">B2C accounts and Provider game identities are separate. A public ranking cannot be attributed to your B2C profile without a verified identity mapping.</p>
    </div>
  );
};
