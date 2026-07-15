import { create } from 'zustand'
import { v7 as uuid } from 'uuid'
import { db } from '../db/database'
import type { Transaction } from '../models/types'

interface TransactionStore {
  transactions: Transaction[]
  loading: boolean
  load: () => Promise<void>
  add: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>
  update: (id: string, data: Partial<Transaction>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: true,

  load: async () => {
    const transactions = await db.transactions.orderBy('date').reverse().toArray()
    set({ transactions, loading: false })
  },

  add: async (data) => {
    const tx: Transaction = { ...data, id: uuid(), createdAt: new Date().toISOString() }
    await db.transactions.put(tx)
    set({ transactions: [tx, ...get().transactions] })
  },

  update: async (id, data) => {
    await db.transactions.update(id, data)
    set({
      transactions: get().transactions.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })
  },

  remove: async (id) => {
    await db.transactions.delete(id)
    set({ transactions: get().transactions.filter((t) => t.id !== id) })
  },
}))
