import axios from 'axios'
import { countries as offlineCountries } from 'countries-list'

export interface Country {
  /** Common country name, e.g. "Nigeria" */
  name: string
  /** ISO 3166-1 alpha-2 code, e.g. "NG" */
  iso2: string
  /** International dialing code, e.g. "+234" */
  dialCode: string
  /** Flag emoji derived from the ISO2 code, e.g. "🇳🇬" */
  flag: string
}

// Only request the fields we need to keep the payload small and fast.
const REST_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca2,idd'

/** Convert an ISO 3166-1 alpha-2 code into its flag emoji. */
function iso2ToFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

/** Offline fallback built from the bundled `countries-list` package. */
function fromOfflineList(): Country[] {
  return Object.entries(offlineCountries)
    .map(([iso2, data]) => ({
      name: data.name,
      iso2,
      dialCode: data.phone?.[0] ? `+${data.phone[0]}` : '',
      flag: iso2ToFlag(iso2),
    }))
    .filter((c) => c.dialCode)
    .sort((a, b) => a.name.localeCompare(b.name))
}

interface RestCountry {
  name?: { common?: string }
  cca2?: string
  idd?: { root?: string; suffixes?: string[] }
}

function mapRestCountry(c: RestCountry): Country | null {
  const iso2 = c.cca2
  if (!iso2) return null

  const root = c.idd?.root ?? ''
  const suffixes = c.idd?.suffixes ?? []
  // Only append the suffix when it is unambiguous (a single suffix). Countries
  // that share a calling code (e.g. +1 for US/CA) list many suffixes — use the
  // root alone in that case.
  const dialCode =
    root && suffixes.length === 1 ? `${root}${suffixes[0]}` : root

  if (!dialCode) return null

  return {
    name: c.name?.common ?? iso2,
    iso2,
    dialCode,
    flag: iso2ToFlag(iso2),
  }
}

export const countryService = {
  /**
   * Fetch the list of countries (name, ISO2, dialing code, flag) from the
   * REST Countries API, falling back to the bundled offline list if the request
   * fails so the phone input always works.
   */
  async getCountries(): Promise<Country[]> {
    try {
      const { data } = await axios.get<RestCountry[]>(REST_COUNTRIES_URL)
      const mapped = data
        .map(mapRestCountry)
        .filter((c): c is Country => c !== null)
        .sort((a, b) => a.name.localeCompare(b.name))

      return mapped.length > 0 ? mapped : fromOfflineList()
    } catch (error) {
      console.error(
        'Failed to fetch countries from API, using offline list:',
        error,
      )
      return fromOfflineList()
    }
  },
}
