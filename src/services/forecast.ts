import type { Account, Installment, RecurringTransaction } from '../models/types'

export interface ForecastMonth {
  month: string // YYYY-MM
  label: string // e.g. "Aug 2026"
  income: number
  expenses: number
  installments: number
  insurance: number
  netChange: number
  projectedNetWorth: number
}

interface ForecastInput {
  accounts: Account[]
  installments: Installment[]
  recurring: RecurringTransaction[]
  toBase: (amount: number, currency: string) => number
  months?: number
}

export function generateForecast({
  accounts,
  installments,
  recurring,
  toBase,
  months = 12,
}: ForecastInput): ForecastMonth[] {
  const now = new Date()
  const currentNetWorth = accounts.reduce((sum, a) => {
    const val = a.type === 'credit' ? -a.balance : a.balance
    return sum + toBase(val, a.currency)
  }, 0)

  const result: ForecastMonth[] = []
  let runningNetWorth = currentNetWorth

  for (let i = 1; i <= months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    let income = 0
    let expenses = 0
    let installmentTotal = 0
    let insuranceTotal = 0

    for (const rec of recurring) {
      const start = new Date(rec.startDate)
      const end = rec.endDate ? new Date(rec.endDate) : null

      if (d < start) continue
      if (end && d > end) continue

      const amountBase = toBase(rec.amount, rec.currency)
      let applies = false

      switch (rec.frequency) {
        case 'daily':
          applies = true
          if (rec.type === 'income') income += amountBase * 30
          else expenses += amountBase * 30
          continue
        case 'weekly':
          applies = true
          if (rec.type === 'income') income += amountBase * 4
          else expenses += amountBase * 4
          continue
        case 'monthly':
          applies = true
          break
        case 'yearly':
          applies = start.getMonth() === month
          break
      }

      if (applies) {
        if (rec.type === 'income') income += amountBase
        else expenses += amountBase
      }
    }

    for (const inst of installments) {
      const startInst = new Date(inst.startDate)
      const endMonth = new Date(startInst)
      endMonth.setMonth(endMonth.getMonth() + inst.totalPeriods)

      if (d >= startInst && d < endMonth) {
        installmentTotal += toBase(inst.monthlyPayment, inst.currency)
      }
    }

    for (const acct of accounts) {
      if (acct.type !== 'insurance' || !acct.premium) continue

      const remaining = (acct.totalPeriods ?? 0) - (acct.paidPeriods ?? 0)
      if (remaining <= 0) continue

      const premiumBase = toBase(acct.premium, acct.currency)
      if (acct.premiumFrequency === 'monthly') {
        insuranceTotal += premiumBase
      } else if (acct.premiumFrequency === 'yearly') {
        const maturity = acct.maturityDate ? new Date(acct.maturityDate) : null
        if (!maturity || d <= maturity) {
          insuranceTotal += premiumBase / 12
        }
      }
    }

    const netChange = income - expenses - installmentTotal - insuranceTotal
    runningNetWorth += netChange

    result.push({
      month: monthStr,
      label,
      income,
      expenses,
      installments: installmentTotal,
      insurance: insuranceTotal,
      netChange,
      projectedNetWorth: runningNetWorth,
    })
  }

  return result
}
