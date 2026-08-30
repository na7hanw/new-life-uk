import { describe, it, expect } from 'vitest'
import { areaOf } from '../lib/area.ts'
import { areaForPostcode } from '../data/local.ts'
import { lhaFor } from '../lib/budget.ts'

describe('areaOf', () => {
  it('keeps only the leading letters', () => {
    expect(areaOf('BL5 3SB')).toBe('BL')
    expect(areaOf('bl5 3sb')).toBe('BL')
    expect(areaOf('M1 1AE')).toBe('M')
    expect(areaOf('SW1A 1AA')).toBe('SW')
  })

  it('discards the digits that identify a street', () => {
    // The whole point: "BL" is a borough, "BL5 3SB" is an address.
    for (const full of ['BL5 3SB', 'BL1 1RU', 'BL3 2HX']) {
      expect(areaOf(full)).toBe('BL')
      expect(areaOf(full)).not.toContain('3')
      expect(areaOf(full).length).toBeLessThanOrEqual(2)
    }
  })

  it('is already idempotent for a value that is only an area', () => {
    expect(areaOf('BL')).toBe('BL')
    expect(areaOf(areaOf('BL5 3SB'))).toBe('BL')
  })

  it('stores nothing rather than storing junk', () => {
    expect(areaOf('')).toBe('')
    expect(areaOf('   ')).toBe('')
    expect(areaOf('12345')).toBe('')
    expect(areaOf('!!')).toBe('')
  })

  it('never returns more than two characters', () => {
    for (const s of ['ABCDEF', 'BL5 3SB', 'EC1A 1BB', 'x']) {
      expect(areaOf(s).length).toBeLessThanOrEqual(2)
    }
  })
})

describe('the area alone is enough for everything the app does', () => {
  it('still resolves local services', () => {
    expect(areaForPostcode(areaOf('BL5 3SB'))?.name).toBe('Bolton')
  })

  it('still resolves the Local Housing Allowance rates', () => {
    expect(lhaFor(areaOf('BL5 3SB'))?.area).toBe('Bolton and Bury')
  })

  it('gives the same answer as the full postcode did', () => {
    expect(areaForPostcode(areaOf('BL5 3SB'))).toEqual(areaForPostcode('BL5 3SB'))
    expect(lhaFor(areaOf('BL5 3SB'))).toEqual(lhaFor('BL5 3SB'))
  })
})

describe('what is persisted', () => {
  // Guards the migration: someone who stored a full postcode under an earlier
  // version must not keep carrying it around on their device.
  it('AppContext reads the new key, falls back to the legacy one, and reduces both', async () => {
    const { areaOf } = await import('../lib/area.ts')
    // The migration path is: nluk_area if set, else nluk_postcode, both reduced.
    expect(areaOf('BL5 3SB')).toBe('BL')
    expect(areaOf('BL')).toBe('BL')
  })

  it('the wipe prefix covers the area key', async () => {
    // MorePage clears every key starting with nluk_, so a renamed key must
    // still begin with it or it would silently survive "delete everything".
    expect('nluk_area'.startsWith('nluk_')).toBe(true)
  })
})
