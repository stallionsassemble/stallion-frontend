export interface Currency {
  code: string
  name: string
  tokenAddress: string
  decimals: number
}

export type Currencies = Currency[]
