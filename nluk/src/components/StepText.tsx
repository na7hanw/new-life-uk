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

// ── Convert [URGENCY TAG] → styled span elements ──
// This runs BEFORE DOMPurify, not after. Running it afterwards meant a string
// replace was building HTML on top of already-sanitized output, which is both
// a broken sanitizer barrier and a real bug: the pattern matched inside
// attribute values too, so a link whose href legitimately contained an
// upper-case bracket segment came out as
//   <a href="https://example.com/docs/<span class="urgency-tag">ABC</span>/x">
// — markup injected into an attribute. Sanitizing last fixes both, and costs
// nothing, because 'span' and 'class' are already in the allowlist below.
//
// The pattern is also anchored to a standalone token — preceded by start or
// whitespace, followed by whitespace or end — because these tags are authored
// as their own word ("[DAY 1] Claim UC"), never mid-string. That alone keeps it
// out of URLs, where the character before '[' is a '/'.
const URGENCY_RE = /(^|\s)\[([A-Z0-9][A-Z0-9 ]*)\](?=\s|$)/g

function applyUrgencyTags(text: string): string {
  return text.replace(URGENCY_RE, (_, lead: string, tag: string) => {
    const isUrgent = tag.includes('DAY 1') || tag === 'URGENT'
    const cls = isUrgent ? 'urgency-tag urgency-urgent' : 'urgency-tag'
    return `${lead}<span class="${cls}">${tag}</span>`
  })
}

// ── Process one plain-text segment through the full markdown pipeline ──────────
function renderSegment(text: string): string {
  if (!text) return ''
  const plain = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  const tagged = applyUrgencyTags(plain)
  const normalized = normalizeBareUrls(tagged)
  const markdownHtml = marked.parseInline(normalized) as string
  // DOMPurify is deliberately the LAST step — nothing builds HTML after it.
  return DOMPurify.sanitize(markdownHtml, PURIFY_CONFIG)
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
