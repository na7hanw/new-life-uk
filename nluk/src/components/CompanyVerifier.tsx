/**
 * CompanyVerifier
 *
 * Anti-scam tool: lets users search the free UK Companies House register
 * to check whether a potential employer or business partner is real and active.
 *
 * Uses the companiesHouse.ts lib (free public API, no API key required for basic
 * searches — key only needed to lift rate limits).
 */
import { useState, useRef, type KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { searchCompanies, describeCompanyStatus, formatCHAddress, CH_KEY_AVAILABLE, CH_PUBLIC_SEARCH_URL } from '../lib/companiesHouse.ts'
import type { CHSearchResult } from '../lib/companiesHouse.ts'
import type { UiStrings } from '../types'
import styles from './CompanyVerifier.module.css'

interface Props {
  ui: UiStrings
  dir?: string
}

export default function CompanyVerifier({ ui, dir = 'ltr' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CHSearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleSearch = async () => {
    const q = query.trim()
    if (q.length < 2) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const items = await searchCompanies(q, 8, abortRef.current.signal)
      setResults(items)
    } catch (err) {
      if (err instanceof Error && err.message === 'CH_AUTH_REQUIRED') {
        setError('__AUTH__')
      } else if (err instanceof DOMException && err.name === 'AbortError') {
        // request cancelled — ignore
      } else {
        setError('Could not reach Companies House. Check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={styles.wrap}>
      {/* ── No-key fallback ──────────────────────────────────────── */}
      {!CH_KEY_AVAILABLE && (
        <div className={styles.tip} style={{ background: 'color-mix(in srgb, #f59e0b 8%, var(--bg2))', borderLeft: '3px solid #f59e0b' }}>
          <span className={styles.tipIcon}>🔍</span>
          <p className={styles.tipText}>
            <strong>In-app search requires a Companies House API key.</strong>{' '}
            You can still search the official register directly — it&rsquo;s free and instant:
          </p>
          <a
            href={`${CH_PUBLIC_SEARCH_URL}/search?q=`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 6, fontWeight: 600, color: 'var(--ac3)', fontSize: '0.88rem' }}
          >
            Search Companies House website →
          </a>
        </div>
      )}

      {/* ── 401 auth error fallback ───────────────────────────────── */}
      {error === '__AUTH__' && (
        <div className={styles.tip} style={{ background: 'color-mix(in srgb, #f59e0b 8%, var(--bg2))', borderLeft: '3px solid #f59e0b' }}>
          <span className={styles.tipIcon}>🔑</span>
          <p className={styles.tipText}>
            API authentication failed. Search the official register instead:
          </p>
          <a
            href={`${CH_PUBLIC_SEARCH_URL}/search?q=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 6, fontWeight: 600, color: 'var(--ac3)', fontSize: '0.88rem' }}
          >
            Search &ldquo;{query}&rdquo; on Companies House →
          </a>
        </div>
      )}

      {/* ── Anti-scam tip ─────────────────────────────────────── */}
      <div className={styles.tip}>
        <span className={styles.tipIcon}>🛡️</span>
        <p className={styles.tipText}>
          <strong>Protect yourself from job scams.</strong> Before accepting any job offer or
          paying any fees, search the official UK Companies House register to confirm the
          employer is a real, registered business.
        </p>
      </div>

      {/* ── Search bar ────────────────────────────────────────── */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search size={17} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            type="search"
            placeholder={ui.chSearchPlaceholder as string || 'Search company name…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            dir={dir}
            aria-label="Company name to verify"
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => { setQuery(''); setResults(null); setError(null) }}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>
        <button
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
        >
          {loading ? '…' : 'Verify'}
        </button>
      </div>

      {/* ── Loading ────────────────────────────────────────────── */}
      {loading && (
        <div className={styles.loadingRow}>
          <span className="translating-spinner" />
          <span>Searching Companies House…</span>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && error !== '__AUTH__' && (
        <div className={styles.errorBox}>{error}</div>
      )}

      {/* ── No results ────────────────────────────────────────── */}
      {results !== null && results.length === 0 && (
        <div className={styles.noResults}>
          <span>No companies found for &ldquo;{query}&rdquo;.</span>
          <p className={styles.noResultsSub}>
            This may mean the company is not registered in the UK — a red flag for job offers.
          </p>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────── */}
      {results && results.length > 0 && (
        <div className={styles.resultsList}>
          {results.map(c => {
            const isActive = c.company_status === 'active'
            return (
              <div key={c.company_number} className={`${styles.resultCard} ${isActive ? styles.resultCardActive : styles.resultCardInactive}`}>
                <div className={styles.resultHeader}>
                  <div>
                    <div className={styles.resultName}>{c.company_name}</div>
                    <div className={styles.resultNumber}>#{c.company_number}</div>
                  </div>
                  <span className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}>
                    {isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>

                <div className={styles.resultMeta}>
                  <span>{describeCompanyStatus(c.company_status)}</span>
                  {c.date_of_creation && (
                    <span>Registered {c.date_of_creation}</span>
                  )}
                </div>

                {c.address && formatCHAddress(c.address) && (
                  <div className={styles.resultAddress}>
                    📍 {formatCHAddress(c.address)}
                  </div>
                )}

                <a
                  href={`https://find-and-update.company-information.service.gov.uk/company/${c.company_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resultLink}
                >
                  View on Companies House →
                </a>
              </div>
            )
          })}
        </div>
      )}

      {/* ── How to use ────────────────────────────────────────── */}
      <div className={styles.howToUse}>
        <div className={styles.howToTitle}>🔍 What to check</div>
        <ul className={styles.howToList}>
          <li><strong>Status &ldquo;Active&rdquo;</strong> — the company is currently registered. &ldquo;Dissolved&rdquo; or &ldquo;Liquidation&rdquo; is a major red flag.</li>
          <li><strong>Age</strong> — a company registered just weeks ago offering a skilled job is suspicious.</li>
          <li><strong>Address</strong> — does the registered address match where they say they operate?</li>
          <li><strong>Name match</strong> — scammers often use names very similar to real companies. Check the spelling carefully.</li>
        </ul>
      </div>
    </div>
  )
}
