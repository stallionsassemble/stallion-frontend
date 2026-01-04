import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Currency Mapping Helper
export function getCurrencyIcon(currency: string | undefined | null) {
  switch (currency?.toLowerCase()) {
    case 'usdc':
      return '/assets/icons/usdc.png'
    case 'sol':
      return '/assets/icons/sol.png'
    case 'btc':
      return '/assets/icons/btc.png'
    case 'eth':
      return '/assets/icons/eth.png'
    case 'xlm':
      return '/assets/icons/xlm.png'
    case 'eurc':
      return '/assets/icons/eurc.png'
    case 'ngn':
      return '/assets/icons/naira.png'
    default:
      return '/assets/icons/usdc.png'
  }
}
