import { useState } from 'react'
import { t18 } from '../lib/utils.js'

function JobCard({ j, lang, ui }) {
  const [open, setOpen] = useState(false)
  const jc = (j.content?.[lang] || j.content?.en || {})
  return (
    <div className={`job-card ${open ? 'job-card--open' : ''}`}>
      <button className="job-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="job-icon">{j.icon}</span>
        <div className="job-info">
          <div className="job-role-row">
            <span className="job-role">{jc.role}</span>
            {j.visa && <span className="pill pill-blue">Sponsorship</span>}
          </div>
          <div className="job-pay">{j.pay}</div>
        </div>
        <span className="job-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {j.tags && (
        <div className="job-tags">
          {j.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
        </div>
      )}

      {open && (
        <div className="job-body">
          <p className="job-desc">{jc.desc}</p>

          {j.docs?.length > 0 && (
            <div className="job-section">
              <div className="job-section-label">📋 {ui.docsNeeded || "What you'll need"}</div>
              <div className="job-docs-row">
                {j.docs.map(d => <span key={d} className="job-doc-chip">{d}</span>)}
              </div>
            </div>
          )}

          <div className="job-section">
            <div className="job-section-label">🔗 {ui.jobsApplyTo || "Where to apply"}</div>
            <div className="job-apply-grid">
              {j.applyLinks?.map(lk => (
                <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer" className="job-apply-chip">
                  {lk.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobCard
