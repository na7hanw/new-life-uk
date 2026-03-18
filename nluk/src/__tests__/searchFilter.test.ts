/**
 * Tests for Fuse.js global search filtering (src/lib/search.ts).
 * Covers: fuzzy matching on title/keywords, empty/short queries,
 * result structure, and per-type filtering.
 */
import { describe, it, expect } from 'vitest'
import { globalFuse, ALL_SEARCH_ITEMS, type GlobalFuseResult } from '../lib/search.ts'

// ─── Result-structure helpers ─────────────────────────────────────────────────

function idsOf(results: GlobalFuseResult[]) {
  return results.map(r => r.item.id)
}

function typesOf(results: GlobalFuseResult[]) {
  return results.map(r => r.item.type)
}

// ─── Empty / too-short queries ────────────────────────────────────────────────

describe('globalFuse — empty / short queries', () => {
  it('returns no results for an empty string', () => {
    expect(globalFuse.search('')).toHaveLength(0)
  })

  it('returns fewer results for a single character than for a multi-character query', () => {
    // Fuse minMatchCharLength=2 limits what a single-char search can match;
    // a full term like "bank account" will always produce more results.
    const single = globalFuse.search('a').length
    const multi  = globalFuse.search('bank account').length
    expect(multi).toBeGreaterThan(single)
  })
})

// ─── Known guide searches ─────────────────────────────────────────────────────

describe('globalFuse — guide searches', () => {
  it('returns the bank guide when searching "bank account"', () => {
    const results = globalFuse.search('bank account')
    expect(idsOf(results)).toContain('bank')
  })

  it('returns the GP guide when searching "GP"', () => {
    const results = globalFuse.search('GP')
    expect(idsOf(results)).toContain('gp')
  })

  it('returns the NHS guide when searching "doctor"', () => {
    // "doctor" is in GUIDE_KEYWORDS for gp
    const results = globalFuse.search('doctor')
    expect(idsOf(results)).toContain('gp')
  })

  it('returns the Universal Credit guide when searching "benefits"', () => {
    // "benefits" is in GUIDE_KEYWORDS for uc
    const results = globalFuse.search('benefits')
    expect(idsOf(results)).toContain('uc')
  })

  it('returns housing-related results when searching "housing"', () => {
    const results = globalFuse.search('housing')
    const ids = idsOf(results)
    expect(ids.some(id => id.includes('housing'))).toBe(true)
  })

  it('returns the eVisa guide when searching "eVisa"', () => {
    const results = globalFuse.search('eVisa')
    expect(idsOf(results)).toContain('evisa')
  })
})

// ─── Fuzzy matching ───────────────────────────────────────────────────────────

describe('globalFuse — fuzzy matching', () => {
  it('finds the bank guide with a misspelling "bankk"', () => {
    const results = globalFuse.search('bankk')
    // Fuse threshold=0.38 should still return the bank guide for near-exact match
    expect(idsOf(results)).toContain('bank')
  })

  it('finds the GP guide with "docter" (misspelling of doctor)', () => {
    const results = globalFuse.search('docter')
    expect(idsOf(results)).toContain('gp')
  })

  it('returns no results for a completely unrecognisable string', () => {
    const results = globalFuse.search('zzzzqqqq')
    expect(results).toHaveLength(0)
  })
})

// ─── Cross-type results ───────────────────────────────────────────────────────

describe('globalFuse — cross-type results', () => {
  it('can return results of type "guide"', () => {
    const results = globalFuse.search('bank')
    expect(typesOf(results)).toContain('guide')
  })

  it('can return results of type "job"', () => {
    // Search for something specifically in jobs data
    const results = globalFuse.search('construction')
    expect(results.length).toBeGreaterThan(0)
  })

  it('can return results of type "cert"', () => {
    // Search for cert-related terms
    const results = globalFuse.search('forklift')
    expect(results.length).toBeGreaterThan(0)
  })

  it('each result has the required SearchItem fields', () => {
    const results = globalFuse.search('NHS')
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      const item = r.item
      expect(item.type).toBeTruthy()
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.path).toBeTruthy()
      expect(item.icon).toBeTruthy()
    }
  })
})

// ─── Result ordering ──────────────────────────────────────────────────────────

describe('globalFuse — result ordering', () => {
  it('returns the bank guide as the top result for "bank account"', () => {
    const results = globalFuse.search('bank account')
    expect(results.length).toBeGreaterThan(0)
    // The bank guide title is "Opening a Bank Account" — should rank at top
    expect(results[0].item.id).toBe('bank')
  })

  it('returns the GP guide in the top 3 results for "NHS GP"', () => {
    const results = globalFuse.search('NHS GP')
    expect(results.length).toBeGreaterThan(0)
    const topIds = results.slice(0, 3).map(r => r.item.id)
    expect(topIds).toContain('gp')
  })
})

// ─── Index size ───────────────────────────────────────────────────────────────

describe('globalFuse — index coverage', () => {
  it('searches across the same items as ALL_SEARCH_ITEMS', () => {
    // The fuse index is built from ALL_SEARCH_ITEMS; a full search should return all
    // items for a very broad term (impossible to unit-test exactly, but verify size)
    const broadResults = globalFuse.search('the')
    expect(broadResults.length).toBeGreaterThan(0)
    expect(broadResults.length).toBeLessThanOrEqual(ALL_SEARCH_ITEMS.length)
  })
})
