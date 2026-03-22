import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useMemo, memo, type JSX } from 'react'
import GlossaryTerm from './GlossaryTerm.tsx'
import { getGlossaryTermKeys } from '../data/glossary.ts'

// ── One-time DOMPurify hook: validates href scheme + adds target/rel/class ──
// Runs after each sanitize call on every <a> element that survives sanitization.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ((node as Element).tagName !== 'A') return
  const el = node as HTMLAnchorElement
  const href = el.getAttribute('href') || ''
  try {
    const { protocol } = new URL(href)
    if (protocol !== 'https:' && protocol !== 'http:') el.setAttribute('href', '#')
  } catch {
    if (href && href !== '#') el.setAttribute('href', '#')
  }
  el.setAttribute('target', '_blank')
  el.setAttribute('rel', 'noopener noreferrer')
  el.classList.add('step-link')
})

// DOMPurify config for marked output — allows inline elements only
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PURIFY_CONFIG: Record<string, any> = {
  ALLOWED_TAGS: ['a', 'strong', 'em', 'code', 'span'],
  ALLOWED_ATTR: ['href', 'rel', 'class'],
  ADD_ATTR: ['target'],
  FORCE_BODY: false,
}

// ── Pre-process: convert bare https?:// URLs → [display](url) markdown links ──
// Negative lookbehind skips URLs already inside [label](url) syntax.
const BARE_URL_RE = /(?<!\]\()https?:\/\/[^\s,;)]+/g

function normalizeBareUrls(text: string): string {
  return text.replace(BARE_URL_RE, (match) => {
    // Strip trailing sentence punctuation the user may have typed after the URL
    const url = match.replace(/[.),;]+$/, '')
    const display = url.replace(/^https?:\/\//, '')
    return `[${display}](${url})`
  })
}

// ── Post-process: convert [URGENCY TAG] → styled span elements ──
// Runs after DOMPurify so we can safely inject known-safe HTML.
const URGENCY_RE = /\[([A-Z0-9][A-Z0-9 ]*)\]/g

function applyUrgencyTags(html: string): string {
  return html.replace(URGENCY_RE, (_, tag: string) => {
    const isUrgent = tag.includes('DAY 1') || tag === 'URGENT'
    const cls = isUrgent ? 'urgency-tag urgency-urgent' : 'urgency-tag'
    return `<span class="${cls}">${tag}</span>`
  })
}

// ── Process one plain-text segment through the full markdown pipeline ──────────
function renderSegment(text: string): string {
  if (!text) return ''
  const plain = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  const normalized = normalizeBareUrls(plain)
  const markdownHtml = marked.parseInline(normalized) as string
  const safe = DOMPurify.sanitize(markdownHtml, PURIFY_CONFIG)
  return applyUrgencyTags(safe)
}

// ── Build a sorted regex of all glossary term keys (longest first) ───────────
// Built lazily and memoized for the lifetime of the module.
let _glossaryPattern: RegExp | null = null

function getGlossaryPattern(): RegExp {
  if (_glossaryPattern) return _glossaryPattern
  const keys = getGlossaryTermKeys()
    // Sort longest first to prefer multi-word matches ("universal credit" > "uc")
    .sort((a, b) => b.length - a.length)
    // Escape regex special chars
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // Word-boundary on each side; case-insensitive
  _glossaryPattern = new RegExp(`\\b(${keys.join('|')})\\b`, 'gi')
  return _glossaryPattern
}

/**
 * Splits `text` into alternating [plain, glossaryTerm, plain, ...] segments.
 * Only the FIRST occurrence of each glossary key is replaced (avoids popover
 * clutter when the same term appears many times in a single step).
 */
function splitGlossarySegments(text: string): Array<{ type: 'plain' | 'glossary'; value: string }> {
  const pattern = getGlossaryPattern()
  pattern.lastIndex = 0  // reset since we use the shared stateful regex

  const seen = new Set<string>()
  const segments: Array<{ type: 'plain' | 'glossary'; value: string }> = []
  let lastIndex = 0

  for (const match of text.matchAll(pattern)) {
    const matchedTerm = match[0]
    const matchKey = matchedTerm.toLowerCase()
    const start = match.index ?? 0

    // Push the plain text before this match
    if (start > lastIndex) {
      segments.push({ type: 'plain', value: text.slice(lastIndex, start) })
    }

    if (!seen.has(matchKey)) {
      // First occurrence — render as a glossary popover
      seen.add(matchKey)
      segments.push({ type: 'glossary', value: matchedTerm })
    } else {
      // Subsequent occurrences — render as plain text (no extra popovers)
      segments.push({ type: 'plain', value: matchedTerm })
    }

    lastIndex = start + matchedTerm.length
  }

  // Remaining plain text after the last match
  if (lastIndex < text.length) {
    segments.push({ type: 'plain', value: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: 'plain', value: text }]
}

interface StepTextProps {
  text: string
}

const StepText = memo(function StepText({ text }: StepTextProps): JSX.Element {
  const segments = useMemo(() => splitGlossarySegments(text), [text])

  // Fast path: no glossary terms found — use original single-span render
  if (segments.length === 1 && segments[0].type === 'plain') {
    const html = renderSegment(text)
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <span>
      {segments.map((seg, i) =>
        seg.type === 'glossary' ? (
          <GlossaryTerm key={i} lookupKey={seg.value.toLowerCase()}>{seg.value}</GlossaryTerm>
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: renderSegment(seg.value) }} />
        )
      )}
    </span>
  )
})

export default StepText
