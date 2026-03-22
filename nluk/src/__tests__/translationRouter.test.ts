/**
 * Tests for src/lib/translationRouter.ts
 * Covers: provider selection, fallback chain, unsupported pairs, language code mapping.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  selectProvider,
  isTranslationAvailable,
  BERGAMOT_SUPPORTED,
  LIBRE_SUPPORTED,
  NLLB_SUPPORTED,
  NLLB_LANG_CODES,
  isBergamotReady,
} from '../lib/translationRouter.ts'

// ─── Language set integrity ───────────────────────────────────────────────────

describe('Provider language sets', () => {
  it('BERGAMOT_SUPPORTED includes key EU languages', () => {
    for (const lang of ['fr', 'pl', 'ro', 'uk', 'de', 'es']) {
      expect(BERGAMOT_SUPPORTED.has(lang), `BERGAMOT_SUPPORTED missing ${lang}`).toBe(true)
    }
  })

  it('LIBRE_SUPPORTED covers all major app languages except low-resource ones', () => {
    for (const lang of ['ar', 'fa', 'fr', 'pl', 'uk', 'ro']) {
      expect(LIBRE_SUPPORTED.has(lang), `LIBRE_SUPPORTED missing ${lang}`).toBe(true)
    }
  })

  it('NLLB_SUPPORTED covers all 11 non-English app languages', () => {
    for (const lang of ['ar', 'fa', 'ur', 'am', 'ti', 'so', 'om', 'uk', 'ro', 'pl', 'fr']) {
      expect(NLLB_SUPPORTED.has(lang), `NLLB_SUPPORTED missing ${lang}`).toBe(true)
    }
  })

  it('NLLB_LANG_CODES has entries for all app low-resource languages', () => {
    const lowResource = ['am', 'ti', 'so', 'om', 'ur']
    for (const lang of lowResource) {
      expect(NLLB_LANG_CODES[lang], `NLLB_LANG_CODES missing ${lang}`).toBeTruthy()
    }
  })

  it('NLLB_LANG_CODES uses correct script suffixes for key languages', () => {
    expect(NLLB_LANG_CODES.am).toBe('amh_Ethi') // Amharic — Ethiopic script
    expect(NLLB_LANG_CODES.ti).toBe('tir_Ethi') // Tigrinya — Ethiopic script
    expect(NLLB_LANG_CODES.ar).toBe('arb_Arab') // Arabic — Arabic script
    expect(NLLB_LANG_CODES.ur).toBe('urd_Arab') // Urdu — Arabic script
    expect(NLLB_LANG_CODES.so).toBe('som_Latn') // Somali — Latin script
  })
})

// ─── isBergamotReady ─────────────────────────────────────────────────────────

describe('isBergamotReady', () => {
  afterEach(() => {
    // Clean up any bergamot stub
    delete (window as unknown as Record<string, unknown>).bergamot
  })

  it('returns false when window.bergamot is not defined', () => {
    expect(isBergamotReady()).toBe(false)
  })

  it('returns true when window.bergamot is defined', () => {
    ;(window as unknown as Record<string, unknown>).bergamot = { translate: vi.fn() }
    expect(isBergamotReady()).toBe(true)
  })
})

// ─── selectProvider — English passthrough ────────────────────────────────────

describe('selectProvider — English', () => {
  it('returns "none" for lang "en"', () => {
    expect(selectProvider('en')).toBe('none')
  })

  it('returns "none" for empty string', () => {
    expect(selectProvider('')).toBe('none')
  })
})

// ─── selectProvider — LibreTranslate path ────────────────────────────────────

describe('selectProvider — LibreTranslate (Provider B)', () => {
  it('selects libretranslate for Arabic (ar)', () => {
    expect(selectProvider('ar')).toBe('libretranslate')
  })

  it('selects libretranslate for Persian (fa)', () => {
    expect(selectProvider('fa')).toBe('libretranslate')
  })

  it('selects libretranslate for French (fr) when Bergamot is not ready', () => {
    // Bergamot not loaded in jsdom — falls through to LibreTranslate
    expect(selectProvider('fr')).toBe('libretranslate')
  })

  it('selects libretranslate for Polish (pl) when Bergamot is not ready', () => {
    expect(selectProvider('pl')).toBe('libretranslate')
  })

  it('selects libretranslate for Ukrainian (uk) when Bergamot is not ready', () => {
    expect(selectProvider('uk')).toBe('libretranslate')
  })

  it('selects libretranslate for Romanian (ro) when Bergamot is not ready', () => {
    expect(selectProvider('ro')).toBe('libretranslate')
  })
})

// ─── selectProvider — Bergamot path ──────────────────────────────────────────

describe('selectProvider — Bergamot (Provider A)', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).bergamot
  })

  it('prefers Bergamot over LibreTranslate when Bergamot is ready for a supported pair', () => {
    ;(window as unknown as Record<string, unknown>).bergamot = { translate: vi.fn() }
    // fr is supported by both Bergamot and LibreTranslate
    expect(selectProvider('fr')).toBe('bergamot')
  })

  it('falls through to LibreTranslate when Bergamot is ready but language not in Bergamot set', () => {
    ;(window as unknown as Record<string, unknown>).bergamot = { translate: vi.fn() }
    // ar is in LIBRE_SUPPORTED but NOT in BERGAMOT_SUPPORTED
    expect(selectProvider('ar')).toBe('libretranslate')
  })
})

// ─── selectProvider — NLLB path ──────────────────────────────────────────────

describe('selectProvider — NLLB (Provider C)', () => {
  it('returns "none" for Amharic (am) when NLLB endpoint is not configured', () => {
    // Default VITE_NLLB_ENDPOINT is empty — NLLB not available
    expect(selectProvider('am')).toBe('none')
  })

  it('returns "none" for Tigrinya (ti) when NLLB endpoint is not configured', () => {
    expect(selectProvider('ti')).toBe('none')
  })

  it('returns "none" for Somali (so) when NLLB endpoint is not configured', () => {
    expect(selectProvider('so')).toBe('none')
  })

  it('returns "none" for Oromo (om) when NLLB endpoint is not configured', () => {
    expect(selectProvider('om')).toBe('none')
  })

  it('returns "none" for Urdu (ur) when NLLB endpoint is not configured', () => {
    expect(selectProvider('ur')).toBe('none')
  })
})

// ─── selectProvider — determinism ────────────────────────────────────────────

describe('selectProvider — determinism', () => {
  it('returns the same provider for repeated calls with the same language', () => {
    const results = Array.from({ length: 5 }, () => selectProvider('ar'))
    expect(new Set(results).size).toBe(1)
  })

  it('returns "none" for an unknown language code', () => {
    expect(selectProvider('xx')).toBe('none')
  })
})

// ─── isTranslationAvailable ───────────────────────────────────────────────────

describe('isTranslationAvailable', () => {
  it('returns false for English', () => {
    expect(isTranslationAvailable('en')).toBe(false)
  })

  it('returns true for Arabic (LibreTranslate covers it)', () => {
    expect(isTranslationAvailable('ar')).toBe(true)
  })

  it('returns true for French (LibreTranslate covers it)', () => {
    expect(isTranslationAvailable('fr')).toBe(true)
  })

  it('returns false for Amharic when NLLB endpoint is not configured', () => {
    expect(isTranslationAvailable('am')).toBe(false)
  })

  it('returns false for an unknown language code', () => {
    expect(isTranslationAvailable('xx')).toBe(false)
  })
})

// ─── Fallback chain integrity ─────────────────────────────────────────────────

describe('Fallback chain — languages requiring Provider B or C', () => {
  it('all LIBRE_SUPPORTED languages resolve to libretranslate (with no Bergamot)', () => {
    for (const lang of LIBRE_SUPPORTED) {
      const p = selectProvider(lang)
      expect(p, `${lang} should be libretranslate`).toBe('libretranslate')
    }
  })

  it('low-resource languages (am, ti, so, om, ur) resolve to none without NLLB endpoint', () => {
    const lowResource = ['am', 'ti', 'so', 'om', 'ur']
    for (const lang of lowResource) {
      expect(selectProvider(lang), `${lang} should be none without NLLB`).toBe('none')
    }
  })
})
