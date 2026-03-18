import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { CULTURE } from '../data/culture.ts'
import type { CultureItem } from '../data/culture.ts'
import CultureCard from '../components/CultureCard.tsx'
import EmptyState from '../components/EmptyState.tsx'

interface FlatCultureItem extends CultureItem {
  sectionId: string
  sectionEmoji: string
  sectionHeading: string
}

// Flatten all culture items once at module load for Fuse indexing
const FLAT_CULTURE: FlatCultureItem[] = CULTURE.flatMap(section =>
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

export default function CulturePage() {
  const { ui } = useApp()
  const [search, setSearch] = useState('')
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // All sections open by default
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    return () => { if (copyTimer.current !== null) clearTimeout(copyTimer.current) }
  }, [])

  const filteredSections = useMemo(() => {
    if (!search.trim()) return CULTURE
    const results = cultureFuse.search(search).map(r => r.item)
    const grouped: Record<string, FlatCultureItem[]> = {}
    for (const item of results) {
      if (!grouped[item.sectionId]) grouped[item.sectionId] = []
      grouped[item.sectionId].push(item)
    }
    return CULTURE
      .filter(s => grouped[s.id])
      .map(s => ({ ...s, items: grouped[s.id] }))
  }, [search])

  const handleCopy = (item: CultureItem) => {
    const text = `${item.title}\n\n${item.body}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedTitle(item.title)
      if (copyTimer.current !== null) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => {
        setCopiedTitle(null)
        copyTimer.current = null
      }, 2000)
    })
  }

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const searchPlaceholder = ui.searchCulture || 'Search culture tips…'

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.cultureTitle || '🇬🇧 UK Culture & Oddities'}</h2>
        <p className="page-hero-sub">{ui.cultureSub || 'Unwritten rules, polite lies, and peculiar customs of British life.'}</p>
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
        return (
          <div key={section.id}>
            <button
              className="culture-section-header"
              onClick={() => toggleSection(section.id)}
              aria-expanded={!isCollapsed}
            >
              <span className="section-label-lg" style={{ padding: 0, margin: 0, border: 'none', background: 'none', flex: 1 }}>
                {section.emoji} {section.heading}
              </span>
              <span className="culture-section-meta">
                <span className="culture-section-count">{section.items.length}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  style={{ color: 'var(--t3)', flexShrink: 0, transition: 'transform .2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
                />
              </span>
            </button>
            {section.description && !isCollapsed && (
              <p className="section-sub">{section.description}</p>
            )}
            {!isCollapsed && section.items.map(item => (
              <CultureCard
                key={item.title}
                emoji={item.emoji}
                title={item.title}
                body={item.body}
                onCopy={() => handleCopy(item)}
                copied={copiedTitle === item.title}
                copyLabel={ui.copyTip || 'Copy tip'}
                copiedLabel={ui.copied || 'Copied!'}
              />
            ))}
          </div>
        )
      })}
      <div style={{ height: 8 }} />
    </div>
  )
}
