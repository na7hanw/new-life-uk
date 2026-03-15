import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Initialize Sentry for error tracking in production
// Set VITE_SENTRY_DSN environment variable in production deploys
const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 0.5,
    replaysOnErrorSampleRate: 1.0,
  })
}

const SentryErrorBoundary = dsn ? Sentry.ErrorBoundary : ({ children }) => children

// Report Core Web Vitals — sent to Sentry if enabled, otherwise console in dev
import('web-vitals').then((vt) => {
  const report = (metric) => {
    if (dsn) {
      Sentry.metrics?.increment(`web_vitals.${metric.name.toLowerCase()}`, metric.value)
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[Web Vitals]', metric.name, metric.value.toFixed(1), metric.rating)
    }
  }
  // onFID was removed in web-vitals v4; onINP replaces it
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
