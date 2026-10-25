import { apiRequest } from './client';

/** Browser admin authentication uses short-lived bearer sessions, never server administration keys. */
export interface AdminProfile { id: string; name: string; email: string; role: 'super_admin' }
export interface AdminSession { user: AdminProfile; accessToken: string; refreshToken: string;
  tokenType: 'Bearer'; expiresIn: number; refreshExpiresAt: string }
export interface AdminOperator { id: string; email: string; companyName: string; contactPerson: string;
  website: string; phone: string; country: string; businessType: string;
  registrationNumber: string; status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string; updatedAt: string; partnerProvisioned: boolean;
  partnerId?: string | null; partnerStatus?: 'active' | 'suspended' | null;
  selectedGames?: string[]; allowedGames?: string[]; syncRequired?: boolean;
  rotationRequestedAt?: string | null; keyRotatedAt?: string | null; partnerAccessPaused?: boolean;
  credentialClaimedAt?: string | null; gamesRequestedAt?: string | null;
  wallet?: { configured: boolean; status: 'not_configured' | 'pending' | 'verified' | 'failed' | 'rejected'; host: string | null; verifiedAt: string | null; failureCode: string | null } }
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
export interface AdminIntegrationReport {
  scope: 'configuration_only'; liveMoneySupported: false;
  wallet: {configurationReady: boolean; remoteBalanceVerified: false; blockers: string[]; walletWritesEnabled: boolean; balanceProvider?: 'provider_sandbox' | 'operator_sandbox_or_unavailable'};
  games: {gameId: string; name: string; catalogEnabled: boolean; providerConfigurationReady: boolean;
    adapterKeyConfigured?: boolean; gameBackendUrlConfigured?: boolean; adapterHandshakeVerified?: false; gameBackendReachableVerified?: false;
    browserGameWalletE2eVerified: false; status: 'configuration_blocked' | 'awaiting_game_backend_e2e'; blockers: string[]}[];
}
export interface AdminSettings {
  editableInPortal: false; configurationSource: 'server_environment'; environment: string;
  storeBackend: 'sqlite' | 'mongodb'; liveMoneySupported: false; corsOriginCount: number;
  features: Record<'b2cAuth'|'operatorAuth'|'partnerManagement'|'leaderboards'|'leaderboardSubmissions'|
    'providerLaunch'|'sandboxWalletTransactions'|'adminPortal', boolean>;
}
export interface AdminPlayer {id:string; email:string; username:string; displayName:string; locale:string; createdAt:string}
export interface AdminPlayersPage {total:number; players:AdminPlayer[]}
export interface AdminTransaction {transaction_id:string; partner_id:string; game_id:string; operation:string; amount_minor:number;
  currency:string; status:string; created_ms:number; updated_ms:number}
export interface AdminTransactionsPage {total:number; rows:AdminTransaction[]; sandboxOnly:true}
export type AdminDecision = 'approve' | 'reject' | 'suspend' | 'reopen';
export type AdminKeyAction = 'provision' | 'sync-games' | 'rotate-key' | 'suspend-key' | 'activate-key' | 'verify-wallet' | 'reject-wallet';
export interface AdminPartner { id:string; displayName:string; allowedGames:string[]; status:'active'|'suspended'; walletConfigured:boolean }
export interface AdminKeyActionResult { partner?: AdminPartner; wallet?: {status: string}; apiKey?:string; keyShownOnce?:true;
  operator?:AdminOperator; note?:string }

export const adminApi = {
  login: (email: string, password: string) => apiRequest<AdminSession>('/admin/auth/login', {method: 'POST', body: {email, password}}),
  refresh: (refreshToken: string) => apiRequest<AdminSession>('/admin/auth/refresh', {method: 'POST', body: {refreshToken}}),
  logout: (refreshToken: string) => apiRequest<{revoked: boolean}>('/admin/auth/logout', {method: 'POST', body: {refreshToken}}),
  me: (accessToken: string) => apiRequest<{user: AdminProfile}>('/admin/me', {accessToken}),
  overview: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<AdminOverview>('/admin/portal/overview', {accessToken, signal}),
  games: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<{games: AdminGame[]}>('/admin/portal/games', {accessToken, signal}),
  integrations: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<AdminIntegrationReport>('/admin/portal/integrations', {accessToken, signal}),
  settings: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<AdminSettings>('/admin/portal/settings', {accessToken, signal}),
  players: (accessToken: string, limit = 20, offset = 0, signal?: AbortSignal) =>
    apiRequest<AdminPlayersPage>('/admin/portal/players', {accessToken, signal, query:{limit,offset}}),
  transactions: (accessToken: string, limit = 20, offset = 0, signal?: AbortSignal) =>
    apiRequest<AdminTransactionsPage>('/admin/portal/transactions', {accessToken, signal, query:{limit,offset}}),
  operators: (accessToken: string, signal?: AbortSignal) =>
    apiRequest<{operators: AdminOperator[]; total: number}>('/admin/portal/operators', {accessToken, signal}),
  manageKey: (accessToken: string, id: string, action: AdminKeyAction, password?:string) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('Invalid operator ID');
    if (['provision','rotate-key','activate-key','verify-wallet','reject-wallet'].includes(action) && !password) {
      throw new Error('Administrator password is required.');
    }
    return apiRequest<AdminKeyActionResult>(`/admin/portal/operators/${id}/${action}`,
      {method:'POST', accessToken, ...(password ? {body:{password}} : {})});
  },
  decision: (accessToken: string, id: string, action: AdminDecision) => {
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('Invalid operator ID');
    return apiRequest<{operator: AdminOperator}>(`/admin/portal/operators/${id}/${action}`, {method: 'POST', accessToken});
  },
};
