import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { GUIDES } from '../data/guides.ts'
import { JOBS, CERTS, CAREERS } from '../data/jobs.ts'
import { useApp } from '../context/AppContext.tsx'
import styles from './CommandPalette.module.css'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

type PaletteItem = {
  type: 'guide' | 'job' | 'cert' | 'career'
  id: string
  icon: string
  title: string
  sub: string
}

// Build search corpus once at module load (not inside component)
function buildCorpus(): PaletteItem[] {
  const items: PaletteItem[] = []
  for (const g of GUIDES) {
    const c = g.content?.en || {}
    items.push({ type: 'guide', id: g.id, icon: g.icon, title: (c as Record<string, string>).title || g.id, sub: g.cat })
  }
  for (let i = 0; i < JOBS.length; i++) {
    const j = JOBS[i]
    const c = j.content?.en || {}
    items.push({ type: 'job', id: `job-${i}`, icon: j.icon, title: (c as Record<string, string>).role || '', sub: j.pay || '' })
  }
  for (const cert of CERTS) {
    const c = (cert.content as Record<string, Record<string, string>>)?.en || {}
    items.push({ type: 'cert', id: cert.id, icon: cert.icon, title: c.title || cert.id, sub: c.sector || '' })
  }
  for (const career of CAREERS) {
    const c = (career.content as Record<string, Record<string, string>>)?.en || {}
    items.push({ type: 'career', id: career.id, icon: career.icon, title: c.title || career.id, sub: (career as unknown as { tags: string[] }).tags?.join(', ') || '' })
  }
  return items
}

const CORPUS = buildCorpus()

const fuse = new Fuse(CORPUS, {
  keys: [{ name: 'title', weight: 3 }, { name: 'sub', weight: 1 }],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
})

const TYPE_LABELS: Record<PaletteItem['type'], string> = {
  guide: 'Guides',
  job: 'Jobs',
  cert: 'Certificates',
  career: 'Career Paths',
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { dir } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo<PaletteItem[]>(() => {
    if (!query.trim()) return CORPUS.slice(0, 12)
    return fuse.search(query, { limit: 24 }).map(r => r.item)
  }, [query])

  // Group by type preserving order
  const groups = useMemo(() => {
    const map: Partial<Record<PaletteItem['type'], PaletteItem[]>> = {}
    for (const item of results) {
      if (!map[item.type]) map[item.type] = []
      map[item.type]!.push(item)
    }
    return map
  }, [results])

  const handleSelect = useCallback((item: PaletteItem) => {
    switch (item.type) {
      case 'guide':  navigate(`/guide/${item.id}`); break
      case 'cert':   navigate(`/cert/${item.id}`); break
      case 'career': navigate(`/career/${item.id}`); break
      case 'job':    navigate('/work/jobs'); break
    }
    onClose()
  }, [navigate, onClose])

  // Focus input on open, clear on close
  useEffect(() => {
    if (open) {
      setQuery('')
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }
    document.addEventListener('keydown', onKey, { capture: true })
    return () => document.removeEventListener('keydown', onKey, { capture: true })
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onClose} onKeyDown={e => { if (e.key === 'Escape') onClose() }} role="presentation" dir={dir}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- stopPropagation is needed to prevent backdrop close; role="dialog" is interactive */}
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Search" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
        <Command label="Global search" shouldFilter={false}>
          <div className={styles.inputWrap}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Search guides, jobs, certificates…"
              className={styles.input}
              aria-label="Search all content"
            />
            <button className={styles.escBadge} onClick={onClose} aria-label="Close search">esc</button>
          </div>

          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>
              No results for &ldquo;{query}&rdquo;
            </Command.Empty>

            {(Object.keys(TYPE_LABELS) as PaletteItem['type'][]).map(type => {
              const items = groups[type]
              if (!items?.length) return null
              return (
                <Command.Group key={type} heading={TYPE_LABELS[type]}>
                  {items.map((item, i) => (
                    <Command.Item
                      key={`${item.type}-${item.id}-${i}`}
                      value={`${item.type}:${item.id}:${item.title}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>
                      <div className={styles.itemText}>
                        <div className={styles.itemTitle}>{item.title}</div>
                        {item.sub && <div className={styles.itemSub}>{item.sub}</div>}
                      </div>
                      <span className={styles.itemArrow} aria-hidden="true">›</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )
            })}
          </Command.List>

          <div className={styles.footer}>
            <span className={styles.footerHint}><kbd className={styles.kbd}>↑↓</kbd> navigate</span>
            <span className={styles.footerHint}><kbd className={styles.kbd}>↵</kbd> open</span>
            <span className={styles.footerHint}><kbd className={styles.kbd}>esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
