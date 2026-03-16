/**
 * @vitest-environment jsdom
 *
 * Tests for ShareBar.jsx
 * Mocks: navigator.clipboard, window.open
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import ShareBar from '../components/ShareBar.jsx'

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
    render(<ShareBar title="Test Guide" ui={UI} />)
    expect(screen.getByLabelText('Share on WhatsApp')).not.toBeNull()
    expect(screen.getByLabelText('Share on Telegram')).not.toBeNull()
    expect(screen.getByLabelText('Share on Facebook')).not.toBeNull()
    expect(screen.getByLabelText('Copy link')).not.toBeNull()
  })

  it('WhatsApp button opens a WhatsApp share URL in a new tab', () => {
    render(<ShareBar title="Test Guide" ui={UI} />)
    fireEvent.click(screen.getByLabelText('Share on WhatsApp'))
    expect(openSpy).toHaveBeenCalledOnce()
    const [url, target] = openSpy.mock.calls[0]
    expect(url).toContain('wa.me')
    expect(target).toBe('_blank')
  })

  it('Telegram button opens a Telegram share URL in a new tab', () => {
    render(<ShareBar title="Test Guide" ui={UI} />)
    fireEvent.click(screen.getByLabelText('Share on Telegram'))
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy.mock.calls[0][0]).toContain('t.me')
    expect(openSpy.mock.calls[0][1]).toBe('_blank')
  })

  it('Facebook button opens a Facebook share URL in a new tab', () => {
    render(<ShareBar title="Test Guide" ui={UI} />)
    fireEvent.click(screen.getByLabelText('Share on Facebook'))
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy.mock.calls[0][0]).toContain('facebook.com')
    expect(openSpy.mock.calls[0][1]).toBe('_blank')
  })

  it('share URLs encode the guide title', () => {
    render(<ShareBar title="Bank Account" ui={UI} />)
    fireEvent.click(screen.getByLabelText('Share on WhatsApp'))
    expect(openSpy.mock.calls[0][0]).toContain(encodeURIComponent('Bank Account'))
  })

  it('copy button writes the current page URL to the clipboard', async () => {
    render(<ShareBar title="Test Guide" ui={UI} />)
    fireEvent.click(screen.getByLabelText('Copy link'))
    await act(async () => {})  // flush clipboard promise
    expect(writeTextMock).toHaveBeenCalledOnce()
    expect(writeTextMock).toHaveBeenCalledWith(window.location.href)
  })

  it('copy button shows "Copied!" after clicking', async () => {
    vi.useFakeTimers()
    render(<ShareBar title="Test Guide" ui={UI} />)
    const btn = screen.getByLabelText('Copy link')
    fireEvent.click(btn)
    await act(async () => { await Promise.resolve() })  // flush clipboard promise
    expect(btn.textContent).toContain('Copied!')
    vi.useRealTimers()
  })

  it('copy button reverts to "Copy link" after 2 seconds', async () => {
    vi.useFakeTimers()
    render(<ShareBar title="Test Guide" ui={UI} />)
    const btn = screen.getByLabelText('Copy link')
    fireEvent.click(btn)
    await act(async () => { await Promise.resolve() })  // flush clipboard promise
    await act(async () => { vi.advanceTimersByTime(2001) })
    expect(btn.textContent).toContain('Copy link')
    vi.useRealTimers()
  })
})
