import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { useApp } from '../context/AppContext.tsx'
import { JOBS, CERTS, CAREERS, CERT_MAP } from '../data/jobs.ts'
import { VOLUNTEERING } from '../data/volunteering.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'
import type { Cert, Career } from '../types'
import { t18, lsSet } from '../lib/utils.ts'
import JobCard from '../components/JobCard.tsx'
import EmptyState from '../components/EmptyState.tsx'
import styles from './WorkHub.module.css'

// Founder-first sort: items with a founderOrder bubble to the top (ascending).
// Items without founderOrder fall to the end. Stable sort preserves original
// order within each group, keeping the data-file curation intentional.
function byFounderOrder<T extends { founderOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.founderOrder ?? 9999) - (b.founderOrder ?? 9999))
}

export default function WorkHub() {
  const { subtab = 'jobs' } = useParams()
  const navigate = useNavigate()
  const { lang, ui, af, dir, userStatus, targetLane, nextLiftingCredential } = useApp()
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

  // Default (no search): founder-first ordering surfaces grant-ready qualifications first.
  // With search active: Fuse.js relevance order takes over (standard behaviour).
  const certsFounderFirst = useMemo(() => byFounderOrder(CERTS as unknown as Cert[]), [])
  const careersFounderFirst = useMemo(() => byFounderOrder(CAREERS as unknown as Career[]), [])

  const filteredCerts = useMemo(() =>
    search.trim() ? (certFuse.search(search).map(r => r.item) as typeof CERTS) : certsFounderFirst as typeof CERTS,
  [search, certFuse, certsFounderFirst])

  const filteredCareers = useMemo(() =>
    search.trim() ? (careerFuse.search(search).map(r => r.item) as typeof CAREERS) : careersFounderFirst as typeof CAREERS,
  [search, careerFuse, careersFounderFirst])

  const searchPlaceholder = ui.searchWork || 'Search…'

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {[
          { id: 'jobs',      emoji: '🛵', label: ui.jobsTab },
          { id: 'certs',     emoji: '📋', label: ui.certsTab },
          { id: 'career',    emoji: '🚀', label: ui.careerTab },
          { id: 'volunteer', emoji: '🙋', label: ui.volunteerTab || 'Volunteer' },
        ].map(t => (
          <button key={t.id} className={`sub-tab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => handleSubtab(t.id)} role="tab" aria-selected={subtab === t.id}>
            <span aria-hidden="true">{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} strokeWidth={2} className={styles.searchIcon} />
        <input className="search-input" placeholder={searchPlaceholder} value={search}
          onChange={e => setSearch(e.target.value)} dir={dir} aria-label={searchPlaceholder} />
        {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>}
      </div>

      {/* Status-specific banner on the Jobs tab */}
      {subtab === 'jobs' && userStatus === 'asylum-seeker' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">⏳</span>
          <p className="tip-text">
            <strong>Permission to Work:</strong> Waited 12+ months for your decision? You may be eligible to apply.
            Rules expand significantly from 26 March 2026 — this week.{' '}
            <button className={styles.inlineLink}
              onClick={() => navigate('/guide/permission-to-work')}>
              See the guide →
            </button>
            {' '}Volunteering is always allowed — start building UK experience now.{' '}
            <button className={styles.inlineLink}
              onClick={() => navigate('/guide/volunteering')}>
              Volunteering guide →
            </button>
          </p>
        </div>
      )}
      {subtab === 'jobs' && userStatus === 'refugee' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">📦</span>
          <p className="tip-text">
            <strong>56-Day Move-On:</strong> Recently got refugee status? You have 56 days to set up your new life — don&apos;t miss your Universal Credit and housing deadlines.{' '}
            <button className={styles.inlineLink}
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
        <EmptyState message={ui.noResults} />
      )}

      {/* Grant-status banners for the Certs tab */}
      {subtab === 'certs' && userStatus === 'refugee' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">🔓</span>
          <p className="tip-text">
            <strong>You have full right to work.</strong>{' '}
            All qualifications below are open to you — the list is sorted to put the most impactful first.
          </p>
        </div>
      )}
      {subtab === 'certs' && userStatus === 'asylum-seeker' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">📚</span>
          <p className="tip-text">
            <strong>Prepare now.</strong>{' '}
            Study for these qualifications while waiting — once refugee status is granted you can apply immediately.{' '}
            <button className={styles.inlineLink} onClick={() => navigate('/guide/get-qualified-first')}>
              See the qualification guide →
            </button>
          </p>
        </div>
      )}

      {/* Lifting-lane next-step prompt — only when user has opted into the lane */}
      {subtab === 'certs' && targetLane === 'lifting' && nextLiftingCredential && !search.trim() && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">🎯</span>
          <p className="tip-text">
            <strong>Your next step:</strong>{' '}
            <button className={styles.inlineLink}
              onClick={() => { sessionStorage.setItem('nluk_last_cert', nextLiftingCredential); navigate(`/cert/${nextLiftingCredential}`) }}>
              {CERT_MAP[nextLiftingCredential]?.content?.en?.title ?? nextLiftingCredential} →
            </button>
          </p>
        </div>
      )}

      {subtab === 'certs' && (
        filteredCerts.length === 0 ? (
          <EmptyState message={ui.noResults} />
        ) : (
          <div className={`card card-flush ${styles.cardGutter}`}>
            {filteredCerts.map((c) => {
              const cc = t18(c.content, lang)
              const certTyped = c as unknown as Cert
              const isGrantReady = !search.trim() && certTyped.founderOrder !== undefined && certTyped.founderOrder <= 20
              return (
                <button key={c.id} className={`list-row ${styles.rowAlignTop}`}
                  ref={el => { certBtnRefs.current[c.id] = el }}
                  onClick={() => { sessionStorage.setItem('nluk_last_cert', c.id); navigate(`/cert/${c.id}`) }} // lgtm[js/clear-text-storage-of-sensitive-data] -- c.id is a public slug, not a credential
                  aria-label={cc.title}>
                  <span className="list-row-icon">{c.icon}</span>
                  <div className="list-row-content">
                    <div className="list-row-title">{cc.title}</div>
                    <div className="list-row-sub">{cc.sector}</div>
                    {isGrantReady && <span className="pill-green">Start here</span>}
                    <span className="pill-free">{ui.freeRoute}</span>
                  </div>
                  <span className="list-row-arrow">{af}</span>
                </button>
              )
            })}
          </div>
        )
      )}

      {/* Grant-status banners for the Career tab */}
      {subtab === 'career' && userStatus === 'refugee' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">🚀</span>
          <p className="tip-text">
            <strong>You have full right to work.</strong>{' '}
            These career paths are sorted by how quickly you can enter them with refugee status — start with the first.
          </p>
        </div>
      )}
      {subtab === 'career' && userStatus === 'asylum-seeker' && (
        <div className={`tip-banner ${styles.tipBannerGutter}`}>
          <span className="tip-icon">📚</span>
          <p className="tip-text">
            <strong>Research now, move fast later.</strong>{' '}
            Explore these paths while waiting — the first options unlock immediately when status is granted.{' '}
            <button className={styles.inlineLink} onClick={() => navigate('/guide/work-rights')}>
              Check work rights →
            </button>
          </p>
        </div>
      )}

      {subtab === 'career' && (
        filteredCareers.length === 0 ? (
          <EmptyState message={ui.noResults} />
        ) : (
          <div className={`card card-flush ${styles.cardGutter}`}>
            {filteredCareers.map((p) => {
              const pc = t18(p.content, lang)
              const careerTyped = p as unknown as Career
              const isCareerGrantReady = !search.trim() && careerTyped.founderOrder !== undefined && careerTyped.founderOrder <= 20
              return (
                <button key={p.id} className={`list-row ${styles.rowAlignTop}`}
                  ref={el => { careerBtnRefs.current[p.id] = el }}
                  onClick={() => { sessionStorage.setItem('nluk_last_career', p.id); navigate(`/career/${p.id}`) }}
                  aria-label={pc.title}>
                  <span className="list-row-icon">{p.icon}</span>
                  <div className="list-row-content">
                    <div className="list-row-title">{pc.title}</div>
                    <div className={styles.tagsRow}>
                      {p.tags.map(t => <span key={t} className="career-tag">{t}</span>)}
                    </div>
                    {isCareerGrantReady && <span className="pill-green">Start here</span>}
                    <div className={styles.careerSalary}>{pc.salary}</div>
                  </div>
                  <span className="list-row-arrow">{af}</span>
                </button>
              )
            })}
          </div>
        )
      )}
      {/* ── Volunteer tab ─────────────────────────────────────────── */}
      {subtab === 'volunteer' && (
        <>
          <div className="section-sub" style={{ paddingTop: 12, paddingBottom: 4 }}>
            Volunteering is <strong>always allowed</strong> for asylum seekers — no permission needed.
            These Bolton/Manchester orgs specifically need Amharic and Tigrinya speakers.
          </div>
          {VOLUNTEERING.filter(org =>
            !search.trim() ||
            org.content.en.title.toLowerCase().includes(search.toLowerCase()) ||
            org.content.en.desc.toLowerCase().includes(search.toLowerCase()) ||
            org.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
          ).map(org => (
            <ResourceCard
              key={org.content.en.title}
              icon={org.icon}
              content={org.content as Record<string, ResourceContent>}
              url={org.url}
              lang={lang}
              ui={ui}
              badge={org.location}
            />
          ))}
          {VOLUNTEERING.filter(org =>
            !search.trim() ||
            org.content.en.title.toLowerCase().includes(search.toLowerCase()) ||
            org.content.en.desc.toLowerCase().includes(search.toLowerCase()) ||
            org.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
          ).length === 0 && <EmptyState message={ui.noResults} />}
        </>
      )}
      <div className={styles.spacer} />
    </div>
  )
}
