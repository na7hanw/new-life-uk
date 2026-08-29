/**
 * Which refugee rule-set applies to you.
 *
 * On 2 March 2026 the UK replaced the 5-year refugee grant with "core
 * protection": 30 months' leave at a time, reviewed each period, and settlement
 * announced at 20 years instead of 5.
 *
 * The discriminator is the date the asylum claim was MADE, not the date it was
 * decided. Right to Remain's worked example: someone who claims on 20 February
 * 2026 and is granted on 10 June 2026 gets at least 5 years, because their
 * claim date is before 2 March. Since decisions take 6–18+ months, most people
 * being decided now claimed under the old rules — so keying this off the
 * decision date, as the app previously did, misclassifies almost everyone.
 *
 * Unaccompanied asylum-seeking children keep the 5-year minimum regardless of
 * claim date, including those who turned 18 while waiting.
 *
 * Sources:
 *  - https://www.gov.uk/government/news/refugee-protection-to-be-reviewed-every-30-months
 *  - https://righttoremain.org.uk/if-you-get-refugee-status-when-does-asylum-support-end-more-changes-to-move-on-period/
 *  - https://www.gov.uk/settlement-refugee-or-humanitarian-protection (settlement is fee-free)
 */

/** Claims made on or after this date fall under core protection. */
export const CORE_PROTECTION_FROM = '2026-03-02'

export type RefugeeCohort = 'legacy' | 'core-protection' | 'unknown'

export interface CohortFacts {
  cohort: RefugeeCohort
  /** Length of each grant of leave. */
  leave: string
  /** Years of residence before settlement can be applied for. */
  settlementYears: number | null
  /** Whether leave is reviewed and must be renewed. */
  renewable: boolean
  summary: string
}

/**
 * Derive the cohort from the claim date.
 *
 * Returns 'unknown' rather than guessing when the date is missing or
 * unparseable. 'unknown' must stay a first-class value: silently defaulting to
 * 'legacy' is how the app came to tell every refugee they could settle after
 * five years, which is wrong by fifteen years for the new cohort.
 */
export function deriveCohort(claimDate?: string | null, isUasc = false): RefugeeCohort {
  if (isUasc) return 'legacy'
  if (!claimDate) return 'unknown'
  // ISO dates compare correctly as strings; reject anything not shaped like one.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(claimDate)) return 'unknown'
  return claimDate >= CORE_PROTECTION_FROM ? 'core-protection' : 'legacy'
}

export function cohortFacts(cohort: RefugeeCohort): CohortFacts {
  switch (cohort) {
    case 'legacy':
      return {
        cohort,
        leave: '5 years',
        settlementYears: 5,
        renewable: false,
        summary:
          'You claimed before 2 March 2026, so the previous rules apply: 5 years of refugee leave, then settlement (ILR) after 5 years. Settlement is free for refugees, and you do not need the Life in the UK test or a B1 English certificate for it — those apply later, at citizenship.',
      }
    case 'core-protection':
      return {
        cohort,
        leave: '30 months',
        settlementYears: 20,
        renewable: true,
        summary:
          'You claimed on or after 2 March 2026, so you are on the new "core protection" system: 30 months of leave at a time, reviewed by the Home Office before each renewal, with settlement announced at 20 years rather than 5. The Immigration Rules for this route are still being finalised — get advice from an OISC-registered adviser about your own case.',
      }
    default:
      return {
        cohort: 'unknown',
        leave: 'depends on your claim date',
        settlementYears: null,
        renewable: false,
        summary:
          'Which rules apply depends on the date you CLAIMED asylum, not the date you were decided. Claims made on or before 1 March 2026 get 5 years and settlement after 5. Claims made on or after 2 March 2026 get 30 months at a time and settlement at 20 years. Enter your claim date, or check the length of leave on your decision letter and eVisa.',
      }
  }
}
