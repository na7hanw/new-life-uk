/**
 * @vitest-environment jsdom
 *
 * Route redirect and 404 tests.
 * Verifies that the navigation rules from App.tsx behave correctly:
 *   - /work          → /work/jobs  (redirect)
 *   - /more          → /culture    (redirect)
 *   - /unknown-path  → NotFoundPage (404)
 * and that the 404 page provides a "Go back home" link.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from '../context/AppContext.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * A minimal component that just displays the current pathname.
 * Used to assert the post-redirect location.
 */
function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="pathname">{location.pathname}</span>
}

/** Renders a set of Routes inside AppProvider + MemoryRouter. */
function renderRoutes(initialPath: string) {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <LocationDisplay />
        <Routes>
          {/* Redirects that mirror App.tsx */}
          <Route path="/work" element={<Navigate to="/work/jobs" replace />} />
          <Route path="/work/:subtab" element={<div>Work Jobs Page</div>} />
          <Route path="/more" element={<Navigate to="/culture" replace />} />
          <Route path="/culture" element={<div>Culture Page</div>} />
          <Route path="*" element={<NotFoundPage />} />
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
})

// ─── /work redirect ───────────────────────────────────────────────────────────

describe('Route — /work redirect', () => {
  it('redirects /work to /work/jobs', () => {
    renderRoutes('/work')
    expect(screen.getByTestId('pathname').textContent).toBe('/work/jobs')
  })

  it('renders the work/jobs content after redirect', () => {
    renderRoutes('/work')
    expect(screen.getByText('Work Jobs Page')).not.toBeNull()
  })
})

// ─── /more redirect ───────────────────────────────────────────────────────────

describe('Route — /more redirect', () => {
  it('redirects /more to /culture', () => {
    renderRoutes('/more')
    expect(screen.getByTestId('pathname').textContent).toBe('/culture')
  })

  it('renders the culture content after redirect', () => {
    renderRoutes('/more')
    expect(screen.getByText('Culture Page')).not.toBeNull()
  })
})

// ─── NotFoundPage (404) ───────────────────────────────────────────────────────

describe('Route — unknown paths show 404', () => {
  it('renders NotFoundPage for an unrecognised route', () => {
    renderRoutes('/this-path-does-not-exist')
    expect(screen.getByText('Page not found')).not.toBeNull()
  })

  it('shows the descriptive sub-text on the 404 page', () => {
    renderRoutes('/some/deep/nested/path')
    expect(screen.getByText(/The page you're looking for doesn't exist/i)).not.toBeNull()
  })

  it('provides a "Go back home" link on the 404 page', () => {
    renderRoutes('/missing')
    const homeLink = screen.getByRole('link', { name: /Go back home/i })
    expect(homeLink).not.toBeNull()
  })

  it('"Go back home" link points to the root path', () => {
    renderRoutes('/missing')
    const homeLink = screen.getByRole('link', { name: /Go back home/i })
    expect(homeLink.getAttribute('href')).toBe('/')
  })

  it('shows the search (🔍) emoji on the 404 page', () => {
    renderRoutes('/nonexistent')
    expect(screen.getByText('🔍')).not.toBeNull()
  })
})

// ─── Valid routes do NOT fall through to 404 ─────────────────────────────────

describe('Route — valid paths do not show 404', () => {
  it('does not render NotFoundPage when navigating to /work/jobs', () => {
    renderRoutes('/work/jobs')
    expect(screen.queryByText('Page not found')).toBeNull()
  })

  it('does not render NotFoundPage when navigating to /culture', () => {
    renderRoutes('/culture')
    expect(screen.queryByText('Page not found')).toBeNull()
  })
})
