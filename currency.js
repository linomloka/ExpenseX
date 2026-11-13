export const USD_TO_TZS = 2500

export function fromBaseCurrency(amount, currency) {
  return currency === 'TZS' ? Number(amount) * USD_TO_TZS : Number(amount)
}

export function toBaseCurrency(amount, currency) {
  return currency === 'TZS' ? Number(amount) / USD_TO_TZS : Number(amount)
}

export function formatMoney(amount, currency = 'TZS') {
  const value = fromBaseCurrency(amount, currency)
  return new Intl.NumberFormat(currency === 'TZS' ? 'en-TZ' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'TZS' ? 0 : 2,
  }).format(value)
}

export function formatInputAmount(amount, currency = 'TZS') {
  const value = fromBaseCurrency(amount, currency)
  return value ? String(Number(value.toFixed(currency === 'TZS' ? 0 : 2))) : ''
}
