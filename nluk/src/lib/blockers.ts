/**
 * What is blocking what, right now.
 *
 * The app's content is a library organised by topic. That is the right shape
 * for browsing and the wrong shape for someone on day 3 of a 42-day clock, who
 * does not need to know everything — they need to know the one thing that is
 * stopping the next thing.
 *
 * Almost every serious failure in a move-on is a DEPENDENCY failure rather than
 * a knowledge failure. People know they need a bank account; they do not know
 * that the share code is what opens it, so they go to the bank on day 3 and are
 * turned away. They know to ask for a Universal Credit Advance; they do not
 * know it cannot be paid without a National Insurance number, so they plan
 * around money that will not arrive.
 *
 * So the dependencies are modelled explicitly and the UI is derived from them,
 * rather than being implied by the order of a list that anyone can re-sort.
 *
 * Each edge below is a real rule with a source, not a suggested ordering:
 *
 *  - Advance -> NI number. Social Security (Payments on Account of Benefit)
 *    Regulations 2013 reg 5(1)(d), inserted by SI 2024/341 reg 6, in force
 *    1 April 2024. https://www.legislation.gov.uk/uksi/2024/341/made
 *  - Bank -> share code. Banks accept a share code as proof of status; the code
 *    is generated from the UKVI account, which exists once status is granted.
 *  - UC paid -> bank. A claim can be made without an account but cannot be paid
 *    into one that does not exist, so the five-week wait silently becomes
 *    indefinite.
 *  - Refugee Integration Loan -> NI number AND bank. Both are required on the
 *    application. https://www.gov.uk/refugee-integration-loan
 *
 * And one deliberate NON-dependency, because believing it costs people weeks of
 * work they were allowed to do:
 *
 *  - Work -> share code ONLY. A National Insurance number is NOT required to
 *    start a job. An employer has to check right to work, not the NI number.
 */

/** Things a person either has or does not have yet. */
export type Asset =
  | 'decision-letter'
  | 'ukvi-account'
  | 'share-code'
  | 'ni-number'
  | 'bank-account'
  | 'uc-claim'

/** Things a person is trying to reach. */
export type Goal =
  | 'uc-advance'
  | 'uc-payment'
  | 'bank-account'
  | 'share-code'
  | 'start-work'
  | 'integration-loan'
  | 'rent-a-room'
  | 'start-training'
  | 'flexible-support-fund'

export interface GoalSpec {
  id: Goal
  label: string
  /** Every asset that must be held before this can happen. */
  requires: Asset[]
  /** Why this matters enough to be on the critical path. */
  why: string
  /** Stated only where people commonly believe a requirement that is not real. */
  notRequired?: string
  guideId?: string
  /**
   * Where the dependency and the claims in `why` come from. REQUIRED, and
   * enforced by a test — see the same note in lib/moveOn.ts. Each edge here is
   * supposed to be a rule with a source rather than a plausible ordering, and
   * until now nothing checked that.
   */
  sources: string[]
}

export const ASSET_LABELS: Record<Asset, string> = {
  'decision-letter': 'Home Office decision letter',
  'ukvi-account': 'UKVI account / eVisa',
  'share-code': 'Right to work share code',
  'ni-number': 'National Insurance number',
  'bank-account': 'Bank account',
  'uc-claim': 'Universal Credit claim submitted',
}

/** What to do to get each asset, when it is the thing standing in the way. */
export const ASSET_ACTIONS: Record<Asset, { action: string; guideId?: string }> = {
  'decision-letter': {
    action: 'This comes from the Home Office. Everything else starts from it — keep the original safe and photograph every page. ⚠ AND DO NOT GIVE UP YOUR ARC CARD. DWP guidance says that where you have not received a BRP or eVisa, your ARC card AND this decision letter can be used TOGETHER to verify your identity for a Universal Credit claim — \'both documents must be provided and not one without the other\'. So if the eVisa is late, those two pieces of paper are what let you claim on time. Keep them together and keep them safe.',
  },
  'ukvi-account': {
    action: 'You do not have to create this yourself. The Home Office sets it up and sends you a UKVI customer number with instructions for logging in — in the decision letter, or in the letter about your asylum accommodation ending. It is free, and if you already have an account do NOT create a second one. Get in the day the letter arrives: your National Insurance number and every share code live inside it, and nothing else can start until it is live.',
    guideId: 'evisa',
  },
  'share-code': {
    action: '⚠ There is no such thing as one share code. Each code is LOCKED to the purpose you picked when you generated it, and the first letter tells you which: W for work (employers), R for rent (landlords, England), S for general status (banks, DWP). GOV.UK is blunt about it — \'Share codes can only be used for their originally selected purpose\' and \'Employers cannot accept or use share codes beginning with the letter R or S\'. Hand the same code to an employer, a landlord and a bank and two of them will reject it. Generate a separate one for each, from your UKVI account. Each lasts 90 days and can be reused as often as you like inside that window, so generate them when you need them, not in advance.',
    guideId: 'evisa',
  },
  'ni-number': {
    action: 'Look in your UKVI account — the National Insurance number appears inside the eVisa profile, alongside your share codes. It is usually NOT on the decision letter, so check the account first. If it genuinely is not there once the eVisa is live, apply at gov.uk/apply-national-insurance-number and chase it in your UC journal in writing every week.',
    guideId: 'ni',
  },
  'bank-account': {
    action: 'Take your share code and decision letter into a branch rather than applying online. Basic bank accounts are free by law at the largest banks, with no credit check.',
    guideId: 'bank',
  },
  'uc-claim': {
    action: 'Claim at gov.uk/universal-credit — the five-week wait starts on the day you claim. To apply ONLINE you need bank account details, so get the account open first; without one you can still claim by phoning the Universal Credit helpline or going to the jobcentre. For identity, your eVisa is the accepted document — or, only while the Home Office has not yet created your UKVI account, your ARC card and the decision letter together. You do NOT need a National Insurance number to claim: tell DWP at the start that you do not have one.',
    guideId: 'uc',
  },
}

export const GOALS: GoalSpec[] = [
  {
    id: 'share-code',
    label: 'Prove your status',
    requires: ['decision-letter', 'ukvi-account'],
    why: 'The share code is the key to almost everything else — the bank, the job, the tenancy. But it is not ONE key: codes are purpose-locked, so you need a separate one for work, for rent and for proving status generally.',
    guideId: 'evisa',
    sources: [
      'https://www.gov.uk/evisa',
      'https://www.gov.uk/prove-right-to-work',
      'https://www.gov.uk/government/publications/information-booklet-for-asylum-applications/information-booklet-about-your-asylum-application',
    ],
  },
  {
    id: 'bank-account',
    label: 'Open a bank account',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    why: 'Universal Credit can be claimed without an account but cannot be paid into one that does not exist. Until this is done, the five-week wait has no end date.',
    guideId: 'bank',
    sources: [
      'https://www.gov.uk/universal-credit/how-to-claim',
      'https://www.gov.uk/guidance/documents-to-verify-your-identity-for-universal-credit',
    ],
  },
  {
    id: 'uc-payment',
    label: 'Get Universal Credit paid',
    requires: ['uc-claim', 'bank-account'],
    why: 'The claim starts the five-week clock. The account is what lets the money land.',
    guideId: 'uc',
    sources: [
      'https://www.gov.uk/universal-credit/how-to-claim',
      'https://www.gov.uk/universal-credit/what-youll-get',
    ],
  },
  {
    id: 'uc-advance',
    label: 'Get a Universal Credit Advance',
    requires: ['uc-claim', 'ni-number', 'bank-account'],
    why: 'This is what is meant to carry you through the five-week wait. Since 1 April 2024 it cannot be paid until a National Insurance number has been allocated — that is in the regulations, not up to the caseworker. If you do not have the number, this money is not available and you need a different plan for those five weeks.',
    guideId: 'ni',
    sources: [
      'https://www.legislation.gov.uk/uksi/2024/341/made',
      'https://www.gov.uk/universal-credit-advance-hardship-payment',
    ],
  },
  {
    id: 'start-work',
    label: 'Start a job',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    notRequired:
      'You do NOT need a National Insurance number to start work. An employer has to check your right to work, not your NI number. Waiting for the number before applying costs weeks you are allowed to be working. ⚠ But there is one employer your right to work does not open, and no jobs board says so: the Civil Service — HMRC, DWP, the Home Office, DVLA, the Fast Stream. Those posts are restricted by NATIONALITY, not by right to work, to British, Irish and Commonwealth citizens and some EU and Turkish nationals. The rules state that "a refugee does not automatically lose his or her nationality", so you are assessed on the passport you hold. If your country is not in the Commonwealth, these applications cannot succeed however well you write them — and the check happens before anyone reads your application. Councils, the NHS, housing associations, universities and charities have no such rule and are wide open to you.',
    why: 'Refugee status carries an unrestricted right to work, with no sponsorship needed.',
    guideId: 'work-rights',
    sources: [
      'https://www.gov.uk/prove-right-to-work',
      'https://www.gov.uk/apply-national-insurance-number',
      'https://assets.publishing.service.gov.uk/media/64d3644e667f340014b143eb/ANNEX_A_-_NATIONALITY_RULES.pdf',
      'https://www.civil-service-careers.gov.uk/nationality-requirements',
    ],
  },
  {
    id: 'start-training',
    label: 'Start a course or bootcamp',
    requires: ['decision-letter'],
    why: 'Free training is one of the fastest ways to raise what you can earn, and refugee status qualifies you immediately with no waiting period. English and maths to Level 2 are funded for anyone 19 or over who has not achieved a GCSE at grade 4 (C) or above, or who is assessed below that level — a qualification from your own country does not count unless it has been assessed as comparable, so most people arriving here qualify. Ask a college to assess you and get any refusal in writing before you pay anyone: courses that are free by entitlement are widely sold. But agree the course with your Work Coach and get that agreement written into your Universal Credit journal BEFORE you enrol.',
    notRequired:
      '⚠ This is the one step that can end your Universal Credit rather than just delay it. Someone "receiving education" fails a basic condition of entitlement and gets no UC at all — and that covers a full-time course of advanced education, a full-time course with a maintenance grant or loan, AND any course "not compatible with any work-related requirement imposed on the claimant". Whether a particular course counts is not obvious from the outside, so do not guess: ask the Work Coach first and get the answer in the journal. A free course that costs you your entire income is not free.',
    guideId: 'get-qualified-first',
    sources: [
      'https://www.legislation.gov.uk/uksi/2013/376/regulation/12',
      'https://www.legislation.gov.uk/ukpga/2012/5/section/4',
      'https://www.gov.uk/government/publications/adult-skills-fund-funding-rules/adult-skills-fund-funding-and-performance-management-rules-2026-to-2027',
    ],
  },
  {
    id: 'flexible-support-fund',
    label: 'Ask for the Flexible Support Fund',
    requires: ['uc-claim'],
    why: 'The only money on this page you never pay back, and the only one available in week one. DWP guidance: claimants are eligible "from and including the first assessment period" once you have verified your identity, attended your first commitments meeting and accepted your Claimant Commitment. It pays for things that are stopping you working — interview clothes, tools, travel to interviews, the first 3 months of travel to a new job, and, where public transport does not work, a bicycle or e-bike. Ministers have twice confirmed in Parliament that it can also pay for driving lessons, and that the decision is taken by the jobcentre Service Leader — so the ask is "please put this to the Service Leader", not "can you approve this".',
    notRequired:
      'You do NOT need a National Insurance number for this, and you do NOT need to have been on Universal Credit for six months — both of which are true of other help and stop people asking. But two things will get you refused. It must never be asked to pay for immigration documents; that is expressly prohibited. And the guidance asks whether you have "access to other funding that would cover the cost" — if you do, it must not be used. So ask the jobcentre BEFORE arranging money from family or friends, not after. Travel to a course is only paid if the course was agreed with your Work Coach BEFORE you enrolled.',
    guideId: 'uc',
    sources: [
      'https://data.parliament.uk/DepositedPapers/Files/DEP2025-0364/069._Flexible_Support_Fund-Guidance_V32.0.pdf',
      'https://www.gov.uk/universal-credit',
    ],
  },
  {
    id: 'integration-loan',
    label: 'Apply for the Refugee Integration Loan',
    requires: ['ni-number', 'bank-account'],
    why: 'Interest-free, £100–£500 for a single person. A decision takes about six weeks, so treat it as money for after the move rather than a deposit for the move itself.',
    guideId: 'refugee-integration',
    sources: [
      'https://www.gov.uk/refugee-integration-loan',
    ],
  },
  {
    id: 'rent-a-room',
    label: 'Rent somewhere',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    why: 'A landlord needs a share code for the right to rent check — an R code, not the W one you gave an employer. The money to move in is capped by law: a deposit of no more than 5 weeks\' rent, and since 1 May 2026 no more than one month\'s rent in advance. Ask your council about a bond guarantee scheme rather than finding the cash.',
    notRequired:
      '⚠ Two things landlords used to do to people in your position are now unlawful in England and Wales. They may not demand six or twelve months\' rent up front because you have no UK credit history or UK employment. And since 1 May 2026 they may not refuse you for claiming benefits: the law says a landlord or agent must not, on the basis that you are or may be a benefits claimant, stop you enquiring about a property, viewing it, or entering into a tenancy — nor apply any "provision, criterion or practice" that makes benefits claimants less likely to get it. "No DSS", and requiring applicants to be "professionals", are both caught. They CAN still turn you down on affordability or references applied equally to everyone, and they CAN still ask for a guarantor.',
    guideId: 'housing-help',
    sources: [
      'https://www.gov.uk/government/publications/right-to-rent-document-checks-a-user-guide',
      'https://www.gov.uk/prove-right-to-rent',
      'https://www.legislation.gov.uk/ukpga/2025/26/section/34',
      'https://www.legislation.gov.uk/uksi/2026/421/contents/made',
      'https://www.legislation.gov.uk/ukpga/2019/4/contents',
    ],
  },
]

export interface GoalStatus {
  goal: GoalSpec
  /** Assets still missing, in the order they should be obtained. */
  missing: Asset[]
  ready: boolean
  /** The single asset to go and get next, or null when nothing is blocking. */
  nextAsset: Asset | null
}

/**
 * Assets in the order they can actually be obtained, so "what next" names
 * something reachable rather than something itself blocked. Getting told to
 * open a bank account when you have no share code is the bug this prevents.
 */
const ASSET_ORDER: Asset[] = [
  'decision-letter',
  'ukvi-account',
  'share-code',
  'ni-number',
  'uc-claim',
  'bank-account',
]

export function assessGoal(goal: GoalSpec, held: readonly string[]): GoalStatus {
  const missing = ASSET_ORDER.filter(
    a => goal.requires.includes(a) && !held.includes(a),
  )
  return {
    goal,
    missing,
    ready: missing.length === 0,
    nextAsset: missing[0] ?? null,
  }
}

export function assessAll(held: readonly string[]): GoalStatus[] {
  return GOALS.map(g => assessGoal(g, held))
}

/**
 * The one asset that unblocks the most goals — what to do today when
 * everything feels equally urgent and nothing is obviously first.
 */
export function biggestUnlock(held: readonly string[]): Asset | null {
  const counts = new Map<Asset, number>()
  for (const status of assessAll(held)) {
    if (status.nextAsset) {
      counts.set(status.nextAsset, (counts.get(status.nextAsset) ?? 0) + 1)
    }
  }
  if (counts.size === 0) return null
  // Ties break toward the asset that comes earlier in the obtainable order,
  // so the answer is always something that can be started right now.
  let best: Asset | null = null
  let bestCount = 0
  for (const a of ASSET_ORDER) {
    const c = counts.get(a) ?? 0
    if (c > bestCount) {
      best = a
      bestCount = c
    }
  }
  return best
}
