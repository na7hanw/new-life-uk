/**
 * MoveOnPlan render tests.
 *
 * ProfilePage, which hosts this, had 0% coverage — including the countdown that
 * tells someone the date they must leave their accommodation.
 */
import type { ComponentProps } from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { addDays, format } from 'date-fns'
import MoveOnPlan from '../components/MoveOnPlan.tsx'
import { computeMoveOnPlan } from '../lib/moveOn.ts'

// No global auto-cleanup is configured in this project, so renders would
// otherwise accumulate in document.body and every query would match twice.
afterEach(cleanup)

const iso = (d: Date) => d.toISOString().slice(0, 10)

function renderPlan(props: Partial<ComponentProps<typeof MoveOnPlan>> = {}) {
  return render(
    <MemoryRouter>
      <MoveOnPlan
        statusDate=""
        setStatusDate={vi.fn()}
        discontinuationDate=""
        setDiscontinuationDate={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )
}

describe('empty state', () => {
  it('invites a date rather than showing a fake countdown', () => {
    renderPlan()
    expect(screen.getByText(/42-day move-on/i)).toBeTruthy()
    expect(screen.getByText(/enter your decision date/i)).toBeTruthy()
  })

  it('says a future date is allowed, so the plan can be laid out in advance', () => {
    renderPlan()
    expect(screen.getByText(/date in the future to plan ahead/i)).toBeTruthy()
  })
})

describe('with a decision date', () => {
  it('counts down to grant + 42 days', () => {
    const grant = addDays(new Date(), -10)
    const { daysLeft } = computeMoveOnPlan({ grantDate: iso(grant) })
    renderPlan({ statusDate: iso(grant) })
    expect(screen.getByText(new RegExp(`${daysLeft} days left`))).toBeTruthy()
    expect(screen.getByText(new RegExp(format(addDays(grant, 42), 'd MMMM yyyy')))).toBeTruthy()
  })

  it('shows both clocks and says the later one wins', () => {
    const grant = addDays(new Date(), -10)
    renderPlan({ statusDate: iso(grant), discontinuationDate: iso(addDays(grant, 21)) })
    expect(screen.getByText(/42 days from your decision/i)).toBeTruthy()
    expect(screen.getByText(/28 days from your discontinuation letter/i)).toBeTruthy()
    expect(screen.getByText(/whichever is later/i)).toBeTruthy()
  })

  it('prompts for the discontinuation date when it is missing', () => {
    renderPlan({ statusDate: iso(addDays(new Date(), -5)) })
    expect(screen.getByText(/can push your deadline later/i)).toBeTruthy()
  })

  it('reports a passed deadline plainly', () => {
    const grant = addDays(new Date(), -50)
    const { daysLeft } = computeMoveOnPlan({ grantDate: iso(grant) })
    renderPlan({ statusDate: iso(grant) })
    expect(screen.getByText(new RegExp(`${Math.abs(daysLeft!)} days past your deadline`, 'i'))).toBeTruthy()
  })
})

describe('the Universal Credit gap', () => {
  it('warns when the first payment would land after the deadline', () => {
    // Day 20 of 42: claiming today pays on day 55, well past the deadline.
    renderPlan({ statusDate: iso(addDays(new Date(), -20)) })
    expect(screen.getByText(/you have to leave/i)).toBeTruthy()
    // The number also appears in the day-21 extension step, so scope to the
    // tappable link in the warning itself.
    expect(screen.getByRole('link', { name: /0808 801 0503/ })).toBeTruthy()
  })

  it('shows the remaining margin when there still is one', () => {
    renderPlan({ statusDate: iso(new Date()) })
    expect(screen.getByText(/of margin before your deadline/i)).toBeTruthy()
  })
})

describe('the action list', () => {
  it('leads with Universal Credit and the council application', () => {
    renderPlan({ statusDate: iso(new Date()) })
    expect(screen.getByText('Apply for Universal Credit')).toBeTruthy()
    expect(screen.getByText('Make a homelessness application to the council')).toBeTruthy()
  })

  it('gives the exact words to use at the council', () => {
    renderPlan({ statusDate: iso(new Date()) })
    expect(screen.getByText(/I am asking for the prevention duty/i)).toBeTruthy()
  })

  it('dates each action once a decision date is known', () => {
    const grant = new Date()
    renderPlan({ statusDate: iso(grant) })
    // Day-21 extension step should carry a real date, not "Day 21".
    expect(screen.getByText(format(addDays(grant, 21), 'd MMM'))).toBeTruthy()
  })

  it('falls back to relative day numbers with no date set', () => {
    renderPlan()
    expect(screen.getByText('Day 21')).toBeTruthy()
  })
})

describe('accessibility', () => {
  it('is a labelled region with real headings', () => {
    renderPlan()
    expect(screen.getByRole('region', { name: /move-on plan/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: /move-on plan/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: /what to do, in order/i })).toBeTruthy()
  })

  it('labels both date inputs', () => {
    renderPlan()
    expect(screen.getByLabelText(/date you were told your decision/i)).toBeTruthy()
    expect(screen.getByLabelText(/discontinuation letter/i)).toBeTruthy()
  })
})
