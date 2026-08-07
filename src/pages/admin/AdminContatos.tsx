import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Mail, Phone, Trash2 } from 'lucide-react'
import {
  adminContatos,
  adminDeleteContato,
  adminUpdateContatoStatus,
  CONTATO_COLUMNS,
  type Contato,
  type ContatoStatus,
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

export function AdminContatos() {
  const [params] = useSearchParams()
  const deepId = params.get('id')
  const [items, setItems] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Contato | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    adminContatos()
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

  async function moveTo(id: string, status: ContatoStatus) {
    const previous = items
    // optimistic UI
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    setSelected((s) => (s?.id === id ? { ...s, status } : s))
    setSaving(true)
    try {
      const updated = await adminUpdateContatoStatus(id, status)
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      setSelected((s) => (s?.id === id ? updated : s))
    } catch (e) {
      setItems(previous)
      alert(e instanceof AdminApiError ? e.message : 'Falha ao atualizar status')
    } finally {
      setSaving(false)
    }
  }

  async function removeDeal(id: string) {
    const item = items.find((i) => i.id === id)
    const ok = window.confirm(
      `Excluir o deal de ${item?.nome ?? 'este contato'}?\nEssa ação não pode ser desfeita.`,
    )
    if (!ok) return
    setSaving(true)
    try {
      await adminDeleteContato(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      setSelected(null)
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : 'Falha ao excluir')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-extrabold text-[24px] sm:text-[28px] text-navy m-0 tracking-tight">
            Contatos
          </h1>
          <p className="text-muted m-0 mt-1 text-[13px] sm:text-[15px] leading-snug">
            Arraste cards entre etapas · toque para detalhes
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-navy cursor-pointer hover:bg-soft min-h-[44px]"
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
          columns={CONTATO_COLUMNS}
          items={items}
          getStatus={(i) => i.status || 'novo_contato'}
          disabled={saving}
          onOpen={setSelected}
          onMove={(id, status) => moveTo(id, status as ContatoStatus)}
          renderCard={(item) => (
            <>
              <p className="font-semibold text-[14px] text-navy m-0 truncate">{item.nome}</p>
              <p className="text-[12px] text-muted m-0 mt-1 truncate">
                {item.municipio}/{item.uf}
                {item.cargo ? ` · ${item.cargo}` : ''}
              </p>
              <p className="text-[11px] text-muted/80 m-0 mt-2">{formatDate(item.created_at)}</p>
              {item.projetos?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.projetos.slice(0, 3).map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-semibold bg-soft border border-line rounded-full px-2 py-0.5 text-navy/70"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        />
      )}

      <DetailDrawer
        open={!!selected}
        title={selected?.nome ?? 'Contato'}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-muted uppercase tracking-wide mb-1.5">
                  Mover para
                </label>
                <select
                  className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-navy cursor-pointer"
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) => void moveTo(selected.id, e.target.value as ContatoStatus)}
                >
                  {CONTATO_COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => void removeDeal(selected.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold py-2.5 text-[14px] cursor-pointer hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Excluir deal
              </button>
            </div>
          )
        }
      >
        {selected && (
          <>
            <DetailRow label="Cargo" value={selected.cargo} />
            <DetailRow label="Município" value={`${selected.municipio} / ${selected.uf}`} />
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
            <DetailRow
              label="Projetos"
              value={selected.projetos?.length ? selected.projetos.join(', ') : '—'}
            />
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
