import { describe, it, expect } from 'vitest'
import {
  GOALS,
  ASSET_LABELS,
  ASSET_ACTIONS,
  assessGoal,
  assessAll,
  biggestUnlock,
  type Asset,
} from '../lib/blockers.ts'
import { GUIDES } from '../data/guides.ts'

const goal = (id: string) => GOALS.find(g => g.id === id)!

describe('the Advance depends on the NI number', () => {
  // The whole reason this module exists. SI 2024/341 reg 6.
  it('requires a National Insurance number', () => {
    expect(goal('uc-advance').requires).toContain('ni-number')
  })

  it('is not reachable with a claim and a bank account alone', () => {
    const s = assessGoal(goal('uc-advance'), ['uc-claim', 'bank-account'])
    expect(s.ready).toBe(false)
    expect(s.missing).toEqual(['ni-number'])
  })

  it('becomes reachable once the number is allocated', () => {
    const s = assessGoal(goal('uc-advance'), ['uc-claim', 'bank-account', 'ni-number'])
    expect(s.ready).toBe(true)
    expect(s.nextAsset).toBeNull()
  })
})

describe('work is NOT blocked by the NI number', () => {
  // Believing otherwise costs people weeks of work they were allowed to do.
  it('does not require one', () => {
    expect(goal('start-work').requires).not.toContain('ni-number')
  })

  it('is ready on a share code alone', () => {
    const s = assessGoal(goal('start-work'), ['decision-letter', 'ukvi-account', 'share-code'])
    expect(s.ready).toBe(true)
  })

  it('says so explicitly, because the belief is the problem', () => {
    expect(goal('start-work').notRequired).toMatch(/national insurance/i)
  })
})

describe('the bank chain', () => {
  it('puts the share code before the bank account', () => {
    const s = assessGoal(goal('bank-account'), ['decision-letter', 'ukvi-account'])
    expect(s.nextAsset).toBe('share-code')
  })

  it('never tells someone to open a bank account while the share code is missing', () => {
    // The failure this ordering exists to prevent: being sent to the bank on
    // day 3 without the one thing the bank asks for.
    for (const status of assessAll(['decision-letter'])) {
      if (status.nextAsset === 'bank-account') {
        expect(status.goal.requires).not.toContain('share-code')
      }
    }
  })

  it('blocks UC payment on the account, not on the claim', () => {
    const s = assessGoal(goal('uc-payment'), ['uc-claim'])
    expect(s.ready).toBe(false)
    expect(s.missing).toContain('bank-account')
  })
})

describe('next steps are always reachable', () => {
  it('names an asset that is not itself blocked', () => {
    const held: string[] = []
    for (const status of assessAll(held)) {
      if (!status.nextAsset) continue
      // Whatever is proposed must be obtainable now: nothing earlier in the
      // chain for that same goal can still be missing.
      expect(status.missing[0]).toBe(status.nextAsset)
    }
  })

  it('starts everyone at the decision letter when they hold nothing', () => {
    expect(biggestUnlock([])).toBe('decision-letter')
  })

  it('moves to the share code once the account exists', () => {
    expect(biggestUnlock(['decision-letter', 'ukvi-account'])).toBe('share-code')
  })

  it('returns null when nothing is left to unblock', () => {
    const all: Asset[] = [
      'decision-letter', 'ukvi-account', 'share-code',
      'ni-number', 'bank-account', 'uc-claim',
    ]
    expect(biggestUnlock(all)).toBeNull()
  })

  it('picks the asset that unblocks the most, not the first one found', () => {
    // With the letter and account held, the share code gates renting, working
    // and the bank; the NI number gates fewer. The answer must be the share
    // code.
    expect(biggestUnlock(['decision-letter', 'ukvi-account'])).toBe('share-code')
  })
})

describe('every dependency shows its working', () => {
  // Added after a real failure in the sibling module: one verified GOV.UK
  // sentence was extrapolated into three claims, two of them wrong, and
  // nothing in the code distinguished the sourced claim from the invented
  // ones. The header of blockers.ts always CLAIMED each edge was "a real rule
  // with a source" — now that is checked rather than asserted.
  const OFFICIAL = /^https:\/\/(www\.)?(gov\.uk|legislation\.gov\.uk|nhs\.uk)\//

  it('gives every goal at least one source', () => {
    for (const g of GOALS) {
      expect(g.sources, `goal "${g.id}" has no sources`).toBeDefined()
      expect(g.sources.length, `goal "${g.id}" has an empty sources list`).toBeGreaterThan(0)
    }
  })

  it('sources everything to an official domain', () => {
    for (const g of GOALS) {
      for (const url of g.sources) {
        expect(OFFICIAL.test(url), `goal "${g.id}" cites a non-official source: ${url}`).toBe(true)
      }
    }
  })

  it('cites the regulation for the Advance, not a summary of it', () => {
    // This is the single claim in the app most likely to cost someone five
    // weeks of income, so it must point at the instrument itself.
    const advance = GOALS.find(g => g.id === 'uc-advance')!
    expect(advance.sources.some(u => u.includes('legislation.gov.uk'))).toBe(true)
  })
})

describe('data integrity', () => {
  it('gives every asset a label and an action', () => {
    const assets = new Set<Asset>()
    for (const g of GOALS) for (const a of g.requires) assets.add(a)
    for (const a of assets) {
      expect(ASSET_LABELS[a]).toBeTruthy()
      expect(ASSET_ACTIONS[a]?.action).toBeTruthy()
    }
  })

  it('gives every goal a reason it is on the critical path', () => {
    for (const g of GOALS) {
      expect(g.why.length).toBeGreaterThan(20)
      expect(g.requires.length).toBeGreaterThan(0)
    }
  })

  it('only links guides that exist', () => {
    const ids = new Set(GUIDES.map(g => g.id))
    for (const g of GOALS) {
      if (g.guideId) expect(ids.has(g.guideId), `goal ${g.id} -> ${g.guideId}`).toBe(true)
    }
    for (const [asset, spec] of Object.entries(ASSET_ACTIONS)) {
      if (spec.guideId) expect(ids.has(spec.guideId), `asset ${asset} -> ${spec.guideId}`).toBe(true)
    }
  })

  it('has unique goal ids', () => {
    const ids = GOALS.map(g => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
