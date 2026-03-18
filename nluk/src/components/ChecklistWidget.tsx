import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { ls, lsSet } from '../lib/utils.ts'
import type { UiStrings } from '../types'
import styles from './ChecklistWidget.module.css'

const STORAGE_KEY = 'nluk_checklist'

interface ChecklistItem {
  id: string
  label: string
  guideId: string
  icon: string
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'evisa',   label: 'Set up eVisa account',              guideId: 'evisa',        icon: '📱' },
  { id: 'bank',    label: 'Open a bank account',               guideId: 'bank',         icon: '🏦' },
  { id: 'gp',      label: 'Register with a GP',                guideId: 'gp',           icon: '🏥' },
  { id: 'ni',      label: 'Apply for National Insurance number', guideId: 'ni',          icon: '🔢' },
  { id: 'uc',      label: 'Apply for Universal Credit',         guideId: 'uc',           icon: '💷' },
  { id: 'housing', label: 'Find housing or join housing list',  guideId: 'housing-help', icon: '🏠' },
  { id: 'legal',   label: 'Get free legal advice if needed',   guideId: 'legal-help',   icon: '⚖️' },
]

interface ChecklistWidgetProps {
  ui: Pick<UiStrings, 'myChecklist' | 'checklistIntro'>
}

export default function ChecklistWidget({ ui }: ChecklistWidgetProps) {
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

  const doneCount = completed.length
  const totalCount = CHECKLIST_ITEMS.length

  return (
    <div className={`card ${styles.widget}`}>
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
          {CHECKLIST_ITEMS.map(item => (
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
