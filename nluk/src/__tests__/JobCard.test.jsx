/**
 * @vitest-environment jsdom
 *
 * Tests for JobCard.jsx
 * Covers: rendering, toggle behaviour, ARIA accordion attributes
 * (aria-expanded, aria-controls / id relationship).
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import JobCard from '../components/JobCard.jsx'

const JOB = {
  icon: '🏥',
  pay: '£25,000 – £32,000',
  visa: true,
  tags: ['NHS', 'Full-time'],
  docs: ['Right to Work', 'DBS Check'],
  applyLinks: [
    { name: 'NHS Jobs', url: 'https://www.jobs.nhs.uk/' },
  ],
  content: {
    en: {
      role: 'Healthcare Assistant',
      desc: 'Support nurses and doctors in a clinical setting.',
    },
  },
}

const UI = {
  docsNeeded: "What you'll need",
  jobsApplyTo: 'Where to apply',
}

afterEach(() => { cleanup() })

// ─── Initial (collapsed) state ────────────────────────────────────────────────

describe('JobCard — collapsed', () => {
  it('renders the job role', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    expect(screen.getByText('Healthcare Assistant')).not.toBeNull()
  })

  it('renders the toggle button with aria-expanded="false"', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it('toggle button has an aria-controls attribute', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-controls')).toBeTruthy()
  })

  it('job body is not rendered when collapsed', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    expect(screen.queryByText('Support nurses and doctors in a clinical setting.')).toBeNull()
  })
})

// ─── Expanded state ───────────────────────────────────────────────────────────

describe('JobCard — expanded', () => {
  it('renders job body content after clicking the toggle button', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Support nurses and doctors in a clinical setting.')).not.toBeNull()
  })

  it('sets aria-expanded="true" on the toggle button when open', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true')
  })

  it('job body element has an id that matches the button aria-controls', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    const btn = screen.getByRole('button')
    const controlsId = btn.getAttribute('aria-controls')
    fireEvent.click(btn)
    const body = document.getElementById(controlsId)
    expect(body).not.toBeNull()
  })

  it('renders sponsorship pill when job has visa flag', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    expect(screen.getByText('Sponsorship')).not.toBeNull()
  })

  it('renders the apply link after expanding', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    fireEvent.click(screen.getByRole('button'))
    const link = screen.getByRole('link', { name: 'NHS Jobs' })
    expect(link.getAttribute('href')).toBe('https://www.jobs.nhs.uk/')
  })
})

// ─── Toggle back to collapsed ─────────────────────────────────────────────────

describe('JobCard — collapse after expand', () => {
  it('hides the body again when the button is clicked a second time', () => {
    render(<JobCard j={JOB} lang="en" ui={UI} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(screen.queryByText('Support nurses and doctors in a clinical setting.')).toBeNull()
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })
})

// ─── Multiple cards — unique IDs ─────────────────────────────────────────────

describe('JobCard — unique IDs across multiple instances', () => {
  it('two rendered cards have different aria-controls values', () => {
    const { container } = render(
      <>
        <JobCard j={JOB} lang="en" ui={UI} />
        <JobCard j={JOB} lang="en" ui={UI} />
      </>
    )
    const buttons = container.querySelectorAll('button')
    const id1 = buttons[0].getAttribute('aria-controls')
    const id2 = buttons[1].getAttribute('aria-controls')
    expect(id1).not.toBe(id2)
  })
})
