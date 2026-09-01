/**
 * Colour contrast, measured rather than assumed.
 *
 * The August 2026 audit recorded 35 failing contrast pairs and they survived
 * the audit, because nothing failed when they did. The worst was "⚠️ Action
 * needed" — the highest-stakes label in the app, the one telling someone a
 * deadline is running — rendered at 3.2:1 in dark mode.
 *
 * The cause was not a badly chosen token. --rd is #F87171 in dark mode and
 * reaches 5.9:1. Four components bypassed it and hardcoded `#dc2626`, the
 * LIGHT-mode red, so dark mode kept a colour picked for a white page. A
 * hardcoded hex cannot respond to the theme, which makes it a correctness bug
 * and not a matter of taste.
 *
 * So this file asserts two things: the tokens themselves clear WCAG AA, and no
 * component sets a text colour to a literal hex instead of a token.
 *
 * The threshold is WCAG 2.1 AA for body text: 4.5:1. Large text and non-text
 * boundaries are allowed 3:1, but nothing here is asserted at that level — see
 * the note on --bd below for why.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = dirname(dirname(fileURLToPath(import.meta.url)))
const TOKENS = readFileSync(join(SRC, 'styles', 'tokens.css'), 'utf8')

const AA_TEXT = 4.5

function channel(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Tokens from one theme block. `:root` is light, `.dark` is dark. */
function tokensFor(selector: string): Record<string, string> {
  const block = TOKENS.split(selector)[1].split('}')[0]
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})/g)) {
    out[m[1]] = m[2]
  }
  return out
}

const LIGHT = tokensFor(':root')
const DARK = tokensFor('.dark')

/** Every surface a piece of text can sit on. */
const SURFACES = ['--bg', '--bg2', '--bg3']
/** Foregrounds that carry words, so they owe the full 4.5:1. */
const TEXT = ['--tx', '--t2', '--t3', '--ac', '--gn', '--wn', '--rd']

function walkFiles(dir: string, pattern: RegExp, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walkFiles(p, pattern, out)
    else if (pattern.test(entry)) out.push(p)
  }
  return out
}

describe.each([['light', LIGHT], ['dark', DARK]] as const)('%s theme', (name, t) => {
  it('defines every token this test relies on', () => {
    for (const k of [...SURFACES, ...TEXT]) {
      expect(t[k], `${name}: ${k} is not a hex token`).toBeDefined()
    }
  })

  it('renders every text colour at WCAG AA on every surface', () => {
    const failures: string[] = []
    for (const fg of TEXT) {
      for (const bg of SURFACES) {
        const ratio = contrast(t[fg], t[bg])
        if (ratio < AA_TEXT) {
          failures.push(`${fg} (${t[fg]}) on ${bg} (${t[bg]}) = ${ratio.toFixed(2)}:1`)
        }
      }
    }
    expect(failures, `${name} theme below ${AA_TEXT}:1`).toEqual([])
  })

  // Deliberately NOT asserted here: --bd contrast against the surfaces it
  // divides. It sits between 1.08:1 and 1.21:1 in light mode, which is faint,
  // but WCAG exempts purely decorative separators and picking a threshold
  // above it would be me overruling a deliberate light, airy design on no
  // authority. The audit's actual border bug was different in kind — borders
  // that did not render AT ALL, because `border: 1.5px solid var(--sep)`
  // referenced an undefined token and collapsed to border-style: none. That
  // failure mode is real, and designTokens.test.ts already catches it by
  // resolving every var(). A contrast floor here would not have caught it and
  // would only constrain the palette.
})

// The test above checks tokens as FOREGROUND on the three surfaces. That is not
// enough, and missing it shipped a real bug: --rd is a light red in dark mode
// (#F87171), .btn-danger paints it as a BACKGROUND with white text, and that
// rendered the SOS modal's emergency phone numbers at 2.77:1. The
// foreground-on-surface test passed the whole time.
//
// So this reads the stylesheets rather than a list of pairs I believe are
// correct. A hand-written list would encode my intent and keep passing if
// someone deleted the .dark override — which is exactly the failure it is here
// to prevent.
/**
 * Dark-mode selectors come in two forms, and only one of them works in a CSS
 * module. A plain `.dark` inside a *.module.css is HASHED by the bundler —
 * `._dark_or77r_117 ._crashLink_...` — so it can never match the global .dark
 * class on the root element, and the rule is silently dead. `:global(.dark)`
 * compiles to `.dark ._crashLink_...` and works. Both forms existed in this
 * codebase; the plain ones happened to be harmless because --ac and --ac3 hold
 * the same value in both themes, so they were no-ops either way. The next one
 * would not be.
 */
const IS_DARK = /(^|\s|\))\s*\.dark(\s|\.)|:global\(\.dark\)/
const DARK_PREFIX = /^(:global\(\.dark\)|\.dark)\s*/

describe('dark-mode selectors in CSS modules', () => {
  it('uses :global(.dark), because a plain .dark is hashed and does nothing', () => {
    const offenders: string[] = []
    for (const path of walkFiles(SRC, /\.module\.css$/)) {
      const src = readFileSync(path, 'utf8')
      for (const m of src.matchAll(/^[^\S\n]*\.dark[\s.]/gm)) {
        offenders.push(`${path.slice(SRC.length + 1)}: ${m[0].trim()}`)
      }
    }
    expect(offenders, 'use :global(.dark) in module CSS').toEqual([])
  })
})

describe('text painted on an accent background', () => {
  const CSS_FILES = walkFiles(SRC, /\.css$/)

  /** Every rule under .dark that repaints a text colour, keyed by base selector. */
  function darkColourOverrides(): Set<string> {
    const out = new Set<string>()
    for (const path of CSS_FILES) {
      const src = readFileSync(path, 'utf8')
      for (const m of src.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
        const [, selector, body] = m
        if (!IS_DARK.test(selector)) continue
        if (!/(?:^|[;\s])color:/.test(body)) continue
        // ".dark .btn-danger" -> ".btn-danger"
        for (const part of selector.split(',')) {
          // The selector capture runs back to the previous rule, so it carries
          // comments and blank lines with it. Keep only the last line.
          const clean = part.trim().split('\n').pop()!.trim()
          out.add(clean.replace(DARK_PREFIX, '').trim())
        }
      }
    }
    return out
  }

  /** Rules that set both a background token and a literal text colour. */
  function paintedRules() {
    const out: Array<{ file: string; selector: string; token: string; text: string; dark: boolean }> = []
    for (const path of CSS_FILES) {
      const src = readFileSync(path, 'utf8')
      for (const m of src.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
        const [, selector, body] = m
        const bg = body.match(/background:\s*var\((--[a-z0-9-]+)\)/)
        const fg = body.match(/(?:^|[;\s])color:\s*(#[0-9A-Fa-f]{3,6})/)
        if (!bg || !fg) continue
        let hex = fg[1]
        if (hex.length === 4) hex = '#' + [...hex.slice(1)].map(c => c + c).join('')
        for (const part of selector.split(',')) {
          out.push({
            file: path.slice(SRC.length + 1),
            selector: part.trim().split('\n').pop()!.trim(),
            token: bg[1],
            text: hex,
            dark: IS_DARK.test(part),
          })
        }
      }
    }
    return out
  }

  it('finds rules to check, so this cannot pass vacuously', () => {
    expect(paintedRules().length).toBeGreaterThan(0)
  })

  it('keeps that text readable against the token it sits on, in the theme it applies to', () => {
    const overridden = darkColourOverrides()
    const failures: string[] = []
    for (const r of paintedRules()) {
      const themes = r.dark
        ? ([['dark', DARK]] as const)
        : ([['light', LIGHT], ['dark', DARK]] as const)
      for (const [name, tokens] of themes) {
        const bg = tokens[r.token]
        if (!bg) continue
        // A light-mode rule still applies in dark mode UNLESS a .dark rule
        // repaints its text colour. That override is what makes .btn-primary
        // safe on the same token that makes .btn-danger unsafe.
        if (name === 'dark' && !r.dark && overridden.has(r.selector)) continue
        const ratio = contrast(r.text, bg)
        if (ratio < AA_TEXT) {
          failures.push(`${name}: ${r.file} ${r.selector} — ${r.text} on ${r.token} (${bg}) = ${ratio.toFixed(2)}:1`)
        }
      }
    }
    expect(failures, `text below ${AA_TEXT}:1 on its own background`).toEqual([])
  })
})

describe('components do not hardcode text colours', () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry)
      if (statSync(p).isDirectory()) walk(p, out)
      else if (/\.tsx$/.test(entry)) out.push(p)
    }
    return out
  }

  it('sets colour from a token, so the theme can change it', () => {
    const offenders: string[] = []
    for (const path of walk(SRC)) {
      // ErrorBoundary is the one justified exception: it renders after the
      // app has thrown, possibly inside the provider that applies the theme.
      // Self-contained styling is the point there — a crash screen that
      // depends on the layer that just crashed is not a crash screen.
      if (path.includes('__tests__') || path.endsWith('ErrorBoundary.tsx')) continue
      const src = readFileSync(path, 'utf8')
      for (const m of src.matchAll(/color:\s*['"]#[0-9a-fA-F]{3,8}['"]/g)) {
        offenders.push(`${path.slice(SRC.length + 1)}: ${m[0]}`)
      }
    }
    // A literal hex is fixed at authoring time and cannot answer to .dark, so
    // it is wrong in one theme by construction — which is exactly how
    // "Action needed" ended up at 3.2:1.
    expect(offenders, 'use var(--token) instead of a literal hex').toEqual([])
  })
})
