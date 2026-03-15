import { useRef, useEffect } from 'react'

function SOSModal({ showSOS, setSOS, ui, SOS_NUMBERS }) {
  const sosModalRef = useRef(null)

  useEffect(() => {
    if (!showSOS) return
    const el = sosModalRef.current
    if (!el) return
    const focusable = el.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    const trap = (e) => {
      if (e.key === 'Escape') { setSOS(false); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    el.addEventListener('keydown', trap)
    return () => el.removeEventListener('keydown', trap)
  }, [showSOS, setSOS])

  if (!showSOS) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => setSOS(false)}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="modal-content"
        ref={sosModalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
        aria-describedby="sos-modal-desc"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <div className="modal-handle" aria-hidden="true" />
        <h2 id="sos-modal-title" className="modal-title">🚨 {ui.sos}</h2>
        <p id="sos-modal-desc" style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: 8, lineHeight: 1.55 }}>
          {ui.sosDesc || 'All numbers below are free to call, 24/7.'}
        </p>
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
