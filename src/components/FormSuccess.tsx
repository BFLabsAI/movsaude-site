import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export type FormSuccessStep = {
  title: string
  description: string
}

export type FormSuccessProps = {
  badge?: string
  title: string
  lead: string
  steps?: FormSuccessStep[]
  /** Ícone principal no anel de sucesso */
  icon?: LucideIcon
  primaryCta?: { to: string; label: string }
  secondaryCta?: { to: string; label: string }
  className?: string
}

export function FormSuccess({
  badge = 'Mensagem recebida',
  title,
  lead,
  steps,
  icon: Icon = Check,
  primaryCta = { to: '/', label: 'Voltar ao início' },
  secondaryCta,
  className,
}: FormSuccessProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative overflow-hidden py-6 sm:py-8', className)}
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[28rem] -translate-x-1/2 rounded-full bg-brand-green/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-brand-blue/10 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-lg text-center">
        {/* Success mark */}
        <div className="relative mx-auto mb-7 h-[88px] w-[88px]">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-brand-green/25"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.15, opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            aria-hidden
          />
          <motion.span
            className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-green/20 to-brand-blue/10"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            aria-hidden
          />
          <motion.div
            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-[#3d9a28] text-white shadow-[0_12px_30px_rgba(92,184,58,0.35)]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.08 }}
          >
            <Icon className="h-8 w-8" strokeWidth={2.5} aria-hidden />
          </motion.div>
        </div>

        <motion.span
          className="mb-3 inline-flex items-center rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2f7a1f]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {badge}
        </motion.span>

        <motion.h2
          className="font-display m-0 mb-3 text-[26px] font-extrabold leading-tight tracking-tight text-navy sm:text-[30px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="m-0 mx-auto max-w-md text-[15px] leading-relaxed text-muted sm:text-base"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          {lead}
        </motion.p>

        {steps && steps.length > 0 && (
          <motion.ol
            className="m-0 mt-8 list-none space-y-0 rounded-2xl border border-line bg-soft/80 p-2 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={cn(
                  'flex gap-3.5 rounded-xl px-3.5 py-3.5',
                  i < steps.length - 1 && 'border-b border-line/80',
                )}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white shadow-sm">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-navy">{step.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </motion.ol>
        )}

        <motion.div
          className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
        >
          <Button asChild size="lg" className="min-w-[180px]">
            <Link to={primaryCta.to}>
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondaryCta && (
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
