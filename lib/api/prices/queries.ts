import { useQuery } from '@tanstack/react-query'
import { priceService } from './index'

export function useGetPrices(currencies: string[]) {
  return useQuery({
    queryKey: ['crypto-prices', currencies.sort().join(',')],
    queryFn: () => priceService.getPrices(currencies),
    staleTime: 1000 * 60 * 5, // 5 minutes cache to respect CoinGecko rate limits
    enabled: currencies.length > 0,
    retry: 1,
  })
}
