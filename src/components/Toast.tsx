import { useEffect } from 'react'
import { LuCheck, LuX } from 'react-icons/lu'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  open: boolean
  type?: ToastType
  message: string
  onClose?: () => void
  durationMs?: number
}

export const Toast = ({ open, type = 'info', message, onClose, durationMs = 3000 }: ToastProps) => {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      onClose?.()
    }, durationMs)
    return () => clearTimeout(t)
  }, [open, durationMs, onClose])

  if (!open) return null

  const base = 'fixed right-4 bottom-4 z-[60] max-w-md rounded-xl border px-4 py-3 shadow-lg bg-itemsCard border-white/15 text-white toast-in'

  const icon = type === 'error' ? (
    <LuX className="text-white" size={16} />
  ) : (
    <LuCheck className="text-white" size={16} />
  )

  return (
    <div className={base}>
      <div className="flex items-center gap-3">
  <div className="shrink-0 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center bg-black/20">
          {icon}
        </div>
        <div className="text-sm leading-snug">
          {message}
        </div>
      </div>
    </div>
  )
}
