/**
 * @vitest-environment jsdom
 *
 * Tests for SOSModal.jsx
 * Covers: ARIA attributes, rendering, Escape-key dismissal, focus trap,
 * and close-button behaviour.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SOSModal from '../components/SOSModal.jsx'

const UI = {
  sos: 'Emergency Contacts',
  sosDesc: 'All numbers below are free to call, 24/7.',
  close: 'Close',
}

const SOS_NUMBERS = [
  { name: 'Police',      phone: '999',    num: '999',     note: 'Emergency services' },
  { name: 'Samaritans', phone: '116123', num: '116 123', note: 'Emotional support' },
]

afterEach(() => { cleanup() })

// ─── Closed state ─────────────────────────────────────────────────────────────

describe('SOSModal — closed', () => {
  it('renders nothing when showSOS is false', () => {
    const { container } = render(
      <SOSModal showSOS={false} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />
    )
    expect(container.firstChild).toBeNull()
  })
})

// ─── Open state ───────────────────────────────────────────────────────────────

describe('SOSModal — open', () => {
  it('renders a dialog when showSOS is true', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    expect(screen.getByRole('dialog')).not.toBeNull()
  })

  it('has aria-modal="true" on the dialog', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('labels the dialog via aria-labelledby pointing to the title element', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const dialog = screen.getByRole('dialog')
    const titleId = dialog.getAttribute('aria-labelledby')
    expect(titleId).toBe('sos-modal-title')
    expect(document.getElementById(titleId)).not.toBeNull()
  })

  it('renders all SOS entries as tel: links', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const policeLink = screen.getByRole('link', { name: /Police/ })
    const samaritansLink = screen.getByRole('link', { name: /Samaritans/ })
    expect(policeLink.getAttribute('href')).toBe('tel:999')
    expect(samaritansLink.getAttribute('href')).toBe('tel:116123')
  })
})

// ─── Keyboard & focus behaviour ───────────────────────────────────────────────

describe('SOSModal — keyboard and focus', () => {
  it('moves focus to the first focusable element on open', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const firstLink = screen.getAllByRole('link')[0]
    expect(document.activeElement).toBe(firstLink)
  })

  it('pressing Escape calls setSOS(false)', () => {
    const setSOS = vi.fn()
    render(<SOSModal showSOS={true} setSOS={setSOS} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const modalContent = document.querySelector('.modal-content')
    fireEvent.keyDown(modalContent, { key: 'Escape' })
    expect(setSOS).toHaveBeenCalledWith(false)
  })

  it('Tab on the last focusable element wraps focus to the first', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const closeBtn = screen.getByRole('button', { name: 'Close' })
    closeBtn.focus()
    fireEvent.keyDown(closeBtn, { key: 'Tab', shiftKey: false })
    expect(document.activeElement).toBe(screen.getAllByRole('link')[0])
  })

  it('Shift+Tab on the first focusable element wraps focus to the last', () => {
    render(<SOSModal showSOS={true} setSOS={vi.fn()} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    const firstLink = screen.getAllByRole('link')[0]
    firstLink.focus()
    fireEvent.keyDown(firstLink, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }))
  })
})

// ─── Close button ─────────────────────────────────────────────────────────────

describe('SOSModal — close button', () => {
  it('clicking the close button calls setSOS(false)', () => {
    const setSOS = vi.fn()
    render(<SOSModal showSOS={true} setSOS={setSOS} ui={UI} SOS_NUMBERS={SOS_NUMBERS} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(setSOS).toHaveBeenCalledWith(false)
  })
})
