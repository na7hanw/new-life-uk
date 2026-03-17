import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.tsx'
import { CERT_MAP } from '../data/jobs.ts'
import { t18 } from '../lib/utils.ts'
import { translateContentObject } from '../lib/translate.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'

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

  const englishContent = cert ? t18(cert.content, 'en') as CertContent : null
  const hasNativeTranslation = cert ? !!cert.content[lang as keyof typeof cert.content] : false

  const [cc, setCc] = useState<CertContent | null>(() =>
    cert ? t18(cert.content, lang) as CertContent : null
  )
  const [translating, setTranslating] = useState(false)
  const [wasTranslated, setWasTranslated] = useState(false)

  useEffect(() => {
    if (!cert || !englishContent) return
    const nativeContent = t18(cert.content, lang) as CertContent
    if (lang === 'en' || hasNativeTranslation) {
      setCc(nativeContent)
      setWasTranslated(false)
      return
    }
    let cancelled = false
    setTranslating(true)
    setCc(englishContent)
    translateContentObject(englishContent, lang).then(translated => {
      if (!cancelled) {
        setCc(translated as CertContent)
        setTranslating(false)
        setWasTranslated(true)
      }
    })
    return () => { cancelled = true }
  // englishContent and hasNativeTranslation are derived from cert+lang, which are already in the dep array
  }, [lang, id, cert]) // eslint-disable-line react-hooks/exhaustive-deps

  const englishSteps = cert ? t18(cert.steps, 'en') as string[] : []
  const hasNativeSteps = cert ? !!cert.steps[lang as keyof typeof cert.steps] : false

  const [st, setSt] = useState<string[]>(() =>
    cert ? t18(cert.steps, lang) as string[] : []
  )

  useEffect(() => {
    if (!cert) return
    const nativeSteps = t18(cert.steps, lang) as string[]
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
  // englishSteps and hasNativeSteps are derived from cert+lang, which are already in the dep array
  }, [lang, id, cert]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!cert) return null

  if (!cc?.title) return (
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

      <div style={{ height: 20 }} />
    </article>
  )
}
