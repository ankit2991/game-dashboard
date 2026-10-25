/** Backend-owned, read-only sandbox activity. Never derive a balance from ledger deltas. */
export interface WalletOverview {
  mode: 'sandbox_only';
  configured: boolean;
  balanceMinor: number | null;
  currency: 'COIN' | null;
  decimals: 0 | null;
  balanceStatus: 'unavailable' | 'verified';
  balanceSource?: 'operator_sandbox' | 'provider_sandbox' | null;
  canDeposit: false;
  canWithdraw: false;
  transactionHistoryAvailable: boolean;
  configurationBlockers?: string[];
}
export type WalletOperation = 'bet' | 'win' | 'refund' | 'loss';
export type WalletTransactionStatus = 'succeeded' | 'rejected' | 'inflight' | 'indeterminate';
export interface PlayerWalletTransaction {
  transactionId: string;
  gameId: string;
  operation: WalletOperation;
  amountMinor: number;
  currency: string;
  status: WalletTransactionStatus;
  createdAt: string;
  updatedAt: string;
}
export interface PlayerTransactionPage {
  source: 'provider_ledger';
  mode: 'sandbox_only';
  configured: boolean;
  limit: number;
  offset: number;
  total: number;
  transactions: PlayerWalletTransaction[];
}
export const TRANSACTION_PAGE_SIZE = 20;
export type TransactionFilters = { operation: WalletOperation | 'all'; status: WalletTransactionStatus | 'all' };
export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = { operation: 'all', status: 'all' };

export function transactionQuery(offset: number, filters: TransactionFilters = DEFAULT_TRANSACTION_FILTERS) {
  const page = transactionPaging(offset);
  if (!['all', 'bet', 'win', 'refund', 'loss'].includes(filters.operation) ||
      !['all', 'succeeded', 'rejected', 'inflight', 'indeterminate'].includes(filters.status)) {
    throw new Error('Invalid transaction filters');
  }
  return { ...page, ...(filters.operation === 'all' ? {} : { operation: filters.operation }),
    ...(filters.status === 'all' ? {} : { status: filters.status }) };
}


export function transactionPaging(offset: number) {
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000 || offset % TRANSACTION_PAGE_SIZE !== 0) {
    throw new Error('Invalid transaction offset');
  }
  return { limit: TRANSACTION_PAGE_SIZE, offset };
}
/** The header must display only the backend-verified sandbox balance, never a profile/demo value. */
export function verifiedCoinBalanceLabel(wallet: WalletOverview | null, loading = false): string {
  if (loading) return 'Checking…';
  if (wallet?.balanceStatus !== 'verified' || wallet.currency !== 'COIN' ||
      wallet.decimals !== 0 || !Number.isSafeInteger(wallet.balanceMinor) ||
      wallet.balanceMinor === null || wallet.balanceMinor < 0) return 'Unavailable';
  return `${wallet.balanceMinor.toLocaleString('en-US')} COIN`;
}

export function amountLabel(amountMinor: number, currency: string) {
  // We do not have an API contract for decimal places per historical currency.
  // Print canonical minor units instead of incorrectly treating COIN or MYR as cents.
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0 || !/^[A-Z0-9]{3,8}$/.test(currency)) return 'Unavailable';
  return `${amountMinor.toLocaleString('en-US')} ${currency} (minor units)`;
}
/** A bot-loss is a zero-value ledger record, NOT a debit from the player's wallet. */
export function transactionOperationLabel(operation: WalletOperation): string {
  return operation === 'loss' ? 'Bot loss (record only)' : operation;
}

/** Preserve stored minor units; never infer wallet deltas from transaction history. */
export function transactionAmountLabel(transaction: Pick<PlayerWalletTransaction, 'operation' | 'amountMinor' | 'currency'>): string {
  const label = amountLabel(transaction.amountMinor, transaction.currency);
  return transaction.operation === 'loss' && transaction.amountMinor === 0
    ? `${label} · no wallet movement` : label;
}

export function validateWalletOverview(data: WalletOverview): WalletOverview {
  if (!data || data.mode !== 'sandbox_only' || typeof data.configured !== 'boolean' ||
      !['unavailable', 'verified'].includes(data.balanceStatus) ||
      (data.balanceStatus === 'verified' ?
        (!data.configured || !Number.isSafeInteger(data.balanceMinor) || data.balanceMinor === null ||
         data.balanceMinor < 0 || data.currency !== 'COIN' || data.decimals !== 0 ||
         !['operator_sandbox', 'provider_sandbox'].includes(data.balanceSource ?? '')) :
        (data.balanceMinor !== null || data.currency !== null || data.decimals !== null ||
         (data.balanceSource !== null && data.balanceSource !== undefined))) ||
      data.canDeposit !== false || data.canWithdraw !== false ||
      data.transactionHistoryAvailable !== data.configured ||
      (data.configurationBlockers !== undefined &&
        (!Array.isArray(data.configurationBlockers) || data.configurationBlockers.some(v => typeof v !== 'string' || !/^[A-Z_]{3,64}$/.test(v)))))
      throw new Error('Invalid wallet summary response');
  return data;
}
export function validateTransactionPage(data: PlayerTransactionPage, offset: number, filters: TransactionFilters = DEFAULT_TRANSACTION_FILTERS): PlayerTransactionPage {
  if (!data || data.source !== 'provider_ledger' || data.mode !== 'sandbox_only' ||
      typeof data.configured !== 'boolean' || data.offset !== offset ||
      data.limit !== TRANSACTION_PAGE_SIZE || !Number.isSafeInteger(data.total) ||
      data.total < 0 || !Array.isArray(data.transactions) || data.transactions.length > TRANSACTION_PAGE_SIZE ||
      data.transactions.length > Math.max(0, data.total - offset)) {
    throw new Error('Invalid transaction history response');
  }
  for (const row of data.transactions) {
    if (!row || typeof row.transactionId !== 'string' || !/^[A-Za-z0-9_.:-]{8,128}$/.test(row.transactionId) ||
        typeof row.gameId !== 'string' || !/^[a-z0-9-]{2,64}$/.test(row.gameId) ||
        !['bet', 'win', 'refund', 'loss'].includes(row.operation) ||
        !['succeeded', 'rejected', 'inflight', 'indeterminate'].includes(row.status) ||
        (!Number.isSafeInteger(row.amountMinor) || (row.operation === 'loss' ? row.amountMinor !== 0 : row.amountMinor <= 0)) ||
        typeof row.currency !== 'string' || !/^[A-Z0-9]{3,8}$/.test(row.currency) ||
        !Number.isFinite(Date.parse(row.createdAt)) || !Number.isFinite(Date.parse(row.updatedAt)) ||
        (filters.operation !== 'all' && row.operation !== filters.operation) ||
        (filters.status !== 'all' && row.status !== filters.status)) {
      throw new Error('Invalid transaction record');
    }
  }
  return data;
}
