/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/StepText.tsx
 * Covers: plain text, bare URL linkification, markdown-style links,
 * HTML sanitization (XSS), trailing punctuation trimming, non-https blocking.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import StepText from '../components/StepText.tsx'

afterEach(() => { cleanup() })

// ─── Plain text ───────────────────────────────────────────────────────────────

describe('StepText — plain text', () => {
  it('renders plain text with no links', () => {
    const { container } = render(<StepText text="Register with a GP." />)
    expect(container.textContent).toBe('Register with a GP.')
    expect(container.querySelectorAll('a').length).toBe(0)
  })

  it('does not linkify relative paths', () => {
    const { container } = render(<StepText text="Go to /guide/bank for details." />)
    expect(container.querySelectorAll('a').length).toBe(0)
  })
})

// ─── Bare URL linkification ───────────────────────────────────────────────────

describe('StepText — bare https URL', () => {
  it('converts a bare https URL to a link', () => {
    render(<StepText text="Visit https://www.gov.uk for info." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://www.gov.uk')
  })

  it('link text omits the https:// scheme prefix', () => {
    render(<StepText text="Visit https://www.gov.uk for info." />)
    const link = screen.getByRole('link')
    expect(link.textContent).toBe('www.gov.uk')
  })

  it('link has target="_blank" and rel="noopener noreferrer"', () => {
    render(<StepText text="See https://example.com now." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('trims a trailing period from a bare URL', () => {
    render(<StepText text="See https://example.com." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://example.com')
  })

  it('trims trailing closing parenthesis from a bare URL', () => {
    render(<StepText text="See https://example.com)" />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://example.com')
  })
})

// ─── Markdown-style links ─────────────────────────────────────────────────────

describe('StepText — markdown [label](url) links', () => {
  it('converts [label](url) syntax to an anchor with the label as text', () => {
    render(<StepText text="Use [GOV.UK](https://www.gov.uk) to apply." />)
    const link = screen.getByRole('link', { name: 'GOV.UK' })
    expect(link).not.toBeNull()
  })

  it('uses the href from the markdown URL', () => {
    render(<StepText text="Use [GOV.UK](https://www.gov.uk) to apply." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://www.gov.uk')
  })

  it('markdown link has target="_blank" and rel="noopener noreferrer"', () => {
    render(<StepText text="See [NHS](https://www.nhs.uk)." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })
})

// ─── HTML sanitization (XSS) ─────────────────────────────────────────────────

describe('StepText — XSS / HTML sanitization', () => {
  it('strips HTML tags from the text', () => {
    const { container } = render(<StepText text="<script>alert(1)</script>Safe text" />)
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toContain('Safe text')
  })

  it('does not render raw img tags injected in text', () => {
    const { container } = render(<StepText text='<img src=x onerror="alert(1)"> Hello' />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('Hello')
  })
})

// ─── Non-https URL blocking ───────────────────────────────────────────────────

describe('StepText — non-https URL safety', () => {
  it('linkifies http:// URLs (allowed scheme)', () => {
    render(<StepText text="Visit http://example.com now." />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('http://example.com')
  })
})
