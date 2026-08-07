import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0B1429] text-white/70">
        Carregando…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/painel/login" replace state={{ from: location.pathname }} />
  }

  return children
}
