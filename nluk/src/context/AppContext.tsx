import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { LANGS, UI } from '../data/ui-strings.ts'
import { ls, lsSet } from '../lib/utils.ts'
import type { AppContextValue, UserStatus, UserAmbition, UserSector, TargetLane, EcctisStatus } from '../types'

const AppContext = createContext<AppContextValue | null>(null)

// Detect the best supported language from the browser's preferences
function detectBrowserLang(): string {
  const supported = new Set(LANGS.map(l => l.code))
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const full of candidates) {
    const code = full.toLowerCase().slice(0, 2)
    if (supported.has(code)) return code
  }
  return 'en'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>(() => {
    const saved = ls('nluk_lang', '')
    if (saved) return saved
    // Auto-detect browser language on first visit
    return detectBrowserLang()
  })
  const [dark, setDark] = useState<boolean>(() => ls('nluk_dark', '') === 'true')
  const [showSOS, setSOS] = useState<boolean>(false)
  const [showLang, setShowLang] = useState<boolean>(() => !ls('nluk_lang', ''))
  const [userStatus, setUserStatus] = useState<UserStatus>(() => ls('nluk_status', '') as UserStatus)
  const [statusDate, setStatusDate] = useState<string>(() => ls('nluk_status_date', ''))
  const [claimDate, setClaimDate] = useState<string>(() => ls('nluk_claim_date', ''))
  const [userAmbition, setUserAmbition] = useState<UserAmbition>(() => ls('nluk_ambition', '') as UserAmbition)
  const [userSector, setUserSector] = useState<UserSector>(() => ls('nluk_sector', '') as UserSector)
  const [documentsHeld, setDocumentsHeld] = useState<string[]>(() => {
    try { return JSON.parse(ls('nluk_docs', '[]')) } catch { return [] }
  })
  const [userPostcode, setUserPostcode] = useState<string>(() => ls('nluk_postcode', ''))
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(ls('nluk_bookmarks', '[]')) } catch { return [] }
  })
  const [targetLane, setTargetLane] = useState<TargetLane>(() => ls('nluk_target_lane', '') as TargetLane)
  const [credentialsHeld, setCredentialsHeld] = useState<string[]>(() => {
    try { return JSON.parse(ls('nluk_credentials', '[]')) } catch { return [] }
  })
  const [ecctisStatus, setEcctisStatus] = useState<EcctisStatus>(() => ls('nluk_ecctis', '') as EcctisStatus)

  useEffect(() => {
    const L2 = LANGS.find(l => l.code === lang) || LANGS[0]
    lsSet('nluk_lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = L2.rtl ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => { lsSet('nluk_dark', String(dark)) }, [dark])
  useEffect(() => { lsSet('nluk_status', userStatus) }, [userStatus])
  useEffect(() => { lsSet('nluk_status_date', statusDate) }, [statusDate])
  useEffect(() => { lsSet('nluk_claim_date', claimDate) }, [claimDate])
  useEffect(() => { lsSet('nluk_ambition', userAmbition) }, [userAmbition])
  useEffect(() => { lsSet('nluk_sector', userSector) }, [userSector])
  useEffect(() => { lsSet('nluk_docs', JSON.stringify(documentsHeld)) }, [documentsHeld])
  useEffect(() => { lsSet('nluk_postcode', userPostcode) }, [userPostcode])
  useEffect(() => { lsSet('nluk_bookmarks', JSON.stringify(bookmarks)) }, [bookmarks])
  useEffect(() => { lsSet('nluk_target_lane', targetLane) }, [targetLane])
  useEffect(() => { lsSet('nluk_credentials', JSON.stringify(credentialsHeld)) }, [credentialsHeld])
  useEffect(() => { lsSet('nluk_ecctis', ecctisStatus) }, [ecctisStatus])

  const toggleDocument = (docId: string) => {
    setDocumentsHeld(prev =>
      prev.includes(docId) ? prev.filter(d => d !== docId) : [...prev, docId]
    )
  }

  const toggleBookmark = (id: string) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const toggleCredential = (certId: string) => {
    setCredentialsHeld(prev =>
      prev.includes(certId) ? prev.filter(c => c !== certId) : [...prev, certId]
    )
  }

  // Derived: next cert to pursue in the lifting lane (A40 → A62)
  const nextLiftingCredential: string = (() => {
    if (targetLane !== 'lifting') return ''
    if (!credentialsHeld.includes('cpcs-a40')) return 'cpcs-a40'
    if (!credentialsHeld.includes('cpcs-a62')) return 'cpcs-a62'
    return ''
  })()

  const L = LANGS.find(l => l.code === lang) || LANGS[0]
  const ui = UI[lang] || UI.en
  const dir = L.rtl ? 'rtl' : 'ltr'
  const fontClass = L.ar ? '' : L.eth ? 'eth-font' : ''
  const ab = L.rtl ? '→' : '←'
  const af = L.rtl ? '‹' : '›'

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark, showSOS, setSOS, showLang, setShowLang, userStatus, setUserStatus, statusDate, setStatusDate, claimDate, setClaimDate, userAmbition, setUserAmbition, userSector, setUserSector, documentsHeld, toggleDocument, userPostcode, setUserPostcode, bookmarks, toggleBookmark, targetLane, setTargetLane, credentialsHeld, toggleCredential, ecctisStatus, setEcctisStatus, nextLiftingCredential, ui, L, dir, fontClass, ab, af }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
