export interface Wallet {
  id: string
  publicKey: string
  encryptedPrivateKey: string
  encryptedDataKey: string
  isActivated: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletBalanceItem {
  balance: number
  availableBalance: number
  currency: string
  asset_type?: string
}

export interface WalletBalances {
  balances: WalletBalanceItem[]
}

export interface DepositAddress {
  address: string
  instructions: string
  activated: boolean
}

export interface WalletTransaction {
  id: string
  type: string
  amount: string
  currency: string
  state: string
  externalTxId: string
  idempotencyKey: string
  note: string
  metadata: {
    lockId: string
    destination: string
  }
  createdAt: string
  updatedAt: string
  walletId: string
}

export type WalletTransactions = WalletTransaction[]

export interface SyncWalletResponse {
  synced: boolean
  activated: boolean
  transactionsSynced: boolean
}

export interface WalletTrustlineResponse {
  success: boolean
  txHash: string
  message: string
}

export interface WithdrawFundPayload {
  amount: number
  currency: string
  payoutMethodId: string
}

export interface PayoutMethodPayload {
  name: string
  publicKey: string
  isDefault: boolean
}

export interface PayoutMethod {
  id: string
  name: string
  publicKey: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type PayoutMethods = PayoutMethod[]
