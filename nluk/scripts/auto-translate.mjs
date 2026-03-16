#!/usr/bin/env node
/**
 * auto-translate.mjs
 *
 * Automatically translates missing language content in guides.js and jobs.js.
 *
 * Primary API:   Google Cloud Translation (free 500k chars/month, supports all 12 languages)
 * Fallback API:  MyMemory (free, no key, supports 10 languages — no Tigrinya/Oromo)
 *
 * Usage:
 *   node --experimental-vm-modules scripts/auto-translate.mjs
 *
 * Environment variables:
 *   GOOGLE_TRANSLATE_API_KEY — Google Cloud project API key (optional, improves quality + adds Tigrinya/Oromo)
 *   TRANSLATE_LANGS           — Comma-separated subset of langs to translate (optional)
 *   DRY_RUN                   — Set to 'true' to print without writing (optional)
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DRY = process.env.DRY_RUN === 'true'

// ─── Language config ───────────────────────────────────────────────────────────
// Maps our internal lang codes to Google/MyMemory API codes
const LANG_MAP = {
  ar: { google: 'ar', mymemory: 'AR',   name: 'Arabic',     dir: 'rtl' },
  fa: { google: 'fa', mymemory: 'FA',   name: 'Persian',    dir: 'rtl' },
  ur: { google: 'ur', mymemory: 'UR',   name: 'Urdu',       dir: 'rtl' },
  am: { google: 'am', mymemory: 'AM',   name: 'Amharic',    dir: 'ltr' },
  ti: { google: 'ti', mymemory: null,   name: 'Tigrinya',   dir: 'ltr' }, // Google only
  so: { google: 'so', mymemory: 'SO',   name: 'Somali',     dir: 'ltr' },
  om: { google: 'om', mymemory: null,   name: 'Oromo',      dir: 'ltr' }, // Google only
  uk: { google: 'uk', mymemory: 'UK',   name: 'Ukrainian',  dir: 'ltr' },
  ro: { google: 'ro', mymemory: 'RO',   name: 'Romanian',   dir: 'ltr' },
  pl: { google: 'pl', mymemory: 'PL',   name: 'Polish',     dir: 'ltr' },
  fr: { google: 'fr', mymemory: 'FR',   name: 'French',     dir: 'ltr' },
}

const GOOGLE_KEY = process.env.GOOGLE_TRANSLATE_API_KEY
const TARGET_LANGS = process.env.TRANSLATE_LANGS
  ? process.env.TRANSLATE_LANGS.split(',').map(l => l.trim())
  : Object.keys(LANG_MAP)

// ─── Translation APIs ─────────────────────────────────────────────────────────

async function googleTranslate(texts, targetLang) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`
  const body = JSON.stringify({ q: texts, source: 'en', target: targetLang, format: 'text' })
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  if (!res.ok) throw new Error(`Google Translate error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.data.translations.map(t => t.translatedText)
}

async function myMemoryTranslate(text, targetLang) {
  const encoded = encodeURIComponent(text.slice(0, 500)) // MyMemory limit
  const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|${targetLang}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MyMemory error: ${res.status}`)
  const data = await res.json()
  if (data.responseStatus !== 200) throw new Error(`MyMemory: ${data.responseDetails}`)
  return data.responseData.translatedText
}

async function translateText(text, langCode) {
  const lang = LANG_MAP[langCode]
  if (!lang) return text
  // Skip empty/short strings
  if (!text || text.trim().length < 2) return text
  // Preserve URLs and phone numbers
  if (/^https?:\/\//.test(text) || /^\d{3,}/.test(text)) return text

  if (GOOGLE_KEY) {
    try {
      const [result] = await googleTranslate([text], lang.google)
      return result
    } catch (e) {
      console.warn(`  Google failed (${langCode}): ${e.message}, trying MyMemory...`)
    }
  }

  // Fallback to MyMemory
  if (lang.mymemory) {
    try {
      return await myMemoryTranslate(text, lang.mymemory)
    } catch (e) {
      console.warn(`  MyMemory failed (${langCode}): ${e.message}`)
    }
  } else if (!GOOGLE_KEY) {
    console.warn(`  Skipping ${lang.name} (Tigrinya/Oromo require Google Cloud API key)`)
  }

  return text // Return original on failure
}

async function translateStrings(strings, langCode) {
  // Batch with Google Translate for efficiency
  if (GOOGLE_KEY && strings.length > 0) {
    const lang = LANG_MAP[langCode]
    try {
      return await googleTranslate(strings, lang.google)
    } catch (e) {
      console.warn(`  Google batch failed (${langCode}): ${e.message}`)
    }
  }

  // Sequential fallback
  const results = []
  for (const s of strings) {
    results.push(await translateText(s, langCode))
    await new Promise(r => setTimeout(r, 150)) // Rate limiting
  }
  return results
}

// ─── Content extraction + injection ──────────────────────────────────────────

function getGuideEnContent(guide) {
  return guide.content?.en || null
}

/**
 * Given a list of guides/jobs, collect all English strings that need translating
 * and return a flat array + a restore function.
 */
function extractStrings(items, langCode) {
  const strings = []
  const positions = [] // [itemIndex, field, stepIndex?]

  for (let i = 0; i < items.length; i++) {
    const en = items[i].content?.en
    if (!en) continue
    // Skip if translation already exists
    if (items[i].content?.[langCode]?.title) continue

    if (en.title) { strings.push(en.title); positions.push([i, 'title']) }
    if (en.summary) { strings.push(en.summary); positions.push([i, 'summary']) }
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
  // Build translated content per item
  const byItem = {}
  for (let k = 0; k < positions.length; k++) {
    const [i, field, stepIdx] = positions[k]
    if (!byItem[i]) byItem[i] = { title: '', summary: '', steps: [] }
    if (field === 'title') byItem[i].title = strings[k]
    else if (field === 'summary') byItem[i].summary = strings[k]
    else if (field === 'step') byItem[i].steps[stepIdx] = strings[k]
  }

  for (const [i, content] of Object.entries(byItem)) {
    const item = items[Number(i)]
    // Only set if we have all three fields
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌍 Auto-Translate — New Life UK\n')
  console.log(`API: ${GOOGLE_KEY ? 'Google Cloud Translation' : 'MyMemory (free tier)'}`)
  console.log(`Languages: ${TARGET_LANGS.map(l => LANG_MAP[l]?.name || l).join(', ')}`)
  console.log(`Dry run: ${DRY}\n`)

  // Import the data
  const guidesPath = path.join(ROOT, 'src/data/guides.js')
  const { GUIDES } = await import(`file://${guidesPath}?v=${Date.now()}`)

  let totalTranslated = 0
  let totalSkipped = 0

  for (const lang of TARGET_LANGS) {
    const langInfo = LANG_MAP[lang]
    if (!langInfo) continue

    if (!langInfo.mymemory && !GOOGLE_KEY) {
      console.log(`⏭  Skipping ${langInfo.name} (requires Google Cloud API key)`)
      totalSkipped++
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

  // Rewrite guides.js with new translations
  if (!DRY) {
    console.log('\n📝 Writing translations to src/data/guides.js...')
    generateTranslatedFile(GUIDES, guidesPath)
    console.log(`✅ Done — ${totalTranslated} strings translated across ${TARGET_LANGS.length} languages`)
  } else {
    console.log('\n[DRY RUN] Would write translations to src/data/guides.js')
  }
}

/**
 * Scans `src` starting at `src[start]` (which must be `{`) and returns the
 * index immediately after the matching closing `}`. Unlike a naïve brace
 * counter, this skips over single- and double-quoted string literals so that
 * `{` / `}` characters embedded inside string values are not miscounted.
 *
 * @param {string} src
 * @param {number} start - index of the opening `{`
 * @returns {number} index after the matching `}`, or -1 if unmatched
 */
function findObjectEnd(src, start) {
  let depth = 0
  let i = start
  while (i < src.length) {
    const ch = src[i]
    if (ch === '"' || ch === "'") {
      const quote = ch
      i++
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue } // skip escape sequence
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
  return -1 // unmatched opening brace
}

function generateTranslatedFile(guides, outputPath) {
  let src = readFileSync(outputPath, 'utf8')

  for (const guide of guides) {
    if (!guide.content) continue
    const langs = Object.keys(guide.content)
    if (langs.length <= 1) continue // only `en` — nothing new to write

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

main().catch(e => { console.error(e); process.exit(1) })
