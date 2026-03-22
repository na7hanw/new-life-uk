import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useApp } from '../context/AppContext.tsx'
import { GUIDES, GUIDE_PRIORITY, GUIDE_MAP, CATEGORIES, GUIDE_KEYWORDS } from '../data/guides.ts'
import { getTrendingGuideIds } from '../lib/search.ts'
import { useRouteTranslation, type RouteString } from '../lib/useRouteTranslation.ts'
import EmptyState from '../components/EmptyState.tsx'
import styles from './GuidesPage.module.css'

// Guides to pin in the "For You" section per status
const STATUS_GUIDES: Record<string, string[]> = {
  'asylum-seeker': ['re-qualify', 'permission-to-work', 'volunteering', 'asylum-waiting'],
  'refugee':       ['move-on', 'uc', 'housing-help'],
  'other-visa':    ['work-rights', 'evisa', 'sharecode'],
  'settled':       ['ilr', 'evisa', 'sharecode'],
}

// Enrich guides with keyword aliases once at module load (not on every component mount).
const GUIDES_WITH_KW = GUIDES.map(g => ({ ...g, _kw: GUIDE_KEYWORDS[g.id] || [] }))

// Pre-build route strings for all guide titles and summaries (stable module-scope reference).
const GUIDE_ROUTE_STRINGS: RouteString[] = GUIDES.flatMap(g => [
  { key: `${g.id}:title`,   text: g.content.en.title },
  { key: `${g.id}:summary`, text: g.content.en.summary },
])

export default function GuidesPage() {
  const { lang, ui, dir, af, userStatus, bookmarks, toggleBookmark } = useApp()
  const navigate = useNavigate()
  const { t: routeT, isReady: routeReady } = useRouteTranslation('guides', GUIDE_ROUTE_STRINGS, lang)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [catFilter, setCatFilter] = useState('All')
  const guideBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    // Restore focus to the last guide the user navigated away from
    const last = sessionStorage.getItem('nluk_last_guide')
    if (last) {
      sessionStorage.removeItem('nluk_last_guide')
      requestAnimationFrame(() => { guideBtnRefs.current[last]?.focus() })
    }
  }, [])

  // Fuse.js index — built once using pre-enriched data
  const fuseIndex = useMemo(() => new Fuse(
    GUIDES_WITH_KW,
    {
      keys: [
        { name: 'content.en.title',   weight: 3 },
        { name: 'content.en.summary', weight: 1 },
        { name: '_kw',                weight: 2 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }
  ), [])

  const filtered = useMemo(() => {
    let list
    if (search.trim()) {
      list = fuseIndex.search(search).map(r => r.item)
    } else {
      list = [...GUIDES].sort((a, b) => {
        const ia = GUIDE_PRIORITY.indexOf(a.id)
        const ib = GUIDE_PRIORITY.indexOf(b.id)
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
      })
    }
    if (catFilter !== 'All') list = list.filter(g => g.cat === catFilter)
    return list
  }, [search, catFilter, fuseIndex])

  // Animate category sections as filter changes
  const [catListRef] = useAutoAnimate<HTMLDivElement>({ duration: 200 })

  // Group guides by category in a single O(n) pass, preserving insertion order for cats.
  const { cats, groupedByCat } = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    const orderedCats: string[] = []
    for (const g of filtered) {
      if (!groups[g.cat]) {
        groups[g.cat] = []
        orderedCats.push(g.cat)
      }
      groups[g.cat].push(g)
    }
    return { cats: orderedCats, groupedByCat: groups }
  }, [filtered])

  return (
    <div className="page-enter">

      {/* ── Hero — visible when no search is active ── */}
      {!search && (
        <div className={styles.hero}>
          <div className={styles.heroBadge}>{ui.heroBadge || '🇬🇧 Free · Private · No account needed'}</div>
          {userStatus ? (
            <p className={styles.heroSub}>
              {userStatus === 'asylum-seeker' && '⏳ Showing guides for asylum seekers. Go to Me → change status anytime.'}
              {userStatus === 'refugee'       && '✅ Guides prioritised for newly recognised refugees.'}
              {userStatus === 'other-visa'    && '🛂 Guides prioritised for your visa type.'}
              {userStatus === 'settled'       && '🇬🇧 Guides for settled and pre-settled residents.'}
            </p>
          ) : (
            <p className={styles.heroSub}>{ui.heroSub || 'Step-by-step guides for everything you need in the UK.'}</p>
          )}
        </div>
      )}

      <div className="search-bar">
        <Search size={18} strokeWidth={2} className={styles.searchIcon} />
        <input className="search-input" placeholder={ui.search} value={search}
          onChange={e => setSearch(e.target.value)} dir={dir} aria-label={ui.search}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)} />
        {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
      </div>

      {/* Search zero-state: show trending guides when focused but no query typed */}
      {search === '' && searchFocused && (() => {
        const trending = getTrendingGuideIds(4)
        if (trending.length === 0) return null
        return (
          <div style={{ padding: '0 16px 12px' }}>
            <div className="section-label" style={{ padding: '10px 0 8px 0', margin: 0, border: 'none' }}>
              🔥 {ui.trending || 'Trending'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {trending.map(id => {
                const g = GUIDE_MAP[id]
                if (!g) return null
                return (
                  <button key={id} className="chip"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => navigate(`/guide/${id}`)}>
                    {g.icon} {routeT(`${id}:title`)}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Aria-live region announces search result count to screen readers */}
      <span
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {search.trim() ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} found` : ''}
      </span>

      <div className="chip-bar" role="tablist">
        {['All', ...Object.keys(CATEGORIES)].map(c => (
          <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`}
            onClick={() => setCatFilter(c)} role="tab" aria-selected={catFilter === c}>
            {c !== 'All' && CATEGORIES[c] ? `${CATEGORIES[c].emoji} ${c}` : c}
          </button>
        ))}
      </div>

      {!routeReady && lang !== 'en' && (
        <div className="translating-row" role="status">
          <span className="translating-spinner" />
          <span>{ui.translating || 'Translating…'}</span>
        </div>
      )}

      {filtered.length === 0 && (
        <EmptyState message={ui.noResults} />
      )}

      {/* For You — pinned guides for this status, shown when not searching and viewing all categories */}
      {!search && catFilter === 'All' && userStatus && STATUS_GUIDES[userStatus] && (
        <div>
          <div className={`cat-header ${styles.forYouHeader}`}>⭐ {ui.forYou}</div>
          <div className={`card card-flush ${styles.cardGutter}`}
               style={{ border: '2px solid var(--ac)', backgroundColor: 'var(--ac2)' }}>
            {STATUS_GUIDES[userStatus]
              .map(id => GUIDE_MAP[id])
              .filter(Boolean)
              .map(g => {
                return (
                  <div key={g.id} className="list-row-wrap">
                    <button className="list-row list-row-main"
                      ref={el => { guideBtnRefs.current[g.id] = el }}
                      onClick={() => { sessionStorage.setItem('nluk_last_guide', g.id); navigate(`/guide/${g.id}`) }}
                      aria-label={routeT(`${g.id}:title`)}>
                      <span className="list-row-icon">{g.icon}</span>
                      <div className="list-row-content">
                        <div className="list-row-title">{routeT(`${g.id}:title`)}</div>
                        <div className="list-row-sub">{routeT(`${g.id}:summary`)}</div>
                      </div>
                      <span className="list-row-arrow">{af}</span>
                    </button>
                    <button
                      className={`bookmark-btn${bookmarks.includes(g.id) ? ' active' : ''}`}
                      onClick={() => {
                        navigator?.vibrate?.(10)
                        const adding = !bookmarks.includes(g.id)
                        toggleBookmark(g.id)
                        adding ? toast.success(ui.bookmark || 'Guide saved') : toast(ui.unbookmark || 'Guide removed')
                      }}
                      aria-label={bookmarks.includes(g.id) ? (ui.unbookmark || 'Remove saved') : (ui.bookmark || 'Save guide')}
                      aria-pressed={bookmarks.includes(g.id)}
                    >
                      <Bookmark size={20} strokeWidth={2} fill={bookmarks.includes(g.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Saved Guides — shown when the user has bookmarks */}
      {bookmarks.length > 0 && !search && catFilter === 'All' && (
        <div>
          <div className={`cat-header ${styles.savedHeader}`}>⭐ Saved Guides</div>
          <div className={`card card-flush ${styles.cardGutter}`}>
            {bookmarks
              .map(id => GUIDE_MAP[id])
              .filter(Boolean)
              .map(g => {
                return (
                  <div key={g.id} className="list-row-wrap">
                    <button className="list-row list-row-main"
                      ref={el => { guideBtnRefs.current[g.id] = el }}
                      onClick={() => { sessionStorage.setItem('nluk_last_guide', g.id); navigate(`/guide/${g.id}`) }}
                      aria-label={routeT(`${g.id}:title`)}>
                      <span className="list-row-icon">{g.icon}</span>
                      <div className="list-row-content">
                        <div className="list-row-title">{routeT(`${g.id}:title`)}</div>
                        <div className="list-row-sub">{routeT(`${g.id}:summary`)}</div>
                      </div>
                      <span className="list-row-arrow">{af}</span>
                    </button>
                    <button
                      className={`bookmark-btn active`}
                      onClick={() => {
                        navigator?.vibrate?.(10)
                        const adding = !bookmarks.includes(g.id)
                        toggleBookmark(g.id)
                        adding ? toast.success(ui.bookmark || 'Guide saved') : toast(ui.unbookmark || 'Guide removed')
                      }}
                      aria-label={ui.unbookmark || 'Remove saved'}
                      aria-pressed={true}
                    >
                      <Bookmark size={20} strokeWidth={2} fill="currentColor" />
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      <div style={{ height: 6 }} />
      <div ref={catListRef}>
      {cats.map(cat => (
        <div key={cat} className={styles.catSection}>
          <div className="cat-header" style={{ color: CATEGORIES[cat]?.color }}>
            {CATEGORIES[cat]?.emoji} {cat}
          </div>
          <div className={`card card-flush ${styles.cardGutter}`}>
            {groupedByCat[cat].map(g => {
              return (
                <div key={g.id} className="list-row-wrap">
                  <button className="list-row list-row-main"
                    ref={el => { guideBtnRefs.current[g.id] = el }}
                    onClick={() => { sessionStorage.setItem('nluk_last_guide', g.id); navigate(`/guide/${g.id}`) }}
                    aria-label={routeT(`${g.id}:title`)}>
                    <span className="list-row-icon">{g.icon}</span>
                    <div className="list-row-content">
                      <div className="list-row-title">{routeT(`${g.id}:title`)}</div>
                      <div className="list-row-sub">{routeT(`${g.id}:summary`)}</div>
                    </div>
                    <span className="list-row-arrow">{af}</span>
                  </button>
                  <button
                    className={`bookmark-btn${bookmarks.includes(g.id) ? ' active' : ''}`}
                    onClick={() => {
                        navigator?.vibrate?.(10)
                        const adding = !bookmarks.includes(g.id)
                        toggleBookmark(g.id)
                        adding ? toast.success(ui.bookmark || 'Guide saved') : toast(ui.unbookmark || 'Guide removed')
                      }}
                    aria-label={bookmarks.includes(g.id) ? (ui.unbookmark || 'Remove saved') : (ui.bookmark || 'Save guide')}
                    aria-pressed={bookmarks.includes(g.id)}
                  >
                    <Bookmark size={20} strokeWidth={2} fill={bookmarks.includes(g.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      </div>
      <div className={styles.spacer} />
    </div>
  )
}
