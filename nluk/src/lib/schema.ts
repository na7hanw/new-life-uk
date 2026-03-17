/**
 * Zod schemas for guides, jobs, certs, careers, and emergency data.
 * Import these in tests to ensure data integrity before it reaches users.
 */
import { z } from 'zod'

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

export const SOSSchema = z.object({
  name: z.string().min(1),
  num: z.string().min(1),
  phone: z.string().min(1),
  note: z.string().optional(),
  hours: z.string().optional(),
})
