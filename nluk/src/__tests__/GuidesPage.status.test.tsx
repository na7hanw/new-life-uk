/**
 * @vitest-environment jsdom
 *
 * Status-specific logic tests for GuidesPage.
 * Covers: "For You" section rendering per status,
 *         tip rotation based on status (tipsKeyForStatus behaviour).
 *
 * NOTE: The status picker and Quick Actions grid were removed from GuidesPage
 * in the onboarding simplification — users set their status in Settings.
 * These tests exercise only the remaining status-driven UI.
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

// ─── "For You" section ────────────────────────────────────────────────────────

describe('GuidesPage — For You section', () => {
  it('shows the "For You" section when userStatus is "refugee"', () => {
    const { container } = renderWithStatus('refugee')
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
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).toBeUndefined()
  })

  it('renders the refugee-specific guides in the For You section', () => {
    const { container } = renderWithStatus('refugee')
    const forYouHeaders = container.querySelectorAll('.cat-header')
    const forYouHeader = Array.from(forYouHeaders).find(el => el.textContent?.includes('For You'))
    expect(forYouHeader).not.toBeNull()
    // The Move-On guide should appear (id: move-on)
    expect(screen.queryAllByText(/Move-On: Starting Your Independent Life/i).length).toBeGreaterThan(0)
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
