import { api } from '@/lib/api'
import {
  DepositAddress,
  Wallet,
  WalletBalances,
  WalletTransaction,
  WalletTransactions,
  WithdrawFundPayload,
} from '@/lib/types/wallet'

class WalletService {
  async getWallet() {
    const response = await api.get<Wallet>('/wallet')
    return response.data
  }

  async getWalletBalances() {
    const response = await api.get<WalletBalances>('/wallet/balance')
    return response.data
  }

  async getDepositAddress() {
    const response = await api.get<DepositAddress>('/wallet/deposit-address')
    return response.data
  }

  async getTransactions() {
    const response = await api.get<WalletTransactions>('/wallet/transactions')
    return response.data
  }

  async withdrawFund(payload: WithdrawFundPayload) {
    const response = await api.post<WalletTransaction>(
      '/wallet/withdraw',
      payload
    )
    return response.data
  }
}

export const walletService = new WalletService()
