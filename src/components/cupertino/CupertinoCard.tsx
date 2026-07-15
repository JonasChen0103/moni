import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function CupertinoCard({ children, className = '', onClick }: Props) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`bg-ios-card dark:bg-ios-card rounded-2xl p-4 mx-4 mb-3 text-left w-auto border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none ${
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : ''
      } ${className}`}
    >
      {children}
    </Comp>
  )
}
