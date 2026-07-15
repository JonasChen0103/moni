import { create } from 'zustand'
import { v7 as uuid } from 'uuid'
import { db } from '../db/database'
import type { Account } from '../models/types'

interface AccountStore {
  accounts: Account[]
  loading: boolean
  load: () => Promise<void>
  add: (data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  update: (id: string, data: Partial<Account>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  loading: true,

  load: async () => {
    const accounts = await db.accounts.toArray()
    set({ accounts, loading: false })
  },

  add: async (data) => {
    const now = new Date().toISOString()
    const account: Account = { ...data, id: uuid(), createdAt: now, updatedAt: now }
    await db.accounts.put(account)
    set({ accounts: [...get().accounts, account] })
  },

  update: async (id, data) => {
    const updatedAt = new Date().toISOString()
    await db.accounts.update(id, { ...data, updatedAt })
    set({
      accounts: get().accounts.map((a) =>
        a.id === id ? { ...a, ...data, updatedAt } : a
      ),
    })
  },

  remove: async (id) => {
    await db.accounts.delete(id)
    set({ accounts: get().accounts.filter((a) => a.id !== id) })
  },
}))
