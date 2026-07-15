import { db } from '../db/database'
import type { FxRate } from '../models/types'
import { BASE_CURRENCY } from '../models/types'

const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function fetchFxRates(base: string = BASE_CURRENCY): Promise<Record<string, number>> {
  const cached = await db.fxRates.where({ base }).toArray()
  const now = Date.now()

  if (cached.length > 0 && now - cached[0].fetchedAt < CACHE_TTL) {
    const rates: Record<string, number> = {}
    for (const r of cached) rates[r.target] = r.rate
    return rates
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    const data = await res.json()

    if (data.result !== 'success') throw new Error('FX API error')

    const rates: Record<string, number> = data.rates
    const entries: FxRate[] = Object.entries(rates).map(([target, rate]) => ({
      base,
      target,
      rate,
      fetchedAt: now,
    }))

    await db.fxRates.where({ base }).delete()
    await db.fxRates.bulkPut(entries)

    return rates
  } catch {
    if (cached.length > 0) {
      const rates: Record<string, number> = {}
      for (const r of cached) rates[r.target] = r.rate
      return rates
    }
    return { [base]: 1 }
  }
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
  baseCurrency: string = BASE_CURRENCY
): number {
  if (from === to) return amount
  if (baseCurrency === from) {
    return amount * (rates[to] ?? 1)
  }
  if (baseCurrency === to) {
    return amount / (rates[from] ?? 1)
  }
  const amountInBase = amount / (rates[from] ?? 1)
  return amountInBase * (rates[to] ?? 1)
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' || currency === 'KRW' || currency === 'TWD' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' || currency === 'KRW' || currency === 'TWD' ? 0 : 2,
  }).format(amount)
}
