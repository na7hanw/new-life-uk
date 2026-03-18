/**
 * @vitest-environment jsdom
 *
 * Tests for PWA / offline UI states in MorePage.
 * Covers:
 *  - "Available Offline" badge when the service worker is ready
 *  - Install App button visibility driven by the beforeinstallprompt event
 *  - Install button disabled / "Installed!" text after the user accepts install
 *  - No offline badge when navigator.serviceWorker is unavailable
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '../context/AppContext.tsx'
import MorePage from '../pages/MorePage.tsx'
import type { BeforeInstallPromptEvent } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderMorePage() {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<MorePage />} />
          <Route path="*" element={<MorePage />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  )
}

beforeEach(() => {
  localStorage.setItem('nluk_lang', 'en')
})
afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

// ─── Service worker / offline badge ──────────────────────────────────────────

describe('MorePage — offline-ready badge', () => {
  it('does NOT show the offline badge while service worker ready is still pending', () => {
    // Service worker exists but its ready Promise is still pending (never resolves)
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: new Promise(() => {}) },
      writable: true,
      configurable: true,
    })

    renderMorePage()
    // Badge must not appear before the ready Promise settles
    expect(screen.queryByText(/Available Offline/i)).toBeNull()
  })

  it('shows the "Available Offline" badge when the service worker is ready', async () => {
    // Mock navigator.serviceWorker.ready to resolve immediately
    const readyPromise = Promise.resolve({} as ServiceWorkerRegistration)
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: readyPromise },
      writable: true,
      configurable: true,
    })

    renderMorePage()
    await act(async () => { await readyPromise })
    await waitFor(() => {
      expect(screen.getByText(/Available Offline/i)).not.toBeNull()
    })
  })

  it('does NOT show the offline badge when service worker rejects', async () => {
    // Simulate a service worker that fails to become ready
    const rejectedPromise = Promise.reject(new Error('SW not available'))
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: rejectedPromise },
      writable: true,
      configurable: true,
    })

    renderMorePage()
    // Wait briefly then check — badge should remain absent
    await act(async () => {
      await rejectedPromise.catch(() => {})
    })
    expect(screen.queryByText(/Available Offline/i)).toBeNull()
  })
})

// ─── beforeinstallprompt / PWA install button ─────────────────────────────────

describe('MorePage — install prompt', () => {
  it('does NOT show the Install App button before beforeinstallprompt fires', () => {
    renderMorePage()
    expect(screen.queryByRole('button', { name: /Install/i })).toBeNull()
  })

  it('shows the Install App button after beforeinstallprompt fires', async () => {
    renderMorePage()

    // Create a mock BeforeInstallPromptEvent
    const mockPrompt: Partial<BeforeInstallPromptEvent> = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: '' }),
    }

    await act(async () => {
      const event = Object.assign(new Event('beforeinstallprompt'), mockPrompt)
      window.dispatchEvent(event)
    })

    expect(screen.getByRole('button', { name: /📲 Install/i })).not.toBeNull()
  })

  it('shows the Install App section label when beforeinstallprompt fires', async () => {
    renderMorePage()

    const mockPrompt: Partial<BeforeInstallPromptEvent> = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: '' }),
    }

    await act(async () => {
      const event = Object.assign(new Event('beforeinstallprompt'), mockPrompt)
      window.dispatchEvent(event)
    })

    expect(screen.getByText(/📲 Install App/i)).not.toBeNull()
  })

  it('disables the install button and shows "Installed!" after accepted install', async () => {
    renderMorePage()

    const mockPrompt: Partial<BeforeInstallPromptEvent> = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: '' }),
    }

    await act(async () => {
      const event = Object.assign(new Event('beforeinstallprompt'), mockPrompt)
      window.dispatchEvent(event)
    })

    const installBtn = screen.getByRole('button', { name: /📲 Install/i })
    await act(async () => { fireEvent.click(installBtn) })

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /Installed!/i })
      expect(btn).not.toBeNull()
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
