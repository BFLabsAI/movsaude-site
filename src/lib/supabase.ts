import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Valores públicos do projeto (RLS protege os dados). Fallback evita tela branca se a Vercel não tiver env. */
const FALLBACK_URL = 'https://ielylrtjiusrrmdlozli.supabase.co'
const FALLBACK_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbHlscnRqaXVzcnJtZGxvemxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDQ3ODYsImV4cCI6MjEwMTY4MDc4Nn0.CACks9LVoOVXkMawszSCsSlXXX_J13Oh5CAGH-wyNJM'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || FALLBACK_URL
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || FALLBACK_ANON

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[supabase] Usando fallback público do projeto. Preferível definir VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel.',
  )
}

export const supabase: SupabaseClient = createClient(url, anonKey)

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
  curriculo_nome?: string | null
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
