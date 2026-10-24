/** The Provider leaderboard contains pseudonymous operator-scoped identities, not B2C usernames. */
export interface LeaderboardEntry {
  rank: number;
  player: { label: string };
  wins: number;
  draws: number;
  rounds: number;
  bestScore: number;
  totalScore: number;
}

export interface LeaderboardListing {
  scope: 'global' | 'game';
  gameId: string | null;
  sort: 'wins' | 'best_score';
  limit: number;
  offset: number;
  totalPlayers: number;
  entries: LeaderboardEntry[];
}

const nonnegative = (x: unknown) => Number.isSafeInteger(x) && (x as number) >= 0;
export const PAGE_SIZE = 20;

export function validateLeaderboardListing(value: unknown, expectedGameId: string | null, offset: number): LeaderboardListing {
  if (!value || typeof value !== 'object') throw new Error('Invalid leaderboard response.');
  const list = value as LeaderboardListing;
  if (list.scope !== (expectedGameId ? 'game' : 'global') ||
      list.gameId !== expectedGameId ||
      list.sort !== (expectedGameId ? 'best_score' : 'wins') ||
      list.offset !== offset || list.limit !== PAGE_SIZE ||
      !nonnegative(list.totalPlayers) || !Array.isArray(list.entries) || list.entries.length > PAGE_SIZE) {
    throw new Error('Invalid leaderboard metadata.');
  }
  for (let i = 0; i < list.entries.length; i += 1) {
    const entry = list.entries[i];
    if (!entry || entry.rank !== offset + i + 1 ||
        !entry.player || typeof entry.player.label !== 'string' ||
        !/^Player-[a-f0-9]{10}$/.test(entry.player.label) ||
        ![entry.wins, entry.draws, entry.rounds, entry.bestScore, entry.totalScore].every(nonnegative) ||
        entry.wins + entry.draws > entry.rounds) {
      throw new Error('Invalid leaderboard entry.');
    }
  }
  return list;
}

export function getLeaderboardQuery(gameId: string | null, offset: number) {
  if (gameId && !/^[a-z0-9-]{2,64}$/.test(gameId)) throw new Error('Invalid game ID.');
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 1000 || offset % PAGE_SIZE !== 0) {
    throw new Error('Invalid leaderboard page.');
  }
  return { path: gameId ? `/leaderboards/games/${gameId}` : '/leaderboards/global',
    query: { limit: PAGE_SIZE, offset } };
}
