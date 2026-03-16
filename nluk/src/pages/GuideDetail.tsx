import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { GUIDE_MAP, GUIDE_LAST_UPDATED, GUIDE_DATA_DATE, GUIDE_SOURCE_URL } from '../data/guides.ts'
import { t18 } from '../lib/utils.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'
import TTSButton from '../components/TTSButton.tsx'

export default function GuideDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const guide = GUIDE_MAP[id]

  useEffect(() => {
    if (!guide) navigate('/')
  }, [guide, navigate])

  if (!guide) return null

  const gc = t18(guide.content, lang)

  if (!gc.title) return (
    <article className="page-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  return (
    <article className="page-enter">
      <Helmet>
        <title>{gc.title} — New Life UK</title>
        <meta name="description" content={gc.summary} />
      </Helmet>
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className="detail-hero">
          <span className="detail-icon">{guide.icon}</span>
          <div>
            <h2 className="detail-title">{gc.title}</h2>
            <p className="detail-summary">{gc.summary}</p>
          </div>
        </div>
      </div>

      {guide.links?.length > 0 && (
        <QuickLinks links={guide.links} label={`🔗 ${ui.applyLinks || 'Quick Links'}`} />
      )}

      <ShareBar title={gc.title} ui={ui} />

      <TTSButton lang={lang} title={gc.title} summary={gc.summary} steps={gc.steps} />

      {(guide.cost || guide.time || guide.bring?.length > 0) && (
        <div className="key-info-strip">
          {guide.cost && <span className="key-chip">💰 {guide.cost}</span>}
          {guide.time && <span className="key-chip">⏱ {guide.time}</span>}
          {guide.bring?.map(b => <span key={b} className="key-chip">📋 {b}</span>)}
        </div>
      )}

      <div className="section-label">{ui.steps}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '6px 16px' }}>
          {gc.steps?.map((s, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{i + 1}</div>
              {s.startsWith('⚠') ? <div className="step-warn"><StepText text={s} /></div> : <div className="step-text"><StepText text={s} /></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="guide-updated">
        ✓ Verified {GUIDE_LAST_UPDATED[id] || GUIDE_DATA_DATE}
      </div>

      {GUIDE_SOURCE_URL[id] && (
        <div style={{ textAlign: 'center', paddingBottom: 24 }}>
          <a href={GUIDE_SOURCE_URL[id]} target="_blank" rel="noopener noreferrer" className="source-link">
            📄 View Official Source
          </a>
        </div>
      )}
    </article>
  )
}
