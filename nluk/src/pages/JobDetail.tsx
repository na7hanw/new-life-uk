import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { JOB_MAP, JOBS_DATA_DATE, JOB_SOURCE_URL } from '../data/jobs.ts'
import { useTranslatedContent } from '../lib/useTranslation.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import TTSButton from '../components/TTSButton.tsx'

interface JobContent {
  role: string
  desc: string
  [key: string]: unknown
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const job = id ? JOB_MAP[id] : undefined

  useEffect(() => {
    if (!job) navigate('/work/jobs')
  }, [job, navigate])

  const [jc, translating, wasTranslated] = useTranslatedContent<JobContent>(
    job?.content as unknown as Record<string, JobContent> | undefined,
    lang,
    id
  )

  if (!job) return null

  if (!jc?.role) return (
    <article className="detail-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  // Build a plain-text summary for TTS (role + pay + docs)
  const ttsSummary = [
    `Pay: ${job.pay}`,
    job.docs?.length ? `You will need: ${job.docs.join(', ')}` : '',
  ].filter(Boolean).join('. ')

  return (
    <article className="detail-enter">
      <Helmet>
        <title>{jc.role} — New Life UK</title>
        <meta name="description" content={`${jc.role} — ${job.pay}`} />
      </Helmet>
      <div className={`detail-header${translating ? ' translating' : ''}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className="detail-hero">
          <span className="detail-icon">{job.icon}</span>
          <div>
            <h2 className="detail-title">{jc.role}</h2>
            <div className="detail-salary">{job.pay}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              {job.visa && <span className="pill pill-blue">Visa sponsorship</span>}
              {job.tags?.map(t => <span key={t} className="pill pill-light">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {job.applyLinks && job.applyLinks.length > 0 && (
        <QuickLinks links={job.applyLinks} label={`🔗 ${ui.jobsApplyTo || 'Where to apply'}`} />
      )}

      <ShareBar title={jc.role} ui={ui}
        extra={<TTSButton lang={lang} title={jc.role} summary={ttsSummary} steps={[jc.desc || '']} ui={ui} />}
      />

      <div className="section-label">📋 {ui.docsNeeded || "What you'll need"}</div>
      {job.docs && job.docs.length > 0 ? (
        <div className="card" style={{ margin: '0 var(--gutter) 12px' }}>
          <div style={{ padding: '8px 16px' }}>
            {job.docs.map(d => (
              <div key={d} style={{ padding: '6px 0', fontSize: '.9rem', borderBottom: '1px solid var(--border)', color: 'var(--t1)' }}>
                • {d}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ margin: '0 var(--gutter) 12px', padding: '12px 16px', color: 'var(--t3)', fontSize: '.9rem' }}>
          No documents specified — check directly with the employer.
        </div>
      )}

      <div className="section-label">ℹ️ About this role</div>
      <div className={`card${translating ? ' translating' : ''}`} style={{ margin: '0 var(--gutter) 12px' }}>
        <div style={{ padding: '12px 16px', fontSize: '.9rem', lineHeight: 1.7, color: 'var(--t1)' }}>
          {translating && (
            <div className="translating-row">
              <span className="translating-spinner" />
              <span style={{ fontSize: '.85rem', color: 'var(--t3)' }}>{ui.translating || 'Translating…'}</span>
            </div>
          )}
          {jc.desc}
        </div>
      </div>

      {wasTranslated && (
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
          <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>
        </div>
      )}

      <div className="guide-footer">
        <span className="guide-footer-verified">✓ Verified {JOBS_DATA_DATE}</span>
        {id && JOB_SOURCE_URL[id] && (
          <>
            <span aria-hidden="true">·</span>
            <a href={JOB_SOURCE_URL[id]} target="_blank" rel="noopener noreferrer" className="guide-footer-source">
              📄 View Official Source
            </a>
          </>
        )}
      </div>
    </article>
  )
}
