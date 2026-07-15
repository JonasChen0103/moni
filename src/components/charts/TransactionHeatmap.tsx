import type { Transaction } from '../../models/types'

interface Props {
  transactions: Transaction[]
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const WEEKS = 13

export function TransactionHeatmap({ transactions }: Props) {
  if (transactions.length === 0) return null

  const today = new Date()
  const countMap = new Map<string, number>()
  for (const t of transactions) {
    countMap.set(t.date, (countMap.get(t.date) ?? 0) + 1)
  }

  const maxCount = Math.max(1, ...countMap.values())

  const cells: { date: string; count: number; col: number; row: number }[] = []
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1) - startDate.getDay())

  const monthLabels: { label: string; col: number }[] = []
  let lastMonth = -1

  for (let week = 0; week < WEEKS; week++) {
    for (let day = 0; day < 7; day++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + week * 7 + day)
      if (d > today) continue
      const dateStr = d.toISOString().split('T')[0]
      const count = countMap.get(dateStr) ?? 0
      cells.push({ date: dateStr, count, col: week, row: day })

      if (day === 0 && d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth()
        monthLabels.push({
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          col: week,
        })
      }
    }
  }

  const cellSize = 14
  const gap = 3
  const labelWidth = 28
  const topPad = 16

  return (
    <div>
      <div className="text-ios-secondary text-[12px] uppercase tracking-wider mb-3">Activity</div>
      <div className="overflow-x-auto -mx-1 px-1">
        <svg
          width={labelWidth + WEEKS * (cellSize + gap)}
          height={topPad + 7 * (cellSize + gap)}
          className="block"
        >
          {monthLabels.map((m) => (
            <text
              key={m.col}
              x={labelWidth + m.col * (cellSize + gap)}
              y={11}
              fill="currentColor"
              className="text-ios-tertiary"
              fontSize="10"
            >
              {m.label}
            </text>
          ))}
          {DAY_LABELS.map((label, i) => (
            label && (
              <text
                key={i}
                x={0}
                y={topPad + i * (cellSize + gap) + cellSize - 2}
                fill="currentColor"
                className="text-ios-tertiary"
                fontSize="10"
              >
                {label}
              </text>
            )
          ))}
          {cells.map((c) => (
            <rect
              key={c.date}
              x={labelWidth + c.col * (cellSize + gap)}
              y={topPad + c.row * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={getColor(c.count, maxCount)}
            >
              <title>{c.date}: {c.count} transaction{c.count !== 1 ? 's' : ''}</title>
            </rect>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-end gap-1 mt-2 mr-1">
        <span className="text-[10px] text-ios-tertiary mr-1">Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((level, i) => (
          <div
            key={i}
            className="w-[10px] h-[10px] rounded-[2px]"
            style={{ backgroundColor: getColor(level * maxCount, maxCount) }}
          />
        ))}
        <span className="text-[10px] text-ios-tertiary ml-1">More</span>
      </div>
    </div>
  )
}

function getColor(count: number, max: number): string {
  if (count === 0) {
    const isDark = document.documentElement.classList.contains('dark')
    return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(2,64,89,0.06)'
  }
  const intensity = Math.min(count / max, 1)
  if (intensity <= 0.25) return 'rgba(2,64,89,0.2)'
  if (intensity <= 0.5) return 'rgba(2,64,89,0.4)'
  if (intensity <= 0.75) return 'rgba(2,64,89,0.65)'
  return '#024059'
}
