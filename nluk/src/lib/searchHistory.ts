/**
 * Search history and guide-access (trending) helpers.
 *
 * Split out of search.ts deliberately. GuidesPage imports only
 * getTrendingGuideIds, but ES modules evaluate the whole module — and
 * search.ts builds ALL_SEARCH_ITEMS and globalFuse at module scope from JOBS,
 * CERT_MAP, CAREER_MAP and CULTURE. That dragged ~172 KB raw / 43 KB brotli of
 * job and culture data onto the landing route to render a list of guides that
 * needs neither.
 *
 * Keep this module's imports to GUIDE_MAP and the storage helpers only.
 */
import { GUIDE_MAP } from '../data/guides.ts'
import { ls, lsSet } from './utils.ts'

// ── Recent searches ────────────────────────────────────────────────────────

const RECENT_KEY = 'nluk_recent_searches'
const MAX_RECENT  = 5

export function getRecentSearches(): string[] {
  try { return JSON.parse(ls(RECENT_KEY, '[]')) } catch { return [] }
}

export function addRecentSearch(query: string): void {
  const q = query.trim()
  if (!q) return
  const prev = getRecentSearches().filter(s => s !== q)
  lsSet(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)))
}

export function removeRecentSearch(query: string): void {
  lsSet(RECENT_KEY, JSON.stringify(getRecentSearches().filter(s => s !== query)))
}

// ── Guide access tracking (trending) ─────────────────────────────────────

const ACCESS_KEY   = 'nluk_guide_access'
const MAX_TRENDING = 5

export function getGuideAccessCounts(): Record<string, number> {
  try { return JSON.parse(ls(ACCESS_KEY, '{}')) } catch { return {} }
}

export function incrementGuideAccess(id: string): void {
  const counts = getGuideAccessCounts()
  counts[id] = (counts[id] || 0) + 1
  lsSet(ACCESS_KEY, JSON.stringify(counts))
}

export function getTrendingGuideIds(n = MAX_TRENDING): string[] {
  const counts = getGuideAccessCounts()
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([id]) => id)
    .filter(id => Boolean(GUIDE_MAP[id]))
}
