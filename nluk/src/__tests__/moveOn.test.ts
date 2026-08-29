import { differenceInDays } from 'date-fns'
/**
 * Move-on date arithmetic.
 *
 * This is the highest-stakes calculation in the app: it tells someone the date
 * they have to be out of Home Office accommodation. It was previously computed
 * inline in ProfilePage.tsx, which has 0% test coverage, and used only one of
 * the two statutory clocks.
 */
import { describe, it, expect } from 'vitest'
import {
  computeMoveOnPlan,
  MOVE_ON_ACTIONS,
  ACCOMMODATION_DAYS,
  SUPPORT_MIN_DAYS,
  UC_WAIT_DAYS,
} from '../lib/moveOn.ts'
import { GUIDE_MAP } from '../data/guides.ts'

const iso = (d: Date) => d.toISOString().slice(0, 10)

describe('the two clocks', () => {
  it('uses 42 days from the grant when no discontinuation letter is known', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-09-01', today: new Date('2026-09-01') })
    expect(iso(p.accommodationDeadline!)).toBe('2026-10-13') // +42
    expect(p.supportFloor).toBeNull()
    expect(iso(p.deadline!)).toBe('2026-10-13')
    expect(p.daysLeft).toBe(ACCOMMODATION_DAYS)
  })

  it('takes the LATER date when the discontinuation letter pushes past the 42 days', () => {
    // Discontinuation arrives 3 weeks after the grant: 21 + 28 = day 49 > day 42.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      discontinuationDate: '2026-09-22',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.accommodationDeadline!)).toBe('2026-10-13')
    expect(iso(p.supportFloor!)).toBe('2026-10-20')
    expect(iso(p.deadline!), 'must take the later of the two').toBe('2026-10-20')
  })

  it('does not shorten the deadline when the support floor falls earlier', () => {
    // Discontinuation arrives same day: 0 + 28 = day 28 < day 42.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      discontinuationDate: '2026-09-01',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.supportFloor!)).toBe('2026-09-29')
    expect(iso(p.deadline!), 'must never be earlier than grant+42').toBe('2026-10-13')
  })

  it('reports a negative daysLeft once the deadline has passed', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-07-01', today: new Date('2026-09-01') })
    expect(p.daysLeft).toBeLessThan(0)
  })
})

describe('the Home Office calculation, quoted', () => {
  // "counting 42 days from the date the grant letter was issued, (ensuring the
  //  individual gets at least 28 days from the point of discontinuation),
  //  adding on 2 calendar days only if the notice is being sent by post"
  // https://www.gov.uk/government/publications/ceasing-asylum-support-instruction/ceasing-section-95-support-instruction-accessible
  it('counts from the ISSUE date of the grant letter', () => {
    // Wednesday 1 April 2026 + 42 = Wednesday 13 May 2026.
    const p = computeMoveOnPlan({ grantDate: '2026-04-01', today: new Date('2026-04-01') })
    expect(p.deadline?.toISOString().slice(0, 10)).toBe('2026-05-13')
  })

  it('adds 2 calendar days when the notice was posted', () => {
    const byHand = computeMoveOnPlan({ grantDate: '2026-04-01', today: new Date('2026-04-01') })
    const byPost = computeMoveOnPlan({ grantDate: '2026-04-01', noticeByPost: true, today: new Date('2026-04-01') })
    expect(differenceInDays(byPost.deadline!, byHand.deadline!)).toBe(2)
  })

  it('does not add the postal days when the notice was not posted', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-04-01', noticeByPost: false, today: new Date('2026-04-01') })
    expect(p.deadline?.toISOString().slice(0, 10)).toBe('2026-05-13')
  })

  it('rolls a weekend deadline forward to the Monday', () => {
    // 4 April 2026 + 42 = Saturday 16 May 2026 -> Monday 18 May.
    const p = computeMoveOnPlan({ grantDate: '2026-04-04', today: new Date('2026-04-04') })
    expect(p.deadline?.getDay()).not.toBe(6)
    expect(p.deadline?.getDay()).not.toBe(0)
    expect(p.deadline?.toISOString().slice(0, 10)).toBe('2026-05-18')
  })

  it('never rolls a deadline backwards', () => {
    for (const d of ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05']) {
      const p = computeMoveOnPlan({ grantDate: d, today: new Date(d) })
      const naive = new Date(new Date(d).getTime() + 42 * 86400000)
      expect(p.deadline!.getTime()).toBeGreaterThanOrEqual(naive.getTime())
    }
  })
})

describe('the Notice to Quit', () => {
  // The provider serves this after the grant letter, on the Home Office's
  // behalf. It is the date that actually gets acted on.
  it('becomes the operative deadline once known', () => {
    const p = computeMoveOnPlan({
      grantDate: '2026-04-01',
      noticeToQuitDate: '2026-05-20',
      today: new Date('2026-04-01'),
    })
    expect(p.deadline?.toISOString().slice(0, 10)).toBe('2026-05-20')
    expect(p.entitlementFloor?.toISOString().slice(0, 10)).toBe('2026-05-13')
  })

  it('flags a notice that expires BEFORE the entitlement floor', () => {
    // 42 days from 1 April is 13 May. A notice demanding the room back on
    // 1 May is short — that is worth challenging, not obeying quietly.
    const p = computeMoveOnPlan({
      grantDate: '2026-04-01',
      noticeToQuitDate: '2026-05-01',
      today: new Date('2026-04-01'),
    })
    expect(p.noticeLooksShort).toBe(true)
  })

  it('does not flag a notice that gives at least the entitlement', () => {
    const p = computeMoveOnPlan({
      grantDate: '2026-04-01',
      noticeToQuitDate: '2026-05-20',
      today: new Date('2026-04-01'),
    })
    expect(p.noticeLooksShort).toBe(false)
  })

  it('cannot look short when no notice has been served', () => {
    const p = computeMoveOnPlan({ grantDate: '2026-04-01', today: new Date('2026-04-01') })
    expect(p.noticeToQuit).toBeNull()
    expect(p.noticeLooksShort).toBe(false)
    // With no NTQ, the entitlement floor is what you plan against.
    expect(p.deadline).toEqual(p.entitlementFloor)
  })

  it('respects the 28-day discontinuation floor when setting the entitlement', () => {
    // Discontinuation long after the grant pushes the floor past grant + 42.
    const p = computeMoveOnPlan({
      grantDate: '2026-04-01',
      discontinuationDate: '2026-05-10',
      today: new Date('2026-04-01'),
    })
    expect(p.entitlementFloor?.toISOString().slice(0, 10)).toBe('2026-06-08')
  })
})

describe('the Universal Credit gap', () => {
  it('shows a positive buffer when UC is claimed on day 1', () => {
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      ucClaimDate: '2026-09-01',
      today: new Date('2026-09-01'),
    })
    expect(iso(p.ucFirstPayment!)).toBe('2026-10-06') // +35
    // Money lands 7 days before the deadline.
    expect(p.ucBufferDays).toBe(ACCOMMODATION_DAYS - UC_WAIT_DAYS)
    expect(p.ucBufferDays).toBeGreaterThan(0)
  })

  it('goes negative when the claim is delayed past the point of no return', () => {
    // Claiming on day 10 means money on day 45 — after the day-42 deadline.
    const p = computeMoveOnPlan({
      grantDate: '2026-09-01',
      ucClaimDate: '2026-09-11',
      today: new Date('2026-09-11'),
    })
    expect(p.ucBufferDays!, 'money arrives after the deadline').toBeLessThan(0)
  })

  it('is the binding constraint, not the deadline itself', () => {
    // Only 7 days of slack exist even in the best case. That is the point.
    expect(ACCOMMODATION_DAYS - UC_WAIT_DAYS).toBe(7)
  })
})

describe('missing or malformed input', () => {
  it('returns nulls rather than throwing when no grant date is set', () => {
    const p = computeMoveOnPlan({ today: new Date('2026-09-01') })
    expect(p.deadline).toBeNull()
    expect(p.daysLeft).toBeNull()
    expect(p.ucBufferDays).toBeNull()
  })

  it('ignores an unparseable date instead of producing Invalid Date', () => {
    const p = computeMoveOnPlan({ grantDate: 'not-a-date', today: new Date('2026-09-01') })
    expect(p.accommodationDeadline).toBeNull()
    expect(p.deadline).toBeNull()
  })

  it('accepts a grant date in the near future, so the plan can be prepared in advance', () => {
    // Someone whose refusal has been withdrawn knows the grant is days away and
    // should be able to lay the plan out before the clock starts.
    const p = computeMoveOnPlan({ grantDate: '2026-09-05', today: new Date('2026-09-01') })
    // 5 Sep + 42 = Sat 17 Oct, which the Home Office rule rolls to Mon 19 Oct
    // ("if the end of support date falls on a bank holiday or weekend, the next
    // working day should be used"), so the grant being 4 days out gives 4 + 2.
    expect(p.deadline?.toISOString().slice(0, 10)).toBe('2026-10-19')
    expect(p.daysLeft).toBe(ACCOMMODATION_DAYS + 6)
  })
})

describe('the action sequence', () => {
  it('puts Universal Credit and the council application both on day 1', () => {
    const dayOne = MOVE_ON_ACTIONS.filter(a => a.byDay === 1).map(a => a.id)
    expect(dayOne).toEqual(expect.arrayContaining(['uc', 'council']))
  })

  it('puts the National Insurance number on day 1, because the UC Advance depends on it', () => {
    // SI 2024/341 reg 6: an Advance cannot be paid until a NINo is allocated.
    // The Advance is what bridges the five-week wait, so the number cannot sit
    // in the "later paperwork" bucket without breaking the plan that depends
    // on it. Same class of bug as bank-before-eVisa: a real dependency
    // inverted by topic-ordering.
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    const uc = MOVE_ON_ACTIONS.find(a => a.id === 'uc')!
    expect(ni.byDay).toBeLessThanOrEqual(uc.byDay)
  })

  it('does not promise the Advance unconditionally', () => {
    // It previously read "it arrives in days", which is only true once a NINo
    // exists. Someone with 42 days and no number would have planned around
    // money that cannot legally be paid to them yet.
    const uc = MOVE_ON_ACTIONS.find(a => a.id === 'uc')!
    expect(uc.detail).not.toMatch(/arrives in days/i)
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    expect(ni.detail).toMatch(/advance/i)
    expect(ni.detail).toMatch(/national insurance/i)
  })

  it('warns that the clock starts before the eVisa can be used', () => {
    // The 42 days run from the decision notification, but nothing can be
    // proved to a bank, employer or landlord until the UKVI account is live —
    // and those details arrive with the grant letter or after it. Someone who
    // waits quietly for the post loses days that are already being counted.
    const evisa = MOVE_ON_ACTIONS.find(a => a.id === 'evisa')!
    expect(evisa.detail).toMatch(/42 days start|clock/i)
    expect(evisa.detail).toMatch(/chase/i)
  })

  it('sends people to the UKVI account for the NI number, not the decision letter', () => {
    // Corrected on the owner's report: the number is almost never printed on
    // the decision letter, it is inside the eVisa profile. The old text sent
    // people searching paperwork that does not contain it.
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    expect(ni.detail).toMatch(/UKVI account/i)
    expect(ni.detail).not.toMatch(/Check the decision letter first/i)
  })

  it('tells people to claim UC without waiting for documents', () => {
    // GOV.UK: "You do not need a NI number for your benefits claim to be made."
    // The five-week wait runs from the claim date, so waiting for the eVisa or
    // the NI number is the single most expensive delay available.
    const uc = MOVE_ON_ACTIONS.find(a => a.id === 'uc')!
    expect(uc.detail).toMatch(/do NOT need/i)
    expect(uc.detail).toMatch(/ARC/)
  })

  it('does not promise the NI number will be in the eVisa', () => {
    // The Home Office says MOST are issued automatically, and gov.uk says you
    // MIGHT already have one. "Most" is not "will".
    const ni = MOVE_ON_ACTIONS.find(a => a.id === 'ni')!
    expect(ni.detail).toMatch(/MOST|might/i)
  })

  it('is ordered by deadline', () => {
    const days = MOVE_ON_ACTIONS.map(a => a.byDay)
    expect(days).toEqual([...days].sort((a, b) => a - b))
  })

  it('gives the council script, because the wording changes the outcome', () => {
    const council = MOVE_ON_ACTIONS.find(a => a.id === 'council')!
    expect(council.script).toMatch(/prevention duty/i)
    expect(council.script).toMatch(/56 days/)
    expect(council.script).toMatch(/Personalised Housing Plan/i)
  })

  it('asks for the extension before the deadline, not after', () => {
    const ext = MOVE_ON_ACTIONS.find(a => a.id === 'extension')!
    expect(ext.byDay).toBeLessThan(ACCOMMODATION_DAYS)
  })

  it('only links guides that exist', () => {
    for (const a of MOVE_ON_ACTIONS) {
      if (a.guideId) expect(GUIDE_MAP[a.guideId], `unknown guide "${a.guideId}"`).toBeTruthy()
    }
  })

  it('states the support floor as 28 days', () => {
    expect(SUPPORT_MIN_DAYS).toBe(28)
  })
})
