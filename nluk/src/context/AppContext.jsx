import { createContext, useContext, useState, useEffect } from 'react'
import { LANGS, UI } from '../data/ui-strings.js'
import { ls, lsSet } from '../lib/utils.js'
import i18n from '../i18n.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => ls('nluk_lang', 'en'))
  const [dark, setDark] = useState(() => ls('nluk_dark', '') === 'true')
  const [showSOS, setSOS] = useState(false)
  const [showLang, setShowLang] = useState(() => !ls('nluk_lang', ''))

  useEffect(() => {
    const L2 = LANGS.find(l => l.code === lang) || LANGS[0]
    lsSet('nluk_lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = L2.rtl ? 'rtl' : 'ltr'
    // Keep i18next in sync so components using useTranslation() reflect the new language
    i18n.changeLanguage(lang)
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
