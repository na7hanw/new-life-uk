/**
 * epic_simplify_certs_careers_founder_first
 *
 * Verifies the founder-first / grant-status-ready ordering of certs and careers.
 * Rules:
 *   - At least 8 certs must have founderOrder defined
 *   - At least 6 careers must have founderOrder defined
 *   - founderOrder values within each collection are unique (no ties ambiguity)
 *   - Sorting by founderOrder puts tagged items before untagged
 *   - The top-3 certs by founderOrder are universally applicable:
 *     cscs-card (10), first-aid (12), dbs-check (16)
 *   - The top-3 careers include language/interpreting, housing, and digital paths
 *   - founderOrder values are all positive integers (schema constraint)
 */
import { describe, it, expect } from 'vitest'
import { CERTS, CAREERS, CAREER_MAP } from '../data/jobs.ts'
import type { Cert, Career } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function byFounderOrder<T extends { founderOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.founderOrder ?? 9999) - (b.founderOrder ?? 9999))
}

const certsTyped = CERTS as unknown as Cert[]
const careersTyped = CAREERS as unknown as Career[]

const taggedCerts = certsTyped.filter(c => c.founderOrder !== undefined)
const taggedCareers = careersTyped.filter(c => c.founderOrder !== undefined)

// ─── Certs: tagging coverage ──────────────────────────────────────────────────

describe('Founder-first certs — tagging', () => {
  it('at least 8 certs have founderOrder defined', () => {
    expect(taggedCerts.length, 'Fewer than 8 certs tagged with founderOrder').toBeGreaterThanOrEqual(8)
  })

  it('all founderOrder values are positive integers', () => {
    for (const c of taggedCerts) {
      expect(c.founderOrder! % 1, `${c.id} founderOrder is not an integer`).toBe(0)
      expect(c.founderOrder!, `${c.id} founderOrder must be positive`).toBeGreaterThan(0)
    }
  })

  it('founderOrder values are unique across certs', () => {
    const orders = taggedCerts.map(c => c.founderOrder!)
    const unique = new Set(orders)
    expect(unique.size, 'Duplicate founderOrder values found in certs').toBe(orders.length)
  })
})

// ─── Certs: sort order ────────────────────────────────────────────────────────

describe('Founder-first certs — sort order', () => {
  it('sorted list has all tagged certs before any untagged certs', () => {
    const sorted = byFounderOrder(certsTyped)
    const firstUntaggedIdx = sorted.findIndex(c => c.founderOrder === undefined)
    const lastTaggedIdx = sorted.map(c => c.founderOrder).lastIndexOf(
      sorted.filter(c => c.founderOrder !== undefined).at(-1)?.founderOrder
    )
    if (firstUntaggedIdx === -1) return // all tagged — trivially passes
    expect(firstUntaggedIdx, 'An untagged cert appears before a tagged cert').toBeGreaterThan(lastTaggedIdx)
  })

  it('cscs-card is in the top 3 by founderOrder', () => {
    const sorted = byFounderOrder(certsTyped)
    const idx = sorted.findIndex(c => c.id === 'cscs-card')
    expect(idx, 'cscs-card not found in CERTS').toBeGreaterThanOrEqual(0)
    expect(idx, 'cscs-card should be in the top 3 founder-first certs').toBeLessThan(3)
  })

  it('dbs-check is in the top 3 by founderOrder', () => {
    const sorted = byFounderOrder(certsTyped)
    const idx = sorted.findIndex(c => c.id === 'dbs-check')
    expect(idx, 'dbs-check not found in CERTS').toBeGreaterThanOrEqual(0)
    expect(idx, 'dbs-check (universal credential for housing/care/admin) should be in the top 3 founder-first certs').toBeLessThan(3)
  })

  it('first-aid is in the top 5 by founderOrder', () => {
    const sorted = byFounderOrder(certsTyped)
    const idx = sorted.findIndex(c => c.id === 'first-aid')
    expect(idx, 'first-aid not found in CERTS').toBeGreaterThanOrEqual(0)
    expect(idx, 'first-aid should be in the top 5 founder-first certs').toBeLessThan(5)
  })
})

// ─── Careers: tagging coverage ───────────────────────────────────────────────

describe('Founder-first careers — tagging', () => {
  it('at least 10 careers have founderOrder defined', () => {
    expect(taggedCareers.length, 'Fewer than 10 careers tagged with founderOrder').toBeGreaterThanOrEqual(10)
  })

  it('all founderOrder values are positive integers', () => {
    for (const c of taggedCareers) {
      expect(c.founderOrder! % 1, `${c.id} founderOrder is not an integer`).toBe(0)
      expect(c.founderOrder!, `${c.id} founderOrder must be positive`).toBeGreaterThan(0)
    }
  })

  it('founderOrder values are unique across careers', () => {
    const orders = taggedCareers.map(c => c.founderOrder!)
    const unique = new Set(orders)
    expect(unique.size, 'Duplicate founderOrder values found in careers').toBe(orders.length)
  })
})

// ─── Careers: sort order ─────────────────────────────────────────────────────

describe('Founder-first careers — sort order', () => {
  it('sorted list has all tagged careers before any untagged careers', () => {
    const sorted = byFounderOrder(careersTyped)
    const firstUntaggedIdx = sorted.findIndex(c => c.founderOrder === undefined)
    const lastTaggedIdx = sorted.map(c => c.founderOrder).lastIndexOf(
      sorted.filter(c => c.founderOrder !== undefined).at(-1)?.founderOrder
    )
    if (firstUntaggedIdx === -1) return // all tagged — trivially passes
    expect(firstUntaggedIdx, 'An untagged career appears before a tagged career').toBeGreaterThan(lastTaggedIdx)
  })

  // Note: CAREER_IDS.forEach assigns final IDs — use CAREER_MAP for reliable lookups.
  it('translation is the top career by founderOrder', () => {
    const sorted = byFounderOrder(careersTyped)
    const idx = sorted.findIndex(c => c.id === 'translation')
    expect(CAREER_MAP['translation'], 'translation career missing from CAREER_MAP').toBeTruthy()
    expect(idx, 'translation should be first in founder-first career list').toBe(0)
  })

  it('gas-engineer is in the top 3 by founderOrder (fastest high-earning trade, UK shortage)', () => {
    const sorted = byFounderOrder(careersTyped)
    const idx = sorted.findIndex(c => c.id === 'gas-engineer')
    expect(CAREER_MAP['gas-engineer'], 'gas-engineer career missing from CAREER_MAP').toBeTruthy()
    expect(idx, 'gas-engineer should be in the top 3 founder-first careers').toBeLessThan(3)
  })

  it('tech-digital is in the top 6 by founderOrder', () => {
    const sorted = byFounderOrder(careersTyped)
    const idx = sorted.findIndex(c => c.id === 'tech-digital')
    expect(CAREER_MAP['tech-digital'], 'tech-digital career missing from CAREER_MAP').toBeTruthy()
    expect(idx, 'tech-digital should be in the top 6 founder-first careers').toBeLessThan(6)
  })

  it('healthcare is in the top 10 by founderOrder', () => {
    const sorted = byFounderOrder(careersTyped)
    const idx = sorted.findIndex(c => c.id === 'healthcare')
    expect(CAREER_MAP['healthcare'], 'healthcare career missing from CAREER_MAP').toBeTruthy()
    expect(idx, 'healthcare should be in the top 10 founder-first careers').toBeLessThan(10)
  })
})

// ─── "Start here" badge threshold (founderOrder ≤ 20) ────────────────────────

describe('"Start here" badge threshold (founderOrder ≤ 20)', () => {
  it('cscs-card has founderOrder ≤ 20 (qualifies for Start-here badge)', () => {
    const cert = certsTyped.find(c => c.id === 'cscs-card')
    expect(cert?.founderOrder, 'cscs-card founderOrder must be ≤ 20 for Start-here badge').toBeLessThanOrEqual(20)
  })

  it('dbs-check has founderOrder ≤ 20 (qualifies for Start-here badge)', () => {
    const cert = certsTyped.find(c => c.id === 'dbs-check')
    expect(cert?.founderOrder, 'dbs-check founderOrder must be ≤ 20 for Start-here badge').toBeLessThanOrEqual(20)
  })

  it('first-aid has founderOrder ≤ 20 (qualifies for Start-here badge)', () => {
    const cert = certsTyped.find(c => c.id === 'first-aid')
    expect(cert?.founderOrder, 'first-aid founderOrder must be ≤ 20 for Start-here badge').toBeLessThanOrEqual(20)
  })

  it('exactly 3 certs have founderOrder ≤ 20 (Start-here badge count is intentional)', () => {
    const badgeCerts = certsTyped.filter(c => c.founderOrder !== undefined && c.founderOrder <= 20)
    expect(badgeCerts.length, 'Start-here badge count should be exactly 3 (cscs-card, first-aid, dbs-check)').toBe(3)
  })
})
