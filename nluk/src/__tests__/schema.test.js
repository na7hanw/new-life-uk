/**
 * Content schema validation using Zod.
 * Ensures guide/cert/career data is structurally valid before it reaches users.
 */
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { CERTS, CAREERS } from '../data/jobs.js'
import { GUIDE_MAP, GUIDE_SOURCE_URL } from '../data/guides.js'
import { SOS_NUMBERS } from '../data/emergency.js'

// ─── Schemas ────────────────────────────────────────────────────────────────

const LinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
})

const GuideContentSchema = z.object({
  en: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    steps: z.array(z.string().min(1)).min(1),
  }),
})

const GuideSchema = z.object({
  id: z.string().min(1),
  cat: z.string().min(1),
  icon: z.string().min(1),
  content: GuideContentSchema,
  links: z.array(LinkSchema).optional(),
  cost: z.string().optional(),
  time: z.string().optional(),
  bring: z.array(z.string()).optional(),
})

const CertContentSchema = z.object({
  en: z.object({
    title: z.string().min(1),
    sector: z.string().optional(),
  }),
})

const CertSchema = z.object({
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

const CareerSchema = z.object({
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

const SOSSchema = z.object({
  name: z.string().min(1),
  num: z.string().min(1),
  phone: z.string().min(1),
  note: z.string().optional(),
  hours: z.string().optional(),
})

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
