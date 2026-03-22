/**
 * GlossaryTerm
 *
 * Renders a glossary-aware inline term.  When tapped/clicked, shows a small
 * definition card sourced from:
 *   1. Local glossary (instant, offline)
 *   2. Wikipedia REST API (fallback for unknown terms)
 *
 * Usage in StepText-parsed content — wrapped automatically when a known term
 * is detected in step text.
 *
 * Accessibility:
 * - Button role (keyboard navigable)
 * - aria-expanded tracks open state
 * - Dismissable via Escape key or tap-outside
 * - Definition rendered in a non-modal panel (not a dialog) so screen readers
 *   can read it inline
 */
import { useState, useEffect, useRef } from 'react'
import { lookupGlossaryTerm } from '../data/glossary.ts'
import { fetchWikiSummary, wikiSummaryToDefinition } from '../lib/mediawiki.ts'
import styles from './GlossaryTerm.module.css'

interface Props {
  /** The raw text of the term as it appears in the content */
  children: string
  /** Optional: override the lookup key (defaults to children) */
  lookupKey?: string
}

export default function GlossaryTerm({ children, lookupKey }: Props) {
  const [open, setOpen] = useState(false)
  const [definition, setDefinition] = useState<string | null>(null)
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)

  const term = lookupKey ?? children

  // Fetch definition lazily on first open
  useEffect(() => {
    if (!open || definition !== null) return

    const local = lookupGlossaryTerm(term)
    if (local) {
      setDefinition(local.definition)
      setSourceUrl(local.sourceUrl ?? null)
      return
    }

    // Fall back to Wikipedia
    setLoading(true)
    fetchWikiSummary(term).then(wiki => {
      if (wiki) {
        setDefinition(wikiSummaryToDefinition(wiki))
        setSourceUrl(wiki.content_urls.desktop.page)
      } else {
        setDefinition(`No local definition found for "${children}".`)
      }
      setLoading(false)
    })
  }, [open, term, definition, children])

  // Close on Escape or outside tap
  useEffect(() => {
    if (!open) return
    const handleKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const handleClick = (e: globalThis.MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as HTMLElement)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.term}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={`Definition of ${children}`}
      >
        {children}
        <span className={styles.dot} aria-hidden="true">·</span>
      </button>

      {open && (
        <span className={styles.popover} role="status" aria-live="polite">
          <span className={styles.popoverHeader}>
            <span className={styles.popoverTitle}>{lookupGlossaryTerm(term)?.term ?? children}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close definition"
            >✕</button>
          </span>
          <span className={styles.popoverBody}>
            {loading ? (
              <span className={styles.loadingText}>Loading…</span>
            ) : (
              definition
            )}
          </span>
          {sourceUrl && !loading && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              More info →
            </a>
          )}
        </span>
      )}
    </span>
  )
}
