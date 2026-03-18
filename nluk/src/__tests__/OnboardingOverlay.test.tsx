/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/OnboardingOverlay.tsx
 * Covers: single-step rendering, "Get started" behaviour,
 *         shouldShowOnboarding(), markOnboardingDone().
 *
 * NOTE: The onboarding flow is a single step ("Your guides are ready").
 * There is no multi-step navigation — the single step is immediately the
 * last step, so "Get started" shows in place of "Next" and "Skip" is hidden.
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

  it('shows "Get started" on the single (last) step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Get started' })).not.toBeNull()
  })

  it('does not show a Skip button on the single step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })

  it('does not show a Next button on the single step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
  })
})

// ─── Completion callbacks ─────────────────────────────────────────────────────

describe('OnboardingOverlay — completion', () => {
  it('calls onDone when "Get started" is clicked', () => {
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} />)
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }))
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('marks onboarding as done in localStorage when Get started is clicked', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }))
    expect(localStorage.getItem('nluk_onboarded')).toBe('true')
  })
})
