import { useState, useId, memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import clsx from 'clsx'
import { useTranslatedContent } from '../lib/useTranslation.ts'
import styles from './CultureCard.module.css'

interface CultureItemContent {
  title: string
  body: string
  [key: string]: unknown
}

interface CultureCardProps {
  emoji: string
  /** Full i18n content map — must include `en`. Auto-translates to `lang` via MyMemory. */
  content: Record<string, CultureItemContent>
  lang: string
  copyLabel: string
  copiedLabel: string
}

/**
 * CultureCard — collapsible tip card with built-in auto-translation.
 * Mirrors ResourceCard's translation pattern: useTranslatedContent handles
 * the MyMemory API call and localStorage caching transparently.
 * Uses sonner toast for copy feedback instead of local copied state.
 */
const CultureCard = memo(function CultureCard({ emoji, content, lang, copyLabel, copiedLabel }: CultureCardProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  // id is derived from the stable English title — used as the cache key
  const id = content.en?.title
  const [c, translating] = useTranslatedContent<CultureItemContent>(content, lang, id)

  const handleCopy = () => {
    if (!c) return
    navigator.clipboard?.writeText(`${c.title}\n\n${c.body}`).then(() => {
      toast.success(copiedLabel, { duration: 1800 })
    })
  }

  return (
    <div className={clsx(styles.card, open && styles.cardOpen, translating && 'translating')}>
      <button
        className={styles.header}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className={styles.icon}>{emoji}</span>
        <span className={styles.title}>{c?.title}</span>
        <ChevronDown size={16} strokeWidth={2.5} className={styles.chevron} />
      </button>
      <div className={clsx(styles.bodyWrapper, open && styles.bodyWrapperOpen)}>
        <div id={bodyId} className={styles.body}>
          {/* bodyInner carries padding — keeps the grid child at true zero height when closed */}
          <div className={styles.bodyInner}>
            <p className={styles.bodyText}>{c?.body}</p>
            <button
              className={styles.copyBtn}
              onClick={handleCopy}
              aria-label={`Copy: ${c?.title}`}
            >
              📋 {copyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CultureCard
