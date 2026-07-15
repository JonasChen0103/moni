import { useState } from 'react'
import { CupertinoNavBar, NavBarAddButton, CupertinoListGroup, CupertinoListItem, CupertinoSheet } from '../components/cupertino'
import { AccountTypeIcon } from '../components/icons/AccountTypeIcon'
import { useAccountStore } from '../stores/useAccountStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import { AccountForm } from '../components/AccountForm'
import type { Account, AccountType } from '../models/types'

const TYPE_LABELS: Record<AccountType, string> = {
  credit: 'Credit Cards',
  checking: 'Checking',
  savings: 'Savings',
  debit: 'Debit',
  insurance: 'Insurance',
  investment: 'Investments',
  cash: 'Cash',
  prepaid: 'Prepaid',
}

const TYPE_ORDER: AccountType[] = ['credit', 'checking', 'savings', 'debit', 'cash', 'prepaid', 'investment', 'insurance']

export default function Accounts() {
  const { accounts } = useAccountStore()
  const { format, toBase } = useCurrencyStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)

  const grouped = TYPE_ORDER
    .map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: accounts.filter((a) => a.type === type),
    }))
    .filter((g) => g.items.length > 0)

  const netWorth = accounts.reduce((sum, a) => {
    const val = a.type === 'credit' ? -a.balance : a.balance
    return sum + toBase(val, a.currency)
  }, 0)

  return (
    <div className="flex-1 pb-24 bg-ios-bg dark:bg-ios-bg">
      <CupertinoNavBar
        title="Accounts"
        subtitle={accounts.length > 0 ? `${format(netWorth, 'TWD')} total` : undefined}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
        trailing={
          <NavBarAddButton onClick={() => { setEditing(null); setShowForm(true) }} />
        }
      />

      {grouped.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <div className="w-12 h-12 rounded-xl bg-ios-fill flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M12 9v6M9 12h6" />
            </svg>
          </div>
          <span className="text-ios-tertiary text-[15px]">Tap + to add your first account</span>
        </div>
      )}

      {grouped.map(({ type, label, items }) => (
        <CupertinoListGroup key={type} header={label}>
          {items.map((account) => (
            <CupertinoListItem
              key={account.id}
              label={account.name}
              value={format(account.balance, account.currency)}
              icon={<AccountTypeIcon type={account.type} size={18} />}
              chevron
              onClick={() => { setEditing(account); setShowForm(true) }}
            />
          ))}
        </CupertinoListGroup>
      ))}

      <CupertinoSheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Edit Account' : 'New Account'}
      >
        <AccountForm
          account={editing}
          onDone={() => setShowForm(false)}
        />
      </CupertinoSheet>
    </div>
  )
}
