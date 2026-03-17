import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'
import { SAVES } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

export default function SavesPage() {
  const { lang, ui } = useApp()

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.savesTitle}</h2>
        <p className="page-hero-sub">{ui.savesSub}</p>
      </div>
      <Link to="/saves/apps" className="content-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div className="content-card-header">
          <span className="content-card-icon">📲</span>
          <span className="content-card-title">{ui.appsTitle || 'Essential Apps & Services'}</span>
        </div>
        <p className="content-card-body">{ui.appsSub || 'Free must-have apps for life in the UK.'}</p>
        <span style={{ color: 'var(--ac3)', marginTop: 8, display: 'block', fontWeight: 700, fontSize: '.875rem' }}>
          {ui.openLink ? `${ui.openLink} →` : 'View all →'}
        </span>
      </Link>
      {SAVES.map(s => (
        <ResourceCard
          key={s.content.en.title}
          icon={s.icon}
          content={s.content as Record<string, ResourceContent>}
          url={s.url}
          lang={lang}
          ui={ui}
        />
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
