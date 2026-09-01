import { describe, it, expect } from 'vitest'
import { isFromHost, isFromAnyHost } from '../lib/hostMatch.ts'

describe('isFromHost', () => {
  it('accepts the exact host and subdomains', () => {
    expect(isFromHost('https://gov.uk/universal-credit', 'gov.uk')).toBe(true)
    expect(isFromHost('https://www.gov.uk/universal-credit', 'gov.uk')).toBe(true)
    expect(isFromHost('https://nationalcareers.service.gov.uk/x', 'gov.uk')).toBe(true)
  })

  it('rejects a lookalike host that merely ends in the string', () => {
    expect(isFromHost('https://gov.uk.evil.com/', 'gov.uk')).toBe(false)
    expect(isFromHost('https://notgov.uk/', 'gov.uk')).toBe(false)
  })

  it('rejects the domain appearing in the path or query', () => {
    // This is the case the old url.includes('gov.uk') check let through, which
    // made the assertions using it pass without testing anything.
    expect(isFromHost('https://evil.example.com/?ref=gov.uk', 'gov.uk')).toBe(false)
    expect(isFromHost('https://evil.example.com/gov.uk/apply', 'gov.uk')).toBe(false)
  })

  it('is case-insensitive on both sides', () => {
    expect(isFromHost('https://WWW.GOV.UK/x', 'GOV.UK')).toBe(true)
  })

  it('returns false for an unparseable URL rather than throwing', () => {
    expect(isFromHost('not a url', 'gov.uk')).toBe(false)
    expect(isFromHost('', 'gov.uk')).toBe(false)
  })
})

describe('isFromAnyHost', () => {
  it('matches when any domain matches', () => {
    expect(isFromAnyHost('https://www.fca.org.uk/x', ['gov.uk', 'fca.org.uk'])).toBe(true)
  })

  it('is false when none match', () => {
    expect(isFromAnyHost('https://example.com/gov.uk', ['gov.uk', 'fca.org.uk'])).toBe(false)
  })

  it('is false for an empty domain list', () => {
    expect(isFromAnyHost('https://www.gov.uk/x', [])).toBe(false)
  })
})
