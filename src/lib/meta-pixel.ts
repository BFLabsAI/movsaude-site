// Thin wrapper around the Meta Pixel `fbq` global loaded in index.html.
// Keeps event names centralized so we don't scatter string literals / add
// events that weren't explicitly approved.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    __lastLeadEventId?: string
  }
}

/** Generates a unique event id for Pixel/CAPI dedup. Prefers
 * crypto.randomUUID(); falls back to a timestamp+random string when
 * unavailable (older browsers / non-secure contexts). */
export function generateLeadEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Fires the standard Meta "Lead" event, client-side only. Does not wait
 * on or depend on any backend call — call it as soon as the user submits
 * the form so tracking never depends on Supabase (or any other backend)
 * being reachable.
 *
 * `eventId` should be generated up front (see `generateLeadEventId`) and,
 * when the same lead is later sent server-side via the Conversions API,
 * reused as that payload's `event_id` so Meta can dedup the two events. */
export function trackLead(eventId: string) {
  if (typeof window !== 'undefined') {
    window.__lastLeadEventId = eventId
    // eslint-disable-next-line no-console
    console.log('[bf-track-test] lead_event_id=' + eventId)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {}, { eventID: eventId })
    }
  }
}
