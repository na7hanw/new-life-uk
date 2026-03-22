/**
 * MachineTranslationBanner
 *
 * Visible disclaimer shown on all machine-translated content.
 *
 * Required because:
 * - All translation uses free/open-source machine translation (LibreTranslate,
 *   Bergamot, NLLB-200) which may produce inaccurate output.
 * - NLLB is explicitly a research model, not a legally authoritative translation.
 * - Legal, immigration, financial, and official decisions must be verified
 *   against the official English source.
 */
import { useState } from 'react'
import { isTranslationAvailable } from '../lib/translationRouter.ts'
import type { UiStrings } from '../types'

interface Props {
  lang: string
  ui: Pick<UiStrings, 'mtWarning' | 'mtWarningLegal' | 'mtProvider' | 'mtUnavailable' | 'mtDismiss'>
  /** High-risk content (legal, immigration, financial) shows the stronger disclaimer. */
  highRisk?: boolean
  /** If true, shows "translation unavailable" instead of the machine-translation warning. */
  unavailable?: boolean
}

export default function MachineTranslationBanner({ lang, ui, highRisk = false, unavailable = false }: Props) {
  const [dismissed, setDismissed] = useState(false)

  // Nothing to show for English (source language)
  if (lang === 'en') return null

  // Nothing to show if already dismissed (for non-high-risk content)
  if (dismissed && !highRisk) return null

  const isAvailable = isTranslationAvailable(lang)

  if (unavailable || !isAvailable) {
    return (
      <div
        className="mt-banner mt-banner--unavailable"
        role="status"
        aria-live="polite"
        data-testid="mt-unavailable-banner"
      >
        <span className="mt-banner__icon" aria-hidden="true">🌐</span>
        <span className="mt-banner__text">
          {ui.mtUnavailable || 'Translation unavailable for this language. Showing original English.'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`mt-banner${highRisk ? ' mt-banner--high-risk' : ''}`}
      role="note"
      aria-label="Machine translation disclaimer"
      data-testid="mt-warning-banner"
    >
      <div className="mt-banner__body">
        <span className="mt-banner__icon" aria-hidden="true">🌐</span>
        <div className="mt-banner__content">
          <span className="mt-banner__text">
            {ui.mtWarning || 'This content was automatically translated using free, open-source machine translation and may contain errors.'}
          </span>
          {highRisk && (
            <span className="mt-banner__legal">
              {' '}
              {ui.mtWarningLegal || 'Do not rely on this translation alone for legal, immigration, money, or official decisions. Always check the official source.'}
            </span>
          )}
          <span className="mt-banner__provider">
            {ui.mtProvider || 'Translation: open-source machine translation'}
          </span>
        </div>
      </div>
      {!highRisk && (
        <button
          className="mt-banner__dismiss"
          onClick={() => setDismissed(true)}
          aria-label={ui.mtDismiss || 'Got it'}
        >
          ✕
        </button>
      )}
    </div>
  )
}
