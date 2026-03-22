#!/usr/bin/env node
/**
 * verify-links.mjs
 *
 * Extracts every URL from the TypeScript data files, checks each one
 * concurrently, and reports 4xx/5xx errors and permanent redirects (301).
 *
 * Usage:
 *   node scripts/verify-links.mjs
 *   node scripts/verify-links.mjs --concurrency=10
 *   node scripts/verify-links.mjs --timeout=15000
 *
 * Exit codes:
 *   0 — all URLs OK
 *   1 — one or more broken / permanently-redirected URLs found
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Config ──────────────────────────────────────────────────────────────────
const CONCURRENCY = Number(
  process.argv.find(a => a.startsWith('--concurrency='))?.split('=')[1] ?? 8
)
const TIMEOUT_MS = Number(
  process.argv.find(a => a.startsWith('--timeout='))?.split('=')[1] ?? 20_000
)

// Data files to scan
const DATA_FILES = [
  'src/data/guides.ts',
  'src/data/saves.ts',
  'src/data/apps.ts',
  'src/data/jobs.ts',
  'src/data/culture.ts',
  'src/data/emergency.ts',
  'src/data/immigration-updates.ts',
].map(f => resolve(ROOT, f))

// Sites known to actively block CI/headless requests — treat any response as OK
const SKIP_DOMAINS = [
  'facebook.com',
  'linkedin.com',
  'apps.apple.com',
  'play.google.com',
]

// ── URL extraction ───────────────────────────────────────────────────────────
function extractUrls(filePaths) {
  const urlSet = new Set()
  const urlRegex = /https?:\/\/[^\s"'`),]+/g

  for (const filePath of filePaths) {
    let src
    try {
      src = readFileSync(filePath, 'utf8')
    } catch {
      console.warn(`  ⚠ Could not read ${filePath}`)
      continue
    }
    for (const match of src.matchAll(urlRegex)) {
      // Strip trailing punctuation that may be part of the surrounding code
      const url = match[0].replace(/[.,;)>\]]+$/, '')
      try {
        new URL(url) // validate it's a real URL
        urlSet.add(url)
      } catch {
        // skip malformed matches
      }
    }
  }

  return [...urlSet]
}

// ── Link checker ─────────────────────────────────────────────────────────────
async function checkUrl(url) {
  // Skip known bot-blocking domains
  if (SKIP_DOMAINS.some(d => url.includes(d))) {
    return { url, status: 'skipped', code: null }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual', // don't follow — we want to see 301s
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; New-Life-UK-LinkChecker/1.0)',
        Accept: '*/*',
      },
    })
    clearTimeout(timer)

    if (res.status === 301) {
      return {
        url,
        status: 'redirect',
        code: 301,
        location: res.headers.get('location'),
      }
    }
    if (res.status === 405) {
      // Server doesn't allow HEAD — retry with GET
      const res2 = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; New-Life-UK-LinkChecker/1.0)' },
      })
      if (res2.status >= 400 && res2.status !== 403 && res2.status !== 429) {
        return { url, status: 'broken', code: res2.status }
      }
      return { url, status: 'ok', code: res2.status }
    }
    if (res.status >= 400 && res.status !== 403 && res.status !== 429) {
      return { url, status: 'broken', code: res.status }
    }
    return { url, status: 'ok', code: res.status }
  } catch (err) {
    clearTimeout(timer)
    const reason = err.name === 'AbortError' ? 'timeout' : err.message
    return { url, status: 'error', code: null, error: reason }
  }
}

// ── Concurrency pool ─────────────────────────────────────────────────────────
async function checkAll(urls) {
  const results = []
  const queue = [...urls]
  let done = 0

  async function worker() {
    while (queue.length) {
      const url = queue.shift()
      if (!url) break
      const result = await checkUrl(url)
      done++
      if (process.stdout.isTTY) {
        process.stdout.write(
          `\r  Checked ${done}/${urls.length} — ${url.slice(0, 60).padEnd(60)}`
        )
      }
      results.push(result)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(80) + '\r')
  return results
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔗 New Life UK — Link Verifier\n')
  console.log(`Scanning ${DATA_FILES.length} data files…`)

  const urls = extractUrls(DATA_FILES)
  console.log(`Found ${urls.length} unique URLs\n`)
  console.log(`Checking with concurrency=${CONCURRENCY}, timeout=${TIMEOUT_MS}ms…\n`)

  const results = await checkAll(urls)

  const broken = results.filter(r => r.status === 'broken')
  const errors = results.filter(r => r.status === 'error')
  const redirects = results.filter(r => r.status === 'redirect')
  const skipped = results.filter(r => r.status === 'skipped')
  const ok = results.filter(r => r.status === 'ok')

  // ── Report ───────────────────────────────────────────────────────────────
  if (broken.length) {
    console.log(`\n❌ BROKEN (${broken.length}):`)
    for (const r of broken) console.log(`  [${r.code}] ${r.url}`)
  }

  if (errors.length) {
    console.log(`\n⚠  ERRORS (${errors.length}):`)
    for (const r of errors) console.log(`  [${r.error}] ${r.url}`)
  }

  if (redirects.length) {
    console.log(`\n↪  PERMANENT REDIRECTS — update these URLs (${redirects.length}):`)
    for (const r of redirects) console.log(`  301  ${r.url}\n       → ${r.location}`)
  }

  console.log(`\n── Summary ──────────────────────────────────────────`)
  console.log(`  ✅ OK:       ${ok.length}`)
  console.log(`  ↪  Redirect: ${redirects.length}`)
  console.log(`  ❌ Broken:   ${broken.length}`)
  console.log(`  ⚠  Error:    ${errors.length}`)
  console.log(`  ⏭  Skipped:  ${skipped.length}`)
  console.log(`  Total:       ${urls.length}`)

  const hasIssues = broken.length > 0 || errors.length > 0
  if (hasIssues) {
    console.log('\n❌ Link check FAILED — fix broken links before deploying.')
    process.exit(1)
  } else {
    console.log(
      redirects.length
        ? '\n⚠  Link check passed with redirect warnings — consider updating those URLs.'
        : '\n✅ All links OK!'
    )
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
