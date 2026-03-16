import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { JOBS, CERTS, CAREERS, REFUGEE_JOB_SUPPORT } from '../data/jobs.js'
import { t18, lsSet } from '../lib/utils.js'
import JobCard from '../components/JobCard.jsx'

const JOB_FILTERS = [
  { id: 'all',  label: 'All' },
  { id: 'noexp', label: '✅ No experience', tag: 'No experience needed' },
  { id: 'visa',  label: '🌍 Visa sponsorship', tag: 'Visa sponsorship available' },
]

export default function WorkHub() {
  const { subtab = 'jobs' } = useParams()
  const navigate = useNavigate()
  const { lang, ui, af } = useApp()
  const certBtnRefs = useRef({})
  const careerBtnRefs = useRef({})
  const [jobFilter, setJobFilter] = useState('all')

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

  const handleSubtab = (id) => {
    lsSet('nluk_wtab', id)
    navigate(`/work/${id}`)
  }

  const visibleJobs = jobFilter === 'all'
    ? JOBS
    : JOBS.filter(j => {
        const selectedFilter = JOB_FILTERS.find(f => f.id === jobFilter)
        return selectedFilter?.tag && j.tags?.includes(selectedFilter.tag)
      })

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {[
          { id: 'jobs', label: `💼 ${ui.jobsTab}` },
          { id: 'certs', label: `📋 ${ui.certsTab}` },
          { id: 'career', label: `🚀 ${ui.careerTab}` },
        ].map(t => (
          <button key={t.id} className={`sub-tab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => handleSubtab(t.id)} role="tab" aria-selected={subtab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      {subtab === 'jobs' && (
        <>
          {/* Refugee employment support banner */}
          <div className="card" style={{ margin: '0 20px 10px', background: 'var(--ac2)', border: '1.5px solid rgba(10,95,62,.15)' }}>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--ac3)', marginBottom: 5 }}>
                🤝 Get free job support for refugees
              </div>
              <div style={{ fontSize: '.825rem', color: 'var(--t2)', lineHeight: 1.55, marginBottom: 8 }}>
                Start here — these specialist charities connect you directly to employers. Free CV help, interview coaching, and employer introductions.
              </div>
              <div className="job-apply-grid">
                {REFUGEE_JOB_SUPPORT.map(lk => (
                  <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer"
                    className="job-apply-chip" aria-label={`${lk.name} (opens in new tab)`}>
                    {lk.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="chip-bar" role="group" aria-label="Filter jobs">
            {JOB_FILTERS.map(f => (
              <button key={f.id} className={`chip ${jobFilter === f.id ? 'active' : ''}`}
                onClick={() => setJobFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>

          {visibleJobs.map((j, i) => (
            <JobCard key={i} j={j} lang={lang} ui={ui} />
          ))}
        </>
      )}

      {subtab === 'certs' && (
        <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
          {CERTS.map((c) => {
            const cc = t18(c.content, lang)
            return (
              <button key={c.id} className="list-row"
                ref={el => { certBtnRefs.current[c.id] = el }}
                onClick={() => { sessionStorage.setItem('nluk_last_cert', c.id); navigate(`/cert/${c.id}`) }}
                style={{ alignItems: 'flex-start' }}>
                <span className="list-row-icon" aria-hidden="true">{c.icon}</span>
                <div className="list-row-content">
                  <div className="list-row-title">{cc.title}</div>
                  <div className="list-row-sub">{cc.sector}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                    <span className="pill pill-green">{c.time}</span>
                    <span className="pill pill-amber">{c.cost}</span>
                  </div>
                  <span className="pill-free">{ui.freeRoute}</span>
                </div>
                <span className="list-row-arrow" aria-hidden="true">{af}</span>
              </button>
            )
          })}
        </div>
      )}

      {subtab === 'career' && (
        <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
          {CAREERS.map((p) => {
            const pc = t18(p.content, lang)
            return (
              <button key={p.id} className="list-row"
                ref={el => { careerBtnRefs.current[p.id] = el }}
                onClick={() => { sessionStorage.setItem('nluk_last_career', p.id); navigate(`/career/${p.id}`) }}
                style={{ alignItems: 'flex-start' }}>
                <span className="list-row-icon" aria-hidden="true">{p.icon}</span>
                <div className="list-row-content">
                  <div className="list-row-title">{pc.title}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
                    {p.tags.map(t => <span key={t} className="career-tag">{t}</span>)}
                  </div>
                  <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--gn)', marginTop: 3 }}>{pc.salary}</div>
                </div>
                <span className="list-row-arrow" aria-hidden="true">{af}</span>
              </button>
            )
          })}
        </div>
      )}
      <div style={{ height: 8 }} />
    </div>
  )
}
