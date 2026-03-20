/**
 * @vitest-environment jsdom
 *
 * Tests for ShareBar.jsx
 * Mocks: navigator.clipboard, window.open
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext.tsx'
import ShareBar from '../components/ShareBar.tsx'

const renderShareBar = (props = {}) =>
  render(
    <MemoryRouter>
      <AppProvider>
        <ShareBar title="Test Guide" ui={UI} {...props} />
      </AppProvider>
    </MemoryRouter>
  )

const UI = {
  shareWhatsapp: 'WhatsApp',
  shareTelegram: 'Telegram',
  shareFacebook: 'Facebook',
  shareCopy: 'Copy link',
  copied: 'Copied!',
}

describe('ShareBar', () => {
  let openSpy
  let writeTextMock

  beforeEach(() => {
    openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
    writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders all four share buttons', () => {
    renderShareBar()
    expect(screen.getByLabelText('WhatsApp')).not.toBeNull()
    expect(screen.getByLabelText('Telegram')).not.toBeNull()
    expect(screen.getByLabelText('Facebook')).not.toBeNull()
    expect(screen.getByLabelText('Copy link')).not.toBeNull()
  })

  it('WhatsApp button opens a WhatsApp share URL in a new tab', () => {
    renderShareBar()
    fireEvent.click(screen.getByLabelText('WhatsApp'))
    expect(openSpy).toHaveBeenCalledOnce()
    const [url, target] = openSpy.mock.calls[0]
    expect(url).toContain('wa.me')
    expect(target).toBe('_blank')
  })

  it('Telegram button opens a Telegram share URL in a new tab', () => {
    renderShareBar()
    fireEvent.click(screen.getByLabelText('Telegram'))
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy.mock.calls[0][0]).toContain('t.me')
    expect(openSpy.mock.calls[0][1]).toBe('_blank')
  })

  it('Facebook button opens a Facebook share URL in a new tab', () => {
    renderShareBar()
    fireEvent.click(screen.getByLabelText('Facebook'))
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy.mock.calls[0][0]).toContain('facebook.com')
    expect(openSpy.mock.calls[0][1]).toBe('_blank')
  })

  it('share URLs encode the guide title', () => {
    render(<MemoryRouter><AppProvider><ShareBar title="Bank Account" ui={UI} /></AppProvider></MemoryRouter>)
    fireEvent.click(screen.getByLabelText('WhatsApp'))
    expect(openSpy.mock.calls[0][0]).toContain(encodeURIComponent('Bank Account'))
  })

  it('copy button writes the current page URL to the clipboard', async () => {
    renderShareBar()
    fireEvent.click(screen.getByLabelText('Copy link'))
    await act(async () => {})  // flush clipboard promise
    expect(writeTextMock).toHaveBeenCalledOnce()
    expect(writeTextMock).toHaveBeenCalledWith(window.location.href)
  })

  it('copy button keeps "Copy link" aria-label after clicking (feedback via toast)', async () => {
    renderShareBar()
    const btn = screen.getByLabelText('Copy link')
    fireEvent.click(btn)
    await act(async () => { await Promise.resolve() })  // flush clipboard promise
    expect(btn.getAttribute('aria-label')).toBe('Copy link')
  })

  it('copy button aria-label is stable after 2 seconds', async () => {
    vi.useFakeTimers()
    renderShareBar()
    const btn = screen.getByLabelText('Copy link')
    fireEvent.click(btn)
    await act(async () => { await Promise.resolve() })  // flush clipboard promise
    await act(async () => { vi.advanceTimersByTime(2001) })
    expect(btn.getAttribute('aria-label')).toBe('Copy link')
    vi.useRealTimers()
  })
})
