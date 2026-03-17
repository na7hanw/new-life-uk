/**
 * Content integrity tests — runs with `npm test`
 * Catches broken links, missing translations, empty steps.
 * Critical: this app gives life-changing advice; a broken link matters.
 */
import { describe, it, expect } from 'vitest'
import { GUIDES, GUIDE_PRIORITY, GUIDE_LAST_UPDATED } from '../data/guides.ts'
import { JOBS, CERTS, CAREERS } from '../data/jobs.ts'
import { SOS_NUMBERS } from '../data/emergency.ts'
import { APPS } from '../data/apps.ts'
import { CULTURE } from '../data/culture.ts'

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

// ─── Essential Apps ───────────────────────────────────────────────

describe('essential apps — data integrity', () => {
  it('APPS is non-empty', () => {
    expect(APPS.length).toBeGreaterThan(0)
  })

  it('every app has an English title and description', () => {
    for (const app of APPS) {
      expect(app.content?.en?.title, 'app missing English title').toBeTruthy()
      expect(app.content?.en?.desc, `${app.content?.en?.title} missing description`).toBeTruthy()
    }
  })

  it('all app URLs use https://', () => {
    for (const app of APPS) {
      if (app.url) {
        expect(app.url, `${app.content?.en?.title} — URL must start with https://`).toMatch(/^https:\/\//)
      }
    }
  })

  it('every app has an icon', () => {
    for (const app of APPS) {
      expect(app.icon, `${app.content?.en?.title} missing icon`).toBeTruthy()
    }
  })
})

// ─── UK Culture ───────────────────────────────────────────────────

describe('culture — data integrity', () => {
  it('CULTURE is non-empty', () => {
    expect(CULTURE.length).toBeGreaterThan(0)
  })

  it('every section has an id, emoji, and heading', () => {
    for (const section of CULTURE) {
      expect(section.id, 'culture section missing id').toBeTruthy()
      expect(section.emoji, `section "${section.id}" missing emoji`).toBeTruthy()
      expect(section.heading, `section "${section.id}" missing heading`).toBeTruthy()
    }
  })

  it('every section has at least one item', () => {
    for (const section of CULTURE) {
      expect(
        section.items.length,
        `section "${section.id}" has no items`
      ).toBeGreaterThan(0)
    }
  })

  it('every culture item has an emoji, title, and body', () => {
    for (const section of CULTURE) {
      for (const item of section.items) {
        expect(item.emoji, `item in "${section.id}" missing emoji`).toBeTruthy()
        expect(item.title, `item in "${section.id}" missing title`).toBeTruthy()
        expect(item.body, `item in "${section.id}" missing body`).toBeTruthy()
      }
    }
  })
})

// ─── GUIDE_LAST_UPDATED freshness ────────────────────────────────

describe('GUIDE_LAST_UPDATED — freshness', () => {
  it('every id in GUIDE_LAST_UPDATED exists in GUIDES', () => {
    const ids = new Set(GUIDES.map(g => g.id))
    for (const id of Object.keys(GUIDE_LAST_UPDATED)) {
      expect(ids.has(id), `GUIDE_LAST_UPDATED contains unknown guide id: "${id}"`).toBe(true)
    }
  })

  it('no GUIDE_LAST_UPDATED entry is older than 12 months from today', () => {
    const now = new Date()
    const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), 1)
    for (const [id, dateStr] of Object.entries(GUIDE_LAST_UPDATED)) {
      const parsed = new Date(dateStr)
      expect(
        parsed.getTime(),
        `GUIDE_LAST_UPDATED["${id}"] = "${dateStr}" is older than 12 months`
      ).toBeGreaterThan(cutoff.getTime())
    }
  })
})
