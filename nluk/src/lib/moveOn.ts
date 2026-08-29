/**
 * Move-on date arithmetic.
 *
 * Two clocks run, and they are not the same clock:
 *
 *  1. ACCOMMODATION. For positive decisions notified on or after 9 March 2026,
 *     you get 42 days from the date you are NOTIFIED of the decision.
 *  2. SUPPORT. Separately, you always get a minimum of 28 days from the date on
 *     your asylum support discontinuation letter.
 *
 * The discontinuation letter normally arrives after the grant letter, so
 * whichever date falls LATER is the real deadline. The previous implementation
 * used only clock 1, which can show a deadline earlier than the true one and
 * push someone into leaving accommodation before they have to.
 *
 * Universal Credit's five-week wait is usually the binding constraint rather
 * than the deadline itself: applying on day 1 still means no money until
 * roughly day 35, so the gap between "money arrives" and "must leave" is the
 * number that actually decides whether someone becomes homeless.
 *
 * Sources:
 *  - https://homeless.org.uk/news/new-42-day-asylum-move-on-period-confirmed/
 *  - https://righttoremain.org.uk/if-you-get-refugee-status-when-does-asylum-support-end-more-changes-to-move-on-period/
 */
import { addDays, differenceInDays, isValid, parseISO } from 'date-fns'

export const ACCOMMODATION_DAYS = 42
export const SUPPORT_MIN_DAYS = 28
/** UC standard wait: 5 weeks from claim to first regular payment. */
export const UC_WAIT_DAYS = 35

export interface MoveOnPlan {
  /** grant + 42 days */
  accommodationDeadline: Date | null
  /** discontinuation + 28 days, when that letter's date is known */
  supportFloor: Date | null
  /** The later of the two — the date that actually matters. */
  deadline: Date | null
  /** Whole days from `today` to `deadline`. Negative once past. */
  daysLeft: number | null
  /** When a UC claim made on `ucClaimDate` would first pay out. */
  ucFirstPayment: Date | null
  /**
   * Days between the first UC payment and the deadline.
   * Negative means the money lands AFTER you have to leave — the situation the
   * whole move-on period exists to prevent, and the trigger for asking for an
   * advance and a support extension.
   */
  ucBufferDays: number | null
}

function toDate(iso: string | undefined | null): Date | null {
  if (!iso) return null
  const d = parseISO(iso)
  return isValid(d) ? d : null
}

/** Latest of the supplied dates, ignoring nulls. */
function latest(...dates: (Date | null)[]): Date | null {
  const real = dates.filter((d): d is Date => d !== null)
  if (real.length === 0) return null
  return real.reduce((a, b) => (b > a ? b : a))
}

export function computeMoveOnPlan(input: {
  /** ISO date you were notified of the positive decision. */
  grantDate?: string | null
  /** ISO date on the asylum support discontinuation letter, if received. */
  discontinuationDate?: string | null
  /** ISO date the UC claim was submitted. Defaults to today when omitted. */
  ucClaimDate?: string | null
  /** Injected for testability. */
  today?: Date
}): MoveOnPlan {
  const today = input.today ?? new Date()
  const grant = toDate(input.grantDate)
  const disc = toDate(input.discontinuationDate)

  const accommodationDeadline = grant ? addDays(grant, ACCOMMODATION_DAYS) : null
  const supportFloor = disc ? addDays(disc, SUPPORT_MIN_DAYS) : null
  const deadline = latest(accommodationDeadline, supportFloor)

  const ucClaim = toDate(input.ucClaimDate) ?? (grant ? today : null)
  const ucFirstPayment = ucClaim ? addDays(ucClaim, UC_WAIT_DAYS) : null

  return {
    accommodationDeadline,
    supportFloor,
    deadline,
    daysLeft: deadline ? differenceInDays(deadline, today) : null,
    ucFirstPayment,
    ucBufferDays:
      deadline && ucFirstPayment ? differenceInDays(deadline, ucFirstPayment) : null,
  }
}

export interface MoveOnAction {
  id: string
  /** Day offset from the grant date this should happen by. */
  byDay: number
  title: string
  detail: string
  /** Guide to open for the full steps. */
  guideId?: string
  /** Exact words to use, where saying the right thing changes the outcome. */
  script?: string
}

/**
 * The sequence, ordered by when it has to happen rather than by topic.
 *
 * Universal Credit and the council application are both day 1 and are
 * co-equal: UC because the five-week wait starts on the claim date, and the
 * council because the day the decision letter arrives is the day you become
 * legally "threatened with homelessness" (42 falls inside the statutory 56-day
 * threshold), which triggers the prevention duty regardless of priority need.
 */
export const MOVE_ON_ACTIONS: MoveOnAction[] = [
  {
    id: 'uc',
    byDay: 1,
    title: 'Apply for Universal Credit',
    detail:
      'The five-week wait starts the day you claim, not the day you are ready. Every day of delay is money you do not get. Ask for an Advance in the same session — it arrives in days and is repaid gradually.',
    guideId: 'uc',
  },
  {
    id: 'council',
    byDay: 1,
    title: 'Make a homelessness application to the council',
    detail:
      'Do this before you are homeless, not after. Take your decision letter and your discontinuation letter. Refugee status alone does not make you "priority need", but the prevention duty does not require it.',
    guideId: 'housing-help',
    script:
      'I am making a homelessness application. I am threatened with homelessness within 56 days and I am asking for the prevention duty. Please give me my Personalised Housing Plan in writing.',
  },
  {
    id: 'evisa',
    byDay: 2,
    title: 'Get your eVisa working and generate a share code',
    detail:
      'Do this before the bank, not after — the share code is what opens the account, and it is also how you prove right to work and right to rent. If you came from asylum support you will have had an ARC card, not a BRP: your UKVI account is created when status is granted, and the Home Office decision letter tells you how to access it. Set it up the day it arrives. (If you DO hold an old BRP, it still works to create the account until 31 December 2026.)',
    guideId: 'evisa',
  },
  {
    id: 'bank',
    byDay: 3,
    title: 'Open a bank account',
    detail:
      'Monzo, Starling, Revolut and Monese open on a share code and a selfie, with no fixed address and no credit check. ⚠ This is the hard blocker: you can CLAIM Universal Credit without an account, but it cannot PAY you until you have one. If you do not have an account yet, this is the most urgent thing on the list after the claim itself.',
    guideId: 'bank',
  },
  {
    id: 'ni',
    byDay: 7,
    title: 'Apply for your National Insurance number',
    detail: 'You can legally start work while waiting for it to arrive.',
    guideId: 'ni',
  },
  {
    id: 'gp',
    byDay: 7,
    title: 'Register with a GP',
    detail:
      'No ID, address or immigration status needed — a practice cannot refuse you on those grounds, and must give any refusal in writing.',
    guideId: 'gp',
  },
  {
    id: 'money',
    byDay: 14,
    title: 'Apply for the Refugee Integration Loan and ask about the Flexible Support Fund',
    detail:
      'The loan is £100–£500 alone or up to £780 as a couple, interest-free, applied for online. The Flexible Support Fund is discretionary help from your Work Coach with the costs of starting work.',
    guideId: 'refugee-integration',
  },
  {
    id: 'housing-register',
    byDay: 14,
    title: 'Join the council housing register and start viewing properties',
    detail:
      'Ask for your band or points in writing, and ask whether being owed a homelessness duty gives you extra priority. Most refugees end up privately renting on UC, so run both in parallel.',
    guideId: 'social-housing',
  },
  {
    id: 'extension',
    byDay: 21,
    title: 'If housing is not confirmed, request a support extension',
    detail:
      'Contact Migrant Help on 0808 801 0503. Extensions are discretionary and never automatic, so send evidence: your UC claim reference, your council application reference and Personalised Housing Plan, and dated records of properties you have enquired about.',
    guideId: 'move-on',
  },
]
