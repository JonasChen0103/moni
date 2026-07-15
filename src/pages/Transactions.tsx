import { useState } from 'react'
import { CupertinoNavBar, NavBarAddButton, CupertinoListGroup, CupertinoListItem, CupertinoSheet } from '../components/cupertino'
import { useTransactionStore } from '../stores/useTransactionStore'
import { useAccountStore } from '../stores/useAccountStore'
import { useInstallmentStore } from '../stores/useInstallmentStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import { TransactionForm } from '../components/TransactionForm'
import { InstallmentForm } from '../components/InstallmentForm'
import { InstallmentDetail } from '../components/InstallmentDetail'
import { DebtForm } from '../components/DebtForm'
import { DebtSummary } from '../components/DebtSummary'
import type { Transaction, Installment } from '../models/types'

type Tab = 'transactions' | 'installments' | 'splits'

const TAB_LABELS: Record<Tab, string> = {
  transactions: 'Transactions',
  installments: 'Installments',
  splits: 'Splits',
}

export default function Transactions() {
  const { transactions } = useTransactionStore()
  const { accounts } = useAccountStore()
  const { installments } = useInstallmentStore()
  const { format } = useCurrencyStore()
  const [tab, setTab] = useState<Tab>('transactions')
  const [showTxForm, setShowTxForm] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [showInstForm, setShowInstForm] = useState(false)
  const [viewingInst, setViewingInst] = useState<Installment | null>(null)
  const [showDebtForm, setShowDebtForm] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = transactions.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.category.toLowerCase().includes(q) ||
      t.note?.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    )
  })

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, t) => {
    const key = t.date
    ;(acc[key] ??= []).push(t)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? 'Unknown'

  const handleAdd = () => {
    if (tab === 'transactions') { setEditingTx(null); setShowTxForm(true) }
    else if (tab === 'installments') setShowInstForm(true)
    else setShowDebtForm(true)
  }

  return (
    <div className="flex-1 pb-24 bg-ios-bg dark:bg-ios-bg">
      <CupertinoNavBar
        title="Activity"
        largeTitle={false}
        trailing={<NavBarAddButton onClick={handleAdd} />}
      />

      <div className="mx-4 mb-3">
        <div className="flex bg-ios-fill dark:bg-ios-fill rounded-[10px] p-0.5">
          {(['transactions', 'installments', 'splits'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-lg border-0 cursor-pointer transition-all ${
                tab === t
                  ? 'bg-ios-card dark:bg-ios-card text-ios-label dark:text-ios-label shadow-sm'
                  : 'bg-transparent text-ios-secondary'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {tab === 'transactions' && (
        <>
          <div className="mx-4 mb-4">
            <div className="flex items-center bg-ios-fill dark:bg-ios-fill rounded-[10px] px-3 gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search transactions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent py-2 text-[17px] border-0 outline-none text-ios-label dark:text-ios-label placeholder:text-ios-tertiary"
              />
            </div>
          </div>

          {sortedDates.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-12 h-12 rounded-xl bg-ios-fill flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-ios-tertiary text-[15px]">No transactions yet</span>
            </div>
          )}

          {sortedDates.map((date) => (
            <CupertinoListGroup key={date} header={formatDate(date)}>
              {grouped[date].map((tx) => (
                <CupertinoListItem
                  key={tx.id}
                  label={tx.category}
                  value={
                    <span className={tx.type === 'income' ? 'text-ios-green' : ''}>
                      {tx.type === 'income' ? '+' : '-'}{format(Math.abs(tx.amount), tx.currency)}
                    </span>
                  }
                  chevron
                  onClick={() => { setEditingTx(tx); setShowTxForm(true) }}
                  icon={<span className="text-[13px] text-ios-secondary truncate max-w-[80px] inline-block">{accountName(tx.accountId)}</span>}
                />
              ))}
            </CupertinoListGroup>
          ))}
        </>
      )}

      {tab === 'installments' && (
        <>
          {installments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-12 h-12 rounded-xl bg-ios-fill flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 14h3" />
                </svg>
              </div>
              <span className="text-ios-tertiary text-[15px]">No installments yet</span>
            </div>
          )}
          {installments.length > 0 && (
            <CupertinoListGroup>
              {installments.map((inst) => (
                <CupertinoListItem
                  key={inst.id}
                  label={inst.description}
                  value={<span className="text-ios-blue font-medium">APR {inst.apr?.toFixed(1)}%</span>}
                  chevron
                  onClick={() => setViewingInst(inst)}
                />
              ))}
            </CupertinoListGroup>
          )}
        </>
      )}

      {tab === 'splits' && <DebtSummary />}

      <CupertinoSheet open={showTxForm} onClose={() => setShowTxForm(false)} title={editingTx ? 'Edit Transaction' : 'New Transaction'}>
        <TransactionForm transaction={editingTx} onDone={() => setShowTxForm(false)} />
      </CupertinoSheet>

      <CupertinoSheet open={showInstForm} onClose={() => setShowInstForm(false)} title="New Installment">
        <InstallmentForm onDone={() => setShowInstForm(false)} />
      </CupertinoSheet>

      <CupertinoSheet open={!!viewingInst} onClose={() => setViewingInst(null)} title="Installment">
        {viewingInst && <InstallmentDetail installment={viewingInst} onDone={() => setViewingInst(null)} />}
      </CupertinoSheet>

      <CupertinoSheet open={showDebtForm} onClose={() => setShowDebtForm(false)} title="Split Bill">
        <DebtForm onDone={() => setShowDebtForm(false)} />
      </CupertinoSheet>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
