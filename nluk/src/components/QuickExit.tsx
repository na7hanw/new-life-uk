import { useEffect } from 'react'
import styles from './QuickExit.module.css'

/** Neutral destination. Deliberately dull and plausible on any phone. */
const SAFE_URL = 'https://www.bbc.co.uk/weather'

/**
 * QuickExit — leave the app fast and leave as little behind as possible.
 *
 * This app publishes step-by-step guidance on leaving an abusive partner,
 * escaping trafficking and reporting FGM, to a population where phones are
 * routinely shared, borrowed and inspected — and where the abuser is often the
 * person who controls the device. Every comparable UK service (Women's Aid,
 * Refuge, the National DA Helpline) ships this control for that reason.
 *
 * On activation it clears the volatile traces the app leaves on screen, then
 * uses location.replace() so the app is not one Back press away.
 *
 * It cannot clear browser history — no web app can. The Safety guide says so
 * explicitly rather than implying this button is more than it is.
 */
export function quickExit(): void {
  try {
    sessionStorage.clear()
    // The front page renders these; leaving them would defeat the point.
    localStorage.removeItem('nluk_guide_history')
    localStorage.removeItem('nluk_recent_searches')
  } catch {
    // Storage can throw in private mode — leaving is more important than clearing.
  }
  window.location.replace(SAFE_URL)
}

export default function QuickExit() {
  // Escape pressed three times in quick succession also exits, so the control
  // can be used without locating it on screen.
  useEffect(() => {
    let hits = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      hits += 1
      clearTimeout(timer)
      if (hits >= 3) quickExit()
      timer = setTimeout(() => { hits = 0 }, 1200)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer) }
  }, [])

  return (
    <button
      type="button"
      className={styles.quickExit}
      onClick={quickExit}
      aria-label="Quick exit — leave this app now and go to a weather page"
    >
      <span aria-hidden="true">✕</span> Quick exit
    </button>
  )
}
