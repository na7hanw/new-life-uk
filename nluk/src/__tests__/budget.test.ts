import { describe, it, expect } from 'vitest'
import {
  computeBudget,
  keptFromEarnings,
  capForSingleAdult,
  lhaFor,
  LHA_BY_PREFIX,
  UC_STANDARD_SINGLE_25_PLUS,
  TAPER_RATE,
  SHARED_RATE_MAX_AGE,
} from '../lib/budget.ts'

const BOLTON = LHA_BY_PREFIX.BL

describe('the shared accommodation rate', () => {
  it('applies to a single adult under 35 even in a self-contained flat', () => {
    expect(capForSingleAdult(BOLTON, 30)).toBe(BOLTON.shared)
    expect(capForSingleAdult(BOLTON, 34)).toBe(BOLTON.shared)
  })

  it('lifts to the one-bed rate at 35', () => {
    expect(capForSingleAdult(BOLTON, SHARED_RATE_MAX_AGE)).toBe(BOLTON.oneBed)
  })

  it('sits below DWP’s own market figure for the same area', () => {
    // The rate has been frozen since April 2024. The gap is the point.
    expect(BOLTON.marketShared).toBeGreaterThan(BOLTON.shared)
  })
})

describe('rent above the cap comes out of living costs', () => {
  it('pays only up to the cap and reports the rest as a shortfall', () => {
    const b = computeBudget({ rent: 450, lhaCap: BOLTON.shared })
    expect(b.housingElement).toBeCloseTo(BOLTON.shared, 2)
    expect(b.shortfall).toBeCloseTo(450 - BOLTON.shared, 2)
  })

  it('reports no shortfall when the rent is within the cap', () => {
    const b = computeBudget({ rent: 300, lhaCap: BOLTON.shared })
    expect(b.shortfall).toBe(0)
    expect(b.housingElement).toBe(300)
  })

  it('leaves a single adult on a typical Bolton room well short', () => {
    // A market-typical room, no earnings, no council tax (HMO).
    const b = computeBudget({ rent: 600, lhaCap: BOLTON.shared })
    expect(b.leftOver).toBeLessThan(200)
    expect(b.perDay).toBeLessThan(7)
  })

  it('does not round a negative position up to zero', () => {
    // The exact case the calculation exists for must not be hidden.
    const b = computeBudget({ rent: 900, lhaCap: BOLTON.shared })
    expect(b.leftOver).toBeLessThan(0)
  })
})

describe('the taper, with no work allowance', () => {
  it('keeps 45p in the pound', () => {
    expect(keptFromEarnings(100)).toBeCloseTo(45, 6)
    expect(keptFromEarnings(400)).toBeCloseTo(180, 6)
  })

  it('applies from the first pound for a single claimant', () => {
    const none = computeBudget({ rent: 400, lhaCap: BOLTON.shared })
    const some = computeBudget({ rent: 400, lhaCap: BOLTON.shared, earnings: 100 })
    expect(some.totalIncome - none.totalIncome).toBeCloseTo(100 * (1 - TAPER_RATE), 6)
  })

  it('never drives the award below zero', () => {
    const b = computeBudget({ rent: 300, lhaCap: BOLTON.shared, earnings: 5000 })
    expect(b.ucAwarded).toBe(0)
    expect(b.totalIncome).toBe(5000)
  })

  it('never returns a negative housing element or shortfall', () => {
    const b = computeBudget({ rent: -50, lhaCap: -10 })
    expect(b.housingElement).toBeGreaterThanOrEqual(0)
    expect(b.shortfall).toBeGreaterThanOrEqual(0)
  })
})

describe('deductions', () => {
  it('reduces the award', () => {
    const without = computeBudget({ rent: 400, lhaCap: BOLTON.shared })
    const with_ = computeBudget({ rent: 400, lhaCap: BOLTON.shared, deductions: 30 })
    expect(without.ucAwarded - with_.ucAwarded).toBeCloseTo(30, 6)
  })

  it('flags deductions above the 15% cap', () => {
    const cap = UC_STANDARD_SINGLE_25_PLUS * 0.15
    expect(computeBudget({ rent: 400, lhaCap: 341.51, deductions: cap - 1 }).deductionsOverCap).toBe(false)
    expect(computeBudget({ rent: 400, lhaCap: 341.51, deductions: cap + 1 }).deductionsOverCap).toBe(true)
  })
})

describe('postcode lookup', () => {
  it('resolves a Bolton postcode to the Bolton and Bury rates', () => {
    expect(lhaFor('BL5 3SB')?.area).toBe('Bolton and Bury')
    expect(lhaFor('bl1')?.shared).toBe(BOLTON.shared)
  })

  it('returns null for an area with no data rather than guessing', () => {
    expect(lhaFor('SW1A 1AA')).toBeNull()
    expect(lhaFor('')).toBeNull()
  })
})
