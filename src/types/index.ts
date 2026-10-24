export type Environment = 'sandbox' | 'production' | 'staging';

export type UserStatus = 'active' | 'suspended' | 'pending' | 'inactive';

export type VerificationStatus = 'verified' | 'unverified' | 'pending';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  registeredAt: string;
  lastLogin: string;
  status: UserStatus;
  verificationStatus: VerificationStatus;
  walletBalance: number;
  totalWagered: number;
  totalWon: number;
  country: string;
  currency: string;
}

export type OperatorApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Operator {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  country: string;
  registrationNumber?: string;
  registeredAt: string;
  approvalStatus: OperatorApprovalStatus;
  accountStatus: 'active' | 'disabled' | 'suspended' | 'pending';
  integratedGamesCount: number;
  monthlyApiRequests: number;
  apiSuccessRate: number;
  totalGmv: number;
  sandboxEnabled: boolean;
  productionEnabled: boolean;
  notes?: string;
}

export interface GameProvider {
  id: string;
  name: string;
  code: string;
  logo: string;
  description: string;
  categories: string[];
  totalGames: number;
  activeGames: number;
  status: 'active' | 'maintenance' | 'inactive';
  integrationStatus: 'connected' | 'configuring' | 'disconnected';
  latencyMs: number;
  uptimePercent: number;
  apiEndpointMock: string;
  supportedCurrencies: string[];
}

export type GameCategory = 'slots' | 'arcade' | 'table' | 'card' | 'live' | 'casual' | 'strategy';

export interface Game {
  id: string;
  title: string;
  slug: string;
  providerId: string;
  providerName: string;
  category: GameCategory;
  thumbnail: string;
  bannerImage: string;
  description: string;
  rtp: number; // Return to player %
  volatility: 'Low' | 'Medium' | 'High' | 'Very High';
  featured: boolean;
  popular: boolean;
  isNew: boolean;
  status: 'active' | 'maintenance' | 'disabled';
  platforms: ('desktop' | 'mobile' | 'tablet')[];
  minBet: number;
  maxBet: number;
  playCount: number;
  rating: number;
  releaseDate: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  maskedSecret: string;
  operatorId: string;
  operatorName: string;
  environment: Environment;
  createdAt: string;
  lastUsedAt: string;
  status: 'active' | 'revoked' | 'expired';
  ipAllowlist: string[];
  rateLimitPerMin: number;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'refund' | 'operator_settlement';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing';

export interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  operatorId?: string;
  operatorName?: string;
  gameId?: string;
  gameTitle?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  timestamp: string;
  paymentMethod?: string;
  referenceId: string;
  note?: string;
}

export interface AdminKPIMetrics {
  totalPlayers: number;
  activePlayersToday: number;
  totalOperators: number;
  pendingOperatorApprovals: number;
  totalAvailableGames: number;
  activeGameProviders: number;
  totalApiRequestsToday: number;
  apiSuccessRate: number;
  failedApiRequestsToday: number;
  totalGmv: number;
  platformRevenue: number;
  systemHealthPercent: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  actor: string;
  role: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}
