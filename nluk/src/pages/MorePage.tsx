import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'
import { GITHUB_URL } from '../data/emergency.ts'
import { ls, lsSet } from '../lib/utils.ts'
import { clearTranslationCache } from '../lib/translate.ts'
import { SENTRY_DSN, initSentry } from '../lib/sentry.ts'
import { CONSENT_KEY } from '../components/ConsentBanner.tsx'
import type { BeforeInstallPromptEvent, UserStatus } from '../types'

const ALL_KEYS = ['nluk_lang', 'nluk_dark', 'nluk_wtab', 'nluk_tx3', 'nluk_status', CONSENT_KEY]

export default function MorePage() {
  const { ui, L, dark, setDark, setShowLang, userStatus, setUserStatus, ab } = useApp()
  const navigate = useNavigate()
  const [offlineReady, setOfflineReady] = useState(false)
  const [consent, setConsent] = useState(() => ls(CONSENT_KEY, ''))
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDone, setInstallDone] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOfflineReady(true)).catch(() => {})
    }
  }, [])

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

  const toggleConsent = () => {
    const next = consent === 'granted' ? 'denied' : 'granted'
    lsSet(CONSENT_KEY, next)
    setConsent(next)
    if (next === 'granted') initSentry()
  }

  return (
    <div className="page-enter">
      <div className="detail-header" style={{ borderBottom: '1px solid var(--bd)', marginBottom: 8 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className="page-hero" style={{ borderBottom: 'none', margin: 0 }}>
          <h2 className="page-hero-title">⚙ {ui.settings}</h2>
          <p className="page-hero-sub">{ui.settingsSub}</p>
        </div>
      </div>

      <div className="section-label">{ui.theme}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setDark(!dark)}>
            {dark ? ui.lightMode : ui.darkMode}
          </button>
        </div>
      </div>

      {(installPrompt || installDone) && (
        <div className="card" style={{ margin: '0 20px 12px' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>{ui.installApp || '📲 Install App'}</span>
            <button className="btn btn-outline btn-sm" onClick={handleInstall} disabled={installDone}>
              {installDone ? (ui.installDone || 'Installed!') : '📲 Install'}
            </button>
          </div>
        </div>
      )}

      <div className="section-label">{ui.language}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>{L.flag} {L.native}</span>
          <button className="btn btn-outline btn-sm" onClick={() => setShowLang(true)}>{ui.change}</button>
        </div>
      </div>

      <div className="section-label">👤 {ui.statusLabel || 'My Situation'}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        {([
          { value: 'asylum-seeker' as UserStatus, label: ui.statusAsylumSeeker || '⏳ Asylum seeker — waiting for my decision' },
          { value: 'refugee'       as UserStatus, label: ui.statusRefugee       || '✅ Recognised refugee' },
          { value: 'other-visa'    as UserStatus, label: ui.statusOtherVisa     || '🛂 Another visa (Skilled Worker, Family, Student…)' },
          { value: 'settled'       as UserStatus, label: ui.statusSettled       || '🇬🇧 Settled / Pre-Settled Status' },
        ]).map(opt => (
          <button key={opt.value} className="settings-row"
            onClick={() => setUserStatus(userStatus === opt.value ? '' : opt.value)}
            aria-label={opt.label} aria-pressed={userStatus === opt.value}>
            <span style={{ fontSize: '.875rem' }}>{opt.label}</span>
            {userStatus === opt.value && <span style={{ color: 'var(--ac)', fontWeight: 800 }}>✓</span>}
          </button>
        ))}
        <div style={{ padding: '8px 16px' }}>
          <p style={{ fontSize: '.75rem', color: 'var(--t3)', margin: 0 }}>
            {ui.statusPickerSub || 'Optional — helps us show the most relevant guides first.'}
          </p>
        </div>
      </div>

      <div className="section-label">🔒 {ui.privacy || 'Privacy & Data'}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '14px 16px' }}>

          {/* ── What this app stores ── */}
          <p style={{ fontWeight: 700, marginBottom: 6, fontSize: '.95rem' }}>
            {ui.privacyTitle || 'Your Privacy'}
          </p>
          <p style={{ fontSize: '.875rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: 10 }}>
            {ui.privacyBody || 'This app stores only your language preference and theme setting locally on your device. No personal information is collected or shared. There are no cookies and no user accounts.'}
          </p>

          <p style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 4 }}>{ui.privacyLocal || 'Stored locally on your device only:'}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {([
              ['nluk_lang',    ui.privacyKeyLang    || 'Language preference'],
              ['nluk_dark',    ui.privacyKeyTheme   || 'Dark / light mode'],
              ['nluk_wtab',    ui.privacyKeyTab     || 'Last work tab viewed'],
              ['nluk_status',  ui.statusLabel       || 'Your situation (asylum seeker / refugee etc.)'],
              ['nluk_tx3',     'Cached translations (auto-translate)'],
              [CONSENT_KEY,    ui.privacyKeyConsent || 'Your crash-report consent choice'],
            ] as [string, string][]).map(([k, v]) => (
              <li key={k} style={{ fontSize: '.8rem', color: 'var(--t2)', padding: '2px 0' }}>
                <code style={{ background: 'var(--bg3)', borderRadius: 4, padding: '1px 5px', marginRight: 6 }}>{k}</code>{v}
              </li>
            ))}
          </ul>

          {/* ── Crash reporting (Sentry) ── */}
          {SENTRY_DSN && (
            <>
              <p style={{ fontWeight: 700, marginTop: 14, marginBottom: 4, fontSize: '.875rem' }}>
                {ui.privacyCrashTitle || '🐛 Anonymous crash reports'}
              </p>
              <p style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: 8 }}>
                {ui.privacyCrashBody || 'With your permission, the app sends anonymous error reports to Sentry (sentry.io) when it crashes. This helps us fix bugs. No personal information is included. No session recordings are made. You can opt out at any time below.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '.875rem', fontWeight: 700 }}>
                  {consent === 'granted'
                    ? (ui.privacyCrashOn  || '✅ Crash reports: on')
                    : (ui.privacyCrashOff || '❌ Crash reports: off')}
                </span>
                <button className="btn btn-outline btn-sm" onClick={toggleConsent}>
                  {consent === 'granted'
                    ? (ui.privacyCrashDisable || 'Turn off')
                    : (ui.privacyCrashEnable  || 'Turn on')}
                </button>
              </div>
              <p style={{ fontSize: '.75rem', color: 'var(--t3)', lineHeight: 1.5 }}>
                {ui.privacyCrashSentry || 'Sentry is an independent service. See'}{' '}
                <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer"
                  aria-label="Sentry privacy policy (opens in new tab)"
                  style={{ color: 'var(--ac3)', textDecoration: 'underline' }}>
                  sentry.io/privacy
                </a>
              </p>
            </>
          )}

          {/* ── UK GDPR rights ── */}
          <p style={{ fontWeight: 700, marginTop: 14, marginBottom: 4, fontSize: '.875rem' }}>
            {ui.gdprRightsTitle || '⚖️ Your UK GDPR rights'}
          </p>
          <p style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.6 }}>
            {ui.gdprRightsBody || "Under UK GDPR you have the right to access, correct, and erase your data. Use the button below to delete all locally stored data at any time. To exercise rights over crash-report data held by Sentry, contact us at hello@newlifeuk.org. You also have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk."}
          </p>
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer"
            aria-label="ICO — make a complaint (opens in new tab)"
            style={{ display: 'inline-block', fontSize: '.8rem', color: 'var(--ac3)', textDecoration: 'underline', marginTop: 6 }}>
            {ui.gdprIco || 'ICO — make a complaint →'}
          </a>

          {/* ── Data controller ── */}
          <p style={{ fontWeight: 700, marginTop: 14, marginBottom: 4, fontSize: '.875rem' }}>
            {ui.privacyControllerTitle || '🏢 Data controller'}
          </p>
          <p style={{ fontSize: '.8rem', color: 'var(--t2)', lineHeight: 1.6 }}>
            {ui.privacyControllerBody || 'New Life UK · hello@newlifeuk.org · Open-source, non-commercial project.'}
          </p>

          {/* ── Full privacy policy ── */}
          <p style={{ marginTop: 14 }}>
            <a
              href="https://github.com/na7hanw/new-life-uk/blob/main/PRIVACY.md"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Full privacy policy (opens in new tab)"
              style={{ fontSize: '.8rem', color: 'var(--ac3)', textDecoration: 'underline' }}
            >
              {ui.privacyPolicyLink || '📄 Full privacy policy →'}
            </a>
          </p>

          {/* ── Clear all data ── */}
          <button
            className="btn btn-outline btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => {
              clearTranslationCache()
              ALL_KEYS.forEach(k => {
                try {
                  localStorage.removeItem(k)
                } catch (err) {
                  if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.warn(`[nluk] Failed to clear localStorage key "${k}":`, err)
                  }
                }
              })
              window.location.reload()
            }}
          >
            🗑 {ui.clearData || 'Clear all app data'}
          </button>
        </div>
      </div>

      <div className="version-badge" aria-label="App version and data verification date">
        🛡 v{import.meta.env.VITE_APP_VERSION || '2.2.0'} · Data verified March 2026
        {offlineReady && <span className="offline-badge" style={{ marginLeft: 8 }}>📴 Available Offline</span>}
      </div>

      <div className="footer-disc">
        <strong>Last verified: March 2026</strong><br />
        {ui.disclaimer}<br /><br />
        Built with care for people who need it most.<br />
        Found outdated info? Email{' '}
        <a href="mailto:hello@newlifeuk.org" style={{ color: 'var(--ac3)', textDecoration: 'underline' }}>
          hello@newlifeuk.org
        </a>
        <br /><br />
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--t2)', fontWeight: 700, fontSize: '.875rem', textDecoration: 'none' }}>
          <span>⭐</span> {ui.sourceCode || 'View Source on GitHub'}
        </a>
      </div>
      <div style={{ height: 12 }} />
    </div>
  )
}
