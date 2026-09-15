// Thin wrapper around the Meta Pixel `fbq` global loaded in index.html.
// Keeps event names centralized so we don't scatter string literals / add
// events that weren't explicitly approved.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/** Fires the standard Meta "Lead" event. Call only after a confirmed
 * successful submission of the contact/interest form. */
export function trackLead() {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead')
  }
}
