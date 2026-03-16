import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { SAVES } from '../data/saves.ts'
import { t18 } from '../lib/utils.ts'
import { translateContentObject } from '../lib/translate.ts'
import type { UiStrings } from '../types'

interface SaveContent {
  title: string
  desc: string
  [key: string]: unknown
}

interface SaveItem {
  icon: string
  content: Record<string, SaveContent>
  url?: string
}

function SaveCard({ save, lang, ui }: { save: SaveItem; lang: string; ui: UiStrings }) {
  const native = t18(save.content, lang) as SaveContent
  const needsTranslation = lang !== 'en' && !save.content[lang]
  const saveId = save.content.en.title

  const [content, setContent] = useState<SaveContent>(native)
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!needsTranslation) { setContent(native); setWasTranslated(false); return }
    let cancelled = false
    setTranslating(true)
    setContent(native) // show English while translating
    translateContentObject(native, lang).then(translated => {
      if (!cancelled) { setContent(translated as SaveContent); setTranslating(false); setWasTranslated(true) }
    })
    return () => { cancelled = true }
  // saveId is the stable identifier; native is derived from lang+save so not needed separately
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, saveId])

  return (
    <div className={`content-card${translating ? ' translating' : ''}`}>
      <div className="content-card-header">
        <span className="content-card-icon">{save.icon}</span>
        <span className="content-card-title">{content.title}</span>
      </div>
      <p className="content-card-body">{content.desc}</p>
      {wasTranslated && <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>}
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
        <SaveCard key={(s.content.en as SaveContent).title} save={s as unknown as SaveItem} lang={lang} ui={ui} />
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
