import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { projects } from '@/data/projects'
import { cityUnits, metrics } from '@/data/locations'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'
import { BrazilMap } from '@/components/BrazilMap'
import { HeroSlider } from '@/components/HeroSlider'
import { ProjectIcon } from '@/components/icons/ProjectIcons'
import { MobilityBand } from '@/components/MobilityBand'
import { PartnershipCycle } from '@/components/PartnershipCycle'
import { VideoCarousel } from '@/components/VideoCarousel'
import { Button } from '@/components/ui/Button'

const principles = [
  {
    num: '01',
    title: 'Atendimento humanizado',
    body: 'Pessoas no centro. Cada atendimento começa pelo acolhimento — com dignidade e respeito.',
  },
  {
    num: '02',
    title: 'Tecnologia de ponta',
    body: 'Equipamentos modernos e processos eficientes em cada unidade em campo.',
  },
  {
    num: '03',
    title: 'Estrutura completa',
    body: 'Consultório, exames, recepção — climatizada, acessível e pronta para operar.',
  },
  {
    num: '04',
    title: 'Saúde para todos',
    body: 'Cobertura onde a rede fixa não alcança. O cuidado vai até a população.',
  },
]

const med = projects[0]
const others = projects.slice(1)

export function Home() {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* ═══ HERO ═══ */}
      <section className="relative mesh-navy noise text-white min-h-[min(92vh,900px)] flex flex-col">
        <div className="relative flex-1 max-w-[1280px] w-full mx-auto px-5 sm:px-8 pt-20 md:pt-28 pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-8 text-[12px] font-semibold tracking-[0.14em] uppercase text-white/50">
                <span className="w-8 h-px bg-brand-green" />
                Municípios e Estados
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] tracking-[-0.04em] m-0 mb-7">
                Saúde que
                <br />
                alcança.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-soft to-brand-green">
                  Cuidado que
                  <br />
                  transforma.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[17px] md:text-[18px] leading-[1.65] text-white/60 max-w-[28rem] m-0 mb-10">
                Projetos de saúde móvel com estruturas completas, equipes multidisciplinares e
                atendimento humanizado — onde a população está.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/projetos"
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-navy font-bold text-[14px] hover:bg-white/95 transition-colors"
                >
                  Conheça os projetos
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contato"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-white/80 font-semibold text-[14px] hover:text-white transition-colors"
                >
                  Fale com a equipe
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </Link>
              </div>
            </Reveal>

            {/* Slider no mobile — logo abaixo do heading/CTAs */}
            <Reveal delay={0.18} className="lg:hidden mt-10">
              <HeroSlider />
            </Reveal>
          </div>

          <Reveal delay={0.12} className="hidden lg:block">
            <HeroSlider />
          </Reveal>
        </div>
      </section>

      {/* ═══ MOBILIDADE (elemento construído + movimento real) ═══ */}
      <section className="bg-soft">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
            <Reveal>
              <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-blue m-0 mb-4">
                A MovSaúde
              </p>
              <h2 className="font-display font-extrabold text-[clamp(1.85rem,3.5vw,2.75rem)] leading-[1.08] tracking-tight text-navy m-0 mb-5">
                Saúde pública
                <br />
                em movimento
              </h2>
              <p className="text-[16px] leading-[1.7] text-muted m-0 mb-4">
                Transformamos o acesso à saúde com unidades climatizadas, acessíveis e equipadas —
                do consultório à recepção.
              </p>
              <p className="font-display font-bold text-[17px] text-navy m-0">
                Onde a saúde não chega, a MovSaúde vai.
              </p>
            </Reveal>
            {/* Sem Reveal/Framer aqui — animação CSS do ônibus não pode ser engolida pelo parent */}
            <div>
              <MobilityBand />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRINCÍPIOS — paleta única (navy/azul), lista editorial sem “caixas arco-íris” ═══ */}
      <section className="bg-white border-y border-line">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-16 md:py-22">
          <Reveal className="mb-12 md:mb-14 max-w-xl">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-blue m-0 mb-3">
              Como operamos
            </p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.5rem)] text-navy m-0 tracking-tight">
              Quatro princípios.
              <span className="text-muted font-semibold"> Uma operação.</span>
            </h2>
          </Reveal>

          <div className="divide-y divide-line border-y border-line">
            {principles.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.03}>
                <article className="group grid sm:grid-cols-[5.5rem_1fr] gap-4 sm:gap-8 py-7 md:py-8 items-start">
                  <span className="font-display font-extrabold text-[40px] md:text-[44px] leading-none tracking-tighter text-navy/12 group-hover:text-brand-blue/35 transition-colors">
                    {p.num}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display font-bold text-[20px] md:text-[22px] text-navy m-0 mb-2 tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-[15.5px] leading-[1.65] text-muted m-0 max-w-xl">{p.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJETOS — MedMovel um pouco maior, demais no MESMO padrão visual ═══ */}
      <section className="bg-navy-deep text-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 md:py-22">
          <Reveal className="mb-10 max-w-2xl">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-blue-soft m-0 mb-3">
              Projetos
            </p>
            <h2 className="font-display font-extrabold text-[clamp(1.85rem,3.5vw,2.75rem)] leading-[1.08] m-0 tracking-tight">
              Um projeto para cada necessidade do seu município
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* MedMovel — destaque moderado (2 colunas), mesmo idioma dos outros */}
              <Link
                to={`/projetos/${med.slug}`}
                className="group relative sm:col-span-2 flex flex-col justify-between rounded-[24px] overflow-hidden min-h-[260px] p-7 md:p-9 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${med.colors.from} 0%, ${med.colors.to} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_10%,rgba(255,255,255,0.18),transparent_50%)] pointer-events-none" />
                <div className="absolute -right-4 -bottom-6 opacity-[0.12] text-white pointer-events-none scale-[3.2] origin-bottom-right">
                  <ProjectIcon id="medmovel" size={72} />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-5">
                    <ProjectIcon id="medmovel" size={24} />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/70">
                    Projeto principal · {med.tag}
                  </span>
                  <h3 className="font-display font-extrabold text-[28px] md:text-[32px] m-0 mt-1.5 mb-2.5 tracking-tight">
                    {med.name}
                  </h3>
                  <p className="text-[14.5px] leading-[1.55] text-white/85 m-0 max-w-md">{med.short}</p>
                </div>
                <span className="relative inline-flex items-center gap-2 font-bold text-[14px] mt-6">
                  Conhecer o MedMovel
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              {others.map((p) => (
                <Link
                  key={p.id}
                  to={`/projetos/${p.slug}`}
                  className="group relative flex flex-col justify-between rounded-[24px] overflow-hidden min-h-[260px] p-7 transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(145deg, ${p.colors.from} 0%, ${
                      p.id === 'sorrisomais' ? p.colors.accent : p.colors.to
                    } 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_10%,rgba(255,255,255,0.16),transparent_50%)] pointer-events-none" />
                  <div className="absolute -right-3 -bottom-4 opacity-[0.12] text-white pointer-events-none scale-[2.4] origin-bottom-right">
                    <ProjectIcon id={p.id} size={64} />
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-5">
                      <ProjectIcon id={p.id} size={24} />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/70">
                      {p.tag}
                    </span>
                    <h3 className="font-display font-extrabold text-[24px] md:text-[26px] m-0 mt-1.5 mb-2 tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-[13.5px] leading-[1.5] text-white/85 m-0 line-clamp-3">{p.short}</p>
                  </div>
                  <span className="relative inline-flex items-center gap-2 font-bold text-[14px] mt-6">
                    Conhecer o {p.name}
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARCERIA — 4 etapas sempre visíveis ═══ */}
      <section className="bg-soft">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-16 md:py-20">
          <Reveal className="text-center mb-12">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-blue m-0 mb-3">
              Parceria
            </p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.5rem)] text-navy m-0 tracking-tight">
              Do diagnóstico aos resultados
            </h2>
            <p className="text-[15px] text-muted m-0 mt-3 max-w-lg mx-auto">
              Um ciclo claro de parceria com a gestão pública — do primeiro contato à entrega de
              indicadores.
            </p>
          </Reveal>
          <Reveal>
            <PartnershipCycle />
          </Reveal>
        </div>
      </section>

      {/* ═══ VÍDEO institucional ═══ */}
      <section className="bg-navy text-white" id="video-movsaude">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-14 md:py-20">
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-10 md:mb-12">
              <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-green m-0 mb-3">
                Por dentro
              </p>
              <h2 className="font-display font-extrabold text-[30px] md:text-[40px] leading-[1.08] m-0 mb-4 tracking-tight">
                Veja a saúde móvel em movimento
              </h2>
              <p className="text-[16px] md:text-[17px] text-white/65 m-0 mb-6 leading-relaxed">
                Estrutura, equipes em campo e o impacto real do atendimento nas cidades onde já
                operamos.
              </p>
              <ul className="m-0 p-0 list-none flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-x-6 sm:gap-y-2 justify-center text-[15px] text-white/80">
                <li className="flex gap-2 justify-center">
                  <span className="text-brand-blue-soft">→</span> Unidades em contexto real
                </li>
                <li className="flex gap-2 justify-center">
                  <span className="text-brand-blue-soft">→</span> Equipes e acolhimento
                </li>
                <li className="flex gap-2 justify-center">
                  <span className="text-brand-blue-soft">→</span> Gestores e população
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <VideoCarousel />
          </Reveal>
        </div>
      </section>

      {/* ═══ MAPA ═══ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-blue m-0 mb-3">
                Onde estamos
              </p>
              <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.5rem)] text-navy m-0 mb-4 tracking-tight">
                Presente onde a população mais precisa
              </h2>
              <p className="text-[15px] text-muted m-0 mb-8 leading-relaxed max-w-md">
                Expansão nacional. Unidades em operação e novos projetos entrando em campo a cada mês.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-soft border border-line p-4">
                  <CountUp
                    to={metrics.operating}
                    className="font-display font-extrabold text-[40px] md:text-[44px] leading-none text-brand-blue block"
                  />
                  <p className="text-[12px] text-muted m-0 mt-1.5">em operação</p>
                </div>
                <div className="rounded-2xl bg-soft border border-line p-4">
                  <CountUp
                    to={metrics.expanding}
                    className="font-display font-extrabold text-[40px] md:text-[44px] leading-none text-brand-green block"
                  />
                  <p className="text-[12px] text-muted m-0 mt-1.5">em implantação</p>
                </div>
                <div className="rounded-2xl bg-soft border border-line p-4">
                  <CountUp
                    to={metrics.municipalities}
                    className="font-display font-extrabold text-[40px] md:text-[44px] leading-none text-navy block"
                  />
                  <p className="text-[12px] text-muted m-0 mt-1.5">municípios</p>
                </div>
                <div className="rounded-2xl bg-soft border border-line p-4">
                  <span className="font-display font-extrabold text-[40px] md:text-[44px] leading-none text-slate-500 block">
                    +
                    <CountUp to={metrics.feasibility} className="inline" />
                  </span>
                  <p className="text-[12px] text-muted m-0 mt-1.5">estudos de viabilidade</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-blue" /> Em operação
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-green" /> Em implantação
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Estudos de viabilidade
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <BrazilMap />
            </Reveal>
          </div>
          <p className="text-center font-display font-semibold text-[18px] text-navy mt-12 m-0">
            De cidade em cidade —{' '}
            <span className="text-brand-blue">política pública em movimento.</span>
          </p>
        </div>
      </section>

      {/* ═══ CIDADES ═══ */}
      <section className="bg-soft border-t border-line">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-14 md:py-16">
          <Reveal className="mb-8">
            <h3 className="font-display font-extrabold text-[24px] text-navy m-0">
              Onde as unidades estão
            </h3>
            <p className="text-[14px] text-muted m-0 mt-1">
              Fortaleza em operação (4 unidades) · demais municípios em implantação
            </p>
          </Reveal>
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cityUnits.map((c) => {
                const isOp = c.status === 'op'
                return (
                  <div key={`${c.nome}-${c.uf}`} className="rounded-xl bg-white border border-line px-4 py-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 ${isOp ? 'text-brand-blue' : 'text-brand-green'}`}
                      />
                      <span className="font-display font-bold text-[15px] text-navy">{c.nome}</span>
                      <span className="text-[11px] font-bold text-muted">{c.uf}</span>
                    </div>
                    <p className="text-[12px] text-muted m-0 leading-snug">
                      {c.unidades} unidade{c.unidades > 1 ? 's' : ''}
                    </p>
                    <p className="text-[12px] text-navy/70 m-0 mt-0.5 leading-snug">{c.projetos}</p>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wide m-0 mt-2 ${
                        isOp ? 'text-brand-blue' : 'text-brand-green'
                      }`}
                    >
                      {isOp ? 'Em operação' : 'Em implantação'}
                    </p>
                  </div>
                )
              })}
            </div>
          </Reveal>
          <Reveal className="mt-6 rounded-2xl bg-navy text-white px-7 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-display font-bold text-[18px] m-0 mb-1">Expansão em andamento</p>
              <p className="text-[14px] text-white/65 m-0">
                {metrics.operating} unidades em operação em Fortaleza/CE · {metrics.expanding} em
                implantação no país.
              </p>
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 text-brand-green font-bold text-[14px] shrink-0"
            >
              Sua cidade pode ser a próxima
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mesh-navy noise text-white">
        <div className="relative max-w-[720px] mx-auto px-5 py-20 md:py-28 text-center">
          <Reveal>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-tight m-0 mb-5">
              Leve a MovSaúde
              <br />
              para o seu município
            </h2>
            <p className="text-[16px] text-white/55 m-0 mb-9 max-w-md mx-auto">
              Apresentação institucional de estruturas, equipes e modelos de projeto.
            </p>
            <Button asChild className="h-12 px-8 rounded-full bg-white text-navy hover:bg-white/95 font-bold">
              <Link to="/contato">
                Solicitar mais informações
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
