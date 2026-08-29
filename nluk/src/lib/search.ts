/**
 * Unified global search utilities.
 *
 * Builds a flat, type-tagged search index across guides, jobs, certs, careers,
 * and culture items at module load so every tab benefits from the same index.
 * Also provides helpers for recent-search and guide-access-count persistence.
 */
import Fuse, { type FuseResult } from 'fuse.js'
import { GUIDES, GUIDE_MAP, GUIDE_KEYWORDS } from '../data/guides.ts'
import { JOBS, CERT_MAP, CAREER_MAP } from '../data/jobs.ts'
import { CULTURE } from '../data/culture.ts'
import type { Cert, Career } from '../types'
import { ls, lsSet } from './utils.ts'

// ── Types ──────────────────────────────────────────────────────────────────

export type SearchResultType = 'guide' | 'job' | 'cert' | 'career' | 'culture'

export interface SearchItem {
  type: SearchResultType
  id: string
  title: string
  subtitle: string
  /** Extra text included in search index but not displayed. */
  keywords: string
  icon: string
  path: string
}

// ── Build unified flat search list at module load ─────────────────────────

export const ALL_SEARCH_ITEMS: SearchItem[] = [
  // Guides
  ...GUIDES.map(g => ({
    type: 'guide' as const,
    id: g.id,
    title: g.content.en.title,
    subtitle: g.content.en.summary,
    keywords: (GUIDE_KEYWORDS[g.id] || []).join(' '),
    icon: g.icon,
    path: `/guide/${g.id}`,
  })),

  // Jobs — no stable per-job detail page, navigate to the jobs list
  ...JOBS.map((j, i) => ({
    type: 'job' as const,
    id: `job-${i}`,
    title: j.content.en.role,
    subtitle: `${j.pay} · ${j.content.en.desc.slice(0, 120)}`,
    keywords: (j.tags || []).join(' '),
    icon: j.icon,
    path: '/work/jobs',
  })),

  // Certs
  ...Object.values(CERT_MAP).map((c: Cert) => ({
    type: 'cert' as const,
    id: c.id,
    title: c.content.en.title,
    subtitle: c.content.en.sector || `${c.cost} · ${c.time}`,
    keywords: '',
    icon: c.icon,
    path: `/cert/${c.id}`,
  })),

  // Careers
  ...Object.values(CAREER_MAP).map((c: Career) => ({
    type: 'career' as const,
    id: c.id,
    title: c.content.en.title,
    subtitle: c.content.en.salary,
    keywords: (c.tags || []).join(' '),
    icon: c.icon,
    path: `/career/${c.id}`,
  })),

  // Culture — navigate to the culture page (no per-item deep-link)
  ...CULTURE.flatMap(section =>
    section.items.map((item, i) => ({
      type: 'culture' as const,
      id: `culture-${section.id}-${i}`,
      title: item.title,
      subtitle: item.body,
      keywords: section.heading,
      icon: item.emoji,
      path: '/culture',
    }))
  ),
]

// ── Fuse.js global index (built once) ─────────────────────────────────────

export const globalFuse = new Fuse(ALL_SEARCH_ITEMS, {
  keys: [
    { name: 'title',    weight: 3 },
    { name: 'subtitle', weight: 1 },
    { name: 'keywords', weight: 2 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeMatches: true,
})

export type GlobalFuseResult = FuseResult<SearchItem>

// Re-exported so existing importers keep working. These live in
// searchHistory.ts, which has no heavy data imports — prefer importing from
// there directly in any component that does not need the search index.
export {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  getGuideAccessCounts,
  incrementGuideAccess,
  getTrendingGuideIds,
} from './searchHistory.ts'
