/**
 * Status-aware guide ordering.
 *
 * This app gives life-changing advice, and the top of the Guides list is the
 * highest-value real estate in it. Before this logic existed, GUIDE_PRIORITY was
 * status-blind: a newly recognised refugee opened the app onto "Waiting for Your
 * Asylum Decision" and the ASPEN/Section 95 guide — both obsolete the moment
 * status is granted. These tests lock that regression out.
 */
import { describe, it, expect } from 'vitest'
import { GUIDES, GUIDE_PRIORITY, GUIDE_STATUS_ORDER, guideRank, orderGuides } from '../data/guides.ts'

const idsFor = (status?: string) => orderGuides(GUIDES, status).map(g => g.id)

describe('orderGuides — refugee', () => {
  it('opens on move-on, not on asylum-process content', () => {
    expect(idsFor('refugee')[0]).toBe('move-on')
  })

  it('sinks guides that are obsolete once status is granted', () => {
    const ids = idsFor('refugee')
    for (const buried of ['asylum-waiting', 'aspen-card', 'permission-to-work']) {
      expect(ids.indexOf(buried)).toBeGreaterThan(ids.indexOf('move-on'))
    }
  })

  it('sinks the NRPF guide, which is factually wrong for refugees', () => {
    // Refugees have recourse to public funds; `nrpf` says "you cannot claim
    // Universal Credit". Surfacing it to a refugee is an active trap.
    const ids = idsFor('refugee')
    expect(ids.indexOf('nrpf')).toBeGreaterThan(ids.length / 2)
  })

  it('puts the money-and-housing essentials in the top handful', () => {
    const top = idsFor('refugee').slice(0, 6)
    expect(top).toEqual(expect.arrayContaining(['move-on', 'uc', 'housing-help']))
  })
})

describe('orderGuides — asylum-seeker', () => {
  it('opens on asylum-waiting', () => {
    expect(idsFor('asylum-seeker')[0]).toBe('asylum-waiting')
  })

  it('sinks refugee-only content that cannot be acted on yet', () => {
    const ids = idsFor('asylum-seeker')
    for (const buried of ['move-on', 'refugee-integration', 'ilr']) {
      expect(ids.indexOf(buried)).toBeGreaterThan(ids.indexOf('asylum-waiting'))
    }
  })
})

describe('orderGuides — fallback and invariants', () => {
  it('falls back to GUIDE_PRIORITY when no status is set', () => {
    expect(idsFor('')[0]).toBe(GUIDE_PRIORITY[0])
    expect(idsFor(undefined)[0]).toBe(GUIDE_PRIORITY[0])
  })

  it('ignores an unknown status rather than producing a broken order', () => {
    expect(idsFor('not-a-real-status')).toEqual(idsFor(''))
  })

  it('never drops or duplicates a guide', () => {
    for (const status of ['', 'asylum-seeker', 'refugee', 'other-visa', 'settled']) {
      const ids = idsFor(status)
      expect(ids).toHaveLength(GUIDES.length)
      expect(new Set(ids).size).toBe(GUIDES.length)
    }
  })

  it('does not mutate the input array', () => {
    const before = GUIDES.map(g => g.id)
    orderGuides(GUIDES, 'refugee')
    expect(GUIDES.map(g => g.id)).toEqual(before)
  })

  it('ranks every boosted guide above every buried one', () => {
    for (const [status, { boost, bury }] of Object.entries(GUIDE_STATUS_ORDER)) {
      const worstBoost = Math.max(...boost.map(id => guideRank(id, status)))
      const bestBury = Math.min(...bury.map(id => guideRank(id, status)))
      expect(worstBoost).toBeLessThan(bestBury)
    }
  })

  it('only references guide ids that actually exist', () => {
    const known = new Set(GUIDES.map(g => g.id))
    for (const [status, { boost, bury }] of Object.entries(GUIDE_STATUS_ORDER)) {
      for (const id of [...boost, ...bury]) {
        expect(known, `${status} references unknown guide "${id}"`).toContain(id)
      }
    }
  })
})
