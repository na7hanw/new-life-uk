import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import { APPS } from '../data/apps.ts'
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

// Group SAVES by category (preserve insertion order within each category)
const SAVES_BY_CAT = SAVES.reduce<Record<string, typeof SAVES>>((acc, s) => {
  const cat = s.cat || 'Other'
  if (!acc[cat]) acc[cat] = []
  acc[cat].push(s)
  return acc
}, {})
const SAVE_CATS = Object.keys(SAVES_BY_CAT)

// Fuse indices built once at module load — content is immutable
const freeGemsFuse = new Fuse([...SAVES, ...GEMS], {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

const appsFuse = new Fuse(APPS, {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

type SubTab = 'free' | 'gems' | 'apps'

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [search, setSearch] = useState('')
  const [subtab, setSubtab] = useState<SubTab>('free')

  const handleSubtab = (id: SubTab) => {
    setSubtab(id)
    setSearch('')
  }

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    if (subtab === 'apps') return appsFuse.search(search).map(r => r.item)
    return freeGemsFuse.search(search).map(r => r.item)
  }, [search, subtab])

  return (
    <div className="page-enter">

      {/* Sub-tab navigation — mirrors the Work page pattern */}
      <div className="sub-tabs" role="tablist">
        {([
          { id: 'free'  as SubTab, emoji: '🆓', label: ui.savesTab  || 'Free Stuff' },
          { id: 'gems'  as SubTab, emoji: '💎', label: ui.gemsTitle || 'Gems' },
          { id: 'apps'  as SubTab, emoji: '📲', label: ui.appsTitle || 'Apps' },
        ]).map(t => (
          <button key={t.id} className={`sub-tab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => handleSubtab(t.id)} role="tab" aria-selected={subtab === t.id}>
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} strokeWidth={2} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

      {search.trim() ? (
        /* ── Search results (across active tab's content) ── */
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
              badge={'cat' in s ? (s.cat as string | undefined) : undefined}
            />
          ))}
        </>
      ) : (
        <>
          {/* ── FREE STUFF tab ── */}
          {subtab === 'free' && (
            <>
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
            </>
          )}

          {/* ── GEMS tab ── */}
          {subtab === 'gems' && (
            <>
              <p className="section-sub" style={{ paddingTop: 12 }}>{ui.gemsSub}</p>
              {GEMS.map(g => (
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

          {/* ── APPS tab ── */}
          {subtab === 'apps' && (
            <>
              <p className="section-sub" style={{ paddingTop: 12 }}>
                {ui.appsSub || 'Free must-have apps and services for life in the UK.'}
              </p>
              {APPS.map(app => (
                <ResourceCard
                  key={app.content.en.title}
                  icon={app.icon}
                  content={app.content as Record<string, ResourceContent>}
                  url={app.url}
                  lang={lang}
                  ui={ui}
                  badge={app.cat}
                />
              ))}
            </>
          )}
        </>
      )}
      <div style={{ height: 8 }} />
    </div>
  )
}
