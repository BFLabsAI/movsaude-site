import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams, Link, useLocation } from 'react-router-dom'
import { Mail, MessageCircle, ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { projects, ufs } from '@/data/projects'
import { siteContact } from '@/data/contact'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { FormSuccess } from '@/components/FormSuccess'
import { RoadCurve } from '@/components/DrawnElements'
import { ProjectIcon } from '@/components/icons/ProjectIcons'
import { cn } from '@/lib/utils'
import type { ProjectId } from '@/data/projects'
import { buildSourceFromUrl } from '@/lib/source'
import { supabase } from '@/lib/supabase'
import { trackLead, generateLeadEventId } from '@/lib/meta-pixel'

export function Contato() {
  const [params] = useSearchParams()
  const location = useLocation()
  const pre = params.get('projeto')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>(() =>
    pre && projects.some((p) => p.slug === pre) ? [pre] : [],
  )

  const projectOptions = useMemo(
    () => [
      ...projects.map((p) => ({ id: p.slug, name: p.name, projectId: p.id as ProjectId })),
      { id: 'todos', name: 'Todos os projetos', projectId: null as ProjectId | null },
    ],
    [],
  )

  function toggle(id: string) {
    setSelected((prev) => {
      if (id === 'todos') return prev.includes('todos') ? [] : ['todos']
      const next = prev.filter((x) => x !== 'todos')
      return next.includes(id) ? next.filter((x) => x !== id) : [...next, id]
    })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    const fd = new FormData(e.currentTarget)
    const source = buildSourceFromUrl(params, location.pathname)

    // Fire the Lead event immediately on click, client-side only — this
    // must not depend on the Supabase insert below succeeding (Supabase
    // can be unreachable and the lead is still real from the user's POV,
    // since they already see the success state driven by the pixel/UI).
    const eventId = generateLeadEventId()
    trackLead(eventId)

    try {
      const { error } = await supabase.from('contatos').insert({
        nome: String(fd.get('nome') ?? '').trim(),
        cargo: String(fd.get('cargo') ?? '').trim() || null,
        municipio: String(fd.get('municipio') ?? '').trim(),
        uf: String(fd.get('uf') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        telefone: String(fd.get('whatsapp') ?? '').trim(),
        projetos: selected,
        mensagem: String(fd.get('msg') ?? '').trim() || null,
        consent: true,
        source,
      })
      if (error) {
        console.error('[contato]', error)
      }
    } catch (err) {
      console.error('[contato]', err)
    }

    setSubmitting(false)
    setSent(true)
  }

  return (
    <div className="overflow-x-hidden bg-soft">
      {/* Hero */}
      <section className="relative overflow-hidden text-white bg-[#0B1429]">
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_70%_0%,#1E3468_0%,transparent_55%)]" />
        <RoadCurve className="absolute bottom-8 left-0 w-full h-24 opacity-30 pointer-events-none" id="ctRoad" />
        <div className="relative max-w-[1240px] mx-auto px-5 md:px-8 pt-16 md:pt-22 pb-28 md:pb-32">
          <Reveal>
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue-soft mb-4">
              Contato
            </span>
            <h1 className="font-display font-black text-[40px] md:text-[52px] m-0 mb-4 leading-tight tracking-tight">
              Fale com a MovSaúde
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl m-0 leading-relaxed">
              Solicite mais informações sobre nossos projetos de saúde móvel. Nossa equipe retornará
              com uma apresentação institucional completa.
            </p>
          </Reveal>

          {/* chips de confiança no hero */}
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: MapPin, t: 'Atendimento em todo o Brasil' },
                { icon: ShieldCheck, t: 'Canal institucional' },
              ].map((c) => (
                <span
                  key={c.t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/75"
                >
                  <c.icon className="w-3.5 h-3.5 text-brand-blue-soft" />
                  {c.t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="relative block w-full h-10 -mb-px" aria-hidden>
          <path d="M0 48 V18 C 480 0, 960 40, 1440 14 V48 Z" fill="#F4F6F9" />
        </svg>
      </section>

      {/* Conteúdo — sobrepõe o hero com margem confortável */}
      <section className="relative pb-20 md:pb-28">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 -mt-10 md:-mt-14">
          <div className="grid lg:grid-cols-[1.4fr_0.85fr] gap-6 lg:gap-8 items-start">
            {/* Form card */}
            <Reveal>
              <div className="rounded-[28px] bg-white border border-line shadow-[0_24px_70px_rgba(14,26,51,0.1)] p-6 sm:p-8 md:p-10">
                {sent ? (
                  <FormSuccess
                    badge="Solicitação recebida"
                    title="Recebemos o seu contato"
                    lead="Obrigado pelo interesse em levar mais saúde ao seu município. Nossa equipe já registrou a solicitação e retorna com a apresentação institucional da MovSaúde."
                    icon={Sparkles}
                    steps={[
                      {
                        title: 'Pedido na fila certa',
                        description:
                          'Sua mensagem entrou no canal institucional — sem spam comercial.',
                      },
                      {
                        title: 'Análise do contexto',
                        description:
                          'Olhamos município, projetos de interesse e o que você contou na mensagem.',
                      },
                      {
                        title: 'Retorno em breve',
                        description:
                          'Entraremos em contato pelo e-mail ou WhatsApp informados com os próximos passos.',
                      },
                    ]}
                    primaryCta={{ to: '/projetos', label: 'Conhecer os projetos' }}
                    secondaryCta={{ to: '/', label: 'Ir para o início' }}
                  />
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="pb-2 border-b border-line mb-1">
                      <h2 className="font-display font-extrabold text-[22px] text-navy m-0 mb-1">
                        Solicitar informações
                      </h2>
                      <p className="text-sm text-muted m-0 pb-4">
                        Campos com * são obrigatórios. Resposta institucional — sem pressão comercial.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nome completo *" htmlFor="nome">
                        <input id="nome" name="nome" required className={inputCls} placeholder="Seu nome" autoComplete="name" />
                      </Field>
                      <Field label="Cargo/Função" htmlFor="cargo">
                        <input id="cargo" name="cargo" className={inputCls} placeholder="Ex.: Secretário de Saúde" />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Município/Órgão *" htmlFor="municipio">
                        <input id="municipio" name="municipio" required className={inputCls} placeholder="Nome do município" />
                      </Field>
                      <Field label="Estado (UF) *" htmlFor="uf">
                        <select id="uf" name="uf" required className={inputCls} defaultValue="">
                          <option value="" disabled>
                            Selecione
                          </option>
                          {ufs.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="E-mail institucional *" htmlFor="email">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className={inputCls}
                          placeholder="nome@prefeitura.gov.br"
                          autoComplete="email"
                        />
                      </Field>
                      <Field label="Telefone/WhatsApp *" htmlFor="whatsapp">
                        <input
                          id="whatsapp"
                          name="whatsapp"
                          required
                          className={inputCls}
                          placeholder="(00) 00000-0000"
                          autoComplete="tel"
                        />
                      </Field>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-navy mb-3">Projeto de interesse</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {projectOptions.map((opt) => {
                          const on = selected.includes(opt.id)
                          const proj = projects.find((p) => p.slug === opt.id)
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggle(opt.id)}
                              className={cn(
                                'flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all cursor-pointer',
                                on
                                  ? 'border-transparent text-white shadow-md'
                                  : 'bg-soft border-line text-navy hover:border-navy/20 hover:bg-white',
                              )}
                              style={
                                on
                                  ? {
                                      background: proj
                                        ? `linear-gradient(135deg, ${proj.colors.from}, ${proj.colors.to})`
                                        : 'linear-gradient(135deg, #152347, #1E3468)',
                                    }
                                  : undefined
                              }
                            >
                              <span
                                className={cn(
                                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                                  on ? 'bg-white/20 text-white' : 'text-white',
                                )}
                                style={
                                  !on
                                    ? {
                                        background: proj
                                          ? `linear-gradient(145deg, ${proj.colors.from}, ${proj.colors.to})`
                                          : '#152347',
                                      }
                                    : undefined
                                }
                              >
                                {opt.projectId ? (
                                  <ProjectIcon id={opt.projectId} size={18} />
                                ) : (
                                  <span className="text-[11px] font-bold">ALL</span>
                                )}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[14px] font-bold leading-tight">{opt.name}</span>
                                {proj && (
                                  <span
                                    className={cn(
                                      'block text-[11px] mt-0.5',
                                      on ? 'text-white/75' : 'text-muted',
                                    )}
                                  >
                                    {proj.tag}
                                  </span>
                                )}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Field label="Mensagem (opcional)" htmlFor="msg">
                      <textarea
                        id="msg"
                        name="msg"
                        rows={4}
                        className={cn(inputCls, 'resize-y min-h-[110px]')}
                        placeholder="Conte-nos brevemente sobre a necessidade do seu município"
                      />
                    </Field>

                    <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
                      <input type="checkbox" required className="mt-1 w-4 h-4 accent-navy" />
                      <span>
                        Autorizo o uso dos meus dados para retorno de contato, conforme a Política de
                        Privacidade.
                      </span>
                    </label>

                    {submitError && (
                      <p className="text-sm text-red-600 m-0" role="alert">
                        {submitError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto min-w-[220px]"
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando…' : 'Enviar solicitação'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Lateral */}
            <div className="space-y-5 lg:sticky lg:top-24">
              <Reveal delay={0.05}>
                <aside className="rounded-[28px] bg-[#0B1429] text-white p-7 md:p-8 overflow-hidden relative">
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-blue/20 blur-2xl pointer-events-none" />
                  <h2 className="font-display font-extrabold text-lg m-0 mb-1 relative">Outros canais</h2>
                  <p className="text-[13px] text-white/50 m-0 mb-6 relative">
                    Prefere falar por outro meio? Estamos nestes canais.
                  </p>
                  <ul className="space-y-3 m-0 p-0 list-none relative">
                    <li>
                      <a
                        href={siteContact.instagram.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3 text-white/90 hover:bg-white/10 transition-colors"
                      >
                        <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                          </svg>
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold">Instagram</span>
                          <span className="block text-[12px] text-white/55">
                            {siteContact.instagram.label}
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={siteContact.tiktok.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3 text-white/90 hover:bg-white/10 transition-colors"
                      >
                        <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.64a6.34 6.34 0 0 0 6.34-6.34V8.77a8.2 8.2 0 0 0 4.76 1.52V6.86a4.85 4.85 0 0 1-1-.17Z" />
                          </svg>
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold">TikTok</span>
                          <span className="block text-[12px] text-white/55">
                            {siteContact.tiktok.label}
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={siteContact.email.url}
                        className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3 text-white/90 hover:bg-white/10 transition-colors"
                      >
                        <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Mail size={18} />
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold">E-mail</span>
                          <span className="block text-[12px] text-white/55">
                            {siteContact.email.address}
                          </span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={siteContact.phone.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3 text-white/90 hover:bg-white/10 transition-colors"
                      >
                        <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <MessageCircle size={18} />
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold">WhatsApp</span>
                          <span className="block text-[12px] text-white/55">
                            {siteContact.phone.display}
                          </span>
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div className="mt-7 pt-5 border-t border-white/10 relative">
                    <p className="text-[13px] text-white/50 m-0 leading-relaxed">
                      Público prioritário: gestores públicos — prefeitos, secretários de saúde e
                      equipes de convênios.
                    </p>
                  </div>
                </aside>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-[28px] bg-white border border-line p-6 md:p-7 shadow-sm">
                  <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-brand-blue m-0 mb-4">
                    Nossos projetos
                  </p>
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/projetos/${p.slug}`}
                        className="group flex items-center gap-3 rounded-2xl px-2.5 py-2.5 hover:bg-soft transition-colors"
                      >
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                          style={{
                            background: `linear-gradient(145deg, ${p.colors.from}, ${p.colors.to})`,
                          }}
                        >
                          <ProjectIcon id={p.id} size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-bold text-navy group-hover:text-med transition-colors">
                            {p.name}
                          </span>
                          <span className="block text-[11px] text-muted">{p.tag}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted/50 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-line bg-soft px-4 py-3 text-[15px] text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 focus:bg-white transition-all'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
