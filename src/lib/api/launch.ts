import { apiRequest } from './client';
import type { BrowserGameLaunch, LaunchMode } from '../launch/launchModel';
export { validateLaunchResponse } from '../launch/launchModel';
export type { BrowserGameLaunch, LaunchMode } from '../launch/launchModel';

/** B2C endpoint intentionally never accepts a user-supplied player ID or partner credential. */
export const launchApi = {
  start: (gameId: string, mode: LaunchMode, options: { accessToken?: string; signal?: AbortSignal } = {}) =>
    apiRequest<BrowserGameLaunch>('/player/launch', {
      method: 'POST', body: { gameId, mode }, accessToken: options.accessToken, signal: options.signal,
    }),
};
