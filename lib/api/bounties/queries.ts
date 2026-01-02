import { useQuery } from '@tanstack/react-query'
import { bountyService } from './index'

export function useGetSupportedCurrencies() {
  return useQuery({
    queryKey: ['supported-currencies'],
    queryFn: () => bountyService.getSupportedCurrencies(),
  })
}
