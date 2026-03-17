import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { JOBS, CERTS, CAREERS } from '../data/jobs.ts'
import { t18, lsSet } from '../lib/utils.ts'
import JobCard from '../components/JobCard.tsx'

export default function WorkHub() {
  const { subtab = 'jobs' } = useParams()
  const navigate = useNavigate()
  const { lang, ui, af, dir, userStatus } = useApp()
  const certBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const careerBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [search, setSearch] = useState('')

  // Reset search when switching tabs
  useEffect(() => { setSearch('') }, [subtab])

  useEffect(() => {
    const lastCert = sessionStorage.getItem('nluk_last_cert')
    if (lastCert && subtab === 'certs') {
      sessionStorage.removeItem('nluk_last_cert')
      requestAnimationFrame(() => { certBtnRefs.current[lastCert]?.focus() })
    }
    const lastCareer = sessionStorage.getItem('nluk_last_career')
    if (lastCareer && subtab === 'career') {
      sessionStorage.removeItem('nluk_last_career')
      requestAnimationFrame(() => { careerBtnRefs.current[lastCareer]?.focus() })
    }
  }, [subtab])

  const handleSubtab = (id: string) => {
    lsSet('nluk_wtab', id)
    navigate(`/work/${id}`)
  }

  // Fuse.js indexes built once per tab
  const jobFuse = useMemo(() => new Fuse(JOBS, {
    keys: [
      { name: 'content.en.role', weight: 3 },
      { name: 'content.en.desc', weight: 1 },
      { name: 'tags',            weight: 2 },
    ],
    threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2,
  }), [])

  const certFuse = useMemo(() => new Fuse(CERTS as unknown as Record<string, unknown>[], {
    keys: [
      { name: 'content.en.title',  weight: 3 },
      { name: 'content.en.sector', weight: 1 },
    ],
    threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2,
  }), [])

  const careerFuse = useMemo(() => new Fuse(CAREERS as unknown as Record<string, unknown>[], {
    keys: [
      { name: 'content.en.title', weight: 3 },
      { name: 'tags',             weight: 2 },
    ],
    threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2,
  }), [])

  const filteredJobs = useMemo(() =>
    search.trim() ? jobFuse.search(search).map(r => r.item) : JOBS,
  [search, jobFuse])

  const filteredCerts = useMemo(() =>
    search.trim() ? (certFuse.search(search).map(r => r.item) as typeof CERTS) : CERTS,
  [search, certFuse])

  const filteredCareers = useMemo(() =>
    search.trim() ? (careerFuse.search(search).map(r => r.item) as typeof CAREERS) : CAREERS,
  [search, careerFuse])

  const searchPlaceholder = ui.searchWork || 'Search…'

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {[
          { id: 'jobs', label: `🛵 ${ui.jobsTab}` },
          { id: 'certs', label: `📋 ${ui.certsTab}` },
          { id: 'career', label: `🚀 ${ui.careerTab}` },
        ].map(t => (
          <button key={t.id} className={`sub-tab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => handleSubtab(t.id)} role="tab" aria-selected={subtab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <span style={{ color: 'var(--t3)' }}>🔍</span>
        <input className="search-input" placeholder={searchPlaceholder} value={search}
          onChange={e => setSearch(e.target.value)} dir={dir} aria-label={searchPlaceholder} />
        {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
      </div>

      {/* Status-specific banner on the Jobs tab */}
      {subtab === 'jobs' && userStatus === 'asylum-seeker' && (
        <div className="tip-banner" style={{ margin: '0 16px 12px' }}>
          <span className="tip-icon">⏳</span>
          <p className="tip-text">
            <strong>Permission to Work:</strong> Waited 12+ months for your decision? You may be eligible to apply.
            Rules expand significantly from 26 March 2026.{' '}
            <button style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: 700 }}
              onClick={() => navigate('/guide/permission-to-work')}>
              See the guide →
            </button>
            {' '}Volunteering is always allowed — start building UK experience now.{' '}
            <button style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: 700 }}
              onClick={() => navigate('/guide/volunteering')}>
              Volunteering guide →
            </button>
          </p>
        </div>
      )}
      {subtab === 'jobs' && userStatus === 'refugee' && (
        <div className="tip-banner" style={{ margin: '0 16px 12px' }}>
          <span className="tip-icon">📦</span>
          <p className="tip-text">
            <strong>56-Day Move-On:</strong> Recently got refugee status? You have 56 days to set up your new life — don&apos;t miss your Universal Credit and housing deadlines.{' '}
            <button style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: 700 }}
              onClick={() => navigate('/guide/move-on')}>
              See the checklist →
            </button>
          </p>
        </div>
      )}

      {subtab === 'jobs' && filteredJobs.map((j, i) => (
        <JobCard key={i} j={j} lang={lang} ui={ui} />
      ))}
      {subtab === 'jobs' && filteredJobs.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>{ui.noResults}</div>
      )}

      {subtab === 'certs' && (
        filteredCerts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>{ui.noResults}</div>
        ) : (
          <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
            {filteredCerts.map((c) => {
              const cc = t18(c.content, lang)
              return (
                <button key={c.id} className="list-row"
                  ref={el => { certBtnRefs.current[c.id] = el }}
                  onClick={() => { sessionStorage.setItem('nluk_last_cert', c.id); navigate(`/cert/${c.id}`) }} // lgtm[js/clear-text-storage-of-sensitive-data] -- c.id is a public slug, not a credential
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
        )
      )}

      {subtab === 'career' && (
        filteredCareers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>{ui.noResults}</div>
        ) : (
          <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
            {filteredCareers.map((p) => {
              const pc = t18(p.content, lang)
              return (
                <button key={p.id} className="list-row"
                  ref={el => { careerBtnRefs.current[p.id] = el }}
                  onClick={() => { sessionStorage.setItem('nluk_last_career', p.id); navigate(`/career/${p.id}`) }}
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
        )
      )}
      <div style={{ height: 8 }} />
    </div>
  )
}
