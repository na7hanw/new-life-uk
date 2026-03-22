// ─── Auto-Translation Service ────────────────────────────────────────────────
// Routes each language pair to the best available free/open-source provider:
//   A. Bergamot (browser WASM, offline)     — fr, pl, ro, uk + EU pairs
//   B. LibreTranslate / Argos (free API)    — ar, fa, fr, pl, ro, uk + more
//   C. NLLB-200 (configurable endpoint)     — am, ti, so, om, ur + all others
//   D. none                                 — keep English, show unavailable notice
//
// No commercial APIs (Google, Azure, DeepL) are used.
// All translated output is machine-generated and may be inaccurate.
//
// Cache: IndexedDB via `idb` (unlimited, persists across sessions)
// Concurrency: `p-limit` caps concurrent requests at 3.
// Migration: auto-migrates any existing localStorage cache on first load.

import { openDB, type IDBPDatabase } from 'idb'
import pLimit from 'p-limit'
import {
  selectProvider,
  LIBRE_ENDPOINT,
  NLLB_ENDPOINT,
  NLLB_LANG_CODES,
  type ProviderID,
} from './translationRouter.ts'

const DB_NAME    = 'nluk-tx'
const STORE_NAME = 'cache'
const DB_VERSION = 1
const OLD_LS_KEY = 'nluk_tx3'

// ── IndexedDB setup ────────────────────────────────────────────────────────
let _db: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!_db) {
    _db = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  return _db
}

// ── One-time localStorage → IndexedDB migration ────────────────────────────
async function migrateFromLocalStorage(): Promise<void> {
  try {
    const raw = localStorage.getItem(OLD_LS_KEY)
    if (!raw) return
    const entries = Object.entries(JSON.parse(raw) as Record<string, string>)
    const db = await getDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    await Promise.all(entries.map(([k, v]) => tx.store.put(v, k)))
    await tx.done
    localStorage.removeItem(OLD_LS_KEY)
  } catch {
    // Migration not critical — continue silently
  }
}

migrateFromLocalStorage()

// ── FNV-1a 32-bit hash ─────────────────────────────────────────────────────
const FNV_OFFSET = 2166136261
const FNV_PRIME  = 16777619

function fnv1a(str: string): string {
  let h = FNV_OFFSET
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, FNV_PRIME) >>> 0
  }
  return h.toString(36)
}

function cacheKey(text: string, lang: string): string {
  return `${lang}:${fnv1a(text)}`
}

// ── Rate limiter: max 3 concurrent API requests ────────────────────────────
const limit = pLimit(3)

// ── In-memory cache (fast synchronous lookup within the page session) ──────
const memCache = new Map<string, string>()

// ── In-flight deduplication ────────────────────────────────────────────────
const inFlight = new Map<string, Promise<string>>()

// ── Provider implementations ───────────────────────────────────────────────

/**
 * LibreTranslate / Argos Translate request.
 * POST to the configured endpoint (default: public Argos Translate instance).
 * Returns the translated string or throws on failure.
 */
async function callLibreTranslate(
  text: string,
  targetLang: string,
  signal: AbortSignal,
): Promise<string> {
  const res = await fetch(`${LIBRE_ENDPOINT}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
    signal,
  })
  if (!res.ok) throw new Error(`LibreTranslate error: ${res.status}`)
  const json = await res.json() as { translatedText?: string }
  if (!json.translatedText) throw new Error('LibreTranslate: empty response')
  return json.translatedText
}

/**
 * NLLB-200 request.
 * Uses the configurable VITE_NLLB_ENDPOINT; expects LibreTranslate-compatible
 * request/response format with NLLB language codes (e.g. amh_Ethi, tir_Ethi).
 */
async function callNLLB(
  text: string,
  targetLang: string,
  signal: AbortSignal,
): Promise<string> {
  const nllbTarget = NLLB_LANG_CODES[targetLang] || targetLang
  const res = await fetch(`${NLLB_ENDPOINT}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'eng_Latn', target: nllbTarget, format: 'text' }),
    signal,
  })
  if (!res.ok) throw new Error(`NLLB error: ${res.status}`)
  const json = await res.json() as { translatedText?: string }
  if (!json.translatedText) throw new Error('NLLB: empty response')
  return json.translatedText
}

/**
 * Dispatch to the appropriate provider.
 * Bergamot calls are routed through window.bergamot.translate() when available.
 */
async function callProvider(
  provider: ProviderID,
  text: string,
  targetLang: string,
  signal: AbortSignal,
): Promise<string> {
  switch (provider) {
    case 'bergamot': {
      // Bergamot exposes a synchronous-style API after WASM init.
      // If bergamot.translate is not a function, fall through to libretranslate.
      const berg = (window as unknown as Record<string, unknown>).bergamot
      if (berg && typeof (berg as Record<string, unknown>).translate === 'function') {
        return await (berg as Record<string, (t: string, s: string, l: string) => Promise<string>>)
          .translate(text, 'en', targetLang)
      }
      // Bergamot API not available — fall through to libretranslate
      return callLibreTranslate(text, targetLang, signal)
    }
    case 'libretranslate':
      return callLibreTranslate(text, targetLang, signal)
    case 'nllb':
      return callNLLB(text, targetLang, signal)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

/**
 * Translate a single English string into targetLang.
 *
 * Uses the best available free/open-source provider (Bergamot → LibreTranslate → NLLB).
 * Returns the original English text on failure or when no provider is available.
 * Results are cached in IndexedDB and in-memory indefinitely.
 *
 * All translated output is machine-generated and may be inaccurate.
 */
export async function translate(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim() || targetLang === 'en') return text

  // Determine provider early — if 'none', skip all I/O
  const provider = selectProvider(targetLang)
  if (provider === 'none') return text

  const key = cacheKey(text, targetLang)

  // 1. Check in-memory cache (synchronous, zero-latency)
  const memHit = memCache.get(key)
  if (memHit) return memHit

  // 2. Check IndexedDB cache (survives page reload)
  try {
    const db = await getDB()
    const cached = await db.get(STORE_NAME, key) as string | undefined
    if (cached) {
      memCache.set(key, cached)
      return cached
    }
  } catch {
    // IDB unavailable (e.g. test environment) — fall through to provider
  }

  // Deduplicate: if same key is already being fetched, share the promise
  if (inFlight.has(key)) return inFlight.get(key)!

  const request = limit(async (): Promise<string> => {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)

      const translated = await callProvider(provider, text, targetLang, controller.signal)
      clearTimeout(timer)

      memCache.set(key, translated)
      try {
        const db = await getDB()
        await db.put(STORE_NAME, translated, key)
      } catch {
        // IDB write failed — translation still returned to caller
      }
      inFlight.delete(key)
      return translated
    } catch {
      // Timeout, network error, provider failure — fall back to English
      inFlight.delete(key)
      return text
    }
  })

  inFlight.set(key, request)
  return request
}

/**
 * Translate an array of English strings with concurrency control.
 * At most 3 parallel provider requests are made at any time.
 */
export async function translateAll(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en') return texts
  return Promise.all(texts.map(t => translate(t, targetLang)))
}

/**
 * Translate a content object like { title, desc } or { title, summary, steps[] }.
 * Handles nested arrays (e.g. steps) by translating each element individually.
 * Returns a new object with all string values translated.
 */
export async function translateContentObject<T extends Record<string, unknown>>(
  obj: T,
  targetLang: string
): Promise<T> {
  if (!obj || targetLang === 'en') return obj

  const keys = Object.keys(obj) as (keyof T)[]
  const results = await Promise.all(
    keys.map(k => {
      const v = obj[k]
      if (typeof v === 'string') return translate(v, targetLang) as Promise<unknown>
      if (Array.isArray(v))
        return Promise.all(
          v.map((item: unknown) => (typeof item === 'string' ? translate(item, targetLang) : Promise.resolve(item)))
        ) as Promise<unknown>
      return Promise.resolve(v)
    })
  )

  const out = {} as T
  keys.forEach((k, i) => { out[k] = results[i] as T[keyof T] })
  return out
}

/** Clear all cached translations from both in-memory cache and IndexedDB. */
export async function clearTranslationCache(): Promise<void> {
  memCache.clear()
  try {
    const db = await getDB()
    await db.clear(STORE_NAME)
  } catch {}
}
