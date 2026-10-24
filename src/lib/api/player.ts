import { apiRequest } from './client';

/** B2C player credentials only; partner and admin credentials never reach this client. */
export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  locale: string;
  createdAt: string;
}

export interface PlayerSessionResponse {
  user: PlayerProfile;
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresAt: string;
}

export interface PlayerRegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
  locale?: string;
}

export const playerApi = {
  register: (fields: PlayerRegisterRequest) =>
    apiRequest<PlayerSessionResponse>('/auth/register', { method: 'POST', body: fields }),
  login: (identifier: string, password: string) =>
    apiRequest<PlayerSessionResponse>('/auth/login', { method: 'POST', body: { identifier, password } }),
  refresh: (refreshToken: string) =>
    apiRequest<PlayerSessionResponse>('/auth/refresh', { method: 'POST', body: { refreshToken } }),
  me: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<{ user: PlayerProfile }>('/users/me', { accessToken, signal }),
  updateProfile: (accessToken: string, changes: { displayName?: string; locale?: string }) =>
    apiRequest<{ user: PlayerProfile }>('/users/me', { method: 'PATCH', accessToken, body: changes }),
  logout: (refreshToken: string) =>
    apiRequest<{ revoked: boolean }>('/auth/logout', { method: 'POST', body: { refreshToken } }),
  logoutAll: (accessToken: string) =>
    apiRequest<{ revoked: boolean }>('/auth/logout-all', { method: 'POST', accessToken }),
};
