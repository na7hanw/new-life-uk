import { useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import { LANGS } from './data/ui-strings.js'
import { SOS_NUMBERS } from './data/emergency.js'
import { ls } from './lib/utils.js'
import Logo from './components/Logo.jsx'
import SOSModal from './components/SOSModal.jsx'
import GuidesPage from './pages/GuidesPage.jsx'
import GuideDetail from './pages/GuideDetail.jsx'
import WorkHub from './pages/WorkHub.jsx'
import CertDetail from './pages/CertDetail.jsx'
import CareerDetail from './pages/CareerDetail.jsx'
import SavesPage from './pages/SavesPage.jsx'
import MorePage from './pages/MorePage.jsx'

// ─── AppShell ────────────────────────────────────────────────────
export default function App() {
  const { lang, setLang, dark, setDark, showSOS, setSOS, showLang, setShowLang, ui, L, dir, fontClass } = useApp()
  const [showSettings, setSettings] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isDetail = /^\/(guide|cert|career)\//.test(location.pathname)

  const [workTab] = useState(() => ls('nluk_wtab', 'jobs'))

  const TABS = [
    { id: 'guides', path: '/', icon: '📖', label: ui.guides },
    { id: 'work', path: '/work/jobs', icon: '💼', label: ui.work },
    { id: 'saves', path: '/saves', icon: '🆓', label: ui.saves },
    { id: 'more', path: '/more', icon: '☰', label: ui.more },
  ]

  const isTabActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.replace('/jobs', ''))
  }

  const switchTab = (path) => {
    navigate(path)
  }

  return (
    <div className={`app-root ${dark ? 'dark' : ''} ${fontClass}`} dir={dir}>

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
            <button className="btn-sos" onClick={() => setSOS(true)} aria-label="Emergency SOS">{ui.sos}</button>
          </div>
        </header>
      )}

      {/* SCROLLABLE CONTENT */}
      <main className="app-scroll">
        <Routes>
          <Route path="/" element={<GuidesPage />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/work" element={<Navigate to="/work/jobs" replace />} />
          <Route path="/work/:subtab" element={<WorkHub />} />
          <Route path="/cert/:idx" element={<CertDetail />} />
          <Route path="/career/:idx" element={<CareerDetail />} />
          <Route path="/saves" element={<SavesPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* TAB BAR */}
      {!isDetail && !showLang && (
        <nav className="tab-bar" role="tablist" aria-label="Main navigation">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${isTabActive(t.path) ? 'active' : ''}`}
              onClick={() => switchTab(t.path)} role="tab" aria-selected={isTabActive(t.path)} aria-label={t.label}>
              {isTabActive(t.path) && <div className="tab-dot" />}
              <span className="tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* FLOATING SOS — always visible except when modal open or lang overlay shown */}
      {!showLang && !showSOS && (
        <button
          className="floating-sos"
          onClick={() => setSOS(true)}
          aria-label={ui.sosLabel || 'Open emergency contacts'}
          aria-haspopup="dialog"
        >{ui.sos}</button>
      )}

      {/* SOS MODAL — focus-trapped, no backdrop dismiss (safety-critical) */}
      <SOSModal showSOS={showSOS} setSOS={setSOS} ui={ui} SOS_NUMBERS={SOS_NUMBERS} />

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-backdrop" onClick={() => setSettings(false)} role="dialog" aria-label={ui.settings}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>⚙ {ui.settings}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSettings(false)} aria-label={ui.close}>✕</button>
            </div>
            <div className="settings-row">
              <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
              <button className="btn btn-primary btn-sm" onClick={() => setDark(d => !d)}>{dark ? ui.lightMode : ui.darkMode}</button>
            </div>
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
