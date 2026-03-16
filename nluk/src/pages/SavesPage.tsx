import { useApp } from '../context/AppContext.tsx'
import { SAVES } from '../data/saves.ts'
import { t18 } from '../lib/utils.ts'

export default function SavesPage() {
  const { lang, ui } = useApp()

  return (
    <div className="page-enter">
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.savesTitle}</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.savesSub}</p>
      </div>
      {SAVES.map(s => {
        const sc = t18(s.content, lang)
        return (
          <div key={sc.title} className="content-card">
            <div className="content-card-header">
              <span className="content-card-icon">{s.icon}</span>
              <span className="content-card-title">{sc.title}</span>
            </div>
            <p className="content-card-body">{sc.desc}</p>
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
                🔗 <span>{ui.openLink}</span> →
              </a>
            )}
          </div>
        )
      })}
      <div style={{ height: 8 }} />
    </div>
  )
}
