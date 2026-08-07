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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-navy/40 border-0 cursor-pointer"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 h-full w-full max-w-md bg-white shadow-2xl flex flex-col',
          'animate-in slide-in-from-right',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <h2 className="font-display font-extrabold text-lg text-navy m-0 truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-line bg-soft inline-flex items-center justify-center cursor-pointer hover:bg-white"
            aria-label="Fechar painel"
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4 bg-soft/50">{footer}</div>}
      </div>
    </div>
  )
}

export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted m-0 mb-1">{label}</p>
      <div className="text-[14px] text-navy font-medium break-words">{value || '—'}</div>
    </div>
  )
}
