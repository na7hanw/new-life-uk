/**
 * Tests for src/lib/utils.ts
 * Covers: ls(), lsSet(), t18().
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { ls, lsSet, t18 } from '../lib/utils.ts'

// ─── ls() / lsSet() ──────────────────────────────────────────────────────────

describe('ls — localStorage reads', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the default value when the key is not set', () => {
    expect(ls('nluk_missing', 'fallback')).toBe('fallback')
  })

  it('returns the stored value when the key exists', () => {
    localStorage.setItem('nluk_test', 'hello')
    expect(ls('nluk_test', '')).toBe('hello')
  })

  it('returns the default when localStorage.getItem returns null', () => {
    // setItem never called → getItem returns null
    expect(ls('nluk_never_set', 'default')).toBe('default')
  })
})

describe('lsSet — localStorage writes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists a value that ls() can then read back', () => {
    lsSet('nluk_persist', 'stored')
    expect(ls('nluk_persist', '')).toBe('stored')
  })

  it('overwrites an existing value', () => {
    lsSet('nluk_key', 'first')
    lsSet('nluk_key', 'second')
    expect(ls('nluk_key', '')).toBe('second')
  })
})

// ─── t18() ────────────────────────────────────────────────────────────────────

describe('t18 — i18n content lookup', () => {
  const content = {
    en: { title: 'Bank Account', summary: 'Open a bank account.' },
    fr: { title: 'Compte bancaire', summary: 'Ouvrir un compte.' },
  }

  it('returns the requested language entry when it exists', () => {
    const result = t18(content, 'fr')
    expect(result).toEqual(content.fr)
  })

  it('returns the English entry for lang="en"', () => {
    const result = t18(content, 'en')
    expect(result).toEqual(content.en)
  })

  it('falls back to English when the requested language is not present', () => {
    const result = t18(content, 'ar')
    expect(result).toEqual(content.en)
  })

  it('returns an empty object when the source is null', () => {
    const result = t18(null, 'en')
    expect(result).toEqual({})
  })

  it('returns an empty object when the source is undefined', () => {
    const result = t18(undefined, 'en')
    expect(result).toEqual({})
  })

  it('returns an empty object when neither the requested language nor English exists', () => {
    const result = t18({} as typeof content, 'ar')
    expect(result).toEqual({})
  })
})
