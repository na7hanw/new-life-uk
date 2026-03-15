import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { CERT_MAP } from '../data/jobs.js'
import { t18 } from '../lib/utils.js'
import QuickLinks from '../components/QuickLinks.jsx'
import ShareBar from '../components/ShareBar.jsx'
import StepText from '../components/StepText.jsx'

export default function CertDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const cert = CERT_MAP[id]

  useEffect(() => {
    if (!cert) navigate('/work/certs')
  }, [cert, navigate])

  if (!cert) return null

  const cc = t18(cert.content, lang)
  const st = t18(cert.steps, lang)

  if (!cc.title) return (
    <article className="page-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  return (
    <article className="page-enter">
      <div className="detail-header">
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

      <div className="section-label">{ui.steps}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '6px 16px' }}>
          {(Array.isArray(st) ? st : []).map((s, i) => (
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
