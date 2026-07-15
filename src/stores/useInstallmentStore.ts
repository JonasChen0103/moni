import { create } from 'zustand'
import { v7 as uuid } from 'uuid'
import { db } from '../db/database'
import type { Installment } from '../models/types'

interface InstallmentStore {
  installments: Installment[]
  loading: boolean
  load: () => Promise<void>
  add: (data: Omit<Installment, 'id' | 'createdAt'>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useInstallmentStore = create<InstallmentStore>((set, get) => ({
  installments: [],
  loading: true,

  load: async () => {
    const installments = await db.installments.toArray()
    set({ installments, loading: false })
  },

  add: async (data) => {
    const inst: Installment = { ...data, id: uuid(), createdAt: new Date().toISOString() }
    await db.installments.put(inst)
    set({ installments: [...get().installments, inst] })
  },

  remove: async (id) => {
    await db.installments.delete(id)
    set({ installments: get().installments.filter((i) => i.id !== id) })
  },
}))
