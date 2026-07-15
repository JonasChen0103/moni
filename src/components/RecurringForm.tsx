import { useState } from 'react'
import { CupertinoListGroup, CupertinoButton } from './cupertino'
import { CupertinoInput, CupertinoSelect } from './cupertino/CupertinoInput'
import { useRecurringStore } from '../stores/useRecurringStore'
import { useAccountStore } from '../stores/useAccountStore'
import { CATEGORIES, CURRENCIES, type Frequency, type TransactionType } from '../models/types'

const TX_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

interface Props {
  onDone: () => void
}

export function RecurringForm({ onDone }: Props) {
  const { add } = useRecurringStore()
  const { accounts } = useAccountStore()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(accounts[0]?.currency ?? 'TWD')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [category, setCategory] = useState('Bills & Utilities')
  const [note, setNote] = useState('')
  const [frequency, setFrequency] = useState<Frequency>('monthly')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')

  const handleSave = async () => {
    await add({
      type,
      amount: parseFloat(amount) || 0,
      currency,
      accountId,
      category,
      note: note || undefined,
      frequency,
      startDate,
      endDate: endDate || undefined,
    })
    onDone()
  }

  const accountOptions = accounts.map((a) => ({ value: a.id, label: a.name }))

  return (
    <div className="space-y-4">
      <div className="flex bg-ios-fill dark:bg-ios-fill rounded-[10px] p-0.5">
        {TX_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`flex-1 py-2 text-[15px] font-medium rounded-lg border-0 cursor-pointer transition-all ${
              type === t.value
                ? 'bg-ios-card dark:bg-ios-card text-ios-label dark:text-ios-label shadow-sm'
                : 'bg-transparent text-ios-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CupertinoListGroup inset={false}>
        <CupertinoInput label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        <CupertinoSelect label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ value: c.code, label: c.code }))} />
        <CupertinoSelect label="Frequency" value={frequency} onChange={(v) => setFrequency(v as Frequency)} options={FREQUENCIES} />
      </CupertinoListGroup>

      <CupertinoListGroup inset={false}>
        {accountOptions.length > 0 && (
          <CupertinoSelect label="Account" value={accountId} onChange={setAccountId} options={accountOptions} />
        )}
        <CupertinoSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
        <CupertinoInput label="Note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
      </CupertinoListGroup>

      <CupertinoListGroup header="Date Range" inset={false}>
        <CupertinoInput label="Start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <CupertinoInput label="End" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Optional (ongoing)" />
      </CupertinoListGroup>

      <div className="pt-2">
        <CupertinoButton fullWidth onClick={handleSave} disabled={!amount || !accountId}>
          Add Recurring
        </CupertinoButton>
      </div>
    </div>
  )
}
