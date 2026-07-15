import { useState } from 'react'
import { CupertinoListGroup, CupertinoListItem, CupertinoSheet, CupertinoButton } from './cupertino'
import { useDebtStore } from '../stores/useDebtStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import type { Debt } from '../models/types'

export function DebtSummary() {
  const { debts, summaryByPerson, settle, unsettle, remove } = useDebtStore()
  const { format } = useCurrencyStore()
  const [viewPerson, setViewPerson] = useState<string | null>(null)

  const summary = summaryByPerson()
  const totalOwedToMe = summary.filter((s) => s.net > 0).reduce((sum, s) => sum + s.net, 0)
  const totalIOwe = summary.filter((s) => s.net < 0).reduce((sum, s) => sum + Math.abs(s.net), 0)

  const personDebts = viewPerson
    ? debts.filter((d) => d.person === viewPerson).sort((a, b) => b.date.localeCompare(a.date))
    : []

  return (
    <>
      {summary.length === 0 && (
        <div className="flex items-center justify-center h-32 text-ios-tertiary text-[15px]">
          No outstanding debts
        </div>
      )}

      {summary.length > 0 && (
        <div className="mx-4 mb-4 grid grid-cols-2 gap-3">
          <div className="bg-ios-card dark:bg-ios-card rounded-2xl p-3.5">
            <div className="text-ios-secondary text-[12px] uppercase tracking-wide">Owed to me</div>
            <div className="text-[22px] font-bold text-ios-green mt-0.5">{format(totalOwedToMe, 'TWD')}</div>
          </div>
          <div className="bg-ios-card dark:bg-ios-card rounded-2xl p-3.5">
            <div className="text-ios-secondary text-[12px] uppercase tracking-wide">I owe</div>
            <div className="text-[22px] font-bold text-ios-red mt-0.5">{format(totalIOwe, 'TWD')}</div>
          </div>
        </div>
      )}

      {summary.length > 0 && (
        <CupertinoListGroup header="By Person">
          {summary.map((s) => (
            <CupertinoListItem
              key={s.person}
              label={s.person}
              value={
                <span className={s.net > 0 ? 'text-ios-green font-medium' : 'text-ios-red font-medium'}>
                  {s.net > 0 ? `owes me ${format(s.net, s.currency)}` : `I owe ${format(Math.abs(s.net), s.currency)}`}
                </span>
              }
              chevron
              onClick={() => setViewPerson(s.person)}
            />
          ))}
        </CupertinoListGroup>
      )}

      <CupertinoSheet open={!!viewPerson} onClose={() => setViewPerson(null)} title={viewPerson ?? ''}>
        {viewPerson && (
          <div className="space-y-3">
            {personDebts.map((d) => (
              <DebtRow key={d.id} debt={d} format={format} settle={settle} unsettle={unsettle} remove={remove} />
            ))}
          </div>
        )}
      </CupertinoSheet>
    </>
  )
}

function DebtRow({
  debt, format, settle, unsettle, remove,
}: {
  debt: Debt
  format: (n: number, c: string) => string
  settle: (id: string) => Promise<void>
  unsettle: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
}) {
  return (
    <div className={`bg-ios-card dark:bg-ios-card rounded-xl p-3.5 ${debt.settled ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium truncate">{debt.description || 'No description'}</div>
          <div className="text-[13px] text-ios-secondary">{debt.date}</div>
        </div>
        <div className={`text-[17px] font-semibold ml-3 ${debt.amount > 0 ? 'text-ios-green' : 'text-ios-red'}`}>
          {debt.amount > 0 ? '+' : ''}{format(debt.amount, debt.currency)}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <CupertinoButton
          variant="tinted"
          onClick={() => debt.settled ? unsettle(debt.id) : settle(debt.id)}
        >
          {debt.settled ? 'Undo Settle' : 'Settle'}
        </CupertinoButton>
        <CupertinoButton
          variant="plain"
          onClick={() => { if (confirm('Delete?')) remove(debt.id) }}
        >
          <span className="text-ios-red">Delete</span>
        </CupertinoButton>
      </div>
    </div>
  )
}
