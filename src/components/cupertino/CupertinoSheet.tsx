import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function CupertinoSheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[520px] bg-ios-card dark:bg-ios-card rounded-t-[14px] max-h-[90dvh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-ios-card dark:bg-ios-card z-10 border-b border-ios-separator">
          <div className="flex justify-center pt-2 pb-0">
            <div className="w-9 h-[5px] bg-ios-tertiary rounded-full" />
          </div>
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={onClose} className="text-ios-blue text-[17px] bg-transparent border-0 cursor-pointer">
              Cancel
            </button>
            {title && <span className="text-[17px] font-semibold">{title}</span>}
            <div className="w-16" />
          </div>
        </div>
        <div className="p-4">{children}</div>
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </div>
  )
}
