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
    // "GP" is a glossary term — it renders as a button with a dotted underline
    // and a "·" indicator; the surrounding text is still plain.
    const { container } = render(<StepText text="Register with a GP." />)
    // Check all the words are present (ignoring the glossary "·" indicator)
    expect(container.textContent).toContain('Register with a')
    expect(container.textContent).toContain('GP')
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

describe('sanitisation is the last step', () => {
  // Regression: applyUrgencyTags used to run AFTER DOMPurify, so a string
  // replace built HTML on top of sanitized output. That is a broken sanitizer
  // barrier, and it corrupted attributes in practice.
  it('does not inject markup into a URL containing an upper-case bracket segment', () => {
    const { container } = render(
      <StepText text="See https://example.com/docs/[ABC]/x for details" />
    )
    const a = container.querySelector('a')
    expect(a).not.toBeNull()
    // marked percent-encodes the brackets (%5B/%5D), which is fine — what
    // matters is that the href is a single intact URL with no markup in it.
    const href = a!.getAttribute('href')!
    expect(decodeURIComponent(href)).toBe('https://example.com/docs/[ABC]/x')
    expect(href).not.toContain('<')
    // The bug produced a <span> nested inside the href attribute value.
    expect(container.innerHTML).not.toContain('href="https://example.com/docs/<span')
  })

  it('still renders a standalone urgency tag', () => {
    const { container } = render(<StepText text="[DAY 1] Claim Universal Credit" />)
    const span = container.querySelector('span.urgency-tag')
    expect(span).not.toBeNull()
    expect(span!.textContent).toBe('DAY 1')
    expect(span!.className).toContain('urgency-urgent')
  })

  it('marks a non-urgent tag without the urgent class', () => {
    const { container } = render(<StepText text="[ACTION] Read this" />)
    const span = container.querySelector('span.urgency-tag')
    expect(span).not.toBeNull()
    expect(span!.className).not.toContain('urgency-urgent')
  })

  it('strips injected markup that sits beside an urgency tag', () => {
    const { container } = render(
      <StepText text={'[URGENT] <img src=x onerror=alert(1)> <script>alert(2)</script>'} />
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('script')).toBeNull()
    expect(container.innerHTML).not.toContain('onerror')
    // and the legitimate tag survives
    expect(container.querySelector('span.urgency-tag')).not.toBeNull()
  })

  it('leaves a bracketed token that is not a standalone word alone', () => {
    const { container } = render(<StepText text="file[ABC]name" />)
    expect(container.querySelector('span.urgency-tag')).toBeNull()
    expect(container.textContent).toContain('file[ABC]name')
  })
})
