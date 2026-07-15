import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  largeTitle?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  icon?: ReactNode
}

export function CupertinoNavBar({ title, subtitle, largeTitle = true, leading, trailing, icon }: Props) {
  return (
    <div className="sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-11 bg-ios-bg/80 dark:bg-ios-bg/80 backdrop-blur-xl">
        <div className="min-w-[52px] flex justify-start">{leading}</div>
        {!largeTitle && <span className="text-[17px] font-semibold">{title}</span>}
        <div className="min-w-[52px] flex justify-end">{trailing}</div>
      </div>
      {largeTitle && (
        <div className="px-5 pt-1 pb-3 bg-ios-bg dark:bg-ios-bg">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-[12px] bg-ios-blue/10 dark:bg-ios-blue/20 flex items-center justify-center text-ios-blue flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-[28px] font-bold tracking-tight leading-tight m-0">{title}</h1>
              {subtitle && <p className="text-[13px] text-ios-secondary m-0 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function NavBarAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[30px] h-[30px] rounded-full bg-ios-blue flex items-center justify-center border-0 cursor-pointer active:opacity-70 transition-opacity"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
