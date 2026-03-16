import styles from './FloatingSOS.module.css'

function FloatingSOS({ ui, setSOS }) {
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
