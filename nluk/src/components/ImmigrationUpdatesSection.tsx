/**
 * ImmigrationUpdatesSection
 *
 * Official UK immigration updates feed.
 * Sourced from GOV.UK / UKVI / Home Office only — NOT a general news feed.
 *
 * Props:
 *   compact — shows a minimal summary card (used on GuidesPage home feed)
 *   full    — shows expanded cards with details (default)
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSortedUpdates,
  getHighPriorityUpdates,
  SOURCE_TYPE_LABELS,
  URGENCY_LABELS,
  type ImmigrationUpdate,
} from '../data/immigration-updates.ts'

const INITIAL_SHOWN = 3

// ── Urgency colour map ────────────────────────────────────────────────────────
const URGENCY_BORDER: Record<string, string> = {
  'action-needed': 'var(--rd)',
  'important':     '#f59e0b',
  'info':          'var(--ac)',
}

const URGENCY_BG: Record<string, string> = {
  'action-needed': 'rgba(220,38,38,.06)',
  'important':     'rgba(245,158,11,.06)',
  'info':          'rgba(var(--ac-rgb, 59,130,246),.04)',
}

// ── Compact update row (used on GuidesPage) ───────────────────────────────────
function CompactUpdateRow({ update, onClick }: { update: ImmigrationUpdate; onClick: () => void }) {
  const isAction = update.urgency === 'action-needed'
  return (
    <button
      className="update-row"
      style={{ borderLeftColor: URGENCY_BORDER[update.urgency] ?? 'var(--ac)' }}
      onClick={onClick}
      data-testid="update-row"
      data-urgency={update.urgency}
    >
      <span className="update-row__dot" style={{ background: URGENCY_BORDER[update.urgency] ?? 'var(--ac)' }} aria-hidden="true" />
      <span className="update-row__title">{update.title}</span>
      {isAction && <span className="update-row__badge">Action</span>}
      <span className="update-row__arrow">›</span>
    </button>
  )
}

// ── Full update card (used when expanded) ────────────────────────────────────
function UpdateCard({ update, onGuideClick }: { update: ImmigrationUpdate; onGuideClick: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const urgency = URGENCY_LABELS[update.urgency]

  const pubDate = new Date(update.publishedAt)
  const dateStr = pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const isAction = update.urgency === 'action-needed'

  return (
    <div
      className="update-card"
      style={{
        borderLeftColor: URGENCY_BORDER[update.urgency] ?? 'var(--ac)',
        background: URGENCY_BG[update.urgency] ?? 'transparent',
      }}
      data-testid="update-card"
      data-urgency={update.urgency}
    >
      {/* ── Header row ── */}
      <div className="update-card__header">
        <span
          className="update-card__urgency"
          style={{ color: urgency.color }}
        >
          {isAction ? '🔴' : update.urgency === 'important' ? '🟡' : 'ℹ️'} {urgency.label}
        </span>
        <div className="update-card__meta-right">
          <span className="update-card__source" title={SOURCE_TYPE_LABELS[update.sourceType]}>
            {update.sourceType === 'official'           && '🏛'}
            {update.sourceType === 'official-factsheet' && '📋'}
            {update.sourceType === 'fee-update'         && '💰'}
            {update.sourceType === 'rules-change'       && '📜'}
            {update.sourceType === 'policy'             && '📰'}
          </span>
          <span className="update-card__date">{dateStr}</span>
        </div>
      </div>

      {/* ── Title + what changed ── */}
      <p className="update-card__title">{update.title}</p>
      <p className="update-card__changed">{update.whatChanged}</p>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="update-card__detail">
          <p className="update-card__summary">{update.summary}</p>
          {update.affectedGroups.length > 0 && (
            <p className="update-card__who">
              <strong>Who is affected: </strong>{update.affectedGroups.join(' · ')}
            </p>
          )}
          <div className="update-card__action-box">
            <strong>What you may need to do</strong>
            <p>{update.whatToDo}</p>
          </div>
          {update.relatedGuideIds.length > 0 && (
            <div className="update-card__related">
              <span className="update-card__related-label">Related guides: </span>
              {update.relatedGuideIds.map(id => (
                <button key={id} className="chip chip--small" onClick={() => onGuideClick(id)}>
                  {id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="update-card__footer">
        <button
          className="update-card__toggle"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          {expanded ? '▲ Less' : '▼ Details'}
        </button>
        <a
          href={update.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="update-card__source-link"
          aria-label={`Official source for "${update.title}" (opens in new tab)`}
        >
          Official source ↗
        </a>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
interface Props {
  /** Compact mode: shows a scrollable strip of rows on GuidesPage */
  compact?: boolean
}

export default function ImmigrationUpdatesSection({ compact = false }: Props) {
  const navigate = useNavigate()
  const allUpdates = getSortedUpdates()
  const [showAll, setShowAll] = useState(false)
  const [expandedCompact, setExpandedCompact] = useState(false)

  if (allUpdates.length === 0) {
    return (
      <div className="updates-empty" data-testid="updates-empty">
        <p>Check UKVI for the latest official updates.</p>
        <a
          href="https://www.gov.uk/government/organisations/uk-visas-and-immigration"
          target="_blank"
          rel="noopener noreferrer"
          className="updates-empty__link"
        >
          📄 UKVI official updates ↗
        </a>
      </div>
    )
  }

  // ── Compact mode: slim strip for GuidesPage ──────────────────────────────
  if (compact) {
    const highlights = getHighPriorityUpdates()
    const shown = expandedCompact ? allUpdates : highlights.slice(0, 2)

    return (
      <div className="updates-compact" data-testid="updates-compact">
        <div className="updates-compact__header">
          <span className="updates-compact__label">📢 Official UK Updates</span>
          <span className="updates-compact__badge">GOV.UK only</span>
        </div>
        <div className="updates-compact__list">
          {shown.map(u => (
            <CompactUpdateRow
              key={u.id}
              update={u}
              onClick={() => {
                // Navigate to related guide if available, otherwise open source URL
                const guideId = u.relatedGuideIds[0]
                if (guideId) navigate(`/guide/${guideId}`)
                else window.open(u.sourceUrl, '_blank', 'noopener,noreferrer')
              }}
            />
          ))}
        </div>
        <button
          className="updates-compact__more"
          onClick={() => setExpandedCompact(s => !s)}
        >
          {expandedCompact ? 'Show fewer' : `See all ${allUpdates.length} updates`} →
        </button>
      </div>
    )
  }

  // ── Full mode: rich expandable cards ────────────────────────────────────
  const visibleUpdates = showAll ? allUpdates : allUpdates.slice(0, INITIAL_SHOWN)

  return (
    <div className="updates-section" data-testid="updates-section">
      <div className="updates-disclaimer">
        <span>🏛</span>
        <span>Official updates from GOV.UK, UKVI &amp; Home Office only. Not a news feed.</span>
      </div>
      <div className="updates-list">
        {visibleUpdates.map(update => (
          <UpdateCard
            key={update.id}
            update={update}
            onGuideClick={id => navigate(`/guide/${id}`)}
          />
        ))}
      </div>
      {allUpdates.length > INITIAL_SHOWN && (
        <button
          className="updates-show-more"
          onClick={() => setShowAll(s => !s)}
        >
          {showAll ? '▲ Show fewer' : `▼ All ${allUpdates.length} updates`}
        </button>
      )}
    </div>
  )
}
