import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import EmptyState from '../components/EmptyState.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

// ── Category display config for grouped SAVES ──
const SAVE_CATEGORY_META: Record<string, { emoji: string }> = {
  'Connectivity': { emoji: '📱' },
  'Health':       { emoji: '💊' },
  'Transport':    { emoji: '🚌' },
  'Money':        { emoji: '💷' },
  'Family':       { emoji: '👶' },
  'Food':         { emoji: '🍽' },
  'Culture':      { emoji: '🏛' },
  'Education':    { emoji: '📚' },
}

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

// Group SAVES by category (preserve insertion order within each category)
const SAVES_BY_CAT = SAVES.reduce<Record<string, typeof SAVES>>((acc, s) => {
  const cat = s.cat || 'Other'
  if (!acc[cat]) acc[cat] = []
  acc[cat].push(s)
  return acc
}, {})
const SAVE_CATS = Object.keys(SAVES_BY_CAT)

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [search, setSearch] = useState('')

  const searchResults = useMemo(() =>
    search.trim() ? savesFuse.search(search).map(r => r.item) : [],
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
        <Search size={18} strokeWidth={2} className="search-icon" />
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
          {searchResults.length === 0 && <EmptyState message={ui.noResults} />}
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
          {/* Essential Apps card — distinct visual (S1) */}
          <Link to="/saves/apps" className="content-card" style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            borderLeft: '4px solid var(--ac)',
          }}>
            <div className="content-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="content-card-icon">📲</span>
                <span className="content-card-title">{ui.appsTitle || 'Essential Apps & Services'}</span>
              </div>
              <ChevronRight size={20} strokeWidth={2.5} style={{ color: 'var(--ac3)', flexShrink: 0 }} />
            </div>
            <p className="content-card-body">{ui.appsSub || 'Free must-have apps for life in the UK.'}</p>
          </Link>

          {/* SAVES grouped by category (S2) */}
          {SAVE_CATS.map(cat => (
            <div key={cat}>
              <div className="section-label">
                {SAVE_CATEGORY_META[cat]?.emoji} {cat}
              </div>
              {SAVES_BY_CAT[cat].map(s => (
                <ResourceCard
                  key={s.content.en.title}
                  icon={s.icon}
                  content={s.content as Record<string, ResourceContent>}
                  url={s.url}
                  lang={lang}
                  ui={ui}
                />
              ))}
            </div>
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
