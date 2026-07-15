import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { CupertinoNavBar, CupertinoCard } from '../components/cupertino'
import { AccountTypeIcon } from '../components/icons/AccountTypeIcon'
import { CategoryPieChart } from '../components/charts/CategoryPieChart'
import { TransactionHeatmap } from '../components/charts/TransactionHeatmap'
import { useAccountStore } from '../stores/useAccountStore'
import { useTransactionStore } from '../stores/useTransactionStore'
import { useInstallmentStore } from '../stores/useInstallmentStore'
import { useRecurringStore } from '../stores/useRecurringStore'
import { useDebtStore } from '../stores/useDebtStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import { generateForecast } from '../services/forecast'
import type { AccountType } from '../models/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const { accounts } = useAccountStore()
  const { transactions } = useTransactionStore()
  const { installments } = useInstallmentStore()
  const { recurring } = useRecurringStore()
  const { summaryByPerson } = useDebtStore()
  const { format, toBase } = useCurrencyStore()

  const netWorth = accounts.reduce((sum, a) => {
    const val = a.type === 'credit' ? -a.balance : a.balance
    return sum + toBase(val, a.currency)
  }, 0)

  const forecast = useMemo(
    () => generateForecast({ accounts, installments, recurring, toBase, months: 6 }),
    [accounts, installments, recurring, toBase]
  )

  const recentTxs = transactions.slice(0, 5)

  const accountsByType = accounts.reduce<Record<string, number>>((acc, a) => {
    const val = a.type === 'credit' ? -a.balance : a.balance
    acc[a.type] = (acc[a.type] ?? 0) + toBase(val, a.currency)
    return acc
  }, {})

  const debtSummary = summaryByPerson()

  return (
    <div className="flex-1 pb-24 bg-ios-bg dark:bg-ios-bg">
      <CupertinoNavBar
        title="Moni"
        subtitle={accounts.length > 0 ? `${accounts.length} account${accounts.length !== 1 ? 's' : ''}` : undefined}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        }
      />

      <CupertinoCard>
        <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-0.5">Net Worth</div>
        <div className="text-[34px] font-bold tracking-tight leading-tight">{format(netWorth, 'TWD')}</div>
        {accounts.length > 0 && (
          <div className="text-ios-secondary text-[13px] mt-1">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} across {new Set(accounts.map((a) => a.currency)).size} currenc{new Set(accounts.map((a) => a.currency)).size !== 1 ? 'ies' : 'y'}
          </div>
        )}
      </CupertinoCard>

      {forecast.length > 0 && (
        <CupertinoCard onClick={() => navigate('/forecast')}>
          <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-2">6-Month Forecast</div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#024059" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#024059" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="projectedNetWorth" stroke="#024059" fill="url(#miniGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-1 text-[13px]">
            <span className="text-ios-secondary">Now</span>
            <span className="text-ios-blue font-medium">
              {format(forecast[forecast.length - 1].projectedNetWorth, 'TWD')}
            </span>
          </div>
        </CupertinoCard>
      )}

      {transactions.length > 0 && (
        <CupertinoCard>
          <CategoryPieChart transactions={transactions} format={format} />
        </CupertinoCard>
      )}

      {transactions.length > 0 && (
        <CupertinoCard>
          <TransactionHeatmap transactions={transactions} />
        </CupertinoCard>
      )}

      {debtSummary.length > 0 && (
        <CupertinoCard onClick={() => navigate('/transactions')}>
          <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-3">Splits</div>
          <div className="space-y-2">
            {debtSummary.slice(0, 4).map((s) => (
              <div key={s.person} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-ios-fill dark:bg-ios-fill flex items-center justify-center text-[13px] font-semibold text-ios-secondary">
                    {s.person.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[15px]">{s.person}</span>
                </div>
                <span className={`text-[15px] font-medium ${s.net > 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                  {s.net > 0 ? '+' : ''}{format(s.net, s.currency)}
                </span>
              </div>
            ))}
          </div>
        </CupertinoCard>
      )}

      {Object.keys(accountsByType).length > 0 && (
        <CupertinoCard onClick={() => navigate('/accounts')}>
          <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-3">Accounts</div>
          <div className="space-y-2.5">
            {Object.entries(accountsByType).map(([type, total]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AccountTypeIcon type={type as AccountType} size={18} />
                  <span className="text-[15px] capitalize">{type}</span>
                </div>
                <span className={`text-[15px] font-medium ${total < 0 ? 'text-ios-red' : ''}`}>
                  {format(total, 'TWD')}
                </span>
              </div>
            ))}
          </div>
        </CupertinoCard>
      )}

      {recentTxs.length > 0 && (
        <CupertinoCard onClick={() => navigate('/transactions')}>
          <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-3">Recent Transactions</div>
          <div className="space-y-2.5">
            {recentTxs.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div>
                  <div className="text-[15px]">{tx.category}</div>
                  <div className="text-[12px] text-ios-tertiary">{tx.date}</div>
                </div>
                <span className={`text-[15px] font-medium ${tx.type === 'income' ? 'text-ios-green' : ''}`}>
                  {tx.type === 'income' ? '+' : '-'}{format(Math.abs(tx.amount), tx.currency)}
                </span>
              </div>
            ))}
          </div>
        </CupertinoCard>
      )}

      {accounts.length === 0 && (
        <CupertinoCard onClick={() => navigate('/accounts')}>
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-ios-blue/10 flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#024059" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M12 9v6M9 12h6" />
              </svg>
            </div>
            <div className="text-[17px] font-semibold mb-1">Get Started</div>
            <div className="text-ios-secondary text-[15px]">Add your first account to begin tracking</div>
          </div>
        </CupertinoCard>
      )}
    </div>
  )
}
