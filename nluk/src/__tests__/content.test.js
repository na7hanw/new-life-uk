/**
 * Content integrity tests — runs with `npm test`
 * Catches broken links, missing translations, empty steps.
 * Critical: this app gives life-changing advice; a broken link matters.
 */
import { describe, it, expect } from 'vitest'
import { GUIDES, GUIDE_PRIORITY } from '../data/guides.js'
import { JOBS, CERTS, CAREERS } from '../data/jobs.js'
import { SOS_NUMBERS } from '../data/emergency.js'

// ─── Guides ───────────────────────────────────────────────────────

describe('guides — English content', () => {
  it('every guide has an English title', () => {
    for (const g of GUIDES) {
      expect(g.content?.en?.title, `${g.id} missing English title`).toBeTruthy()
    }
  })

  it('every guide has at least one step', () => {
    for (const g of GUIDES) {
      expect(
        (g.content?.en?.steps?.length ?? 0),
        `${g.id} has no steps`
      ).toBeGreaterThan(0)
    }
  })

  it('all guide links use https://', () => {
    for (const g of GUIDES) {
      for (const link of g.links ?? []) {
        expect(link.url, `${g.id} > "${link.name}" — not https`).toMatch(/^https:\/\//)
      }
    }
  })

  it('every guide id in GUIDE_PRIORITY exists in GUIDES', () => {
    const ids = new Set(GUIDES.map(g => g.id))
    for (const id of GUIDE_PRIORITY) {
      expect(ids.has(id), `GUIDE_PRIORITY contains unknown id: "${id}"`).toBe(true)
    }
  })
})

// ─── Jobs ─────────────────────────────────────────────────────────

describe('jobs — data integrity', () => {
  it('every job has an English role description', () => {
    for (const j of JOBS) {
      expect(j.content?.en?.role, `job missing English role`).toBeTruthy()
    }
  })

  it('all job apply links use https://', () => {
    for (const j of JOBS) {
      for (const link of j.applyLinks ?? []) {
        expect(link.url, `${j.content?.en?.role} > "${link.name}" — not https`).toMatch(/^https:\/\//)
      }
    }
  })
})

// ─── Certs & Careers ──────────────────────────────────────────────

describe('certs and careers', () => {
  it('every cert has English title', () => {
    for (const c of CERTS) {
      expect(c.content?.en?.title, `cert missing English title`).toBeTruthy()
    }
  })

  it('every career has English title and salary', () => {
    for (const c of CAREERS) {
      expect(c.content?.en?.title, `career missing English title`).toBeTruthy()
      expect(c.content?.en?.salary, `${c.content?.en?.title} missing salary`).toBeTruthy()
    }
  })
})

// ─── Emergency / SOS ──────────────────────────────────────────────

describe('SOS numbers', () => {
  it('SOS_NUMBERS is non-empty', () => {
    expect(SOS_NUMBERS.length).toBeGreaterThan(0)
  })

  it('every SOS entry has a name and phone', () => {
    for (const s of SOS_NUMBERS) {
      expect(s.name, 'SOS entry missing name').toBeTruthy()
      expect(s.phone, `${s.name} missing phone`).toBeTruthy()
    }
  })
})
