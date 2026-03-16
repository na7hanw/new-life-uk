import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { GUIDES, GUIDE_PRIORITY, CATEGORIES, GUIDE_KEYWORDS } from '../data/guides.ts'
import { LANGS, TIPS } from '../data/ui-strings.ts'
import { t18 } from '../lib/utils.ts'

export default function GuidesPage() {
  const { lang, ui, dir, af } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [tipIdx, setTipIdx] = useState(0)
  const guideBtnRefs = useRef({})

  useEffect(() => {
    setTipIdx(Math.floor(Math.random() * TIPS.refugee.length))
    // Restore focus to the last guide the user navigated away from
    const last = sessionStorage.getItem('nluk_last_guide')
    if (last) {
      sessionStorage.removeItem('nluk_last_guide')
      requestAnimationFrame(() => { guideBtnRefs.current[last]?.focus() })
    }
  }, [])

  const tipList = TIPS.refugee
  const tip = tipList[tipIdx % tipList.length]

  // Fuse.js index — built once, searches title + summary + keyword aliases
  const fuseIndex = useMemo(() => new Fuse(
    GUIDES.map(g => ({ ...g, _kw: GUIDE_KEYWORDS[g.id] || [] })),
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

  const cats = useMemo(() => [...new Set(filtered.map(g => g.cat))], [filtered])

  return (
    <div className="page-enter">

      {/* Compact welcome — only when not searching */}
      {!search && catFilter === 'All' && (
        <>
          <div className="hero">
            <div className="hero-badge">🇬🇧 Free · Private · {LANGS.length} Languages · No account needed</div>
            <h2 className="hero-title">Welcome to<br />your new life. 🤝</h2>
            <p className="hero-sub">Step-by-step guides for everything you need in the UK. No tracking. No cost. Ever.</p>
          </div>

          <div className="notice">
            <p className="notice-text">⚠ BRPs expired December 2024. Your immigration status is now digital. Set up your eVisa at GOV.UK before travelling.</p>
          </div>

          {tip && <div className="tip-banner"><span className="tip-icon">💡</span><p className="tip-text">{tip}</p></div>}
        </>
      )}

      <div className="search-bar">
        <span style={{ color: 'var(--t3)' }}>🔍</span>
        <input className="search-input" placeholder={ui.search} value={search}
          onChange={e => setSearch(e.target.value)} dir={dir} aria-label={ui.search} />
        {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
      </div>
      <div className="chip-bar" role="tablist">
        {['All', ...Object.keys(CATEGORIES)].map(c => (
          <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`}
            onClick={() => setCatFilter(c)} role="tab" aria-selected={catFilter === c}>
            {c !== 'All' && CATEGORIES[c] ? `${CATEGORIES[c].emoji} ${c}` : c}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>{ui.noResults}</div>
      )}
      {cats.map(cat => (
        <div key={cat}>
          <div className="cat-header" style={{ color: CATEGORIES[cat]?.color }}>
            {CATEGORIES[cat]?.emoji} {cat}
          </div>
          <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
            {filtered.filter(g => g.cat === cat).map(g => {
              const gc = t18(g.content, lang)
              return (
                <button key={g.id} className="list-row"
                  ref={el => { guideBtnRefs.current[g.id] = el }}
                  onClick={() => { sessionStorage.setItem('nluk_last_guide', g.id); navigate(`/guide/${g.id}`) }}
                  aria-label={gc.title}>
                  <span className="list-row-icon">{g.icon}</span>
                  <div className="list-row-content">
                    <div className="list-row-title">{gc.title}</div>
                    <div className="list-row-sub">{gc.summary}</div>
                  </div>
                  <span className="list-row-arrow">{af}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
