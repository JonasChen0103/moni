import { create } from 'zustand'
import { v7 as uuid } from 'uuid'
import { db } from '../db/database'
import type { Debt } from '../models/types'

interface DebtSummary {
  person: string
  net: number
  currency: string
}

interface DebtStore {
  debts: Debt[]
  loading: boolean
  load: () => Promise<void>
  add: (data: Omit<Debt, 'id' | 'createdAt'>) => Promise<void>
  settle: (id: string) => Promise<void>
  unsettle: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
  summaryByPerson: () => DebtSummary[]
}

export const useDebtStore = create<DebtStore>((set, get) => ({
  debts: [],
  loading: true,

  load: async () => {
    const debts = await db.debts.orderBy('date').reverse().toArray()
    set({ debts, loading: false })
  },

  add: async (data) => {
    const debt: Debt = { ...data, id: uuid(), createdAt: new Date().toISOString() }
    await db.debts.put(debt)
    set({ debts: [debt, ...get().debts] })
  },

  settle: async (id) => {
    const settledAt = new Date().toISOString()
    await db.debts.update(id, { settled: true, settledAt })
    set({
      debts: get().debts.map((d) =>
        d.id === id ? { ...d, settled: true, settledAt } : d
      ),
    })
  },

  unsettle: async (id) => {
    await db.debts.update(id, { settled: false, settledAt: undefined })
    set({
      debts: get().debts.map((d) =>
        d.id === id ? { ...d, settled: false, settledAt: undefined } : d
      ),
    })
  },

  remove: async (id) => {
    await db.debts.delete(id)
    set({ debts: get().debts.filter((d) => d.id !== id) })
  },

  summaryByPerson: () => {
    const unsettled = get().debts.filter((d) => !d.settled)
    const map = new Map<string, { net: number; currency: string }>()
    for (const d of unsettled) {
      const existing = map.get(d.person)
      if (existing) {
        existing.net += d.amount
      } else {
        map.set(d.person, { net: d.amount, currency: d.currency })
      }
    }
    return Array.from(map.entries())
      .map(([person, { net, currency }]) => ({ person, net, currency }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
  },
}))
