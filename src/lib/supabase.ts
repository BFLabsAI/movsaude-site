import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  console.warn(
    '[supabase] Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '')

export type ContactInsert = {
  nome: string
  cargo?: string | null
  municipio: string
  uf: string
  email: string
  telefone: string
  projetos?: string[]
  mensagem?: string | null
  consent: boolean
  source: Record<string, unknown>
}

export type JobApplicationInsert = {
  nome: string
  email: string
  telefone: string
  cidade: string
  vaga: string
  vaga_outra?: string | null
  /** Nome original do arquivo (display) */
  curriculo_nome?: string | null
  /** Path/id do objeto no bucket Storage `curriculos` — o binário NÃO fica na tabela */
  curriculo_path?: string | null
  mensagem?: string | null
  consent: boolean
  source: Record<string, unknown>
}

/** Bucket privado onde os PDFs/Word de currículo são salvos */
export const CV_BUCKET = 'curriculos'

/** Gera path único no Storage (o id do documento = path no bucket). */
export function buildCvStoragePath(fileName: string): string {
  const safe = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  const ext = safe.includes('.') ? safe.slice(safe.lastIndexOf('.')) : ''
  const base = safe.includes('.') ? safe.slice(0, safe.lastIndexOf('.')) : safe || 'curriculo'
  const id = crypto.randomUUID()
  const y = new Date().getUTCFullYear()
  const m = String(new Date().getUTCMonth() + 1).padStart(2, '0')
  return `${y}/${m}/${id}-${base}${ext}`
}
