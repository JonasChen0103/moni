import type { ReactNode } from 'react'

interface Props {
  header?: string
  footer?: string
  children: ReactNode
  inset?: boolean
}

export function CupertinoListGroup({ header, footer, children, inset = true }: Props) {
  return (
    <div className={inset ? 'mx-4 mb-5' : 'mb-5'}>
      {header && (
        <div className="text-[13px] uppercase text-ios-secondary tracking-wide px-4 pb-1.5">
          {header}
        </div>
      )}
      <div className="bg-ios-card dark:bg-ios-card rounded-xl overflow-hidden shadow-[0_0.5px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
        {children}
      </div>
      {footer && (
        <div className="text-[13px] text-ios-secondary px-4 pt-1.5">
          {footer}
        </div>
      )}
    </div>
  )
}

interface ItemProps {
  label: string
  value?: ReactNode
  onClick?: () => void
  chevron?: boolean
  destructive?: boolean
  icon?: ReactNode
}

export function CupertinoListItem({ label, value, onClick, chevron = false, destructive = false, icon }: ItemProps) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`w-full flex items-center min-h-[44px] text-left border-0 bg-transparent
        active:bg-ios-fill transition-colors
        ${destructive ? 'text-ios-red' : 'text-ios-label dark:text-ios-label'}
        ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center flex-1 min-h-[44px] ml-4 pr-4 border-b border-ios-separator last:border-b-0 gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 text-[17px] py-3 min-w-0">{label}</span>
        {value && <span className="text-ios-secondary text-[17px] ml-2 flex-shrink-0">{value}</span>}
        {chevron && (
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="ml-0.5 text-ios-tertiary flex-shrink-0">
            <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </Comp>
  )
}
