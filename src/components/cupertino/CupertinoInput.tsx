import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function CupertinoInput({ label, ...props }: Props) {
  return (
    <div className="flex items-center min-h-[44px] px-4 border-b border-ios-separator last:border-b-0">
      <label className="text-[15px] text-ios-secondary w-24 flex-shrink-0">{label}</label>
      <input
        {...props}
        className="flex-1 text-[17px] text-right bg-transparent border-0 outline-none text-ios-label dark:text-ios-label py-3 placeholder:text-ios-tertiary min-w-0"
      />
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

export function CupertinoSelect({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex items-center min-h-[44px] px-4 border-b border-ios-separator last:border-b-0">
      <label className="text-[15px] text-ios-secondary w-24 flex-shrink-0">{label}</label>
      <div className="flex-1 flex items-center justify-end gap-1 min-w-0">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[17px] text-right bg-transparent border-0 outline-none text-ios-blue appearance-none cursor-pointer py-3 min-w-0 max-w-full pr-0"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="text-ios-tertiary flex-shrink-0">
          <path d="M1.5 4.5L4 2l2.5 2.5M1.5 8.5L4 11l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
