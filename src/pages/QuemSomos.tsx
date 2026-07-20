import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Heart,
  Award,
  MapPin,
  Shield,
  Sparkles,
  Truck,
  Users,
  ClipboardCheck,
  Building2,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { CtaBand } from '@/components/CtaBand'
import { Button } from '@/components/ui/Button'
import { RoadCurve } from '@/components/DrawnElements'
import { projects } from '@/data/projects'
import { ProjectIcon } from '@/components/icons/ProjectIcons'

const values = [
  { icon: Heart, title: 'Humanização', desc: 'Cada atendimento começa pelo acolhimento — dignidade e respeito em cada etapa.', color: '#2D9CDB' },
  { icon: Award, title: 'Excelência', desc: 'Estrutura, equipe e processos no mais alto padrão operacional.', color: '#1B4DA1' },
  { icon: MapPin, title: 'Mobilidade', desc: 'A saúde vai até onde a população está — sem depender da rede fixa.', color: '#137A96' },
  { icon: Shield, title: 'Compromisso público', desc: 'Transparência, indicadores e resultados para a gestão municipal.', color: '#6BBF3A' },
  { icon: Sparkles, title: 'Impacto social', desc: 'Dignidade e qualidade de vida como medida real de sucesso.', color: '#C2187E' },
]

const capacities = [
  { icon: Truck, title: 'Unidades completas', desc: 'Consultórios, salas de exame, procedimentos, recepção e acolhimento — tudo climatizado e acessível.' },
  { icon: Users, title: 'Equipes dedicadas', desc: 'Profissionais de saúde, supervisão, cadastro, serviços gerais e condução em cada projeto.' },
  { icon: ClipboardCheck, title: 'Gestão integral', desc: 'A MovSaúde entrega o projeto funcionando — da operação ao relatório para o município.' },
  { icon: Building2, title: 'Integração com a rede', desc: 'Projetos pensados para conversar com a atenção básica e as políticas locais de saúde.' },
]

export function QuemSomos() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero rico */}
      <section className="relative overflow-hidden text-white bg-[#0B1429]">
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_70%_0%,#1E3468_0%,transparent_55%),radial-gradient(50%_60%_at_10%_100%,#152347,transparent)]" />
        <RoadCurve className="absolute bottom-20 left-0 w-full h-28 opacity-40 pointer-events-none" id="qsRoad" />
        <div className="relative max-w-[1240px] mx-auto px-5 md:px-6 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end">
            <Reveal>
              <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue-soft mb-4">
                Institucional
              </span>
              <h1 className="font-display font-black text-[44px] md:text-[56px] leading-[1.05] tracking-tight m-0 mb-5">
                Quem Somos
              </h1>
              <p className="text-xl text-white/70 max-w-xl m-0 leading-relaxed">
                Uma operação dedicada a transformar o acesso à saúde pública no Brasil — com
                mobilidade, estrutura e atendimento humanizado.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { n: '5', l: 'frentes de atuação' },
                { n: '4', l: 'unidades em operação' },
                { n: '21', l: 'em implantação' },
                { n: '6', l: 'municípios' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/6 border border-white/10 backdrop-blur px-4 py-4">
                  <p className="font-display font-black text-2xl text-brand-blue-soft m-0">{s.n}</p>
                  <p className="text-[12px] text-white/55 m-0 mt-1">{s.l}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="relative block w-full h-10" aria-hidden>
          <path d="M0 48 V20 C 480 0, 960 40, 1440 12 V48 Z" fill="#F7F9FC" />
        </svg>
      </section>

      {/* História — layout editorial */}
      <section className="bg-soft">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-16 md:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
            <Reveal>
              <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue mb-3">
                Nossa história
              </span>
              <h2 className="font-display font-extrabold text-[32px] md:text-[40px] leading-[1.08] text-navy m-0">
                Saúde que vai até as pessoas
              </h2>
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-green" />
            </Reveal>
            <Reveal delay={0.06} className="space-y-5 text-[16.5px] leading-[1.75] text-[#4A5568]">
              <p className="m-0">
                A MovSaúde nasceu de uma constatação simples: em muitos municípios brasileiros, o
                maior obstáculo entre a população e a saúde não é a falta de cuidado — é a distância.
                Distância física, estrutural e social.
              </p>
              <p className="m-0">
                Por isso, construímos uma operação completa de saúde móvel: unidades modernas,
                climatizadas e totalmente equipadas, com equipes multidisciplinares preparadas para
                atender com a mesma qualidade de uma estrutura fixa — em qualquer lugar.
              </p>
              <p className="m-0">
                Atuamos em parceria com Municípios e Estados, em projetos contínuos ou ações
                itinerantes, sempre com um compromisso inegociável: atendimento humanizado,
                eficiente e digno para cada pessoa atendida.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Propósito — bloco imersivo */}
      <section className="relative overflow-hidden bg-[#0B1429] text-white">
        <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-[radial-gradient(circle,#2D9CDB28,transparent_65%)] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[320px] h-[320px] bg-[radial-gradient(circle,#6BBF3A18,transparent_65%)] pointer-events-none" />
        <div className="relative max-w-[1000px] mx-auto px-5 md:px-6 py-16 md:py-20 text-center">
          <Reveal>
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue-soft mb-4">
              Nosso propósito
            </span>
            <h2 className="font-display font-extrabold text-[28px] md:text-[36px] leading-[1.2] m-0 mb-6 max-w-[800px] mx-auto">
              Transformar o acesso à saúde pública por meio de soluções móveis modernas e
              humanizadas
            </h2>
            <p className="text-[16.5px] text-white/65 m-0 max-w-[640px] mx-auto leading-relaxed">
              Levamos atendimento de qualidade, tecnologia e cuidado às pessoas onde elas estiverem.
              Acreditamos que mobilidade, eficiência e acolhimento são essenciais para aproximar a
              saúde da população e promover mais dignidade, bem-estar e qualidade de vida.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Valores — grid premium */}
      <section className="bg-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-16 md:py-20">
          <Reveal className="text-center mb-12">
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue mb-3">
              Valores
            </span>
            <h2 className="font-display font-extrabold text-[32px] md:text-[40px] text-navy m-0">
              O que nos move
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div
                    key={v.title}
                    className="group rounded-[20px] border border-[rgba(21,35,71,0.06)] bg-soft hover:bg-white hover:shadow-[0_16px_40px_rgba(21,35,71,0.08)] transition-all p-6"
                  >
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4"
                      style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}bb)` }}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display font-bold text-[16px] text-navy m-0 mb-2">{v.title}</h3>
                    <p className="text-[13px] leading-[1.55] text-[#5A6577] m-0">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capacidade operacional */}
      <section className="bg-soft border-y border-[rgba(21,35,71,0.05)]">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-16 md:py-20">
          <Reveal className="max-w-[640px] mb-10">
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue mb-3">
              Capacidade
            </span>
            <h2 className="font-display font-extrabold text-[32px] md:text-[40px] text-navy m-0 mb-3">
              Estrutura pronta para operar
            </h2>
            <p className="text-[16px] text-[#4A5568] m-0 leading-relaxed">
              Nossas unidades móveis funcionam como clínicas completas. Cada projeto conta com
              equipe base própria. A gestão da operação é integral.
            </p>
          </Reveal>
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {capacities.map((c) => {
                const Icon = c.icon
                return (
                  <div
                    key={c.title}
                    className="flex gap-4 rounded-[20px] bg-white border border-[rgba(21,35,71,0.06)] p-6 shadow-sm"
                  >
                    <span className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="font-display font-extrabold text-[17px] text-navy m-0 mb-1.5">{c.title}</h3>
                      <p className="text-[14px] leading-[1.55] text-[#5A6577] m-0">{c.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 frentes preview */}
      <section className="bg-white">
        <div className="max-w-[1240px] mx-auto px-5 md:px-6 py-16 md:py-20">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue mb-3">
                Frentes de atuação
              </span>
              <h2 className="font-display font-extrabold text-[32px] md:text-[40px] text-navy m-0">
                Cinco projetos, uma missão
              </h2>
            </div>
            <Button asChild variant="outline" size="md">
              <Link to="/projetos">
                Ver todos os projetos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projetos/${p.slug}`}
                  className="group rounded-[18px] p-4 text-white transition-transform hover:-translate-y-1"
                  style={{ background: `linear-gradient(145deg, ${p.colors.from}, ${p.colors.to})` }}
                >
                  <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                    <ProjectIcon id={p.id} size={20} />
                  </span>
                  <p className="font-display font-extrabold text-[15px] m-0">{p.name}</p>
                  <p className="text-[11px] text-white/70 m-0 mt-0.5">{p.tag}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Conheça nossas frentes de atuação"
        body="Cinco projetos de saúde móvel adaptáveis à realidade de cada município."
        cta="Ver projetos"
        href="/projetos"
      />
    </div>
  )
}
