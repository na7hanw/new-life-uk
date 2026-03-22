import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ChevronRight, Bookmark } from 'lucide-react'
import { differenceInDays, addDays, format, parseISO, isValid } from 'date-fns'
import clsx from 'clsx'
import { useApp } from '../context/AppContext.tsx'
import { GUIDE_MAP } from '../data/guides.ts'
import { t18 } from '../lib/utils.ts'
import ChecklistWidget from '../components/ChecklistWidget.tsx'
import PostcodeLookup from '../components/PostcodeLookup.tsx'
import type { UserStatus } from '../types'
import styles from './ProfilePage.module.css'

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'asylum-seeker', label: '⏳ Asylum Seeker — waiting for my decision' },
  { value: 'refugee',       label: '✅ Recognised Refugee' },
  { value: 'other-visa',    label: '🛂 Other Visa (Skilled Worker, Family, Student…)' },
  { value: 'settled',       label: '🇬🇧 Settled / Pre-Settled Status' },
]

const STATUS_NEXT_STEPS: Partial<Record<UserStatus, { icon: string; text: string; path: string }[]>> = {
  'asylum-seeker': [
    { icon: '📋', text: 'Understand your rights while waiting', path: '/guide/asylum-waiting' },
    { icon: '💳', text: 'Maximise your ASPEN card support', path: '/guide/aspen-card' },
    { icon: '🏥', text: 'Register with a GP — you have the right immediately', path: '/guide/gp' },
    { icon: '🧠', text: 'Access free mental health support', path: '/guide/mental' },
  ],
  'refugee': [
    { icon: '⏰', text: 'You have 56 days — start the move-on process now', path: '/guide/move-on' },
    { icon: '🏦', text: 'Open a bank account (Monzo — no credit check)', path: '/guide/bank' },
    { icon: '💷', text: 'Claim Universal Credit today', path: '/guide/uc' },
    { icon: '📊', text: 'Start building your UK credit score', path: '/guide/credit-score' },
    { icon: '🏘', text: 'Understand the real council housing process', path: '/guide/social-housing' },
  ],
  'other-visa': [
    { icon: '📱', text: 'Set up your eVisa digital status', path: '/guide/evisa' },
    { icon: '🔗', text: 'Generate a share code for work or renting', path: '/guide/sharecode' },
    { icon: '💼', text: 'Know your employment rights', path: '/guide/employment-rights' },
    { icon: '📊', text: 'Start building your UK credit score', path: '/guide/credit-score' },
  ],
  'settled': [
    { icon: '🏅', text: 'Check your path to Indefinite Leave to Remain', path: '/guide/ilr' },
    { icon: '📊', text: 'Build your UK credit score for mortgages', path: '/guide/credit-score' },
    { icon: '💰', text: 'Start investing tax-free with a Stocks & Shares ISA', path: '/guide/investing' },
    { icon: '📜', text: 'UK rules every settled resident must know', path: '/guide/uk-rules' },
  ],
}

function MoveOnCountdown({ statusDate, setStatusDate }: { statusDate: string; setStatusDate: (d: string) => void }) {
  const grantedDate = statusDate ? parseISO(statusDate) : null
  const isDateValid = grantedDate !== null && isValid(grantedDate)

  let daysLeft = 0
  let deadline: Date | null = null
  if (isDateValid && grantedDate) {
    deadline = addDays(grantedDate, 56)
    daysLeft = differenceInDays(deadline, new Date())
  }

  const isPast   = isDateValid && daysLeft < 0
  const isUrgent = isDateValid && !isPast && daysLeft <= 14

  return (
    <div className={clsx(styles.deadlineBanner, isUrgent && styles.deadlineBannerUrgent, isPast && styles.deadlineBannerPast)}>
      <div className={styles.deadlineTop}>
        <span className={styles.deadlineEmoji}>{isPast ? '⚠️' : '⏰'}</span>
        <div>
          {isDateValid ? (
            <>
              <div className={styles.deadlineDays}>
                {isPast
                  ? `${Math.abs(daysLeft)} days past deadline`
                  : `${daysLeft} days left`}
              </div>
              <div className={styles.deadlineSub}>
                {isPast
                  ? 'Your 56-day move-on period has ended — contact your council immediately'
                  : daysLeft === 0
                    ? 'Your move-on deadline is today — act now'
                    : 'to claim Universal Credit and secure housing'}
              </div>
            </>
          ) : (
            <>
              <div className={styles.deadlineDays}>56-day move-on</div>
              <div className={styles.deadlineSub}>Enter your status grant date to see your deadline</div>
            </>
          )}
        </div>
      </div>

      {isDateValid && deadline && (
        <div className={styles.deadlineDate}>
          Deadline: <strong>{format(deadline, 'd MMMM yyyy')}</strong>
          {' · '}Status granted: {format(grantedDate!, 'd MMMM yyyy')}
        </div>
      )}

      <div className={styles.deadlineDateInput}>
        <label htmlFor="status-date-input">Status granted:</label>
        <input
          id="status-date-input"
          type="date"
          value={statusDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={e => setStatusDate(e.target.value)}
          aria-label="Date refugee status was granted"
        />
        {statusDate && (
          <button className={styles.deadlineClearBtn} onClick={() => setStatusDate('')} aria-label="Clear date">✕</button>
        )}
      </div>
    </div>
  )
}

const AMBITION_OPTIONS: { value: NonNullable<import('../types').UserAmbition>; emoji: string; label: string }[] = [
  { value: 'work',      emoji: '💼', label: 'Get a Job' },
  { value: 'study',     emoji: '📚', label: 'Study / Qualifications' },
  { value: 'business',  emoji: '🚀', label: 'Start a Business' },
  { value: 'volunteer', emoji: '🤝', label: 'Volunteer / Community' },
]

const SECTOR_OPTIONS: { value: NonNullable<import('../types').UserSector>; emoji: string; label: string }[] = [
  { value: 'healthcare',   emoji: '🏥', label: 'Healthcare & NHS' },
  { value: 'it',           emoji: '💻', label: 'IT & Technology' },
  { value: 'construction', emoji: '🔨', label: 'Construction & Trades' },
  { value: 'care',         emoji: '❤️',  label: 'Care & Social Work' },
  { value: 'hospitality',  emoji: '🍽️',  label: 'Hospitality & Food' },
  { value: 'retail',       emoji: '🛒', label: 'Retail & Customer Service' },
  { value: 'education',    emoji: '🎓', label: 'Education & Childcare' },
  { value: 'admin',        emoji: '📋', label: 'Admin & Office' },
]

const DOCUMENT_OPTIONS: { id: string; emoji: string; label: string }[] = [
  { id: 'brp',       emoji: '💳', label: 'BRP (Biometric Residence Permit)' },
  { id: 'evisa',     emoji: '📱', label: 'eVisa (UK digital status)' },
  { id: 'passport',  emoji: '📘', label: 'UK or Foreign Passport' },
  { id: 'eea-id',    emoji: '🇪🇺', label: 'EEA ID Card (EU Settlement)' },
  { id: 'travel-doc',emoji: '📄', label: 'Convention Travel Document' },
  { id: 'ho-letter', emoji: '📬', label: 'Home Office Letter / ARC' },
]

export default function ProfilePage() {
  const { lang, ui, af, userStatus, setUserStatus, statusDate, setStatusDate, userAmbition, setUserAmbition, userSector, setUserSector, documentsHeld, toggleDocument, userPostcode, setUserPostcode, bookmarks, toggleBookmark } = useApp()
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

      {/* ── My Goals (ambition) ──────────────────────────── */}
      <div className="section-label">{ui.profileAmbitionLabel || '🎯 My Goals'}</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
        <div className={styles.chipGrid}>
          {AMBITION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.chip}${userAmbition === opt.value ? ` ${styles.chipActive}` : ''}`}
              onClick={() => setUserAmbition(userAmbition === opt.value ? '' : opt.value)}
              aria-pressed={userAmbition === opt.value}
            >
              <span aria-hidden="true">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sector Interest ───────────────────────────────── */}
      {(userAmbition === 'work' || userAmbition === 'business' || !userAmbition) && (
        <>
          <div className="section-label">{ui.profileSectorLabel || '🏢 Sector Interest'}</div>
          <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
            <div className={styles.chipGrid}>
              {SECTOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.chip}${userSector === opt.value ? ` ${styles.chipActive}` : ''}`}
                  onClick={() => setUserSector(userSector === opt.value ? '' : opt.value)}
                  aria-pressed={userSector === opt.value}
                >
                  <span aria-hidden="true">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── My Documents ─────────────────────────────────── */}
      <div className="section-label">{ui.profileDocsLabel || '📂 Documents I Have'}</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
        <div className={styles.chipGrid}>
          {DOCUMENT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`${styles.chip}${documentsHeld.includes(opt.id) ? ` ${styles.chipActive}` : ''}`}
              onClick={() => { navigator?.vibrate?.(5); toggleDocument(opt.id) }}
              aria-pressed={documentsHeld.includes(opt.id)}
            >
              <span aria-hidden="true">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── My Area (postcode → NHS area, council) ────────── */}
      <div className="section-label">{ui.profileAreaLabel as string || '📍 My Area'}</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
        <PostcodeLookup savedPostcode={userPostcode} onSave={setUserPostcode} ui={ui} />
      </div>

      {/* ── Next Steps ───────────────────────────────────── */}
      {userStatus && STATUS_NEXT_STEPS[userStatus] && (
        <>
          <div className="section-label">{ui.nextSteps || '⚡ Next Steps'}</div>
          <div className="card card-flush" style={{ margin: '0 var(--gutter) 16px' }}>
            {STATUS_NEXT_STEPS[userStatus]!.map(step => (
              <button key={step.path} className="list-row" onClick={() => navigate(step.path)}>
                <span className="list-row-icon" style={{ fontSize: '1.1rem' }}>{step.icon}</span>
                <div className="list-row-content">
                  <div className="list-row-title" style={{ fontSize: '0.9rem' }}>{step.text}</div>
                </div>
                <span className="list-row-arrow">{af}</span>
              </button>
            ))}
          </div>
        </>
      )}

{/* ── 56-day move-on countdown (refugees only) ─────── */}
      {userStatus === 'refugee' && (
        <MoveOnCountdown statusDate={statusDate} setStatusDate={setStatusDate} />
      )}

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

      {/* ── Document Scanner quick-access ────────────────── */}
      <div className="section-label">🔧 Tools</div>
      <div className="card" style={{ margin: '0 var(--gutter) 16px' }}>
        <button className="list-row" onClick={() => navigate('/scan')}>
          <span className="list-row-icon">📷</span>
          <div className="list-row-content">
            <div className="list-row-title">Scan a Document</div>
            <div className="list-row-sub">Photograph a letter or form to read and translate it</div>
          </div>
          <ChevronRight size={18} strokeWidth={2.5} style={{ color: 'var(--ac3)', flexShrink: 0 }} />
        </button>
      </div>

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
