/**
 * What is actually left after rent.
 *
 * The app tells people what they are entitled to. It never told them what that
 * comes to once rent is paid, and that is the number that decides whether a
 * room is survivable — which is the decision someone in a move-on window makes
 * under time pressure, often on a viewing, with no way to check.
 *
 * Two facts make the honest answer much worse than the intuitive one, and both
 * are invisible unless someone says them out loud:
 *
 *  1. THE SHARED ACCOMMODATION RATE. A single person under 35 is capped at the
 *     shared rate even in a self-contained flat. Renting a studio does not
 *     unlock the one-bedroom rate. So the cap is not "what my home costs", it
 *     is a fixed number, and everything above it comes out of money meant for
 *     food.
 *  2. NO WORK ALLOWANCE. A work allowance only exists where the award includes
 *     a child element or the LCWRA element. A single claimant with neither is
 *     tapered from the first pound: the award drops 55p for every £1 of net
 *     earnings, so £100 earned is £45 gained.
 *
 * Rates are 2026/27. The Local Housing Allowance figures have been frozen since
 * April 2024 — pinned to market rents as at 31 January 2024 — so they sit well
 * below what rooms actually cost, and the gap is the point rather than a
 * rounding error.
 *
 * Sources:
 *  - https://www.gov.uk/universal-credit/what-youll-get
 *  - https://www.gov.uk/government/publications/local-housing-allowance-lha-rates-applicable-from-april-2026-to-march-2027
 *  - https://england.shelter.org.uk/housing_advice/benefits/benefits_for_under_35s_in_shared_housing
 *  - https://www.entitledto.co.uk/help/work-allowance-universal-credit
 */

/** UC standard allowance, single, 25 or over, 2026/27. Monthly. */
export const UC_STANDARD_SINGLE_25_PLUS = 424.9

/** The award drops by this much for every £1 of net earnings. */
export const TAPER_RATE = 0.55

/** Deductions (advances, debts) are capped at this share of the standard allowance. */
export const DEDUCTION_CAP_RATE = 0.15

/** Age at which the shared accommodation rate stops applying to a single adult. */
export const SHARED_RATE_MAX_AGE = 35

/**
 * The exemption worth asking about — and the one people wrongly assume they
 * already have.
 *
 * UC Regs 2013 Schedule 4 para 29(4) lifts a renter aged 16–35 off the shared
 * rate and onto the one-bedroom rate where they have "for a total of at least 3
 * months (whether or not continuously), lived in one or more hostels for
 * homeless people" AND were "offered and ... accepted services ... intended to
 * assist E to be rehabilitated or resettled within the community". Over five
 * years that is worth thousands.
 *
 * Time in Home Office asylum accommodation does NOT count, and this is worth
 * saying plainly because the assumption is natural and wrong. The same Schedule
 * defines a hostel as a building managed or owned by a provider of social
 * housing, OR "operated other than on a commercial basis" with government
 * funding, OR run by a voluntary organisation or registered charity. Asylum
 * dispersal accommodation is run by commercial contractors under a Home Office
 * contract, so it fails that limb whichever way it is read. It also has to be a
 * hostel "the main purpose of which is to provide accommodation together with
 * care, support or supervision for homeless people" — asylum support is neither
 * provided to homeless people in that sense nor accompanied by resettlement
 * services to accept.
 *
 * So: budget on the shared rate. But if a council ever places someone in a real
 * homeless hostel, three months there changes the cap, and it is worth getting
 * the manager's status in writing at the time rather than reconstructing it
 * later.
 *
 * https://www.legislation.gov.uk/uksi/2013/376/schedule/4
 */
export const SHARED_RATE_HOSTEL_EXEMPTION_MONTHS = 3

export interface LhaRates {
  /** Broad Rental Market Area name, as DWP publishes it. */
  area: string
  /** Monthly figures, as used for Universal Credit. */
  shared: number
  oneBed: number
  /** DWP's own 30th-percentile figure for the same area, where published. */
  marketShared?: number
}

/**
 * Keyed by postcode prefix, matching data/local.ts. Bolton is populated because
 * that is the app's current dispersal area; the shape takes another area as a
 * data entry.
 */
export const LHA_BY_PREFIX: Record<string, LhaRates> = {
  BL: {
    area: 'Bolton and Bury',
    shared: 341.51,
    oneBed: 475.0,
    marketShared: 435.67,
  },
}

export function lhaFor(postcode: string): LhaRates | null {
  const prefix = postcode.trim().toUpperCase().match(/^[A-Z]+/)?.[0]
  return prefix ? (LHA_BY_PREFIX[prefix] ?? null) : null
}

export interface BudgetInput {
  /** Monthly rent actually being asked. */
  rent: number
  /** The LHA cap that applies to this person. */
  lhaCap: number
  /** Net monthly earnings, if any. */
  earnings?: number
  /** Monthly council tax after any reduction. Zero in most HMO rooms. */
  councilTax?: number
  /** Monthly repayments already agreed (advance, budgeting advance). */
  deductions?: number
  /** Standard allowance. Defaults to single, 25+. */
  standardAllowance?: number
}

export interface Budget {
  /** Housing element paid: the lower of rent and the cap. */
  housingElement: number
  /** Rent above the cap, paid out of money meant for living costs. */
  shortfall: number
  /** UC actually awarded after the taper and any deductions. */
  ucAwarded: number
  /** Everything coming in. */
  totalIncome: number
  /** After rent and council tax. */
  leftOver: number
  /** After rent and council tax, per day. */
  perDay: number
  /** True when deductions exceed what the regulations allow. */
  deductionsOverCap: boolean
}

/**
 * A single person's monthly position.
 *
 * Deliberately returns leftOver even when negative. Rounding a shortfall up to
 * zero, or refusing to show it, would hide the exact case the calculation
 * exists for.
 */
export function computeBudget(input: BudgetInput): Budget {
  const standard = input.standardAllowance ?? UC_STANDARD_SINGLE_25_PLUS
  const earnings = Math.max(0, input.earnings ?? 0)
  const councilTax = Math.max(0, input.councilTax ?? 0)
  const deductions = Math.max(0, input.deductions ?? 0)
  const rent = Math.max(0, input.rent)
  const cap = Math.max(0, input.lhaCap)

  const housingElement = Math.min(rent, cap)
  const shortfall = Math.max(0, rent - cap)

  const maxAward = standard + housingElement
  // No work allowance: a single claimant with no child or LCWRA element is
  // tapered from the first pound earned.
  const afterTaper = Math.max(0, maxAward - earnings * TAPER_RATE)
  const ucAwarded = Math.max(0, afterTaper - deductions)

  const totalIncome = ucAwarded + earnings
  const leftOver = totalIncome - rent - councilTax

  return {
    housingElement,
    shortfall,
    ucAwarded,
    totalIncome,
    leftOver,
    perDay: leftOver / 30,
    deductionsOverCap: deductions > standard * DEDUCTION_CAP_RATE,
  }
}

/**
 * What one extra pound of earnings is actually worth, given the taper.
 * Stated because "I earned £400" and "I am £400 better off" are different
 * sentences, and people quite reasonably assume they are the same one.
 */
export function keptFromEarnings(earnings: number): number {
  return Math.max(0, earnings) * (1 - TAPER_RATE)
}

/**
 * Which LHA cap applies. Under 35 and single means the shared rate regardless
 * of what is actually being rented.
 */
export function capForSingleAdult(rates: LhaRates, age: number): number {
  return age < SHARED_RATE_MAX_AGE ? rates.shared : rates.oneBed
}
