import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { APPS } from '../data/apps.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

// Fuse index built once at module load
const appsFuse = new Fuse(APPS, {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

export default function AppsPage() {
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()
  const [search, setSearch] = useState('')

  const filteredApps = useMemo(() =>
    search.trim() ? appsFuse.search(search).map(r => r.item) : APPS,
  [search])

  const searchPlaceholder = 'Search…'

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

      <div className="search-bar">
        <span style={{ color: 'var(--t3)' }}>🔍</span>
        <input
          className="search-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label={searchPlaceholder}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

      {filteredApps.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
          {ui.noResults}
        </div>
      )}
      {filteredApps.map(app => (
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
