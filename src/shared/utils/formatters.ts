const NA = 'N/A'

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return NA
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null) return NA
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return NA
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatTemp(value: number | null | undefined): string {
  if (value == null) return NA
  return `${value.toFixed(1)}°F`
}

export function formatRate(value: number | null | undefined): string {
  if (value == null) return NA
  return value.toFixed(1)
}

export function safeFixed(value: number | null | undefined, digits = 1): string {
  if (value == null) return NA
  return value.toFixed(digits)
}
