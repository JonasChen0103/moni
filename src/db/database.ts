import Dexie, { type EntityTable } from 'dexie'
import type { Account, Transaction, Installment, RecurringTransaction, FxRate, Debt } from '../models/types'

const db = new Dexie('MoniDB') as Dexie & {
  accounts: EntityTable<Account, 'id'>
  transactions: EntityTable<Transaction, 'id'>
  installments: EntityTable<Installment, 'id'>
  recurring: EntityTable<RecurringTransaction, 'id'>
  fxRates: EntityTable<FxRate, 'base'>
  debts: EntityTable<Debt, 'id'>
}

db.version(1).stores({
  accounts: 'id, type, currency',
  transactions: 'id, date, accountId, category, installmentId',
  installments: 'id, accountId',
  recurring: 'id, accountId',
  fxRates: '[base+target], fetchedAt',
})

db.version(2).stores({
  accounts: 'id, type, currency',
  transactions: 'id, date, accountId, category, installmentId',
  installments: 'id, accountId',
  recurring: 'id, accountId',
  fxRates: '[base+target], fetchedAt',
  debts: 'id, person, settled, date',
})

export { db }
