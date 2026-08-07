const FALLBACK_URL = 'https://ielylrtjiusrrmdlozli.supabase.co'
const FALLBACK_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHlscnRqaXVzcnJtZGxvemxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDQ3ODYsImV4cCI6MjEwMTY4MDc4Nn0.CACks9LVoOVXkMawszSCsSlXXX_J13Oh5CAGH-wyNJM'

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || FALLBACK_URL
const ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || FALLBACK_ANON
const BASE = `${SUPABASE_URL}/functions/v1/admin-api`

const TOKEN_KEY = 'movsaude_admin_token'
const USER_KEY = 'movsaude_admin_user'

export type ContatoStatus =
  | 'novo_contato'
  | 'em_contato'
  | 'em_negociacao'
  | 'ganho'
  | 'perdido'

export type CandidatoStatus =
  | 'novo_candidato'
  | 'triagem'
  | 'entrevista_agendada'
  | 'contratado'
  | 'sem_perfil'

export type Contato = {
  id: string
  created_at: string
  nome: string
  cargo: string | null
  municipio: string
  uf: string
  email: string
  telefone: string
  projetos: string[]
  mensagem: string | null
  consent: boolean
  source: Record<string, unknown>
  status: ContatoStatus
}

export type Candidatura = {
  id: string
  created_at: string
  nome: string
  email: string
  telefone: string
  cidade: string
  vaga: string
  vaga_outra: string | null
  curriculo_nome: string | null
  curriculo_path: string | null
  mensagem: string | null
  consent: boolean
  source: Record<string, unknown>
  status: CandidatoStatus
}

export type AdminStats = {
  contatos: {
    total: number
    novo_contato: number
    em_contato: number
    em_negociacao: number
    em_andamento: number
    ganho: number
    perdido: number
  }
  candidaturas: {
    total: number
    novo_candidato: number
    triagem: number
    entrevista_agendada: number
    em_processo: number
    contratado: number
    sem_perfil: number
  }
}

export const CONTATO_COLUMNS: { id: ContatoStatus; label: string }[] = [
  { id: 'novo_contato', label: 'Novo contato' },
  { id: 'em_contato', label: 'Em contato' },
  { id: 'em_negociacao', label: 'Em negociação' },
  { id: 'ganho', label: 'Ganho' },
  { id: 'perdido', label: 'Perdido' },
]

export const CANDIDATO_COLUMNS: { id: CandidatoStatus; label: string }[] = [
  { id: 'novo_candidato', label: 'Novo candidato' },
  { id: 'triagem', label: 'Triagem' },
  { id: 'entrevista_agendada', label: 'Entrevista agendada' },
  { id: 'contratado', label: 'Contratado' },
  { id: 'sem_perfil', label: 'Sem perfil' },
]

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USER_KEY)
}

export function setSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, username)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

class AdminApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers: extraHeaders, ...rest } = options
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    ...(extraHeaders as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...rest, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AdminApiError(
      (data as { error?: string }).error || `Erro ${res.status}`,
      res.status,
    )
  }
  return data as T
}

export async function adminLogin(username: string, password: string) {
  const data = await request<{ token: string; expiresAt: string; username: string }>(
    '/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
  )
  setSession(data.token, data.username)
  return data
}

export async function adminLogout() {
  const token = getStoredToken()
  try {
    if (token) {
      await request('/logout', { method: 'POST', token })
    }
  } catch {
    /* ignore */
  } finally {
    clearSession()
  }
}

export async function adminMe() {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  return request<{ username: string }>('/me', { token })
}

export async function adminStats() {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  return request<AdminStats>('/stats', { token })
}

export async function adminContatos() {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  const data = await request<{ items: Contato[] }>('/contatos', { token })
  return data.items
}

export async function adminUpdateContatoStatus(id: string, status: ContatoStatus) {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  const data = await request<{ item: Contato }>('/contatos/status', {
    method: 'PATCH',
    token,
    body: JSON.stringify({ id, status }),
  })
  return data.item
}

export async function adminDeleteContato(id: string) {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  return request<{ ok: boolean; id: string }>('/contatos', {
    method: 'DELETE',
    token,
    body: JSON.stringify({ id }),
  })
}

export async function adminDeleteCandidatura(id: string) {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  return request<{ ok: boolean; id: string }>('/candidaturas', {
    method: 'DELETE',
    token,
    body: JSON.stringify({ id }),
  })
}

export async function adminCandidaturas() {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  const data = await request<{ items: Candidatura[] }>('/candidaturas', { token })
  return data.items
}

export async function adminUpdateCandidaturaStatus(id: string, status: CandidatoStatus) {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  const data = await request<{ item: Candidatura }>('/candidaturas/status', {
    method: 'PATCH',
    token,
    body: JSON.stringify({ id, status }),
  })
  return data.item
}

export async function adminCvUrl(path: string) {
  const token = getStoredToken()
  if (!token) throw new AdminApiError('Não autenticado', 401)
  const q = encodeURIComponent(path)
  return request<{ url: string }>(`/cv-url?path=${q}`, { token })
}

export { AdminApiError }
