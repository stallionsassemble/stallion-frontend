import axios from 'axios'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

// Map our internal currency codes to CoinGecko IDs
const CURRENCY_ID_MAP: Record<string, string> = {
  xlm: 'stellar',
  usdc: 'usd-coin',
  eurc: 'euro-coin', // Approximate/Verify if exists, fallback to euro buffer
  btc: 'bitcoin',
  eth: 'ethereum',
  // Stablecoins often peg to 1, but fetching ensures accuracy if depegged
  usd: 'usd-coin', // Fallback for plain USD to USDC price or just 1
}

export interface PriceMap {
  [currency: string]: number
}

export const priceService = {
  async getPrices(currencies: string[]): Promise<PriceMap> {
    const ids = currencies
      .map((c) => CURRENCY_ID_MAP[c.toLowerCase()])
      .filter(Boolean)

    // Deduplicate
    const uniqueIds = Array.from(new Set(ids))

    if (uniqueIds.length === 0) return {}

    try {
      const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
        params: {
          ids: uniqueIds.join(','),
          vs_currencies: 'usd',
        },
      })

      // Transform { "stellar": { "usd": 0.12 } } -> { "XLM": 0.12 }
      const priceMap: PriceMap = {}

      currencies.forEach((currency) => {
        const id = CURRENCY_ID_MAP[currency.toLowerCase()]
        if (id && response.data[id]) {
          priceMap[currency] = response.data[id].usd
        } else if (currency.toLowerCase() === 'usd') {
          priceMap[currency] = 1
        }
      })

      return priceMap
    } catch (error) {
      console.error('Failed to fetch prices from CoinGecko:', error)
      // Return empty map on error to prevent crashes, UI will show fallback or raw balance
      return {}
    }
  },
}
