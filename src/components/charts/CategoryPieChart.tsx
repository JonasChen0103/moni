import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { Transaction } from '../../models/types'

const COLORS = ['#F472B6', '#C084FC', '#024059', '#34C759', '#FF9500', '#5AC8FA', '#FF3B30', '#FFCC00']

interface Props {
  transactions: Transaction[]
  format: (n: number, c: string) => string
}

export function CategoryPieChart({ transactions, format }: Props) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  if (expenses.length === 0) return null

  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount
    return acc
  }, {})

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div>
      <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-3">Spending by Category</div>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={56}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          {data.slice(0, 5).map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-[13px] truncate flex-1 min-w-0">{d.name}</span>
              <span className="text-[13px] text-ios-secondary font-medium tabular-nums flex-shrink-0">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
          {data.length > 5 && (
            <div className="text-[12px] text-ios-tertiary pl-[18px]">+{data.length - 5} more</div>
          )}
        </div>
      </div>
    </div>
  )
}
