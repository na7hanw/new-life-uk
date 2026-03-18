import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import EmptyState from '../components/EmptyState.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'
import styles from './SavesPage.module.css'

// ── Category display config for SAVES ──
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

// ── Category display config for GEMS ──
const GEMS_CATEGORY_META: Record<string, { emoji: string }> = {
  'Employment': { emoji: '💼' },
  'Education':  { emoji: '🎓' },
  'Money':      { emoji: '💷' },
  'Legal':      { emoji: '⚖️' },
  'Housing':    { emoji: '🏠' },
  'Documents':  { emoji: '🪪' },
  'Support':    { emoji: '🤝' },
}

// Fuse indexes built once at module load
const savesFuse = new Fuse(SAVES, {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

const gemsFuse = new Fuse(GEMS, {
  keys: [
    { name: 'content.en.title', weight: 3 },
    { name: 'content.en.desc', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

// Group items by category
function groupByCat<T extends { cat?: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const cat = item.cat || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
}

const SAVES_BY_CAT = groupByCat(SAVES)
const GEMS_BY_CAT  = groupByCat(GEMS)

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [activeTab, setActiveTab] = useState<'free' | 'gems'>('free')
  const [search, setSearch] = useState('')

  // Track which accordion sections are open (default: all open)
  const [openCats, setOpenCats] = useState<Set<string>>(() => {
    const all = new Set<string>()
    Object.keys(SAVES_BY_CAT).forEach(c => all.add(`free:${c}`))
    all.add('free:apps')
    Object.keys(GEMS_BY_CAT).forEach(c => all.add(`gems:${c}`))
    return all
  })

  const toggleCat = (key: string) => {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Reset search when switching tabs
  const handleTab = (tab: 'free' | 'gems') => {
    setActiveTab(tab)
    setSearch('')
  }

  const savesResults = useMemo(() =>
    search.trim() ? savesFuse.search(search).map(r => r.item) : [],
  [search])

  const gemsResults = useMemo(() =>
    search.trim() ? gemsFuse.search(search).map(r => r.item) : [],
  [search])

  const searchPlaceholder = ui.searchDiscover || 'Search resources…'

  const tabs = [
    { id: 'free' as const, label: ui.discoverFreeTab || '🆓 Free Resources' },
    { id: 'gems' as const, label: ui.discoverGemsTab || '💎 Hidden Gems' },
  ]

  return (
    <div className="page-enter">
      {/* Sub-tabs */}
      <div className="sub-tabs" role="tablist">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`sub-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTab(t.id)}
            role="tab"
            aria-selected={activeTab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <Search size={18} strokeWidth={2} className={styles.searchIcon} />
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

      {/* ─── FREE RESOURCES TAB ─── */}
      {activeTab === 'free' && (
        search.trim() ? (
          <>
            {savesResults.length === 0 && <EmptyState message={ui.noResults} />}
            {savesResults.map(s => (
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
            {/* Essential Apps accordion section */}
            <div>
              <button
                className={`section-label ${styles.accordionTrigger}`}
                onClick={() => toggleCat('free:apps')}
                aria-expanded={openCats.has('free:apps')}
              >
                <span>📲 {ui.appsTitle || 'Essential Apps & Services'}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={`${styles.chevron}${openCats.has('free:apps') ? ` ${styles.chevronOpen}` : ''}`}
                />
              </button>
              {openCats.has('free:apps') && (
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
                  <p className="content-card-body">{ui.appsSub || 'Free must-have apps and services for life in the UK.'}</p>
                </Link>
              )}
            </div>

            {/* SAVES grouped by category with accordion */}
            {Object.keys(SAVES_BY_CAT).map(cat => {
              const meta = SAVE_CATEGORY_META[cat]
              const key = `free:${cat}`
              const isOpen = openCats.has(key)
              return (
                <div key={cat}>
                  <button
                    className={`section-label ${styles.accordionTrigger}`}
                    onClick={() => toggleCat(key)}
                    aria-expanded={isOpen}
                  >
                    <span>{meta?.emoji} {cat}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2.5}
                      className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
                    />
                  </button>
                  {isOpen && SAVES_BY_CAT[cat].map(s => (
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
              )
            })}
          </>
        )
      )}

      {/* ─── HIDDEN GEMS TAB ─── */}
      {activeTab === 'gems' && (
        search.trim() ? (
          <>
            {gemsResults.length === 0 && <EmptyState message={ui.noResults} />}
            {gemsResults.map(g => (
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
        ) : (
          <>
            {Object.keys(GEMS_BY_CAT).map(cat => {
              const meta = GEMS_CATEGORY_META[cat]
              const key = `gems:${cat}`
              const isOpen = openCats.has(key)
              return (
                <div key={cat}>
                  <button
                    className={`section-label ${styles.accordionTrigger}`}
                    onClick={() => toggleCat(key)}
                    aria-expanded={isOpen}
                  >
                    <span>{meta?.emoji} {cat}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2.5}
                      className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
                    />
                  </button>
                  {isOpen && GEMS_BY_CAT[cat].map(g => (
                    <ResourceCard
                      key={g.content.en.title}
                      icon={g.icon}
                      content={g.content as Record<string, ResourceContent>}
                      url={g.url}
                      lang={lang}
                      ui={ui}
                    />
                  ))}
                </div>
              )
            })}
          </>
        )
      )}

      <div className={styles.spacer} />
    </div>
  )
}
