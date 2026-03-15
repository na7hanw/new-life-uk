import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { GEMS } from '../data/saves.js'
import { GITHUB_URL } from '../data/emergency.js'
import { t18 } from '../lib/utils.js'
import { translateContentObject, clearTranslationCache } from '../lib/translate.js'

function GemCard({ gem, lang, ui }) {
  const native = t18(gem.content, lang)
  const needsTranslation = lang !== 'en' && !gem.content[lang]
  const gemId = gem.content.en.title

  const [content, setContent] = useState(native)
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!needsTranslation) { setContent(native); setWasTranslated(false); return }
    let cancelled = false
    setTranslating(true)
    setContent(native)
    translateContentObject(native, lang).then(translated => {
      if (!cancelled) { setContent(translated); setTranslating(false); setWasTranslated(true) }
    })
    return () => { cancelled = true }
  // gemId is the stable identifier for the gem item; native is derived from lang+gem so not needed separately
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, gemId])

  return (
    <div className={`content-card${translating ? ' translating' : ''}`}>
      <div className="content-card-header">
        <span className="content-card-icon">{gem.icon}</span>
        <span className="content-card-title">{content.title}</span>
      </div>
      <p className="content-card-body">{content.desc}</p>
      {wasTranslated && <span className="auto-translated-badge">{ui.autoTranslated}</span>}
      {gem.url && (
        <a href={gem.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
          🔗 <span>{ui.openLink}</span> →
        </a>
      )}
    </div>
  )
}

export default function MorePage() {
  const { lang, ui, L, dark, setDark, setShowLang } = useApp()
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOffline(true)).catch(() => {})
    }
  }, [])

  return (
    <div className="page-enter">
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.gemsTitle}</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.gemsSub}</p>
      </div>
      {GEMS.map(g => (
        <GemCard key={g.content.en.title} gem={g} lang={lang} ui={ui} />
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
            ['nluk_tx3',  'Cached translations (auto-translate)'],
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
                ['nluk_lang','nluk_dark','nluk_wtab'].forEach(k => localStorage.removeItem(k))
                clearTranslationCache()
                window.location.reload()
              } catch {}
            }}
          >
            🗑 Clear all app data
          </button>
        </div>
      </div>

      <div className="version-badge" aria-label="App version and data verification date">
        🛡 v2.3.0 · Data verified March 2026
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
