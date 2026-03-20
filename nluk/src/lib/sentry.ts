export const SENTRY_DSN: string | undefined = import.meta.env.VITE_SENTRY_DSN

// Initialize Sentry for anonymous crash reporting only.
// Session replay is intentionally excluded — this app serves vulnerable people
// and session recording is too privacy-invasive without explicit ongoing consent.
// The SDK is loaded lazily so it never ships in the critical JS bundle.
export async function initSentry(): Promise<void> {
  if (!SENTRY_DSN) return
  const Sentry = await import('@sentry/react')
  if (Sentry.getClient()) return // Already initialised — do not double-init
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Zero personal data — this app serves refugees and asylum seekers.
    sendDefaultPii: false,
    // Only sample a small fraction of traces; no session replay
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    // Aggressively scrub any data that could identify vulnerable users
    // before it leaves the browser. IPs, user-agents, and device fingerprints
    // must never reach Sentry's servers.
    beforeSend(event) {
      // Strip all request headers (may contain IP, user-agent, cookies)
      if (event.request) {
        delete event.request.headers
        delete event.request.cookies
        delete event.request.env
        // Retain only the path (no query strings which may contain tokens)
        if (event.request.url) {
          try {
            const u = new URL(event.request.url)
            event.request.url = u.origin + u.pathname
          } catch {
            delete event.request.url
          }
        }
      }
      // Remove device context (screen size, memory, etc. can fingerprint users)
      if (event.contexts) {
        delete event.contexts.device
        delete event.contexts.browser
        delete event.contexts.os
        delete event.contexts.runtime
      }
      // Strip user context entirely — we never set it but belt-and-braces
      delete event.user
      // Remove breadcrumbs that contain navigation URLs or user-agent hints
      if (event.breadcrumbs?.values) {
        event.breadcrumbs.values = event.breadcrumbs.values
          .filter(b => b.category !== 'navigation' && b.category !== 'ui.click')
          .map(b => {
            // Strip any data payload from remaining breadcrumbs
            const clean = { ...b }
            delete clean.data
            return clean
          })
      }
      return event
    },
  })
}
