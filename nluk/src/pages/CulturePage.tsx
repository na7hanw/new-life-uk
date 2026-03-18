import { useState, useMemo, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { CULTURE } from '../data/culture.ts'
import type { CultureItem } from '../data/culture.ts'
import CultureCard from '../components/CultureCard.tsx'

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

  const searchPlaceholder = ui.searchCulture || 'Search culture tips…'

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.cultureTitle || '🇬🇧 UK Culture & Oddities'}</h2>
        <p className="page-hero-sub">{ui.cultureSub || 'Unwritten rules, polite lies, and peculiar customs of British life.'}</p>
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

      {filteredSections.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
          {ui.noResults}
        </div>
      )}

      {filteredSections.map(section => (
        <div key={section.id}>
          <div className="section-label">{section.emoji} {section.heading}</div>
          {section.items.map(item => (
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
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
