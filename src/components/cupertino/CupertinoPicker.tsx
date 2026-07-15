import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

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
  const [pos, setPos] = useState<{ top: number; left: number; width: number; openUp: boolean }>({ top: 0, left: 0, width: 0, openUp: false })
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selected = options.find((o) => o.value === value)

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const dropdownH = Math.min(options.length * 40 + 8, 268)
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const openUp = spaceBelow < dropdownH && rect.top > spaceBelow
    setPos({
      top: openUp ? rect.top : rect.bottom + 4,
      left: Math.max(8, rect.right - Math.min(240, rect.width)),
      width: Math.min(240, Math.max(180, rect.width)),
      openUp,
    })
  }, [options.length])

  useEffect(() => {
    if (!open) return
    updatePos()
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    const handleScroll = () => setOpen(false)
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open, updatePos])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center min-h-[44px] px-4 border-b border-ios-separator last:border-b-0 bg-transparent border-x-0 border-t-0 cursor-pointer text-left"
      >
        <span className="text-[15px] text-ios-secondary w-24 flex-shrink-0">{label}</span>
        <span className="flex-1 text-[17px] text-right text-ios-blue truncate">{selected?.label ?? value}</span>
        <div className={`ml-1.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" className="text-ios-tertiary" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && createPortal(
        <div
          className="fixed z-[200] animate-picker-in"
          style={{
            top: pos.openUp ? undefined : pos.top,
            bottom: pos.openUp ? window.innerHeight - pos.top + 4 : undefined,
            left: pos.left,
            width: pos.width,
          }}
        >
          <div className="max-h-[260px] overflow-y-auto bg-ios-card dark:bg-ios-card rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] border border-ios-separator py-1">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full text-left px-3.5 py-2.5 text-[15px] border-0 cursor-pointer transition-colors flex items-center justify-between gap-2
                  ${o.value === value
                    ? 'bg-ios-blue/10 text-ios-blue font-medium'
                    : 'bg-transparent text-ios-label dark:text-ios-label active:bg-ios-fill'
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
        </div>,
        document.body
      )}
    </>
  )
}
