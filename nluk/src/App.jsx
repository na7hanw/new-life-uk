import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  LANGS, UI, CATEGORIES, TIPS,
  GUIDES, GUIDE_MAP, GUIDE_PRIORITY, SAVES, JOBS, CERTS, CAREERS, GEMS,
  SOS_NUMBERS, GITHUB_URL,
} from './data/content.js'

// ─── Helpers ──────────────────────────────────────────────────────
const ls = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
const t18 = (obj, lang) => obj?.[lang] || obj?.en || {}

// ─── Logo ─────────────────────────────────────────────────────────
const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill="#0A5F3E" />
    <path d="M8 26H32" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 14C14.48 14 10 18.48 10 24H30C30 18.48 25.52 14 20 14Z" fill="#A7F3D0" opacity=".25" />
    <path d="M14 24C14 20.69 16.69 18 20 18C23.31 18 26 20.69 26 24" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="10" x2="20" y2="13" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
    <line x1="27" y1="13" x2="25.5" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="13" x2="14.5" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ─── Share Bar ────────────────────────────────────────────────────
function ShareBar({ title, ui }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const text = `${title} — New Life UK\n${url}`
  const share = (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' — New Life UK')}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    }
    if (platform === 'copy') {
      navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    } else {
      window.open(urls[platform], '_blank', 'noopener,noreferrer')
    }
  }
  return (
    <div className="share-bar">
      <button className="share-btn share-whatsapp" onClick={() => share('whatsapp')} aria-label="Share on WhatsApp">💬 {ui.shareWhatsapp || 'WhatsApp'}</button>
      <button className="share-btn share-telegram" onClick={() => share('telegram')} aria-label="Share on Telegram">✈️ {ui.shareTelegram || 'Telegram'}</button>
      <button className="share-btn share-facebook" onClick={() => share('facebook')} aria-label="Share on Facebook">📘 {ui.shareFacebook || 'Facebook'}</button>
      <button className="share-btn share-copy" onClick={() => share('copy')} aria-label="Copy link">🔗 {copied ? (ui.copied || 'Copied!') : (ui.shareCopy || 'Copy link')}</button>
    </div>
  )
}

// ─── Step Text — makes URLs in step strings clickable ─────────────
function StepText({ text }) {
  // Matches [label](url) and bare https:// URLs
  const rx = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,;)]+)/g
  const parts = []
  let last = 0, m
  while ((m = rx.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(<a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer" className="step-link">{m[2]}</a>)
    } else {
      const raw = m[4].replace(/[.)]+$/, '') // trim trailing punctuation
      parts.push(<a key={m.index} href={raw} target="_blank" rel="noopener noreferrer" className="step-link">{raw.replace(/^https?:\/\//, '')}</a>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

// ─── Quick Links — horizontal scrolling pill row ─────────────────
function QuickLinks({ links, label }) {
  if (!links?.length) return null
  return (
    <div className="quick-links-wrap">
      {label && <div className="section-label">{label}</div>}
      <div className="quick-links-row">
        {links.map(lk => (
          <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer" className="quick-link-pill">
            {lk.name} →
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Job Card ────────────────────────────────────────────────────
function JobCard({ j, lang, ui }) {
  const [open, setOpen] = useState(false)
  const jc = (j.content?.[lang] || j.content?.en || {})
  return (
    <div className={`job-card ${open ? 'job-card--open' : ''}`}>
      <button className="job-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="job-icon">{j.icon}</span>
        <div className="job-info">
          <div className="job-role-row">
            <span className="job-role">{jc.role}</span>
            {j.visa && <span className="pill pill-blue">Sponsorship</span>}
          </div>
          <div className="job-pay">{j.pay}</div>
        </div>
        <span className="job-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {j.tags && (
        <div className="job-tags">
          {j.tags.map(t => <span key={t} className="job-tag">{t}</span>)}
        </div>
      )}

      {open && (
        <div className="job-body">
          <p className="job-desc">{jc.desc}</p>

          {j.docs?.length > 0 && (
            <div className="job-section">
              <div className="job-section-label">📋 {ui.docsNeeded || "What you'll need"}</div>
              <div className="job-docs-row">
                {j.docs.map(d => <span key={d} className="job-doc-chip">{d}</span>)}
              </div>
            </div>
          )}

          <div className="job-section">
            <div className="job-section-label">🔗 {ui.jobsApplyTo || "Where to apply"}</div>
            <div className="job-apply-grid">
              {j.applyLinks?.map(lk => (
                <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer" className="job-apply-chip">
                  {lk.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Start Here — priority-ordered guide IDs for newly granted refugees ──
const START_HERE = [
  'move-on', 'bank', 'uc', 'gp', 'ni', 'evisa', 'sharecode', 'housing-help',
]

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => ls('nluk_lang', 'en'))
  const [tab, setTab] = useState('home')
  const [nav, setNav] = useState([])
  const [guide, setGuide] = useState(null)
  const [cert, setCert] = useState(null)
  const [career, setCareer] = useState(null)
  const [showSOS, setSOS] = useState(false)
  const [showSettings, setSettings] = useState(false)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [workTab, setWorkTab] = useState(() => ls('nluk_wtab', 'jobs'))
  const [showLang, setShowLang] = useState(() => !ls('nluk_lang', ''))
  const [dark, setDark] = useState(() => ls('nluk_dark', '') === 'true')
  const scrollRef = useRef(null)

  // Bug fix: use dynamic array length instead of hardcoded 8
  const [tipIdx] = useState(() => Math.floor(Math.random() * 100))

  // Persist state
  useEffect(() => { lsSet('nluk_lang', lang); document.documentElement.lang = lang }, [lang])
  useEffect(() => { lsSet('nluk_dark', String(dark)) }, [dark])
  useEffect(() => { lsSet('nluk_wtab', workTab) }, [workTab])

  // Derived
  const L = LANGS.find(l => l.code === lang) || LANGS[0]
  const ui = UI[lang] || UI.en
  const dir = L.rtl ? 'rtl' : 'ltr'
  const fontClass = L.ar ? '' : L.eth ? 'eth-font' : ''
  const ab = L.rtl ? '→' : '←'
  const af = L.rtl ? '‹' : '›'

  const tipList = TIPS.refugee
  const tip = tipList[tipIdx % tipList.length]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = GUIDES.filter(g => {
      const c = t18(g.content, lang)
      return (catFilter === 'All' || g.cat === catFilter) &&
        (!q || c.title?.toLowerCase().includes(q) || c.summary?.toLowerCase().includes(q))
    })
    // Sort by GUIDE_PRIORITY, unknowns go to end
    return list.sort((a, b) => {
      const ia = GUIDE_PRIORITY.indexOf(a.id)
      const ib = GUIDE_PRIORITY.indexOf(b.id)
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
    })
  }, [search, catFilter, lang])

  const cats = useMemo(() => [...new Set(filtered.map(g => g.cat))], [filtered])

  const isDetail = ['gd', 'cd', 'cpd'].includes(tab)

  const push = useCallback(t2 => {
    // Cap nav stack to avoid unbounded growth
    setNav(p => [...p.slice(-10), tab])
    setTab(t2)
    scrollRef.current?.scrollTo(0, 0)
  }, [tab])

  const back = useCallback(() => {
    const prev = nav[nav.length - 1] || 'home'
    setNav(n => n.slice(0, -1))
    setGuide(null)
    setCert(null)
    setCareer(null)
    setTab(prev)
  }, [nav])

  const switchTab = useCallback(id => {
    setNav([])
    setGuide(null)
    setCert(null)
    setCareer(null)
    setTab(id)
    scrollRef.current?.scrollTo(0, 0)
  }, [])

  const TABS = [
    { id: 'home', icon: '🏠', label: ui.home },
    { id: 'guides', icon: '📖', label: ui.guides },
    { id: 'work', icon: '💼', label: ui.work },
    { id: 'saves', icon: '🆓', label: ui.saves },
    { id: 'more', icon: '☰', label: ui.more },
  ]

  return (
    <div className={`app-root ${dark ? 'dark' : ''} ${fontClass}`} dir={dir}>

      {/* LANGUAGE OVERLAY */}
      {showLang && (
        <div className="lang-overlay" role="dialog" aria-label="Select language">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="header-brand"><Logo size={28} /><h1 style={{ fontSize: '1.05rem', fontWeight: 800 }}>New Life UK</h1></div>
            <button className="btn btn-primary" onClick={() => setShowLang(false)}>{ui.close} ✓</button>
          </div>
          <div className="lang-grid">
            {LANGS.map(l => (
              <button key={l.code} className={`lang-item ${lang === l.code ? 'active' : ''}`}
                onClick={() => { setLang(l.code); setShowLang(false) }}>
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-name">{l.native}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HEADER — hidden on detail pages and lang overlay */}
      {!isDetail && !showLang && (
        <header className="app-header">
          <div className="header-brand"><Logo size={26} /><h1>{ui.app}</h1></div>
          <div className="header-actions">
            <button className="btn-settings" onClick={() => setSettings(true)} aria-label={ui.settings}>⚙</button>
            <button className="btn-sos" onClick={() => setSOS(true)} aria-label="Emergency SOS">{ui.sos}</button>
          </div>
        </header>
      )}

      {/* SCROLLABLE CONTENT */}
      <main className="app-scroll" ref={scrollRef}>

        {/* ── HOME ── */}
        {tab === 'home' && !showLang && (
          <div className="page-enter">

            {/* Hero */}
            <div className="hero">
              <div className="hero-badge">🇬🇧 Free · Private · 12 Languages · No account needed</div>
              <h2 className="hero-title">Welcome to<br />your new life. 🤝</h2>
              <p className="hero-sub">Step-by-step guides for everything you need in the UK. No tracking. No cost. Ever.</p>
            </div>

            {/* BRP notice */}
            <div className="notice">
              <p className="notice-text">⚠ BRPs expired December 2024. Your immigration status is now digital. Set up your eVisa at GOV.UK before travelling.</p>
            </div>

            {/* Daily tip */}
            {tip && <div className="tip-banner"><span className="tip-icon">💡</span><p className="tip-text">{tip}</p></div>}

            {/* Start Here — priority checklist */}
            <div className="section-label">Start Here</div>
            <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
              {START_HERE.map((id, i) => {
                const g = GUIDE_MAP[id]
                if (!g) return null
                const gc = t18(g.content, lang)
                return (
                  <button key={id} className="list-row" onClick={() => { setGuide(g); push('gd') }} aria-label={gc.title}>
                    <div className="start-num">{i + 1}</div>
                    <div className="list-row-content">
                      <div className="list-row-title">{g.icon} {gc.title}</div>
                      <div className="list-row-sub">{gc.summary}</div>
                    </div>
                    <span className="list-row-arrow">{af}</span>
                  </button>
                )
              })}
            </div>

            <button className="btn btn-outline btn-block" style={{ margin: '0 20px 16px', width: 'calc(100% - 40px)' }}
              onClick={() => switchTab('guides')}>
              View all {GUIDES.length} guides →
            </button>

            <div className="disclaimer" style={{ margin: '0 20px 8px' }}>{ui.disclaimer}</div>
            <div style={{ height: 12 }} />
          </div>
        )}

        {/* ── GUIDES ── */}
        {tab === 'guides' && (
          <div className="page-enter">
            <div className="search-bar">
              <span style={{ color: 'var(--t3)' }}>🔍</span>
              <input className="search-input" placeholder={ui.search} value={search}
                onChange={e => setSearch(e.target.value)} dir={dir} aria-label={ui.search} />
              {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
            </div>
            <div className="chip-bar" role="tablist">
              {['All', ...Object.keys(CATEGORIES)].map(c => (
                <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`}
                  onClick={() => setCatFilter(c)} role="tab" aria-selected={catFilter === c}>
                  {c !== 'All' && CATEGORIES[c] ? `${CATEGORIES[c].emoji} ${c}` : c}
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>{ui.noResults}</div>
            )}
            {cats.map(cat => (
              <div key={cat}>
                <div className="cat-header" style={{ color: CATEGORIES[cat]?.color }}>
                  {CATEGORIES[cat]?.emoji} {cat}
                </div>
                <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
                  {filtered.filter(g => g.cat === cat).map(g => {
                    const gc = t18(g.content, lang)
                    return (
                      <button key={g.id} className="list-row" onClick={() => { setGuide(g); push('gd') }} aria-label={gc.title}>
                        <span className="list-row-icon">{g.icon}</span>
                        <div className="list-row-content">
                          <div className="list-row-title">{gc.title}</div>
                          <div className="list-row-sub">{gc.summary}</div>
                        </div>
                        <span className="list-row-arrow">{af}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div style={{ height: 8 }} />
          </div>
        )}

        {/* ── GUIDE DETAIL ── */}
        {tab === 'gd' && guide && (() => {
          const gc = t18(guide.content, lang)
          return (
            <article className="page-enter">
              <div className="detail-header">
                <button className="back-btn" onClick={back}>{ab} {ui.back}</button>
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

              {(guide.cost || guide.time) && (
                <>
                  <div className="section-label">{ui.keyInfo}</div>
                  <div className="card" style={{ margin: '0 20px 12px' }}>
                    <div style={{ padding: '6px 16px' }}>
                      {guide.cost && <div className="info-row"><span className="info-label">💰 {ui.cost}</span><span className="info-value">{guide.cost}</span></div>}
                      {guide.time && <div className="info-row"><span className="info-label">⏱ {ui.time}</span><span className="info-value">{guide.time}</span></div>}
                      {guide.bring?.length > 0 && <div className="info-row"><span className="info-label">🎒 {ui.bring}</span><div className="info-value">{guide.bring.join(' · ')}</div></div>}
                    </div>
                  </div>
                </>
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
        })()}

        {/* ── WORK ── */}
        {tab === 'work' && !cert && !career && (
          <div className="page-enter">
            <div className="sub-tabs" role="tablist">
              {[
                { id: 'jobs', label: `🛵 ${ui.jobsTab}` },
                { id: 'certs', label: `📋 ${ui.certsTab}` },
                { id: 'career', label: `🚀 ${ui.careerTab}` },
              ].map(t => (
                <button key={t.id} className={`sub-tab ${workTab === t.id ? 'active' : ''}`}
                  onClick={() => setWorkTab(t.id)} role="tab" aria-selected={workTab === t.id}>
                  {t.label}
                </button>
              ))}
            </div>

            {workTab === 'jobs' && JOBS.map((j, i) => (
              <JobCard key={i} j={j} lang={lang} ui={ui} />
            ))}

            {workTab === 'certs' && (
              <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
                {CERTS.map((c, i) => {
                  const cc = t18(c.content, lang)
                  return (
                    <button key={i} className="list-row" onClick={() => { setCert(c); push('cd') }}
                      aria-label={cc.title} style={{ alignItems: 'flex-start' }}>
                      <span className="list-row-icon">{c.icon}</span>
                      <div className="list-row-content">
                        <div className="list-row-title">{cc.title}</div>
                        <div className="list-row-sub">{cc.sector}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                          <span className="pill pill-green">{c.time}</span>
                          <span className="pill pill-amber">{c.cost}</span>
                        </div>
                        <span className="pill-free">{ui.freeRoute}</span>
                      </div>
                      <span className="list-row-arrow">{af}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {workTab === 'career' && (
              <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
                {CAREERS.map(p => {
                  const pc = t18(p.content, lang)
                  return (
                    <button key={pc.title} className="list-row" onClick={() => { setCareer(p); push('cpd') }}
                      aria-label={pc.title} style={{ alignItems: 'flex-start' }}>
                      <span className="list-row-icon">{p.icon}</span>
                      <div className="list-row-content">
                        <div className="list-row-title">{pc.title}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
                          {p.tags.map(t => <span key={t} className="career-tag">{t}</span>)}
                        </div>
                        <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--gn)', marginTop: 3 }}>{pc.salary}</div>
                      </div>
                      <span className="list-row-arrow">{af}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <div style={{ height: 8 }} />
          </div>
        )}

        {/* ── CERT DETAIL ── */}
        {tab === 'cd' && cert && (() => {
          const cc = t18(cert.content, lang)
          const st = t18(cert.steps, lang)
          return (
            <article className="page-enter">
              <div className="detail-header">
                <button className="back-btn" onClick={back}>{ab} {ui.back}</button>
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
        })()}

        {/* ── CAREER DETAIL ── */}
        {tab === 'cpd' && career && (() => {
          const pc = t18(career.content, lang)
          const st = t18(career.steps, lang)
          return (
            <article className="page-enter">
              <div className="detail-header">
                <button className="back-btn" onClick={back}>{ab} {ui.back}</button>
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
        })()}

        {/* ── SAVES ── */}
        {tab === 'saves' && (
          <div className="page-enter">
            <div style={{ padding: '16px 20px 8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.savesTitle}</h2>
              <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.savesSub}</p>
            </div>
            {SAVES.map(s => {
              const sc = t18(s.content, lang)
              return (
                <div key={sc.title} className="content-card">
                  <div className="content-card-header">
                    <span className="content-card-icon">{s.icon}</span>
                    <span className="content-card-title">{sc.title}</span>
                  </div>
                  <p className="content-card-body">{sc.desc}</p>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
                      🔗 <span>{ui.openLink}</span> →
                    </a>
                  )}
                </div>
              )
            })}
            <div style={{ height: 8 }} />
          </div>
        )}

        {/* ── MORE ── */}
        {tab === 'more' && (
          <div className="page-enter">
            <div style={{ padding: '16px 20px 8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.gemsTitle}</h2>
              <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.gemsSub}</p>
            </div>
            {GEMS.map(g => {
              const gc = t18(g.content, lang)
              return (
                <div key={gc.title} className="content-card">
                  <div className="content-card-header">
                    <span className="content-card-icon">{g.icon}</span>
                    <span className="content-card-title">{gc.title}</span>
                  </div>
                  <p className="content-card-body">{gc.desc}</p>
                  {g.url && (
                    <a href={g.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
                      🔗 <span>{ui.openLink}</span> →
                    </a>
                  )}
                </div>
              )
            })}

            <div className="section-label">{ui.theme}</div>
            <div className="card" style={{ margin: '0 20px 12px' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
                <button className="btn btn-primary btn-sm" onClick={() => setDark(!dark)}>
                  {dark ? ui.lightMode : ui.darkMode}
                </button>
              </div>
            </div>

            <div className="section-label">{ui.language}</div>
            <div className="card" style={{ margin: '0 20px 12px' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{L.flag} {L.native}</span>
                <button className="btn btn-outline btn-sm" onClick={() => setShowLang(true)}>{ui.change}</button>
              </div>
            </div>

            <div className="section-label">🔒 {ui.privacy || 'Privacy & Data'}</div>
            <div className="card" style={{ margin: '0 20px 12px' }}>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontWeight: 700, marginBottom: 8, fontSize: '.95rem' }}>
                  {ui.privacyTitle || 'Your Privacy'}
                </p>
                <p style={{ fontSize: '.875rem', color: 'var(--t2)', lineHeight: 1.6, marginBottom: 10 }}>
                  {ui.privacyBody || 'This app stores only your language, theme, and visa status in your device\'s local storage. No personal data is ever collected, transmitted, or shared. No analytics. No cookies. No servers. Fully GDPR compliant.'}
                </p>
                <p style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 4 }}>{ui.privacyLocal || 'Stored locally on your device only:'}</p>
                {[
                  ['nluk_lang', 'Language preference'],
                  ['nluk_dark', 'Dark/light mode'],
                  ['nluk_wtab', 'Last work tab viewed'],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: '.8rem', color: 'var(--t2)', padding: '2px 0' }}>
                    <code style={{ background: 'var(--s2)', borderRadius: 4, padding: '1px 5px', marginRight: 6 }}>{k}</code>{v}
                  </div>
                ))}
                <p style={{ fontSize: '.8rem', color: 'var(--gn)', fontWeight: 700, marginTop: 10 }}>
                  ✅ {ui.privacyNone || 'Nothing ever sent to any server.'}
                </p>
                <p style={{ fontSize: '.8rem', color: 'var(--t3)', marginTop: 8, lineHeight: 1.55 }}>
                  {ui.gdprRights || 'GDPR rights: right to access, rectify, erase. Clear your browser/app data at any time to remove all stored preferences.'}
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    try {
                      ['nluk_lang','nluk_dark','nluk_wtab'].forEach(k => localStorage.removeItem(k))
                      window.location.reload()
                    } catch {}
                  }}
                >
                  🗑 Clear all app data
                </button>
              </div>
            </div>

            <div className="footer-disc">
              <strong>Last verified: March 2026</strong><br />
              {ui.disclaimer}<br /><br />
              Built with care for people who need it most.<br />
              Found outdated info? Email{' '}
              <a href="mailto:hello@newlifeuk.org" style={{ color: 'var(--ac3)', textDecoration: 'underline' }}>
                hello@newlifeuk.org
              </a>
              <br /><br />
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--t2)', fontWeight: 700, fontSize: '.875rem', textDecoration: 'none' }}>
                <span>⭐</span> {ui.sourceCode || 'View Source on GitHub'}
              </a>
            </div>
            <div style={{ height: 12 }} />
          </div>
        )}

      </main>

      {/* TAB BAR */}
      {!isDetail && !showLang && (
        <nav className="tab-bar" role="tablist" aria-label="Main navigation">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => switchTab(t.id)} role="tab" aria-selected={tab === t.id} aria-label={t.label}>
              {tab === t.id && <div className="tab-dot" />}
              <span className="tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* FLOATING SOS — Bug fix: always visible (even in detail), except when SOS modal open or lang overlay shown */}
      {!showLang && !showSOS && (
        <button className="floating-sos" onClick={() => setSOS(true)} aria-label="Emergency SOS">{ui.sos}</button>
      )}

      {/* SOS MODAL — no backdrop dismiss (safety-critical) */}
      {showSOS && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Emergency contacts">
          <div className="modal-content">
            <div className="modal-handle" />
            <h2 className="modal-title">🚨 {ui.sos}</h2>
            {SOS_NUMBERS.map(s => (
              <a key={s.name} href={`tel:${s.phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--bd)' }}
                aria-label={`Call ${s.name}: ${s.num}`}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--tx)' }}>{s.name}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--t2)', marginTop: 2 }}>{s.note}</div>
                </div>
                <span className="btn btn-danger btn-sm">{s.num}</span>
              </a>
            ))}
            <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={() => setSOS(false)}>{ui.close}</button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-backdrop" onClick={() => setSettings(false)} role="dialog" aria-label={ui.settings}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>⚙ {ui.settings}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSettings(false)} aria-label={ui.close}>✕</button>
            </div>
            <div className="settings-row">
              <span style={{ fontWeight: 700 }}>{dark ? ui.darkMode : ui.lightMode}</span>
              <button className="btn btn-primary btn-sm" onClick={() => setDark(!dark)}>{dark ? ui.lightMode : ui.darkMode}</button>
            </div>
            <h3 className="modal-title" style={{ marginTop: 16, marginBottom: 4 }}>{ui.language}</h3>
            {LANGS.map(l => (
              <button key={l.code} className="settings-row" onClick={() => { setLang(l.code); setSettings(false) }} aria-label={l.native}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                  <span style={{ fontWeight: 700 }}>{l.native}</span>
                </div>
                {lang === l.code && <span style={{ color: 'var(--ac)', fontWeight: 800 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
