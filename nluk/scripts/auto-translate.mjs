#!/usr/bin/env node
/**
 * auto-translate.mjs
 *
 * Automatically translates missing language content in guides.js using
 * fully free, open-source translation services only.
 *
 * Provider A: LibreTranslate / Argos Translate  (free, no API key)
 *   → Covers: ar, fa, fr, pl, ro, uk + most European languages
 *   → Endpoint: LIBRE_TRANSLATE_ENDPOINT env var (defaults to Argos public instance)
 *
 * Provider B: NLLB-200 self-hosted endpoint  (free, no API key, requires self-hosting)
 *   → Covers: am, ti, so, om, ur + all 200 languages
 *   → Endpoint: NLLB_ENDPOINT env var (must be set to use NLLB)
 *
 * IMPORTANT:
 *   - Google Cloud Translation is NOT used. It is a commercial API.
 *   - MyMemory is NOT used. It is a commercial service.
 *   - All translations are machine-generated and may be inaccurate.
 *   - Low-resource languages (Amharic, Tigrinya, Somali, Oromo, Urdu) require
 *     NLLB_ENDPOINT to be set to a self-hosted NLLB-200 service.
 *
 * Usage:
 *   node --experimental-vm-modules scripts/auto-translate.mjs
 *
 * Environment variables:
 *   LIBRE_TRANSLATE_ENDPOINT  — LibreTranslate/Argos base URL (optional)
 *                                Default: https://translate.argosopentech.com
 *   NLLB_ENDPOINT             — Self-hosted NLLB endpoint base URL (optional)
 *                                Required for: am, ti, so, om, ur
 *   TRANSLATE_LANGS           — Comma-separated language subset to translate (optional)
 *   DRY_RUN                   — Set to 'true' to print without writing (optional)
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DRY = process.env.DRY_RUN === 'true'

// ─── Provider endpoints ───────────────────────────────────────────────────────
const LIBRE_ENDPOINT = process.env.LIBRE_TRANSLATE_ENDPOINT || 'https://translate.argosopentech.com'
const NLLB_ENDPOINT  = process.env.NLLB_ENDPOINT || ''

// ─── Language config ──────────────────────────────────────────────────────────
// Maps internal lang codes to LibreTranslate codes + NLLB BCP-47 script codes.
const LANG_MAP = {
  ar: { libre: 'ar',   nllb: 'arb_Arab', name: 'Arabic',     dir: 'rtl', libreSupported: true  },
  fa: { libre: 'fa',   nllb: 'pes_Arab', name: 'Persian',    dir: 'rtl', libreSupported: true  },
  ur: { libre: null,   nllb: 'urd_Arab', name: 'Urdu',       dir: 'rtl', libreSupported: false },
  am: { libre: null,   nllb: 'amh_Ethi', name: 'Amharic',    dir: 'ltr', libreSupported: false },
  ti: { libre: null,   nllb: 'tir_Ethi', name: 'Tigrinya',   dir: 'ltr', libreSupported: false },
  so: { libre: null,   nllb: 'som_Latn', name: 'Somali',     dir: 'ltr', libreSupported: false },
  om: { libre: null,   nllb: 'gaz_Latn', name: 'Oromo',      dir: 'ltr', libreSupported: false },
  uk: { libre: 'uk',   nllb: 'ukr_Cyrl', name: 'Ukrainian',  dir: 'ltr', libreSupported: true  },
  ro: { libre: 'ro',   nllb: 'ron_Latn', name: 'Romanian',   dir: 'ltr', libreSupported: true  },
  pl: { libre: 'pl',   nllb: 'pol_Latn', name: 'Polish',     dir: 'ltr', libreSupported: true  },
  fr: { libre: 'fr',   nllb: 'fra_Latn', name: 'French',     dir: 'ltr', libreSupported: true  },
}

const TARGET_LANGS = process.env.TRANSLATE_LANGS
  ? process.env.TRANSLATE_LANGS.split(',').map(l => l.trim())
  : Object.keys(LANG_MAP)

// ─── Translation providers ───────────────────────────────────────────────────

/**
 * LibreTranslate / Argos Translate — free, no API key.
 * POST /translate with JSON body.
 */
async function libreTranslate(text, targetCode) {
  const encoded = text.slice(0, 5000) // max string length
  const res = await fetch(`${LIBRE_ENDPOINT}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: encoded, source: 'en', target: targetCode, format: 'text' }),
  })
  if (!res.ok) throw new Error(`LibreTranslate error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  if (!data.translatedText) throw new Error('LibreTranslate: empty response')
  return data.translatedText
}

/**
 * NLLB-200 self-hosted endpoint — requires NLLB_ENDPOINT to be set.
 * Uses LibreTranslate-compatible API format with NLLB language codes.
 */
async function nllbTranslate(text, nllbTargetCode) {
  if (!NLLB_ENDPOINT) throw new Error('NLLB_ENDPOINT not set')
  const res = await fetch(`${NLLB_ENDPOINT}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'eng_Latn', target: nllbTargetCode, format: 'text' }),
  })
  if (!res.ok) throw new Error(`NLLB error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  if (!data.translatedText) throw new Error('NLLB: empty response')
  return data.translatedText
}

async function translateText(text, langCode) {
  const lang = LANG_MAP[langCode]
  if (!lang) return text
  // Skip empty/short strings
  if (!text || text.trim().length < 2) return text
  // Preserve URLs and phone numbers
  if (/^https?:\/\//.test(text) || /^\+?\d[\d\s\-()]{6,}$/.test(text)) return text

  // Provider A: LibreTranslate (for supported pairs)
  if (lang.libreSupported && lang.libre) {
    try {
      const result = await libreTranslate(text, lang.libre)
      return result
    } catch (e) {
      console.warn(`  LibreTranslate failed (${langCode}): ${e.message}`)
    }
  }

  // Provider B: NLLB (for low-resource languages or LibreTranslate fallback)
  if (lang.nllb && NLLB_ENDPOINT) {
    try {
      return await nllbTranslate(text, lang.nllb)
    } catch (e) {
      console.warn(`  NLLB failed (${langCode}): ${e.message}`)
    }
  } else if (!lang.libreSupported && !NLLB_ENDPOINT) {
    console.warn(`  Skipping ${lang.name} — requires NLLB_ENDPOINT (self-hosted NLLB-200 service)`)
  }

  return text // Return original on failure
}

async function translateStrings(strings, langCode) {
  const lang = LANG_MAP[langCode]

  // Try LibreTranslate for supported languages (sequential with rate limiting)
  if (lang?.libreSupported && lang.libre) {
    const results = []
    for (const s of strings) {
      results.push(await translateText(s, langCode))
      await new Promise(r => setTimeout(r, 200)) // Rate limiting
    }
    return results
  }

  // NLLB for low-resource languages
  if (lang?.nllb && NLLB_ENDPOINT) {
    const results = []
    for (const s of strings) {
      results.push(await translateText(s, langCode))
      await new Promise(r => setTimeout(r, 300)) // NLLB needs more breathing room
    }
    return results
  }

  // No provider — return originals
  return strings.map(() => '').map((_, i) => strings[i])
}

// ─── Content extraction + injection ──────────────────────────────────────────

function extractStrings(items, langCode) {
  const strings = []
  const positions = [] // [itemIndex, field, stepIndex?]

  for (let i = 0; i < items.length; i++) {
    const en = items[i].content?.en
    if (!en) continue
    // Skip if translation already exists
    if (items[i].content?.[langCode]?.title) continue

    if (en.title)            { strings.push(en.title);   positions.push([i, 'title'])        }
    if (en.summary)          { strings.push(en.summary); positions.push([i, 'summary'])      }
    if (Array.isArray(en.steps)) {
      en.steps.forEach((step, j) => {
        strings.push(step)
        positions.push([i, 'step', j])
      })
    }
  }

  return { strings, positions }
}

function injectTranslations(items, langCode, strings, positions) {
  const byItem = {}
  for (let k = 0; k < positions.length; k++) {
    const [i, field, stepIdx] = positions[k]
    if (!byItem[i]) byItem[i] = { title: '', summary: '', steps: [] }
    if (field === 'title')        byItem[i].title = strings[k]
    else if (field === 'summary') byItem[i].summary = strings[k]
    else if (field === 'step')    byItem[i].steps[stepIdx] = strings[k]
  }

  for (const [i, content] of Object.entries(byItem)) {
    const item = items[Number(i)]
    if (content.title && content.summary && content.steps.length > 0) {
      item.content[langCode] = content
    }
  }
}

// ─── File rewriting ───────────────────────────────────────────────────────────

function serializeContent(guide) {
  const langs = Object.keys(guide.content)
  const parts = langs.map(lang => {
    const c = guide.content[lang]
    const stepsStr = JSON.stringify(c.steps, null, 0)
    return `${lang}: { title: ${JSON.stringify(c.title)}, summary: ${JSON.stringify(c.summary)}, steps: ${stepsStr} }`
  })
  return `{ ${parts.join(', ')} }`
}

function findObjectEnd(src, start) {
  let depth = 0
  let i = start
  while (i < src.length) {
    const ch = src[i]
    if (ch === '"' || ch === "'") {
      const quote = ch
      i++
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue }
        if (src[i] === quote) break
        i++
      }
    } else if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) return i + 1
    }
    i++
  }
  return -1
}

function generateTranslatedFile(guides, outputPath) {
  let src = readFileSync(outputPath, 'utf8')

  for (const guide of guides) {
    if (!guide.content) continue
    const langs = Object.keys(guide.content)
    if (langs.length <= 1) continue

    const idIdx = src.indexOf(`id: "${guide.id}"`)
    if (idIdx === -1) continue

    const contentKeyIdx = src.indexOf('content: ', idIdx)
    if (contentKeyIdx === -1) continue

    const objStart = contentKeyIdx + 'content: '.length
    if (src[objStart] !== '{') continue

    const objEnd = findObjectEnd(src, objStart)
    if (objEnd === -1) continue

    src = src.slice(0, objStart) + serializeContent(guide) + src.slice(objEnd)
  }

  writeFileSync(outputPath, src, 'utf8')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍 Auto-Translate — New Life UK\n')
  console.log('Provider A: LibreTranslate / Argos Translate (free, open-source, no API key)')
  console.log(`  Endpoint: ${LIBRE_ENDPOINT}`)
  if (NLLB_ENDPOINT) {
    console.log('Provider B: NLLB-200 self-hosted endpoint (free, open-source, no API key)')
    console.log(`  Endpoint: ${NLLB_ENDPOINT}`)
  } else {
    console.log('Provider B: NLLB-200 — NOT configured (set NLLB_ENDPOINT for: am, ti, so, om, ur)')
  }
  console.log(`Languages: ${TARGET_LANGS.map(l => LANG_MAP[l]?.name || l).join(', ')}`)
  console.log(`Dry run: ${DRY}\n`)
  console.log('⚠ All translations are machine-generated and may be inaccurate.')
  console.log('  Do not use for legal, immigration, or financial decisions without official verification.\n')

  const guidesPath = path.join(ROOT, 'src/data/guides.js')
  const { GUIDES } = await import(`file://${guidesPath}?v=${Date.now()}`)

  let totalTranslated = 0

  for (const lang of TARGET_LANGS) {
    const langInfo = LANG_MAP[lang]
    if (!langInfo) continue

    if (!langInfo.libreSupported && !NLLB_ENDPOINT) {
      console.log(`⏭  Skipping ${langInfo.name} — requires NLLB_ENDPOINT (self-hosted NLLB-200 service)`)
      continue
    }

    const { strings, positions } = extractStrings(GUIDES, lang)
    if (strings.length === 0) {
      console.log(`✅ ${langInfo.name} — already fully translated`)
      continue
    }

    console.log(`\n🔄 Translating ${langInfo.name} (${strings.length} strings)...`)
    try {
      const translated = await translateStrings(strings, lang)
      injectTranslations(GUIDES, lang, translated, positions)
      totalTranslated += strings.length
      console.log(`   ✓ Done`)
    } catch (e) {
      console.error(`   ✗ Failed: ${e.message}`)
    }
  }

  if (totalTranslated === 0) {
    console.log('\n✅ All translations are already complete — nothing to do.')
    return
  }

  if (!DRY) {
    console.log('\n📝 Writing translations to src/data/guides.js...')
    generateTranslatedFile(GUIDES, guidesPath)
    console.log(`✅ Done — ${totalTranslated} strings translated across ${TARGET_LANGS.length} languages`)
  } else {
    console.log('\n[DRY RUN] Would write translations to src/data/guides.js')
  }
}

main().catch(e => { console.error(e); process.exit(1) })
