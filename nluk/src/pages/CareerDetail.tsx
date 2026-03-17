import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { CAREER_MAP } from '../data/jobs.ts'
import { t18 } from '../lib/utils.ts'
import { translateContentObject } from '../lib/translate.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'

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

  const englishContent = career ? t18(career.content, 'en') as CareerContent : null
  const hasNativeTranslation = career ? !!career.content[lang as keyof typeof career.content] : false

  const [pc, setPc] = useState<CareerContent | null>(() =>
    career ? t18(career.content, lang) as CareerContent : null
  )
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!career || !englishContent) return
    const nativeContent = t18(career.content, lang) as CareerContent
    if (lang === 'en' || hasNativeTranslation) {
      setPc(nativeContent)
      setWasTranslated(false)
      return
    }
    let cancelled = false
    setTranslating(true)
    setPc(englishContent)
    translateContentObject(englishContent, lang).then(translated => {
      if (!cancelled) {
        setPc(translated as CareerContent)
        setTranslating(false)
        setWasTranslated(true)
      }
    })
    return () => { cancelled = true }
  // englishContent and hasNativeTranslation are derived from career+lang, which are already in the dep array
  }, [lang, id, career]) // eslint-disable-line react-hooks/exhaustive-deps

  const englishSteps = career ? t18(career.steps, 'en') as string[] : []
  const hasNativeSteps = career ? !!career.steps[lang as keyof typeof career.steps] : false

  const [st, setSt] = useState<string[]>(() =>
    career ? t18(career.steps, lang) as string[] : []
  )

  useEffect(() => {
    if (!career) return
    const nativeSteps = t18(career.steps, lang) as string[]
    if (lang === 'en' || hasNativeSteps) {
      setSt(nativeSteps)
      return
    }
    let cancelled = false
    setSt(englishSteps)
    translateContentObject({ steps: englishSteps }, lang).then(translated => {
      if (!cancelled) setSt((translated as { steps: string[] }).steps)
    })
    return () => { cancelled = true }
  // englishSteps and hasNativeSteps are derived from career+lang, which are already in the dep array
  }, [lang, id, career]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!career) return null

  if (!pc?.title) return (
    <article className="page-enter">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  return (
    <article className="page-enter">
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

      <ShareBar title={pc.title} ui={ui} />

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
              <div className="step-text"><StepText text={s} /></div>
            </div>
          ))}
        </div>
      </div>

      {wasTranslated && (
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
          <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>
        </div>
      )}

      <div style={{ height: 20 }} />
    </article>
  )
}
