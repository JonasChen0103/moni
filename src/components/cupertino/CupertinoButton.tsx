import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'filled' | 'tinted' | 'plain'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function CupertinoButton({
  children,
  onClick,
  variant = 'filled',
  fullWidth = false,
  disabled = false,
  type = 'button',
}: Props) {
  const base = 'rounded-[14px] font-semibold text-[17px] transition-all active:scale-[0.97] disabled:opacity-40 border-0 cursor-pointer'
  const width = fullWidth ? 'w-full' : ''
  const padding = 'px-5 py-3'

  const styles: Record<string, string> = {
    filled: 'bg-gradient-to-r from-ios-blue to-ios-blue/90 text-white shadow-[0_2px_8px_rgba(2,64,89,0.3)]',
    tinted: 'bg-ios-blue/12 text-ios-blue',
    plain: 'bg-transparent text-ios-blue',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${padding} ${width} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}
