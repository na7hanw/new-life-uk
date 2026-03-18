import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { CERT_MAP, JOBS_DATA_DATE, CERT_SOURCE_URL } from '../data/jobs.ts'
import { useTranslatedContent, useTranslatedSteps } from '../lib/useTranslation.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'
import TTSButton from '../components/TTSButton.tsx'

interface CertContent {
  title: string
  sector?: string
  [key: string]: unknown
}

export default function CertDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const cert = id ? CERT_MAP[id] : undefined

  useEffect(() => {
    if (!cert) navigate('/work/certs')
  }, [cert, navigate])

  const [cc, translating, wasTranslated] = useTranslatedContent<CertContent>(
    cert?.content as Record<string, CertContent> | undefined,
    lang,
    id
  )
  const st = useTranslatedSteps(
    cert?.steps as Record<string, string[]> | undefined,
    lang,
    id
  )

  if (!cert) return null

  if (!cc?.title) return (
    <article className="detail-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  return (
    <article className="detail-enter">
      <Helmet>
        <title>{cc.title} — New Life UK</title>
        <meta name="description" content={cc.sector || cc.title} />
      </Helmet>
      <div className={`detail-header${translating ? ' translating' : ''}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className="detail-hero">
          <span className="detail-icon">{cert.icon}</span>
          <div>
            <h2 className="detail-title">{cc.title}</h2>
            <p className="detail-summary">{cc.sector}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              <span className="pill pill-light">{cert.time}</span>
              <span className="pill pill-light">{cert.cost}</span>
            </div>
          </div>
        </div>
      </div>

      {cert.links?.length > 0 && (
        <QuickLinks links={cert.links} label={`🔗 ${ui.applyLinks || 'Apply / Sign Up'}`} />
      )}
      {cert.studyLinks?.length > 0 && (
        <QuickLinks links={cert.studyLinks} label={`📚 ${ui.studyLinks || 'Study Resources'}`} />
      )}

      <ShareBar title={cc.title} ui={ui} />

      <div className="section-label">{ui.freeRoute}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '12px 16px', fontSize: '.95rem', color: 'var(--gn)', lineHeight: 1.65, fontWeight: 600 }}>
          ✅ {cert.freeRoute}
        </div>
      </div>

      <TTSButton lang={lang} title={cc.title} summary={cc.sector || ''} steps={st} ui={ui} />

      <div className="section-label">{ui.steps}</div>
      <div className={`card${translating ? ' translating' : ''}`} style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '6px 16px' }}>
          {translating && (
            <div className="translating-row">
              <span className="translating-spinner" />
              <span style={{ fontSize: '.85rem', color: 'var(--t3)' }}>{ui.translating || 'Translating…'}</span>
            </div>
          )}
          {st.map((s, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{i + 1}</div>
              {s.startsWith('⚠') ? <div className="step-warn"><StepText text={s} /></div> : <div className="step-text"><StepText text={s} /></div>}
            </div>
          ))}
        </div>
      </div>

      {wasTranslated && (
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
          <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>
        </div>
      )}

      <div className="guide-updated">
        ✓ Verified {JOBS_DATA_DATE}
      </div>

      {id && CERT_SOURCE_URL[id] && (
        <div style={{ textAlign: 'center', paddingBottom: 24 }}>
          <a href={CERT_SOURCE_URL[id]} target="_blank" rel="noopener noreferrer" className="source-link">
            📄 View Official Source
          </a>
        </div>
      )}
    </article>
  )
}
