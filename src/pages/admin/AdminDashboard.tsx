import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { adminStats, type AdminStats, AdminApiError } from '@/lib/admin-api'
import { StatCard } from '@/components/admin/StatCard'

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    adminStats()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof AdminApiError ? e.message : 'Erro ao carregar')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[28px] text-navy m-0 tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted m-0 mt-1 text-[15px]">
          Visão rápida de contatos e candidaturas.
        </p>
      </div>

      {loading && <p className="text-muted">Carregando métricas…</p>}
      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      {stats && (
        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-display font-bold text-lg text-navy m-0">Contatos</h2>
              <Link
                to="/painel/contatos"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-blue hover:underline"
              >
                Abrir CRM
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total" value={stats.contatos.total} tone="navy" />
              <StatCard
                label="Em andamento"
                value={stats.contatos.em_andamento}
                hint="Novo + em contato + negociação"
                tone="amber"
              />
              <StatCard label="Ganhos" value={stats.contatos.ganho} tone="green" />
              <StatCard label="Perdidos" value={stats.contatos.perdido} tone="muted" />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-display font-bold text-lg text-navy m-0">Candidatos</h2>
              <Link
                to="/painel/candidatos"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-blue hover:underline"
              >
                Abrir pipeline
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Currículos" value={stats.candidaturas.total} tone="navy" />
              <StatCard
                label="Em processo"
                value={stats.candidaturas.em_processo}
                hint="Novo + triagem + entrevista"
                tone="blue"
              />
              <StatCard label="Contratados" value={stats.candidaturas.contratado} tone="green" />
              <StatCard label="Sem perfil" value={stats.candidaturas.sem_perfil} tone="muted" />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
