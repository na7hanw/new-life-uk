import { useState, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { SAVES, GEMS } from '../data/saves.ts'
import { APPS } from '../data/apps.ts'
import { ls, lsSet } from '../lib/utils.ts'
import ResourceCard from '../components/ResourceCard.tsx'
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

const appsFuse = new Fuse(APPS,  { keys: ['content.en.title', 'content.en.desc'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })
const savesFuse = new Fuse(SAVES, { keys: ['content.en.title', 'content.en.desc'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })
const gemsFuse  = new Fuse(GEMS,  { keys: ['content.en.title', 'content.en.desc'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })

function groupByCat<T extends { cat?: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const cat = item.cat || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
}

const APPS_BY_CAT  = groupByCat(APPS)
const SAVES_BY_CAT = groupByCat(SAVES)
const GEMS_BY_CAT  = groupByCat(GEMS)

export default function SavesPage() {
  const { lang, ui } = useApp()
  const [search, setSearch] = useState('')

  const [activeTab, setActiveTab] = useState<'apps' | 'free' | 'gems'>(() => {
    return (ls('nluk_rtab', 'apps') as 'apps' | 'free' | 'gems')
  })

  const [openCats, setOpenCats] = useState<Set<string>>(() => {
    const all = new Set<string>()
    Object.keys(APPS_BY_CAT).forEach(c => all.add(`apps:${c}`))
    Object.keys(SAVES_BY_CAT).forEach(c => all.add(`free:${c}`))
    Object.keys(GEMS_BY_CAT).forEach(c => all.add(`gems:${c}`))
    return all
  })

  const handleTab = (tab: 'apps' | 'free' | 'gems') => {
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

  const results = useMemo(() => {
    if (!search.trim()) return []
    if (activeTab === 'apps') return appsFuse.search(search).map(r => r.item)
    if (activeTab === 'free') return savesFuse.search(search).map(r => r.item)
    return gemsFuse.search(search).map(r => r.item)
  }, [search, activeTab])

  const currentData = activeTab === 'apps' ? APPS_BY_CAT : activeTab === 'free' ? SAVES_BY_CAT : GEMS_BY_CAT

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {([
          { id: 'apps' as const, label: ui.appsTab || '📲 Apps' },
          { id: 'free' as const, label: ui.discoverFreeTab || '🆓 Free' },
          { id: 'gems' as const, label: ui.discoverGemsTab || '💎 Gems' },
        ] as const).map(t => (
          <button key={t.id} className={`sub-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => handleTab(t.id)} role="tab" aria-selected={activeTab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} strokeWidth={2} className={styles.searchIcon} />
        <input className="search-input" placeholder={ui.searchDiscover || 'Search resources…'}
          value={search} onChange={e => setSearch(e.target.value)}
          aria-label={ui.searchDiscover || 'Search resources…'} />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

      {search.trim() ? (
        <>
          {results.length === 0 && <EmptyState message={ui.noResults} />}
          {results.map(item => (
            <ResourceCard key={item.content.en.title} icon={item.icon}
              content={item.content as Record<string, ResourceContent>} url={item.url} lang={lang} ui={ui} />
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
              {isOpen && currentData[cat].map(item => (
                <ResourceCard key={item.content.en.title} icon={item.icon}
                  content={item.content as Record<string, ResourceContent>} url={item.url} lang={lang} ui={ui} />
              ))}
            </div>
          )
        })
      )}

      <div className={styles.spacer} />
    </div>
  )
}
