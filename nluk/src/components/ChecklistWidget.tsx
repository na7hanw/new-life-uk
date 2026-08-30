import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ls, lsSet } from '../lib/utils.ts'
import type { UiStrings, UserStatus } from '../types'
import styles from './ChecklistWidget.module.css'

const STORAGE_KEY = 'nluk_checklist'

interface ChecklistItem {
  id: string
  label: string
  guideId: string
  icon: string
  /**
   * Statuses this step is safe and possible for. Omitted means everyone.
   *
   * This exists because the list was shown to everyone, and four of its eight
   * steps are wrong for someone still waiting on an asylum decision — one of
   * them dangerously so. An asylum seeker has no recourse to public funds, so
   * "Apply for Universal Credit" is not merely inapplicable: acting on it means
   * claiming a benefit they are barred from, which is a breach of the
   * conditions attached to their stay. The others are impossible rather than
   * harmful — no eVisa (they hold an ARC), no National Insurance number, and
   * no place on a council housing register, which needs eligible status.
   */
  appliesTo?: readonly UserStatus[]
}

/** Everyone except someone still waiting on an asylum decision. */
const NOT_WHILE_CLAIMING: readonly UserStatus[] = ['refugee', 'other-visa', 'settled', '']

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'evisa',   label: 'Set up eVisa account',              guideId: 'evisa',        icon: '📱', appliesTo: NOT_WHILE_CLAIMING },
  { id: 'bank',    label: 'Open a bank account',               guideId: 'bank',         icon: '🏦' },
  { id: 'gp',      label: 'Register with a GP',                guideId: 'gp',           icon: '🏥' },
  { id: 'ni',      label: 'Apply for National Insurance number', guideId: 'ni',          icon: '🔢', appliesTo: NOT_WHILE_CLAIMING },
  { id: 'uc',      label: 'Apply for Universal Credit',         guideId: 'uc',           icon: '💷', appliesTo: NOT_WHILE_CLAIMING },
  { id: 'housing', label: 'Find housing or join housing list',  guideId: 'housing-help', icon: '🏠', appliesTo: NOT_WHILE_CLAIMING },
  { id: 'legal',   label: 'Get free legal advice if needed',   guideId: 'legal-help',   icon: '⚖️' },
  { id: 'degree',  label: 'Verify overseas degrees (UK ENIC)', guideId: 'uk-enic',      icon: '🎓' },
]

/**
 * The steps to show someone with this status.
 *
 * Filtering alone is not enough, and the note rendered alongside it matters as
 * much as the filter: someone who has been told elsewhere to "just claim
 * Universal Credit" is not protected by the step quietly being absent. They
 * need to be told why it is not there.
 */
export function checklistFor(status: UserStatus): ChecklistItem[] {
  return CHECKLIST_ITEMS.filter(i => !i.appliesTo || i.appliesTo.includes(status))
}

interface ChecklistWidgetProps {
  ui: Pick<UiStrings, 'myChecklist' | 'checklistIntro'>
  /** Defaults to unknown, which shows every step — see checklistFor. */
  status?: UserStatus
}

export default function ChecklistWidget({ ui, status = '' }: ChecklistWidgetProps) {
  const items = checklistFor(status)
  const navigate = useNavigate()
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(ls(STORAGE_KEY, '[]')) } catch { return [] }
  })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    lsSet(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const toggle = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Count against the steps actually shown, so progress cannot read 4/8 when
  // only four steps exist for this person.
  const visibleIds = items.map(i => i.id)
  const doneCount = completed.filter(id => visibleIds.includes(id)).length
  const totalCount = items.length

  // Animate widget body expand/collapse and item appearance
  const [widgetRef] = useAutoAnimate<HTMLDivElement>({ duration: 220 })

  return (
    <div className={`card ${styles.widget}`} ref={widgetRef}>
      <button
        className={styles.toggle}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="checklist-body"
      >
        <div className={styles.toggleInner}>
          <div>
            <div className={styles.heading}>
              ✅ {ui.myChecklist || 'My Progress'}
            </div>
            <div className={styles.progress}>
              {doneCount}/{totalCount} complete
            </div>
          </div>
          <ChevronDown size={16} strokeWidth={2.5} className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} />
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${(doneCount / totalCount) * 100}%` }}
          />
        </div>
      </button>

      {expanded && (
        <div id="checklist-body" className={styles.body}>
          {ui.checklistIntro && (
            <p className={styles.intro}>{ui.checklistIntro}</p>
          )}
          {status === 'asylum-seeker' && (
            <p className={styles.intro}>
              ⚠ While you are waiting for a decision you must not claim Universal
              Credit, and this list does not show it. Your stay carries{' '}
              <strong>no recourse to public funds</strong>, so claiming it would
              breach the conditions attached to your stay. Money and housing
              while you wait come from asylum support instead. Universal Credit
              becomes yours to claim on the day you are granted status — not
              before.
            </p>
          )}
          {items.map(item => (
            <div key={item.id} className={styles.row}>
              <button
                onClick={() => toggle(item.id)}
                aria-pressed={completed.includes(item.id)}
                aria-label={`${completed.includes(item.id) ? 'Unmark' : 'Mark as done'}: ${item.label}`}
                className={`${styles.checkbox} ${completed.includes(item.id) ? styles.checkboxDone : ''}`}
              >
                {completed.includes(item.id) ? '✓' : ''}
              </button>
              <span className={`${styles.label} ${completed.includes(item.id) ? styles.labelDone : ''}`}>
                {item.icon} {item.label}
              </span>
              <button
                onClick={() => navigate(`/guide/${item.guideId}`)}
                aria-label={`Open guide: ${item.label}`}
                className={styles.navBtn}
              >
                →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
