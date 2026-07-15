import { describe, it, expect } from 'vitest'
import { generateForecast } from './forecast'
import type { Account, Installment, RecurringTransaction } from '../models/types'

const toBase = (amount: number, currency: string) => {
  if (currency === 'TWD') return amount
  if (currency === 'USD') return amount / 0.031
  return amount
}

describe('generateForecast', () => {
  it('returns correct number of months', () => {
    const result = generateForecast({
      accounts: [],
      installments: [],
      recurring: [],
      toBase,
      months: 6,
    })
    expect(result).toHaveLength(6)
  })

  it('includes recurring income in projections', () => {
    const accounts: Account[] = [
      { id: '1', name: 'Checking', type: 'checking', currency: 'TWD', balance: 100000, createdAt: '', updatedAt: '' },
    ]
    const recurring: RecurringTransaction[] = [
      { id: 'r1', type: 'income', amount: 50000, currency: 'TWD', accountId: '1', category: 'Salary', frequency: 'monthly', startDate: '2020-01-01', createdAt: '' },
    ]

    const result = generateForecast({ accounts, installments: [], recurring, toBase, months: 6 })

    expect(result[0].income).toBe(50000)
    expect(result[5].projectedNetWorth).toBeGreaterThan(100000)
  })

  it('includes installment payments in projections', () => {
    const accounts: Account[] = [
      { id: '1', name: 'Card', type: 'credit', currency: 'TWD', balance: 0, createdAt: '', updatedAt: '' },
    ]
    const installments: Installment[] = [
      { id: 'i1', accountId: '1', description: 'iPhone', principal: 36000, currency: 'TWD', totalPeriods: 12, monthlyPayment: 3180, startDate: '2026-01-01', apr: 10.98, createdAt: '' },
    ]

    const result = generateForecast({ accounts, installments, recurring: [], toBase, months: 6 })

    expect(result[0].installments).toBe(3180)
  })

  it('includes insurance premiums in projections', () => {
    const accounts: Account[] = [
      { id: '1', name: 'Life Insurance', type: 'insurance', currency: 'TWD', balance: 0, premium: 5000, premiumFrequency: 'monthly', totalPeriods: 240, paidPeriods: 12, createdAt: '', updatedAt: '' },
    ]

    const result = generateForecast({ accounts, installments: [], recurring: [], toBase, months: 6 })

    expect(result[0].insurance).toBe(5000)
  })

  it('converts multi-currency correctly', () => {
    const accounts: Account[] = [
      { id: '1', name: 'USD Account', type: 'checking', currency: 'USD', balance: 1000, createdAt: '', updatedAt: '' },
    ]
    const recurring: RecurringTransaction[] = [
      { id: 'r1', type: 'income', amount: 100, currency: 'USD', accountId: '1', category: 'Income', frequency: 'monthly', startDate: '2020-01-01', createdAt: '' },
    ]

    const result = generateForecast({ accounts, installments: [], recurring, toBase, months: 3 })

    expect(result[0].income).toBeGreaterThan(3000)
    expect(result[0].projectedNetWorth).toBeGreaterThan(toBase(1000, 'USD'))
  })
})
