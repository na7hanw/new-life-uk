import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { SAVES } from '../data/saves.js'
import { t18 } from '../lib/utils.js'
import { translateContentObject } from '../lib/translate.js'

function SaveCard({ save, lang, ui }) {
  const native = t18(save.content, lang)
  const needsTranslation = lang !== 'en' && !save.content[lang]

  const [content, setContent] = useState(native)
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!needsTranslation) { setContent(native); setWasTranslated(false); return }
    let cancelled = false
    setTranslating(true)
    setContent(native) // show English while translating
    translateContentObject(native, lang).then(translated => {
      if (!cancelled) { setContent(translated); setTranslating(false); setWasTranslated(true) }
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, save])

  return (
    <div className={`content-card${translating ? ' translating' : ''}`}>
      <div className="content-card-header">
        <span className="content-card-icon">{save.icon}</span>
        <span className="content-card-title">{content.title}</span>
      </div>
      <p className="content-card-body">{content.desc}</p>
      {wasTranslated && <span className="auto-translated-badge">{ui.autoTranslated}</span>}
      {save.url && (
        <a href={save.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
          🔗 <span>{ui.openLink}</span> →
        </a>
      )}
    </div>
  )
}

export default function SavesPage() {
  const { lang, ui } = useApp()

  return (
    <div className="page-enter">
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.savesTitle}</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.savesSub}</p>
      </div>
      {SAVES.map(s => (
        <SaveCard key={s.content.en.title} save={s} lang={lang} ui={ui} />
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
