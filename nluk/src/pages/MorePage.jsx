import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { GITHUB_URL } from '../data/emergency.js'

export default function MorePage() {
  const { lang: _lang, ui, L, dark, setDark, setShowLang } = useApp()
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOffline(true)).catch(() => {})
    }
  }, [])

  return (
    <div className="page-enter">
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
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: '.95rem' }}>
            {ui.privacyTitle || 'Your Privacy'}
          </p>
          <p style={{ fontSize: '.875rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: 10 }}>
            {ui.privacyBody || 'This app stores only your language, theme, and visa status in your device\'s local storage. No personal data is ever collected, transmitted, or shared. No analytics. No cookies. No servers. Fully GDPR compliant.'}
          </p>
          <p style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 4 }}>{ui.privacyLocal || 'Stored locally on your device only:'}</p>
          {[
            ['nluk_lang', 'Language preference'],
            ['nluk_dark', 'Dark/light mode'],
            ['nluk_wtab', 'Last work tab viewed'],
            ['nluk_stab', 'Last free stuff tab viewed'],
          ].map(([k, v]) => (
            <div key={k} style={{ fontSize: '.8rem', color: 'var(--t2)', padding: '2px 0' }}>
              <code style={{ background: 'var(--s2)', borderRadius: 4, padding: '1px 5px', marginRight: 6 }}>{k}</code>{v}
            </div>
          ))}
          <p style={{ fontSize: '.8rem', color: 'var(--gn)', fontWeight: 700, marginTop: 10 }}>
            ✅ {ui.privacyNone || 'Nothing ever sent to any server.'}
          </p>
          <p style={{ fontSize: '.8rem', color: 'var(--t3)', marginTop: 8, lineHeight: 1.55 }}>
            {ui.gdprRights || 'GDPR rights: right to access, rectify, erase. Clear your browser/app data at any time to remove all stored preferences.'}
          </p>
          <button
            className="btn btn-outline btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => {
              try {
                ['nluk_lang','nluk_dark','nluk_wtab','nluk_stab'].forEach(k => localStorage.removeItem(k))
                window.location.reload()
              } catch {}
            }}
          >
            🗑 Clear all app data
          </button>
        </div>
      </div>

      <div className="version-badge" aria-label="App version and data verification date">
        🛡 v2.2.0 · Data verified March 2026
        {offline && <span className="offline-badge" style={{ marginLeft: 8 }}>📴 Available Offline</span>}
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
