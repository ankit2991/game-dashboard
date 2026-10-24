import { apiRequest } from './client';
import {
  transactionPaging, validateTransactionPage, validateWalletOverview,
  type PlayerTransactionPage, type WalletOverview,
} from '../wallet/walletModel';

export const walletApi = {
  overview: async (accessToken: string, signal?: AbortSignal) =>
    validateWalletOverview(await apiRequest<WalletOverview>('/player/wallet', { accessToken, signal })),
  transactions: async (accessToken: string, offset = 0, signal?: AbortSignal): Promise<PlayerTransactionPage> =>
    validateTransactionPage(await apiRequest<PlayerTransactionPage>('/player/transactions', {
      accessToken, signal, query: transactionPaging(offset),
    }), offset),
};
