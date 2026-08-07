import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  FileText,
  HeartHandshake,
  MapPin,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { FormSuccess } from '@/components/FormSuccess'
import { RoadCurve } from '@/components/DrawnElements'
import { cn } from '@/lib/utils'
import { buildSourceFromUrl } from '@/lib/source'
import { buildCvStoragePath, CV_BUCKET, supabase } from '@/lib/supabase'

/** Vagas abertas / de interesse — alinhar com RH quando o pipeline real estiver pronto */
export const vacancyOptions = [
  { id: 'oftalmologista', label: 'Oftalmologista' },
  { id: 'medico', label: 'Médico(a)' },
  { id: 'enfermeiro', label: 'Enfermeiro(a)' },
  { id: 'tecnico-enfermagem', label: 'Técnico(a) de Enfermagem' },
  { id: 'veterinario', label: 'Veterinário(a)' },
  { id: 'dentista', label: 'Dentista / Cirurgião-Dentista' },
  { id: 'farmaceutico', label: 'Farmacêutico(a)' },
  { id: 'psicologo', label: 'Psicólogo(a)' },
  { id: 'radiologia', label: 'Técnico(a) em Radiologia' },
  { id: 'assistente', label: 'Assistente / Auxiliar' },
  { id: 'motorista', label: 'Motorista de Unidade Móvel' },
  { id: 'coordenacao', label: 'Coordenação de Projeto' },
  { id: 'administrativo', label: 'Administrativo / RH' },
  { id: 'outro', label: 'Outra área' },
] as const

const MAX_CV_BYTES = 100 * 1024 * 1024 // 100 MB
const ACCEPTED_CV =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const inputCls =
  'w-full rounded-xl border border-line bg-soft px-4 py-3 text-[15px] text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 focus:bg-white transition-all'

export function TrabalheConosco() {
  const [params] = useSearchParams()
  const location = useLocation()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string | null>(null)
  const [vaga, setVaga] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function onCvChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setCvError(null)
    if (!file) {
      setCvFile(null)
      return
    }
    const okType =
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      /\.(pdf|doc|docx)$/i.test(file.name)
    if (!okType) {
      setCvFile(null)
      setCvError('Envie o currículo em PDF ou Word (.pdf, .doc, .docx).')
      e.target.value = ''
      return
    }
    if (file.size > MAX_CV_BYTES) {
      setCvFile(null)
      setCvError('Arquivo muito grande. O limite é 100 MB.')
      e.target.value = ''
      return
    }
    setCvFile(file)
  }

  function clearCv() {
    setCvFile(null)
    setCvError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    if (!cvFile) {
      setCvError('Anexe seu currículo para continuar.')
      return
    }

    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const source = buildSourceFromUrl(params, location.pathname)

    // 1) Arquivo vai para o Storage (bucket privado). A tabela só guarda a referência.
    const storagePath = buildCvStoragePath(cvFile.name)
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from(CV_BUCKET)
      .upload(storagePath, cvFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: cvFile.type || undefined,
      })

    if (uploadError || !uploaded?.path) {
      console.error('[trabalhe-conosco] storage', uploadError)
      setSubmitting(false)
      setSubmitError('Não foi possível enviar o currículo. Tente outro arquivo ou tente de novo.')
      return
    }

    // ID/path do documento no Storage — não o binário
    const curriculoPath = uploaded.path

    const { error } = await supabase.from('candidaturas').insert({
      nome: String(fd.get('nome') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      telefone: String(fd.get('telefone') ?? '').trim(),
      cidade: String(fd.get('cidade') ?? '').trim(),
      vaga: String(fd.get('vaga') ?? '').trim(),
      vaga_outra: String(fd.get('vaga_outra') ?? '').trim() || null,
      curriculo_nome: cvFile.name,
      curriculo_path: curriculoPath,
      mensagem: String(fd.get('msg') ?? '').trim() || null,
      consent: true,
      source,
    })

    if (error) {
      console.error('[trabalhe-conosco] insert', error)
      // Melhor esforço: remove o arquivo órfão se o insert falhar
      await supabase.storage.from(CV_BUCKET).remove([curriculoPath]).catch(() => {})
      setSubmitting(false)
      setSubmitError('Não foi possível enviar a candidatura. Tente novamente em instantes.')
      return
    }

    setSubmitting(false)
    setSent(true)
  }

  return (
    <div className="overflow-x-hidden bg-soft">
      <section className="relative overflow-hidden text-white bg-[#0B1429]">
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_70%_0%,#1E3468_0%,transparent_55%)]" />
        <RoadCurve
          className="absolute bottom-8 left-0 w-full h-24 opacity-30 pointer-events-none"
          id="tcRoad"
        />
        <div className="relative max-w-[1240px] mx-auto px-5 md:px-8 pt-16 md:pt-22 pb-28 md:pb-32">
          <Reveal>
            <span className="inline-block font-bold text-[12px] tracking-[0.16em] uppercase text-brand-blue-soft mb-4">
              Carreiras
            </span>
            <h1 className="font-display font-black text-[40px] md:text-[52px] m-0 mb-4 leading-tight tracking-tight">
              Trabalhe Conosco
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl m-0 leading-relaxed">
              Faça parte de equipes que levam saúde a quem precisa — em unidades móveis, mutirões e
              projetos com municípios e estados em todo o Brasil.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: MapPin, t: 'Atuação em campo e itinerante' },
                { icon: Users, t: 'Equipes multidisciplinares' },
                { icon: HeartHandshake, t: 'Impacto social real' },
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
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="relative block w-full h-10 -mb-px"
          aria-hidden
        >
          <path d="M0 48 V18 C 480 0, 960 40, 1440 14 V48 Z" fill="#F4F6F9" />
        </svg>
      </section>

      <section className="relative pb-20 md:pb-28">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 -mt-10 md:-mt-14">
          <div className="grid lg:grid-cols-[1.4fr_0.85fr] gap-6 lg:gap-8 items-start">
            <Reveal>
              <div className="rounded-[28px] bg-white border border-line shadow-[0_24px_70px_rgba(14,26,51,0.1)] p-6 sm:p-8 md:p-10">
                {sent ? (
                  <FormSuccess
                    badge="Candidatura recebida"
                    title="Recebemos o seu currículo"
                    lead="Obrigado por querer fazer parte da MovSaúde. Seus dados e o arquivo do currículo já estão no nosso banco de talentos — a equipe de RH analisa com cuidado cada perfil."
                    icon={HeartHandshake}
                    steps={[
                      {
                        title: 'Currículo guardado com segurança',
                        description:
                          'O arquivo foi enviado ao nosso armazenamento e vinculado à sua candidatura.',
                      },
                      {
                        title: 'Análise de encaixe',
                        description:
                          'Comparamos experiência, vaga de interesse e disponibilidade com as demandas dos projetos.',
                      },
                      {
                        title: 'Contato quando houver fit',
                        description:
                          'Se houver oportunidade alinhada, falamos com você pelos canais informados. Mesmo sem vaga aberta agora, você fica no radar.',
                      },
                    ]}
                    primaryCta={{ to: '/quem-somos', label: 'Conhecer a MovSaúde' }}
                    secondaryCta={{ to: '/', label: 'Ir para o início' }}
                  />
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5" noValidate>
                    <div className="pb-2 border-b border-line mb-1">
                      <h2 className="font-display font-extrabold text-[22px] text-navy m-0 mb-1">
                        Candidate-se
                      </h2>
                      <p className="text-sm text-muted m-0 pb-4">
                        Campos com * são obrigatórios. Currículo em PDF ou Word, até 100 MB.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nome completo *" htmlFor="nome">
                        <input
                          id="nome"
                          name="nome"
                          required
                          className={inputCls}
                          placeholder="Seu nome"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="E-mail *" htmlFor="email">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className={inputCls}
                          placeholder="seu@email.com"
                          autoComplete="email"
                        />
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Telefone / WhatsApp *" htmlFor="telefone">
                        <input
                          id="telefone"
                          name="telefone"
                          type="tel"
                          required
                          className={inputCls}
                          placeholder="(00) 00000-0000"
                          autoComplete="tel"
                        />
                      </Field>
                      <Field label="Cidade de residência *" htmlFor="cidade">
                        <input
                          id="cidade"
                          name="cidade"
                          required
                          className={inputCls}
                          placeholder="Cidade e UF"
                          autoComplete="address-level2"
                        />
                      </Field>
                    </div>

                    <Field label="Vaga de interesse *" htmlFor="vaga">
                      <div className="relative">
                        <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <select
                          id="vaga"
                          name="vaga"
                          required
                          className={cn(inputCls, 'pl-10 appearance-none cursor-pointer')}
                          value={vaga}
                          onChange={(e) => setVaga(e.target.value)}
                        >
                          <option value="" disabled>
                            Selecione a vaga
                          </option>
                          {vacancyOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Field>

                    {vaga === 'outro' && (
                      <Field label="Descreva a área de interesse *" htmlFor="vaga_outra">
                        <input
                          id="vaga_outra"
                          name="vaga_outra"
                          required
                          className={inputCls}
                          placeholder="Ex.: Nutrição, Fisioterapia, TI..."
                        />
                      </Field>
                    )}

                    <div>
                      <span className="block text-sm font-semibold text-navy mb-1.5">
                        Currículo *{' '}
                        <span className="font-normal text-muted">(PDF ou Word, máx. 100 MB)</span>
                      </span>
                      <input
                        ref={fileRef}
                        id="curriculo"
                        name="curriculo"
                        type="file"
                        accept={ACCEPTED_CV}
                        className="sr-only"
                        onChange={onCvChange}
                      />
                      {!cvFile ? (
                        <label
                          htmlFor="curriculo"
                          className={cn(
                            'flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-dashed border-line bg-soft px-4 py-5 cursor-pointer transition-colors hover:border-brand-blue/40 hover:bg-white',
                            cvError && 'border-red-300 bg-red-50/50',
                          )}
                        >
                          <span className="w-12 h-12 rounded-xl bg-white border border-line flex items-center justify-center shrink-0 text-navy">
                            <Upload className="w-5 h-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-semibold text-navy">
                              Clique para anexar o currículo
                            </span>
                            <span className="block text-[13px] text-muted mt-0.5">
                              Formatos aceitos: .pdf, .doc, .docx
                            </span>
                          </span>
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-line bg-soft px-4 py-3.5">
                          <span className="w-11 h-11 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-semibold text-navy truncate">
                              {cvFile.name}
                            </span>
                            <span className="block text-[12px] text-muted mt-0.5">
                              {(cvFile.size / 1024).toFixed(0)} KB
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={clearCv}
                            className="w-10 h-10 rounded-xl border border-line bg-white text-muted hover:text-navy hover:border-navy/20 inline-flex items-center justify-center cursor-pointer"
                            aria-label="Remover currículo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {cvError && (
                        <p className="mt-2 text-sm text-red-600 m-0" role="alert">
                          {cvError}
                        </p>
                      )}
                    </div>

                    <Field label="Mensagem (opcional)" htmlFor="msg">
                      <textarea
                        id="msg"
                        name="msg"
                        rows={4}
                        className={cn(inputCls, 'resize-y min-h-[110px]')}
                        placeholder="Conte um pouco sobre sua experiência e disponibilidade para viagens/campo"
                      />
                    </Field>

                    <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
                      <input type="checkbox" required className="mt-1 w-4 h-4 accent-navy" />
                      <span>
                        Autorizo o uso dos meus dados e currículo para processos seletivos da
                        MovSaúde, conforme a Política de Privacidade e a LGPD.
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
                      {submitting ? 'Enviando…' : 'Enviar candidatura'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>

            <div className="space-y-5 lg:sticky lg:top-24">
              <Reveal delay={0.05}>
                <aside className="rounded-[28px] bg-[#0B1429] text-white p-7 md:p-8 overflow-hidden relative">
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-blue/20 blur-2xl pointer-events-none" />
                  <h2 className="font-display font-extrabold text-lg m-0 mb-1 relative">
                    Por que a MovSaúde?
                  </h2>
                  <p className="text-[13px] text-white/50 m-0 mb-6 relative">
                    Saúde itinerante com impacto direto na população.
                  </p>
                  <ul className="space-y-3 m-0 p-0 list-none relative text-[14px] text-white/80">
                    <li className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3">
                      <HeartHandshake className="w-5 h-5 text-brand-blue-soft shrink-0 mt-0.5" />
                      <span>Missão social: levar cuidado a quem está longe dos grandes centros.</span>
                    </li>
                    <li className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3">
                      <Users className="w-5 h-5 text-brand-blue-soft shrink-0 mt-0.5" />
                      <span>Equipes multidisciplinares em oftalmologia, clínica, enfermagem e mais.</span>
                    </li>
                    <li className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-3">
                      <MapPin className="w-5 h-5 text-brand-blue-soft shrink-0 mt-0.5" />
                      <span>Projetos em parceria com municípios e estados em várias regiões.</span>
                    </li>
                  </ul>
                  <div className="mt-7 pt-5 border-t border-white/10 relative">
                    <p className="text-[13px] text-white/50 m-0 leading-relaxed">
                      Banco de talentos: mesmo sem vaga aberta no momento, sua candidatura fica
                      registrada para oportunidades futuras.
                    </p>
                  </div>
                </aside>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-[28px] bg-white border border-line p-6 md:p-7 shadow-sm">
                  <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-brand-blue m-0 mb-3">
                    Áreas que costumamos recrutar
                  </p>
                  <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                    {vacancyOptions
                      .filter((v) => v.id !== 'outro')
                      .slice(0, 8)
                      .map((v) => (
                        <li
                          key={v.id}
                          className="rounded-full bg-soft border border-line px-3 py-1 text-[12px] font-medium text-navy/80"
                        >
                          {v.label}
                        </li>
                      ))}
                  </ul>
                  <p className="text-[13px] text-muted m-0 mt-4 leading-relaxed">
                    Dúvidas institucionais? Use o{' '}
                    <Link to="/contato" className="text-brand-blue font-semibold hover:underline">
                      formulário de contato
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

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
