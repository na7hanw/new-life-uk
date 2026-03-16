import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { CAREER_MAP } from '../data/jobs.ts'
import { t18 } from '../lib/utils.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'

export default function CareerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const career = CAREER_MAP[id]

  useEffect(() => {
    if (!career) navigate('/work/career')
  }, [career, navigate])

  if (!career) return null

  const pc = t18(career.content, lang)
  const st = t18(career.steps, lang)

  if (!pc.title) return (
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
          <span className="detail-icon">{career.icon}</span>
          <div>
            <h2 className="detail-title">{pc.title}</h2>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
              {career.tags.map(t => <span key={t} className="pill pill-light">{t}</span>)}
            </div>
            <div className="detail-salary">{pc.salary}</div>
          </div>
        </div>
      </div>

      {career.links?.length > 0 && (
        <QuickLinks links={career.links} label={`🔗 ${ui.applyLinks || 'Apply'}`} />
      )}

      <ShareBar title={pc.title} ui={ui} />

      <div className="section-label">{ui.steps}</div>
      <div className="card" style={{ margin: '0 20px 12px' }}>
        <div style={{ padding: '6px 16px' }}>
          {(Array.isArray(st) ? st : []).map((s, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{i + 1}</div>
              <div className="step-text"><StepText text={s} /></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 20 }} />
    </article>
  )
}
