import DOMPurify from 'dompurify'
import { useMemo, memo } from 'react'
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

const StepText = memo(function StepText({ text }: StepTextProps): JSX.Element {
  // Sanitize once and only re-run when text changes
  const safe = useMemo(
    () => DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    [text]
  )
  // Matches: [label](url) | bare https:// URL | **bold** | [URGENCY TAG]
  const rx = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,;)]+)|\*\*([^*]+)\*\*|\[([A-Z0-9][A-Z0-9 ]*)\]/g
  const parts: (string | JSX.Element)[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = rx.exec(safe)) !== null) {
    if (m.index > last) parts.push(safe.slice(last, m.index))
    if (m[1]) {
      // Markdown link: [label](url)
      parts.push(<a key={m.index} href={safeHref(m[3])} target="_blank" rel="noopener noreferrer" className="step-link">{m[2]}</a>)
    } else if (m[4]) {
      // Bare URL
      const raw = m[4].replace(/[.)]+$/, '') // trim trailing punctuation
      parts.push(<a key={m.index} href={safeHref(raw)} target="_blank" rel="noopener noreferrer" className="step-link">{raw.replace(/^https?:\/\//, '')}</a>)
    } else if (m[5]) {
      // **Bold text**
      parts.push(<strong key={m.index} style={{ fontWeight: 800, color: 'var(--tx)' }}>{m[5]}</strong>)
    } else if (m[6]) {
      // [URGENCY TAG] e.g. [DAY 1], [URGENT], [WEEK 2]
      const tag = m[6]
      const isUrgent = tag.includes('DAY 1') || tag === 'URGENT'
      parts.push(
        <span key={m.index} style={{
          background: isUrgent ? 'var(--rd)' : 'var(--ac)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          marginRight: '6px',
          display: 'inline-block',
          transform: 'translateY(-1px)',
        }}>
          {tag}
        </span>
      )
    }
    last = m.index + m[0].length
  }
  if (last < safe.length) parts.push(safe.slice(last))
  return <>{parts}</>
})

export default StepText
