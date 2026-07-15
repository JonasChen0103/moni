import { create } from 'zustand'
import { fetchFxRates, convertCurrency, formatCurrency } from '../services/fx'
import { BASE_CURRENCY } from '../models/types'

interface CurrencyStore {
  rates: Record<string, number>
  loading: boolean
  lastFetched: number | null
  load: () => Promise<void>
  convert: (amount: number, from: string, to?: string) => number
  format: (amount: number, currency: string) => string
  toBase: (amount: number, from: string) => number
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  rates: {},
  loading: true,
  lastFetched: null,

  load: async () => {
    const rates = await fetchFxRates(BASE_CURRENCY)
    set({ rates, loading: false, lastFetched: Date.now() })
  },

  convert: (amount, from, to = BASE_CURRENCY) => {
    return convertCurrency(amount, from, to, get().rates, BASE_CURRENCY)
  },

  format: (amount, currency) => {
    return formatCurrency(amount, currency)
  },

  toBase: (amount, from) => {
    return convertCurrency(amount, from, BASE_CURRENCY, get().rates, BASE_CURRENCY)
  },
}))
