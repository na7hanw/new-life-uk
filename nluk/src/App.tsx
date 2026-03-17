import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext.tsx'
import { LANGS } from './data/ui-strings.ts'
import { SOS_NUMBERS } from './data/emergency.ts'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import ConsentBanner from './components/ConsentBanner.tsx'
import Logo from './components/Logo.tsx'
import SOSModal from './components/SOSModal.tsx'
import type { BeforeInstallPromptEvent } from './types'


const GuidesPage   = lazy(() => import('./pages/GuidesPage.tsx'))
const GuideDetail  = lazy(() => import('./pages/GuideDetail.tsx'))
const WorkHub      = lazy(() => import('./pages/WorkHub.tsx'))
const CertDetail   = lazy(() => import('./pages/CertDetail.tsx'))
const CareerDetail = lazy(() => import('./pages/CareerDetail.tsx'))
const SavesPage    = lazy(() => import('./pages/SavesPage.tsx'))
const AppsPage     = lazy(() => import('./pages/AppsPage.tsx'))
const MorePage     = lazy(() => import('./pages/MorePage.tsx'))

// ─── AppShell ────────────────────────────────────────────────────
export default function App() {
  const { lang, setLang, dark, setDark, showSOS, setSOS, showLang, setShowLang, ui, dir, fontClass } = useApp()
  const [showSettings, setSettings] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDone, setInstallDone] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Capture the PWA beforeinstallprompt event so we can show our own button
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstallDone(true); setInstallPrompt(null) }
  }

  const isDetail = /^\/(guide|cert|career)\//.test(location.pathname) || location.pathname === '/saves/apps'
  const [routeAnn, setRouteAnn] = useState('')

  useEffect(() => {
    const p = location.pathname
    const ann =
      p === '/'            ? 'Guides' :
      p.startsWith('/guide/') ? 'Guide detail' :
      p.startsWith('/work')   ? 'Work and jobs' :
      p.startsWith('/cert/')  ? 'Certificate detail' :
      p.startsWith('/career/')? 'Career path detail' :
      p === '/saves/apps' ? 'Essential apps' :
      p === '/saves'      ? 'Saved resources' :
      p === '/more'       ? 'More and settings' : ''
    setRouteAnn(ann)
  }, [location.pathname])

  const TABS = [
    { id: 'guides', path: '/', icon: '📖', label: ui.guides },
    { id: 'work', path: '/work/jobs', icon: '💼', label: ui.work },
    { id: 'saves', path: '/saves', icon: '🆓', label: ui.saves },
    { id: 'more', path: '/more', icon: '☰', label: ui.more },
  ]

  const isTabActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.replace('/jobs', ''))
  }

  const switchTab = (path: string) => {
    navigate(path)
  }

  return (
    <div className={`app-root ${dark ? 'dark' : ''} ${fontClass}`} dir={dir}>

      {/* SKIP-TO-CONTENT for keyboard navigation */}
      <a href="#main-content" className="skip-link">{ui.skipToContent || 'Skip to content'}</a>

      {/* SCREEN READER ROUTE ANNOUNCER */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">{routeAnn}</span>

      {/* LANGUAGE OVERLAY */}
      {showLang && (
        <div className="lang-overlay" role="dialog" aria-label="Select language">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="header-brand"><Logo size={28} /><h1 style={{ fontSize: '1.05rem', fontWeight: 800 }}>New Life UK</h1></div>
            <button className="btn btn-primary" onClick={() => setShowLang(false)}>{ui.close} ✓</button>
          </div>
          <div className="lang-grid">
            {LANGS.map(l => (
              <button key={l.code} className={`lang-item ${lang === l.code ? 'active' : ''}`}
                onClick={() => { setLang(l.code); setShowLang(false) }}>
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-name">{l.native}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HEADER — hidden on detail pages and lang overlay */}
      {!isDetail && !showLang && (
        <header className="app-header">
          <div className="header-brand"><Logo size={26} /><h1>{ui.app}</h1></div>
          <div className="header-actions">
            <button className="btn-settings" onClick={() => setSettings(true)} aria-label={ui.settings}>⚙</button>
            <button className="btn-sos" onClick={() => { navigator?.vibrate?.(15); setSOS(true) }} aria-label="Emergency SOS">{ui.sos}</button>
          </div>
        </header>
      )}

      {/* SCROLLABLE CONTENT */}
      <main className="app-scroll" id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<div className="skeleton" role="status" aria-busy="true" aria-label="Loading..." style={{ height: 48, width: 48, borderRadius: '50%', margin: '32px auto' }} />}>
            <Routes>
              <Route path="/" element={<GuidesPage />} />
              <Route path="/guide/:id" element={<GuideDetail />} />
              <Route path="/work" element={<Navigate to="/work/jobs" replace />} />
              <Route path="/work/:subtab" element={<WorkHub />} />
              <Route path="/cert/:id" element={<CertDetail />} />
              <Route path="/career/:id" element={<CareerDetail />} />
              <Route path="/saves" element={<SavesPage />} />
              <Route path="/saves/apps" element={<AppsPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* TAB BAR */}
      {!isDetail && !showLang && (
        <nav className="tab-bar" aria-label="Main navigation">
          <div role="tablist" style={{ display: 'contents' }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn ${isTabActive(t.path) ? 'active' : ''}`}
                onClick={() => switchTab(t.path)} role="tab" aria-selected={isTabActive(t.path)} aria-label={t.label}>
                {isTabActive(t.path) && <div className="tab-dot" />}
                <span className="tab-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* SOS MODAL — focus-trapped, no backdrop dismiss (safety-critical) */}
      <SOSModal showSOS={showSOS} setSOS={setSOS} ui={ui} SOS_NUMBERS={SOS_NUMBERS} />

      {/* CONSENT BANNER — shown once on first visit when Sentry is configured */}
      <ConsentBanner ui={ui} />

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-backdrop" role="presentation"
          onClick={() => setSettings(false)}
          onKeyDown={e => e.key === 'Escape' && setSettings(false)}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div className="modal-content" role="dialog" aria-modal="true" aria-label={ui.settings}
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>⚙ {ui.settings}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSettings(false)} aria-label={ui.close}>✕</button>
            </div>
            <div className="settings-row">
              <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
              <button className="btn btn-primary btn-sm" onClick={() => setDark(d => !d)}>{dark ? ui.lightMode : ui.darkMode}</button>
            </div>
            {(installPrompt || installDone) && (
              <div className="settings-row">
                <span style={{ fontWeight: 700 }}>{ui.installApp || '📲 Install App'}</span>
                <button className="btn btn-outline btn-sm" onClick={handleInstall} disabled={installDone}>
                  {installDone ? (ui.installDone || 'Installed!') : '📲 Install'}
                </button>
              </div>
            )}
            <h3 className="modal-title" style={{ marginTop: 16, marginBottom: 4 }}>{ui.language}</h3>
            {LANGS.map(l => (
              <button key={l.code} className="settings-row" onClick={() => { setLang(l.code); setSettings(false) }} aria-label={l.native}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                  <span style={{ fontWeight: 700 }}>{l.native}</span>
                </div>
                {lang === l.code && <span style={{ color: 'var(--ac)', fontWeight: 800 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
