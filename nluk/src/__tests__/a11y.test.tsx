/**
 * @vitest-environment jsdom
 *
 * Automated accessibility tests using axe-core.
 * Renders key page components and asserts zero WCAG violations.
 *
 * Pages covered:
 *   - GuidesPage (home / guides tab)
 *   - WorkHub    (jobs/certs/careers tab)
 */
import { describe, it, expect } from 'vitest'
import { type ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axe from 'axe-core'
import { AppProvider } from '../context/AppContext.tsx'
import GuidesPage from '../pages/GuidesPage.tsx'
import WorkHub from '../pages/WorkHub.tsx'

// Wrap components in the minimum required providers.
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProvider>
  )
}

// Helper: render + run axe and return violations array.
async function runAxe(element: HTMLElement) {
  const results = await axe.run(element, {
    // Limit to rules that fire reliably in jsdom (skip colour-contrast, which
    // requires computed styles not available in jsdom).
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'best-practice'],
    },
    rules: {
      'color-contrast': { enabled: false },
    },
  })
  return results.violations
}

describe('Accessibility — GuidesPage', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Wrapper>
        <Routes>
          <Route path="*" element={<GuidesPage />} />
        </Routes>
      </Wrapper>,
    )
    const violations = await runAxe(container)
    if (violations.length > 0) {
      const detail = violations
        .map(v => `[${v.id}] ${v.description}: ${v.nodes.map(n => n.html).join(', ')}`)
        .join('\n')
      throw new Error(`GuidesPage accessibility violations:\n${detail}`)
    }
    expect(violations).toHaveLength(0)
  })
})

describe('Accessibility — WorkHub (jobs)', () => {
  it('has no axe violations on the jobs subtab', async () => {
    const { container } = render(
      <AppProvider>
        <MemoryRouter initialEntries={['/work/jobs']}>
          <Routes>
            <Route path="/work/:subtab" element={<WorkHub />} />
            <Route path="*" element={<WorkHub />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>,
    )
    const violations = await runAxe(container)
    if (violations.length > 0) {
      const detail = violations
        .map(v => `[${v.id}] ${v.description}: ${v.nodes.map(n => n.html).join(', ')}`)
        .join('\n')
      throw new Error(`WorkHub accessibility violations:\n${detail}`)
    }
    expect(violations).toHaveLength(0)
  })
})
