/**
 * Shared TypeScript types derived from the Zod schemas in schema.test.ts.
 * Using z.infer keeps the runtime validation and compile-time types in sync.
 */
import { z } from 'zod'
import { type Dispatch, type SetStateAction } from 'react'

// ─── Primitive schemas (mirrors schema.test.ts) ─────────────────────────────

export const LinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
})

export const GuideContentSchema = z.object({
  en: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    steps: z.array(z.string().min(1)).min(1),
  }),
})

export const GuideSchema = z.object({
  id: z.string().min(1),
  cat: z.string().min(1),
  icon: z.string().min(1),
  content: GuideContentSchema,
  links: z.array(LinkSchema).optional(),
  cost: z.string().optional(),
  time: z.string().optional(),
  bring: z.array(z.string()).optional(),
})

export const CertContentSchema = z.object({
  en: z.object({
    title: z.string().min(1),
    sector: z.string().optional(),
  }),
})

export const CertSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  content: CertContentSchema,
  cost: z.string().min(1),
  time: z.string().min(1),
  freeRoute: z.string().min(1),
  steps: z.object({
    en: z.array(z.string().min(1)).min(1),
  }),
  links: z.array(LinkSchema).optional(),
  studyLinks: z.array(LinkSchema).optional(),
})

export const CareerSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  content: z.object({
    en: z.object({
      title: z.string().min(1),
      salary: z.string().min(1),
    }),
  }),
  tags: z.array(z.string()).min(1),
  steps: z.object({
    en: z.array(z.string().min(1)).min(1),
  }),
  links: z.array(LinkSchema).optional(),
})

export const SosEntrySchema = z.object({
  name: z.string().min(1),
  num: z.string().min(1),
  phone: z.string().min(1),
  note: z.string().optional(),
  hours: z.string().optional(),
})

// ─── Inferred types ─────────────────────────────────────────────────────────

export type Link = z.infer<typeof LinkSchema>
export type Guide = z.infer<typeof GuideSchema>
export type Cert = z.infer<typeof CertSchema>
export type Career = z.infer<typeof CareerSchema>
export type SosEntry = z.infer<typeof SosEntrySchema>

// ─── Additional types not covered by Zod schemas ────────────────────────────

export interface Lang {
  code: string
  native: string
  flag: string
  rtl?: boolean
  ar?: boolean
  eth?: boolean
}

/** A localised content map keyed by language code. */
export type I18nContent<T> = { en: T } & Partial<Record<string, T>>

export interface JobApplyLink {
  name: string
  url: string
}

export interface JobContent {
  role: string
  desc: string
}

export interface Job {
  icon: string
  pay: string
  visa?: boolean
  tags?: string[]
  docs?: string[]
  content: I18nContent<JobContent>
  applyLinks?: JobApplyLink[]
}

export interface SaveContent {
  title: string
  desc: string
}

export interface SaveItem {
  icon: string
  content: I18nContent<SaveContent>
  url?: string
}

export interface HelplineEntry {
  name: string
  num: string
  phone: string
  hours?: string
}

export interface UiStrings {
  app: string
  tag: string
  sos: string
  close: string
  back: string
  change: string
  home: string
  guides: string
  work: string
  saves: string
  more: string
  search: string
  noResults: string
  searchWork?: string
  cost: string
  time: string
  bring: string
  steps: string
  keyInfo: string
  visaQ: string
  forYou: string
  quickActions: string
  helplines: string
  jobsTab: string
  certsTab: string
  careerTab: string
  savesTitle: string
  savesSub: string
  gemsTitle: string
  gemsSub: string
  theme: string
  language: string
  apply: string
  freeRoute: string
  darkMode: string
  lightMode: string
  settings: string
  share: string
  shareWhatsapp: string
  shareTelegram: string
  shareFacebook: string
  shareCopy: string
  copied: string
  qaEvisa: string
  qaShare: string
  qaBank: string
  qaGP: string
  qaBenefits: string
  qaID: string
  qaTravel: string
  qaSafety: string
  status: Record<string, string>
  openLink: string
  studyLinks: string
  applyLinks: string
  sourceCode: string
  docsNeeded: string
  jobsApplyTo: string
  privacy: string
  privacyTitle: string
  sosDesc?: string
  disclaimer?: string
  privacyBody?: string
  privacyLocal?: string
  privacyNone?: string
  gdprRights?: string
  // PR #11
  ttsListen?: string
  ttsStop?: string
  skipToContent?: string
  loading?: string
  // PR #14
  autoTranslated?: string
  translating?: string
  installApp?: string
  installDone?: string
  langSuggest?: string
  langSuggestUse?: string
  langSuggestDismiss?: string
  // PR #23
  privacyKeyLang?: string
  privacyKeyTheme?: string
  privacyKeyTab?: string
  privacyKeyConsent?: string
  privacyCrashTitle?: string
  privacyCrashBody?: string
  privacyCrashOn?: string
  privacyCrashOff?: string
  privacyCrashEnable?: string
  privacyCrashDisable?: string
  privacyCrashSentry?: string
  gdprRightsTitle?: string
  gdprRightsBody?: string
  gdprIco?: string
  privacyControllerTitle?: string
  privacyControllerBody?: string
  clearData?: string
  consentTitle?: string
  consentBody?: string
  consentAccept?: string
  consentDecline?: string
  [key: string]: unknown
}

export interface AppContextValue {
  lang: string
  setLang: (lang: string) => void
  dark: boolean
  setDark: Dispatch<SetStateAction<boolean>>
  showSOS: boolean
  setSOS: (show: boolean) => void
  showLang: boolean
  setShowLang: (show: boolean) => void
  ui: UiStrings
  L: Lang
  dir: 'ltr' | 'rtl'
  fontClass: string
  ab: string
  af: string
}

// ─── Browser API extensions ──────────────────────────────────────

/** PWA install prompt event (not yet in the standard TS lib). */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): void
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}
