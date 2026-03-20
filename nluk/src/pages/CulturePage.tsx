import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { CULTURE } from '../data/culture.ts'
import { translate } from '../lib/translate.ts'
import CultureCard from '../components/CultureCard.tsx'
import EmptyState from '../components/EmptyState.tsx'

// Flatten all culture items once at module load for Fuse indexing (English titles/bodies)
const FLAT_CULTURE = CULTURE.flatMap(section =>
  section.items.map(item => ({
    ...item,
    sectionId: section.id,
    sectionEmoji: section.emoji,
    sectionHeading: section.heading,
  }))
)

// Fuse index built once at module load — FLAT_CULTURE is immutable
const cultureFuse = new Fuse(FLAT_CULTURE, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'body', weight: 2 },
    { name: 'sectionHeading', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

interface SectionMeta {
  heading: string
  description?: string
}

export default function CulturePage() {
  const { ui, lang } = useApp()
  const [search, setSearch] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // ── Translate section headings & descriptions when lang changes ──
  const [sectionMeta, setSectionMeta] = useState<Record<string, SectionMeta>>({})

  useEffect(() => {
    if (lang === 'en') {
      setSectionMeta({})
      return
    }
    let cancelled = false
    Promise.all(
      CULTURE.map(async s => ({
        id: s.id,
        heading: await translate(s.heading, lang),
        description: s.description ? await translate(s.description, lang) : undefined,
      }))
    ).then(results => {
      if (!cancelled) {
        setSectionMeta(
          Object.fromEntries(results.map(r => [r.id, { heading: r.heading, description: r.description }]))
        )
      }
    })
    return () => { cancelled = true }
  }, [lang])

  const filteredSections = useMemo(() => {
    if (!search.trim()) return CULTURE
    const results = cultureFuse.search(search).map(r => r.item)
    const grouped: Record<string, typeof FLAT_CULTURE> = {}
    for (const item of results) {
      if (!grouped[item.sectionId]) grouped[item.sectionId] = []
      grouped[item.sectionId].push(item)
    }
    return CULTURE
      .filter(s => grouped[s.id])
      .map(s => ({ ...s, items: grouped[s.id] }))
  }, [search])

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const searchPlaceholder = ui.searchCulture || 'Search tips & hacks…'

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.cultureTitle || '🇬🇧 UK Life & Hacks'}</h2>
        <p className="page-hero-sub">{ui.cultureSub || 'Survival hacks, money tricks, and the unwritten rules of life in the UK.'}</p>
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

      {filteredSections.length === 0 && <EmptyState message={ui.noResults} />}

      {filteredSections.map(section => {
        const isCollapsed = !search.trim() && collapsedSections.has(section.id)
        const heading = sectionMeta[section.id]?.heading || section.heading
        const description = sectionMeta[section.id]?.description || section.description

        return (
          <div key={section.id}>
            <button
              className="culture-section-header"
              onClick={() => toggleSection(section.id)}
              aria-expanded={!isCollapsed}
            >
              <span className="section-label-lg" style={{ padding: 0, margin: 0, border: 'none', background: 'none', flex: 1 }}>
                {section.emoji} {heading}
              </span>
              <span className="culture-section-meta">
                <span className="culture-section-count">{section.items.length}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={`section-chevron${isCollapsed ? '' : ' open'}`}
                />
              </span>
            </button>
            {/* CSS grid accordion — content stays in DOM for smooth height animation.
                Zero-height when closed means nothing "leaks" through. */}
            <div className={`accordion-body${isCollapsed && !search.trim() ? ' closed' : ''}`} aria-hidden={isCollapsed && !search.trim()}>
              <div className="accordion-body-inner">
                {description && <p className="section-sub">{description}</p>}
                {section.items.map(item => (
                  <CultureCard
                    key={item.title}
                    emoji={item.emoji}
                    content={{ en: { title: item.title, body: item.body } }}
                    lang={lang}
                    copyLabel={ui.copyTip || 'Copy tip'}
                    copiedLabel={ui.copied || 'Copied!'}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
      <div style={{ height: 8 }} />
    </div>
  )
}
