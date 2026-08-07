import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuth'
import { AdminApiError } from '@/lib/admin-api'
import { Logo } from '@/components/Logo'

export function AdminLogin() {
  const { login, isAuthenticated, loading } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/painel'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/painel" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Falha no login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0B1429] px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo variant="light" height={40} className="mx-auto max-w-[160px]" />
          <p className="mt-4 text-[12px] font-bold tracking-[0.16em] uppercase text-white/40 m-0">
            Acesso restrito
          </p>
          <h1 className="font-display font-extrabold text-2xl text-white m-0 mt-2">Painel MovSaúde</h1>
        </div>

        <form
          onSubmit={(e) => void onSubmit(e)}
          className="rounded-[24px] bg-white p-7 md:p-8 shadow-2xl space-y-4"
        >
          <div>
            <label htmlFor="user" className="block text-sm font-semibold text-navy mb-1.5">
              Usuário
            </label>
            <input
              id="user"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-[15px] text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
              placeholder="usuário"
            />
          </div>
          <div>
            <label htmlFor="pass" className="block text-sm font-semibold text-navy mb-1.5">
              Senha
            </label>
            <input
              id="pass"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-[15px] text-navy outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 m-0" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy text-white font-semibold py-3.5 text-[15px] border-0 cursor-pointer hover:bg-navy-mid disabled:opacity-50"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
