/**
 * useRouteTranslation
 *
 * Pre-translates a fixed set of English strings for a route before the page
 * paints translated content.  Unlike the per-component `useTranslatedContent`
 * hook, this operates at route scope:
 *
 * - All strings are translated in one `Promise.all()` batch.
 * - `isReady` flips to `true` only once EVERY string has resolved — preventing
 *   the mixed-language state where some cards are translated while others show
 *   English.
 * - Translation is cancelled (via a ref flag) when `routeKey` or `lang` changes,
 *   so a slow in-flight batch can never overwrite a newer language's state.
 * - For `lang === 'en'` or an empty string list, `isReady` is synchronously
 *   `true` so there is zero flash of untranslated content.
 * - Results are looked up via `t(key)`, which falls back to the English source
 *   text while translation is in progress.
 *
 * Usage
 * ─────
 *   // At module scope — stable reference, built once
 *   const PAGE_STRINGS: RouteString[] = [
 *     { key: 'heading', text: 'Your guides' },
 *     { key: 'empty',   text: 'No results'  },
 *   ]
 *
 *   // Inside the component
 *   const { t, isReady } = useRouteTranslation('guides', PAGE_STRINGS, lang)
 *   // isReady === false → show translation indicator
 *   // t('heading') → 'دليلك' once ready, 'Your guides' while still translating
 */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { translate } from './translate.ts'

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single translatable string payload for a route. */
export interface RouteString {
  /** Stable unique key used to look up the translated result. */
  key: string
  /** English source text to be translated. */
  text: string
}

export interface RouteTranslationResult {
  /**
   * Look up a translated string by key.
   * Returns the English source text while translation is in progress,
   * and the translated string once `isReady` is true.
   */
  t: (key: string) => string

  /**
   * True once all strings for this route have been translated (or immediately
   * when `lang === 'en'` or the strings list is empty).
   * Use this to gate the translated paint: don't show translated content until
   * `isReady` to avoid mixed-language state.
   */
  isReady: boolean
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRouteTranslation(
  /** Stable route identifier — causes a full reset when changed. */
  routeKey: string,
  /** Fixed set of strings to pre-translate. Treat as stable for a given routeKey. */
  strings: RouteString[],
  /** Current app language code. */
  lang: string,
): RouteTranslationResult {
  // Fast O(1) lookup for source (English) texts
  const sourceMap = useMemo<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const { key, text } of strings) m[key] = text
    return m
    // Rebuild only when the route changes (strings is stable for a routeKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey])

  const [translatedMap, setTranslatedMap] = useState<Record<string, string>>({})
  const [isReady, setIsReady] = useState<boolean>(
    lang === 'en' || strings.length === 0,
  )

  // cancelRef prevents stale async results from updating state after a
  // lang or routeKey change
  const cancelRef = useRef(false)

  useEffect(() => {
    // Synchronous fast-path: no API needed
    if (lang === 'en' || strings.length === 0) {
      setTranslatedMap({})
      setIsReady(true)
      return
    }

    cancelRef.current = false
    setIsReady(false)

    // Batch-translate every string in parallel (rate-limited inside translate.ts)
    Promise.all(strings.map(({ text }) => translate(text, lang))).then(results => {
      if (cancelRef.current) return

      const m: Record<string, string> = {}
      strings.forEach(({ key, text }, i) => {
        // Fall back to English when the provider returns an empty string
        // (better to show the original than to show nothing)
        m[key] = results[i] || text
      })

      setTranslatedMap(m)
      // Single atomic state update → all strings flip to the new language at once
      setIsReady(true)
    })

    return () => {
      // Cancel: don't let a stale batch overwrite a newer language's state
      cancelRef.current = true
    }
    // `strings` is intentionally omitted: it is treated as stable for `routeKey`.
    // Adding it would cause infinite re-renders if defined inline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, lang])

  const t = useCallback(
    (key: string): string => {
      if (lang === 'en') return sourceMap[key] ?? key
      return translatedMap[key] ?? sourceMap[key] ?? key
    },
    [lang, sourceMap, translatedMap],
  )

  return { t, isReady }
}
