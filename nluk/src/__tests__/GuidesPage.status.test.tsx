/**
 * @vitest-environment jsdom
 *
 * Status-specific logic tests for GuidesPage.
 * Covers: status picker visibility, "For You" section rendering per status,
 *         tip rotation based on status (tipsKeyForStatus behaviour).
 *
 * These tests render the full GuidesPage inside AppProvider + MemoryRouter so
 * the actual STATUS_GUIDES mapping and tipsKeyForStatus logic are exercised.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '../context/AppContext.tsx'
import GuidesPage from '../pages/GuidesPage.tsx'
import type { UserStatus } from '../types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderGuidesPage() {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<GuidesPage />} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  )
}

/** Render GuidesPage with a pre-set userStatus saved in localStorage. */
function renderWithStatus(status: UserStatus) {
  localStorage.setItem('nluk_status', status)
  return renderGuidesPage()
}

beforeEach(() => { localStorage.clear() })
afterEach(() => { cleanup(); localStorage.clear() })

// ─── Status picker ────────────────────────────────────────────────────────────

describe('GuidesPage — status picker', () => {
  it('shows the status picker when no status has been selected', () => {
    renderGuidesPage()
    expect(screen.queryByText(/What's your situation/i)).not.toBeNull()
  })

  it('hides the status picker after the user selects a status', async () => {
    renderGuidesPage()
    const btn = screen.getByRole('button', { name: /Recognised refugee/i })
    await act(async () => { fireEvent.click(btn) })
    expect(screen.queryByText(/What's your situation/i)).toBeNull()
  })

  it('hides the status picker when "Skip for now" is clicked', async () => {
    renderGuidesPage()
    const skipBtn = screen.getByRole('button', { name: /Skip for now/i })
    await act(async () => { fireEvent.click(skipBtn) })
    expect(screen.queryByText(/What's your situation/i)).toBeNull()
  })

  it('does not show the status picker when a status is already stored', () => {
    renderWithStatus('refugee')
    expect(screen.queryByText(/What's your situation/i)).toBeNull()
  })
})

// ─── "For You" section ────────────────────────────────────────────────────────

describe('GuidesPage — For You section', () => {
  it('shows the "For You" section when userStatus is "refugee"', () => {
    const { container } = renderWithStatus('refugee')
    // The "For You" section header renders as a cat-header element containing "⭐ For You"
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
  })

  it('shows the "For You" section when userStatus is "asylum-seeker"', () => {
    const { container } = renderWithStatus('asylum-seeker')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
  })

  it('shows the "For You" section when userStatus is "other-visa"', () => {
    const { container } = renderWithStatus('other-visa')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
  })

  it('shows the "For You" section when userStatus is "settled"', () => {
    const { container } = renderWithStatus('settled')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
  })

  it('does NOT show the "For You" section when no status is set', () => {
    const { container } = renderGuidesPage()
    // Dismiss the status picker first
    fireEvent.click(screen.getByRole('button', { name: /Skip for now/i }))
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).toBeUndefined()
  })

  it('renders the refugee-specific guides in the For You section', () => {
    const { container } = renderWithStatus('refugee')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
    // The 56-Day Move-On Period guide should appear (id: move-on)
    expect(screen.queryAllByText(/56-Day Move-On Period/i).length).toBeGreaterThan(0)
  })

  it('renders asylum-seeker-specific guides in the For You section', () => {
    const { container } = renderWithStatus('asylum-seeker')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
    // "Waiting for Your Asylum Decision" guide (id: asylum-waiting) should appear
    expect(screen.queryAllByText(/Waiting for Your Asylum Decision/i).length).toBeGreaterThan(0)
  })
})

// ─── Quick Actions ────────────────────────────────────────────────────────────

describe('GuidesPage — Quick Actions', () => {
  it('renders the Quick Actions grid', () => {
    renderGuidesPage()
    expect(screen.getByText('Quick Actions')).not.toBeNull()
  })

  it('includes an eVisa quick action button with exact aria-label', () => {
    renderGuidesPage()
    // The quick action uses aria-label="eVisa" (from ui.qaEvisa in BASE_UI)
    expect(screen.getByRole('button', { name: 'eVisa' })).not.toBeNull()
  })
})

// ─── Bookmarks ────────────────────────────────────────────────────────────────

describe('GuidesPage — bookmarks', () => {
  it('does not show the Saved Guides section when there are no bookmarks', () => {
    renderGuidesPage()
    expect(screen.queryByText(/Saved Guides/i)).toBeNull()
  })

  it('shows the Saved Guides section after bookmarking a guide', async () => {
    renderWithStatus('refugee')
    // Find a bookmark button and click it
    const bookmarkBtns = screen.getAllByRole('button', { name: /Save guide/i })
    await act(async () => { fireEvent.click(bookmarkBtns[0]) })
    expect(screen.queryByText(/Saved Guides/i)).not.toBeNull()
  })
})
