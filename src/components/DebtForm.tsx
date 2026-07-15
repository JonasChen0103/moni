import { useState } from 'react'
import { CupertinoListGroup, CupertinoButton } from './cupertino'
import { CupertinoInput } from './cupertino/CupertinoInput'
import { CupertinoPicker } from './cupertino/CupertinoPicker'
import { useDebtStore } from '../stores/useDebtStore'
import { CURRENCIES } from '../models/types'

interface Props {
  onDone: () => void
}

export function DebtForm({ onDone }: Props) {
  const { add, debts } = useDebtStore()

  const knownPeople = [...new Set(debts.map((d) => d.person))].sort()

  const [direction, setDirection] = useState<'they_owe' | 'i_owe'>('they_owe')
  const [person, setPerson] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('TWD')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount) || 0
    await add({
      person: person.trim(),
      amount: direction === 'they_owe' ? parsedAmount : -parsedAmount,
      currency,
      description,
      date,
      settled: false,
    })
    onDone()
  }

  return (
    <div className="space-y-4">
      <div className="flex bg-ios-fill dark:bg-ios-fill rounded-[10px] p-0.5">
        {([
          { key: 'they_owe' as const, label: 'I paid for them' },
          { key: 'i_owe' as const, label: 'They paid for me' },
        ]).map((d) => (
          <button
            key={d.key}
            onClick={() => setDirection(d.key)}
            className={`flex-1 py-2 text-[14px] font-medium rounded-lg border-0 cursor-pointer transition-all ${
              direction === d.key
                ? 'bg-ios-card dark:bg-ios-card text-ios-label dark:text-ios-label shadow-sm'
                : 'bg-transparent text-ios-secondary'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <CupertinoListGroup inset={false}>
        <CupertinoInput label="Who" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Friend's name" list="known-people" />
        <CupertinoInput label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        <CupertinoPicker label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} />
      </CupertinoListGroup>

      <CupertinoListGroup inset={false}>
        <CupertinoInput label="For what" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Dinner at Ding Tai Fung" />
        <CupertinoInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </CupertinoListGroup>

      <div className="pt-2">
        <CupertinoButton fullWidth onClick={handleSave} disabled={!person.trim() || !amount}>
          Add Record
        </CupertinoButton>
      </div>

      {knownPeople.length > 0 && (
        <datalist id="known-people">
          {knownPeople.map((p) => <option key={p} value={p} />)}
        </datalist>
      )}
    </div>
  )
}
