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
import ChecklistWidget, { checklistFor, CHECKLIST_ITEMS } from '../components/ChecklistWidget.tsx'

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

  it('shows "0/8 complete" on first render (nothing checked)', () => {
    renderWidget()
    expect(screen.getByText(/0\/8 complete/)).not.toBeNull()
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

  it('shows all eight checklist items', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    // Each item has an aria-label like "Mark as done: Set up eVisa account"
    const checkboxes = screen.getAllByRole('button', { name: /Mark as done|Unmark/ })
    expect(checkboxes.length).toBe(8)
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
    expect(screen.getByText(/1\/8 complete/)).not.toBeNull()
  })

  it('un-marks an item (aria-pressed false) when clicked again', () => {
    renderWidget()
    fireEvent.click(screen.getByRole('button', { name: /My Progress/ }))
    const firstCheckbox = screen.getAllByRole('button', { name: /Mark as done/ })[0]
    fireEvent.click(firstCheckbox) // mark done
    const doneBtn = screen.getByRole('button', { name: /Unmark: Set up eVisa account/ })
    fireEvent.click(doneBtn) // un-mark
    expect(screen.getByText(/0\/8 complete/)).not.toBeNull()
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

// ─── Status awareness ─────────────────────────────────────────────────────────
//
// The list used to be shown to everyone. Four of its eight steps are wrong for
// someone still waiting on an asylum decision, and one of them — "Apply for
// Universal Credit" — is the no-recourse-to-public-funds trap: acting on it
// means claiming a benefit they are barred from.

describe('ChecklistWidget — status awareness', () => {
  it('never offers Universal Credit to someone still claiming asylum', () => {
    render(
      <MemoryRouter>
        <ChecklistWidget ui={UI} status="asylum-seeker" />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /My Progress/i }))
    // The warning below deliberately names Universal Credit — explaining the
    // absence is the point — so assert on the actionable step, not the words.
    expect(screen.queryByRole('button', { name: /Apply for Universal Credit/i })).toBeNull()
    expect(screen.queryByText(/💷/)).toBeNull()
  })

  it('says why it is missing, rather than only hiding it', () => {
    render(
      <MemoryRouter>
        <ChecklistWidget ui={UI} status="asylum-seeker" />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /My Progress/i }))
    expect(screen.getByText(/no recourse to public funds/i)).not.toBeNull()
  })

  it('drops the steps an asylum seeker cannot complete, and keeps the ones they can', () => {
    const forClaiming = checklistFor('asylum-seeker').map(i => i.id)
    expect(forClaiming).not.toContain('uc')
    expect(forClaiming).not.toContain('evisa')
    expect(forClaiming).not.toContain('ni')
    expect(forClaiming).not.toContain('housing')
    expect(forClaiming).toEqual(expect.arrayContaining(['gp', 'legal', 'bank', 'degree']))
  })

  it('still shows every step to a refugee', () => {
    expect(checklistFor('refugee')).toHaveLength(CHECKLIST_ITEMS.length)
  })

  it('counts progress against the steps shown, not the full list', () => {
    localStorage.setItem('nluk_checklist', JSON.stringify(['gp', 'uc']))
    render(
      <MemoryRouter>
        <ChecklistWidget ui={UI} status="asylum-seeker" />
      </MemoryRouter>,
    )
    // 'uc' is not offered to this user, so it must not inflate their progress.
    expect(screen.getByText(/1\/4 complete/)).not.toBeNull()
  })
})
