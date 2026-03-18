/**
 * Tests for src/lib/translate.ts
 * Covers: translate(), translateAll(), translateContentObject(), caching, fallback.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  translate,
  translateAll,
  translateContentObject,
  clearTranslationCache,
} from '../lib/translate.ts'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFetchSuccess(translatedText: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      responseStatus: 200,
      responseData: { translatedText },
    }),
  })
}

function mockFetchFailure() {
  return vi.fn().mockResolvedValue({ ok: false })
}

function mockFetchNetworkError() {
  return vi.fn().mockRejectedValue(new Error('Network error'))
}

// ─── translate() ──────────────────────────────────────────────────────────────

describe('translate — English passthrough', () => {
  it('returns the original text unchanged when targetLang is "en"', async () => {
    const result = await translate('Hello world', 'en')
    expect(result).toBe('Hello world')
  })

  it('returns empty string unchanged', async () => {
    const result = await translate('', 'fr')
    expect(result).toBe('')
  })

  it('returns whitespace-only string unchanged', async () => {
    const result = await translate('   ', 'fr')
    expect(result).toBe('   ')
  })
})

describe('translate — successful API response', () => {
  beforeEach(() => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Bonjour le monde'))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('returns the translated text from the API', async () => {
    const result = await translate('Hello world', 'fr')
    expect(result).toBe('Bonjour le monde')
  })

  it('calls the MyMemory API with the correct URL shape', async () => {
    await translate('Hello', 'fr')
    const url = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('mymemory.translated.net')
    expect(url).toContain('langpair=en|fr')
    expect(url).toContain(encodeURIComponent('Hello'))
  })

  it('caches the result so a second call does not hit the network', async () => {
    await translate('Hello world', 'fr')
    await translate('Hello world', 'fr')
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
  })
})

describe('translate — API failure fallback', () => {
  beforeEach(() => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchFailure())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('returns the original English text when the API returns !ok', async () => {
    const result = await translate('Hello world', 'ar')
    expect(result).toBe('Hello world')
  })
})

describe('translate — network error fallback', () => {
  beforeEach(() => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchNetworkError())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('returns the original English text when fetch throws', async () => {
    const result = await translate('Hello world', 'ar')
    expect(result).toBe('Hello world')
  })
})

describe('translate — in-flight deduplication', () => {
  beforeEach(() => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Hola'))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('two concurrent calls for the same text+lang share one network request', async () => {
    const [r1, r2] = await Promise.all([
      translate('Hello', 'es'),
      translate('Hello', 'es'),
    ])
    expect(r1).toBe('Hola')
    expect(r2).toBe('Hola')
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
  })
})

// ─── translateAll() ───────────────────────────────────────────────────────────

describe('translateAll', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('returns the original array unchanged when lang is "en"', async () => {
    const texts = ['Step one.', 'Step two.']
    const result = await translateAll(texts, 'en')
    expect(result).toEqual(texts)
  })

  it('translates every string in the array', async () => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Traduit'))
    const result = await translateAll(['Hello', 'World'], 'fr')
    expect(result).toEqual(['Traduit', 'Traduit'])
  })
})

// ─── translateContentObject() ─────────────────────────────────────────────────

describe('translateContentObject', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    clearTranslationCache()
  })

  it('returns the object unchanged when lang is "en"', async () => {
    const obj = { title: 'Bank Account', desc: 'How to open one.' }
    const result = await translateContentObject(obj, 'en')
    expect(result).toBe(obj)
  })

  it('translates string values', async () => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Traduit'))
    const obj = { title: 'Hello', desc: 'World' }
    const result = await translateContentObject(obj, 'fr')
    expect(result.title).toBe('Traduit')
    expect(result.desc).toBe('Traduit')
  })

  it('translates string items inside arrays', async () => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Étape'))
    const obj = { steps: ['Step 1', 'Step 2'] }
    const result = await translateContentObject(obj, 'fr')
    expect(result.steps).toEqual(['Étape', 'Étape'])
  })

  it('passes through non-string, non-array values unchanged', async () => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Traduit'))
    const obj = { title: 'Hello', count: 42, active: true } as Record<string, unknown>
    const result = await translateContentObject(obj as { title: string; count: number; active: boolean }, 'fr')
    expect((result as typeof obj).count).toBe(42)
    expect((result as typeof obj).active).toBe(true)
  })

  it('returns the object unchanged when it is falsy', async () => {
    // @ts-expect-error testing null/undefined handling
    const result = await translateContentObject(null, 'fr')
    expect(result).toBeNull()
  })
})

// ─── clearTranslationCache() ─────────────────────────────────────────────────

describe('clearTranslationCache', () => {
  it('clears cached entries so the next call hits the network again', async () => {
    clearTranslationCache()
    vi.stubGlobal('fetch', mockFetchSuccess('Bonjour'))
    await translate('Hello', 'fr')
    clearTranslationCache()
    await translate('Hello', 'fr')
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(2)
    vi.unstubAllGlobals()
    clearTranslationCache()
  })
})
