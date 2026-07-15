import { useMemo, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CupertinoNavBar, NavBarAddButton, CupertinoListGroup, CupertinoListItem, CupertinoSheet } from '../components/cupertino'
import { useAccountStore } from '../stores/useAccountStore'
import { useInstallmentStore } from '../stores/useInstallmentStore'
import { useRecurringStore } from '../stores/useRecurringStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import { generateForecast, type ForecastMonth } from '../services/forecast'
import { RecurringForm } from '../components/RecurringForm'

export default function Forecast() {
  const { accounts } = useAccountStore()
  const { installments } = useInstallmentStore()
  const { recurring } = useRecurringStore()
  const { toBase, format } = useCurrencyStore()
  const [showRecurring, setShowRecurring] = useState(false)
  const [months, setMonths] = useState(12)

  const forecast = useMemo(
    () => generateForecast({ accounts, installments, recurring, toBase, months }),
    [accounts, installments, recurring, toBase, months]
  )

  const hasData = recurring.length > 0 || installments.length > 0 || accounts.some((a) => a.type === 'insurance' && a.premium)

  return (
    <div className="flex-1 pb-24 bg-ios-bg dark:bg-ios-bg">
      <CupertinoNavBar
        title="Forecast"
        subtitle={forecast.length > 0 ? `${months}-month projection` : undefined}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        }
        trailing={<NavBarAddButton onClick={() => setShowRecurring(true)} />}
      />

      <div className="mx-4 mb-3">
        <div className="flex bg-ios-fill dark:bg-ios-fill rounded-[10px] p-0.5">
          {[6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-lg border-0 cursor-pointer transition-all ${
                months === m
                  ? 'bg-ios-card dark:bg-ios-card text-ios-label dark:text-ios-label shadow-sm'
                  : 'bg-transparent text-ios-secondary'
              }`}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {!hasData && accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2 px-8">
          <div className="w-12 h-12 rounded-xl bg-ios-fill flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="text-ios-tertiary text-[15px] text-center">Add accounts and recurring transactions to see forecasts</span>
        </div>
      )}

      {forecast.length > 0 && (
        <>
          <div className="mx-4 mb-4 bg-ios-card dark:bg-ios-card rounded-2xl p-4">
            <div className="text-ios-secondary text-[13px] uppercase mb-2">Net Worth Projection</div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#024059" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#024059" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.1)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(60,60,67,0.6)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(60,60,67,0.6)' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ForecastTooltip format={format} />} />
                  <Area type="monotone" dataKey="projectedNetWorth" stroke="#024059" fill="url(#netWorthGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <CupertinoListGroup header="Monthly Breakdown">
            {forecast.map((m) => (
              <CupertinoListItem
                key={m.month}
                label={m.label}
                value={
                  <span className={m.netChange >= 0 ? 'text-ios-green' : 'text-ios-red'}>
                    {m.netChange >= 0 ? '+' : ''}{format(m.netChange, 'TWD')}
                  </span>
                }
                chevron={false}
              />
            ))}
          </CupertinoListGroup>

          {recurring.length > 0 && (
            <CupertinoListGroup header="Active Recurring">
              {recurring.map((r) => (
                <CupertinoListItem
                  key={r.id}
                  label={`${r.category} (${r.frequency})`}
                  value={
                    <span className={r.type === 'income' ? 'text-ios-green' : ''}>
                      {r.type === 'income' ? '+' : '-'}{format(r.amount, r.currency)}
                    </span>
                  }
                />
              ))}
            </CupertinoListGroup>
          )}
        </>
      )}

      <CupertinoSheet open={showRecurring} onClose={() => setShowRecurring(false)} title="New Recurring">
        <RecurringForm onDone={() => setShowRecurring(false)} />
      </CupertinoSheet>
    </div>
  )
}

function ForecastTooltip({ active, payload, format }: { active?: boolean; payload?: Array<{ payload: ForecastMonth }>; format: (n: number, c: string) => string }) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div className="bg-ios-card dark:bg-ios-card rounded-lg p-3 shadow-lg text-[13px] border border-ios-separator">
      <div className="font-semibold mb-1">{d.label}</div>
      <div className="text-ios-green">Income: {format(d.income, 'TWD')}</div>
      <div className="text-ios-red">Expenses: {format(d.expenses, 'TWD')}</div>
      {d.installments > 0 && <div className="text-ios-orange">Installments: {format(d.installments, 'TWD')}</div>}
      {d.insurance > 0 && <div className="text-ios-purple">Insurance: {format(d.insurance, 'TWD')}</div>}
      <div className="mt-1 font-semibold">Net Worth: {format(d.projectedNetWorth, 'TWD')}</div>
    </div>
  )
}
