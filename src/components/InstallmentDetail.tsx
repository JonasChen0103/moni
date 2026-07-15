import { CupertinoListGroup, CupertinoListItem, CupertinoButton } from './cupertino'
import { useInstallmentStore } from '../stores/useInstallmentStore'
import { useCurrencyStore } from '../stores/useCurrencyStore'
import { generateSchedule } from '../services/irr'
import type { Installment } from '../models/types'

interface Props {
  installment: Installment
  onDone: () => void
}

export function InstallmentDetail({ installment, onDone }: Props) {
  const { remove } = useInstallmentStore()
  const { format } = useCurrencyStore()
  const schedule = generateSchedule(
    installment.principal,
    installment.monthlyPayment,
    installment.totalPeriods,
    installment.startDate
  )

  const handleDelete = async () => {
    if (confirm('Delete this installment?')) {
      await remove(installment.id)
      onDone()
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-ios-card dark:bg-ios-card rounded-[10px] p-4">
        <div className="text-[20px] font-semibold mb-2">{installment.description}</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-ios-secondary text-[13px]">Principal</div>
            <div className="text-[17px] font-medium">{format(installment.principal, installment.currency)}</div>
          </div>
          <div>
            <div className="text-ios-secondary text-[13px]">Monthly</div>
            <div className="text-[17px] font-medium">{format(installment.monthlyPayment, installment.currency)}</div>
          </div>
          <div>
            <div className="text-ios-secondary text-[13px]">Periods</div>
            <div className="text-[17px] font-medium">{installment.totalPeriods} months</div>
          </div>
          <div>
            <div className="text-ios-secondary text-[13px]">APR (IRR)</div>
            <div className="text-[17px] font-bold text-ios-blue">{installment.apr?.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <CupertinoListGroup header="Payment Schedule" inset={false}>
        {schedule.map((s) => (
          <CupertinoListItem
            key={s.period}
            label={`#${s.period} — ${s.date}`}
            value={format(s.payment, installment.currency)}
          />
        ))}
      </CupertinoListGroup>

      <div className="pt-2">
        <CupertinoButton fullWidth variant="plain" onClick={handleDelete}>
          <span className="text-ios-red">Delete Installment</span>
        </CupertinoButton>
      </div>
    </div>
  )
}
