import { describe, it, expect } from 'vitest'
import { postcodeArea } from '../lib/postcode.ts'
import { areaForPostcode } from '../data/local.ts'
import { lhaFor } from '../lib/budget.ts'

describe('postcodeArea', () => {
  it('keeps only the leading letters', () => {
    expect(postcodeArea('BL5 3SB')).toBe('BL')
    expect(postcodeArea('bl5 3sb')).toBe('BL')
    expect(postcodeArea('M1 1AE')).toBe('M')
    expect(postcodeArea('SW1A 1AA')).toBe('SW')
  })

  it('discards the digits that identify a street', () => {
    // The whole point: "BL" is a borough, "BL5 3SB" is an address.
    for (const full of ['BL5 3SB', 'BL1 1RU', 'BL3 2HX']) {
      expect(postcodeArea(full)).toBe('BL')
      expect(postcodeArea(full)).not.toContain('3')
      expect(postcodeArea(full).length).toBeLessThanOrEqual(2)
    }
  })

  it('is already idempotent for a value that is only an area', () => {
    expect(postcodeArea('BL')).toBe('BL')
    expect(postcodeArea(postcodeArea('BL5 3SB'))).toBe('BL')
  })

  it('stores nothing rather than storing junk', () => {
    expect(postcodeArea('')).toBe('')
    expect(postcodeArea('   ')).toBe('')
    expect(postcodeArea('12345')).toBe('')
    expect(postcodeArea('!!')).toBe('')
  })

  it('never returns more than two characters', () => {
    for (const s of ['ABCDEF', 'BL5 3SB', 'EC1A 1BB', 'x']) {
      expect(postcodeArea(s).length).toBeLessThanOrEqual(2)
    }
  })
})

describe('the area alone is enough for everything the app does', () => {
  it('still resolves local services', () => {
    expect(areaForPostcode(postcodeArea('BL5 3SB'))?.name).toBe('Bolton')
  })

  it('still resolves the Local Housing Allowance rates', () => {
    expect(lhaFor(postcodeArea('BL5 3SB'))?.area).toBe('Bolton and Bury')
  })

  it('gives the same answer as the full postcode did', () => {
    expect(areaForPostcode(postcodeArea('BL5 3SB'))).toEqual(areaForPostcode('BL5 3SB'))
    expect(lhaFor(postcodeArea('BL5 3SB'))).toEqual(lhaFor('BL5 3SB'))
  })
})
