/**
 * Shared TypeScript types derived from the Zod schemas in lib/schema.ts.
 * Using z.infer keeps the runtime validation and compile-time types in sync.
 */
import { z } from 'zod'
import { type Dispatch, type SetStateAction } from 'react'
import {
  LinkSchema,
  GuideSchema,
  CertSchema,
  CareerSchema,
  SOSSchema,
} from './lib/schema'

// ─── Inferred types ─────────────────────────────────────────────────────────

export type Link = z.infer<typeof LinkSchema>
export type Guide = z.infer<typeof GuideSchema>
export type Cert = z.infer<typeof CertSchema>
export type Career = z.infer<typeof CareerSchema>
export type SosEntry = z.infer<typeof SOSSchema>

// ─── Additional types not covered by Zod schemas ────────────────────────────

export type UserStatus = 'asylum-seeker' | 'refugee' | 'other-visa' | 'settled' | ''

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
  [key: string]: unknown
}

export interface SaveItem {
  icon: string
  content: I18nContent<SaveContent>
  url?: string
  cat?: string
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
  culture: string
  profile?: string
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
  sosLabel?: string
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
  // Task 16 — status selector
  statusPickerTitle?: string
  statusPickerSub?: string
  statusAsylumSeeker?: string
  statusRefugee?: string
  statusOtherVisa?: string
  statusSettled?: string
  statusSkip?: string
  statusLabel?: string
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
  privacyPolicyLink?: string
  clearData?: string
  consentTitle?: string
  consentBody?: string
  consentAccept?: string
  consentDecline?: string
  appsTitle?: string
  appsSub?: string
  discoverFreeTab?: string
  discoverGemsTab?: string
  searchDiscover?: string
  settingsSub?: string
  cultureTitle?: string
  cultureSub?: string
  searchCulture?: string
  copyTip?: string
  heroTitle?: string
  heroSub?: string
  heroBadge?: string
  brpNotice?: string
  notFoundTitle?: string
  notFoundSub?: string
  notFoundHome?: string
  // UX improvements
  pullToRefresh?: string
  backToTop?: string
  bookmark?: string
  unbookmark?: string
  bookmarksTitle?: string
  bookmarksSub?: string
  onboardingSkip?: string
  onboardingNext?: string
  onboardingDone?: string
  readingProgress?: string
  // Quick actions — housing and legal additions
  qaHousing?: string
  qaLegal?: string
  // My Checklist feature
  myChecklist?: string
  checklistIntro?: string
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
  userStatus: UserStatus
  setUserStatus: (s: UserStatus) => void
  bookmarks: string[]
  toggleBookmark: (id: string) => void
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
