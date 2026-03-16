import { useState } from 'react'
import { ls, lsSet } from '../lib/utils.ts'
import { SENTRY_DSN, initSentry } from '../lib/sentry.ts'
import type { UiStrings } from '../types'

export const CONSENT_KEY = 'nluk_consent'

interface ConsentBannerProps {
  ui: UiStrings
}

export default function ConsentBanner({ ui }: ConsentBannerProps) {
  // Only show when Sentry is configured AND the user hasn't answered yet
  const [visible, setVisible] = useState(
    () => !!SENTRY_DSN && ls(CONSENT_KEY, '') === ''
  )

  if (!visible) return null

  const handleConsent = (granted: boolean) => {
    lsSet(CONSENT_KEY, granted ? 'granted' : 'denied')
    if (granted) initSentry()
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ui.consentTitle || 'Privacy notice'}
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1000,
        background: 'var(--bg2)',
        borderTop: '1.5px solid var(--bd)',
        padding: '16px 20px 24px',
        boxShadow: '0 -4px 24px rgba(0,0,0,.12)',
      }}
    >
      <p style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: 6 }}>
        🔒 {ui.consentTitle || 'A note on privacy'}
      </p>
      <p style={{ fontSize: '.85rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: 14 }}>
        {ui.consentBody ||
          'To help us fix bugs faster, this app can send anonymous crash reports to Sentry (an error-monitoring service). No personal information is included. You can change this at any time in More → Privacy.'}
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1, minWidth: 120 }}
          onClick={() => handleConsent(true)}
        >
          {ui.consentAccept || "✓ OK, that's fine"}
        </button>
        <button
          className="btn btn-outline btn-sm"
          style={{ flex: 1, minWidth: 120 }}
          onClick={() => handleConsent(false)}
        >
          {ui.consentDecline || 'No thanks'}
        </button>
      </div>
    </div>
  )
}
