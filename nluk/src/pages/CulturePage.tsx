import { useApp } from '../context/AppContext.tsx'
import { CULTURE } from '../data/culture.ts'

export default function CulturePage() {
  const { ui } = useApp()

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.cultureTitle || '🇬🇧 UK Culture & Oddities'}</h2>
        <p className="page-hero-sub">{ui.cultureSub || 'Unwritten rules, polite lies, and peculiar customs of British life.'}</p>
      </div>
      {CULTURE.map(section => (
        <div key={section.id}>
          <div className="section-label">{section.emoji} {section.heading}</div>
          {section.items.map(item => (
            <div key={item.title} className="content-card">
              <div className="content-card-header">
                <span className="content-card-icon">{item.emoji}</span>
                <span className="content-card-title">{item.title}</span>
              </div>
              <p className="content-card-body">{item.body}</p>
            </div>
          ))}
        </div>
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
