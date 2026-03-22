/**
 * ImmigrationUpdatesSection
 *
 * Renders the official UK immigration updates feed.
 * Sourced from official GOV.UK / UKVI / Home Office pages only.
 *
 * This is NOT a political news feed. It shows official operational updates:
 * - eVisa / UKVI account changes
 * - ETA and travel document updates
 * - Immigration Rules changes
 * - Fee updates
 * - Service changes that require user action
 *
 * Trust labels: official | official-factsheet | policy | fee-update | rules-change
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSortedUpdates,
  SOURCE_TYPE_LABELS,
  URGENCY_LABELS,
  type ImmigrationUpdate,
} from '../data/immigration-updates.ts'

const INITIAL_SHOWN = 3

function UpdateCard({ update, onGuideClick }: { update: ImmigrationUpdate; onGuideClick: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const urgency = URGENCY_LABELS[update.urgency]
  const isActionNeeded = update.urgency === 'action-needed'

  const pubDate = new Date(update.publishedAt)
  const dateStr = pubDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div
      className={`update-card${isActionNeeded ? ' update-card--action' : ''}`}
      data-testid="update-card"
      data-urgency={update.urgency}
    >
      <div className="update-card__header">
        <div className="update-card__meta">
          <span
            className="update-card__urgency-badge"
            style={{ color: urgency.color }}
            aria-label={`Priority: ${urgency.label}`}
          >
            {isActionNeeded ? '🔴' : update.urgency === 'important' ? '🟡' : 'ℹ️'} {urgency.label}
          </span>
          <span className="update-card__date">{dateStr}</span>
        </div>
        <span
          className="update-card__source-badge"
          title={SOURCE_TYPE_LABELS[update.sourceType]}
        >
          {update.sourceType === 'official'           && '🏛 Official'}
          {update.sourceType === 'official-factsheet' && '📋 Factsheet'}
          {update.sourceType === 'fee-update'         && '💰 Fee update'}
          {update.sourceType === 'rules-change'       && '📜 Rules change'}
          {update.sourceType === 'policy'             && '📰 Policy direction'}
        </span>
      </div>

      <h3 className="update-card__title">{update.title}</h3>
      <p className="update-card__what-changed">{update.whatChanged}</p>

      {expanded && (
        <div className="update-card__detail">
          <p className="update-card__summary">{update.summary}</p>
          {update.affectedGroups.length > 0 && (
            <p className="update-card__affected">
              <strong>Who is affected:</strong>{' '}
              {update.affectedGroups.join(', ')}
            </p>
          )}
          <div className="update-card__action-box">
            <strong>What you may need to do:</strong>
            <p>{update.whatToDo}</p>
          </div>
          {update.relatedGuideIds.length > 0 && (
            <div className="update-card__related">
              <span className="update-card__related-label">Related guides: </span>
              {update.relatedGuideIds.map(id => (
                <button
                  key={id}
                  className="chip chip--small"
                  onClick={() => onGuideClick(id)}
                >
                  {id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="update-card__footer">
        <button
          className="update-card__expand-btn"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          {expanded ? '▲ Less' : '▼ More details'}
        </button>
        <a
          href={update.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="update-card__source-link"
          aria-label={`Open official source for "${update.title}" (opens in new tab)`}
        >
          📄 Official source ↗
        </a>
      </div>
    </div>
  )
}

export default function ImmigrationUpdatesSection() {
  const navigate = useNavigate()
  const allUpdates = getSortedUpdates()
  const [showAll, setShowAll] = useState(false)

  const visibleUpdates = showAll ? allUpdates : allUpdates.slice(0, INITIAL_SHOWN)

  if (allUpdates.length === 0) {
    return (
      <div className="updates-empty" data-testid="updates-empty">
        <p>Unable to load updates right now.</p>
        <a
          href="https://www.gov.uk/government/organisations/uk-visas-and-immigration"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          📄 Check UKVI official updates ↗
        </a>
      </div>
    )
  }

  return (
    <div className="updates-section" data-testid="updates-section">
      <div className="updates-disclaimer">
        <span className="updates-disclaimer__icon">🏛</span>
        <span className="updates-disclaimer__text">
          Official updates from GOV.UK, UKVI, and Home Office only.
          Not a general news feed.
        </span>
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
          {showAll
            ? `▲ Show fewer updates`
            : `▼ Show all ${allUpdates.length} updates`}
        </button>
      )}
    </div>
  )
}
