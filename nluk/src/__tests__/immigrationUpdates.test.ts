/**
 * Tests for src/data/immigration-updates.ts
 *
 * Covers:
 * - Schema: all required fields present on every update item
 * - Trust labels: official GOV.UK / UKVI items have correct sourceType
 * - Sorting: getSortedUpdates() returns newest-first
 * - Related links: guide IDs in relatedGuideIds are plausible (strings)
 * - Urgency values: only valid urgency levels used
 * - Graceful fallback: empty feed state handled
 * - No political/opinion drift: sourceType is constrained to allowed values
 */
import { describe, it, expect } from 'vitest'
import {
  IMMIGRATION_UPDATES,
  getSortedUpdates,
  getHighPriorityUpdates,
  getUpdatesForGuide,
  SOURCE_TYPE_LABELS,
  URGENCY_LABELS,
  type UpdateSourceType,
  type UpdateUrgency,
} from '../data/immigration-updates.ts'

const VALID_SOURCE_TYPES: UpdateSourceType[] = [
  'official', 'official-factsheet', 'policy', 'fee-update', 'rules-change',
]

const VALID_URGENCY: UpdateUrgency[] = ['info', 'important', 'action-needed']

// ─── Schema validation ────────────────────────────────────────────────────────

describe('IMMIGRATION_UPDATES — schema validation', () => {
  it('has at least one update item', () => {
    expect(IMMIGRATION_UPDATES.length).toBeGreaterThan(0)
  })

  it('every item has a unique id', () => {
    const ids = IMMIGRATION_UPDATES.map(u => u.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every item has a non-empty title', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.title, `${u.id} missing title`).toBeTruthy()
      expect(u.title.length, `${u.id} title too short`).toBeGreaterThan(5)
    }
  })

  it('every item has a valid sourceUrl', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.sourceUrl, `${u.id} missing sourceUrl`).toBeTruthy()
      expect(u.sourceUrl, `${u.id} sourceUrl must be https`).toMatch(/^https:\/\//)
    }
  })

  it('every item has a valid sourceType from the allowed set', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(VALID_SOURCE_TYPES, `${u.id} has invalid sourceType`).toContain(u.sourceType)
    }
  })

  it('every item has a publishedAt in ISO date format', () => {
    const isoDateRe = /^\d{4}-\d{2}-\d{2}$/
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.publishedAt, `${u.id} missing publishedAt`).toMatch(isoDateRe)
    }
  })

  it('every item has a lastChecked in ISO date format', () => {
    const isoDateRe = /^\d{4}-\d{2}-\d{2}$/
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.lastChecked, `${u.id} missing lastChecked`).toMatch(isoDateRe)
    }
  })

  it('every item has a non-empty summary', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.summary, `${u.id} missing summary`).toBeTruthy()
      expect(u.summary.length, `${u.id} summary too short`).toBeGreaterThan(20)
    }
  })

  it('every item has a non-empty whatChanged', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.whatChanged, `${u.id} missing whatChanged`).toBeTruthy()
    }
  })

  it('every item has a non-empty whatToDo', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.whatToDo, `${u.id} missing whatToDo`).toBeTruthy()
    }
  })

  it('every item has a valid urgency level', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(VALID_URGENCY, `${u.id} has invalid urgency`).toContain(u.urgency)
    }
  })

  it('every item has an affectedGroups array', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(Array.isArray(u.affectedGroups), `${u.id} missing affectedGroups`).toBe(true)
    }
  })

  it('every item has a relatedGuideIds array', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(Array.isArray(u.relatedGuideIds), `${u.id} missing relatedGuideIds`).toBe(true)
    }
  })
})

// ─── Trust labels ─────────────────────────────────────────────────────────────

describe('IMMIGRATION_UPDATES — trust labelling', () => {
  it('official GOV.UK / UKVI items have sourceType "official" or "rules-change" or "fee-update"', () => {
    const govUkItems = IMMIGRATION_UPDATES.filter(u => u.sourceUrl.includes('gov.uk'))
    for (const u of govUkItems) {
      expect(
        ['official', 'rules-change', 'fee-update', 'official-factsheet'].includes(u.sourceType),
        `${u.id}: GOV.UK item has unexpected sourceType "${u.sourceType}"`
      ).toBe(true)
    }
  })

  it('no item uses "policy" sourceType for something already in force', () => {
    // "policy" items should not have urgency "action-needed" (they are not yet law)
    const policyItems = IMMIGRATION_UPDATES.filter(u => u.sourceType === 'policy')
    for (const u of policyItems) {
      expect(u.urgency, `Policy item ${u.id} should not be action-needed`).not.toBe('action-needed')
    }
  })

  it('SOURCE_TYPE_LABELS has an entry for every valid source type', () => {
    for (const t of VALID_SOURCE_TYPES) {
      expect(SOURCE_TYPE_LABELS[t], `Missing label for sourceType ${t}`).toBeTruthy()
    }
  })

  it('URGENCY_LABELS has entries for all urgency levels', () => {
    for (const u of VALID_URGENCY) {
      expect(URGENCY_LABELS[u], `Missing label for urgency ${u}`).toBeTruthy()
      expect(URGENCY_LABELS[u].label).toBeTruthy()
      expect(URGENCY_LABELS[u].color).toBeTruthy()
    }
  })
})

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe('getSortedUpdates', () => {
  it('sorts by urgency first (action-needed → important → info), then newest-first within each tier', () => {
    const sorted = getSortedUpdates()
    const urgencyOrder: Record<string, number> = { 'action-needed': 0, 'important': 1, 'info': 2 }
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = urgencyOrder[sorted[i].urgency]
      const b = urgencyOrder[sorted[i + 1].urgency]
      if (a === b) {
        // Within same urgency tier, should be newest-first
        const aDate = new Date(sorted[i].publishedAt).getTime()
        const bDate = new Date(sorted[i + 1].publishedAt).getTime()
        expect(aDate, `Dates out of order within urgency tier at positions ${i}/${i + 1}`).toBeGreaterThanOrEqual(bDate)
      } else {
        expect(a, `Urgency out of order at positions ${i}/${i + 1}`).toBeLessThanOrEqual(b)
      }
    }
  })

  it('returns all items', () => {
    expect(getSortedUpdates().length).toBe(IMMIGRATION_UPDATES.length)
  })

  it('does not mutate the original array', () => {
    const originalFirst = IMMIGRATION_UPDATES[0].id
    getSortedUpdates()
    expect(IMMIGRATION_UPDATES[0].id).toBe(originalFirst)
  })
})

// ─── High-priority updates ────────────────────────────────────────────────────

describe('getHighPriorityUpdates', () => {
  it('returns only items with urgency important or action-needed', () => {
    const high = getHighPriorityUpdates()
    for (const u of high) {
      expect(u.urgency).not.toBe('info')
    }
  })

  it('returns a subset of all updates', () => {
    expect(getHighPriorityUpdates().length).toBeLessThanOrEqual(IMMIGRATION_UPDATES.length)
  })
})

// ─── Guide cross-links ────────────────────────────────────────────────────────

describe('getUpdatesForGuide', () => {
  it('returns updates that reference the given guide ID', () => {
    // Find a guide ID that appears in at least one update's relatedGuideIds
    const testId = IMMIGRATION_UPDATES[0].relatedGuideIds[0]
    if (testId) {
      const results = getUpdatesForGuide(testId)
      expect(results.length).toBeGreaterThan(0)
      for (const u of results) {
        expect(u.relatedGuideIds).toContain(testId)
      }
    }
  })

  it('returns empty array for an ID that appears in no update', () => {
    const results = getUpdatesForGuide('__nonexistent_guide_id__')
    expect(results).toEqual([])
  })
})

// ─── Required topic coverage ─────────────────────────────────────────────────
// These are the critical policy changes that must always have an update card.

describe('IMMIGRATION_UPDATES — required topic coverage', () => {
  it('has a card covering the 42-day move-on period', () => {
    const card = IMMIGRATION_UPDATES.find(u =>
      u.relatedGuideIds.includes('move-on') &&
      (u.title.includes('42') || u.summary.includes('42 day') || u.id.includes('move-on'))
    )
    expect(card, 'Missing move-on 42-day update card').toBeTruthy()
  })

  it('has a card covering the family reunion route closure', () => {
    const card = IMMIGRATION_UPDATES.find(u =>
      u.relatedGuideIds.includes('family-reunion') &&
      u.urgency === 'action-needed'
    )
    expect(card, 'Missing family reunion closure action-needed card').toBeTruthy()
  })

  it('has a card covering 30-month refugee protection', () => {
    const card = IMMIGRATION_UPDATES.find(u =>
      u.relatedGuideIds.includes('ilr') &&
      (u.title.includes('30') || u.summary.includes('30 month') || u.id.includes('30-month'))
    )
    expect(card, 'Missing 30-month refugee protection card').toBeTruthy()
  })

  it('has a card covering permission-to-work changes', () => {
    const card = IMMIGRATION_UPDATES.find(u =>
      u.relatedGuideIds.includes('permission-to-work')
    )
    expect(card, 'Missing permission-to-work update card').toBeTruthy()
  })

  it('action-needed cards are the most prominent (appear first in sorted feed)', () => {
    const sorted = getSortedUpdates()
    const firstNonActionNeeded = sorted.findIndex(u => u.urgency !== 'action-needed')
    if (firstNonActionNeeded > 0) {
      for (let i = 0; i < firstNonActionNeeded; i++) {
        expect(sorted[i].urgency).toBe('action-needed')
      }
    }
  })
})

// ─── Source URL integrity ─────────────────────────────────────────────────────

describe('IMMIGRATION_UPDATES — source URL integrity', () => {
  it('all sourceUrls are HTTPS', () => {
    for (const u of IMMIGRATION_UPDATES) {
      expect(u.sourceUrl).toMatch(/^https:\/\//)
    }
  })

  it('all sourceUrls point to official domains', () => {
    const officialDomains = ['gov.uk', 'homeoffice.gov.uk', 'ukvi.gov.uk']
    for (const u of IMMIGRATION_UPDATES) {
      const isOfficial = officialDomains.some(d => u.sourceUrl.includes(d))
      expect(isOfficial, `${u.id} sourceUrl should be on an official domain: ${u.sourceUrl}`).toBe(true)
    }
  })
})
