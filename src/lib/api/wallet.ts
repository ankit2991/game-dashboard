import { apiRequest } from './client';
import {
  transactionQuery, validateTransactionPage, validateWalletOverview,
  DEFAULT_TRANSACTION_FILTERS, type TransactionFilters,
  type PlayerTransactionPage, type WalletOverview,
} from '../wallet/walletModel';

export const walletApi = {
  overview: async (accessToken: string, signal?: AbortSignal) =>
    validateWalletOverview(await apiRequest<WalletOverview>('/player/wallet', { accessToken, signal })),
  transactions: async (accessToken: string, offset = 0, signal?: AbortSignal,
    filters: TransactionFilters = DEFAULT_TRANSACTION_FILTERS): Promise<PlayerTransactionPage> =>
    validateTransactionPage(await apiRequest<PlayerTransactionPage>('/player/transactions', {
      accessToken, signal, query: transactionQuery(offset, filters),
    }), offset, filters),
};
