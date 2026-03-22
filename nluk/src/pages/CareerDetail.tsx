import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { CAREER_MAP, JOBS_DATA_DATE, CAREER_SOURCE_URL } from '../data/jobs.ts'
import { useTranslatedContent, useTranslatedSteps } from '../lib/useTranslation.ts'
import MachineTranslationBanner from '../components/MachineTranslationBanner.tsx'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'
import TTSButton from '../components/TTSButton.tsx'

interface CareerContent {
  title: string
  salary: string
  [key: string]: unknown
}

export default function CareerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()

  const career = id ? CAREER_MAP[id] : undefined

  useEffect(() => {
    if (!career) navigate('/work/career')
  }, [career, navigate])

  const [pc, translating, _wasTranslated] = useTranslatedContent<CareerContent>(
    career?.content as Record<string, CareerContent> | undefined,
    lang,
    id
  )
  const st = useTranslatedSteps(
    career?.steps as Record<string, string[]> | undefined,
    lang,
    id
  )

  if (!career) return null

  if (!pc?.title) return (
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
        <title>{pc.title} — New Life UK</title>
        <meta name="description" content={pc.salary} />
      </Helmet>
      <div className={`detail-header${translating ? ' translating' : ''}`}>
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

      <ShareBar title={pc.title} ui={ui}
        extra={<TTSButton lang={lang} title={pc.title} summary={pc.salary} steps={st} ui={ui} />}
      />

      <div className="section-label">{ui.steps}</div>
      <div className={`card${translating ? ' translating' : ''}`} style={{ margin: '0 var(--gutter) 12px' }}>
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

      <MachineTranslationBanner lang={lang} ui={ui} />

      <div className="guide-footer">
        <span className="guide-footer-verified">✓ Verified {JOBS_DATA_DATE}</span>
        {id && CAREER_SOURCE_URL[id] && (
          <>
            <span aria-hidden="true">·</span>
            <a href={CAREER_SOURCE_URL[id]} target="_blank" rel="noopener noreferrer" className="guide-footer-source">
              📄 View Official Source
            </a>
          </>
        )}
      </div>
    </article>
  )
}
