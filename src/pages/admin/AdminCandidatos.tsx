import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, FileText, Mail, Phone } from 'lucide-react'
import {
  adminCandidaturas,
  adminCvUrl,
  adminUpdateCandidaturaStatus,
  CANDIDATO_COLUMNS,
  type Candidatura,
  type CandidatoStatus,
  AdminApiError,
} from '@/lib/admin-api'
import { DetailDrawer, DetailRow } from '@/components/admin/DetailDrawer'
import { KanbanBoard } from '@/components/admin/KanbanBoard'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function AdminCandidatos() {
  const [params] = useSearchParams()
  const deepId = params.get('id')
  const [items, setItems] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Candidatura | null>(null)
  const [saving, setSaving] = useState(false)
  const [cvLoading, setCvLoading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminCandidaturas()
      .then((list) => {
        setItems(list)
        if (deepId) {
          const hit = list.find((i) => i.id === deepId)
          if (hit) setSelected(hit)
        }
      })
      .catch((e) => setError(e instanceof AdminApiError ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [deepId])

  useEffect(() => {
    load()
  }, [load])

  async function moveTo(id: string, status: CandidatoStatus) {
    const previous = items
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    setSelected((s) => (s?.id === id ? { ...s, status } : s))
    setSaving(true)
    try {
      const updated = await adminUpdateCandidaturaStatus(id, status)
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      setSelected((s) => (s?.id === id ? updated : s))
    } catch (e) {
      setItems(previous)
      alert(e instanceof AdminApiError ? e.message : 'Falha ao atualizar status')
    } finally {
      setSaving(false)
    }
  }

  async function openCv(path: string | null) {
    if (!path) return
    setCvLoading(true)
    try {
      const { url } = await adminCvUrl(path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : 'Falha ao abrir currículo')
    } finally {
      setCvLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-[28px] text-navy m-0 tracking-tight">
            Candidatos
          </h1>
          <p className="text-muted m-0 mt-1 text-[15px]">
            Pipeline de RH — arraste os cards entre as etapas ou use o seletor no detalhe.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-navy cursor-pointer hover:bg-soft"
        >
          Atualizar
        </button>
      </div>

      {loading && <p className="text-muted">Carregando…</p>}
      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <KanbanBoard
          columns={CANDIDATO_COLUMNS}
          items={items}
          getStatus={(i) => i.status || 'novo_candidato'}
          disabled={saving}
          onOpen={setSelected}
          onMove={(id, status) => moveTo(id, status as CandidatoStatus)}
          renderCard={(item) => (
            <>
              <p className="font-semibold text-[14px] text-navy m-0 truncate">{item.nome}</p>
              <p className="text-[12px] text-muted m-0 mt-1 truncate">
                {item.vaga}
                {item.vaga_outra ? ` · ${item.vaga_outra}` : ''}
              </p>
              <p className="text-[12px] text-muted m-0 mt-0.5 truncate">{item.cidade}</p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-[11px] text-muted/80 m-0">{formatDate(item.created_at)}</p>
                {item.curriculo_path && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green">
                    <FileText className="w-3 h-3" />
                    CV
                  </span>
                )}
              </div>
            </>
          )}
        />
      )}

      <DetailDrawer
        open={!!selected}
        title={selected?.nome ?? 'Candidato'}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <div className="space-y-3">
              {selected.curriculo_path && (
                <button
                  type="button"
                  disabled={cvLoading}
                  onClick={() => void openCv(selected.curriculo_path)}
                  className="w-full rounded-full bg-navy text-white font-semibold py-2.5 text-[14px] border-0 cursor-pointer hover:bg-navy-mid disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {cvLoading ? 'Abrindo…' : 'Abrir currículo'}
                </button>
              )}
              <div>
                <label className="block text-[12px] font-bold text-muted uppercase tracking-wide mb-1.5">
                  Mover para
                </label>
                <select
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-navy cursor-pointer"
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) => void moveTo(selected.id, e.target.value as CandidatoStatus)}
                >
                  {CANDIDATO_COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )
        }
      >
        {selected && (
          <>
            <DetailRow label="Vaga" value={selected.vaga} />
            {selected.vaga_outra && <DetailRow label="Outra área" value={selected.vaga_outra} />}
            <DetailRow label="Cidade" value={selected.cidade} />
            <DetailRow
              label="E-mail"
              value={
                <a className="text-brand-blue hover:underline inline-flex items-center gap-1" href={`mailto:${selected.email}`}>
                  <Mail className="w-3.5 h-3.5" />
                  {selected.email}
                </a>
              }
            />
            <DetailRow
              label="Telefone"
              value={
                <a
                  className="text-brand-blue hover:underline inline-flex items-center gap-1"
                  href={`https://wa.me/55${selected.telefone.replace(/\D/g, '').replace(/^55/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {selected.telefone}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              }
            />
            <DetailRow label="Currículo" value={selected.curriculo_nome || '—'} />
            <DetailRow label="Mensagem" value={selected.mensagem} />
            <DetailRow label="Recebido em" value={formatDate(selected.created_at)} />
            <DetailRow
              label="Source"
              value={
                <pre className={cn('text-[11px] bg-soft border border-line rounded-xl p-3 overflow-x-auto m-0 font-mono')}>
                  {JSON.stringify(selected.source ?? {}, null, 2)}
                </pre>
              }
            />
          </>
        )}
      </DetailDrawer>
    </div>
  )
}
