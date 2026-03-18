import { Search } from 'lucide-react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <Search size={40} strokeWidth={1.5} className={styles.emptyIcon} />
      <p className={styles.emptyText}>{message}</p>
    </div>
  )
}
