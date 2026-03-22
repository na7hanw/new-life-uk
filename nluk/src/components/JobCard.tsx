import { useState, useId, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import styles from './JobCard.module.css'
import type { Job, JobContent, UiStrings } from '../types'

interface JobCardProps {
  j: Job & { id?: string }
  lang: string
  ui: Pick<UiStrings, 'docsNeeded' | 'jobsApplyTo'>
}

const JobCard = memo(function JobCard({ j, lang, ui }: JobCardProps) {
  const [open, setOpen] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const bodyId = useId()
  const navigate = useNavigate()
  const jc = useMemo<Partial<JobContent>>(
    () => (j.content?.[lang] || j.content?.en || {}),
    [j, lang]
  )
  return (
    <div className={`${styles.jobCard} ${open ? styles.jobCardOpen : ''}`}>
      <button className={styles.jobHeader} onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={bodyId}>
        <span className={styles.jobIcon}>{j.icon}</span>
        <div className={styles.jobInfo}>
          <div className={styles.jobRoleRow}>
            <span className={styles.jobRole}>{jc.role}</span>
            {j.visa && <span className="pill pill-blue">Sponsorship</span>}
          </div>
          <div className={styles.jobPay}>{j.pay}</div>
        </div>
        <ChevronDown size={16} strokeWidth={2.5} className={styles.jobChevron} />
      </button>

      <div
        data-state={open ? 'open' : 'closed'}
        className={`${styles.jobBodyWrapper} ${open ? styles.jobBodyWrapperOpen : ''}`}
      >
        <div id={bodyId} className={styles.jobBody}>
          {/* jobBodyInner carries padding — keeps grid child at true zero height when closed */}
          <div className={styles.jobBodyInner}>
          {j.tags && (
            <div className={styles.jobTags}>
              {j.tags.map(t => <span key={t} className={styles.jobTag}>{t}</span>)}
            </div>
          )}

          <p className={`${styles.jobDesc} ${showFullDesc ? styles.jobDescExpanded : ''}`}>{jc.desc}</p>
          {jc.desc && jc.desc.length > 200 && (
            <button className={styles.readMoreBtn} onClick={() => setShowFullDesc(v => !v)}>
              {showFullDesc ? 'Show less ▲' : 'Read more ▼'}
            </button>
          )}

          {j.docs?.length > 0 && (
            <div className={styles.jobSection}>
              <div className={styles.jobSectionLabel}>📋 {ui.docsNeeded || "What you'll need"}</div>
              <div className={styles.jobDocsRow}>
                {j.docs.map(d => <span key={d} className={styles.jobDocChip}>{d}</span>)}
              </div>
            </div>
          )}

          <div className={styles.jobSection}>
            <div className={styles.jobSectionLabel}>🔗 {ui.jobsApplyTo || "Where to apply"}</div>
            <div className={styles.jobApplyGrid}>
              {j.applyLinks?.map(lk => (
                <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer" className={styles.jobApplyChip}>
                  {lk.name} <span aria-hidden="true" style={{ fontSize: '.7em', opacity: .6 }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {j.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <button
                className={styles.jobApplyChip}
                style={{ border: 'none', cursor: 'pointer', background: 'var(--surface2)' }}
                onClick={() => navigate(`/job/${j.id}`)}
                aria-label={`Open full page for ${jc.role}`}
              >
                📄 Full details &amp; share →
              </button>
            </div>
          )}
          </div>{/* end jobBodyInner */}
        </div>
      </div>
    </div>
  )
})

export default JobCard
