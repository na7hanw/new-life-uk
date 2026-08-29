/**
 * Privacy and safety-architecture guards.
 *
 * Threat model: users are asylum seekers and refugees, some of whom fled state
 * persecution, some of whom are living with an abuser who controls the phone.
 * Phones are shared, borrowed and inspected. The app must be safe to have
 * installed, and "delete my data" must actually delete it.
 *
 * Each test encodes a defect the August 2026 audit found live.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GUIDE_MAP } from '../data/guides.ts'
import { quickExit } from '../components/QuickExit.tsx'

describe('quick exit', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('clears the traces that are rendered on screen', () => {
    localStorage.setItem('nluk_guide_history', JSON.stringify(['women-support']))
    localStorage.setItem('nluk_recent_searches', JSON.stringify(['leave husband']))
    sessionStorage.setItem('nluk_last_guide', 'safety')

    const replace = vi.fn()
    vi.stubGlobal('location', { ...window.location, replace })

    quickExit()

    expect(localStorage.getItem('nluk_guide_history')).toBeNull()
    expect(localStorage.getItem('nluk_recent_searches')).toBeNull()
    expect(sessionStorage.getItem('nluk_last_guide')).toBeNull()
    vi.unstubAllGlobals()
  })

  it('leaves via replace() so the app is not one Back press away', () => {
    const replace = vi.fn()
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, replace, assign })

    quickExit()

    expect(replace, 'must use location.replace, not assign/href').toHaveBeenCalledTimes(1)
    expect(assign).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

describe('clear-all-data covers every key the app writes', () => {
  // The previous implementation used a hand-maintained ALL_KEYS array that had
  // drifted, leaving 10 keys behind — including nluk_claim_date, nluk_docs and
  // nluk_postcode — while telling the user their data was gone.
  it('the prefix sweep would remove every nluk_ key', () => {
    const written = [
      'nluk_lang', 'nluk_dark', 'nluk_wtab', 'nluk_rtab', 'nluk_status',
      'nluk_status_date', 'nluk_claim_date', 'nluk_ambition', 'nluk_sector',
      'nluk_docs', 'nluk_postcode', 'nluk_bookmarks', 'nluk_target_lane',
      'nluk_credentials', 'nluk_ecctis', 'nluk_guide_history',
      'nluk_recent_searches', 'nluk_guide_access', 'nluk_onboarded', 'nluk_checklist',
    ]
    localStorage.clear()
    for (const k of written) localStorage.setItem(k, 'x')

    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('nluk_')) localStorage.removeItem(k)
    }

    const survivors = Object.keys(localStorage).filter(k => k.startsWith('nluk_'))
    expect(survivors, `keys survived "clear all data": ${survivors.join(', ')}`).toEqual([])
  })

  it('MorePage does not reintroduce a hand-maintained key list', async () => {
    const src = await import('../pages/MorePage.tsx?raw').then(m => m.default as string)
    expect(src).not.toMatch(/const ALL_KEYS\s*=\s*\[/)
    expect(src).toContain('CLEAR_KEY_PREFIX')
  })
})

describe('reading history', () => {
  it('excludes guides whose disclosure could endanger someone', async () => {
    const src = await import('../pages/GuideDetail.tsx?raw').then(m => m.default as string)
    const m = src.match(/SENSITIVE_GUIDE_IDS = new Set\(\[([^\]]+)\]\)/)
    expect(m, 'SENSITIVE_GUIDE_IDS must exist').toBeTruthy()

    const ids = [...m![1].matchAll(/'([^']+)'/g)].map(x => x[1])
    // Must actually be excluded before the history write.
    expect(src).toMatch(/if \(SENSITIVE_GUIDE_IDS\.has\(id\)\) return[\s\S]{0,200}nluk_guide_history/)
    // And must reference guides that exist.
    for (const id of ids) expect(GUIDE_MAP[id], `unknown guide id "${id}"`).toBeTruthy()
    for (const must of ['safety', 'women-support']) expect(ids).toContain(must)
  })
})

describe('no personal data ships as a default', () => {
  it('does not hardcode a real postcode as every user default', async () => {
    const src = await import('../context/AppContext.tsx?raw').then(m => m.default as string)
    // A real UK postcode as the seeded default attributed one private address
    // to every user of a national app, and survived "clear all data".
    expect(src).not.toMatch(/ls\('nluk_postcode',\s*'[A-Z]{1,2}\d/)
  })
})
