import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DetailDrawer({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-stretch sm:justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-navy/45 border-0 cursor-pointer"
        aria-label="Fechar"
        onClick={onClose}
      />
      {/* Mobile: bottom sheet | Desktop: side drawer */}
      <div
        className={cn(
          'relative z-10 bg-white shadow-2xl flex flex-col',
          // mobile bottom sheet
          'w-full max-h-[92dvh] rounded-t-3xl',
          // desktop side panel
          'sm:max-h-none sm:h-full sm:w-full sm:max-w-md sm:rounded-none',
        )}
      >
        {/* handle mobile */}
        <div className="sm:hidden flex justify-center pt-2 pb-1" aria-hidden>
          <span className="w-10 h-1 rounded-full bg-line" />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-line">
          <h2 className="font-display font-extrabold text-base sm:text-lg text-navy m-0 truncate pr-2">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 shrink-0 rounded-xl border border-line bg-soft inline-flex items-center justify-center cursor-pointer hover:bg-white"
            aria-label="Fechar painel"
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 sm:py-5 space-y-4">
          {children}
        </div>
        {footer && (
          <div
            className="border-t border-line px-4 sm:px-5 py-3 sm:py-4 bg-soft/50"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted m-0 mb-1">{label}</p>
      <div className="text-[14px] text-navy font-medium break-words leading-relaxed">
        {value || '—'}
      </div>
    </div>
  )
}
