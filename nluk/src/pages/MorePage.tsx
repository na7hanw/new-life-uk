import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext.tsx'
import { GITHUB_URL } from '../data/emergency.ts'
import { ls, lsSet } from '../lib/utils.ts'
import { clearTranslationCache } from '../lib/translate.ts'
import { SENTRY_DSN, initSentry } from '../lib/sentry.ts'
import { CONSENT_KEY } from '../components/ConsentBanner.tsx'
import type { BeforeInstallPromptEvent, UserStatus } from '../types'
import styles from './MorePage.module.css'

const ALL_KEYS = ['nluk_lang', 'nluk_dark', 'nluk_wtab', 'nluk_tx3', 'nluk_status', CONSENT_KEY]

export default function MorePage() {
  const { ui, L, dark, setDark, setShowLang, userStatus, setUserStatus, ab } = useApp()
  const navigate = useNavigate()
  const [offlineReady, setOfflineReady] = useState(false)
  const [consent, setConsent] = useState(() => ls(CONSENT_KEY, ''))
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDone, setInstallDone] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setOfflineReady(true)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstallDone(true); setInstallPrompt(null) }
  }

  const toggleConsent = () => {
    const next = consent === 'granted' ? 'denied' : 'granted'
    lsSet(CONSENT_KEY, next)
    setConsent(next)
    if (next === 'granted') initSentry()
  }

  return (
    <div className="page-enter">
      <div className={`detail-header ${styles.settingsHeader}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className={`page-hero ${styles.settingsHero}`}>
          <h2 className="page-hero-title">⚙ {ui.settings}</h2>
          <p className="page-hero-sub">{ui.settingsSub}</p>
        </div>
      </div>

      <div className="section-label">{ui.theme}</div>
      <div className={`card ${styles.cardGutter}`}>
        <div className={styles.cardRow}>
          <span className={styles.cardRowLabel}>{dark ? ui.darkMode : ui.lightMode}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setDark(!dark)}>
            {dark ? ui.lightMode : ui.darkMode}
          </button>
        </div>
      </div>

      {(installPrompt || installDone) && (
        <div className={`card ${styles.cardGutter}`}>
          <div className={styles.cardRow}>
            <span className={styles.cardRowLabel}>{ui.installApp || '📲 Install App'}</span>
            <button className="btn btn-outline btn-sm" onClick={handleInstall} disabled={installDone}>
              {installDone ? (ui.installDone || 'Installed!') : '📲 Install'}
            </button>
          </div>
        </div>
      )}

      <div className="section-label">{ui.language}</div>
      <div className={`card ${styles.cardGutter}`}>
        <div className={styles.cardRow}>
          <span className={styles.cardRowLabel}>{L.flag} {L.native}</span>
          <button className="btn btn-outline btn-sm" onClick={() => setShowLang(true)}>{ui.change}</button>
        </div>
      </div>

      {/* Standalone "Clear all data" card (P2) */}
      <div className={`card ${styles.cardGutter}`}>
        <div className={styles.cardRow}>
          <span className={styles.cardRowLabel}>🗑 {ui.clearData || 'Clear all app data'}</span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              clearTranslationCache()
              ALL_KEYS.forEach(k => {
                try { localStorage.removeItem(k) } catch (err) {
                  if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.warn(`[nluk] Failed to clear localStorage key "${k}":`, err)
                  }
                }
              })
              window.location.reload()
            }}
          >
            {ui.clearData || 'Clear data'}
          </button>
        </div>
      </div>

      <div className="section-label">👤 {ui.statusLabel || 'My Situation'}</div>
      <div className={`card ${styles.cardGutter}`}>
        {([
          { value: 'asylum-seeker' as UserStatus, label: ui.statusAsylumSeeker || '⏳ Asylum seeker — waiting for my decision' },
          { value: 'refugee'       as UserStatus, label: ui.statusRefugee       || '✅ Recognised refugee' },
          { value: 'other-visa'    as UserStatus, label: ui.statusOtherVisa     || '🛂 Another visa (Skilled Worker, Family, Student…)' },
          { value: 'settled'       as UserStatus, label: ui.statusSettled       || '🇬🇧 Settled / Pre-Settled Status' },
        ]).map(opt => (
          <button key={opt.value} className="settings-row"
            onClick={() => setUserStatus(userStatus === opt.value ? '' : opt.value)}
            aria-label={opt.label} aria-pressed={userStatus === opt.value}>
            <span className={styles.statusLabel}>{opt.label}</span>
            {userStatus === opt.value && <span className={styles.statusCheck}>✓</span>}
          </button>
        ))}
        <div className={styles.statusFooter}>
          <p className={styles.statusFooterText}>
            {ui.statusPickerSub || 'Optional — helps us show the most relevant guides first.'}
          </p>
        </div>
      </div>

      <div className="section-label">🔒 {ui.privacy || 'Privacy & Data'}</div>
      <div className={`card ${styles.cardGutter}`}>
        <button
          className={styles.cardRow}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '14px 16px' }}
          onClick={() => setPrivacyOpen(o => !o)}
          aria-expanded={privacyOpen}
        >
          <span className={styles.cardRowLabel}>{ui.privacyTitle || 'Your Privacy'} — No data collected. GDPR compliant.</span>
          <ChevronDown size={16} strokeWidth={2.5} style={{ color: 'var(--t3)', transition: 'transform .2s', transform: privacyOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {privacyOpen && (
          <div className={styles.cardBody}>

          {/* ── What this app stores ── */}
          <p className={styles.privacyTitle}>
            {ui.privacyTitle || 'Your Privacy'}
          </p>
          <p className={styles.privacyBody}>
            {ui.privacyBody || 'This app stores only your language preference and theme setting locally on your device. No personal information is collected or shared. There are no cookies and no user accounts.'}
          </p>

          <p className={styles.privacyLocalLabel}>{ui.privacyLocal || 'Stored locally on your device only:'}</p>
          <ul className={styles.privacyKeyList}>
            {([
              ['nluk_lang',    ui.privacyKeyLang    || 'Language preference'],
              ['nluk_dark',    ui.privacyKeyTheme   || 'Dark / light mode'],
              ['nluk_wtab',    ui.privacyKeyTab     || 'Last work tab viewed'],
              ['nluk_status',  ui.statusLabel       || 'Your situation (asylum seeker / refugee etc.)'],
              ['nluk_tx3',     'Cached translations (auto-translate)'],
              [CONSENT_KEY,    ui.privacyKeyConsent || 'Your crash-report consent choice'],
            ] as [string, string][]).map(([k, v]) => (
              <li key={k} className={styles.privacyKeyItem}>
                <code className={styles.privacyKeyCode}>{k}</code>{v}
              </li>
            ))}
          </ul>

          {/* ── Crash reporting (Sentry) ── */}
          {SENTRY_DSN && (
            <>
              <p className={styles.crashTitle}>
                {ui.privacyCrashTitle || '🐛 Anonymous crash reports'}
              </p>
              <p className={styles.crashBody}>
                {ui.privacyCrashBody || 'With your permission, the app sends anonymous error reports to Sentry (sentry.io) when it crashes. This helps us fix bugs. No personal information is included. No session recordings are made. You can opt out at any time below.'}
              </p>
              <div className={styles.crashRow}>
                <span className={styles.crashStatus}>
                  {consent === 'granted'
                    ? (ui.privacyCrashOn  || '✅ Crash reports: on')
                    : (ui.privacyCrashOff || '❌ Crash reports: off')}
                </span>
                <button className="btn btn-outline btn-sm" onClick={toggleConsent}>
                  {consent === 'granted'
                    ? (ui.privacyCrashDisable || 'Turn off')
                    : (ui.privacyCrashEnable  || 'Turn on')}
                </button>
              </div>
              <p className={styles.crashFooter}>
                {ui.privacyCrashSentry || 'Sentry is an independent service. See'}{' '}
                <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer"
                  aria-label="Sentry privacy policy (opens in new tab)"
                  className={styles.crashLink}>
                  sentry.io/privacy
                </a>
              </p>
            </>
          )}

          {/* ── UK GDPR rights ── */}
          <p className={styles.gdprTitle}>
            {ui.gdprRightsTitle || '⚖️ Your UK GDPR rights'}
          </p>
          <p className={styles.gdprBody}>
            {ui.gdprRightsBody || "Under UK GDPR you have the right to access, correct, and erase your data. Use the button below to delete all locally stored data at any time. To exercise rights over crash-report data held by Sentry, contact us at hello@newlifeuk.org. You also have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk."}
          </p>
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer"
            aria-label="ICO — make a complaint (opens in new tab)"
            className={styles.gdprLink}>
            {ui.gdprIco || 'ICO — make a complaint →'}
          </a>

          {/* ── Data controller ── */}
          <p className={styles.controllerTitle}>
            {ui.privacyControllerTitle || '🏢 Data controller'}
          </p>
          <p className={styles.controllerBody}>
            {ui.privacyControllerBody || 'New Life UK · hello@newlifeuk.org · Open-source, non-commercial project.'}
          </p>

          {/* ── Full privacy policy ── */}
          <p className={styles.policyWrapper}>
            <a
              href="https://github.com/na7hanw/new-life-uk/blob/main/PRIVACY.md"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Full privacy policy (opens in new tab)"
              className={styles.policyLink}
            >
              {ui.privacyPolicyLink || '📄 Full privacy policy →'}
            </a>
          </p>
        </div>
        )}
      </div>

      <div className="version-badge" aria-label="App version and data verification date">
        🛡 v{import.meta.env.VITE_APP_VERSION || '2.2.0'} · Data verified March 2026
        {offlineReady && <span className="offline-badge">📴 Available Offline</span>}
      </div>

      <div className="footer-disc">
        <strong>Last verified: March 2026</strong><br />
        {ui.disclaimer}<br /><br />
        Built with care for people who need it most.<br />
        Found outdated info? Email{' '}
        <a href="mailto:hello@newlifeuk.org" className={styles.footerEmailLink}>
          hello@newlifeuk.org
        </a>
        <br /><br />
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
          className={styles.githubLink}>
          <span>⭐</span> {ui.sourceCode || 'View Source on GitHub'}
        </a>
      </div>
      <div className={styles.bottomSpacer} />
    </div>
  )
}
