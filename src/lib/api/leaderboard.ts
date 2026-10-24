import { apiRequest } from './client';
import { getLeaderboardQuery, validateLeaderboardListing } from '../leaderboard/leaderboardModel';

export const leaderboardApi = {
  list: async (gameId: string | null, offset = 0, signal?: AbortSignal) => {
    const { path, query } = getLeaderboardQuery(gameId, offset);
    const response = await apiRequest<unknown>(path, { query, signal });
    return validateLeaderboardListing(response, gameId, offset);
  },
};
