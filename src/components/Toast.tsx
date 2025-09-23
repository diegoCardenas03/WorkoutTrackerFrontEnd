import { useEffect, useState } from 'react'
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
  const [visible, setVisible] = useState(open)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      setExiting(false)
      const t = setTimeout(() => {
        // start exit animation
        setExiting(true)
        // then call onClose after animation duration
        setTimeout(() => {
          setVisible(false)
          onClose?.()
        }, 220)
      }, durationMs)
      return () => clearTimeout(t)
    } else {
      // if open turned false externally, trigger exit animation
      if (visible) {
        setExiting(true)
        setTimeout(() => {
          setVisible(false)
        }, 220)
      }
    }
  }, [open, durationMs, onClose])

  if (!visible) return null

  const base = `fixed right-4 bottom-4 z-[60] max-w-md rounded-xl border px-4 py-3 shadow-lg bg-itemsCard border-white/15 text-white ${exiting ? 'toast-out' : 'toast-in'}`

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
