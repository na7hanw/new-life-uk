import { useState, useId, useMemo, memo } from 'react'
import styles from './JobCard.module.css'
import type { Job, JobContent, UiStrings } from '../types'

interface JobCardProps {
  j: Job
  lang: string
  ui: Pick<UiStrings, 'docsNeeded' | 'jobsApplyTo'>
}

const JobCard = memo(function JobCard({ j, lang, ui }: JobCardProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()
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
        <span className={styles.jobChevron}>{open ? '▲' : '▼'}</span>
      </button>

      {j.tags && (
        <div className={styles.jobTags}>
          {j.tags.map(t => <span key={t} className={styles.jobTag}>{t}</span>)}
        </div>
      )}

      <div
        data-state={open ? 'open' : 'closed'}
        className={`${styles.jobBodyWrapper} ${open ? styles.jobBodyWrapperOpen : ''}`}
      >
        <div id={bodyId} className={styles.jobBody}>
          <p className={styles.jobDesc}>{jc.desc}</p>

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
        </div>
      </div>
    </div>
  )
})

export default JobCard
