import { useState } from 'react'
import { CupertinoListGroup, CupertinoButton } from './cupertino'
import { CupertinoInput } from './cupertino/CupertinoInput'
import { CupertinoPicker } from './cupertino/CupertinoPicker'
import { useTransactionStore } from '../stores/useTransactionStore'
import { useAccountStore } from '../stores/useAccountStore'
import { CATEGORIES, CURRENCIES, type Transaction, type TransactionType } from '../models/types'

const TX_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
]

interface Props {
  transaction: Transaction | null
  onDone: () => void
}

export function TransactionForm({ transaction, onDone }: Props) {
  const { add, update, remove } = useTransactionStore()
  const { accounts } = useAccountStore()

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? '')
  const [currency, setCurrency] = useState(transaction?.currency ?? accounts[0]?.currency ?? 'TWD')
  const [accountId, setAccountId] = useState(transaction?.accountId ?? accounts[0]?.id ?? '')
  const [toAccountId, setToAccountId] = useState(transaction?.toAccountId ?? '')
  const [category, setCategory] = useState(transaction?.category ?? 'Other')
  const [note, setNote] = useState(transaction?.note ?? '')
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().split('T')[0])

  const handleSave = async () => {
    const data = {
      type,
      amount: parseFloat(amount) || 0,
      currency,
      accountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
      category,
      note: note || undefined,
      date,
    }

    if (transaction) {
      await update(transaction.id, data)
    } else {
      await add(data)
    }
    onDone()
  }

  const handleDelete = async () => {
    if (transaction && confirm('Delete this transaction?')) {
      await remove(transaction.id)
      onDone()
    }
  }

  const accountOptions = accounts.map((a) => ({ value: a.id, label: a.name }))

  return (
    <div className="space-y-4">
      <div className="flex bg-ios-fill dark:bg-ios-fill rounded-[10px] p-0.5 mx-0">
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
        <CupertinoPicker label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} />
        <CupertinoInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </CupertinoListGroup>

      <CupertinoListGroup inset={false}>
        {accountOptions.length > 0 && (
          <CupertinoPicker
            label={type === 'transfer' ? 'From' : 'Account'}
            value={accountId}
            onChange={setAccountId}
            options={accountOptions}
          />
        )}
        {type === 'transfer' && accountOptions.length > 0 && (
          <CupertinoPicker label="To" value={toAccountId} onChange={setToAccountId} options={accountOptions} />
        )}
        <CupertinoPicker
          label="Category"
          value={category}
          onChange={setCategory}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <CupertinoInput label="Note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
      </CupertinoListGroup>

      <div className="px-0 space-y-3 pt-2">
        <CupertinoButton fullWidth onClick={handleSave} disabled={!amount || !accountId}>
          {transaction ? 'Save Changes' : 'Add Transaction'}
        </CupertinoButton>
        {transaction && (
          <CupertinoButton fullWidth variant="plain" onClick={handleDelete}>
            <span className="text-ios-red">Delete Transaction</span>
          </CupertinoButton>
        )}
      </div>
    </div>
  )
}
