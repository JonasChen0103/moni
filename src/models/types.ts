export type AccountType = 'credit' | 'checking' | 'savings' | 'debit' | 'insurance' | 'investment' | 'cash' | 'prepaid'
export type PrepaidType = 'easycard' | 'pxpay'
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Holding {
  symbol: string
  qty: number
  avgCost: number
  currency: string
}

export interface Account {
  id: string
  name: string
  type: AccountType
  currency: string
  balance: number
  icon?: string
  // Credit card
  billingDay?: number
  dueDay?: number
  creditLimit?: number
  // Insurance
  premium?: number
  premiumFrequency?: Frequency
  maturityDate?: string
  totalPeriods?: number
  paidPeriods?: number
  // Investment
  holdings?: Holding[]
  // Prepaid
  prepaidType?: PrepaidType
  autoTopUpThreshold?: number
  autoTopUpAmount?: number
  quickDeduct?: boolean
  // Meta
  institution?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  date: string
  type: TransactionType
  amount: number
  currency: string
  accountId: string
  toAccountId?: string
  category: string
  note?: string
  installmentId?: string
  createdAt: string
}

export interface Installment {
  id: string
  accountId: string
  description: string
  principal: number
  currency: string
  totalPeriods: number
  monthlyPayment: number
  startDate: string
  apr?: number
  createdAt: string
}

export interface RecurringTransaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  accountId: string
  category: string
  note?: string
  frequency: Frequency
  startDate: string
  endDate?: string
  createdAt: string
}

export interface FxRate {
  base: string
  target: string
  rate: number
  fetchedAt: number
}

export const CURRENCIES = [
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

export const BASE_CURRENCY: CurrencyCode = 'TWD'

export interface Debt {
  id: string
  person: string
  amount: number // positive = they owe me, negative = I owe them
  currency: string
  description: string
  date: string
  settled: boolean
  settledAt?: string
  createdAt: string
}

export const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Health', 'Education', 'Travel',
  'Income', 'Salary', 'Investment', 'Insurance',
  'Transfer', 'Other',
] as const
