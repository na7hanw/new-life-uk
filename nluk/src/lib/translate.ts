// ─── Auto-Translation Service ────────────────────────────────────
// Uses MyMemory API (free, no API key required, 100+ languages)
// https://mymemory.translated.net/
//
// Cache: IndexedDB via `idb` (unlimited storage, no 600-entry cap)
// Concurrency: `p-limit` caps concurrent API requests at 3 to avoid
//   exceeding MyMemory's free-tier rate limit (~1000 req/day).
// On first load: migrates any existing localStorage cache automatically.

import { openDB, type IDBPDatabase } from 'idb'
import pLimit from 'p-limit'

const DB_NAME    = 'nluk-tx'
const STORE_NAME = 'cache'
const DB_VERSION = 1
const OLD_LS_KEY = 'nluk_tx3'

// ── IndexedDB setup ────────────────────────────────────────────────
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

// ── One-time localStorage → IndexedDB migration ────────────────────
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

// ── FNV-1a 32-bit hash ─────────────────────────────────────────────
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

// ── Rate limiter: max 3 concurrent API requests ────────────────────
const limit = pLimit(3)

// ── In-memory cache (survives within page session, fast synchronous lookup) ──
// Sits in front of IDB so repeated calls within a session don't hit IndexedDB.
const memCache = new Map<string, string>()

// ── In-flight deduplication ────────────────────────────────────────
const inFlight = new Map<string, Promise<string>>()

/**
 * Translate a single English string into targetLang.
 * Returns the translated text, or the original English on failure.
 * Results are cached in IndexedDB indefinitely.
 */
export async function translate(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim() || targetLang === 'en') return text

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
    // IDB unavailable (e.g. test environment) — fall through to API
  }

  // Deduplicate: if same key is already being fetched, share the promise
  if (inFlight.has(key)) return inFlight.get(key)!

  const request = limit(async (): Promise<string> => {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)

      if (!res.ok) return text
      const json = await res.json() as { responseStatus: number; responseData?: { translatedText?: string } }

      if (json.responseStatus === 200 && json.responseData?.translatedText) {
        const translated = json.responseData.translatedText
        memCache.set(key, translated)
        try {
          const db = await getDB()
          await db.put(STORE_NAME, translated, key)
        } catch {
          // IDB write failed — translation still returned to caller
        }
        inFlight.delete(key)
        return translated
      }
    } catch {
      // Timeout, network error, or rate limit — fall through to English
    }
    inFlight.delete(key)
    return text
  })

  inFlight.set(key, request)
  return request
}

/**
 * Translate an array of English strings with concurrency control.
 * At most 3 parallel API requests are made at any time.
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
