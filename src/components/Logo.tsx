import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LogoVariant = 'auto' | 'light' | 'dark'

interface LogoProps {
  /** light = branco (fundos escuros) · dark = navy (fundos claros) */
  variant?: LogoVariant
  className?: string
  /** altura em px (largura automática) */
  height?: number
  to?: string | null
}

/**
 * Logo oficial MovSaúde.
 * light → /logo-movsaude-light.png (uso em footer/hero escuro)
 * dark  → /logo-movsaude-dark.png  (uso em header claro)
 */
export function Logo({
  variant = 'dark',
  className,
  height = 40,
  to = '/',
}: LogoProps) {
  const src =
    variant === 'light' ? '/logo-movsaude-light.png' : '/logo-movsaude-dark.png'

  const img = (
    <img
      src={src}
      alt="MovSaúde — Saúde que alcança. Cuidado que transforma."
      height={height}
      className={cn('w-auto object-contain object-left', className)}
      style={{ height, width: 'auto' }}
      draggable={false}
    />
  )

  if (to === null) return img

  return (
    <Link
      to={to}
      className="inline-flex items-center shrink-0 group"
      aria-label="MovSaúde — página inicial"
    >
      <span className="transition-transform duration-200 group-hover:scale-[1.02]">
        {img}
      </span>
    </Link>
  )
}
