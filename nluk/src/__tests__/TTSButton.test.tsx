/**
 * @vitest-environment jsdom
 *
 * Tests for TTSButton.jsx
 * Mocks: window.speechSynthesis, SpeechSynthesisUtterance
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import TTSButton from '../components/TTSButton.tsx'

const PROPS = {
  lang: 'en',
  title: 'Test Title',
  summary: 'Test summary.',
  steps: ['Step one.', 'Step two.'],
}

// ─── When Web Speech API is NOT available ─────────────────────────────────────

describe('TTSButton — unsupported environment', () => {
  it('renders nothing when speechSynthesis is absent', () => {
    // jsdom does not implement Web Speech API, so this works without any setup
    const { container } = render(<TTSButton {...PROPS} />)
    expect(container.firstChild).toBeNull()
  })
})

// ─── When Web Speech API IS available ────────────────────────────────────────

describe('TTSButton — supported environment', () => {
  let mockSpeech
  let MockUtterance

  beforeEach(() => {
    MockUtterance = vi.fn().mockImplementation(function (text) {
      this.text = text
      this.lang = ''
      this.voice = null
      this.onstart = null
      this.onend = null
      this.onerror = null
    })
    ;(globalThis as typeof globalThis & { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = MockUtterance

    mockSpeech = {
      cancel: vi.fn(),
      speak: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeech,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    delete (globalThis as typeof globalThis & { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance
    try { delete window.speechSynthesis } catch (_) {
      Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true })
    }
  })

  it('renders a Listen button', () => {
    render(<TTSButton {...PROPS} />)
    const btn = screen.getByRole('button')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toContain('Listen')
    expect(btn.getAttribute('aria-label')).toBe('Listen to this guide')
  })

  it('calls speechSynthesis.speak when the Listen button is clicked', () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockSpeech.speak).toHaveBeenCalledOnce()
    expect(MockUtterance).toHaveBeenCalledOnce()
  })

  it('builds the utterance text from title, summary and steps joined by ". "', () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    const utterText = MockUtterance.mock.calls[0][0]
    expect(utterText).toContain('Test Title')
    expect(utterText).toContain('Test summary.')
    expect(utterText).toContain('Step one.')
    expect(utterText).toContain('Step two.')
  })

  it('sets the correct BCP-47 language on the utterance for English', () => {
    render(<TTSButton {...PROPS} lang="en" />)
    fireEvent.click(screen.getByRole('button'))
    expect(MockUtterance.mock.instances[0].lang).toBe('en-GB')
  })

  it('sets the correct BCP-47 language on the utterance for Arabic', () => {
    render(<TTSButton {...PROPS} lang="ar" />)
    fireEvent.click(screen.getByRole('button'))
    expect(MockUtterance.mock.instances[0].lang).toBe('ar-SA')
  })

  it('switches to Stop mode when speech starts (onstart fires)', async () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    const utter = MockUtterance.mock.instances[0]
    await act(async () => { utter.onstart?.() })
    const btn = screen.getByRole('button')
    expect(btn.textContent).toContain('Stop')
    expect(btn.getAttribute('aria-label')).toBe('Stop reading aloud')
  })

  it('returns to Listen mode when speech ends naturally (onend fires)', async () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    const utter = MockUtterance.mock.instances[0]
    await act(async () => { utter.onstart?.() })
    await act(async () => { utter.onend?.() })
    expect(screen.getByRole('button').textContent).toContain('Listen')
  })

  it('returns to Listen mode when speech errors (onerror fires)', async () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    const utter = MockUtterance.mock.instances[0]
    await act(async () => { utter.onstart?.() })
    await act(async () => { utter.onerror?.() })
    expect(screen.getByRole('button').textContent).toContain('Listen')
  })

  it('calls speechSynthesis.cancel when the Stop button is clicked', async () => {
    render(<TTSButton {...PROPS} />)
    fireEvent.click(screen.getByRole('button'))
    const utter = MockUtterance.mock.instances[0]
    await act(async () => { utter.onstart?.() })
    fireEvent.click(screen.getByRole('button'))
    expect(mockSpeech.cancel).toHaveBeenCalled()
  })

  it('cancels speech on unmount', () => {
    const { unmount } = render(<TTSButton {...PROPS} />)
    unmount()
    expect(mockSpeech.cancel).toHaveBeenCalled()
  })
})
