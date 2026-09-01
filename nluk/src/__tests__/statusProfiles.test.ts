/**
 * Status profile registry integrity.
 *
 * This replaced four independently-maintained maps across three files. For
 * `asylum-seeker` they spanned 13 distinct guide ids with exactly ONE present
 * in all four, and only one of the four had any test coverage — so the drift
 * was invisible until someone read all four side by side.
 *
 * These assertions are what stops it happening again.
 */
import { describe, it, expect } from 'vitest'
import { STATUS_PROFILES, forYouGuideIds, FOR_YOU_COUNT } from '../data/status-profiles.ts'
import { GUIDE_MAP, GUIDE_STATUS_ORDER, orderGuides } from '../data/guides.ts'
import { GUIDES } from '../data/guides.ts'
import { VALID_STATUSES } from '../types'

const STATUSES = Object.keys(STATUS_PROFILES) as (keyof typeof STATUS_PROFILES)[]

describe('referential integrity', () => {
  it('covers every real status', () => {
    const real = VALID_STATUSES.filter(Boolean)
    expect(STATUSES.sort()).toEqual([...real].sort())
  })

  it('only references guide ids that exist', () => {
    for (const status of STATUSES) {
      const p = STATUS_PROFILES[status]
      const ids = [...p.boost, ...p.bury, ...p.alertGuides, ...p.nextSteps.map(s => s.guideId)]
      for (const id of ids) {
        expect(GUIDE_MAP[id], `${status} references unknown guide "${id}"`).toBeTruthy()
      }
    }
  })

  it('never both boosts and buries the same guide', () => {
    for (const status of STATUSES) {
      const { boost, bury } = STATUS_PROFILES[status]
      const overlap = boost.filter(id => bury.includes(id))
      expect(overlap, `${status} both boosts and buries: ${overlap.join(', ')}`).toEqual([])
    }
  })

  it('has no duplicates within a list', () => {
    for (const status of STATUSES) {
      const p = STATUS_PROFILES[status]
      for (const [name, list] of Object.entries({ boost: p.boost, bury: p.bury, alertGuides: p.alertGuides })) {
        expect(new Set(list).size, `${status}.${name} has duplicates`).toBe(list.length)
      }
    }
  })

  it('gives every status something in each field', () => {
    for (const status of STATUSES) {
      const p = STATUS_PROFILES[status]
      expect(p.boost.length, `${status} has no boost list`).toBeGreaterThan(0)
      expect(p.nextSteps.length, `${status} has no next steps`).toBeGreaterThan(0)
      expect(p.alertGuides.length, `${status} has no alert guides`).toBeGreaterThan(0)
    }
  })
})

describe('"For You" is derived, not hand-listed', () => {
  it('is exactly the head of the boost list', () => {
    for (const status of STATUSES) {
      expect(forYouGuideIds(status)).toEqual(STATUS_PROFILES[status].boost.slice(0, FOR_YOU_COUNT))
    }
  })

  it('returns nothing when no status is set', () => {
    expect(forYouGuideIds('')).toEqual([])
  })

  it('matches the top of the ordered list, so the two cannot disagree', () => {
    for (const status of STATUSES) {
      const ordered = orderGuides(GUIDES, status).map(g => g.id)
      expect(ordered.slice(0, FOR_YOU_COUNT)).toEqual(forYouGuideIds(status))
    }
  })
})

describe('GUIDE_STATUS_ORDER is derived from the registry', () => {
  it('mirrors boost and bury exactly', () => {
    for (const status of STATUSES) {
      expect(GUIDE_STATUS_ORDER[status]).toEqual({
        boost: STATUS_PROFILES[status].boost,
        bury: STATUS_PROFILES[status].bury,
      })
    }
  })
})

describe('the cohort-specific traps stay buried', () => {
  it('buries nrpf for refugees — it says they cannot claim Universal Credit', () => {
    expect(STATUS_PROFILES.refugee.bury).toContain('nrpf')
  })

  it('buries asylum-process content for refugees', () => {
    for (const id of ['asylum-waiting', 'aspen-card', 'permission-to-work']) {
      expect(STATUS_PROFILES.refugee.bury).toContain(id)
    }
  })

  it('buries refugee-only content for asylum seekers', () => {
    for (const id of ['move-on', 'refugee-integration', 'ilr']) {
      expect(STATUS_PROFILES['asylum-seeker'].bury).toContain(id)
    }
  })

  it('leads refugees with move-on and Universal Credit', () => {
    expect(STATUS_PROFILES.refugee.boost.slice(0, 2)).toEqual(['move-on', 'uc'])
  })

  it('does not promise refugees settlement at a fixed number of years', () => {
    // That horizon is wrong by ~15 years for anyone who claimed on or after
    // 2 March 2026, so the Next Steps copy must stay cohort-neutral.
    const text = STATUS_PROFILES.refugee.nextSteps.map(s => s.text).join(' ')
    expect(text).not.toMatch(/year 1 to year 5|after 5 years/i)
  })
})
