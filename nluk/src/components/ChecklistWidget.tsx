import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ls, lsSet } from '../lib/utils.ts'
import type { UiStrings } from '../types'

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
    <div className="card" style={{ margin: '0 16px 12px' }}>
      <button
        style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="checklist-body"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '.95rem', color: 'var(--tx)' }}>
              ✅ {ui.myChecklist || 'My Progress'}
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--t2)', marginTop: 2 }}>
              {doneCount}/{totalCount} complete
            </div>
          </div>
          <span style={{ color: 'var(--t2)', fontSize: '1.1rem' }}>{expanded ? '▲' : '▼'}</span>
        </div>
        <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'var(--bg3)', overflow: 'hidden' }} aria-hidden="true">
          <div
            style={{ height: '100%', borderRadius: 2, background: 'var(--ac)', width: `${(doneCount / totalCount) * 100}%`, transition: 'width .3s' }}
          />
        </div>
      </button>

      {expanded && (
        <div id="checklist-body" style={{ paddingBottom: 8 }}>
          {ui.checklistIntro && (
            <p style={{ fontSize: '.8rem', color: 'var(--t2)', padding: '0 16px 8px', margin: 0 }}>{ui.checklistIntro}</p>
          )}
          {CHECKLIST_ITEMS.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 16px', gap: 10, borderTop: '1px solid var(--bg3)' }}>
              <button
                onClick={() => toggle(item.id)}
                aria-pressed={completed.includes(item.id)}
                aria-label={`${completed.includes(item.id) ? 'Unmark' : 'Mark as done'}: ${item.label}`}
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${completed.includes(item.id) ? 'var(--ac)' : 'var(--bd)'}`,
                  background: completed.includes(item.id) ? 'var(--ac)' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '.75rem', fontWeight: 700,
                }}
              >
                {completed.includes(item.id) ? '✓' : ''}
              </button>
              <span style={{ fontSize: '.88rem', flex: 1, color: 'var(--tx)', textDecoration: completed.includes(item.id) ? 'line-through' : 'none', opacity: completed.includes(item.id) ? 0.6 : 1 }}>
                {item.icon} {item.label}
              </span>
              <button
                onClick={() => navigate(`/guide/${item.guideId}`)}
                aria-label={`Open guide: ${item.label}`}
                style={{ background: 'none', border: 'none', color: 'var(--ac)', cursor: 'pointer', fontSize: '.78rem', fontWeight: 700, padding: '2px 4px', flexShrink: 0 }}
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
