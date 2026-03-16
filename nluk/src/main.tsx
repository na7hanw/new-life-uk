import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppProvider } from './context/AppContext.tsx'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { initSentry } from './lib/sentry.ts'
import './index.css'

// Initialise Sentry only if the user has previously given consent (UK GDPR Art. 6(1)(a)).
// The ConsentBanner component handles first-run consent and calls initSentry() when granted.
const storedConsent = (() => { try { return localStorage.getItem('nluk_consent') } catch { return null } })()
if (storedConsent === 'granted') void initSentry()

// Report Core Web Vitals — console in dev only; Sentry captures perf automatically on init
if (import.meta.env.DEV) {
  import('web-vitals').then(vt => {
    type Metric = { name: string; value: number; rating: string }
    const report = (metric: Metric) => {
      // eslint-disable-next-line no-console
      console.debug('[Web Vitals]', metric.name, metric.value.toFixed(1), metric.rating)
    }
    if (vt.onCLS)  vt.onCLS(report)
    if (vt.onFCP)  vt.onFCP(report)
    if (vt.onLCP)  vt.onLCP(report)
    if (vt.onINP)  vt.onINP(report)
    if (vt.onTTFB) vt.onTTFB(report)
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <HashRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </HashRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
