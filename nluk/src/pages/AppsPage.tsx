import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'
import { APPS } from '../data/apps.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

export default function AppsPage() {
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  return (
    <article className="detail-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/saves')}>{ab} {ui.back}</button>
        <div className="detail-hero" style={{ paddingTop: 14 }}>
          <span className="detail-icon">📲</span>
          <div>
            <h2 className="detail-title">{ui.appsTitle || 'Essential Apps & Services'}</h2>
            <p className="detail-summary">{ui.appsSub || 'Free must-have apps and services for life in the UK.'}</p>
          </div>
        </div>
      </div>
      {APPS.map(app => (
        <ResourceCard
          key={app.content.en.title}
          icon={app.icon}
          content={app.content as Record<string, ResourceContent>}
          url={app.url}
          lang={lang}
          ui={ui}
        />
      ))}
      <div style={{ height: 16 }} />
    </article>
  )
}
