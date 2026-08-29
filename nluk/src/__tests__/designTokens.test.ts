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
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// __tests__ -> src
const SRC = dirname(dirname(fileURLToPath(import.meta.url)))

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(css|tsx)$/.test(e)) out.push(p)
  }
  return out
}

const TOKENS_FILE = join(SRC, 'styles', 'tokens.css')
const defined = new Set(
  [...readFileSync(TOKENS_FILE, 'utf8').matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map(m => m[1])
)

describe('CSS custom properties', () => {
  it('every var() reference resolves to a token defined in tokens.css', () => {
    const missing = new Map<string, string[]>()

    for (const file of walk(SRC)) {
      const src = readFileSync(file, 'utf8')
      for (const m of src.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
        const name = m[1]
        if (defined.has(name)) continue
        // A var() with its own fallback still degrades gracefully, but an
        // undefined token with no fallback silently deletes its declaration.
        const rest = src.slice(m.index! + m[0].length)
        const hasFallback = /^\s*,/.test(rest)
        if (hasFallback) continue
        if (!missing.has(name)) missing.set(name, [])
        missing.get(name)!.push(file.replace(SRC, 'src'))
      }
    }

    const report = [...missing.entries()]
      .map(([name, files]) => `${name} (${files.length} usages, e.g. ${files[0]})`)
      .join('\n  ')

    expect(missing.size, `undefined CSS tokens:\n  ${report}`).toBe(0)
  })

  it('defines the tokens the theme depends on, in both themes', () => {
    const css = readFileSync(TOKENS_FILE, 'utf8')
    const darkBlock = css.slice(css.indexOf('.dark'))
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
    const css = readFileSync(join(SRC, 'styles', 'transitions.css'), 'utf8')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
