import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  hint,
  tone = 'navy',
}: {
  label: string
  value: number
  hint?: string
  tone?: 'navy' | 'blue' | 'green' | 'muted' | 'amber'
}) {
  const tones = {
    navy: 'border-navy/10 bg-white',
    blue: 'border-brand-blue/20 bg-brand-blue/5',
    green: 'border-brand-green/25 bg-brand-green/5',
    muted: 'border-line bg-soft',
    amber: 'border-amber-200 bg-amber-50',
  }
  return (
    <div className={cn('rounded-2xl border p-4 sm:p-5 shadow-sm', tones[tone])}>
      <p className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-muted m-0 mb-1.5 sm:mb-2 leading-snug">
        {label}
      </p>
      <p className="font-display font-extrabold text-[28px] sm:text-[32px] leading-none text-navy m-0 tabular-nums">
        {value}
      </p>
      {hint && <p className="text-[11px] sm:text-[12px] text-muted m-0 mt-1.5 sm:mt-2 leading-snug">{hint}</p>}
    </div>
  )
}
