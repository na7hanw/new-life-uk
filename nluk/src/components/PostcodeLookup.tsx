/**
 * PostcodeLookup
 *
 * Lets the user enter their UK postcode to discover their NHS area (for GP
 * registration), local council (for benefits/housing), and region.
 *
 * Uses postcodes.ts (free Postcodes.io API — no key required).
 * The looked-up postcode is saved to the parent via onSave so it persists
 * across sessions and powers contextual guide recommendations.
 */
import { useState, type KeyboardEvent } from 'react'
import {
  lookupPostcode,
  normalisePostcode,
  looksLikePostcode,
  describeArea,
  getNHSArea,
  PostcodesNetworkError,
  type PostcodeResult,
} from '../lib/postcodes.ts'
import type { UiStrings } from '../types'
import styles from './PostcodeLookup.module.css'

interface Props {
  /** Currently saved postcode (from localStorage via AppContext) */
  savedPostcode: string
  /** Called when user looks up and confirms a postcode */
  onSave: (postcode: string) => void
  ui: UiStrings
}

export default function PostcodeLookup({ savedPostcode, onSave, ui }: Props) {
  const [input, setInput] = useState(savedPostcode || '')
  const [result, setResult] = useState<PostcodeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(!!savedPostcode)

  const handleLookup = async () => {
    const raw = input.trim()
    if (!raw) return
    if (!looksLikePostcode(raw)) {
      setError('That doesn\'t look like a valid UK postcode. Try again (e.g. SW1A 1AA).')
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setConfirmed(false)

    try {
      const data = await lookupPostcode(raw)
      setLoading(false)
      if (!data) {
        setError('Postcode not found. Check the spelling and try again.')
        return
      }
      setResult(data)
    } catch (err) {
      setLoading(false)
      if (err instanceof PostcodesNetworkError) {
        setError('Could not connect to postcodes.io. Check your internet connection and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  const handleConfirm = () => {
    if (!result) return
    const normalised = normalisePostcode(result.postcode)
    setInput(normalised)
    setConfirmed(true)
    onSave(normalised)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
    setError(null)
    setConfirmed(false)
    onSave('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLookup()
  }

  return (
    <div className={styles.wrap}>
      {/* ── Input row ───────────────────────────────────────── */}
      <div className={styles.inputRow}>
        <input
          className={`${styles.input}${confirmed ? ` ${styles.inputConfirmed}` : ''}`}
          type="text"
          placeholder={ui.postcodeInputPlaceholder as string || 'Your postcode (e.g. SW1A 1AA)'}
          value={input}
          onChange={e => { setInput(e.target.value.toUpperCase()); setConfirmed(false); setResult(null); setError(null) }}
          onKeyDown={handleKeyDown}
          maxLength={8}
          aria-label="Enter your UK postcode"
          autoComplete="postal-code"
        />
        <button
          className={styles.lookupBtn}
          onClick={handleLookup}
          disabled={loading || input.trim().length < 5}
        >
          {loading ? '…' : 'Find'}
        </button>
        {savedPostcode && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear postcode">✕</button>
        )}
      </div>

      {/* ── Error ───────────────────────────────────────────── */}
      {error && <p className={styles.error}>{error}</p>}

      {/* ── Result ──────────────────────────────────────────── */}
      {result && !confirmed && (
        <div className={styles.resultCard}>
          <div className={styles.resultPostcode}>{normalisePostcode(result.postcode)}</div>
          <div className={styles.resultDetails}>
            <ResultRow emoji="📍" label="Area" value={describeArea(result)} />
            {getNHSArea(result) && (
              <ResultRow emoji="🏥" label="NHS Area" value={getNHSArea(result)!} />
            )}
            {result.parliamentary_constituency && (
              <ResultRow emoji="🏛️" label="Constituency" value={result.parliamentary_constituency} />
            )}
          </div>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            ✓ Save this area
          </button>
        </div>
      )}

      {/* ── Confirmed state ─────────────────────────────────── */}
      {confirmed && savedPostcode && (
        <div className={styles.confirmedRow}>
          <span className={styles.confirmedCheck}>✓</span>
          <span className={styles.confirmedText}>
            {savedPostcode}
            {result?.ccg ? ` · ${result.ccg}` : result?.region ? ` · ${result.region}` : ''}
          </span>
        </div>
      )}

      <p className={styles.privacyNote}>
        💾 Saved only on this device. Never sent to any server other than postcodes.io.
      </p>
    </div>
  )
}

function ResultRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  if (!value) return null
  return (
    <div className={styles.resultRow}>
      <span aria-hidden="true">{emoji}</span>
      <span className={styles.resultLabel}>{label}:</span>
      <span className={styles.resultValue}>{value}</span>
    </div>
  )
}
