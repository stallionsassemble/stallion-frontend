import { api } from '@/lib/api'
import {
  DepositAddress,
  PayoutMethod,
  PayoutMethodPayload,
  PayoutMethods,
  SyncWalletResponse,
  Wallet,
  WalletBalances,
  WalletTransaction,
  WalletTransactions,
  WalletTrustlineResponse,
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
    const response = await api.post('/wallet/withdraw', payload)
    return response.data
  }

  async syncWallet() {
    const response = await api.post<SyncWalletResponse>('/wallet/sync')
    return response.data
  }

  async setTrustline(currencyCode: string) {
    const response = await api.post<WalletTrustlineResponse>(
      '/wallet/trustline',
      { currencyCode }
    )
    return response.data
  }

  // Payout Methods
  async createPayoutMethod(payload: PayoutMethodPayload) {
    const response = await api.post<PayoutMethod>(
      '/wallet/payout-methods',
      payload
    )
    return response.data
  }

  async getPayoutMethods() {
    const response = await api.get<PayoutMethods>('/wallet/payout-methods')
    return response.data
  }

  async defaultPayoutMethod() {
    const response = await api.get<PayoutMethod>(
      '/wallet/payout-methods/default'
    )
    return response.data
  }

  async getPayoutMethod(id: string) {
    const response = await api.get<PayoutMethod>(`/wallet/payout-methods/${id}`)
    return response.data
  }

  async updatePayoutMethod(id: string, payload: PayoutMethodPayload) {
    const response = await api.patch<PayoutMethod>(
      `/wallet/payout-methods/${id}`,
      payload
    )
    return response.data
  }

  async deletePayoutMethod(id: string) {
    const response = await api.delete<{ message: string }>(
      `/wallet/payout-methods/${id}`
    )
    return response.data
  }
}

export const walletService = new WalletService()
