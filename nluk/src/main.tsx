import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import { AppProvider } from './context/AppContext.tsx'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SENTRY_DSN, initSentry } from './lib/sentry.ts'
import './index.css'

// Initialise Sentry only if the user has previously given consent (UK GDPR Art. 6(1)(a)).
// The ConsentBanner component handles first-run consent and calls initSentry() when granted.
const storedConsent = (() => { try { return localStorage.getItem('nluk_consent') } catch { return null } })()
if (storedConsent === 'granted') initSentry()

const SentryErrorBoundary = SENTRY_DSN
  ? Sentry.ErrorBoundary
  : ({ children }: { children: React.ReactNode }) => <>{children}</>

// Report Core Web Vitals — sent to Sentry only when consented, otherwise console in dev
import('web-vitals').then(vt => {
  type Metric = { name: string; value: number; rating: string }
  const report = (metric: Metric) => {
    if (SENTRY_DSN && storedConsent === 'granted') {
      Sentry.metrics?.['increment']?.(`web_vitals.${metric.name.toLowerCase()}`, metric.value)
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[Web Vitals]', metric.name, metric.value.toFixed(1), metric.rating)
    }
  }
  if (vt.onCLS)  vt.onCLS(report)
  if (vt.onFCP)  vt.onFCP(report)
  if (vt.onLCP)  vt.onLCP(report)
  if (vt.onINP)  vt.onINP(report)
  if (vt.onTTFB) vt.onTTFB(report)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={<div>An error occurred. Please reload the page.</div>} showDialog>
      <ErrorBoundary>
        <HelmetProvider>
          <HashRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </HashRouter>
        </HelmetProvider>
      </ErrorBoundary>
    </SentryErrorBoundary>
  </React.StrictMode>
)
