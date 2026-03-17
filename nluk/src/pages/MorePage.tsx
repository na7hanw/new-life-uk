import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { GEMS } from '../data/saves.ts'
import { GITHUB_URL } from '../data/emergency.ts'
import { ls, lsSet } from '../lib/utils.ts'
import { clearTranslationCache } from '../lib/translate.ts'
import { SENTRY_DSN, initSentry } from '../lib/sentry.ts'
import { CONSENT_KEY } from '../components/ConsentBanner.tsx'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

const ALL_KEYS = ['nluk_lang', 'nluk_dark', 'nluk_wtab', 'nluk_tx3', CONSENT_KEY]

export default function MorePage() {
  const { lang, ui, L, dark, setDark, setShowLang } = useApp()
  const [offlineReady, setOfflineReady] = useState(false)
  const [consent, setConsent] = useState(() => ls(CONSENT_KEY, ''))

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOfflineReady(true)).catch(() => {})
    }
  }, [])

  const toggleConsent = () => {
    const next = consent === 'granted' ? 'denied' : 'granted'
    lsSet(CONSENT_KEY, next)
    setConsent(next)
    if (next === 'granted') initSentry()
  }

  return (
    <div className="page-enter">
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.gemsTitle}</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.gemsSub}</p>
      </div>
      {GEMS.map(g => (
        <ResourceCard
          key={g.content.en.title}
          icon={g.icon}
          content={g.content as Record<string, ResourceContent>}
          url={g.url}
          lang={lang}
          ui={ui}
        />
      ))}

      <div className="section-label">{ui.theme}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setDark(!dark)}>
            {dark ? ui.lightMode : ui.darkMode}
          </button>
        </div>
      </div>

      <div className="section-label">{ui.language}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>{L.flag} {L.native}</span>
          <button className="btn btn-outline btn-sm" onClick={() => setShowLang(true)}>{ui.change}</button>
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
              ['nluk_lang',  ui.privacyKeyLang    || 'Language preference'],
              ['nluk_dark',  ui.privacyKeyTheme   || 'Dark / light mode'],
              ['nluk_wtab',  ui.privacyKeyTab     || 'Last work tab viewed'],
              ['nluk_tx3',   'Cached translations (auto-translate)'],
              [CONSENT_KEY,  ui.privacyKeyConsent || 'Your crash-report consent choice'],
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
