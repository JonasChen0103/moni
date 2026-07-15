import type { AccountType } from '../../models/types'

const COLORS: Record<AccountType, string> = {
  credit: '#FF6B6B',
  checking: '#007AFF',
  savings: '#34C759',
  debit: '#5856D6',
  insurance: '#FF9500',
  investment: '#AF52DE',
  cash: '#30D158',
  prepaid: '#FF2D55',
}

interface Props {
  type: AccountType
  size?: number
}

export function AccountTypeIcon({ type, size = 22 }: Props) {
  const color = COLORS[type]
  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ width: size + 8, height: size + 8, backgroundColor: `${color}18` }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths[type]}
      </svg>
    </div>
  )
}

const iconPaths: Record<AccountType, React.ReactNode> = {
  credit: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </>
  ),
  checking: (
    <>
      <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  savings: (
    <>
      <path d="M19 11V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h4" />
      <circle cx="18" cy="16" r="4" />
      <path d="M18 14v4M16 16h4" />
    </>
  ),
  debit: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <circle cx="16" cy="12" r="2" />
      <path d="M6 9h5" />
    </>
  ),
  insurance: (
    <>
      <path d="M12 2L4 6v6c0 5.5 3.4 10.2 8 12 4.6-1.8 8-6.5 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  investment: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 9h2M20 9h2M2 15h2M20 15h2" />
    </>
  ),
  prepaid: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M8 14h3M15 14h2" />
    </>
  ),
}
