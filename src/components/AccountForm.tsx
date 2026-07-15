import { useState } from 'react'
import { CupertinoListGroup, CupertinoButton } from './cupertino'
import { CupertinoInput } from './cupertino/CupertinoInput'
import { CupertinoPicker } from './cupertino/CupertinoPicker'
import { useAccountStore } from '../stores/useAccountStore'
import { CURRENCIES, type Account, type AccountType, type PrepaidType, type Frequency } from '../models/types'

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit' },
  { value: 'cash', label: 'Cash' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'investment', label: 'Investment' },
  { value: 'insurance', label: 'Insurance' },
]

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const PREPAID_TYPES: { value: PrepaidType; label: string }[] = [
  { value: 'easycard', label: 'EasyCard' },
  { value: 'pxpay', label: 'PX Pay' },
]

interface Props {
  account: Account | null
  onDone: () => void
}

export function AccountForm({ account, onDone }: Props) {
  const { add, update, remove } = useAccountStore()

  const [name, setName] = useState(account?.name ?? '')
  const [type, setType] = useState<AccountType>(account?.type ?? 'checking')
  const [currency, setCurrency] = useState(account?.currency ?? 'TWD')
  const [balance, setBalance] = useState(account?.balance?.toString() ?? '0')
  const [institution, setInstitution] = useState(account?.institution ?? '')

  const [billingDay, setBillingDay] = useState(account?.billingDay?.toString() ?? '')
  const [dueDay, setDueDay] = useState(account?.dueDay?.toString() ?? '')
  const [creditLimit, setCreditLimit] = useState(account?.creditLimit?.toString() ?? '')

  const [premium, setPremium] = useState(account?.premium?.toString() ?? '')
  const [premiumFrequency, setPremiumFrequency] = useState<Frequency>(account?.premiumFrequency ?? 'monthly')
  const [maturityDate, setMaturityDate] = useState(account?.maturityDate ?? '')
  const [totalPeriods, setTotalPeriods] = useState(account?.totalPeriods?.toString() ?? '')
  const [paidPeriods, setPaidPeriods] = useState(account?.paidPeriods?.toString() ?? '')

  const [prepaidType, setPrepaidType] = useState<PrepaidType>(account?.prepaidType ?? 'easycard')
  const [autoTopUpThreshold, setAutoTopUpThreshold] = useState(account?.autoTopUpThreshold?.toString() ?? '')
  const [autoTopUpAmount, setAutoTopUpAmount] = useState(account?.autoTopUpAmount?.toString() ?? '')
  const [quickDeduct, setQuickDeduct] = useState(account?.quickDeduct ?? false)

  const handleSave = async () => {
    const base = {
      name,
      type,
      currency,
      balance: parseFloat(balance) || 0,
      institution: institution || undefined,
    }

    const typeFields: Partial<Account> = {}

    if (type === 'credit') {
      typeFields.billingDay = parseInt(billingDay) || undefined
      typeFields.dueDay = parseInt(dueDay) || undefined
      typeFields.creditLimit = parseFloat(creditLimit) || undefined
    }
    if (type === 'insurance') {
      typeFields.premium = parseFloat(premium) || undefined
      typeFields.premiumFrequency = premiumFrequency
      typeFields.maturityDate = maturityDate || undefined
      typeFields.totalPeriods = parseInt(totalPeriods) || undefined
      typeFields.paidPeriods = parseInt(paidPeriods) || undefined
    }
    if (type === 'prepaid') {
      typeFields.prepaidType = prepaidType
      typeFields.autoTopUpThreshold = parseFloat(autoTopUpThreshold) || undefined
      typeFields.autoTopUpAmount = parseFloat(autoTopUpAmount) || undefined
      typeFields.quickDeduct = quickDeduct
    }

    if (account) {
      await update(account.id, { ...base, ...typeFields })
    } else {
      await add({ ...base, ...typeFields } as Omit<Account, 'id' | 'createdAt' | 'updatedAt'>)
    }
    onDone()
  }

  const handleDelete = async () => {
    if (account && confirm('Delete this account?')) {
      await remove(account.id)
      onDone()
    }
  }

  return (
    <div className="space-y-4">
      <CupertinoListGroup inset={false}>
        <CupertinoInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Account name" />
        <CupertinoPicker label="Type" value={type} onChange={(v) => setType(v as AccountType)} options={ACCOUNT_TYPES} />
        <CupertinoPicker label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }))} />
        <CupertinoInput label="Balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" />
        <CupertinoInput label="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Optional" />
      </CupertinoListGroup>

      {type === 'credit' && (
        <CupertinoListGroup header="Credit Card Details" inset={false}>
          <CupertinoInput label="Billing Day" type="number" value={billingDay} onChange={(e) => setBillingDay(e.target.value)} placeholder="e.g. 15" />
          <CupertinoInput label="Due Day" type="number" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="e.g. 5" />
          <CupertinoInput label="Limit" type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} placeholder="Credit limit" />
        </CupertinoListGroup>
      )}

      {type === 'insurance' && (
        <CupertinoListGroup header="Insurance Details" inset={false}>
          <CupertinoInput label="Premium" type="number" value={premium} onChange={(e) => setPremium(e.target.value)} placeholder="Premium amount" />
          <CupertinoPicker label="Frequency" value={premiumFrequency} onChange={(v) => setPremiumFrequency(v as Frequency)} options={FREQUENCY_OPTIONS} />
          <CupertinoInput label="Maturity" type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} />
          <CupertinoInput label="Total Periods" type="number" value={totalPeriods} onChange={(e) => setTotalPeriods(e.target.value)} placeholder="Total periods" />
          <CupertinoInput label="Paid" type="number" value={paidPeriods} onChange={(e) => setPaidPeriods(e.target.value)} placeholder="Paid periods" />
        </CupertinoListGroup>
      )}

      {type === 'prepaid' && (
        <CupertinoListGroup header="Prepaid Details" inset={false}>
          <CupertinoPicker label="Type" value={prepaidType} onChange={(v) => setPrepaidType(v as PrepaidType)} options={PREPAID_TYPES} />
          <CupertinoInput label="Top-up At" type="number" value={autoTopUpThreshold} onChange={(e) => setAutoTopUpThreshold(e.target.value)} placeholder="Auto top-up threshold" />
          <CupertinoInput label="Top-up Amt" type="number" value={autoTopUpAmount} onChange={(e) => setAutoTopUpAmount(e.target.value)} placeholder="Auto top-up amount" />
          <div className="flex items-center min-h-[44px] px-4">
            <span className="text-[17px] flex-1">Quick Deduct</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quickDeduct}
                onChange={(e) => setQuickDeduct(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-[51px] h-[31px] bg-ios-fill rounded-full peer peer-checked:bg-ios-green transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[27px] after:w-[27px] after:transition-all peer-checked:after:translate-x-[20px] after:shadow-sm" />
            </label>
          </div>
        </CupertinoListGroup>
      )}

      <div className="px-4 space-y-3 pt-2">
        <CupertinoButton fullWidth onClick={handleSave} disabled={!name.trim()}>
          {account ? 'Save Changes' : 'Add Account'}
        </CupertinoButton>
        {account && (
          <CupertinoButton fullWidth variant="plain" onClick={handleDelete}>
            <span className="text-ios-red">Delete Account</span>
          </CupertinoButton>
        )}
      </div>
    </div>
  )
}
