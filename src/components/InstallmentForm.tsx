import { useState } from 'react'
import { CupertinoListGroup, CupertinoButton } from './cupertino'
import { CupertinoInput } from './cupertino/CupertinoInput'
import { CupertinoPicker } from './cupertino/CupertinoPicker'
import { useInstallmentStore } from '../stores/useInstallmentStore'
import { useAccountStore } from '../stores/useAccountStore'
import { computeAPR } from '../services/irr'
import { CURRENCIES } from '../models/types'

interface Props {
  onDone: () => void
}

export function InstallmentForm({ onDone }: Props) {
  const { add } = useInstallmentStore()
  const { accounts } = useAccountStore()

  const creditAccounts = accounts.filter((a) => a.type === 'credit')

  const [description, setDescription] = useState('')
  const [principal, setPrincipal] = useState('')
  const [periods, setPeriods] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [currency, setCurrency] = useState('TWD')
  const [accountId, setAccountId] = useState(creditAccounts[0]?.id ?? '')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  const p = parseFloat(principal) || 0
  const n = parseInt(periods) || 0
  const m = parseFloat(monthlyPayment) || 0
  const apr = p > 0 && n > 0 && m > 0 ? computeAPR(p, m, n) : 0

  const handleSave = async () => {
    await add({
      accountId,
      description,
      principal: p,
      currency,
      totalPeriods: n,
      monthlyPayment: m,
      startDate,
      apr,
    })
    onDone()
  }

  return (
    <div className="space-y-4">
      <CupertinoListGroup inset={false}>
        <CupertinoInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. iPhone 16" />
        {creditAccounts.length > 0 && (
          <CupertinoPicker label="Card" value={accountId} onChange={setAccountId} options={creditAccounts.map((a) => ({ value: a.id, label: a.name }))} />
        )}
        <CupertinoPicker label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} />
      </CupertinoListGroup>

      <CupertinoListGroup header="Installment Terms" inset={false}>
        <CupertinoInput label="Principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Total amount" />
        <CupertinoInput label="Periods" type="number" value={periods} onChange={(e) => setPeriods(e.target.value)} placeholder="Number of months" />
        <CupertinoInput label="Monthly" type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="Monthly payment" />
        <CupertinoInput label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </CupertinoListGroup>

      {apr > 0 && (
        <div className="bg-ios-card dark:bg-ios-card rounded-[10px] p-4">
          <div className="text-ios-secondary text-[13px] uppercase mb-1">Calculated APR (IRR)</div>
          <div className="text-[28px] font-bold text-ios-blue">{apr.toFixed(2)}%</div>
          <div className="text-ios-secondary text-[13px] mt-1">
            Total cost: {currency} {(m * n).toLocaleString()} (fee: {currency} {(m * n - p).toLocaleString()})
          </div>
        </div>
      )}

      <div className="pt-2">
        <CupertinoButton fullWidth onClick={handleSave} disabled={!description || !p || !n || !m}>
          Add Installment
        </CupertinoButton>
      </div>
    </div>
  )
}
