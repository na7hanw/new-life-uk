import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Briefcase, Compass, Settings, ChevronUp, User } from 'lucide-react'
import { Toaster } from 'sonner'
import { useSwipeable } from 'react-swipeable'
import { useApp } from './context/AppContext.tsx'
import { LANGS } from './data/ui-strings.ts'
import { SOS_NUMBERS } from './data/emergency.ts'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import ConsentBanner from './components/ConsentBanner.tsx'
import SkeletonFallback from './components/SkeletonFallback.tsx'
import Logo from './components/Logo.tsx'
import SOSModal from './components/SOSModal.tsx'
import OnboardingOverlay, { shouldShowOnboarding } from './components/OnboardingOverlay.tsx'
import styles from './App.module.css'


const GuidesPage   = lazy(() => import('./pages/GuidesPage.tsx'))
const GuideDetail  = lazy(() => import('./pages/GuideDetail.tsx'))
const WorkHub      = lazy(() => import('./pages/WorkHub.tsx'))
const CertDetail   = lazy(() => import('./pages/CertDetail.tsx'))
const CareerDetail = lazy(() => import('./pages/CareerDetail.tsx'))
const SavesPage    = lazy(() => import('./pages/SavesPage.tsx'))
const MorePage     = lazy(() => import('./pages/MorePage.tsx'))
const ProfilePage  = lazy(() => import('./pages/ProfilePage.tsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'))

// ─── AppShell ────────────────────────────────────────────────────
export default function App() {
  const { lang, setLang, dark, showSOS, setSOS, showLang, setShowLang, ui, dir, fontClass } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  // ── Page transition direction ──
  const prevPathRef = useRef(location.pathname)
  const [navClass, setNavClass] = useState('')

  useEffect(() => {
    const prev = prevPathRef.current
    const curr = location.pathname
    const isDetailPath = (p: string) => /^\/(guide|cert|career)\//.test(p)
    if (!isDetailPath(curr) && isDetailPath(prev)) {
      setNavClass('nav-left')
    } else {
      setNavClass('')
    }
    prevPathRef.current = curr
  }, [location.pathname])

  const isDetail = /^\/(guide|cert|career)\//.test(location.pathname) || location.pathname === '/settings'
  const [routeAnn, setRouteAnn] = useState('')

  useEffect(() => {
    const p = location.pathname
    const ann =
      p === '/'            ? 'Guides' :
      p.startsWith('/guide/') ? 'Guide detail' :
      p.startsWith('/work')   ? 'Work and jobs' :
      p.startsWith('/cert/')  ? 'Certificate detail' :
      p.startsWith('/career/')? 'Career path detail' :
      p === '/saves'      ? 'Saved resources and UK Life' : ''
    setRouteAnn(ann)
  }, [location.pathname])

  const TABS = [
    { id: 'guides', path: '/', icon: <BookOpen size={22} strokeWidth={2} />, label: ui.guides },
    { id: 'work', path: '/work/jobs', icon: <Briefcase size={22} strokeWidth={2} />, label: ui.work },
    { id: 'saves', path: '/saves', icon: <Compass size={22} strokeWidth={2} />, label: ui.saves },
    { id: 'profile', path: '/profile', icon: <User size={22} strokeWidth={2} />, label: ui.profile || 'Me' },
  ]

  const isTabActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.replace('/jobs', ''))
  }

  // ── Tab switching with haptic feedback ──
  const switchTab = (path: string) => {
    navigator?.vibrate?.(10)
    navigate(path)
  }

  // ── Onboarding — shown once after first language selection ──
  const [showOnboarding, setShowOnboarding] = useState(false)
  const prevShowLang = useRef(showLang)
  useEffect(() => {
    // When language overlay closes for the first time, check if we should show onboarding
    if (prevShowLang.current && !showLang && shouldShowOnboarding()) {
      setShowOnboarding(true)
    }
    prevShowLang.current = showLang
  }, [showLang])

  // ── Language overlay focus trap ──
  const langOverlayRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!showLang) return
    const el = langOverlayRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowLang(false); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    el.addEventListener('keydown', trap)
    return () => el.removeEventListener('keydown', trap)
  }, [showLang, setShowLang])

  // ── Back-to-top button ──
  const mainRef = useRef<HTMLElement>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => setShowBackToTop(el.scrollTop > 300)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    navigator?.vibrate?.(10)
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset scroll position on tab/route change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [location.pathname])

  // ── Pull-to-refresh ──
  const ptrTouchY = useRef(0)
  const ptrActive = useRef(false)
  const [ptrPulling, setPtrPulling] = useState(false)
  const PTR_THRESHOLD = 72

  const handlePtrTouchStart = (e: ReactTouchEvent<HTMLElement>) => {
    const el = mainRef.current
    if (!el || el.scrollTop > 0) return
    ptrTouchY.current = e.touches[0].clientY
    ptrActive.current = true
  }

  const handlePtrTouchMove = (e: ReactTouchEvent<HTMLElement>) => {
    if (!ptrActive.current) return
    const delta = e.touches[0].clientY - ptrTouchY.current
    if (delta > 8) setPtrPulling(true)
    if (delta > PTR_THRESHOLD) e.preventDefault()
  }

  const handlePtrTouchEnd = (e: ReactTouchEvent<HTMLElement>) => {
    if (!ptrActive.current) return
    ptrActive.current = false
    const delta = e.changedTouches[0].clientY - ptrTouchY.current
    if (delta >= PTR_THRESHOLD) {
      navigator?.vibrate?.(20)
      window.location.reload()
    } else {
      setPtrPulling(false)
    }
  }

  // ── Swipe between tabs (react-swipeable) ──
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isDetail) return
      const currIdx = TABS.findIndex(t => isTabActive(t.path))
      if (currIdx !== -1 && currIdx < TABS.length - 1) {
        navigator?.vibrate?.(10)
        navigate(TABS[currIdx + 1].path)
      }
    },
    onSwipedRight: () => {
      if (isDetail) return
      const currIdx = TABS.findIndex(t => isTabActive(t.path))
      if (currIdx > 0) {
        navigator?.vibrate?.(10)
        navigate(TABS[currIdx - 1].path)
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50,
    swipeDuration: 500,
  })

  return (
    <div className={`app-root ${dark ? 'dark' : ''} ${fontClass}`} dir={dir}>

      {/* SKIP-TO-CONTENT for keyboard navigation */}
      <a href="#main-content" className="skip-link">{ui.skipToContent || 'Skip to content'}</a>

      {/* SCREEN READER ROUTE ANNOUNCER */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">{routeAnn}</span>

      {/* LANGUAGE OVERLAY */}
      {showLang && (
        <div className="lang-overlay" role="dialog" aria-modal="true" aria-labelledby="lang-overlay-title" ref={langOverlayRef}>
          <div className={styles.langOverlayHeader}>
            <div className="header-brand"><Logo size={28} /><h1 id="lang-overlay-title" className={styles.langOverlayTitle}>New Life UK</h1></div>
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
            <button className="btn-settings" onClick={() => navigate('/settings')} aria-label={ui.settings}><Settings size={18} strokeWidth={2} /></button>
            <button className="btn-sos" onClick={() => { navigator?.vibrate?.(15); setSOS(true) }} aria-label="Emergency SOS">{ui.sos}</button>
          </div>
        </header>
      )}

      {/* TOAST NOTIFICATIONS (sonner) */}
      <Toaster
        position="top-center"
        richColors
        theme={dark ? 'dark' : 'light'}
        toastOptions={{
          duration: 2200,
          style: { borderRadius: 'var(--r, 12px)', fontSize: '0.9rem' },
        }}
      />

      {/* SCROLLABLE CONTENT */}
      <main
        className={`app-scroll ${navClass}`}
        id="main-content"
        data-scroll-container
        ref={mainRef}
        onTouchStart={handlePtrTouchStart}
        onTouchMove={handlePtrTouchMove}
        onTouchEnd={handlePtrTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        {ptrPulling && (
          <div className="ptr-indicator" aria-hidden="true">
            <div className="ptr-spinner" />
          </div>
        )}
        <ErrorBoundary>
          <Suspense fallback={<SkeletonFallback />}>
            <div {...(!isDetail ? swipeHandlers : {})}>
              <Routes>
                <Route path="/" element={<GuidesPage />} />
                <Route path="/guide/:id" element={<GuideDetail />} />
                <Route path="/work" element={<Navigate to="/work/jobs" replace />} />
                <Route path="/work/:subtab" element={<WorkHub />} />
                <Route path="/cert/:id" element={<CertDetail />} />
                <Route path="/career/:id" element={<CareerDetail />} />
                <Route path="/saves" element={<SavesPage />} />
                <Route path="/saves/apps" element={<Navigate to="/saves" replace />} />
                <Route path="/culture" element={<Navigate to="/saves" replace />} />
                <Route path="/settings" element={<MorePage />} />
                <Route path="/more" element={<Navigate to="/settings" replace />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* TAB BAR */}
      {!isDetail && !showLang && (
        <nav className="tab-bar" aria-label="Main navigation">
          <div role="tablist" className={styles.tabListContents}>
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn ${isTabActive(t.path) ? 'active' : ''}`}
                onClick={() => switchTab(t.path)} role="tab" aria-selected={isTabActive(t.path)}
                aria-current={isTabActive(t.path) ? 'page' : undefined} aria-label={t.label}>
                {isTabActive(t.path) && <div className="tab-dot" />}
                <span className="tab-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* BACK-TO-TOP BUTTON — visible when scrolled down */}
      {(
        <button
          className={`back-to-top${showBackToTop ? ' visible' : ''}${isDetail ? ' no-tab-bar' : ''}`}
          onClick={scrollToTop}
          aria-label={ui.backToTop || 'Back to top'}
          tabIndex={showBackToTop ? 0 : -1}
        >
          <ChevronUp size={22} strokeWidth={2.5} />
        </button>
      )}

      {/* SOS MODAL — focus-trapped, no backdrop dismiss (safety-critical) */}
      <SOSModal showSOS={showSOS} setSOS={setSOS} ui={ui} SOS_NUMBERS={SOS_NUMBERS} />

      {/* ONBOARDING OVERLAY — shown once after first language selection */}
      {showOnboarding && (
        <OnboardingOverlay ui={ui} onDone={() => setShowOnboarding(false)} />
      )}

      {/* CONSENT BANNER — shown once on first visit when Sentry is configured */}
      <ConsentBanner ui={ui} />
    </div>
  )
}
