import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useApp } from '../context/AppContext.jsx'
import { GUIDE_MAP } from '../data/guides.js'
import { t18 } from '../lib/utils.js'
import QuickLinks from '../components/QuickLinks.jsx'
import ShareBar from '../components/ShareBar.jsx'
import StepText from '../components/StepText.jsx'
import { useEffect } from 'react'

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

      <div style={{ height: 20 }} />
    </article>
  )
}
