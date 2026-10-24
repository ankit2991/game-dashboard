import { apiRequest } from './client';

/** Operator portal identity only. Never contains partner or B2B admin secrets. */
export type OperatorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export interface OperatorProfile {
  id: string;
  email: string;
  companyName: string;
  contactPerson: string;
  website: string;
  phone: string;
  country: string;
  businessType: string;
  registrationNumber: string;
  status: OperatorStatus;
  createdAt: string;
  updatedAt: string;
  partnerProvisioned: boolean;
}
export interface OperatorRegisterRequest {
  companyName: string;
  website: string;
  email: string;
  contactPerson: string;
  phone: string;
  country: string;
  businessType: string;
  registrationNumber?: string;
  password: string;
  termsAccepted: true;
}
export interface OperatorSession {
  user: OperatorProfile;
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresAt: string;
}
export const operatorApi = {
  register: (fields: OperatorRegisterRequest) =>
    apiRequest<OperatorSession>('/operator/auth/register', { method: 'POST', body: fields }),
  login: (email: string, password: string) =>
    apiRequest<OperatorSession>('/operator/auth/login', { method: 'POST', body: { email, password } }),
  refresh: (refreshToken: string) =>
    apiRequest<OperatorSession>('/operator/auth/refresh', { method: 'POST', body: { refreshToken } }),
  logout: (refreshToken: string) =>
    apiRequest<{ revoked: boolean }>('/operator/auth/logout', { method: 'POST', body: { refreshToken } }),
  me: (accessToken: string) =>
    apiRequest<{ user: OperatorProfile }>('/operator/me', { accessToken }),
};

/** No private Partner API key is ever returned by these browser endpoints. */
export interface OperatorGame {
  gameId: string; name: string; gameMode: 'single_player' | 'multiplayer';
  providerLaunchAvailable: boolean; integrationStatus: string; demoUrl: string | null; order: number;
}
export interface OperatorCredentials {
  provisioned: boolean;
  partner: null | { id: string; displayName: string; allowedGames: string[]; status: string;
    source: string; walletConfigured: boolean; createdAt: string | null; updatedAt: string | null };
  selectedGames: string[]; syncRequired: boolean; rotationRequestedAt: string | null;
  keyRetrievableInBrowser: false; liveMoneySupported: false;
}
export const operatorWorkspaceApi = {
  catalog: (token: string, signal?: AbortSignal) =>
    apiRequest<{ games: OperatorGame[]; selectedGames: string[] }>('/operator/catalog', { accessToken: token, signal }),
  myGames: (token: string, signal?: AbortSignal) =>
    apiRequest<{ selectedGames: string[] }>('/operator/games', { accessToken: token, signal }),
  selectGames: (token: string, gameIds: string[]) =>
    apiRequest<{ selectedGames: string[]; note: string }>('/operator/games', { method: 'POST', body: { gameIds }, accessToken: token }),
  credentials: (token: string, signal?: AbortSignal) =>
    apiRequest<OperatorCredentials>('/operator/credentials', { accessToken: token, signal }),
  requestRotation: (token: string) =>
    apiRequest<{ rotationRequestedAt: string; pending: true }>('/operator/credentials/rotation-request', { method: 'POST', body: {}, accessToken: token }),
};


/** Patch 9: browser-safe, tenant-scoped operator operations. */
export type TeamRole = 'Developer' | 'Finance' | 'Operations';
export interface TeamDraft { id: string; name: string; email: string; role: TeamRole; status: 'draft'; createdAt: string }
export interface WebhookDraft { url: string; events: string[]; configured: boolean; deliveryEnabled: false;
  signingSecretIssued: false; deliveryHistory: []; note: string }
export interface OperatorLedgerTx { transactionId: string; playerId: string; gameId: string;
  operation: 'bet' | 'win' | 'refund'; amountMinor: number; currency: string;
  status: 'succeeded' | 'rejected' | 'inflight' | 'indeterminate'; createdAt: string; updatedAt: string }
export interface OperatorLedgerPage { transactions: OperatorLedgerTx[]; total: number; limit: number;
  offset: number; configured: boolean; mode: 'sandbox_only'; source: string }
export interface OperatorActivity { id: string; occurredAt: string; type: string; status: string; gameId: string }
export interface OperatorActivityPage { entries: OperatorActivity[]; total: number; limit: number;
  offset: number; configured: boolean; source: string; rawHttpLogsAvailable?: false }
export const operatorOperationsApi = {
  team: (token: string, signal?: AbortSignal) =>
    apiRequest<{ members: TeamDraft[]; invitationsSent: false; teamLoginEnabled: false }>('/operator/team', { accessToken: token, signal }),
  addTeamDraft: (token: string, draft: { name: string; email: string; role: TeamRole }) =>
    apiRequest<{ member: TeamDraft; invitationSent: false; accessGranted: false }>('/operator/team', { method: 'POST', accessToken: token, body: draft }),
  removeTeamDraft: (token: string, id: string) =>
    apiRequest<{ removed: true }>('/operator/team/remove', { method: 'POST', accessToken: token, body: { id } }),
  webhooks: (token: string, signal?: AbortSignal) =>
    apiRequest<WebhookDraft>('/operator/webhooks', { accessToken: token, signal }),
  saveWebhook: (token: string, url: string, events: string[]) =>
    apiRequest<WebhookDraft>('/operator/webhooks', { method: 'POST', accessToken: token, body: { url, events } }),
  transactions: (token: string, limit: number, offset: number, signal?: AbortSignal) =>
    apiRequest<OperatorLedgerPage>('/operator/transactions', { accessToken: token, query: { limit, offset }, signal }),
  logs: (token: string, limit: number, offset: number, signal?: AbortSignal) =>
    apiRequest<OperatorActivityPage>('/operator/logs', { accessToken: token, query: { limit, offset }, signal }),
};
