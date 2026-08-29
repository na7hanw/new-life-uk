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
 * The standard answer to that gap is a UC Advance. It has a precondition that
 * is easy to miss and that bites hardest on exactly this group: since 1 April
 * 2024 an Advance cannot be paid unless a National Insurance number has been
 * allocated (Social Security (Payments on Account of Benefit) Regulations 2013
 * reg 5(1)(d), inserted by SI 2024/341 reg 6). Someone moving on from asylum
 * support may not have one yet, so the National Insurance step is sequenced at
 * day 1 alongside the claim rather than treated as later paperwork.
 *
 * Sources:
 *  - https://homeless.org.uk/news/new-42-day-asylum-move-on-period-confirmed/
 *  - https://righttoremain.org.uk/if-you-get-refugee-status-when-does-asylum-support-end-more-changes-to-move-on-period/
 *  - https://www.legislation.gov.uk/uksi/2024/341/made (Advance requires an allocated NINo)
 *  - https://www.gov.uk/government/publications/claiming-universal-credit-and-other-benefits-if-you-are-a-refugee/refugee-guide-urgent-things-you-need-to-do
 *    (the NI number is found in the UKVI account, not on the decision letter)
 *  - https://www.gov.uk/evisa/set-up-ukvi-account (the three documented ways in)
 *  - https://www.gov.uk/government/publications/ceasing-asylum-support-instruction/ceasing-section-95-support-instruction-accessible
 *    — the authoritative calculation, quoted below.
 *
 * The Home Office instruction states the rule exactly:
 *
 *   "The end of support date should be calculated by counting 42 days from the
 *    date the grant letter was issued, (ensuring the individual gets at least
 *    28 days from the point of discontinuation), adding on 2 calendar days only
 *    if the notice is being sent by post."
 *
 *   "If the end of support date is calculated to fall on a bank holiday or
 *    weekend, the next working day should be used."
 *
 * Note ISSUED, not received. This module previously counted from the date the
 * person was notified, which is later than the issue date whenever the letter
 * takes time to arrive — so it produced a deadline LATER than the real one and
 * would have told someone they had days they did not have. The postal +2 exists
 * precisely to cover that delivery gap, and is applied explicitly instead.
 *
 * A third date matters and is modelled too: the Notice to Quit. After the grant
 * letter the accommodation provider (SERCO and others) serves an NTQ on the
 * Home Office's behalf naming the date to vacate — "Accommodation providers
 * should issue the NTQ to the individual on behalf of the Home Office with a
 * minimum of 7 days' notice". That date is the operative one, because it is
 * what the provider acts on. The 42/28 calculation is what the person was
 * OWED. When the NTQ falls earlier than the entitlement, noticeLooksShort goes
 * true — a short notice is not automatically a valid one, and it is worth
 * challenging rather than packing.
 *
 * Weekend roll-forward is modelled; bank holidays are not, because that needs a
 * maintained calendar. Not rolling forward over a bank holiday makes the
 * computed deadline EARLIER than the true one, which is the safe direction to
 * be wrong in — the app may tell someone to be ready a day early, never a day
 * late.
 */
import { addDays, differenceInDays, isValid, parseISO } from 'date-fns'

export const ACCOMMODATION_DAYS = 42
export const SUPPORT_MIN_DAYS = 28
/**
 * Added only when the notice is served by post, per the Home Office
 * calculation: "adding on 2 calendar days only if the notice is being sent by
 * post".
 */
export const POSTAL_NOTICE_DAYS = 2
/** UC standard wait: 5 weeks from claim to first regular payment. */
export const UC_WAIT_DAYS = 35

export interface MoveOnPlan {
  /** grant + 42 days */
  accommodationDeadline: Date | null
  /**
   * The date the accommodation provider's Notice to Quit says to leave by.
   * When known this IS the operative date — the other two are the entitlement
   * calculation, this is the eviction.
   */
  noticeToQuit: Date | null
  /**
   * The earliest date the rules allow: latest(grant + 42 (+2 if posted),
   * discontinuation + 28), rolled to a working day.
   */
  entitlementFloor: Date | null
  /**
   * True when the Notice to Quit demands the property back BEFORE the
   * entitlement floor. A short notice is not automatically valid, and this is
   * the single most checkable thing that goes wrong — so it is surfaced rather
   * than quietly accepted.
   */
  noticeLooksShort: boolean
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

/**
 * Roll a date off Saturday/Sunday to the following Monday.
 * Bank holidays are deliberately not modelled — see the header note.
 */
function toWorkingDay(d: Date): Date {
  const day = d.getDay()
  if (day === 6) return addDays(d, 2) // Saturday -> Monday
  if (day === 0) return addDays(d, 1) // Sunday -> Monday
  return d
}

/** Latest of the supplied dates, ignoring nulls. */
function latest(...dates: (Date | null)[]): Date | null {
  const real = dates.filter((d): d is Date => d !== null)
  if (real.length === 0) return null
  return real.reduce((a, b) => (b > a ? b : a))
}

export function computeMoveOnPlan(input: {
  /**
   * ISO date the grant letter was ISSUED — the date printed on the letter, not
   * the day it arrived. The Home Office counts the 42 days from issue.
   */
  grantDate?: string | null
  /** True when the notice was served by post, which adds 2 calendar days. */
  noticeByPost?: boolean
  /** ISO date on the asylum support discontinuation letter, if received. */
  discontinuationDate?: string | null
  /**
   * ISO date the accommodation provider's Notice to Quit requires the property
   * to be vacated. SERCO or another provider issues this after the grant
   * letter, on the Home Office's behalf.
   */
  noticeToQuitDate?: string | null
  /** ISO date the UC claim was submitted. Defaults to today when omitted. */
  ucClaimDate?: string | null
  /** Injected for testability. */
  today?: Date
}): MoveOnPlan {
  const today = input.today ?? new Date()
  const grant = toDate(input.grantDate)
  const disc = toDate(input.discontinuationDate)

  const postalDays = input.noticeByPost ? POSTAL_NOTICE_DAYS : 0
  const accommodationDeadline = grant
    ? addDays(grant, ACCOMMODATION_DAYS + postalDays)
    : null
  const supportFloor = disc ? addDays(disc, SUPPORT_MIN_DAYS) : null
  const rawFloor = latest(accommodationDeadline, supportFloor)
  const entitlementFloor = rawFloor ? toWorkingDay(rawFloor) : null

  // The Notice to Quit is the operative date once it exists: it is what the
  // provider will act on. The entitlement floor is what you were owed. Where
  // they disagree, the disagreement is the point.
  const ntq = toDate(input.noticeToQuitDate)
  const deadline = ntq ?? entitlementFloor
  const noticeLooksShort =
    ntq !== null && entitlementFloor !== null && ntq < entitlementFloor

  const ucClaim = toDate(input.ucClaimDate) ?? (grant ? today : null)
  const ucFirstPayment = ucClaim ? addDays(ucClaim, UC_WAIT_DAYS) : null

  return {
    accommodationDeadline,
    supportFloor,
    noticeToQuit: ntq,
    entitlementFloor,
    noticeLooksShort,
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
  /**
   * Where every factual claim in `detail` came from. REQUIRED, and enforced by
   * a test.
   *
   * This exists because of a specific mistake. I verified one sentence on
   * GOV.UK — "You do not need a NI number for your benefits claim to be made" —
   * and then wrote into this file that a claimant needs neither the NI number,
   * nor an eVisa, nor a bank account. Two of those three were never checked;
   * both were wrong. GOV.UK's "How to claim" requires bank account details for
   * the online claim, and the eVisa is the accepted identity document.
   *
   * Nothing in the code made me show my working, so the unsourced claims looked
   * exactly like the sourced one. Now they cannot: every action carries the
   * pages its claims rest on, and the test refuses an empty list. Being careful
   * is not a mechanism; this is.
   */
  sources: string[]
}

/**
 * The sequence, ordered by when it has to happen rather than by topic.
 *
 * Universal Credit, the National Insurance number and the council application
 * are all day 1. UC because the five-week wait starts on the claim date; the
 * National Insurance number because the Advance that bridges that wait cannot
 * be paid without one; and the council because the day the decision letter
 * arrives is the day you become legally "threatened with homelessness" (42
 * falls inside the statutory 56-day threshold), which triggers the prevention
 * duty regardless of priority need.
 */
export const MOVE_ON_ACTIONS: MoveOnAction[] = [
  {
    id: 'uc',
    byDay: 1,
    title: 'Apply for Universal Credit',
    detail:
      'The five-week wait starts the day you claim, so claim as early as you can — but two things genuinely gate it, and only one thing does not. ⚠ BANK ACCOUNT: to apply online GOV.UK requires \'your bank, building society or credit union account details\'. The account is a real prerequisite, not paperwork to catch up on later. If you do not have one yet you can still claim by phoning the Universal Credit helpline or going to the jobcentre — but open the account first if you possibly can. ⚠ ID: your eVisa is the accepted proof of identity, which means the UKVI account. If the Home Office has not created that account yet, your ARC card AND the Home Office decision letter are accepted together instead — that alternative applies only while the UKVI account does not exist. ✅ NOT a blocker: the National Insurance number. GOV.UK says \'You do not need a NI number for your benefits claim to be made\' — tell DWP at the start that you do not have one and they will tell you how to apply. Ask for an Advance in the same session, but see the next step: the Advance is the part that can be refused.',
    guideId: 'uc',
    sources: [
      'https://www.gov.uk/universal-credit/how-to-claim',
      'https://www.gov.uk/guidance/documents-to-verify-your-identity-for-universal-credit',
      'https://www.gov.uk/government/publications/claiming-universal-credit-and-other-benefits-if-you-are-a-refugee/refugee-guide-urgent-things-you-need-to-do',
    ],
  },
  {
    id: 'ni',
    byDay: 1,
    title: 'Chase your National Insurance number the same day',
    detail:
      '⚠ This is not the routine admin it looks like. Since 1 April 2024 a Universal Credit Advance cannot be paid until a National Insurance number has been ALLOCATED to you — it is a condition in the regulations, not a caseworker\'s discretion. The Advance is the thing that is supposed to carry you through the five-week wait, so if the number is missing, the plan that bridges the gap is not available. Look in your UKVI account, not on the decision letter. GOV.UK\'s own refugee guide says it plainly: "You can find your NI number by logging in to your UK Visas and Immigration (UKVI) account and viewing your online immigration status (eVisa)" — and if it is not showing there, contact the Home Office immediately. It is usually NOT printed on the decision letter, so do not lose days searching the paperwork for it. Usually is the right word: the Home Office says MOST people granted refugee status are issued one automatically, and gov.uk/apply-national-insurance-number says only that you MIGHT already have one. So check, and if it is not there, apply — do not assume it is coming. If it genuinely is not in the account once the eVisa is live, apply at gov.uk/apply-national-insurance-number and chase it in your UC journal every week, in writing. Separately, you can legally start work before the number arrives — an employer only has to see proof of right to work.',
    guideId: 'ni',
    sources: [
      'https://www.gov.uk/government/publications/claiming-universal-credit-and-other-benefits-if-you-are-a-refugee/refugee-guide-urgent-things-you-need-to-do',
      'https://www.gov.uk/apply-national-insurance-number',
      'https://www.legislation.gov.uk/uksi/2024/341/made',
    ],
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
    sources: [
      'https://www.gov.uk/guidance/homelessness-code-of-guidance-for-local-authorities',
      'https://www.legislation.gov.uk/ukpga/1996/52/part/VII',
    ],
  },
  {
    id: 'evisa',
    byDay: 2,
    title: 'Get your eVisa working and generate a share code',
    detail:
      'Do this before the bank, not after — the share code is what opens the account, and it is also how you prove right to work and right to rent. If you came from asylum support you had an ARC card, not a BRP, so this is your first UKVI account. The details to create and activate it — a login and a customer reference number — come with the grant letter or shortly after it. ⚠ Watch the gap: your 42 days start when you are notified of the decision, NOT when the eVisa goes live. Until it is live you cannot prove your status to a bank, an employer or a landlord, so every day of delay is a day of the clock spent on nothing. If the UKVI details have not arrived within a few days of the grant letter, chase them rather than wait. (If you DO hold an old BRP, it still works to create the account until 31 December 2026.)',
    guideId: 'evisa',
    sources: [
      'https://www.gov.uk/evisa',
      'https://www.gov.uk/evisa/set-up-ukvi-account',
      'https://www.gov.uk/government/publications/ceasing-asylum-support-instruction/ceasing-section-95-support-instruction-accessible',
    ],
  },
  {
    id: 'bank',
    byDay: 3,
    title: 'Open a bank account',
    detail:
      'Monzo, Starling, Revolut and Monese open on a share code and a selfie, with no fixed address and no credit check. ⚠ This is the hard blocker: you can CLAIM Universal Credit without an account, but it cannot PAY you until you have one. If you do not have an account yet, this is the most urgent thing on the list after the claim itself.',
    guideId: 'bank',
    sources: [
      'https://www.gov.uk/universal-credit/how-to-claim',
      'https://www.gov.uk/prove-right-to-work',
    ],
  },
  {
    id: 'gp',
    byDay: 7,
    title: 'Register with a GP',
    detail:
      'No ID, address or immigration status needed — a practice cannot refuse you on those grounds, and must give any refusal in writing.',
    guideId: 'gp',
    sources: [
      'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
    ],
  },
  {
    id: 'money',
    byDay: 14,
    title: 'Apply for the Refugee Integration Loan and ask about the Flexible Support Fund',
    detail:
      'The loan is £100–£500 alone or up to £780 as a couple, interest-free, applied for online. The Flexible Support Fund is discretionary help from your Work Coach with the costs of starting work.',
    guideId: 'refugee-integration',
    sources: [
      'https://www.gov.uk/refugee-integration-loan',
      'https://www.gov.uk/guidance/dwp-flexible-support-fund-dynamic-purchasing-system-2',
    ],
  },
  {
    id: 'housing-register',
    byDay: 14,
    title: 'Join the council housing register and start viewing properties',
    detail:
      'Ask for your band or points in writing, and ask whether being owed a homelessness duty gives you extra priority. Most refugees end up privately renting on UC, so run both in parallel.',
    guideId: 'social-housing',
    sources: [
      'https://www.gov.uk/apply-for-council-housing',
    ],
  },
  {
    id: 'extension',
    byDay: 21,
    title: 'If housing is not confirmed, request a support extension',
    detail:
      'Contact Migrant Help on 0808 801 0503. Extensions are discretionary and never automatic, so send evidence: your UC claim reference, your council application reference and Personalised Housing Plan, and dated records of properties you have enquired about.',
    guideId: 'move-on',
    sources: [
      'https://www.gov.uk/government/publications/ceasing-asylum-support-instruction/ceasing-section-95-support-instruction-accessible',
    ],
  },
]
