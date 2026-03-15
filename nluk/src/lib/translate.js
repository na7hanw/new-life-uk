// ─── Auto-Translation Service ────────────────────────────────────
// Uses MyMemory API (free, no API key required, 100+ languages)
// https://mymemory.translated.net/
// Translations are cached in localStorage to minimise network calls
// and work seamlessly offline after first use.

const STORE_KEY = 'nluk_tx3'

// FNV-1a 32-bit hash constants
const FNV_OFFSET = 2166136261
const FNV_PRIME  = 16777619

// FNV-1a 32-bit hash (fast, collision-resistant for short strings)
function fnv1a(str) {
  let h = FNV_OFFSET
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, FNV_PRIME) >>> 0
  }
  return h.toString(36)
}

function cacheKey(text, lang) {
  return `${lang}:${fnv1a(text)}`
}

function loadCache() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') } catch { return {} }
}

function saveCache(cache) {
  try {
    const entries = Object.entries(cache)
    // Keep at most 600 entries to avoid bloating localStorage
    const pruned = entries.length > 600
      ? Object.fromEntries(entries.slice(-480))
      : cache
    localStorage.setItem(STORE_KEY, JSON.stringify(pruned))
  } catch {
    // Storage full — clear old translation cache and continue
    try { localStorage.removeItem(STORE_KEY) } catch {}
  }
}

// In-flight request deduplication: prevents parallel requests for same text+lang
const inFlight = new Map()

/**
 * Translate a single English string into targetLang.
 * Returns the translated text, or the original English on failure.
 */
export async function translate(text, targetLang) {
  if (!text || !text.trim() || targetLang === 'en') return text

  const key = cacheKey(text, targetLang)
  const cache = loadCache()
  if (cache[key]) return cache[key]

  if (inFlight.has(key)) return inFlight.get(key)

  const request = (async () => {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)

      if (!res.ok) return text
      const json = await res.json()

      if (json.responseStatus === 200 && json.responseData?.translatedText) {
        const translated = json.responseData.translatedText
        const c = loadCache()
        c[key] = translated
        saveCache(c)
        inFlight.delete(key)
        return translated
      }
    } catch {
      // Timeout or network failure — fall through to English fallback
    }
    inFlight.delete(key)
    return text
  })()

  inFlight.set(key, request)
  return request
}

/**
 * Translate an array of English strings in parallel.
 * Returns a matching array of translated strings.
 */
export async function translateAll(texts, targetLang) {
  if (targetLang === 'en') return texts
  return Promise.all(texts.map(t => translate(t, targetLang)))
}

/**
 * Translate a content object like { title, desc } or { title, summary, steps[] }.
 * Handles nested arrays (e.g. steps) by translating each element individually.
 * Returns a new object with all string values translated.
 */
export async function translateContentObject(obj, targetLang) {
  if (!obj || targetLang === 'en') return obj

  const keys = Object.keys(obj)
  const results = await Promise.all(
    keys.map(k => {
      const v = obj[k]
      if (typeof v === 'string') return translate(v, targetLang)
      if (Array.isArray(v))
        return Promise.all(
          v.map(item => (typeof item === 'string' ? translate(item, targetLang) : Promise.resolve(item)))
        )
      return Promise.resolve(v)
    })
  )

  const out = {}
  keys.forEach((k, i) => { out[k] = results[i] })
  return out
}

/** Clear all cached translations (useful for debugging). */
export function clearTranslationCache() {
  try { localStorage.removeItem(STORE_KEY) } catch {}
}
