import { useQuery } from '@tanstack/react-query'
import { countryService } from './index'

/**
 * Loads the country list (name, ISO2, dialing code, flag) for phone/country
 * pickers. Countries effectively never change, so the result is cached
 * aggressively for the whole session.
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getCountries(),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  })
}
