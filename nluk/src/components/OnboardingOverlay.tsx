import { useState, useRef, useEffect } from 'react'
import { ls, lsSet } from '../lib/utils.ts'
import type { UiStrings, UserStatus } from '../types'

const ONBOARDING_KEY = 'nluk_onboarded'

const STEPS = [
  {
    id: 'welcome',
    icon: '🇬🇧',
    title: 'Your guides are ready',
    body: 'Step-by-step guides for everything you need in the UK — from NHS registration to bank accounts and benefits. Free, private, and available in 12 languages. Tap 🆘 anytime for emergency numbers. Tap the bookmark icon on any guide to save it for later.',
  },
  {
    id: 'status',
    icon: '🧭',
    title: '',
    body: '',
  },
] as const

/**
 * Status options. Kept here rather than duplicated per page — ProfilePage and
 * MorePage each had their own copy with divergent labels, and only one of them
 * routed through i18n.
 */
export const STATUS_CHOICES: { value: Exclude<UserStatus, ''>; key: keyof UiStrings; fallback: string }[] = [
  { value: 'asylum-seeker', key: 'statusAsylumSeeker', fallback: '⏳ Asylum seeker — waiting for my decision' },
  { value: 'refugee', key: 'statusRefugee', fallback: '✅ Recognised refugee' },
  { value: 'other-visa', key: 'statusOtherVisa', fallback: '🛂 Another visa (Skilled Worker, Family, Student…)' },
  { value: 'settled', key: 'statusSettled', fallback: '🇬🇧 Settled / Pre-Settled Status' },
]

interface OnboardingOverlayProps {
  ui: UiStrings
  onDone: () => void
  /** Setting status here is the point of the second step. */
  setUserStatus?: (s: UserStatus) => void
}

export function shouldShowOnboarding(): boolean {
  return !ls(ONBOARDING_KEY, '')
}

export function markOnboardingDone(): void {
  lsSet(ONBOARDING_KEY, 'true')
}

/**
 * First-run overlay.
 *
 * The status step was removed from the home screen in March 2026 and never
 * replaced, so `userStatus` stayed '' for most users — and with '' the "For
 * You" card, Next Steps, update alerts, the WorkHub banners and status-aware
 * guide ordering all silently render nothing. The whole personalisation layer
 * was gated on a question the app had stopped asking. The i18n strings for it
 * (`statusPickerTitle`, `statusSkip`) were still in ui-strings.ts with no
 * consumers.
 *
 * Status stays optional — skipping is one tap, and nothing is withheld from
 * someone who declines to answer.
 */
export default function OnboardingOverlay({ ui, onDone, setUserStatus }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0)
  const primaryBtnRef = useRef<HTMLButtonElement>(null)
  // Captured during the first render, not in an effect: the focus effect below
  // is declared first and would otherwise have already moved focus into the
  // dialog by the time we looked.
  const previouslyFocused = useRef<Element | null>(
    typeof document === 'undefined' ? null : document.activeElement
  )
  const isLast = step === STEPS.length - 1

  useEffect(() => {
    primaryBtnRef.current?.focus()
  }, [step])

  // Restore focus on close. Previously absent, so dismissing dropped keyboard
  // and screen-reader users at <body> with no announcement.
  useEffect(() => () => {
    const el = previouslyFocused.current
    if (el instanceof HTMLElement) el.focus()
  }, [])

  const finish = () => {
    markOnboardingDone()
    onDone()
  }

  const handleNext = () => {
    if (isLast) finish()
    else setStep(s => s + 1)
  }

  const chooseStatus = (s: UserStatus) => {
    setUserStatus?.(s)
    finish()
  }

  // Escape closes, as a dialog must.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const current = STEPS[step]
  const isStatusStep = current.id === 'status'

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="onboarding-card">
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`onboarding-dot${i === step ? ' active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-icon">{current.icon}</div>

        {isStatusStep ? (
          <>
            <h2 className="onboarding-title">
              {ui.statusPickerTitle || "What's your situation in the UK?"}
            </h2>
            <p className="onboarding-body">
              {ui.statusPickerSub ||
                'Optional — it helps us show the guides that apply to you first. No account needed.'}
            </p>

            <div className="onboarding-status-list">
              {STATUS_CHOICES.map((opt, i) => (
                <button
                  key={opt.value}
                  ref={i === 0 ? primaryBtnRef : undefined}
                  className="onboarding-status-option"
                  onClick={() => chooseStatus(opt.value)}
                >
                  {(ui[opt.key] as string | undefined) || opt.fallback}
                </button>
              ))}
            </div>

            <div className="onboarding-actions">
              <button className="btn btn-ghost btn-sm" onClick={finish}>
                {ui.statusSkip || 'Skip for now'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="onboarding-title">{current.title}</h2>
            <p className="onboarding-body">{current.body}</p>

            <div className="onboarding-actions">
              <button className="btn btn-ghost btn-sm" onClick={finish}>
                {ui.onboardingSkip || 'Skip'}
              </button>
              <button ref={primaryBtnRef} className="btn btn-primary" onClick={handleNext}>
                {ui.onboardingNext || 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
