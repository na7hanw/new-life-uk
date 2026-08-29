/**
 * Move-on date arithmetic.
 *
 * This is the highest-stakes calculation in the app: it tells someone the date
 * they have to be out of Home Office accommodation. It was previously computed
 * inline in ProfilePage.tsx, which has 0% test coverage, and used only one of
 * the two statutory clocks.
 */
import { describe, it, expect } from 'vitest'
import {
  computeMoveOnPlan,
  MOVE_ON_ACTIONS,
  ACCOMMODATION_DAYS,
  SUPPORT_MIN_DAYS,
  UC_WAIT_DAYS,
} from '../lib/moveOn.ts'
import { GUIDE_MAP } from '../data/guides.ts'

const iso = (d: Date) => d.toISOString().slice(0, 10)

describe('the two clocks', () => {
  it('uses 42 days from the grant when no discontinuation letter is known', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-09-01', today: new Date('2026-09-01') })
    expect(iso(p.accommodationDeadline!)).toBe('2026-10-13') // +42
    expect(p.supportFloor).toBeNull()
    expect(iso(p.deadline!)).toBe('2026-10-13')
    expect(p.daysLeft).toBe(ACCOMMODATION_DAYS)
  })

  it('takes the LATER date when the discontinuation letter pushes past the 42 days', () => {
    // Discontinuation arrives 3 weeks after the grant: 21 + 28 = day 49 > day 42.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      discontinuationDate: '2026-09-22',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.accommodationDeadline!)).toBe('2026-10-13')
    expect(iso(p.supportFloor!)).toBe('2026-10-20')
    expect(iso(p.deadline!), 'must take the later of the two').toBe('2026-10-20')
  })

  it('does not shorten the deadline when the support floor falls earlier', () => {
    // Discontinuation arrives same day: 0 + 28 = day 28 < day 42.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      discontinuationDate: '2026-09-01',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.supportFloor!)).toBe('2026-09-29')
    expect(iso(p.deadline!), 'must never be earlier than grant+42').toBe('2026-10-13')
  })

  it('reports a negative daysLeft once the deadline has passed', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-07-01', today: new Date('2026-09-01') })
    expect(p.daysLeft).toBeLessThan(0)
  })
})

describe('the Universal Credit gap', () => {
  it('shows a positive buffer when UC is claimed on day 1', () => {
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      ucClaimDate: '2026-09-01',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.ucFirstPayment!)).toBe('2026-10-06') // +35
    // Money lands 7 days before the deadline.
    expect(p.ucBufferDays).toBe(ACCOMMODATION_DAYS - UC_WAIT_DAYS)
    expect(p.ucBufferDays).toBeGreaterThan(0)
  })

  it('goes negative when the claim is delayed past the point of no return', () => {
    // Claiming on day 10 means money on day 45 — after the day-42 deadline.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      ucClaimDate: '2026-09-11',
      today: new Date('2026-09-11'),
    })
    expect(p.ucBufferDays!, 'money arrives after the deadline').toBeLessThan(0)
  })

  it('is the binding constraint, not the deadline itself', () => {
    // Only 7 days of slack exist even in the best case. That is the point.
    expect(ACCOMMODATION_DAYS - UC_WAIT_DAYS).toBe(7)
  })
})

describe('missing or malformed input', () => {
  it('returns nulls rather than throwing when no grant date is set', () => {
    const p = computeMoveOnPlan({ today: new Date('2026-09-01') })
    expect(p.deadline).toBeNull()
    expect(p.daysLeft).toBeNull()
    expect(p.ucBufferDays).toBeNull()
  })

  it('ignores an unparseable date instead of producing Invalid Date', () => {
    const p = computeMoveOnPlan({ grantDate: 'not-a-date', today: new Date('2026-09-01') })
    expect(p.accommodationDeadline).toBeNull()
    expect(p.deadline).toBeNull()
  })

  it('accepts a grant date in the near future, so the plan can be prepared in advance', () => {
    // Someone whose refusal has been withdrawn knows the grant is days away and
    // should be able to lay the plan out before the clock starts.
    const p = computeMoveOnPlan({ grantDate: '2026-09-05', today: new Date('2026-09-01') })
    expect(p.daysLeft).toBe(ACCOMMODATION_DAYS + 4)
  })
})

describe('the action sequence', () => {
  it('puts Universal Credit and the council application both on day 1', () => {
    const dayOne = MOVE_ON_ACTIONS.filter(a => a.byDay === 1).map(a => a.id)
    expect(dayOne).toEqual(expect.arrayContaining(['uc', 'council']))
  })

  it('puts the National Insurance number on day 1, because the UC Advance depends on it', () => {
    // SI 2024/341 reg 6: an Advance cannot be paid until a NINo is allocated.
    // The Advance is what bridges the five-week wait, so the number cannot sit
    // in the "later paperwork" bucket without breaking the plan that depends
    // on it. Same class of bug as bank-before-eVisa: a real dependency
    // inverted by topic-ordering.
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    const uc = MOVE_ON_ACTIONS.find(a => a.id === 'uc')!
    expect(ni.byDay).toBeLessThanOrEqual(uc.byDay)
  })

  it('does not promise the Advance unconditionally', () => {
    // It previously read "it arrives in days", which is only true once a NINo
    // exists. Someone with 42 days and no number would have planned around
    // money that cannot legally be paid to them yet.
    const uc = MOVE_ON_ACTIONS.find(a => a.id === 'uc')!
    expect(uc.detail).not.toMatch(/arrives in days/i)
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    expect(ni.detail).toMatch(/advance/i)
    expect(ni.detail).toMatch(/national insurance/i)
  })

  it('is ordered by deadline', () => {
    const days = MOVE_ON_ACTIONS.map(a => a.byDay)
    expect(days).toEqual([...days].sort((a, b) => a - b))
  })

  it('gives the council script, because the wording changes the outcome', () => {
    const council = MOVE_ON_ACTIONS.find(a => a.id === 'council')!
    expect(council.script).toMatch(/prevention duty/i)
    expect(council.script).toMatch(/56 days/)
    expect(council.script).toMatch(/Personalised Housing Plan/i)
  })

  it('asks for the extension before the deadline, not after', () => {
    const ext = MOVE_ON_ACTIONS.find(a => a.id === 'extension')!
    expect(ext.byDay).toBeLessThan(ACCOMMODATION_DAYS)
  })

  it('only links guides that exist', () => {
    for (const a of MOVE_ON_ACTIONS) {
      if (a.guideId) expect(GUIDE_MAP[a.guideId], `unknown guide "${a.guideId}"`).toBeTruthy()
    }
  })

  it('states the support floor as 28 days', () => {
    expect(SUPPORT_MIN_DAYS).toBe(28)
  })
})
