/**
 * @vitest-environment jsdom
 *
 * Tests for src/context/AppContext.tsx
 * Covers: initial state, lang update, dark mode, bookmark toggle (add/remove),
 *         useApp guard (throws outside provider), RTL direction.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { LANGS } from '../data/ui-strings.ts'
import { AppProvider, useApp } from '../context/AppContext.tsx'

beforeEach(() => { localStorage.clear() })
afterEach(() => { cleanup(); localStorage.clear() })

// ─── Provider default values ──────────────────────────────────────────────────

describe('AppContext — initial state', () => {
  it('provides a supported language code as default when no saved lang exists', () => {
    const supported = LANGS.map(l => l.code)
    function Inspector() {
      const { lang } = useApp()
      return <span data-testid="lang">{lang}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    const lang = screen.getByTestId('lang').textContent ?? ''
    expect(supported).toContain(lang)
  })

  it('respects a previously saved language from localStorage', () => {
    localStorage.setItem('nluk_lang', 'fr')
    function Inspector() {
      const { lang } = useApp()
      return <span data-testid="lang">{lang}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('fr')
  })

  it('defaults dark mode to false when not stored', () => {
    function Inspector() {
      const { dark } = useApp()
      return <span data-testid="dark">{String(dark)}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('dark').textContent).toBe('false')
  })

  it('restores dark mode from localStorage', () => {
    localStorage.setItem('nluk_dark', 'true')
    function Inspector() {
      const { dark } = useApp()
      return <span data-testid="dark">{String(dark)}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('dark').textContent).toBe('true')
  })

  it('defaults bookmarks to an empty array', () => {
    function Inspector() {
      const { bookmarks } = useApp()
      return <span data-testid="bm">{JSON.stringify(bookmarks)}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(JSON.parse(screen.getByTestId('bm').textContent ?? '[]')).toEqual([])
  })
})

// ─── setLang ──────────────────────────────────────────────────────────────────

describe('AppContext — setLang', () => {
  it('updates the lang value when setLang is called', async () => {
    function LangSwitcher() {
      const { lang, setLang } = useApp()
      return (
        <div>
          <span data-testid="lang">{lang}</span>
          <button onClick={() => setLang('ar')}>Set Arabic</button>
        </div>
      )
    }
    render(<AppProvider><LangSwitcher /></AppProvider>)
    await act(async () => { fireEvent.click(screen.getByText('Set Arabic')) })
    expect(screen.getByTestId('lang').textContent).toBe('ar')
  })

  it('persists the new lang to localStorage', async () => {
    function LangSwitcher() {
      const { setLang } = useApp()
      return <button onClick={() => setLang('uk')}>Set Ukrainian</button>
    }
    render(<AppProvider><LangSwitcher /></AppProvider>)
    await act(async () => { fireEvent.click(screen.getByText('Set Ukrainian')) })
    expect(localStorage.getItem('nluk_lang')).toBe('uk')
  })
})

// ─── toggleBookmark ───────────────────────────────────────────────────────────

describe('AppContext — toggleBookmark', () => {
  it('adds a bookmark id when toggled for the first time', async () => {
    function BookmarkInspector() {
      const { bookmarks, toggleBookmark } = useApp()
      return (
        <>
          <span data-testid="bm">{JSON.stringify(bookmarks)}</span>
          <button onClick={() => toggleBookmark('bank')}>Toggle</button>
        </>
      )
    }
    render(<AppProvider><BookmarkInspector /></AppProvider>)
    await act(async () => { fireEvent.click(screen.getByText('Toggle')) })
    expect(JSON.parse(screen.getByTestId('bm').textContent ?? '[]')).toContain('bank')
  })

  it('removes a bookmark id when toggled a second time', async () => {
    function BookmarkInspector() {
      const { bookmarks, toggleBookmark } = useApp()
      return (
        <>
          <span data-testid="bm">{JSON.stringify(bookmarks)}</span>
          <button onClick={() => toggleBookmark('bank')}>Toggle</button>
        </>
      )
    }
    render(<AppProvider><BookmarkInspector /></AppProvider>)
    await act(async () => { fireEvent.click(screen.getByText('Toggle')) }) // add
    await act(async () => { fireEvent.click(screen.getByText('Toggle')) }) // remove
    expect(JSON.parse(screen.getByTestId('bm').textContent ?? '[]')).not.toContain('bank')
  })

  it('persists bookmarks to localStorage', async () => {
    function BookmarkInspector() {
      const { toggleBookmark } = useApp()
      return <button onClick={() => toggleBookmark('uc')}>Toggle</button>
    }
    render(<AppProvider><BookmarkInspector /></AppProvider>)
    await act(async () => { fireEvent.click(screen.getByText('Toggle')) })
    const stored = JSON.parse(localStorage.getItem('nluk_bookmarks') || '[]')
    expect(stored).toContain('uc')
  })
})

// ─── useApp guard ─────────────────────────────────────────────────────────────

describe('AppContext — useApp outside provider', () => {
  it('throws an error when useApp is used without AppProvider', () => {
    function BadConsumer() {
      useApp()
      return null
    }
    expect(() => {
      render(<BadConsumer />)
    }).toThrow()
  })
})

// ─── dir and fontClass ────────────────────────────────────────────────────────

describe('AppContext — derived RTL/font values', () => {
  it('exposes dir="rtl" for Arabic', () => {
    localStorage.setItem('nluk_lang', 'ar')
    function Inspector() {
      const { dir } = useApp()
      return <span data-testid="dir">{dir}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('dir').textContent).toBe('rtl')
  })

  it('exposes dir="ltr" for English', () => {
    localStorage.setItem('nluk_lang', 'en')
    function Inspector() {
      const { dir } = useApp()
      return <span data-testid="dir">{dir}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('dir').textContent).toBe('ltr')
  })
})

// ─── Profile personalization fields ───────────────────────────────────────────

describe('AppContext — profile personalization', () => {
  it('userAmbition defaults to empty string', () => {
    function Inspector() {
      const { userAmbition } = useApp()
      return <span data-testid="ambition">{userAmbition}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('ambition').textContent).toBe('')
  })

  it('setUserAmbition updates state and persists to localStorage', () => {
    function Inspector() {
      const { userAmbition, setUserAmbition } = useApp()
      return (
        <>
          <span data-testid="ambition">{userAmbition}</span>
          <button onClick={() => setUserAmbition('work')}>Set</button>
        </>
      )
    }
    render(<AppProvider><Inspector /></AppProvider>)
    act(() => { fireEvent.click(screen.getByText('Set')) })
    expect(screen.getByTestId('ambition').textContent).toBe('work')
    expect(localStorage.getItem('nluk_ambition')).toBe('work')
  })

  it('userSector defaults to empty string', () => {
    function Inspector() {
      const { userSector } = useApp()
      return <span data-testid="sector">{userSector}</span>
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('sector').textContent).toBe('')
  })

  it('toggleDocument adds and removes document ids', () => {
    function Inspector() {
      const { documentsHeld, toggleDocument } = useApp()
      return (
        <>
          <span data-testid="docs">{documentsHeld.join(',')}</span>
          <button onClick={() => toggleDocument('brp')}>Toggle BRP</button>
        </>
      )
    }
    render(<AppProvider><Inspector /></AppProvider>)
    expect(screen.getByTestId('docs').textContent).toBe('')

    act(() => { fireEvent.click(screen.getByText('Toggle BRP')) })
    expect(screen.getByTestId('docs').textContent).toBe('brp')
    expect(localStorage.getItem('nluk_docs')).toContain('brp')

    act(() => { fireEvent.click(screen.getByText('Toggle BRP')) })
    expect(screen.getByTestId('docs').textContent).toBe('')
  })
})
