import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  adminLogin,
  adminLogout,
  adminMe,
  clearSession,
  getStoredToken,
  getStoredUsername,
  AdminApiError,
} from '@/lib/admin-api'

type AdminAuthState = {
  username: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthState | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(getStoredUsername())
  const [loading, setLoading] = useState(!!getStoredToken())

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    adminMe()
      .then((me) => {
        if (!cancelled) setUsername(me.username)
      })
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 401) {
          clearSession()
          if (!cancelled) setUsername(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (user: string, password: string) => {
    const data = await adminLogin(user, password)
    setUsername(data.username)
  }, [])

  const logout = useCallback(async () => {
    await adminLogout()
    setUsername(null)
  }, [])

  const value = useMemo(
    () => ({
      username,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(username),
    }),
    [username, loading, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
