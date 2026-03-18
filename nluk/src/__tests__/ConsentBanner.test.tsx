/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/ConsentBanner.tsx
 * Covers: visibility rules (SENTRY_DSN presence, stored consent),
 *         accept/decline behaviour, localStorage persistence, and ARIA.
 *
 * The sentry module is mocked so that SENTRY_DSN can be controlled per
 * test-suite without relying on the real environment variable.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CONSENT_KEY } from '../components/ConsentBanner.tsx'

// ─── Mock the sentry module so SENTRY_DSN can be controlled ──────────────────

vi.mock('../lib/sentry.ts', () => ({
  SENTRY_DSN: 'https://key@o0.ingest.sentry.io/0',
  initSentry: vi.fn(),
}))

// Import after mock so the component picks up the mocked value
import ConsentBanner from '../components/ConsentBanner.tsx'
import { initSentry } from '../lib/sentry.ts'

// Minimal UiStrings subset needed by ConsentBanner
const UI = {
  consentTitle:   'A note on privacy',
  consentBody:    'Anonymous crash reports help us fix bugs faster.',
  consentAccept:  "✓ OK, that's fine",
  consentDecline: 'No thanks',
} as Parameters<typeof ConsentBanner>[0]['ui']

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// ─── Visibility rules ─────────────────────────────────────────────────────────

describe('ConsentBanner — visibility', () => {
  it('shows the banner when SENTRY_DSN is configured and no consent is stored', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByRole('dialog')).not.toBeNull()
  })

  it('does NOT show the banner when consent has already been granted', () => {
    localStorage.setItem(CONSENT_KEY, 'granted')
    const { container } = render(<ConsentBanner ui={UI} />)
    expect(container.firstChild).toBeNull()
  })

  it('does NOT show the banner when consent has already been denied', () => {
    localStorage.setItem(CONSENT_KEY, 'denied')
    const { container } = render(<ConsentBanner ui={UI} />)
    expect(container.firstChild).toBeNull()
  })
})

// ─── ARIA attributes ──────────────────────────────────────────────────────────

describe('ConsentBanner — ARIA', () => {
  it('has role="dialog" on the banner container', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByRole('dialog')).not.toBeNull()
  })

  it('has aria-modal="true" on the dialog', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('has an accessible aria-label on the dialog', () => {
    render(<ConsentBanner ui={UI} />)
    const dialog = screen.getByRole('dialog')
    const label = dialog.getAttribute('aria-label')
    expect(label).toBeTruthy()
    expect(label!.length).toBeGreaterThan(0)
  })
})

// ─── Accept consent ───────────────────────────────────────────────────────────

describe('ConsentBanner — accepting consent', () => {
  it('hides the banner when the accept button is clicked', () => {
    const { container } = render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /OK, that's fine/i }))
    expect(container.firstChild).toBeNull()
  })

  it('stores "granted" in localStorage when accepted', () => {
    render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /OK, that's fine/i }))
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted')
  })

  it('calls initSentry() when consent is accepted', () => {
    render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /OK, that's fine/i }))
    expect(initSentry).toHaveBeenCalledOnce()
  })
})

// ─── Decline consent ─────────────────────────────────────────────────────────

describe('ConsentBanner — declining consent', () => {
  it('hides the banner when the decline button is clicked', () => {
    const { container } = render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /No thanks/i }))
    expect(container.firstChild).toBeNull()
  })

  it('stores "denied" in localStorage when declined', () => {
    render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /No thanks/i }))
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied')
  })

  it('does NOT call initSentry() when consent is declined', () => {
    render(<ConsentBanner ui={UI} />)
    fireEvent.click(screen.getByRole('button', { name: /No thanks/i }))
    expect(initSentry).not.toHaveBeenCalled()
  })
})

// ─── Content ─────────────────────────────────────────────────────────────────

describe('ConsentBanner — content', () => {
  it('renders the consent title text', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByText(/A note on privacy/i)).not.toBeNull()
  })

  it('renders the consent body text', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByText(/Anonymous crash reports help us fix bugs faster/i)).not.toBeNull()
  })

  it('renders both accept and decline buttons', () => {
    render(<ConsentBanner ui={UI} />)
    expect(screen.getByRole('button', { name: /OK, that's fine/i })).not.toBeNull()
    expect(screen.getByRole('button', { name: /No thanks/i })).not.toBeNull()
  })
})
