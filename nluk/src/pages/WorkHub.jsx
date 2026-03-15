import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { JOBS, CERTS, CAREERS } from '../data/jobs.js'
import { t18, lsSet } from '../lib/utils.js'
import JobCard from '../components/JobCard.jsx'

export default function WorkHub() {
  const { subtab = 'jobs' } = useParams()
  const navigate = useNavigate()
  const { lang, ui, af } = useApp()

  const handleSubtab = (id) => {
    lsSet('nluk_wtab', id)
    navigate(`/work/${id}`)
  }

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

      {subtab === 'jobs' && JOBS.map((j, i) => (
        <JobCard key={i} j={j} lang={lang} ui={ui} />
      ))}

      {subtab === 'certs' && (
        <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
          {CERTS.map((c, i) => {
            const cc = t18(c.content, lang)
            return (
              <button key={i} className="list-row" onClick={() => navigate(`/cert/${i}`)}
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

      {subtab === 'career' && (
        <div className="card card-flush" style={{ margin: '0 20px 12px' }}>
          {CAREERS.map((p, i) => {
            const pc = t18(p.content, lang)
            return (
              <button key={pc.title} className="list-row" onClick={() => navigate(`/career/${i}`)}
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
  )
}
