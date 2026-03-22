import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useApp } from '../context/AppContext.tsx'
import { GUIDE_MAP, GUIDE_LAST_UPDATED, GUIDE_DATA_DATE, GUIDE_SOURCE_URL, GUIDE_RELATED } from '../data/guides.ts'
import { t18 } from '../lib/utils.ts'
import { useTranslatedContent } from '../lib/useTranslation.ts'
import QuickLinks from '../components/QuickLinks.tsx'
import MachineTranslationBanner from '../components/MachineTranslationBanner.tsx'
import ShareBar from '../components/ShareBar.tsx'
import StepText from '../components/StepText.tsx'
import TTSButton from '../components/TTSButton.tsx'

interface GuideContent {
  title: string
  summary: string
  steps: string[]
  [key: string]: unknown
}

export default function GuideDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, ui, ab, af, bookmarks, toggleBookmark } = useApp()

  const guide = id ? GUIDE_MAP[id] : undefined

  useEffect(() => {
    if (!guide) navigate('/')
  }, [guide, navigate])

  const [gc, translating, wasTranslated] = useTranslatedContent<GuideContent>(
    guide?.content as Record<string, GuideContent> | undefined,
    lang,
    id
  )

  // ── Reading progress bar ──
  const [readProgress, setReadProgress] = useState(0)
  useEffect(() => {
    const scrollEl = document.getElementById('main-content')
    if (!scrollEl) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      const max = scrollHeight - clientHeight
      setReadProgress(max > 0 ? Math.min(100, Math.round((scrollTop / max) * 100)) : 0)
    }
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollEl.removeEventListener('scroll', onScroll)
  }, [])

  const isBookmarked = id ? bookmarks.includes(id) : false

  if (!guide) return null

  if (!gc?.title) return (
    <article className="detail-enter">
      <div className={`detail-header${translating ? ' translating' : ''}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
      </div>
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Content unavailable</div>
    </article>
  )

  return (
    <article className="detail-enter">
      <Helmet>
        <title>{gc.title} — New Life UK</title>
        <meta name="description" content={gc.summary} />
      </Helmet>

      {/* Reading progress bar */}
      <div className="reading-progress-bar" role="progressbar" aria-valuenow={readProgress} aria-valuemin={0} aria-valuemax={100} aria-label={ui.readingProgress || 'Reading progress'}>
        <div className="reading-progress-fill" style={{ width: `${readProgress}%` }} />
      </div>

      <div className={`detail-header${translating ? ' translating' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
          {id && (
            <button
              className={`bookmark-btn${isBookmarked ? ' active' : ''}`}
              onClick={() => { navigator?.vibrate?.(10); toggleBookmark(id) }}
              aria-label={isBookmarked ? (ui.unbookmark || 'Remove saved') : (ui.bookmark || 'Save guide')}
              aria-pressed={isBookmarked}
            >
              <Bookmark size={20} strokeWidth={2} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        <div className="detail-hero">
          <span className="detail-icon">{guide.icon}</span>
          <div>
            <h2 className="detail-title">{gc.title}</h2>
            <p className="detail-summary">{gc.summary}</p>
          </div>
        </div>
      </div>

      {guide.links && guide.links.length > 0 && (
        <QuickLinks links={guide.links} label={`🔗 ${ui.applyLinks || 'Quick Links'}`} />
      )}

      <ShareBar title={gc.title} ui={ui}
        extra={<TTSButton lang={lang} title={gc.title} summary={gc.summary} steps={gc.steps} ui={ui} />}
      />

      {(guide.cost || guide.time || (guide.bring && guide.bring.length > 0)) && (
        <div className="key-info-strip">
          {guide.cost && <span className="key-chip">💰 {guide.cost}</span>}
          {guide.time && <span className="key-chip">⏱ {guide.time}</span>}
          {guide.bring?.map(b => <span key={b} className="key-chip">📋 {b}</span>)}
        </div>
      )}

      <div className="section-label">{ui.steps}</div>
      <div className={`card${translating ? ' translating' : ''}`} style={{ margin: '0 var(--gutter) 12px' }}>
        <div style={{ padding: '6px 16px' }}>
          {translating && (
            <div className="translating-row">
              <span className="translating-spinner" />
              <span style={{ fontSize: '.85rem', color: 'var(--t3)' }}>{ui.translating || 'Translating…'}</span>
            </div>
          )}
          {gc.steps?.map((s, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{i + 1}</div>
              {s.startsWith('⚠') ? <div className="step-warn"><StepText text={s} /></div> : <div className="step-text"><StepText text={s} /></div>}
            </div>
          ))}
        </div>
      </div>

      {wasTranslated && (
        <MachineTranslationBanner
          lang={lang}
          ui={ui}
          highRisk={['Business & Money', 'Identity & Login'].includes(guide.cat)}
        />
      )}

      {id && GUIDE_RELATED[id] && (
        <div>
          <div className="section-label">📎 {ui.relatedGuides || 'Related Guides'}</div>
          <div className="card card-flush" style={{ margin: '0 var(--gutter) 12px' }}>
            {GUIDE_RELATED[id].map(relId => {
              const rg = GUIDE_MAP[relId]
              if (!rg) return null
              const rgc = t18(rg.content, lang)
              return (
                <button key={relId} className="list-row"
                  onClick={() => { sessionStorage.setItem('nluk_last_guide', relId); navigate(`/guide/${relId}`) }}>
                  <span className="list-row-icon">{rg.icon}</span>
                  <div className="list-row-content">
                    <div className="list-row-title">{rgc.title}</div>
                  </div>
                  <span className="list-row-arrow">{af}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="guide-footer">
        <span className="guide-footer-verified">✓ Verified {(id && GUIDE_LAST_UPDATED[id]) || GUIDE_DATA_DATE}</span>
        {id && GUIDE_SOURCE_URL[id] && (
          <>
            <span aria-hidden="true">·</span>
            <a href={GUIDE_SOURCE_URL[id]} target="_blank" rel="noopener noreferrer" className="guide-footer-source">
              📄 View Official Source
            </a>
          </>
        )}
      </div>
    </article>
  )
}
