/** Public B2C usernames when verified, otherwise operator-scoped anonymous labels. */
export interface LeaderboardEntry {
  rank: number;
  player: { label: string };
  winningRounds: number;
  bestPayoutMinor: number;
  totalPayoutMinor: number;
}

export interface LeaderboardListing {
  scope: 'global' | 'game';
  gameId: string | null;
  sort: 'best_payout_minor';
  currency: 'COIN';
  decimals: 0;
  source: 'confirmed_wallet_ledger';
  limit: number;
  offset: number;
  totalPlayers: number;
  entries: LeaderboardEntry[];
}

const nonnegative = (x: unknown) => Number.isSafeInteger(x) && (x as number) >= 0;
const publicPlayerLabel = (label: string) =>
  /^[a-zA-Z0-9_]{3,24}$/.test(label) || /^Player-[a-f0-9]{10}$/.test(label);
export const PAGE_SIZE = 20;

export function validateLeaderboardListing(value: unknown, expectedGameId: string | null, offset: number): LeaderboardListing {
  if (!value || typeof value !== 'object') throw new Error('Invalid leaderboard response.');
  const list = value as LeaderboardListing;
  if (list.scope !== (expectedGameId ? 'game' : 'global') ||
      list.gameId !== expectedGameId || list.sort !== 'best_payout_minor' ||
      list.currency !== 'COIN' || list.decimals !== 0 || list.source !== 'confirmed_wallet_ledger' ||
      list.offset !== offset || list.limit !== PAGE_SIZE ||
      !nonnegative(list.totalPlayers) || !Array.isArray(list.entries) || list.entries.length > PAGE_SIZE ||
      (list.entries.length > 0 && offset + list.entries.length > list.totalPlayers)) {
    throw new Error('Invalid leaderboard metadata.');
  }
  for (let i = 0; i < list.entries.length; i += 1) {
    const entry = list.entries[i];
    if (!entry || entry.rank !== offset + i + 1 ||
        !entry.player || typeof entry.player.label !== 'string' ||
        !publicPlayerLabel(entry.player.label) ||
        ![entry.winningRounds, entry.bestPayoutMinor, entry.totalPayoutMinor].every(nonnegative) ||
        entry.winningRounds < 1 || entry.bestPayoutMinor < 1 ||
        entry.totalPayoutMinor < entry.bestPayoutMinor ||
        Object.keys(entry).some(k => !['rank','player','winningRounds','bestPayoutMinor','totalPayoutMinor'].includes(k))) {
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
