import type { ProviderGame } from '../api/types';

/** Display-only art and genre labels, never game availability or financial claims. */
export const catalogArtwork: Record<string, { genre: string; blurb: string; accent: string; symbol: string }> = {
  pinball: { genre: 'Arcade', blurb: 'Classic physics-based pinball action.', accent: '#7C5CFC', symbol: '◉' },
  'whack-a-mole': { genre: 'Arcade', blurb: 'Fast reactions and timed targets.', accent: '#FFB547', symbol: '✦' },
  galaga: { genre: 'Shooter', blurb: 'Arcade-inspired space shooting.', accent: '#00D4FF', symbol: '✧' },
  'liars-dice': { genre: 'Dice', blurb: 'Bluffing and dice-based multiplayer.', accent: '#20C997', symbol: '⚄' },
  'ship-captain-crew': { genre: 'Dice', blurb: 'A multiplayer dice challenge.', accent: '#A885FF', symbol: '⚓' },
  bomberboy: { genre: 'Arcade', blurb: 'Navigate danger in an arcade-style challenge.', accent: '#FF5D73', symbol: '✹' },
  'tower-rush': { genre: 'Skill', blurb: 'Stack platforms with precision and timing.', accent: '#F59E0B', symbol: '▥' },
};

const fallbackArtwork = { genre: 'Game', blurb: 'Explore this game in the provider catalog.', accent: '#00D4FF', symbol: '◆' };
export function getCatalogArtwork(gameId: string) {
  return Object.prototype.hasOwnProperty.call(catalogArtwork, gameId) ? catalogArtwork[gameId] : fallbackArtwork;
}

/** Never accept JS/data URLs from catalog responses or convert them into browser links. */
export function getSafeDemoUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null;
    return parsed.href;
  } catch { return null; }
}

/** Fail closed if an API response is not a valid public catalog. */
export function normalizeCatalog(input: unknown): ProviderGame[] {
  if (!Array.isArray(input)) throw new Error('Invalid games catalog response');
  const ids = new Set<string>();
  return input.map((raw: unknown) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid game entry');
    const game = raw as Record<string, unknown>;
    if (typeof game.gameId !== 'string' || !/^[a-z0-9-]{2,64}$/.test(game.gameId) || ids.has(game.gameId) ||
        typeof game.name !== 'string' || !game.name.trim() || game.name.length > 150 ||
        !Number.isSafeInteger(game.order) || (game.order as number) < 0 ||
        !['single_player', 'multiplayer'].includes(String(game.gameMode)) ||
        (game.demoUrl !== null && typeof game.demoUrl !== 'string') ||
        typeof game.integrationStatus !== 'string' || typeof game.providerLaunchAvailable !== 'boolean') {
      throw new Error('Invalid game entry');
    }
    ids.add(game.gameId);
    return {
      gameId: game.gameId,
      name: game.name,
      order: game.order as number,
      gameMode: game.gameMode as ProviderGame['gameMode'],
      demoUrl: game.demoUrl as string | null,
      integrationStatus: game.integrationStatus,
      providerLaunchAvailable: game.providerLaunchAvailable,
    } as ProviderGame;
  }).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export type GameFilter = 'all' | 'single_player' | 'multiplayer';
export type GameSort = 'order' | 'az' | 'za';

export function filterCatalog(games: ProviderGame[], search: string, filter: GameFilter, sort: GameSort): ProviderGame[] {
  const query = search.trim().toLocaleLowerCase();
  const entries = games.filter((game) =>
    (filter === 'all' || game.gameMode === filter) &&
    (!query || game.name.toLocaleLowerCase().includes(query) || getCatalogArtwork(game.gameId).genre.toLocaleLowerCase().includes(query))
  );
  return entries.sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : sort === 'za' ? b.name.localeCompare(a.name) : a.order - b.order);
}
