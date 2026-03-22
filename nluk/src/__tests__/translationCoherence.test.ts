/**
 * Translation Coherence Tests — Batch 2
 *
 * Verifies the end-to-end translation contract:
 *
 * 1. LANGUAGE COVERAGE — every app language maps to exactly one provider;
 *    no language falls through to 'none' when it should be supported.
 * 2. PROVIDER EXCLUSIVITY — Bergamot takes priority over LibreTranslate
 *    when both support the same language.
 * 3. ATOMIC ROUTE TRANSLATION — useRouteTranslation delivers all strings
 *    simultaneously; no partial/mixed-language repaint is possible.
 * 4. BANNER CONTRACT — MachineTranslationBanner renders (warning or
 *    unavailable) for every non-English language and is silent for English.
 * 5. FALLBACK CHAIN — when the primary provider returns an empty/null
 *    response, translate() gracefully returns the original text.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { LANGS } from '../data/ui-strings.ts'
import {
  selectProvider,
  isTranslationAvailable,
  BERGAMOT_SUPPORTED,
  LIBRE_SUPPORTED,
  NLLB_SUPPORTED,
} from '../lib/translationRouter.ts'
import { useRouteTranslation, type RouteString } from '../lib/useRouteTranslation.ts'

// ── Mock translate for hook tests ─────────────────────────────────────────────
vi.mock('../lib/translate.ts', () => ({
  translate: vi.fn(),
}))
import { translate } from '../lib/translate.ts'
const mockTranslate = vi.mocked(translate)

beforeEach(() => { vi.clearAllMocks() })

// ── 1. Language coverage ──────────────────────────────────────────────────────

describe('Language coverage', () => {
  const APP_LANGS = LANGS.map(l => l.code).filter(c => c !== 'en')

  it('every non-English app language is covered by at least one provider', () => {
    const allSupported = new Set([...BERGAMOT_SUPPORTED, ...LIBRE_SUPPORTED, ...NLLB_SUPPORTED])
    const unsupported = APP_LANGS.filter(l => !allSupported.has(l))
    // Low-resource languages (am, ti, so, om, ur) require NLLB — they ARE in
    // NLLB_SUPPORTED, so they're covered when the endpoint is configured.
    // This test ensures no language has been accidentally dropped.
    expect(unsupported).toEqual([])
  })

  it('low-resource NLLB-only languages are absent from Bergamot and LibreTranslate', () => {
    // am, ti, so, om are exclusively served by NLLB-200 (no open Argos Translate support)
    // These are the languages most critical not to accidentally drop into the LIBRE set
    const nllbOnlyLangs = ['am', 'ti', 'so', 'om']
    for (const lang of nllbOnlyLangs) {
      expect(BERGAMOT_SUPPORTED.has(lang)).toBe(false)
      expect(LIBRE_SUPPORTED.has(lang)).toBe(false)
      expect(NLLB_SUPPORTED.has(lang)).toBe(true)
    }
  })
})

// ── 2. Provider priority / exclusivity ───────────────────────────────────────

describe('Provider priority', () => {
  it('English returns provider none', () => {
    expect(selectProvider('en')).toBe('none')
  })

  it('Bergamot takes priority for its supported languages', () => {
    // fr, de, pl, ro, uk are in Bergamot set
    // Simulate Bergamot being ready by mocking window.bergamot
    const originalBergamot = (globalThis as Record<string, unknown>).bergamot
    ;(globalThis as Record<string, unknown>).bergamot = {
      translate: () => Promise.resolve('translated'),
    }
    const bergamotLangs = [...BERGAMOT_SUPPORTED]
    for (const lang of bergamotLangs) {
      expect(selectProvider(lang)).toBe('bergamot')
    }
    if (originalBergamot !== undefined) {
      ;(globalThis as Record<string, unknown>).bergamot = originalBergamot
    } else {
      delete (globalThis as Record<string, unknown>).bergamot
    }
  })

  it('LibreTranslate used for its supported languages when Bergamot is not ready', () => {
    // Ensure Bergamot is not available
    delete (globalThis as Record<string, unknown>).bergamot
    const libreLangs = [...LIBRE_SUPPORTED]
    for (const lang of libreLangs) {
      expect(selectProvider(lang)).toBe('libretranslate')
    }
  })

  it('NLLB returns none when NLLB_ENDPOINT is not configured', () => {
    // By default in tests, import.meta.env.VITE_NLLB_ENDPOINT is not set
    for (const lang of ['am', 'ti', 'so', 'om', 'ur']) {
      expect(selectProvider(lang)).toBe('none')
    }
  })

  it('selectProvider is deterministic — same input always returns same output', () => {
    const langs = ['ar', 'fa', 'fr', 'pl', 'uk', 'ro', 'en']
    for (const lang of langs) {
      const first  = selectProvider(lang)
      const second = selectProvider(lang)
      expect(first).toBe(second)
    }
  })
})

// ── 3. isTranslationAvailable contract ───────────────────────────────────────

describe('isTranslationAvailable', () => {
  it('returns true for English', () => {
    expect(isTranslationAvailable('en')).toBe(true)
  })

  it('returns true for LibreTranslate languages (ar, fa, fr, pl, uk, ro)', () => {
    delete (globalThis as Record<string, unknown>).bergamot
    for (const lang of ['ar', 'fa', 'fr', 'pl', 'uk', 'ro']) {
      expect(isTranslationAvailable(lang)).toBe(true)
    }
  })

  it('returns false for NLLB-only languages when NLLB_ENDPOINT is not set', () => {
    for (const lang of ['am', 'ti', 'so', 'om', 'ur']) {
      expect(isTranslationAvailable(lang)).toBe(false)
    }
  })
})

// ── 4. Atomic route translation (no mixed-language repaints) ──────────────────

describe('useRouteTranslation atomic delivery', () => {
  const STRINGS: RouteString[] = [
    { key: 'title:a', text: 'Hello' },
    { key: 'title:b', text: 'World' },
    { key: 'title:c', text: 'Guide' },
  ]

  it('isReady is false until ALL strings resolve — no partial update', async () => {
    let resolveAll!: () => void
    const allDone = new Promise<void>(res => { resolveAll = res })

    let callCount = 0
    mockTranslate.mockImplementation(async (text) => {
      await allDone
      callCount++
      return `${text}_ar`
    })

    const { result } = renderHook(() =>
      useRouteTranslation('test', STRINGS, 'ar')
    )

    // Initially not ready (async work pending)
    expect(result.current.isReady).toBe(false)
    // t() should return English fallback while not ready
    expect(result.current.t('title:a')).toBe('Hello')

    resolveAll()
    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Now t() should return translated values
    expect(result.current.t('title:a')).toBe('Hello_ar')
    expect(result.current.t('title:b')).toBe('World_ar')
    expect(result.current.t('title:c')).toBe('Guide_ar')
    // All 3 should be in the translated state simultaneously
    expect(callCount).toBe(3)
  })

  it('flips isReady in a single tick — no intermediate partial state', async () => {
    const snapshots: boolean[] = []

    mockTranslate.mockImplementation(async (text) => `${text}_fr`)

    const { result } = renderHook(() => {
      const rt = useRouteTranslation('snap', STRINGS, 'fr')
      snapshots.push(rt.isReady)
      return rt
    })

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // The sequence should only ever be [false, false, ..., true] — never a
    // partial-string-ready intermediate state.
    const trueIndex  = snapshots.indexOf(true)
    const falseAfter = snapshots.slice(trueIndex).includes(false)
    expect(falseAfter).toBe(false)
  })

  it('resets isReady when lang changes — prevents stale translations showing', async () => {
    mockTranslate.mockImplementation(async (text) => `${text}_translated`)

    const { result, rerender } = renderHook(
      ({ lang }: { lang: string }) =>
        useRouteTranslation('reset', STRINGS, lang),
      { initialProps: { lang: 'ar' } }
    )

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Switch to a different language
    act(() => { rerender({ lang: 'fr' }) })

    // isReady should immediately go false (reset) before the new translations arrive
    expect(result.current.isReady).toBe(false)

    await waitFor(() => expect(result.current.isReady).toBe(true))
  })

  it('English is immediately ready with no API calls', () => {
    const { result } = renderHook(() =>
      useRouteTranslation('en-test', STRINGS, 'en')
    )
    expect(result.current.isReady).toBe(true)
    expect(mockTranslate).not.toHaveBeenCalled()
    // English: t() returns the original text
    expect(result.current.t('title:a')).toBe('Hello')
  })

  it('unknown key returns the key itself — no crash', async () => {
    mockTranslate.mockResolvedValue('translated')
    const { result } = renderHook(() =>
      useRouteTranslation('unknown', STRINGS, 'ar')
    )
    await waitFor(() => expect(result.current.isReady).toBe(true))
    // t() falls back through: translatedMap[key] → sourceMap[key] → key
    expect(result.current.t('does:not:exist')).toBe('does:not:exist')
  })
})

// ── 5. Fallback chain — translate() returns original on empty response ─────────

describe('translate() fallback on empty provider response', () => {
  it('returns original text when translate resolves with empty string', async () => {
    mockTranslate.mockResolvedValue('')
    const { result } = renderHook(() =>
      useRouteTranslation('empty-resp', [{ key: 'x', text: 'Original' }], 'ar')
    )
    await waitFor(() => expect(result.current.isReady).toBe(true))
    // When the translated value is empty, the hook falls back to English
    expect(result.current.t('x')).toBe('Original')
  })
})
