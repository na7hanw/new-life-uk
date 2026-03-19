import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ChevronRight, Bookmark } from 'lucide-react'
import { useApp } from '../context/AppContext.tsx'
import { GUIDE_MAP } from '../data/guides.ts'
import { t18 } from '../lib/utils.ts'
import ChecklistWidget from '../components/ChecklistWidget.tsx'
import type { UserStatus } from '../types'
import styles from './ProfilePage.module.css'

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'asylum-seeker', label: '⏳ Asylum Seeker — waiting for my decision' },
  { value: 'refugee',       label: '✅ Recognised Refugee' },
  { value: 'other-visa',    label: '🛂 Other Visa (Skilled Worker, Family, Student…)' },
  { value: 'settled',       label: '🇬🇧 Settled / Pre-Settled Status' },
]

export default function ProfilePage() {
  const { lang, ui, af, userStatus, setUserStatus, bookmarks, toggleBookmark } = useApp()
  const navigate = useNavigate()
  const [showStatusPicker, setShowStatusPicker] = useState(false)

  const currentStatusLabel = STATUS_OPTIONS.find(o => o.value === userStatus)?.label || '— Not set'

  return (
    <div className="page-enter">

      {/* ── Immigration Status ─────────────────────────────── */}
      <div className="section-label">{ui.statusLabel || 'My Situation'}</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px', overflow: 'visible' }}>
        <button
          className={`list-row ${styles.statusRow}`}
          onClick={() => setShowStatusPicker(s => !s)}
          aria-expanded={showStatusPicker}
        >
          <div className="list-row-content">
            <div className="list-row-title">{currentStatusLabel}</div>
            <div className="list-row-sub">{ui.statusPickerSub || 'Tap to change — helps show the most relevant guides'}</div>
          </div>
          <ChevronRight size={18} strokeWidth={2.5} style={{ color: 'var(--ac3)', flexShrink: 0 }} />
        </button>

        {showStatusPicker && (
          <div className={styles.statusPicker}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`settings-row ${styles.statusOption}`}
                onClick={() => { setUserStatus(userStatus === opt.value ? '' : opt.value); setShowStatusPicker(false) }}
                aria-pressed={userStatus === opt.value}
              >
                <span>{opt.label}</span>
                {userStatus === opt.value && <span className={styles.statusCheck}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Progress Checklist ────────────────────────────── */}
      <ChecklistWidget ui={ui} />

      {/* ── Saved Guides ─────────────────────────────────── */}
      {bookmarks.length > 0 ? (
        <>
          <div className="section-label">{ui.bookmarksTitle || '📌 Saved Guides'}</div>
          <div className="card card-flush" style={{ margin: '0 var(--gutter) 16px' }}>
            {bookmarks.map(id => {
              const g = GUIDE_MAP[id]
              if (!g) return null
              const gc = t18(g.content, lang)
              return (
                <div key={g.id} className="list-row-wrap">
                  <button className="list-row list-row-main"
                    onClick={() => navigate(`/guide/${g.id}`)}
                    aria-label={gc.title}>
                    <span className="list-row-icon">{g.icon}</span>
                    <div className="list-row-content">
                      <div className="list-row-title">{gc.title}</div>
                      <div className="list-row-sub">{gc.summary}</div>
                    </div>
                    <span className="list-row-arrow">{af}</span>
                  </button>
                  <button className="bookmark-btn active"
                    onClick={() => { navigator?.vibrate?.(10); toggleBookmark(g.id) }}
                    aria-label={ui.unbookmark || 'Remove saved'}
                    aria-pressed={true}>
                    <Bookmark size={20} strokeWidth={2} fill="currentColor" />
                  </button>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className={styles.emptyBookmarks}>
          <Bookmark size={28} strokeWidth={1.5} style={{ color: 'var(--t3)' }} />
          <p>{ui.bookmarksSub || 'Your saved guides appear here.'}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Browse Guides {af}
          </button>
        </div>
      )}

      {/* ── Settings link ────────────────────────────────── */}
      <div className="section-label">{ui.settings || 'Settings'}</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
        <button className="list-row" onClick={() => navigate('/settings')}>
          <span className="list-row-icon"><Settings size={20} strokeWidth={2} /></span>
          <div className="list-row-content">
            <div className="list-row-title">{ui.settings || 'Settings'}</div>
            <div className="list-row-sub">{ui.settingsSub || 'Language, theme, privacy'}</div>
          </div>
          <ChevronRight size={18} strokeWidth={2.5} style={{ color: 'var(--ac3)', flexShrink: 0 }} />
        </button>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}
