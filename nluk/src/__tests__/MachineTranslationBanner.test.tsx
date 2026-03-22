/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/MachineTranslationBanner.tsx
 *
 * Covers:
 * - Banner not shown for English (source language)
 * - Banner shown for non-English machine-translated content
 * - "Translation unavailable" state for unsupported languages (am, ti, so, om, ur)
 * - High-risk content (legal/financial) shows stronger disclaimer, cannot be dismissed
 * - Dismissal works for non-high-risk content
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import MachineTranslationBanner from '../components/MachineTranslationBanner.tsx'
import type { UiStrings } from '../types'

afterEach(() => { cleanup() })

const UI: Pick<UiStrings, 'mtWarning' | 'mtWarningLegal' | 'mtProvider' | 'mtUnavailable' | 'mtDismiss'> = {
  mtWarning:      'Automatically translated. May contain errors.',
  mtWarningLegal: 'Do not rely on this for legal decisions.',
  mtProvider:     'Translation: open-source machine translation',
  mtUnavailable:  'Translation unavailable. Showing original English.',
  mtDismiss:      'Got it',
}

// ─── English passthrough ──────────────────────────────────────────────────────

describe('MachineTranslationBanner — English', () => {
  it('renders nothing for lang="en"', () => {
    const { container } = render(<MachineTranslationBanner lang="en" ui={UI} />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render any banner for lang="en" even with highRisk=true', () => {
    const { container } = render(<MachineTranslationBanner lang="en" ui={UI} highRisk />)
    expect(container.firstChild).toBeNull()
  })
})

// ─── Machine translation warning (supported languages) ───────────────────────

describe('MachineTranslationBanner — machine translation warning', () => {
  it('renders the warning banner for Arabic (LibreTranslate-supported)', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.getByTestId('mt-warning-banner')).toBeTruthy()
  })

  it('renders the warning banner for French', () => {
    render(<MachineTranslationBanner lang="fr" ui={UI} />)
    expect(screen.getByTestId('mt-warning-banner')).toBeTruthy()
  })

  it('shows the machine translation warning text', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.getByText(UI.mtWarning)).toBeTruthy()
  })

  it('shows the provider attribution', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.getByText(UI.mtProvider)).toBeTruthy()
  })

  it('has role="note" for accessibility', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.getByRole('note')).toBeTruthy()
  })
})

// ─── Translation unavailable state ────────────────────────────────────────────

describe('MachineTranslationBanner — translation unavailable', () => {
  it('renders the unavailable banner for Amharic (no NLLB endpoint)', () => {
    render(<MachineTranslationBanner lang="am" ui={UI} />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('renders the unavailable banner for Tigrinya', () => {
    render(<MachineTranslationBanner lang="ti" ui={UI} />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('renders the unavailable banner for Somali', () => {
    render(<MachineTranslationBanner lang="so" ui={UI} />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('renders the unavailable banner for Oromo', () => {
    render(<MachineTranslationBanner lang="om" ui={UI} />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('renders the unavailable banner for Urdu', () => {
    render(<MachineTranslationBanner lang="ur" ui={UI} />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('shows the unavailable message text', () => {
    render(<MachineTranslationBanner lang="am" ui={UI} />)
    expect(screen.getByText(UI.mtUnavailable)).toBeTruthy()
  })

  it('explicit unavailable prop shows the unavailable banner', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} unavailable />)
    expect(screen.getByTestId('mt-unavailable-banner')).toBeTruthy()
  })

  it('does NOT render a warning banner for unavailable languages', () => {
    render(<MachineTranslationBanner lang="am" ui={UI} />)
    expect(screen.queryByTestId('mt-warning-banner')).toBeNull()
  })
})

// ─── High-risk content ────────────────────────────────────────────────────────

describe('MachineTranslationBanner — high-risk content', () => {
  it('shows the legal warning text when highRisk=true', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} highRisk />)
    expect(screen.getByText(UI.mtWarningLegal)).toBeTruthy()
  })

  it('does NOT show the legal warning text when highRisk=false', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.queryByText(UI.mtWarningLegal)).toBeNull()
  })

  it('does NOT show a dismiss button when highRisk=true', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} highRisk />)
    expect(screen.queryByRole('button', { name: UI.mtDismiss })).toBeNull()
  })

  it('the high-risk banner is always visible (no dismiss button)', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} highRisk />)
    expect(screen.getByTestId('mt-warning-banner')).toBeTruthy()
  })
})

// ─── Dismissal ────────────────────────────────────────────────────────────────

describe('MachineTranslationBanner — dismissal', () => {
  it('shows a dismiss button for non-high-risk content', () => {
    render(<MachineTranslationBanner lang="ar" ui={UI} />)
    expect(screen.getByRole('button', { name: UI.mtDismiss })).toBeTruthy()
  })

  it('hides the banner after the dismiss button is clicked', () => {
    const { container } = render(<MachineTranslationBanner lang="ar" ui={UI} />)
    const dismissBtn = screen.getByRole('button', { name: UI.mtDismiss })
    fireEvent.click(dismissBtn)
    expect(container.querySelector('[data-testid="mt-warning-banner"]')).toBeNull()
  })
})
