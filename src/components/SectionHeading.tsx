import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-[760px]',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block font-bold text-[13.5px] tracking-[0.14em] uppercase mb-4',
            light ? 'text-brand-blue-soft' : 'text-brand-blue',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-display font-extrabold text-[34px] md:text-[44px] leading-[1.08] tracking-tight m-0',
          light ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed m-0',
            light ? 'text-white/65' : 'text-muted',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
