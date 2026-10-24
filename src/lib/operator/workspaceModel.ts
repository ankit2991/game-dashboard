import type { OperatorGame } from '../api/operator';

export function safeOperatorGames(games: OperatorGame[]): OperatorGame[] {
  if (!Array.isArray(games)) throw new Error('Invalid operator catalog.');
  const ids = new Set<string>();
  return games.filter((game) => {
    if (!game || typeof game.gameId !== 'string' || !/^[a-z0-9-]+$/.test(game.gameId) ||
        typeof game.name !== 'string' || !game.name.trim() || ids.has(game.gameId)) return false;
    ids.add(game.gameId);
    return true;
  }).sort((a, b) => a.order - b.order);
}
export function makeSelection(current: string[], id: string, available: OperatorGame[]): string[] {
  if (!available.some(g => g.gameId === id)) throw new Error('Unknown or disabled game.');
  return current.includes(id) ? current.filter(gameId => gameId !== id) : [...current, id];
}
