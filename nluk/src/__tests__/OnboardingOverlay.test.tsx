/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/OnboardingOverlay.tsx
 * Covers: step rendering, Next/Skip/Get started behaviour,
 *         shouldShowOnboarding(), markOnboardingDone().
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
    expect(screen.getByText('Step-by-step guides')).not.toBeNull()
  })

  it('shows a Skip button on the first (non-last) step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Skip' })).not.toBeNull()
  })

  it('shows a Next button on the first step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeNull()
  })
})

// ─── Navigation ──────────────────────────────────────────────────────────────

describe('OnboardingOverlay — step navigation', () => {
  it('advances to the second step when Next is clicked', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('SOS emergency button')).not.toBeNull()
  })

  it('navigates to the last step after clicking Next twice', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Save guides for later')).not.toBeNull()
  })

  it('shows "Get started" instead of "Next" on the last step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Get started' })).not.toBeNull()
  })

  it('hides the Skip button on the last step', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })
})

// ─── Completion callbacks ─────────────────────────────────────────────────────

describe('OnboardingOverlay — completion', () => {
  it('calls onDone when Skip is clicked', () => {
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} />)
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('calls onDone when "Get started" is clicked on the last step', () => {
    const onDone = vi.fn()
    render(<OnboardingOverlay ui={UI} onDone={onDone} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }))
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('marks onboarding as done in localStorage when Get started is clicked', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }))
    expect(localStorage.getItem('nluk_onboarded')).toBe('true')
  })

  it('marks onboarding as done in localStorage when Skip is clicked', () => {
    render(<OnboardingOverlay ui={UI} onDone={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    expect(localStorage.getItem('nluk_onboarded')).toBe('true')
  })
})
