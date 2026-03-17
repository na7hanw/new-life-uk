/**
 * Zod schemas for guides, jobs, certs, careers, and emergency data.
 * Import these in tests to ensure data integrity before it reaches users.
 *
 * i18n validation: `en` is always required. Any additional language key (e.g.
 * `ar`, `fr`) must also provide the full translation structure via `.catchall()`,
 * preventing partial/broken translations from reaching users.
 */
import { z } from 'zod'

export const LinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
})

// ─── Guide ───────────────────────────────────────────────────────────────────

const GuideTranslationShape = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
})

/** `en` is required; any other language key must supply the full structure. */
export const GuideContentSchema = z
  .object({ en: GuideTranslationShape })
  .catchall(GuideTranslationShape)

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

// ─── Cert ────────────────────────────────────────────────────────────────────

const CertTranslationShape = z.object({
  title: z.string().min(1),
  sector: z.string().optional(),
})

/** `en` is required; any other language key must supply the full structure. */
export const CertContentSchema = z
  .object({ en: CertTranslationShape })
  .catchall(CertTranslationShape)

const StepsArrayShape = z.array(z.string().min(1)).min(1)

export const CertSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  content: CertContentSchema,
  cost: z.string().min(1),
  time: z.string().min(1),
  freeRoute: z.string().min(1),
  /** `en` is required; any other language key must supply the full steps array. */
  steps: z.object({ en: StepsArrayShape }).catchall(StepsArrayShape),
  links: z.array(LinkSchema).optional(),
  studyLinks: z.array(LinkSchema).optional(),
})

// ─── Career ──────────────────────────────────────────────────────────────────

const CareerTranslationShape = z.object({
  title: z.string().min(1),
  salary: z.string().min(1),
})

export const CareerSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  /** `en` is required; any other language key must supply the full structure. */
  content: z.object({ en: CareerTranslationShape }).catchall(CareerTranslationShape),
  tags: z.array(z.string()).min(1),
  /** `en` is required; any other language key must supply the full steps array. */
  steps: z.object({ en: StepsArrayShape }).catchall(StepsArrayShape),
  links: z.array(LinkSchema).optional(),
})

// ─── Emergency ───────────────────────────────────────────────────────────────

export const SOSSchema = z.object({
  name: z.string().min(1),
  num: z.string().min(1),
  phone: z.string().min(1),
  note: z.string().optional(),
  hours: z.string().optional(),
})
