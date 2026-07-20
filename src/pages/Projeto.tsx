import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, Users } from 'lucide-react'
import { getProject } from '@/data/projects'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { CtaBand } from '@/components/CtaBand'
import { Button } from '@/components/ui/Button'
import { RoadLine } from '@/components/RoadLine'

export function Projeto() {
  const { slug } = useParams()
  const p = slug ? getProject(slug) : undefined
  if (!p) return <Navigate to="/projetos" replace />

  const light = p.lightHero

  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        style={
          light
            ? { background: `linear-gradient(140deg, ${p.colors.soft} 0%, #fff 45%, ${p.colors.soft} 100%)` }
            : { background: `radial-gradient(120% 130% at 70% 0%, ${p.colors.to} 0%, ${p.colors.from} 55%, #0a1628 100%)` }
        }
      >
        {!light && <RoadLine className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.3} />}
        <div className="relative max-w-[1240px] mx-auto px-5 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <Reveal>
              <span
                className={`inline-flex text-[13px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-5 border ${
                  light ? 'border-black/10' : 'border-white/20 bg-white/10'
                }`}
                style={light ? { color: p.colors.from, background: p.colors.soft } : undefined}
              >
                {p.tag}
              </span>
              <h1
                className={`font-display font-black text-[44px] md:text-[56px] leading-tight m-0 mb-5 ${
                  light ? 'text-navy' : 'text-white'
                }`}
              >
                {p.name}
              </h1>
              <p className={`text-lg md:text-xl leading-relaxed m-0 mb-4 max-w-xl ${light ? 'text-muted' : 'text-white/75'}`}>
                {p.heroSubtitle}
              </p>
              <p
                className={`font-semibold text-lg m-0 mb-8 italic ${light ? '' : 'text-white/90'}`}
                style={light ? { color: p.colors.from } : { color: p.colors.accent }}
              >
                “{p.signature}”
              </p>
              <Button
                asChild
                size="lg"
                className={light ? undefined : 'bg-white text-navy hover:bg-white/95'}
                style={light ? { background: p.colors.from, color: '#fff' } : undefined}
              >
                <Link to={`/contato?projeto=${p.slug}`}>
                  Solicitar informações
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </Reveal>
            <Reveal delay={0.1} className="relative">
              {/* Mesmo tratamento da home: arte inteira, sem crop */}
              <div
                className="rounded-[20px] overflow-hidden bg-white"
                style={{
                  boxShadow: light
                    ? `0 32px 80px -20px ${p.colors.from}44, 0 16px 40px rgba(14,26,51,0.12)`
                    : `0 40px 100px -20px ${p.colors.from}66, 0 20px 40px rgba(0,0,0,0.28)`,
                }}
              >
                <div className="relative aspect-square bg-[#eef2f7]">
                  <img
                    src={p.image}
                    alt={`Unidade ${p.name}`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-12 -mb-px" aria-hidden>
          <path d="M0 60 L0 28 Q 720 0 1440 28 L1440 60 Z" fill="#F7F9FC" />
        </svg>
      </section>

      <section className="max-w-[1240px] mx-auto px-5 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <Reveal>
            <SectionHeading eyebrow="O projeto" title={p.aboutTitle} />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="space-y-5">
              {p.aboutBody.map((t) => (
                <p key={t.slice(0, 40)} className="text-[17px] leading-relaxed text-muted m-0">
                  {t}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white border-y border-line">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-20">
          <Reveal>
            <SectionHeading title={p.structureTitle} className="mb-10" />
          </Reveal>
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {p.structure.map((s) => (
                <div
                  key={s.title}
                  className="rounded-[20px] border border-line p-6 shadow-soft hover:-translate-y-1 transition-transform"
                  style={{ background: `linear-gradient(180deg, ${p.colors.soft}, #fff)` }}
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4"
                    style={{ background: `linear-gradient(135deg, ${p.colors.from}, ${p.colors.to})` }}
                  >
                    <Check size={18} />
                  </span>
                  <h3 className="font-display font-bold text-navy text-lg m-0 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted m-0">{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-5 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <Reveal>
            <SectionHeading title={p.servicesTitle} className="mb-8" />
            <ul className="space-y-3 m-0 p-0 list-none">
              {p.services.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[16px] text-navy">
                  <span
                    className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ background: p.colors.from }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-[24px] border border-line bg-white p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                  style={{ background: p.colors.from }}
                >
                  <Users size={20} />
                </span>
                <h3 className="font-display font-extrabold text-xl text-navy m-0">{p.teamTitle}</h3>
              </div>
              <p className="text-sm text-muted mb-5">
                Cada unidade opera com equipe completa e dedicada:
              </p>
              <div className="flex flex-wrap gap-2">
                {p.team.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-line"
                    style={{ background: p.colors.soft, color: p.colors.from }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={p.ctaTitle}
        body={p.ctaBody}
        href={`/contato?projeto=${p.slug}`}
        from={p.colors.from}
        to={p.colors.to}
      />
    </>
  )
}
