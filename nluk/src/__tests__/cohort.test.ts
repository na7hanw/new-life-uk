/**
 * Refugee cohort derivation.
 *
 * The app previously keyed the 2 March 2026 reform off the DECISION date. It is
 * the CLAIM date. With decisions taking 6–18+ months, that error misclassified
 * essentially every 2026 grant in both directions — telling people on 5-year
 * leave they were on 30-month leave, and telling people facing a 20-year
 * settlement route that they could settle in 5.
 */
import { describe, it, expect } from 'vitest'
import { deriveCohort, cohortFacts, CORE_PROTECTION_FROM } from '../lib/cohort.ts'

describe('the cutoff is the claim date', () => {
  it('treats a claim on 1 March 2026 as legacy', () => {
    expect(deriveCohort('2026-03-01')).toBe('legacy')
  })

  it('treats a claim on 2 March 2026 as core protection', () => {
    expect(deriveCohort('2026-03-02')).toBe('core-protection')
  })

  it('is legacy for a claim well before the cutoff, however late the decision', () => {
    // Right to Remain's worked example: claimed 20 Feb 2026, granted 10 Jun 2026
    // -> at least 5 years, because the CLAIM predates 2 March.
    expect(deriveCohort('2026-02-20')).toBe('legacy')
  })

  it('uses the documented cutoff constant', () => {
    expect(CORE_PROTECTION_FROM).toBe('2026-03-02')
  })
})

describe('unknown is a first-class answer', () => {
  it('does not guess when the claim date is missing', () => {
    expect(deriveCohort(undefined)).toBe('unknown')
    expect(deriveCohort('')).toBe('unknown')
    expect(deriveCohort(null)).toBe('unknown')
  })

  it('does not guess on a malformed date', () => {
    expect(deriveCohort('not-a-date')).toBe('unknown')
    expect(deriveCohort('2026-3-2')).toBe('unknown')
  })

  it('never silently defaults to legacy', () => {
    // Defaulting to legacy is how every refugee came to be told they could
    // settle after 5 years — wrong by 15 for the new cohort.
    expect(deriveCohort(undefined)).not.toBe('legacy')
  })
})

describe('the UASC carve-out', () => {
  it('keeps the 5-year minimum regardless of claim date', () => {
    expect(deriveCohort('2026-06-01', true)).toBe('legacy')
  })
})

describe('the facts each cohort gets', () => {
  it('gives legacy 5 years and settlement at 5', () => {
    const f = cohortFacts('legacy')
    expect(f.leave).toBe('5 years')
    expect(f.settlementYears).toBe(5)
    expect(f.renewable).toBe(false)
    // Settlement is fee-free on the protection route, and KoLL/B1 do not apply.
    expect(f.summary).toMatch(/free for refugees/i)
    expect(f.summary).toMatch(/Life in the UK/i)
  })

  it('gives core protection 30 months, renewable, and 20 years to settle', () => {
    const f = cohortFacts('core-protection')
    expect(f.leave).toBe('30 months')
    expect(f.settlementYears).toBe(20)
    expect(f.renewable).toBe(true)
    expect(f.summary).toMatch(/20 years/)
    // The rules are still landing; the app must not present one flat figure
    // as settled law.
    expect(f.summary).toMatch(/still being finalised|OISC/i)
  })

  it('explains the discriminator when the cohort is unknown', () => {
    const f = cohortFacts('unknown')
    expect(f.settlementYears).toBeNull()
    expect(f.summary).toMatch(/CLAIMED/)
    expect(f.summary).toMatch(/not the date you were decided/i)
  })

  it('never states a settlement horizon it cannot justify', () => {
    expect(cohortFacts('unknown').settlementYears).toBeNull()
  })
})
