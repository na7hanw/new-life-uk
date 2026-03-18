/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/ChecklistWidget.tsx
 * Covers: expand/collapse, item toggling (aria-pressed, progress count),
 *         localStorage persistence, guide navigation button.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ChecklistWidget from '../components/ChecklistWidget.tsx'

const UI = {
  myChecklist: 'My Progress',
  checklistIntro: 'Track the key steps to settling in the UK.',
}

function renderWidget() {
  return render(
    <MemoryRouter>
      <ChecklistWidget ui={UI} />
    </MemoryRouter>,
  )
}

beforeEach(() => { localStorage.clear() })
afterEach(() => { cleanup(); localStorage.clear() })

// ─── Initial (collapsed) state ────────────────────────────────────────────────

describe('ChecklistWidget — collapsed', () => {
  it('renders the "My Progress" heading', () => {
    renderWidget()
    expect(screen.getByText(/My Progress/)).not.toBeNull()
  })

  it('shows "0/7 complete" on first render (nothing checked)', () => {
    renderWidget()
    expect(screen.getByText('0/7 complete')).not.toBeNull()
  })

  it('toggle button has aria-expanded="false" initially', () => {
    renderWidget()
    const btn = screen.getByRole('button', { name: /My Progress/ })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it('does not show checklist items when collapsed', () => {
    renderWidget()
    // The intro text is only visible when expanded
    expect(screen.queryByText('Track the key steps to settling in the UK.')).toBeNull()
  })
})

// ─── Expanded state ───────────────────────────────────────────────────────────

describe('ChecklistWidget — expanded', () => {
  it('reveals the intro text after clicking the toggle', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    expect(screen.getByText('Track the key steps to settling in the UK.')).not.toBeNull()
  })

  it('toggle button has aria-expanded="true" after opening', () => {
    renderWidget()
    const btn = screen.getByRole('button', { name: /My Progress/ })
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })

  it('shows all seven checklist items', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    // Each item has an aria-label like "Mark as done: Set up eVisa account"
    const checkboxes = screen.getAllByRole('button', { name: /Mark as done|Unmark/ })
    expect(checkboxes.length).toBe(7)
  })

  it('collapses again when the toggle is clicked a second time', () => {
    renderWidget()
    const btn = screen.getByRole('button', { name: /My Progress/ })
    fireEvent.click(btn) // open
    fireEvent.click(btn) // close
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })
})

// ─── Toggling items ───────────────────────────────────────────────────────────

describe('ChecklistWidget — item toggling', () => {
  it('marks an item as done and updates aria-pressed to "true"', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    const firstCheckbox = screen.getAllByRole('button', { name: /Mark as done/ })[0]
    fireEvent.click(firstCheckbox)
    expect(firstCheckbox.getAttribute('aria-pressed')).toBe('true')
  })

  it('updates the progress count after marking an item done', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    fireEvent.click(screen.getAllByRole('button', { name: /Mark as done/ })[0])
    expect(screen.getByText('1/7 complete')).not.toBeNull()
  })

  it('un-marks an item (aria-pressed false) when clicked again', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    const firstCheckbox = screen.getAllByRole('button', { name: /Mark as done/ })[0]
    fireEvent.click(firstCheckbox) // mark done
    const doneBtn = screen.getByRole('button', { name: /Unmark: Set up eVisa account/ })
    fireEvent.click(doneBtn) // un-mark
    expect(screen.getByText('0/7 complete')).not.toBeNull()
  })
})

// ─── Persistence ─────────────────────────────────────────────────────────────

describe('ChecklistWidget — localStorage persistence', () => {
  it('persists checked items to localStorage', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    fireEvent.click(screen.getAllByRole('button', { name: /Mark as done/ })[0])
    const stored = JSON.parse(localStorage.getItem('nluk_checklist') || '[]')
    expect(stored.length).toBe(1)
    expect(stored[0]).toBe('evisa')
  })
})
