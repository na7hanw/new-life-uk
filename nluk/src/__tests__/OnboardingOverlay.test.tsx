/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/OnboardingOverlay.tsx
 * Covers: the two-step flow (welcome -> status), the status picker that gates
 *         the whole personalisation layer, shouldShowOnboarding(),
 *         markOnboardingDone(), and focus restoration on close.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import OnboardingOverlay, {
  shouldShowOnboarding,
  markOnboardingDone,
} from '../components/OnboardingOverlay.tsx'

const UI = {
  app: 'New Life UK',
  onboardingSkip: 'Skip',
  onboardingNext: 'Next',
  onboardingDone: 'Get started',
} as Parameters<typeof OnboardingOverlay>[0]['ui']

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// ─── shouldShowOnboarding / markOnboardingDone ────────────────────────────────

describe('shouldShowOnboarding', () => {
  it('returns true when onboarding has not been completed', () => {
    expect(shouldShowOnboarding()).toBe(true)
  })

  it('returns false after markOnboardingDone() is called', () => {
    markOnboardingDone()
    expect(shouldShowOnboarding()).toBe(false)
  })
})

describe('markOnboardingDone', () => {
  it('persists the completed flag in localStorage', () => {
    markOnboardingDone()
    expect(localStorage.getItem('nluk_onboarded')).toBe('true')
  })
})

// ─── Step rendering ───────────────────────────────────────────────────────────

describe('OnboardingOverlay — initial step', () => {
  it('renders a dialog with aria-modal="true"', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('shows the title of the first step on mount', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByText('Your guides are ready')).not.toBeNull()
  })



})

// ─── Completion callbacks ─────────────────────────────────────────────────────

// ── The status step ──────────────────────────────────────────────────────────
// Status was removed from the home screen in March 2026 and never replaced, so
// userStatus stayed '' for most users. With '' the "For You" card, Next Steps,
// update alerts, the WorkHub banners and status-aware ordering all render
// nothing — the entire personalisation layer was gated on an unasked question.

describe('OnboardingOverlay — the two-step flow', () => {
  it('shows Next, not Get started, on the first step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy()
  })

  it('advances to the status question', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(/what's your situation in the UK/i)).toBeTruthy()
  })

  it('offers all four statuses', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    for (const label of [/asylum seeker/i, /recognised refugee/i, /another visa/i, /settled/i]) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy()
    }
  })

  it('sets the status and finishes in one tap', () => {
    const setUserStatus = vi.fn()
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} setUserStatus={setUserStatus} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: /recognised refugee/i }))
    expect(setUserStatus).toHaveBeenCalledWith('refugee')
    expect(onDone).toHaveBeenCalled()
    expect(shouldShowOnboarding()).toBe(false)
  })

  it('lets the user skip without setting a status', () => {
    const setUserStatus = vi.fn()
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} setUserStatus={setUserStatus} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: /skip for now/i }))
    expect(setUserStatus).not.toHaveBeenCalled()
    expect(onDone).toHaveBeenCalled()
    // Skipping must still count as onboarded, or the overlay reappears forever.
    expect(shouldShowOnboarding()).toBe(false)
  })

  it('works without a setUserStatus prop', () => {
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: /recognised refugee/i }))
    expect(onDone).toHaveBeenCalled()
  })
})

describe('OnboardingOverlay — dialog behaviour', () => {
  it('closes on Escape, as a dialog must', () => {
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onDone).toHaveBeenCalled()
  })

  it('restores focus to the previously focused element on unmount', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const { unmount } = render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    unmount()
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
