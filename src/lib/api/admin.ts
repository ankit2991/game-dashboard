import { apiRequest } from './client';

/** Browser admin authentication uses short-lived bearer sessions, never server administration keys. */
export interface AdminProfile { id: string; name: string; email: string; role: 'super_admin' }
export interface AdminSession { user: AdminProfile; accessToken: string; refreshToken: string;
  tokenType: 'Bearer'; expiresIn: number; refreshExpiresAt: string }
export interface AdminOperator { id: string; email: string; companyName: string; contactPerson: string;
  website: string; phone: string; country: string; businessType: string;
  registrationNumber: string; status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string; updatedAt: string; partnerProvisioned: boolean }
export interface AdminOverview {
  generatedAt: string;
  operators: {total: number; pending: number; approved: number; rejected: number; suspended: number};
  players: {registered: number | null};
  games: {total: number; enabled: number; disabled: number; providerLaunchConfigured: number; singlePlayer: number; multiplayer: number};
  pendingApplications: {id: string; companyName: string; email: string; createdAt: string; status: string}[];
  financialMetricsAvailable: false;
  historicalMetricsAvailable: false;
}
export interface AdminGame {
  gameId: string; name: string; gameMode: 'single_player' | 'multiplayer'; order: number;
  enabled: boolean; demoUrl: string | null; integrationStatus: string; providerLaunchAvailable: boolean;
}
export interface AdminSettings {
  editableInPortal: false; configurationSource: 'server_environment'; environment: string;
  storeBackend: 'sqlite' | 'mongodb'; liveMoneySupported: false; corsOriginCount: number;
  features: Record<'b2cAuth'|'operatorAuth'|'partnerManagement'|'leaderboards'|'leaderboardSubmissions'|
    'providerLaunch'|'sandboxWalletTransactions'|'adminPortal', boolean>;
}
export type AdminDecision = 'approve' | 'reject' | 'suspend' | 'reopen';
export const adminApi = {
  login: (email: string, password: string) => apiRequest<AdminSession>('/admin/auth/login', {method: 'POST', body: {email, password}}),
  refresh: (refreshToken: string) => apiRequest<AdminSession>('/admin/auth/refresh', {method: 'POST', body: {refreshToken}}),
  logout: (refreshToken: string) => apiRequest<{revoked: boolean}>('/admin/auth/logout', {method: 'POST', body: {refreshToken}}),
  me: (accessToken: string) => apiRequest<{user: AdminProfile}>('/admin/me', {accessToken}),
  overview: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<AdminOverview>('/admin/portal/overview', {accessToken, signal}),
  games: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<{games: AdminGame[]}>('/admin/portal/games', {accessToken, signal}),
  settings: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<AdminSettings>('/admin/portal/settings', {accessToken, signal}),
  operators: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<{operators: AdminOperator[]; total: number}>('/admin/portal/operators', {accessToken, signal}),
  decision: (accessToken: string, id: string, action: AdminDecision) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('Invalid operator ID');
    return apiRequest<{operator: AdminOperator}>(`/admin/portal/operators/${id}/${action}`, {method: 'POST', accessToken});
  },
};
