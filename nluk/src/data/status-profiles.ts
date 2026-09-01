/**
 * One registry for everything the app shows differently per immigration status.
 *
 * This replaces four independently-maintained maps that had measurably drifted:
 *
 *   STATUS_GUIDES      (GuidesPage)  — the "For You" pins
 *   STATUS_NEXT_STEPS  (ProfilePage) — the Me tab list
 *   STATUS_GUIDE_IDS   (ProfilePage) — which update alerts to surface
 *   GUIDE_STATUS_ORDER (guides.ts)   — boost/bury for guide ordering
 *
 * For `asylum-seeker` they spanned 13 distinct guide ids with exactly ONE
 * present in all four. Adding a status meant editing four maps in three files
 * with nothing cross-checking them, and only one of the four had any test
 * coverage.
 *
 * `boost` is the single ordered list of what matters to this cohort. It drives
 * guide ordering AND the "For You" section, which takes its first few entries —
 * so the two can no longer disagree. GuidesPage removes those ids from the main
 * list beneath, since rendering them twice on one screen is what made the older
 * arrangement redundant once status-aware ordering existed.
 *
 * Deliberately imports nothing from guides.ts: guides.ts consumes this, and the
 * dependency must run one way. Referential integrity is asserted in
 * statusProfiles.test.ts instead.
 */
import type { UserStatus } from '../types'

export interface NextStep {
  icon: string
  text: string
  /** Guide id — resolved to /guide/<id> at render time. */
  guideId: string
}

export interface StatusProfile {
  /** What matters now, most important first. Drives ordering and "For You". */
  boost: string[]
  /** Obsolete or actively misleading for this cohort; sunk below everything. */
  bury: string[]
  /** The Me tab's "Next Steps" list. */
  nextSteps: NextStep[]
  /** Guides whose immigration updates should raise an alert for this cohort. */
  alertGuides: string[]
}

/** How many boosted guides the "For You" card shows. */
export const FOR_YOU_COUNT = 5

export const STATUS_PROFILES: Record<Exclude<UserStatus, ''>, StatusProfile> = {
  'asylum-seeker': {
    boost: [
      'asylum-waiting',
      'aspen-card',
      'permission-to-work',
      'legal-help',
      'volunteering',
      'esol-education',
      'community-interpreting',
      'advanced-learner',
      'gp',
    ],
    // Nothing here can be acted on until a decision arrives.
    bury: ['move-on', 'refugee-integration', 'ilr', 'family-reunion', 'social-housing'],
    nextSteps: [
      { icon: '📋', text: 'Understand your rights while waiting', guideId: 'asylum-waiting' },
      { icon: '💳', text: 'Maximise your ASPEN card support', guideId: 'aspen-card' },
      { icon: '🗣️', text: 'Community interpreting — train while waiting (no permission to work needed)', guideId: 'community-interpreting' },
      { icon: '📖', text: 'Strong English? Your real learning path', guideId: 'advanced-learner' },
      { icon: '🏥', text: 'Register with a GP — you have the right immediately', guideId: 'gp' },
      { icon: '🧠', text: 'Access free mental health support', guideId: 'mental' },
    ],
    alertGuides: ['asylum-waiting', 'permission-to-work', 'nrpf', 'evisa', 'aspen-card', 'legal-help'],
  },

  refugee: {
    boost: [
      'move-on',
      'uc',
      'housing-help',
      'social-housing',
      'refugee-integration',
      'evisa',
      'ni',
      'bank',
      'ctd',
      'ilr',
    ],
    // `nrpf` says "you cannot claim Universal Credit", which is false for
    // refugees and an active trap. `permission-to-work` is meaningless once
    // work rights are unrestricted.
    bury: ['asylum-waiting', 'aspen-card', 'permission-to-work', 'nrpf'],
    nextSteps: [
      { icon: '⏰', text: 'Start the move-on process now — 42-day deadline', guideId: 'move-on' },
      { icon: '💷', text: 'Claim Universal Credit today — the 5-week wait starts when you claim', guideId: 'uc' },
      { icon: '🏦', text: 'Open a bank account (Monzo — no credit check)', guideId: 'bank' },
      // Deliberately not "year 1 to year 5": that horizon is wrong for anyone
      // who claimed on or after 2 March 2026.
      { icon: '🌱', text: 'Your integration roadmap after status', guideId: 'refugee-integration' },
      { icon: '🏘', text: 'Understand the real council housing process', guideId: 'social-housing' },
      { icon: '📊', text: 'Start building your UK credit score', guideId: 'credit-score' },
    ],
    alertGuides: ['move-on', 'refugee-integration', 'uc', 'housing-help', 'family-reunion', 'ilr', 'evisa'],
  },

  'other-visa': {
    boost: ['work-rights', 'evisa', 'sharecode', 'employment-rights', 'bank', 'credit-score'],
    bury: ['asylum-waiting', 'aspen-card', 'move-on', 'permission-to-work', 'refugee-integration'],
    nextSteps: [
      { icon: '📱', text: 'Set up your eVisa digital status', guideId: 'evisa' },
      { icon: '🔗', text: 'Generate a share code for work or renting', guideId: 'sharecode' },
      { icon: '💼', text: 'Know your employment rights', guideId: 'employment-rights' },
      { icon: '📊', text: 'Start building your UK credit score', guideId: 'credit-score' },
    ],
    alertGuides: ['evisa', 'sharecode', 'work-rights', 'ilr', 'nrpf'],
  },

  settled: {
    boost: ['ilr', 'evisa', 'sharecode', 'credit-score', 'investing', 'tax'],
    bury: ['asylum-waiting', 'aspen-card', 'move-on', 'permission-to-work', 'nrpf', 'refugee-integration'],
    nextSteps: [
      { icon: '🏅', text: 'Check your path to Indefinite Leave to Remain', guideId: 'ilr' },
      { icon: '📊', text: 'Build your UK credit score for mortgages', guideId: 'credit-score' },
      { icon: '💰', text: 'Start investing tax-free with a Stocks & Shares ISA', guideId: 'investing' },
      { icon: '📜', text: 'UK rules every settled resident must know', guideId: 'uk-rules' },
    ],
    alertGuides: ['ilr', 'evisa', 'sharecode'],
  },
}

/** The guides pinned into "For You" for a status. Derived, never hand-listed. */
export function forYouGuideIds(status: UserStatus): string[] {
  if (!status) return []
  return STATUS_PROFILES[status]?.boost.slice(0, FOR_YOU_COUNT) ?? []
}
