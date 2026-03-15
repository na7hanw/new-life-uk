import DOMPurify from 'dompurify'

function StepText({ text }) {
  // Sanitize the text to prevent XSS before processing
  const safe = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  // Matches [label](url) and bare https:// URLs
  const rx = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,;)]+)/g
  const parts = []
  let last = 0, m
  while ((m = rx.exec(safe)) !== null) {
    if (m.index > last) parts.push(safe.slice(last, m.index))
    if (m[1]) {
      parts.push(<a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer" className="step-link">{m[2]}</a>)
    } else {
      const raw = m[4].replace(/[.)]+$/, '') // trim trailing punctuation
      parts.push(<a key={m.index} href={raw} target="_blank" rel="noopener noreferrer" className="step-link">{raw.replace(/^https?:\/\//, '')}</a>)
    }
    last = m.index + m[0].length
  }
  if (last < safe.length) parts.push(safe.slice(last))
  return <>{parts}</>
}

export default StepText
