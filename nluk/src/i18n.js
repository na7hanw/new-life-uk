// ─── i18next Setup ───────────────────────────────────────────────
// Initialises react-i18next using the existing UI translation objects.
// Components may use the `useTranslation` hook from react-i18next
// alongside (or instead of) the `ui` object from AppContext.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { UI } from './data/ui-strings.js'

// Build i18next resources from existing flat UI translation objects
// Note: only the top-level `status` nested object is flattened here
// because it is the only nested key in the current UI strings schema.
const resources = {}
Object.entries(UI).forEach(([lang, strings]) => {
  // Flatten nested `status` object so keys are accessible as e.g. t('status.refugee')
  const flat = { ...strings }
  if (strings.status) {
    Object.entries(strings.status).forEach(([k, v]) => {
      flat[`status.${k}`] = v
    })
  }
  resources[lang] = { translation: flat }
})

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values; disable i18next double-escaping
      escapeValue: false,
    },
  })

export default i18n
