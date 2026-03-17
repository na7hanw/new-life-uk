import { useState, useEffect } from 'react'
import { t18 } from './utils.ts'
import { translateContentObject } from './translate.ts'

/**
 * useTranslatedContent
 * Manages auto-translation state for a content object keyed by language code.
 * Falls back to English while translating, then sets the translated result.
 *
 * @param source  - Content map e.g. `{ en: { title, summary, steps } }`
 * @param lang    - Target language code
 * @param id      - Stable item identifier (triggers reset when the item changes)
 * @returns       `[content, isTranslating, wasAutoTranslated]`
 */
export function useTranslatedContent<T extends Record<string, unknown>>(
  source: Record<string, T> | null | undefined,
  lang: string,
  id: string | undefined
): [T | null, boolean, boolean] {
  const englishContent = source ? t18(source, 'en') as T : null
  const hasNative = source ? !!source[lang] : false

  const [content, setContent] = useState<T | null>(() =>
    source ? t18(source, lang) as T : null
  )
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!source || !englishContent) return
    const nativeContent = t18(source, lang) as T
    if (lang === 'en' || hasNative) {
      setContent(nativeContent)
      setWasTranslated(false)
      return
    }
    let cancelled = false
    setTranslating(true)
    setContent(englishContent) // show English while translating
    translateContentObject(englishContent, lang).then(translated => {
      if (!cancelled) {
        setContent(translated as T)
        setTranslating(false)
        setWasTranslated(true)
      }
    })
    return () => { cancelled = true }
  // englishContent and hasNative are derived from source+lang, which are already in the dep array
  }, [lang, id, source]) // eslint-disable-line react-hooks/exhaustive-deps

  return [content, translating, wasTranslated]
}

/**
 * useTranslatedSteps
 * Manages auto-translation state for a steps array keyed by language code.
 * Falls back to English while translating.
 *
 * @param source  - Steps map e.g. `{ en: ['Step 1…', 'Step 2…'] }`
 * @param lang    - Target language code
 * @param id      - Stable item identifier (triggers reset when the item changes)
 * @returns       translated steps array
 */
export function useTranslatedSteps(
  source: Record<string, string[]> | null | undefined,
  lang: string,
  id: string | undefined
): string[] {
  const englishSteps = source ? t18(source as Record<string, unknown>, 'en') as string[] : []
  const hasNative = source ? !!source[lang] : false

  const [steps, setSteps] = useState<string[]>(() =>
    source ? t18(source as Record<string, unknown>, lang) as string[] : []
  )

  useEffect(() => {
    if (!source) return
    const nativeSteps = t18(source as Record<string, unknown>, lang) as string[]
    if (lang === 'en' || hasNative) {
      setSteps(nativeSteps)
      return
    }
    let cancelled = false
    setSteps(englishSteps)
    translateContentObject({ steps: englishSteps }, lang).then(translated => {
      if (!cancelled) setSteps((translated as { steps: string[] }).steps)
    })
    return () => { cancelled = true }
  // englishSteps and hasNative are derived from source+lang, which are already in the dep array
  }, [lang, id, source]) // eslint-disable-line react-hooks/exhaustive-deps

  return steps
}
