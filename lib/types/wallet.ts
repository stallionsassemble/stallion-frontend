export interface Wallet {
  id: string
  publicKey: string
  encryptedPrivateKey: string
  encryptedDataKey: string
  isActivated: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletBalances {
  balance: number
  availableBalance: number
  currency: string
}
;[]

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

export interface WithdrawFundPayload {
  amount: number
  currency: string
  destination: string
}
