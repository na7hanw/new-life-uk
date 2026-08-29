/**
 * Design-token integrity.
 *
 * The August 2026 audit found seven custom properties referenced 46 times and
 * defined nowhere: --t1, --sep, --r, --border, --card, --surface2, --ac-rgb.
 * A var() that cannot resolve makes the whole declaration invalid at
 * computed-value time, and border-style's initial value is `none` — so
 * `border: 1.5px solid var(--sep)` silently rendered NO BORDER.
 *
 * The visible consequences included two control groups with no focus indicator
 * at all (a WCAG 2.4.7 failure), a glossary popover with no edge at 1.04:1
 * against its own background, and missing card boundaries throughout.
 *
 * None of it was detectable at build time, because CSS does not error. This
 * test is the detection.
 *
 * Reads from disk with node:fs rather than import.meta.glob: Vitest stubs CSS
 * imports by default (css: false), so a `?raw` glob returns empty strings and
 * every assertion here would pass vacuously.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// __tests__ -> src
const SRC = dirname(dirname(fileURLToPath(import.meta.url)))

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(css|tsx)$/.test(entry)) out.push(p)
  }
  return out
}

const ALL_FILES = walk(SRC)
const TOKENS_PATH = ALL_FILES.find(p => p.endsWith(join('styles', 'tokens.css')))!
const TOKENS_CSS = readFileSync(TOKENS_PATH, 'utf8')

const defined = new Set([...TOKENS_CSS.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map(m => m[1]))

describe('CSS custom properties', () => {
  it('finds the token file and some tokens', () => {
    expect(TOKENS_PATH, 'styles/tokens.css must be discoverable').toBeTruthy()
    expect(defined.size).toBeGreaterThan(10)
  })

  it('every var() reference resolves to a token defined in tokens.css', () => {
    const missing = new Map<string, string[]>()

    for (const path of ALL_FILES) {
      const src = readFileSync(path, 'utf8')
      for (const m of src.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
        const name = m[1]
        if (defined.has(name)) continue
        // A var() with its own fallback still degrades gracefully; an undefined
        // token with no fallback silently deletes its whole declaration.
        const hasFallback = /^\s*,/.test(src.slice(m.index! + m[0].length))
        if (hasFallback) continue
        if (!missing.has(name)) missing.set(name, [])
        missing.get(name)!.push(path.replace(SRC, 'src'))
      }
    }

    const report = [...missing.entries()]
      .map(([name, files]) => `${name} (${files.length} usages, e.g. ${files[0]})`)
      .join('\n  ')

    expect(missing.size, `undefined CSS tokens:\n  ${report}`).toBe(0)
  })

  it('defines the tokens the theme depends on, in both themes', () => {
    const darkBlock = TOKENS_CSS.slice(TOKENS_CSS.indexOf('.dark'))
    // Anything colour-bearing must be overridden for dark, or dark mode reuses
    // a light value against a near-black background.
    for (const t of ['--bg', '--bg2', '--bd', '--tx', '--t2', '--t3', '--ac']) {
      expect(defined.has(t), `${t} must be defined`).toBe(true)
      expect(darkBlock, `${t} must have a dark override`).toContain(`${t}:`)
    }
  })
})

describe('motion', () => {
  it('respects prefers-reduced-motion', () => {
    const p = ALL_FILES.find(f => f.endsWith(join('styles', 'transitions.css')))
    expect(p, 'transitions.css must exist').toBeTruthy()
    expect(readFileSync(p!, 'utf8')).toContain('prefers-reduced-motion: reduce')
  })
})
