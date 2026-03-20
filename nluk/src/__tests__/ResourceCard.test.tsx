/**
 * @vitest-environment jsdom
 *
 * Tests for src/components/ResourceCard.tsx
 * Covers: English content rendering, native-language content, link display,
 *         auto-translated badge visibility.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResourceCard from '../components/ResourceCard.tsx'

const UI = {
  openLink: 'Open link',
  autoTranslated: '🌐 Auto-translated',
} as Parameters<typeof ResourceCard>[0]['ui']

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ─── English content ──────────────────────────────────────────────────────────

describe('ResourceCard — English content', () => {
  const content = {
    en: { title: 'Free SIM Card', desc: 'Get a free SIM with 40 GB.' },
  }

  it('renders the English title', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="en" ui={UI} /></MemoryRouter>)
    expect(screen.getByText('Free SIM Card')).not.toBeNull()
  })

  it('renders the English description', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="en" ui={UI} /></MemoryRouter>)
    expect(screen.getByText('Get a free SIM with 40 GB.')).not.toBeNull()
  })

  it('renders the icon', () => {
    const { container } = render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="en" ui={UI} /></MemoryRouter>)
    expect(container.textContent).toContain('📱')
  })

  it('does NOT show the auto-translated badge for English content', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="en" ui={UI} /></MemoryRouter>)
    expect(screen.queryByText('🌐 Auto-translated')).toBeNull()
  })
})

// ─── Native language content (no translation needed) ─────────────────────────

describe('ResourceCard — native language content', () => {
  const content = {
    en: { title: 'Free SIM Card', desc: 'Get a free SIM.' },
    fr: { title: 'Carte SIM gratuite', desc: 'Obtenez une SIM gratuite.' },
  }

  it('renders the native-language title when a translation exists', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="fr" ui={UI} /></MemoryRouter>)
    expect(screen.getByText('Carte SIM gratuite')).not.toBeNull()
  })

  it('renders the native-language description', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="fr" ui={UI} /></MemoryRouter>)
    expect(screen.getByText('Obtenez une SIM gratuite.')).not.toBeNull()
  })

  it('does NOT show the auto-translated badge when a native translation exists', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="fr" ui={UI} /></MemoryRouter>)
    expect(screen.queryByText('🌐 Auto-translated')).toBeNull()
  })
})

// ─── Optional URL link ────────────────────────────────────────────────────────

describe('ResourceCard — link display', () => {
  const content = {
    en: { title: 'Free SIM Card', desc: 'Get a free SIM.' },
  }

  it('renders a link button when url prop is provided', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} url="https://example.com" lang="en" ui={UI} /></MemoryRouter>)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://example.com')
  })

  it('link opens in a new tab', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} url="https://example.com" lang="en" ui={UI} /></MemoryRouter>)
    expect(screen.getByRole('link').getAttribute('target')).toBe('_blank')
  })

  it('does NOT render a link when no url is provided', () => {
    render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="en" ui={UI} /></MemoryRouter>)
    expect(screen.queryByRole('link')).toBeNull()
  })
})

// ─── Auto-translated badge (auto-translation trigger) ─────────────────────────

describe('ResourceCard — auto-translated badge', () => {
  it('shows the auto-translated badge after a translation completes', async () => {
    // Provide content WITHOUT a native French translation so auto-translate triggers.
    // Mock fetch so translateContentObject returns a result immediately.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseStatus: 200,
        responseData: { translatedText: 'Carte SIM gratuite' },
      }),
    }))

    const content = {
      en: { title: 'Free SIM Card', desc: 'Get a free SIM.' },
    }

    await act(async () => {
      render(<MemoryRouter><ResourceCard icon="📱" content={content} lang="fr" ui={UI} /></MemoryRouter>)
    })

    expect(screen.queryByText('🌐 Auto-translated')).not.toBeNull()
    vi.unstubAllGlobals()
  })
})
