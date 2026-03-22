/**
 * Translation router — selects the best available free/open-source provider
 * for each language pair used by this app.
 *
 * Priority order:
 *   A. Bergamot   — browser WASM (offline-capable, limited language pairs)
 *   B. LibreTranslate / Argos Translate — free public API, no key required
 *   C. NLLB-200   — configurable self-hosted endpoint, broadest coverage
 *   D. none       — keep English, show "translation unavailable" notice
 *
 * Non-commercial constraint:
 *   Google Cloud Translation, Azure Translator, and DeepL are NOT used here.
 *   All providers are free/open-source. NLLB is a research model and its output
 *   must carry a visible machine-translation disclaimer.
 */

// ── Provider A: Bergamot ────────────────────────────────────────────────────
// Browser WASM translation from the Mozilla Firefox Translations project.
// Requires the bergamot-translator WASM bundle to be loaded in the page.
// Source: https://github.com/mozilla/firefox-translations-models
// Only en→target pairs are listed (the only direction this app needs).
export const BERGAMOT_SUPPORTED = new Set([
  'bg', 'cs', 'de', 'es', 'et', 'fi', 'fr', 'hu', 'is', 'it', 'lt',
  'nb', 'nl', 'pl', 'pt', 'ro', 'sk', 'sl', 'uk',
])

// ── Provider B: LibreTranslate / Argos Translate ────────────────────────────
// Free, open-source translation service. Default public instance: Argos Translate.
// Source: https://github.com/LibreTranslate/LibreTranslate
// Language support based on default Argos Translate packages.
export const LIBRE_SUPPORTED = new Set([
  'ar', 'az', 'ca', 'cs', 'da', 'de', 'el', 'eo', 'es', 'fa',
  'fi', 'fr', 'ga', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko',
  'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sv', 'tr', 'uk', 'vi', 'zh',
])

// ── Provider C: NLLB-200 ────────────────────────────────────────────────────
// Meta's No Language Left Behind model family (~200 languages).
// This is a research model — output must carry a visible accuracy disclaimer.
// Source: https://github.com/facebookresearch/fairseq/tree/nllb
// Requires VITE_NLLB_ENDPOINT to be set to a self-hosted service URL.
export const NLLB_SUPPORTED = new Set([
  'ar', 'fa', 'ur', 'am', 'ti', 'so', 'om', 'uk', 'ro', 'pl', 'fr',
])

// NLLB uses ISO 639-3 language codes with script subtag (BCP-47 variant)
export const NLLB_LANG_CODES: Record<string, string> = {
  ar: 'arb_Arab',
  fa: 'pes_Arab',
  ur: 'urd_Arab',
  am: 'amh_Ethi',
  ti: 'tir_Ethi',
  so: 'som_Latn',
  om: 'gaz_Latn',
  uk: 'ukr_Cyrl',
  ro: 'ron_Latn',
  pl: 'pol_Latn',
  fr: 'fra_Latn',
  en: 'eng_Latn',
}

// ── Provider endpoints (configurable) ──────────────────────────────────────
/** LibreTranslate base URL. Defaults to the free public Argos Translate instance. */
export const LIBRE_ENDPOINT: string =
  (import.meta.env?.VITE_LIBRE_ENDPOINT as string | undefined) ??
  'https://translate.argosopentech.com'

/** NLLB-200 endpoint. Empty string = not configured; languages in NLLB_SUPPORTED fall back to 'none'. */
export const NLLB_ENDPOINT: string =
  (import.meta.env?.VITE_NLLB_ENDPOINT as string | undefined) ?? ''

// ── Provider type ──────────────────────────────────────────────────────────
export type ProviderID = 'bergamot' | 'libretranslate' | 'nllb' | 'none'

/** Returns true when the Bergamot WASM engine has been initialised in this page context. */
export function isBergamotReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as Record<string, unknown>).bergamot !== 'undefined'
  )
}

/**
 * Selects the best available free/open-source provider for the given target language.
 *
 * Falls through providers in priority order:
 *   Bergamot → LibreTranslate → NLLB → none
 *
 * Returns 'none' when no provider can handle the pair; the caller should keep
 * the original English text and show a "translation unavailable" notice.
 */
export function selectProvider(targetLang: string): ProviderID {
  if (!targetLang || targetLang === 'en') return 'none'

  // Provider A: Bergamot (requires WASM to be loaded in the page)
  if (BERGAMOT_SUPPORTED.has(targetLang) && isBergamotReady()) return 'bergamot'

  // Provider B: LibreTranslate / Argos Translate
  if (LIBRE_SUPPORTED.has(targetLang)) return 'libretranslate'

  // Provider C: NLLB (requires a configured self-hosted endpoint)
  if (NLLB_SUPPORTED.has(targetLang) && NLLB_ENDPOINT) return 'nllb'

  // No provider available
  return 'none'
}

/**
 * Returns true when at least one free/open-source provider supports the language.
 * Use this to decide whether to show a "translation unavailable" badge.
 */
export function isTranslationAvailable(targetLang: string): boolean {
  return selectProvider(targetLang) !== 'none'
}
