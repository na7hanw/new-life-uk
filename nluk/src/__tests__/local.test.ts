/**
 * Local services.
 *
 * The app repeatedly said "contact your local council housing team" without
 * ever saying which one or how. On day 3 of a 42-day clock that is not
 * actionable. These assertions guard the data that makes it actionable.
 */
import { describe, it, expect } from 'vitest'
import { LOCAL_AREAS, areaForPostcode, servicesFor } from '../data/local.ts'

describe('postcode matching', () => {
  it('resolves a Bolton postcode', () => {
    expect(areaForPostcode('BL5 3SB')?.id).toBe('bolton')
  })

  it('is case- and space-insensitive', () => {
    expect(areaForPostcode('bl5 3sb')?.id).toBe('bolton')
    expect(areaForPostcode('  BL13AB ')?.id).toBe('bolton')
  })

  it('returns undefined for an unknown or empty postcode rather than guessing', () => {
    expect(areaForPostcode('SW1A 1AA')).toBeUndefined()
    expect(areaForPostcode('')).toBeUndefined()
    expect(areaForPostcode(undefined)).toBeUndefined()
    expect(areaForPostcode('12345')).toBeUndefined()
  })
})

describe('status filtering', () => {
  const bolton = LOCAL_AREAS.find(a => a.id === 'bolton')!

  it('shows everything when no status is set', () => {
    expect(servicesFor(bolton)).toHaveLength(bolton.services.length)
  })

  it('keeps unrestricted services for every status', () => {
    const forRefugee = servicesFor(bolton, 'refugee').map(s => s.name)
    expect(forRefugee).toContain('BRASS — Befriending Refugees and Asylum Seekers')
  })

  it('hides refugee-only services from asylum seekers', () => {
    const forAsylum = servicesFor(bolton, 'asylum-seeker').map(s => s.name)
    // Joining the housing register is a post-status action.
    expect(forAsylum).not.toContain('Homes for Bolton')
  })

  it('returns nothing for an unknown area', () => {
    expect(servicesFor(undefined, 'refugee')).toEqual([])
  })
})

describe('the data is actually usable', () => {
  const all = LOCAL_AREAS.flatMap(a => a.services)

  it('gives every service a reason it matters, not just a name', () => {
    for (const s of all) {
      expect(s.why.length, `${s.name} has no "why"`).toBeGreaterThan(30)
    }
  })

  it('gives every service at least one way to reach it', () => {
    for (const s of all) {
      expect(s.phone || s.email || s.url, `${s.name} has no contact route`).toBeTruthy()
    }
  })

  it('stores phone numbers digits-only so tel: links work', () => {
    for (const s of all) {
      if (!s.phone) continue
      expect(s.phone, `${s.name} phone must be digits only`).toMatch(/^[0-9]+$/)
      expect(s.phone, `${s.name}: phone must equal num without spaces`).toBe(s.num?.replace(/\s/g, ''))
    }
  })

  it('carries the Housing Options number, which is the day-1 call', () => {
    const ho = all.find(s => s.name.includes('Housing Options'))!
    expect(ho.phone).toBe('01204335900')
    expect(ho.why).toMatch(/prevention duty/i)
  })

  it('uses https for every link', () => {
    for (const s of all) {
      if (s.url) expect(s.url, `${s.name}`).toMatch(/^https:\/\//)
    }
  })
})
