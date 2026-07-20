import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { projects } from '@/data/projects'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { RoadCurve } from '@/components/DrawnElements'
import { ProjectIcon } from '@/components/icons/ProjectIcons'
import { Button } from '@/components/ui/Button'

export function Projetos() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-hidden text-white bg-[#0B1429]">
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_70%_0%,#1E3468_0%,transparent_55%)]" />
        <RoadCurve className="absolute bottom-16 left-0 w-full h-28 opacity-40 pointer-events-none" id="prRoad" />
        <div className="relative max-w-[1240px] mx-auto px-5 md:px-6 pt-16 md:pt-24 pb-20 md:pb-28">
          <Reveal>
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue-soft mb-4">
              Portfólio
            </span>
            <h1 className="font-display font-black text-[44px] md:text-[56px] leading-[1.05] m-0 mb-5">
              Nossos Projetos
            </h1>
            <p className="text-xl text-white/70 max-w-2xl m-0 leading-relaxed">
              Cinco frentes de saúde móvel, adaptáveis à realidade de cada município — da atenção
              médica à saúde animal, com a mesma excelência operacional.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-10 flex flex-wrap gap-2">
            {projects.map((p) => (
              <a
                key={p.id}
                href={`#${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: p.colors.from }}
                />
                {p.name}
              </a>
            ))}
          </Reveal>
        </div>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="relative block w-full h-10" aria-hidden>
          <path d="M0 48 V20 C 480 0, 960 40, 1440 12 V48 Z" fill="#F7F9FC" />
        </svg>
      </section>

      <section className="bg-soft">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-14 md:py-16 space-y-10 md:space-y-14">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.03}>
              <article
                id={p.slug}
                className="scroll-mt-28 grid lg:grid-cols-2 gap-0 rounded-[28px] overflow-hidden bg-white border border-[rgba(21,35,71,0.06)] shadow-[0_8px_40px_rgba(21,35,71,0.05)]"
              >
                <div
                  className={`relative bg-[#eef2f7] min-h-[280px] lg:min-h-0 lg:aspect-square overflow-hidden ${
                    i % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 z-[1]"
                    style={{ background: `linear-gradient(90deg, ${p.colors.from}, ${p.colors.to})` }}
                  />
                  <img
                    src={p.image}
                    alt={`Unidade ${p.name}`}
                    className="absolute inset-0 w-full h-full object-contain p-4 md:p-8"
                  />
                </div>

                <div className={`p-8 md:p-11 flex flex-col justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                      style={{ background: `linear-gradient(135deg, ${p.colors.from}, ${p.colors.to})` }}
                    >
                      <ProjectIcon id={p.id} size={22} />
                    </span>
                    <span
                      className="text-[11.5px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                      style={{ background: p.colors.soft, color: p.colors.from }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-[30px] md:text-[36px] text-navy m-0 mb-2">
                    {p.name}
                  </h2>
                  <p
                    className="font-semibold text-[15px] m-0 mb-4 italic"
                    style={{ color: p.colors.from }}
                  >
                    “{p.signature}”
                  </p>
                  <p className="text-[15.5px] leading-[1.65] text-[#4A5568] m-0 mb-6">{p.short}</p>

                  <ul className="m-0 p-0 list-none space-y-2 mb-8">
                    {p.services.slice(0, 4).map((s) => (
                      <li key={s} className="flex items-start gap-2.5 text-[14px] text-navy">
                        <span
                          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                          style={{ background: p.colors.from }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      size="md"
                      style={{ background: p.colors.from }}
                      className="border-0 text-white hover:opacity-95"
                    >
                      <Link to={`/projetos/${p.slug}`}>
                        Conhecer o {p.name}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="md">
                      <Link to={`/contato?projeto=${p.slug}`}>
                        Solicitar informações
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Cada município tem uma necessidade"
        body="Nós temos um projeto para cada uma delas. Solicite uma apresentação institucional."
        cta="Solicitar apresentação institucional"
      />
    </div>
  )
}
