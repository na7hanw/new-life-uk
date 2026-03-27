/**
 * Content schema validation using Zod.
 * Ensures guide/cert/career/app data is structurally valid before it reaches users.
 */
import { describe, it, expect } from 'vitest'
import { CERTS, CAREERS, CERT_SOURCE_URL, CAREER_SOURCE_URL } from '../data/jobs.ts'
import { GUIDE_MAP, GUIDE_SOURCE_URL, GUIDE_TRUST_LEVEL } from '../data/guides.ts'
import { APPS, APP_SOURCE_URL, APP_TRUST_LEVEL } from '../data/apps.ts'
import { SOS_NUMBERS } from '../data/emergency.ts'
import { GuideSchema, CertSchema, CareerSchema, SOSSchema, SaveItemSchema, SourceLabelSchema } from '../lib/schema.ts'

/** Guide IDs where financial, legal, or immigration advice is given. */
const HIGH_RISK_GUIDE_IDS = [
  // Immigration
  'asylum-waiting', 'evisa', 'sharecode', 'permission-to-work', 'ilr', 'move-on', 'nrpf',
  // Financial
  'uc', 'bank', 'credit-score', 'tax', 'ni', 'investing',
  // Business & Money
  'sole-trader', 'limited-company', 'home-business', 'business-records',
  'companies-house-id', 'cic', 'before-you-invest', 'scam-warnings',
]

/** App titles that deal with official identity, financial, or legal services. */
const HIGH_RISK_APP_TITLES = [
  'GOV.UK One Login',
  'Companies House — Register & File',
  'National Careers Service',
  'Free Courses for Jobs — GOV.UK',
  'Skills Bootcamps — GOV.UK',
  'Register as Self-Employed — HMRC',
  'Companies House — Register a Company',
  'Set Up a Social Enterprise / CIC',
  'MoneyHelper — Free Money Guidance',
  'FCA Financial Services Register',
  'Action Fraud — Report Scams',
  'NHS App',
  'Universal Credit — Manage Your Claim',
  'UKVI — Check Your Immigration Status',
]

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Guide schema', () => {
  it('all guides pass schema validation', () => {
    const guides = Object.values(GUIDE_MAP)
    expect(guides.length).toBeGreaterThan(0)
    for (const guide of guides) {
      const result = GuideSchema.safeParse(guide)
      if (!result.success) {
        throw new Error(`Guide "${guide.id}" failed: ${result.error.message}`)
      }
    }
  })

  it('all guides have a sourceUrl', () => {
    const guides = Object.values(GUIDE_MAP)
    for (const guide of guides) {
      expect(
        GUIDE_SOURCE_URL[guide.id],
        `Guide "${guide.id}" is missing a GUIDE_SOURCE_URL`
      ).toBeTruthy()
    }
  })

  it('all guide sourceUrls are valid https URLs', () => {
    for (const [id, url] of Object.entries(GUIDE_SOURCE_URL)) {
      expect(url, `Guide "${id}" sourceUrl must start with https://`).toMatch(/^https:\/\//)
    }
  })
})

describe('Cert schema', () => {
  it('all certs pass schema validation', () => {
    expect(CERTS.length).toBeGreaterThan(0)
    for (const cert of CERTS) {
      const result = CertSchema.safeParse(cert)
      if (!result.success) {
        throw new Error(`Cert "${cert.id}" failed: ${result.error.message}`)
      }
    }
  })

  it('all certs have a stable string id', () => {
    for (const cert of CERTS) {
      expect(typeof cert.id).toBe('string')
      expect(cert.id.length).toBeGreaterThan(0)
    }
  })

  it('all certs have a sourceUrl', () => {
    for (const cert of CERTS) {
      expect(
        CERT_SOURCE_URL[cert.id],
        `Cert "${cert.id}" is missing a CERT_SOURCE_URL`
      ).toBeTruthy()
    }
  })

  it('all cert sourceUrls are valid https URLs', () => {
    for (const [id, url] of Object.entries(CERT_SOURCE_URL)) {
      expect(url, `Cert "${id}" sourceUrl must start with https://`).toMatch(/^https:\/\//)
    }
  })
})

describe('Career schema', () => {
  it('all careers pass schema validation', () => {
    expect(CAREERS.length).toBeGreaterThan(0)
    for (const career of CAREERS) {
      const result = CareerSchema.safeParse(career)
      if (!result.success) {
        throw new Error(`Career "${career.id}" failed: ${result.error.message}`)
      }
    }
  })

  it('all careers have a stable string id', () => {
    for (const career of CAREERS) {
      expect(typeof career.id).toBe('string')
      expect(career.id.length).toBeGreaterThan(0)
    }
  })

  it('all careers have a sourceUrl', () => {
    for (const career of CAREERS) {
      expect(
        CAREER_SOURCE_URL[career.id],
        `Career "${career.id}" is missing a CAREER_SOURCE_URL`
      ).toBeTruthy()
    }
  })

  it('all career sourceUrls are valid https URLs', () => {
    for (const [id, url] of Object.entries(CAREER_SOURCE_URL)) {
      expect(url, `Career "${id}" sourceUrl must start with https://`).toMatch(/^https:\/\//)
    }
  })
})

describe('Emergency contacts schema', () => {
  it('all SOS numbers pass schema validation', () => {
    expect(SOS_NUMBERS.length).toBeGreaterThan(0)
    for (const entry of SOS_NUMBERS) {
      const result = SOSSchema.safeParse(entry)
      if (!result.success) {
        throw new Error(`SOS entry "${entry.name}" failed: ${result.error.message}`)
      }
    }
  })
})

// ─── SaveItem (apps) schema ───────────────────────────────────────────────────

describe('Apps / SaveItem schema', () => {
  it('all apps pass SaveItem schema validation', () => {
    expect(APPS.length).toBeGreaterThan(0)
    for (const app of APPS) {
      const result = SaveItemSchema.safeParse(app)
      if (!result.success) {
        throw new Error(`App "${app.content?.en?.title}" failed: ${result.error.message}`)
      }
    }
  })

  it('all app URLs are valid https URLs', () => {
    for (const [title, url] of Object.entries(APP_SOURCE_URL)) {
      expect(url, `App "${title}" sourceUrl must start with https://`).toMatch(/^https:\/\//)
    }
  })
})

// ─── Trust metadata — high-risk guide enforcement ────────────────────────────

describe('Trust metadata — high-risk guides', () => {
  it('all high-risk guides have a sourceUrl in GUIDE_SOURCE_URL', () => {
    for (const id of HIGH_RISK_GUIDE_IDS) {
      expect(
        GUIDE_SOURCE_URL[id],
        `High-risk guide "${id}" is missing a GUIDE_SOURCE_URL`
      ).toBeTruthy()
    }
  })

  it('all high-risk guide sourceUrls start with https://', () => {
    for (const id of HIGH_RISK_GUIDE_IDS) {
      const url = GUIDE_SOURCE_URL[id]
      if (url) {
        expect(url, `High-risk guide "${id}" sourceUrl must be https://`).toMatch(/^https:\/\//)
      }
    }
  })

  it('all high-risk guides have a trust level in GUIDE_TRUST_LEVEL', () => {
    for (const id of HIGH_RISK_GUIDE_IDS) {
      expect(
        GUIDE_TRUST_LEVEL[id],
        `High-risk guide "${id}" is missing a GUIDE_TRUST_LEVEL entry`
      ).toBeTruthy()
    }
  })

  it('all high-risk guides exist in GUIDE_MAP', () => {
    for (const id of HIGH_RISK_GUIDE_IDS) {
      expect(
        GUIDE_MAP[id],
        `HIGH_RISK_GUIDE_IDS contains unknown id: "${id}"`
      ).toBeTruthy()
    }
  })
})

// ─── Trust metadata — high-risk app enforcement ──────────────────────────────

describe('Trust metadata — high-risk apps', () => {
  it('all high-risk app titles have a trust level in APP_TRUST_LEVEL', () => {
    for (const title of HIGH_RISK_APP_TITLES) {
      expect(
        APP_TRUST_LEVEL[title],
        `High-risk app "${title}" is missing an APP_TRUST_LEVEL entry`
      ).toBeTruthy()
    }
  })

  it('all high-risk apps exist in APPS', () => {
    const appTitles = new Set(APPS.map(a => a.content?.en?.title))
    for (const title of HIGH_RISK_APP_TITLES) {
      expect(
        appTitles.has(title),
        `HIGH_RISK_APP_TITLES contains unknown app: "${title}"`
      ).toBe(true)
    }
  })
})

// ─── Source label governance ──────────────────────────────────────────────────

const VALID_SOURCE_LABELS = new Set(SourceLabelSchema.options)

/** Domains whose URLs are authoritative for official-government / official-scheme entries. */
const OFFICIAL_DOMAINS = [
  'gov.uk', 'nhs.uk', 'cscs.uk.com', 'citb.co.uk', 'dvsa.gov.uk',
]

describe('Source label governance', () => {
  it('SOURCE_LABEL_META covers all SourceLabel enum values', () => {
    // Import at test time to avoid circular issues
    const { SOURCE_LABEL_META } = require('../lib/schema.ts')
    for (const label of VALID_SOURCE_LABELS) {
      expect(SOURCE_LABEL_META[label], `Missing SOURCE_LABEL_META entry for "${label}"`).toBeTruthy()
      expect(SOURCE_LABEL_META[label].display).toBeTruthy()
      expect(SOURCE_LABEL_META[label].emoji).toBeTruthy()
    }
  })

  it('guides with official-government or official-scheme sourceLabel have an official sourceUrl', () => {
    for (const guide of Object.values(GUIDE_MAP)) {
      const label = (guide as { sourceLabel?: string }).sourceLabel
      if (label === 'official-government' || label === 'official-scheme') {
        const url = GUIDE_SOURCE_URL[guide.id] ?? ''
        const isOfficial = OFFICIAL_DOMAINS.some(d => url.includes(d))
        expect(
          isOfficial,
          `Guide "${guide.id}" has sourceLabel "${label}" but sourceUrl "${url}" is not on an official domain`,
        ).toBe(true)
      }
    }
  })

  it('certs with official-government or official-scheme sourceLabel have an official sourceUrl', () => {
    for (const cert of CERTS) {
      const label = (cert as { sourceLabel?: string }).sourceLabel
      if (label === 'official-government' || label === 'official-scheme') {
        const url = CERT_SOURCE_URL[cert.id] ?? ''
        const isOfficial = OFFICIAL_DOMAINS.some(d => url.includes(d))
        expect(
          isOfficial,
          `Cert "${cert.id}" has sourceLabel "${label}" but sourceUrl "${url}" is not on an official domain`,
        ).toBe(true)
      }
    }
  })

  it('careers with official-government or official-scheme sourceLabel have an official sourceUrl', () => {
    for (const career of CAREERS) {
      const label = (career as { sourceLabel?: string }).sourceLabel
      if (label === 'official-government' || label === 'official-scheme') {
        const url = CAREER_SOURCE_URL[career.id] ?? ''
        const isOfficial = OFFICIAL_DOMAINS.some(d => url.includes(d))
        expect(
          isOfficial,
          `Career "${career.id}" has sourceLabel "${label}" but sourceUrl "${url}" is not on an official domain`,
        ).toBe(true)
      }
    }
  })
})
