import * as Sentry from '@sentry/react'

export const SENTRY_DSN: string | undefined = import.meta.env.VITE_SENTRY_DSN

// Initialize Sentry for anonymous crash reporting only.
// Session replay is intentionally excluded — this app serves vulnerable people
// and session recording is too privacy-invasive without explicit ongoing consent.
export function initSentry(): void {
  if (!SENTRY_DSN) return
  if (Sentry.getClient()) return // Already initialised — do not double-init
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Only sample a small fraction of traces; no session replay
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  })
}
