import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/Reveal'

interface CtaBandProps {
  title: string
  body: string
  cta?: string
  href?: string
  from?: string
  to?: string
}

export function CtaBand({
  title,
  body,
  cta = 'Solicitar mais informações',
  href = '/contato',
  from = '#152347',
  to = '#0F1A38',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}
      />
      <div className="absolute top-[-80px] right-[10%] w-[360px] h-[360px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-[1240px] mx-auto px-5 md:px-6 py-20 md:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="font-display font-extrabold text-[32px] md:text-[42px] leading-tight text-white m-0">
            {title}
          </h2>
          <p className="mt-4 text-lg text-white/75 leading-relaxed m-0">{body}</p>
          <div className="mt-8">
            <Button asChild variant="solidLight" size="lg">
              <Link to={href}>
                {cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
