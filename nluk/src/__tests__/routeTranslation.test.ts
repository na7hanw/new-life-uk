/**
 * @vitest-environment jsdom
 *
 * Tests for useRouteTranslation — the route-level translation preload gate.
 *
 * Covers:
 *  - English passthrough (isReady immediately, no API calls)
 *  - isReady only flips true once ALL strings are translated (no mixed state)
 *  - t() returns English fallback before ready, target language after ready
 *  - Cancellation: stale batches don't overwrite a newer language's state
 *  - Reset on routeKey or lang change
 *  - Cache refresh: retranslates when called again after lang round-trip
 *  - Metadata labels all change simultaneously (single atomic repaint)
 *  - Empty string list → immediately ready
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRouteTranslation, type RouteString } from '../lib/useRouteTranslation.ts'

// ─── Mock translate module ────────────────────────────────────────────────────
// We test the hook in isolation — no network calls.

vi.mock('../lib/translate.ts', () => ({
  translate: vi.fn(),
}))

// Import the mocked function after vi.mock is registered
import { translate } from '../lib/translate.ts'
const mockTranslate = vi.mocked(translate)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ONE: RouteString[] = [{ key: 'greeting', text: 'Hello' }]
const TWO: RouteString[] = [
  { key: 'a', text: 'Hello' },
  { key: 'b', text: 'World' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── English passthrough ──────────────────────────────────────────────────────

describe('useRouteTranslation — English passthrough', () => {
  it('is immediately ready when lang is "en"', () => {
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'en'))
    expect(result.current.isReady).toBe(true)
  })

  it('does not call translate() for lang="en"', () => {
    renderHook(() => useRouteTranslation('test', ONE, 'en'))
    expect(mockTranslate).not.toHaveBeenCalled()
  })

  it('t() returns source text for lang="en"', () => {
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'en'))
    expect(result.current.t('greeting')).toBe('Hello')
  })

  it('is immediately ready when strings array is empty', () => {
    const { result } = renderHook(() => useRouteTranslation('test', [], 'ar'))
    expect(result.current.isReady).toBe(true)
    expect(mockTranslate).not.toHaveBeenCalled()
  })
})

// ─── Non-English: loading state ───────────────────────────────────────────────

describe('useRouteTranslation — non-English loading state', () => {
  it('starts as not ready for a non-English lang', () => {
    mockTranslate.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'ar'))
    expect(result.current.isReady).toBe(false)
  })

  it('t() returns English source text while not ready', () => {
    mockTranslate.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'ar'))
    expect(result.current.t('greeting')).toBe('Hello')
  })

  it('t() returns key as fallback for an unknown key', () => {
    mockTranslate.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'ar'))
    expect(result.current.t('unknown-key')).toBe('unknown-key')
  })
})

// ─── Translation completion ───────────────────────────────────────────────────

describe('useRouteTranslation — completion', () => {
  it('isReady becomes true after all strings resolve', async () => {
    mockTranslate.mockResolvedValue('مرحبا')
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'ar'))
    await waitFor(() => expect(result.current.isReady).toBe(true))
  })

  it('t() returns translated string after ready', async () => {
    mockTranslate.mockResolvedValue('مرحبا')
    const { result } = renderHook(() => useRouteTranslation('test', ONE, 'ar'))
    await waitFor(() => expect(result.current.isReady).toBe(true))
    expect(result.current.t('greeting')).toBe('مرحبا')
  })

  it('calls translate() once per string', async () => {
    mockTranslate.mockResolvedValue('translated')
    renderHook(() => useRouteTranslation('test', TWO, 'ar'))
    await waitFor(() => expect(mockTranslate).toHaveBeenCalledTimes(2))
  })

  it('passes the correct lang code to translate()', async () => {
    mockTranslate.mockResolvedValue('bonjour')
    renderHook(() => useRouteTranslation('test', ONE, 'fr'))
    await waitFor(() => expect(mockTranslate).toHaveBeenCalledWith('Hello', 'fr'))
  })
})

// ─── No mixed-language state ──────────────────────────────────────────────────
// The key guarantee: when isReady flips to true, ALL strings are in the
// target language simultaneously — no English strings mixed with translated ones.

describe('useRouteTranslation — no mixed-language state', () => {
  it('t() returns all strings in the target language at the same time', async () => {
    mockTranslate
      .mockResolvedValueOnce('مرحبا')  // 'Hello' → Arabic
      .mockResolvedValueOnce('عالم')   // 'World' → Arabic

    const { result } = renderHook(() => useRouteTranslation('test', TWO, 'ar'))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Both strings must be in Arabic, simultaneously
    expect(result.current.t('a')).toBe('مرحبا')
    expect(result.current.t('b')).toBe('عالم')
  })

  it('isReady does not become true until the slowest string resolves', async () => {
    let resolveB!: (v: string) => void
    const bPending = new Promise<string>(r => { resolveB = r })

    mockTranslate
      .mockResolvedValueOnce('مرحبا')  // 'a' resolves fast
      .mockReturnValueOnce(bPending)    // 'b' is slow

    const { result } = renderHook(() => useRouteTranslation('test', TWO, 'ar'))

    // Even though 'a' resolved, isReady must still be false
    await new Promise(r => setTimeout(r, 20))
    expect(result.current.isReady).toBe(false)

    // Now let 'b' resolve
    act(() => { resolveB('عالم') })
    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Only now should both be available
    expect(result.current.t('a')).toBe('مرحبا')
    expect(result.current.t('b')).toBe('عالم')
  })

  it('page metadata labels all change together (single atomic repaint)', async () => {
    // Simulates page headings, tab labels, and empty-state text all translating
    const PAGE_LABELS: RouteString[] = [
      { key: 'pageTitle',  text: 'Guides' },
      { key: 'searchHint', text: 'Search' },
      { key: 'emptyState', text: 'No results' },
      { key: 'categoryAll', text: 'All' },
    ]

    mockTranslate
      .mockResolvedValueOnce('أدلة')
      .mockResolvedValueOnce('بحث')
      .mockResolvedValueOnce('لا توجد نتائج')
      .mockResolvedValueOnce('الكل')

    const { result } = renderHook(() =>
      useRouteTranslation('guides', PAGE_LABELS, 'ar'),
    )

    // Before ready: all English
    expect(result.current.t('pageTitle')).toBe('Guides')
    expect(result.current.t('searchHint')).toBe('Search')
    expect(result.current.t('emptyState')).toBe('No results')
    expect(result.current.t('categoryAll')).toBe('All')

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // After ready: all in Arabic — no English strings remaining
    expect(result.current.t('pageTitle')).toBe('أدلة')
    expect(result.current.t('searchHint')).toBe('بحث')
    expect(result.current.t('emptyState')).toBe('لا توجد نتائج')
    expect(result.current.t('categoryAll')).toBe('الكل')
  })
})

// ─── Cancellation ────────────────────────────────────────────────────────────
// Stale batches from a previous language must not overwrite the new language.

describe('useRouteTranslation — cancellation on lang change', () => {
  it('does not apply stale translations after lang changes', async () => {
    let resolveAr!: (v: string) => void
    const arPending = new Promise<string>(r => { resolveAr = r })

    mockTranslate
      .mockReturnValueOnce(arPending)     // ar: slow
      .mockResolvedValueOnce('bonjour')   // fr: fast

    let lang = 'ar'
    const { result, rerender } = renderHook(() =>
      useRouteTranslation('test', ONE, lang),
    )

    // Switch to French before 'ar' resolves
    act(() => { lang = 'fr'; rerender() })

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Resolve the stale Arabic batch — should NOT change state
    act(() => { resolveAr('مرحبا') })

    // State must reflect French, not Arabic
    expect(result.current.t('greeting')).toBe('bonjour')
  })

  it('resets isReady to false when lang changes', async () => {
    mockTranslate.mockResolvedValue('translated')

    let lang = 'ar'
    const { result, rerender } = renderHook(() =>
      useRouteTranslation('test', ONE, lang),
    )

    await waitFor(() => expect(result.current.isReady).toBe(true))

    // Change lang — hook must re-arm the loading gate
    mockTranslate.mockReturnValue(new Promise(() => {})) // fr: never resolves
    act(() => { lang = 'fr'; rerender() })

    expect(result.current.isReady).toBe(false)
  })

  it('resets isReady when routeKey changes', async () => {
    mockTranslate.mockResolvedValue('translated')

    let routeKey = 'page-a'
    const { result, rerender } = renderHook(() =>
      useRouteTranslation(routeKey, ONE, 'ar'),
    )

    await waitFor(() => expect(result.current.isReady).toBe(true))

    mockTranslate.mockReturnValue(new Promise(() => {})) // page-b: never resolves
    act(() => { routeKey = 'page-b'; rerender() })

    expect(result.current.isReady).toBe(false)
  })
})

// ─── Cache refresh behaviour ──────────────────────────────────────────────────
// After a lang round-trip (ar → en → ar), the hook should retranslate because
// the translate() function may have had its cache cleared externally.

describe('useRouteTranslation — cache refresh behaviour', () => {
  it('retranslates when lang round-trips (ar → en → ar)', async () => {
    mockTranslate.mockResolvedValue('مرحبا')

    let lang: string = 'ar'
    const { result, rerender } = renderHook(() =>
      useRouteTranslation('test', ONE, lang),
    )

    await waitFor(() => expect(result.current.isReady).toBe(true))
    const firstCallCount = mockTranslate.mock.calls.length // e.g. 1

    // Switch to English (no API call expected)
    act(() => { lang = 'en'; rerender() })
    expect(result.current.isReady).toBe(true)
    expect(mockTranslate.mock.calls.length).toBe(firstCallCount) // no new calls

    // Switch back to Arabic — translate() should be called again (cache may be stale)
    act(() => { lang = 'ar'; rerender() })

    await waitFor(() => expect(result.current.isReady).toBe(true))
    expect(mockTranslate.mock.calls.length).toBeGreaterThan(firstCallCount)
  })
})
