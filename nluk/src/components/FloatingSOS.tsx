import styles from './FloatingSOS.module.css'
import type { UiStrings } from '../types'

interface FloatingSOSProps {
  ui: UiStrings
  setSOS: (show: boolean) => void
}

function FloatingSOS({ ui, setSOS }: FloatingSOSProps) {
  return (
    <button
      className={styles.floatingSOS}
      onClick={() => { navigator?.vibrate?.(15); setSOS(true) }}
      aria-label={ui.sosLabel || 'Open emergency contacts'}
      aria-haspopup="dialog"
    >{ui.sos}</button>
  )
}

export default FloatingSOS
