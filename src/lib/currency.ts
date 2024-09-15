const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const currencyFormatter2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function formatCurrency(amt: number, showDecimals = false) {
  if (showDecimals) {
    return currencyFormatter2.format(amt)
  }
  return currencyFormatter.format(amt)
}
