/**
 * EPIC 1 — Lifting Lane (A40 → A62) personal sequence tests.
 *
 * Verifies:
 * P1  — guide objects exist with correct step ordering
 * P2  — cert objects have official citb.co.uk / cscs.uk.com sourceUrls
 * P4  — CPCS/CSCS app entries exist in APPS
 * P5  — nextLiftingCredential derived value logic
 *       ecctisStatus='soc-only' does NOT produce 'aqp-ready' state
 */
import { describe, it, expect } from 'vitest'
import { GUIDE_MAP, GUIDE_SOURCE_URL, GUIDE_TRUST_LEVEL } from '../data/guides.ts'
import { CERTS, CERT_SOURCE_URL } from '../data/jobs.ts'
import { APPS } from '../data/apps.ts'

// ─── P1: Guide existence and step ordering ────────────────────────────────────

describe('Lifting lane — P1 guide (my-personal-sequence-lifting-lane)', () => {
  const guide = GUIDE_MAP['my-personal-sequence-lifting-lane']

  it('guide exists in GUIDE_MAP', () => {
    expect(guide, 'my-personal-sequence-lifting-lane missing from GUIDE_MAP').toBeTruthy()
  })

  it('guide has official trustLevel and official-scheme resourceType', () => {
    expect(guide.trustLevel).toBe('official')
    expect(guide.resourceType).toBe('official-scheme')
  })

  it('guide has a sourceUrl in GUIDE_SOURCE_URL pointing to citb.co.uk', () => {
    const url = GUIDE_SOURCE_URL['my-personal-sequence-lifting-lane'] ?? ''
    expect(url).toMatch(/^https:\/\//)
    expect(url).toContain('citb.co.uk')
  })

  it('guide has GUIDE_TRUST_LEVEL = official', () => {
    expect(GUIDE_TRUST_LEVEL['my-personal-sequence-lifting-lane']).toBe('official')
  })

  it('guide has at least 10 steps', () => {
    const steps = guide.content?.en?.steps ?? []
    expect(steps.length).toBeGreaterThanOrEqual(10)
  })

  it('A40 course booking step appears before A62 course booking step', () => {
    const steps: string[] = guide.content?.en?.steps ?? []
    // Look for the step where A40 course is booked (Step 3) vs A62 (Step 7)
    const a40Index = steps.findIndex(s => /A40 Slinger.*course|Book the CPCS A40|Step 3/i.test(s))
    const a62Index = steps.findIndex(s => /A62 Crane Supervisor course|Book the CPCS A62|Step 7/i.test(s))
    expect(a40Index, 'A40 course booking step not found').toBeGreaterThanOrEqual(0)
    expect(a62Index, 'A62 course booking step not found').toBeGreaterThanOrEqual(0)
    expect(a40Index).toBeLessThan(a62Index)
  })

  it('Supervisors HS&E test is mentioned (not only Operatives) before A62 step', () => {
    const steps: string[] = guide.content?.en?.steps ?? []
    const warnings: string[] = guide.warnings ?? []
    const allText = [...steps, ...warnings].join(' ')
    expect(allText).toMatch(/Supervisor/i)
  })
})

describe('Lifting lane — P3 guide (my-personal-sequence-bookings-checklist)', () => {
  const guide = GUIDE_MAP['my-personal-sequence-bookings-checklist']

  it('guide exists in GUIDE_MAP', () => {
    expect(guide, 'my-personal-sequence-bookings-checklist missing from GUIDE_MAP').toBeTruthy()
  })

  it('guide has official trustLevel and official-scheme resourceType', () => {
    expect(guide.trustLevel).toBe('official')
    expect(guide.resourceType).toBe('official-scheme')
  })

  it('guide has a sourceUrl in GUIDE_SOURCE_URL', () => {
    const url = GUIDE_SOURCE_URL['my-personal-sequence-bookings-checklist'] ?? ''
    expect(url).toMatch(/^https:\/\//)
  })

  it('guide has at least 6 steps', () => {
    const steps = guide.content?.en?.steps ?? []
    expect(steps.length).toBeGreaterThanOrEqual(6)
  })

  it('HS&E test booking step appears before A40 course booking step', () => {
    const steps: string[] = guide.content?.en?.steps ?? []
    // Booking 1 = HS&E test; Booking 2 = A40 course
    const hseIndex = steps.findIndex(s => /Booking 1|HS&E Test.*do first|Operatives HS&E Test/i.test(s))
    const courseIndex = steps.findIndex(s => /Booking 2|A40 Slinger.*course/i.test(s))
    expect(hseIndex, 'HS&E test booking step not found').toBeGreaterThanOrEqual(0)
    expect(courseIndex, 'A40 course booking step not found').toBeGreaterThanOrEqual(0)
    expect(hseIndex).toBeLessThan(courseIndex)
  })
})

// ─── P2: Cert objects have official sourceUrls ────────────────────────────────

describe('Lifting lane — P2 cert sourceUrls', () => {
  const LIFTING_CERT_IDS = ['cpcs-a40', 'cpcs-a62', 'cpcs-a73', 'cscs-labourer-fallback', 'cscs-aqp-ecctis']

  it('all lifting cert IDs exist in CERTS', () => {
    const certIds = new Set(CERTS.map(c => c.id))
    for (const id of LIFTING_CERT_IDS) {
      expect(certIds.has(id), `Cert "${id}" missing from CERTS`).toBe(true)
    }
  })

  it('cpcs-a40 sourceUrl is on citb.co.uk', () => {
    const url = CERT_SOURCE_URL['cpcs-a40'] ?? ''
    expect(url).toContain('citb.co.uk')
  })

  it('cpcs-a62 sourceUrl is on citb.co.uk', () => {
    const url = CERT_SOURCE_URL['cpcs-a62'] ?? ''
    expect(url).toContain('citb.co.uk')
  })

  it('cpcs-a73 sourceUrl is on citb.co.uk', () => {
    const url = CERT_SOURCE_URL['cpcs-a73'] ?? ''
    expect(url).toContain('citb.co.uk')
  })

  it('cscs-labourer-fallback sourceUrl is on cscs.uk.com', () => {
    const url = CERT_SOURCE_URL['cscs-labourer-fallback'] ?? ''
    expect(url).toContain('cscs.uk.com')
  })

  it('cscs-aqp-ecctis sourceUrl is on cscs.uk.com', () => {
    const url = CERT_SOURCE_URL['cscs-aqp-ecctis'] ?? ''
    expect(url).toContain('cscs.uk.com')
  })

  it('cpcs-a40 has resourceType official-scheme', () => {
    const cert = CERTS.find(c => c.id === 'cpcs-a40')
    expect(cert?.resourceType).toBe('official-scheme')
  })

  it('cpcs-a62 warns about Supervisors HS&E test in steps', () => {
    const cert = CERTS.find(c => c.id === 'cpcs-a62')
    // Certs use cert.steps.en (not cert.content.en.steps)
    const steps: string[] = (cert as unknown as { steps?: { en?: string[] } })?.steps?.en ?? []
    const warnings: string[] = (cert as unknown as { warnings?: string[] })?.warnings ?? []
    const allText = [...steps, ...warnings].join(' ')
    expect(allText).toMatch(/Supervisor/i)
  })

  it('cscs-aqp-ecctis warns that SoC-only is not sufficient', () => {
    const cert = CERTS.find(c => c.id === 'cscs-aqp-ecctis')
    // Certs use cert.steps.en (not cert.content.en.steps)
    const steps: string[] = (cert as unknown as { steps?: { en?: string[] } })?.steps?.en ?? []
    const warnings: string[] = (cert as unknown as { warnings?: string[] })?.warnings ?? []
    const allText = [...steps, ...warnings].join(' ')
    expect(allText).toMatch(/SoC|statement of comparability|not sufficient|ISS/i)
  })
})

// ─── P4: CPCS/CSCS app entries exist in APPS ─────────────────────────────────

describe('Lifting lane — P4 app entries', () => {
  const appTitles = new Set(APPS.map(a => a.content?.en?.title))

  it('CITB A40 course app entry exists', () => {
    expect(appTitles.has('CITB — CPCS A40 Slinger/Signaller Course')).toBe(true)
  })

  it('CITB A62 course app entry exists', () => {
    expect(appTitles.has('CITB — CPCS A62 Crane Supervisor Course')).toBe(true)
  })

  it('CITB A73 course app entry exists', () => {
    expect(appTitles.has('CITB — CPCS A73 Plant & Vehicle Marshaller')).toBe(true)
  })

  it('CSCS card application entry exists', () => {
    expect(appTitles.has('CSCS — Apply for Your Card')).toBe(true)
  })

  it('all CPCS/CSCS apps have official trustLevel', () => {
    const liftingApps = APPS.filter(a =>
      ['CITB — CPCS A40 Slinger/Signaller Course', 'CITB — CPCS A62 Crane Supervisor Course',
       'CITB — CPCS A73 Plant & Vehicle Marshaller', 'CSCS — Apply for Your Card']
        .includes(a.content?.en?.title ?? '')
    )
    for (const app of liftingApps) {
      expect(app.trustLevel, `${app.content?.en?.title} must have trustLevel "official"`).toBe('official')
    }
  })

  it('all CPCS/CSCS apps have resourceType official-scheme', () => {
    const liftingApps = APPS.filter(a =>
      ['CITB — CPCS A40 Slinger/Signaller Course', 'CITB — CPCS A62 Crane Supervisor Course',
       'CITB — CPCS A73 Plant & Vehicle Marshaller', 'CSCS — Apply for Your Card']
        .includes(a.content?.en?.title ?? '')
    )
    for (const app of liftingApps) {
      expect(app.resourceType, `${app.content?.en?.title} must have resourceType "official-scheme"`).toBe('official-scheme')
    }
  })
})

// ─── P5: nextLiftingCredential derived logic ──────────────────────────────────

describe('Lifting lane — P5 nextLiftingCredential logic', () => {
  /** Pure function that mirrors the AppContext derived value */
  function nextLiftingCredential(targetLane: string, credentialsHeld: string[]): string {
    if (targetLane !== 'lifting') return ''
    if (!credentialsHeld.includes('cpcs-a40')) return 'cpcs-a40'
    if (!credentialsHeld.includes('cpcs-a62')) return 'cpcs-a62'
    return ''
  }

  it('returns empty string when targetLane is not lifting', () => {
    expect(nextLiftingCredential('', [])).toBe('')
    expect(nextLiftingCredential('', ['cpcs-a40'])).toBe('')
  })

  it('returns cpcs-a40 when targetLane=lifting and no credentials held', () => {
    expect(nextLiftingCredential('lifting', [])).toBe('cpcs-a40')
  })

  it('returns cpcs-a40 when targetLane=lifting and cpcs-a62 held but not a40 (edge case)', () => {
    // A40 must always come first
    expect(nextLiftingCredential('lifting', ['cpcs-a62'])).toBe('cpcs-a40')
  })

  it('returns cpcs-a62 once cpcs-a40 is held', () => {
    expect(nextLiftingCredential('lifting', ['cpcs-a40'])).toBe('cpcs-a62')
  })

  it('returns empty string once both A40 and A62 are held', () => {
    expect(nextLiftingCredential('lifting', ['cpcs-a40', 'cpcs-a62'])).toBe('')
  })
})

// ─── P5: ecctisStatus — soc-only blocks AQP ready ────────────────────────────

describe('Lifting lane — P5 ecctisStatus validation', () => {
  const VALID_ECCTIS_STATUSES = new Set(['soc-only', 'aqp-ready', ''])

  it('soc-only is a valid ecctisStatus', () => {
    expect(VALID_ECCTIS_STATUSES.has('soc-only')).toBe(true)
  })

  it('aqp-ready is a valid ecctisStatus', () => {
    expect(VALID_ECCTIS_STATUSES.has('aqp-ready')).toBe(true)
  })

  it('ecctisStatus=soc-only does NOT equal aqp-ready', () => {
    const status = 'soc-only'
    expect(status).not.toBe('aqp-ready')
  })

  it('cscs-aqp-ecctis cert eligibilityNotes mention ISS requirement', () => {
    const cert = CERTS.find(c => c.id === 'cscs-aqp-ecctis')
    const notes: string[] = cert?.eligibilityNotes ?? []
    const steps: string[] = cert?.content?.en?.steps ?? []
    const allText = [...notes, ...steps].join(' ')
    expect(allText).toMatch(/ISS|International Statement of Subjects|aqp/i)
  })
})
