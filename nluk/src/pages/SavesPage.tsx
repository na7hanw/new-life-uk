import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import { APPS } from '../data/apps.ts'
import { CULTURE } from '../data/culture.ts'
import { translate } from '../lib/translate.ts'
import { ls, lsSet } from '../lib/utils.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import CultureCard from '../components/CultureCard.tsx'
import EmptyState from '../components/EmptyState.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'
import styles from './SavesPage.module.css'

const CATEGORY_META: Record<string, { emoji: string }> = {
  'Communication': { emoji: '💬' },
  'Connectivity':  { emoji: '📱' },
  'Health':        { emoji: '💊' },
  'Finance':       { emoji: '🏦' },
  'Benefits':      { emoji: '💰' },
  'Immigration':   { emoji: '🆔' },
  'Transport':     { emoji: '🚌' },
  'Housing':       { emoji: '🏠' },
  'Food':          { emoji: '🍽' },
  'Shopping':      { emoji: '🛍️' },
  'Food Delivery': { emoji: '🛵' },
  'Jobs':          { emoji: '🎯' },
  'Learning':      { emoji: '🌐' },
  'Advice':        { emoji: '🗣' },
  'Community':     { emoji: '🍎' },
  'Money':         { emoji: '💷' },
  'Family':        { emoji: '👶' },
  'Culture':       { emoji: '🏛' },
  'Education':     { emoji: '📚' },
  'Employment':    { emoji: '💼' },
  'Legal':         { emoji: '⚖️' },
  'Documents':     { emoji: '🪪' },
  'Support':       { emoji: '🤝' },
}

// Merge SAVES + GEMS into one unified Free list
const FREE_ITEMS = [...SAVES, ...GEMS]

const appsFuse  = new Fuse(APPS,       { keys: ['content.en.title', 'content.en.desc'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })
const freeFuse  = new Fuse(FREE_ITEMS, { keys: ['content.en.title', 'content.en.desc'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })

// Flatten culture items for Fuse
const FLAT_CULTURE = CULTURE.flatMap(section =>
  section.items.map(item => ({
    ...item,
    sectionId: section.id,
    sectionEmoji: section.emoji,
    sectionHeading: section.heading,
  }))
)
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

function groupByCat<T extends { cat?: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const cat = item.cat || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
}

const APPS_BY_CAT = groupByCat(APPS)
const FREE_BY_CAT = groupByCat(FREE_ITEMS)

interface SectionMeta {
  heading: string
  description?: string
}

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [search, setSearch] = useState('')

  const [activeTab, setActiveTab] = useState<'apps' | 'free' | 'uklife'>(() => {
    const stored = ls('nluk_rtab', 'apps')
    // migrate old 'gems' tab to 'free'
    if (stored === 'gems') return 'free'
    return stored as 'apps' | 'free' | 'uklife'
  })

  // ── Resource tabs: all categories start CLOSED ──────────────────
  const [openCats, setOpenCats] = useState<Set<string>>(new Set())

  // ── UK Life: all sections start COLLAPSED ─────────────────────
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() =>
    new Set(CULTURE.map(s => s.id))
  )

  // Translate culture section headings when lang changes
  const [sectionMeta, setSectionMeta] = useState<Record<string, SectionMeta>>({})
  useEffect(() => {
    if (lang === 'en') { setSectionMeta({}); return }
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

  const handleTab = (tab: 'apps' | 'free' | 'uklife') => {
    setActiveTab(tab)
    lsSet('nluk_rtab', tab)
    setSearch('')
  }

  const toggleCat = (key: string) => {
    setOpenCats(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
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

  // ── Resource search results ──────────────────────────────────────
  const resourceResults = useMemo(() => {
    if (!search.trim() || activeTab === 'uklife') return []
    if (activeTab === 'apps') return appsFuse.search(search).map(r => r.item)
    return freeFuse.search(search).map(r => r.item)
  }, [search, activeTab])

  // ── Culture search results ─────────────────────────────────────
  const filteredCultureSections = useMemo(() => {
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

  const currentData = activeTab === 'apps' ? APPS_BY_CAT : FREE_BY_CAT

  const searchPlaceholder =
    activeTab === 'uklife'
      ? (ui.searchCulture || 'Search tips & hacks…')
      : (ui.searchDiscover || 'Search resources…')

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {([
          { id: 'apps'   as const, label: ui.appsTab || '📲 Apps' },
          { id: 'free'   as const, label: ui.discoverFreeTab || '🆓 Free' },
          { id: 'uklife' as const, label: '🇬🇧 UK Life' },
        ] as const).map(t => (
          <button key={t.id} className={`sub-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTab(t.id)} role="tab" aria-selected={activeTab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} strokeWidth={2} className={styles.searchIcon} />
        <input className="search-input" placeholder={searchPlaceholder}
          value={search} onChange={e => setSearch(e.target.value)}
          aria-label={searchPlaceholder} />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

      {/* ── UK Life tab ─────────────────────────────────────────── */}
      {activeTab === 'uklife' && (
        <>
          {filteredCultureSections.length === 0 && <EmptyState message={ui.noResults} />}
          {filteredCultureSections.map(section => {
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
        </>
      )}

      {/* ── Apps & Free tabs ─────────────────────────────────────── */}
      {activeTab !== 'uklife' && (
        search.trim() ? (
          <>
            {resourceResults.length === 0 && <EmptyState message={ui.noResults} />}
            {resourceResults.map(item => (
              <ResourceCard key={item.content.en.title} icon={item.icon}
                content={item.content as Record<string, ResourceContent>} url={item.url}
                guideId={item.guideId} lang={lang} ui={ui} />
            ))}
          </>
        ) : (
          Object.keys(currentData).map(cat => {
            const key = `${activeTab}:${cat}`
            const isOpen = openCats.has(key)
            return (
              <div key={cat}>
                <button className={`section-label ${styles.accordionTrigger}`}
                  onClick={() => toggleCat(key)} aria-expanded={isOpen}>
                  <span>{CATEGORY_META[cat]?.emoji || '📌'} {cat}</span>
                  <ChevronDown size={16} strokeWidth={2.5}
                    className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`} />
                </button>
                <div className={`accordion-body${isOpen ? '' : ' closed'}`} aria-hidden={!isOpen}>
                  <div className="accordion-body-inner">
                    {currentData[cat].map(item => (
                      <ResourceCard key={item.content.en.title} icon={item.icon}
                        content={item.content as Record<string, ResourceContent>} url={item.url}
                        guideId={item.guideId} lang={lang} ui={ui} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )
      )}

      <div className={styles.spacer} />
    </div>
  )
}
