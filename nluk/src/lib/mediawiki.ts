/**
 * MediaWiki / Wikipedia REST API integration
 *
 * Layer 2 of 3 in the glossary architecture:
 *   1. glossary.ts  (local curated terms — instant, offline)
 *   2. This file    (Wikipedia fallback for unknown terms)
 *   3. GlossaryTerm (inline UI popovers)
 *
 * Uses the Wikipedia Summary REST API (no API key required):
 *   https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 *
 * Only fetches terms not found in the local glossary.
 * Results are cached in memory for the session.
 */

const WIKI_BASE = 'https://en.wikipedia.org/api/rest_v1'

// Session-level cache: term → summary (or null if not found)
const _cache = new Map<string, WikiSummary | null>()

export interface WikiSummary {
  /** Article title */
  title: string
  /** Short plain-text description (usually 1 sentence) */
  description: string | null
  /** First paragraph of the article (may include HTML) */
  extract: string
  /** Sanitised plain-text extract (no HTML) */
  extract_html: string
  /** URL of the article on Wikipedia */
  content_urls: {
    desktop: { page: string }
    mobile: { page: string }
  }
}

/**
 * Fetches a Wikipedia summary for the given search term.
 *
 * Strategy:
 * 1. Try the term directly as a page title
 * 2. If 404, try with the first letter capitalised
 * 3. Returns null if neither succeeds or the network fails
 *
 * IMPORTANT: Call only for terms NOT found in the local glossary.
 */
export async function fetchWikiSummary(term: string): Promise<WikiSummary | null> {
  const key = term.toLowerCase().trim()
  if (_cache.has(key)) return _cache.get(key) ?? null

  const candidates = [
    encodeURIComponent(term.trim()),
    encodeURIComponent(term.trim().charAt(0).toUpperCase() + term.trim().slice(1)),
  ]

  for (const title of candidates) {
    try {
      const res = await fetch(`${WIKI_BASE}/page/summary/${title}`, {
        headers: { Accept: 'application/json; charset=utf-8' },
      })
      if (res.status === 404) continue
      if (!res.ok) break

      const data = await res.json() as WikiSummary
      // Discard disambiguation pages (description = "Topics referred to by the same term")
      if (data.description?.toLowerCase().includes('disambiguation')) {
        _cache.set(key, null)
        return null
      }

      _cache.set(key, data)
      return data
    } catch {
      break
    }
  }

  _cache.set(key, null)
  return null
}

/**
 * Returns a short definition string from a WikiSummary.
 * Truncates to `maxLen` characters (default 150) to keep popovers compact.
 */
export function wikiSummaryToDefinition(summary: WikiSummary, maxLen = 150): string {
  const text = summary.extract || summary.description || ''
  if (text.length <= maxLen) return text
  // Truncate at last sentence boundary before maxLen
  const truncated = text.slice(0, maxLen)
  const lastPeriod = truncated.lastIndexOf('.')
  return lastPeriod > 50 ? truncated.slice(0, lastPeriod + 1) : truncated + '…'
}

/**
 * Clears the in-memory MediaWiki cache.
 */
export function clearWikiCache(): void {
  _cache.clear()
}
