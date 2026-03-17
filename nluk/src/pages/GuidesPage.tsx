import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { GUIDES, GUIDE_PRIORITY, GUIDE_MAP, CATEGORIES, GUIDE_KEYWORDS } from '../data/guides.ts'
import { LANGS, TIPS } from '../data/ui-strings.ts'
import { t18 } from '../lib/utils.ts'
import { translate } from '../lib/translate.ts'
import type { UserStatus } from '../types'
import styles from './GuidesPage.module.css'

// Guides to pin in the "For You" section per status
const STATUS_GUIDES: Record<string, string[]> = {
  'asylum-seeker': ['permission-to-work', 'volunteering', 'asylum-waiting'],
  'refugee':       ['move-on', 'uc', 'housing-help'],
  'other-visa':    ['work-rights', 'evisa', 'sharecode'],
  'settled':       ['ilr', 'evisa', 'sharecode'],
}

// Map user status to the appropriate tips array key
function tipsKeyForStatus(s: UserStatus): keyof typeof TIPS {
  if (s === 'asylum-seeker') return 'asylum'
  if (s === 'refugee')       return 'refugee'
  if (s === 'settled')       return 'eu'
  if (s === 'other-visa')    return 'other'
  return 'refugee' // default
}

// Enrich guides with keyword aliases once at module load (not on every component mount).
const GUIDES_WITH_KW = GUIDES.map(g => ({ ...g, _kw: GUIDE_KEYWORDS[g.id] || [] }))

export default function GuidesPage() {
  const { lang, ui, dir, af, userStatus, setUserStatus } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [tipIdx, setTipIdx] = useState(0)
  const [translatedTip, setTranslatedTip] = useState('')
  const [statusPickerDismissed, setStatusPickerDismissed] = useState(false)
  const guideBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    setTipIdx(Math.floor(Math.random() * TIPS.refugee.length))
    // Restore focus to the last guide the user navigated away from
    const last = sessionStorage.getItem('nluk_last_guide')
    if (last) {
      sessionStorage.removeItem('nluk_last_guide')
      requestAnimationFrame(() => { guideBtnRefs.current[last]?.focus() })
    }
  }, [])

  const tipList = TIPS[tipsKeyForStatus(userStatus)]
  const tipEn = tipList[tipIdx % tipList.length]

  // Auto-translate the tip when language changes
  useEffect(() => {
    if (!tipEn) return
    setTranslatedTip(tipEn)
    if (lang === 'en') return
    let cancelled = false
    translate(tipEn, lang).then(t => { if (!cancelled) setTranslatedTip(t) })
    return () => { cancelled = true }
  }, [tipEn, lang])

  const tip = translatedTip || tipEn

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

      {/* Compact welcome — only when not searching */}
      {!search && catFilter === 'All' && (
        <>
          <div className="hero">
            <div className="hero-badge">{ui.heroBadge ? `${ui.heroBadge} · ${LANGS.length} Languages` : `🇬🇧 Free · Private · ${LANGS.length} Languages · No account needed`}</div>
            <h2 className={`hero-title ${styles.heroTitle}`}>{ui.heroTitle || 'Welcome to\nyour new life. 🤝'}</h2>
            <p className="hero-sub">{ui.heroSub || 'Step-by-step guides for everything you need in the UK. No tracking. No cost. Ever.'}</p>
          </div>

          <div className="notice">
            <p className="notice-text">{ui.brpNotice || '⚠ BRPs expired December 2024. Your immigration status is now digital. Set up your eVisa at GOV.UK before travelling.'}</p>
          </div>

          {tip && <div className="tip-banner"><span className="tip-icon">💡</span><p className="tip-text">{tip}</p></div>}

          {/* Status picker — shown once until user picks a status or skips */}
          {!userStatus && !statusPickerDismissed && (
            <div className={`card ${styles.statusPickerCard}`}>
              <p className={styles.statusPickerTitle}>
                {ui.statusPickerTitle || "What's your situation in the UK?"}
              </p>
              <p className={styles.statusPickerSub}>
                {ui.statusPickerSub || 'Optional — helps us show the most relevant guides first.'}
              </p>
              {([
                { value: 'asylum-seeker' as UserStatus, label: ui.statusAsylumSeeker || '⏳ Asylum seeker — waiting for my decision' },
                { value: 'refugee'       as UserStatus, label: ui.statusRefugee       || '✅ Recognised refugee' },
                { value: 'other-visa'    as UserStatus, label: ui.statusOtherVisa     || '🛂 Another visa (Skilled Worker, Family, Student…)' },
                { value: 'settled'       as UserStatus, label: ui.statusSettled       || '🇬🇧 Settled / Pre-Settled Status' },
              ]).map(opt => (
                <button key={opt.value} className={`btn btn-outline ${styles.statusBtn}`}
                  onClick={() => setUserStatus(opt.value)}>
                  {opt.label}
                </button>
              ))}
              <button className={styles.statusSkip}
                onClick={() => setStatusPickerDismissed(true)}>
                {ui.statusSkip || 'Skip for now'}
              </button>
            </div>
          )}
        </>
      )}

      <div className="search-bar">
        <span className={styles.searchIcon}>🔍</span>
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
        <div className={styles.noResults}>{ui.noResults}</div>
      )}

      {/* For You — pinned guides for this status, shown when not searching and viewing all categories */}
      {!search && catFilter === 'All' && userStatus && STATUS_GUIDES[userStatus] && (
        <div>
          <div className={`cat-header ${styles.forYouHeader}`}>⭐ {ui.forYou}</div>
          <div className={`card card-flush ${styles.cardGutter}`}>
            {STATUS_GUIDES[userStatus]
              .map(id => GUIDE_MAP[id])
              .filter(Boolean)
              .map(g => {
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
      )}

      {cats.map(cat => (
        <div key={cat}>
          <div className="cat-header" style={{ color: CATEGORIES[cat]?.color }}>
            {CATEGORIES[cat]?.emoji} {cat}
          </div>
          <div className={`card card-flush ${styles.cardGutter}`}>
            {groupedByCat[cat].map(g => {
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
      <div className={styles.spacer} />
    </div>
  )
}

