import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useMemo, memo } from 'react'
import type { JSX } from 'react'

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

interface StepTextProps {
  text: string
}

const StepText = memo(function StepText({ text }: StepTextProps): JSX.Element {
  const html = useMemo(() => {
    // 1. Strip all HTML from raw input to prevent any injection before marked runs
    const plain = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })

    // 2. Convert bare URLs to markdown link syntax so marked renders them with the
    //    scheme-stripped display text (e.g. https://www.gov.uk → www.gov.uk)
    const normalized = normalizeBareUrls(plain)

    // 3. Parse markdown inline (handles **bold**, [label](url), _italic_)
    const markdownHtml = marked.parseInline(normalized) as string

    // 4. Sanitize marked output — DOMPurify hook adds target/rel/class to <a> elements
    const safe = DOMPurify.sanitize(markdownHtml, PURIFY_CONFIG)

    // 5. Convert remaining [URGENCY TAG] text into styled spans
    return applyUrgencyTags(safe)
  }, [text])

  return <span dangerouslySetInnerHTML={{ __html: html }} />
})

export default StepText
