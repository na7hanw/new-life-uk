import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

// Fuse index built once at module load
const savesFuse = new Fuse([...SAVES, ...GEMS], {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [search, setSearch] = useState('')

  const searchResults = useMemo(() =>
    search.trim() ? savesFuse.search(search).map(r => r.item) : [],
  [search])

  const filteredSaves = useMemo(() =>
    search.trim() ? [] : SAVES,
  [search])

  const filteredGems = useMemo(() =>
    search.trim() ? [] : GEMS,
  [search])

  const searchPlaceholder = 'Search…'

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.savesTitle}</h2>
        <p className="page-hero-sub">{ui.savesSub}</p>
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

      {search.trim() ? (
        <>
          {searchResults.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
              {ui.noResults}
            </div>
          )}
          {searchResults.map(s => (
            <ResourceCard
              key={s.content.en.title}
              icon={s.icon}
              content={s.content as Record<string, ResourceContent>}
              url={s.url}
              lang={lang}
              ui={ui}
            />
          ))}
        </>
      ) : (
        <>
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
          {filteredSaves.map(s => (
            <ResourceCard
              key={s.content.en.title}
              icon={s.icon}
              content={s.content as Record<string, ResourceContent>}
              url={s.url}
              lang={lang}
              ui={ui}
            />
          ))}
          <div className="section-label">{ui.gemsTitle}</div>
          <p className="section-sub">{ui.gemsSub}</p>
          {filteredGems.map(g => (
            <ResourceCard
              key={g.content.en.title}
              icon={g.icon}
              content={g.content as Record<string, ResourceContent>}
              url={g.url}
              lang={lang}
              ui={ui}
            />
          ))}
        </>
      )}
      <div style={{ height: 8 }} />
    </div>
  )
}
