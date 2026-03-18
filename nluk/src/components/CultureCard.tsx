import { useState, useId, memo } from 'react'
import styles from './CultureCard.module.css'

interface CultureCardProps {
  emoji: string
  title: string
  body: string
  onCopy: () => void
  copied: boolean
  copyLabel: string
  copiedLabel: string
}

const CultureCard = memo(function CultureCard({ emoji, title, body, onCopy, copied, copyLabel, copiedLabel }: CultureCardProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()
  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ''}`}>
      <button className={styles.header} onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={bodyId}>
        <span className={styles.icon}>{emoji}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>
      <div className={`${styles.bodyWrapper} ${open ? styles.bodyWrapperOpen : ''}`}>
        <div id={bodyId} className={styles.body}>
          <p className={styles.bodyText}>{body}</p>
          <button className={styles.copyBtn} onClick={onCopy} aria-label={copied ? copiedLabel : `Copy: ${title}`}>
            {copied ? '✅' : '📋'} {copied ? copiedLabel : copyLabel}
          </button>
        </div>
      </div>
    </div>
  )
})
export default CultureCard
