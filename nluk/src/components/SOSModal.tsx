import { useRef, useEffect } from 'react'
import { getHighPriorityUpdates } from '../data/immigration-updates.ts'
import type { SosEntry, UiStrings } from '../types'

interface SOSModalProps {
  showSOS: boolean
  setSOS: (show: boolean) => void
  ui: Pick<UiStrings, 'sos' | 'close' | 'sosDesc'>
  SOS_NUMBERS: SosEntry[]
}

function SOSModal({ showSOS, setSOS, ui, SOS_NUMBERS }: SOSModalProps) {
  const sosModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showSOS) return
    const el = sosModalRef.current
    if (!el) return
    // Captured before focus moves into the dialog, and restored in cleanup
    // below. Without it, closing drops keyboard and screen-reader users at
    // <body> with no announcement, so they have to tab back through the whole
    // page to reach where they were. Doing both in one effect avoids the
    // ordering hazard of a separate capture effect, which would run after this
    // one had already moved focus.
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSOS(false); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    el.addEventListener('keydown', trap)
    return () => {
      el.removeEventListener('keydown', trap)
      // Only if it is still in the document — a node removed while the dialog
      // was open cannot take focus, and asking it to is a silent no-op.
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus()
    }
  }, [showSOS, setSOS])

  if (!showSOS) return null

  const actionAlerts = getHighPriorityUpdates().filter(u => u.urgency === 'action-needed').slice(0, 2)

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      aria-describedby="sos-modal-desc"
    >
      <div className="modal-content" ref={sosModalRef}>
        <div className="modal-handle" aria-hidden="true" />
        <h2 id="sos-modal-title" className="modal-title">🚨 {ui.sos}</h2>
        <p id="sos-modal-desc" style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: 8, lineHeight: 1.55 }}>
          {ui.sosDesc || 'All numbers below are free to call, 24/7.'}
        </p>

        {/* Action-needed immigration alerts */}
        {actionAlerts.length > 0 && (
          <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {actionAlerts.map(u => (
              <div key={u.id} style={{
                padding: '8px 12px', borderRadius: 8,
                background: 'color-mix(in srgb, #dc2626 8%, var(--bg2))',
                border: '1.5px solid color-mix(in srgb, #dc2626 30%, transparent)',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rd)', marginBottom: 2 }}>⚠️ Action needed</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{u.title}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--t2)' }}>{u.whatToDo}</div>
                <a href={u.sourceUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: 'var(--rd)', display: 'inline-block', marginTop: 2 }}>
                  Official source →
                </a>
              </div>
            ))}
          </div>
        )}
        {SOS_NUMBERS.map(s => (
          <a key={s.name} href={`tel:${s.phone}`}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--bd)' }}
            aria-label={`Call ${s.name} on ${s.num}: ${s.note}`}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--tx)' }}>{s.name}</div>
              <div style={{ fontSize: '.85rem', color: 'var(--t2)', marginTop: 2 }}>{s.note}</div>
            </div>
            <span className="btn btn-danger btn-sm" aria-hidden="true">{s.num}</span>
          </a>
        ))}
        <button
          className="btn btn-ghost btn-block"
          style={{ marginTop: 12 }}
          onClick={() => setSOS(false)}
          aria-label={ui.close || 'Close emergency contacts'}
        >{ui.close}</button>
      </div>
    </div>
  )
}

export default SOSModal
