import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const COINGECKO_IDS: Record<string, string> = {
  XLM: 'stellar',
  ETH: 'ethereum',
  BTC: 'bitcoin',
  SOL: 'solana',
  USDC: 'usd-coin',
}

const fetchPrice = async (currency: string) => {
  const symbol = currency.toUpperCase()

  // Stablecoins / Fiat
  if (['USD', 'USDC', 'USGLO'].includes(symbol)) {
    return 1
  }

  const id = COINGECKO_IDS[symbol]
  if (!id) {
    console.warn(`No CoinGecko ID found for currency: ${currency}`)
    return 0 // Or return mock/fallback
  }

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
    )
    return data[id].usd
  } catch (error) {
    console.error('Failed to fetch price, using fallback', error)
    return symbol === 'XLM' ? 0.12 : 0 // Specific fallback for demo
  }
}

export function useCryptoPrice(currency: string = 'XLM') {
  return useQuery({
    queryKey: ['price', currency],
    queryFn: () => fetchPrice(currency),
    staleTime: 60000, // 1 minute
    enabled: !!currency,
  })
}
