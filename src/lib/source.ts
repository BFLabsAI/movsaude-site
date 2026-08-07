export type FormSource = {
  /** Todos os query params da URL no momento do envio */
  query: Record<string, string | string[]>
  path: string
  href: string
  referrer: string | null
  landing_at: string
}

type SearchParamsLike = {
  keys: () => IterableIterator<string>
  getAll: (name: string) => string[]
}

/**
 * Monta o objeto `source` (JSONB) a partir da URL.
 * Inclui todos os search params (utm_*, gclid, fbclid, projeto, etc.).
 * Valores repetidos viram array.
 */
export function buildSourceFromUrl(
  searchParams: SearchParamsLike,
  pathname = typeof window !== 'undefined' ? window.location.pathname : '',
): FormSource {
  const query: Record<string, string | string[]> = {}

  for (const key of searchParams.keys()) {
    const all = searchParams.getAll(key)
    query[key] = all.length <= 1 ? (all[0] ?? '') : all
  }

  return {
    query,
    path: pathname,
    href: typeof window !== 'undefined' ? window.location.href : pathname,
    referrer:
      typeof document !== 'undefined' && document.referrer ? document.referrer : null,
    landing_at: new Date().toISOString(),
  }
}
