import { useState, useRef, useEffect } from 'react'
import { ls, lsSet } from '../lib/utils.ts'
import type { UiStrings } from '../types'

const ONBOARDING_KEY = 'nluk_onboarded'

const STEPS = [
  {
    icon: '🇬🇧',
    title: 'Your guides are ready',
    body: 'Step-by-step guides for everything you need in the UK — from NHS registration to bank accounts and benefits. Free, private, and available in 12 languages. Tap 🆘 anytime for emergency numbers. Tap the bookmark icon on any guide to save it for later.',
  },
]

interface OnboardingOverlayProps {
  ui: UiStrings
  onDone: () => void
}

export function shouldShowOnboarding(): boolean {
  return !ls(ONBOARDING_KEY, '')
}

export function markOnboardingDone(): void {
  lsSet(ONBOARDING_KEY, 'true')
}

export default function OnboardingOverlay({ ui, onDone }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0)
  const primaryBtnRef = useRef<HTMLButtonElement>(null)
  const isLast = step === STEPS.length - 1

  // Focus the primary button whenever the step changes
  useEffect(() => {
    primaryBtnRef.current?.focus()
  }, [step])

  const handleNext = () => {
    if (isLast) {
      markOnboardingDone()
      onDone()
    } else {
      setStep(s => s + 1)
    }
  }

  const handleSkip = () => {
    markOnboardingDone()
    onDone()
  }

  const current = STEPS[step]

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="onboarding-card">
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`onboarding-dot${i === step ? ' active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-icon">{current.icon}</div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-body">{current.body}</p>

        <div className="onboarding-actions">
          {!isLast && (
            <button className="btn btn-ghost btn-sm" onClick={handleSkip}>
              {ui.onboardingSkip || 'Skip'}
            </button>
          )}
          <button ref={primaryBtnRef} className="btn btn-primary" onClick={handleNext}>
            {isLast ? (ui.onboardingDone || 'Get started') : (ui.onboardingNext || 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}
