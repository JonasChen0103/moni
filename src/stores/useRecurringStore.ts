import { create } from 'zustand'
import { v7 as uuid } from 'uuid'
import { db } from '../db/database'
import type { RecurringTransaction } from '../models/types'

interface RecurringStore {
  recurring: RecurringTransaction[]
  loading: boolean
  load: () => Promise<void>
  add: (data: Omit<RecurringTransaction, 'id' | 'createdAt'>) => Promise<void>
  update: (id: string, data: Partial<RecurringTransaction>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useRecurringStore = create<RecurringStore>((set, get) => ({
  recurring: [],
  loading: true,

  load: async () => {
    const recurring = await db.recurring.toArray()
    set({ recurring, loading: false })
  },

  add: async (data) => {
    const rec: RecurringTransaction = { ...data, id: uuid(), createdAt: new Date().toISOString() }
    await db.recurring.put(rec)
    set({ recurring: [...get().recurring, rec] })
  },

  update: async (id, data) => {
    await db.recurring.update(id, data)
    set({
      recurring: get().recurring.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
    })
  },

  remove: async (id) => {
    await db.recurring.delete(id)
    set({ recurring: get().recurring.filter((r) => r.id !== id) })
  },
}))
