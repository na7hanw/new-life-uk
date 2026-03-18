/**
 * Tests for src/lib/search.ts
 * Covers: getRecentSearches, addRecentSearch, removeRecentSearch,
 *         getGuideAccessCounts, incrementGuideAccess, getTrendingGuideIds,
 *         ALL_SEARCH_ITEMS index integrity.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  getGuideAccessCounts,
  incrementGuideAccess,
  getTrendingGuideIds,
  ALL_SEARCH_ITEMS,
} from '../lib/search.ts'

beforeEach(() => {
  localStorage.clear()
})

// ─── Recent searches ──────────────────────────────────────────────────────────

describe('getRecentSearches', () => {
  it('returns an empty array when nothing has been stored', () => {
    expect(getRecentSearches()).toEqual([])
  })
})

describe('addRecentSearch', () => {
  it('adds a query to the recent searches list', () => {
    addRecentSearch('bank account')
    expect(getRecentSearches()).toContain('bank account')
  })

  it('trims whitespace before storing', () => {
    addRecentSearch('  GP  ')
    expect(getRecentSearches()).toContain('GP')
  })

  it('does not store empty / whitespace-only strings', () => {
    addRecentSearch('   ')
    expect(getRecentSearches()).toHaveLength(0)
  })

  it('deduplicates queries (most recent wins, old entry removed)', () => {
    addRecentSearch('housing')
    addRecentSearch('bank')
    addRecentSearch('housing') // second time
    const list = getRecentSearches()
    expect(list.filter(s => s === 'housing').length).toBe(1)
  })

  it('moves a duplicate to the front of the list', () => {
    addRecentSearch('bank')
    addRecentSearch('housing')
    addRecentSearch('bank') // move to front
    expect(getRecentSearches()[0]).toBe('bank')
  })

  it('keeps at most 5 entries', () => {
    for (let i = 1; i <= 7; i++) {
      addRecentSearch(`query ${i}`)
    }
    expect(getRecentSearches().length).toBeLessThanOrEqual(5)
  })
})

describe('removeRecentSearch', () => {
  it('removes the specified query from the list', () => {
    addRecentSearch('evisa')
    addRecentSearch('gp')
    removeRecentSearch('evisa')
    expect(getRecentSearches()).not.toContain('evisa')
  })

  it('leaves other entries intact', () => {
    addRecentSearch('evisa')
    addRecentSearch('gp')
    removeRecentSearch('evisa')
    expect(getRecentSearches()).toContain('gp')
  })

  it('is a no-op when the query is not in the list', () => {
    addRecentSearch('housing')
    removeRecentSearch('unknown')
    expect(getRecentSearches()).toContain('housing')
  })
})

// ─── Guide access tracking ────────────────────────────────────────────────────

describe('getGuideAccessCounts', () => {
  it('returns an empty object when no guides have been accessed', () => {
    expect(getGuideAccessCounts()).toEqual({})
  })
})

describe('incrementGuideAccess', () => {
  it('sets the count to 1 on first access', () => {
    incrementGuideAccess('bank')
    expect(getGuideAccessCounts()['bank']).toBe(1)
  })

  it('increments the count on repeated accesses', () => {
    incrementGuideAccess('bank')
    incrementGuideAccess('bank')
    incrementGuideAccess('bank')
    expect(getGuideAccessCounts()['bank']).toBe(3)
  })

  it('tracks multiple guides independently', () => {
    incrementGuideAccess('bank')
    incrementGuideAccess('gp')
    incrementGuideAccess('gp')
    const counts = getGuideAccessCounts()
    expect(counts['bank']).toBe(1)
    expect(counts['gp']).toBe(2)
  })
})

describe('getTrendingGuideIds', () => {
  it('returns an empty array when no guides have been accessed', () => {
    expect(getTrendingGuideIds()).toEqual([])
  })

  it('returns guides sorted by access count descending', () => {
    incrementGuideAccess('bank')
    incrementGuideAccess('bank')
    incrementGuideAccess('gp')
    incrementGuideAccess('gp')
    incrementGuideAccess('gp')
    incrementGuideAccess('evisa')
    const trending = getTrendingGuideIds(3)
    expect(trending[0]).toBe('gp')
    expect(trending[1]).toBe('bank')
    expect(trending[2]).toBe('evisa')
  })

  it('respects the n limit', () => {
    for (const id of ['bank', 'gp', 'evisa', 'uc', 'ni']) {
      incrementGuideAccess(id)
    }
    expect(getTrendingGuideIds(3).length).toBeLessThanOrEqual(3)
  })

  it('only returns ids that exist in GUIDE_MAP', () => {
    incrementGuideAccess('nonexistent-guide')
    incrementGuideAccess('bank')
    const trending = getTrendingGuideIds()
    expect(trending).not.toContain('nonexistent-guide')
  })
})

// ─── ALL_SEARCH_ITEMS index ────────────────────────────────────────────────────

describe('ALL_SEARCH_ITEMS', () => {
  it('is non-empty', () => {
    expect(ALL_SEARCH_ITEMS.length).toBeGreaterThan(0)
  })

  it('every item has a type, id, title, path, and icon', () => {
    for (const item of ALL_SEARCH_ITEMS) {
      expect(item.type, `item "${item.id}" missing type`).toBeTruthy()
      expect(item.id, `item missing id`).toBeTruthy()
      expect(item.title, `item "${item.id}" missing title`).toBeTruthy()
      expect(item.path, `item "${item.id}" missing path`).toBeTruthy()
      expect(item.icon, `item "${item.id}" missing icon`).toBeTruthy()
    }
  })

  it('all guide items have paths starting with /guide/', () => {
    const guides = ALL_SEARCH_ITEMS.filter(i => i.type === 'guide')
    for (const g of guides) {
      expect(g.path).toMatch(/^\/guide\//)
    }
  })

  it('all cert items have paths starting with /cert/', () => {
    const certs = ALL_SEARCH_ITEMS.filter(i => i.type === 'cert')
    for (const c of certs) {
      expect(c.path).toMatch(/^\/cert\//)
    }
  })

  it('all career items have paths starting with /career/', () => {
    const careers = ALL_SEARCH_ITEMS.filter(i => i.type === 'career')
    for (const c of careers) {
      expect(c.path).toMatch(/^\/career\//)
    }
  })

  it('includes at least one item of each type', () => {
    const types = new Set(ALL_SEARCH_ITEMS.map(i => i.type))
    expect(types.has('guide')).toBe(true)
    expect(types.has('job')).toBe(true)
    expect(types.has('cert')).toBe(true)
    expect(types.has('career')).toBe(true)
    expect(types.has('culture')).toBe(true)
  })
})
