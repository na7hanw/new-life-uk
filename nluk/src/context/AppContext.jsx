import { createContext, useContext, useState, useEffect } from 'react'
import { LANGS, UI } from '../data/ui-strings.js'
import { ls, lsSet } from '../lib/utils.js'

const AppContext = createContext(null)

// Detect the best supported language from the browser's preferences
function detectBrowserLang() {
  const supported = new Set(LANGS.map(l => l.code))
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const full of candidates) {
    const code = full.toLowerCase().slice(0, 2)
    if (supported.has(code)) return code
  }
  return 'en'
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = ls('nluk_lang', '')
    if (saved) return saved
    // Auto-detect browser language on first visit
    return detectBrowserLang()
  })
  const [dark, setDark] = useState(() => ls('nluk_dark', '') === 'true')
  const [showSOS, setSOS] = useState(false)
  const [showLang, setShowLang] = useState(() => !ls('nluk_lang', ''))

  useEffect(() => {
    const L2 = LANGS.find(l => l.code === lang) || LANGS[0]
    lsSet('nluk_lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = L2.rtl ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => { lsSet('nluk_dark', String(dark)) }, [dark])

  const L = LANGS.find(l => l.code === lang) || LANGS[0]
  const ui = UI[lang] || UI.en
  const dir = L.rtl ? 'rtl' : 'ltr'
  const fontClass = L.ar ? '' : L.eth ? 'eth-font' : ''
  const ab = L.rtl ? '→' : '←'
  const af = L.rtl ? '‹' : '›'

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark, showSOS, setSOS, showLang, setShowLang, ui, L, dir, fontClass, ab, af }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
