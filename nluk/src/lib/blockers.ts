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
    action: 'This comes from the Home Office. Everything else starts from it — keep the original safe and photograph every page.',
  },
  'ukvi-account': {
    action: 'You do not have to create this yourself. The Home Office sets it up and sends you a UKVI customer number with instructions for logging in — in the decision letter, or in the letter about your asylum accommodation ending. It is free, and if you already have an account do NOT create a second one. Get in the day the letter arrives: your National Insurance number and every share code live inside it, and nothing else can start until it is live.',
    guideId: 'evisa',
  },
  'share-code': {
    action: 'Generate it from your UKVI account at gov.uk/prove-right-to-work. It proves your status without handing over documents.',
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
    action: 'Claim at gov.uk/universal-credit on the day the grant letter arrives. You do NOT need a National Insurance number, an eVisa or a bank account to MAKE the claim — tell DWP at the start that you have no NI number and they will tell you how to apply. Your ARC card plus the Home Office decision letter is an accepted way to prove who you are; they must be shown together, with two supporting documents. The five-week wait starts on the day you claim, so waiting for paperwork costs money and buys nothing.',
    guideId: 'uc',
  },
}

export const GOALS: GoalSpec[] = [
  {
    id: 'share-code',
    label: 'Prove your status',
    requires: ['decision-letter', 'ukvi-account'],
    why: 'The share code is the key to almost everything else — the bank, the job, the tenancy.',
    guideId: 'evisa',
  },
  {
    id: 'bank-account',
    label: 'Open a bank account',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    why: 'Universal Credit can be claimed without an account but cannot be paid into one that does not exist. Until this is done, the five-week wait has no end date.',
    guideId: 'bank',
  },
  {
    id: 'uc-payment',
    label: 'Get Universal Credit paid',
    requires: ['uc-claim', 'bank-account'],
    why: 'The claim starts the five-week clock. The account is what lets the money land.',
    guideId: 'uc',
  },
  {
    id: 'uc-advance',
    label: 'Get a Universal Credit Advance',
    requires: ['uc-claim', 'ni-number', 'bank-account'],
    why: 'This is what is meant to carry you through the five-week wait. Since 1 April 2024 it cannot be paid until a National Insurance number has been allocated — that is in the regulations, not up to the caseworker. If you do not have the number, this money is not available and you need a different plan for those five weeks.',
    guideId: 'ni',
  },
  {
    id: 'start-work',
    label: 'Start a job',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    notRequired:
      'You do NOT need a National Insurance number to start work. An employer has to check your right to work, not your NI number. Waiting for the number before applying costs weeks you are allowed to be working.',
    why: 'Refugee status carries an unrestricted right to work, with no sponsorship needed.',
    guideId: 'work-rights',
  },
  {
    id: 'integration-loan',
    label: 'Apply for the Refugee Integration Loan',
    requires: ['ni-number', 'bank-account'],
    why: 'Interest-free, £100–£500 for a single person. A decision takes about six weeks, so treat it as money for after the move rather than a deposit for the move itself.',
    guideId: 'refugee-integration',
  },
  {
    id: 'rent-a-room',
    label: 'Rent somewhere',
    requires: ['decision-letter', 'ukvi-account', 'share-code'],
    why: 'A landlord needs a share code for the right to rent check. The deposit is usually the real obstacle, not the rent — ask your council about a bond guarantee scheme instead of cash.',
    guideId: 'housing-help',
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
