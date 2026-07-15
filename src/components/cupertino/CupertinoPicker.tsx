import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}

export function CupertinoPicker({ label, value, onChange, options }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center min-h-[44px] px-4 border-b border-ios-separator last:border-b-0 bg-transparent border-x-0 border-t-0 cursor-pointer text-left"
      >
        <span className="text-[15px] text-ios-secondary w-24 flex-shrink-0">{label}</span>
        <span className="flex-1 text-[17px] text-right text-ios-blue truncate">{selected?.label ?? value}</span>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="ml-1.5 text-ios-tertiary flex-shrink-0">
          <path d="M2 5.5L5 3l3 2.5M2 10.5L5 13l3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-3 top-full z-50 mt-1 min-w-[180px] max-h-[260px] overflow-y-auto bg-ios-card dark:bg-ios-card rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-ios-separator animate-picker-in">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-[15px] border-0 cursor-pointer transition-colors flex items-center justify-between gap-2
                ${o.value === value
                  ? 'bg-ios-blue/8 text-ios-blue font-medium'
                  : 'bg-transparent text-ios-label dark:text-ios-label hover:bg-ios-fill active:bg-ios-fill'
                }`}
            >
              <span className="truncate">{o.label}</span>
              {o.value === value && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="flex-shrink-0">
                  <path d="M1 5l4 4L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
