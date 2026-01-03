export const getCurrencyIcon = (curr: string) => {
  switch (curr.toUpperCase()) {
    case 'XLM':
      return '/assets/icons/xlm.png'
    case 'USGLO':
      return '/assets/icons/usglo.png'
    default:
      return '/assets/icons/usdc.png'
  }
}
