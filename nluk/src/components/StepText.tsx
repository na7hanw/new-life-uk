import DOMPurify from 'dompurify'
import type { JSX } from 'react'

interface StepTextProps {
  text: string
}

/**
 * Only allow http/https URLs to guard against javascript: and other schemes.
 * Note: this function is only called with strings already matched by the
 * /https?:\/\// regex in the caller, so relative URLs can never reach it.
 */
function safeHref(url: string): string {
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:' ? url : '#'
  } catch {
    return '#'
  }
}

function StepText({ text }: StepTextProps): JSX.Element {
  // Sanitize the text to prevent XSS before processing
  const safe = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  // Matches [label](url) and bare https:// URLs
  const rx = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,;)]+)/g
  const parts: (string | JSX.Element)[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = rx.exec(safe)) !== null) {
    if (m.index > last) parts.push(safe.slice(last, m.index))
    if (m[1]) {
      parts.push(<a key={m.index} href={safeHref(m[3])} target="_blank" rel="noopener noreferrer" className="step-link">{m[2]}</a>)
    } else {
      const raw = m[4].replace(/[.)]+$/, '') // trim trailing punctuation
      parts.push(<a key={m.index} href={safeHref(raw)} target="_blank" rel="noopener noreferrer" className="step-link">{raw.replace(/^https?:\/\//, '')}</a>)
    }
    last = m.index + m[0].length
  }
  if (last < safe.length) parts.push(safe.slice(last))
  return <>{parts}</>
}

export default StepText
