/**
 * immigration-updates.ts
 *
 * Structured official immigration update items for the UK Immigration Updates feed.
 *
 * Content policy:
 * - Tier 1 (official): GOV.UK / UKVI / Home Office — labelled "official"
 * - Tier 2 (factsheet/blog): Home Office media blog — labelled "official-factsheet"
 * - Tier 3 (policy): White papers / policy direction — labelled "policy" (not yet law)
 *
 * Each item must have: title, sourceUrl, sourceType, publishedAt, lastChecked,
 * summary, affectedGroups, whatChanged, whatToDo, urgency, and relatedGuideIds.
 *
 * This file is manually maintained and refreshed via the ingestion script
 * (scripts/fetch-immigration-updates.mjs). All items are seeded from official sources.
 */

export type UpdateSourceType =
  | 'official'            // GOV.UK / UKVI / Home Office guidance or rules
  | 'official-factsheet'  // Home Office factsheet or media blog
  | 'policy'              // White paper / policy direction (not yet in force)
  | 'fee-update'          // Official fee change
  | 'rules-change'        // Statement of Changes to the Immigration Rules

export type UpdateUrgency = 'info' | 'important' | 'action-needed'

export interface ImmigrationUpdate {
  id: string
  title: string
  sourceUrl: string
  sourceType: UpdateSourceType
  publishedAt: string       // ISO date string
  lastChecked: string       // ISO date string
  summary: string           // Plain-language summary (what changed)
  affectedGroups: string[]  // Who this affects
  whatChanged: string       // One sentence: what specifically changed
  whatToDo: string          // One sentence: what the user may need to do
  urgency: UpdateUrgency
  relatedGuideIds: string[] // IDs from GUIDE_MAP
  relatedAppIds?: string[]  // Titles from APPS array
}

export const IMMIGRATION_UPDATES: ImmigrationUpdate[] = [
  {
    id: 'evisa-travel-doc-march-2026',
    title: 'Home Office travel documents now automatically linked to UKVI accounts',
    sourceUrl: 'https://www.gov.uk/guidance/online-immigration-status-evisa',
    sourceType: 'official',
    publishedAt: '2026-03-11',
    lastChecked: '2026-03-22',
    summary:
      'From 11 March 2026, Home Office travel documents (such as Convention Travel Documents and Certificates of Travel) are automatically linked to UKVI online accounts. If you applied for a Home Office travel document on or after 25 February 2026, the document details are linked to your UKVI account automatically.',
    affectedGroups: [
      'People with Home Office travel documents',
      'Recognised refugees with Convention Travel Documents',
      'People with Certificates of Travel',
    ],
    whatChanged:
      'Home Office travel documents issued from 25 February 2026 are automatically linked to your UKVI account — no manual linking needed.',
    whatToDo:
      'Check your UKVI account to verify the link. Continue carrying your physical travel document when you travel — digital status does not replace the physical document.',
    urgency: 'important',
    relatedGuideIds: ['evisa', 'sharecode', 'travel-docs'],
    relatedAppIds: ['UKVI (UK Visas and Immigration)'],
  },
  {
    id: 'immigration-rules-march-2026',
    title: 'Statement of Changes to the Immigration Rules — March 2026',
    sourceUrl: 'https://www.gov.uk/government/collections/immigration-rules-statement-of-changes',
    sourceType: 'rules-change',
    publishedAt: '2026-03-06',
    lastChecked: '2026-03-22',
    summary:
      'A new Statement of Changes to the Immigration Rules was published on 6 March 2026. This updates the legal framework governing visa eligibility, conditions, and entitlements. Key changes affect skilled worker routes, student rules, and family visa conditions.',
    affectedGroups: [
      'Skilled workers and their employers',
      'International students',
      'Family visa holders',
      'People applying for settlement (ILR)',
    ],
    whatChanged:
      'The Immigration Rules were formally amended on 6 March 2026, with updates to several visa routes and eligibility criteria.',
    whatToDo:
      'If you are applying for a visa or extension, check the updated Immigration Rules on GOV.UK before submitting your application.',
    urgency: 'info',
    relatedGuideIds: ['work-rights', 'evisa', 'ilr', 'sharecode'],
  },
  {
    id: 'eta-fee-april-2026',
    title: 'Electronic Travel Authorisation (ETA) fee rising to £20 from 8 April 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/visa-and-immigration-operational-guidance/immigration-and-nationality-fees-april-2025-to-march-2026',
    sourceType: 'fee-update',
    publishedAt: '2026-03-18',
    lastChecked: '2026-03-22',
    summary:
      'The UK Electronic Travel Authorisation (ETA) application fee is rising from £16 to £20. This increase takes effect from 8 April 2026. If you need an ETA and have not yet applied, applying before 8 April 2026 means you pay the lower £16 fee.',
    affectedGroups: [
      'Visitors needing an ETA to enter the UK',
      'British National (Overseas) holders travelling to the UK',
      'Nationals of ETA-required countries',
    ],
    whatChanged:
      'The ETA fee increases from £16 to £20 effective 8 April 2026.',
    whatToDo:
      'If you need an ETA soon, apply before 8 April 2026 to pay £16. Apply via the official UK ETA app or GOV.UK — avoid unofficial sites that charge more.',
    urgency: 'action-needed',
    relatedGuideIds: ['travel-docs', 'evisa'],
    relatedAppIds: ['UK ETA (Electronic Travel Authorisation)'],
  },
  {
    id: 'evisa-rollout-update-2026',
    title: 'eVisa: all BRPs have expired — your immigration status is now fully digital',
    sourceUrl: 'https://www.gov.uk/guidance/evisa',
    sourceType: 'official',
    publishedAt: '2025-12-31',
    lastChecked: '2026-03-22',
    summary:
      'Biometric Residence Permits (BRPs) expired on 31 December 2024. All UK immigration status is now managed digitally through eVisas and UKVI online accounts. You must use your eVisa (and share code where required) to prove your immigration status. Physical BRP cards are no longer accepted as proof of status.',
    affectedGroups: [
      'Everyone with a UK immigration status previously issued as a BRP',
      'Employers checking right-to-work',
      'Landlords checking right-to-rent',
      'People proving status to public services',
    ],
    whatChanged:
      'BRPs expired 31 December 2024. eVisa is now the only valid digital proof of UK immigration status.',
    whatToDo:
      'Set up your UKVI online account at GOV.UK if you have not already. Use your share code to prove status to employers, landlords, or services.',
    urgency: 'action-needed',
    relatedGuideIds: ['evisa', 'sharecode'],
    relatedAppIds: ['UKVI (UK Visas and Immigration)'],
  },
  {
    id: 'asylum-ptw-expansion-march-2026',
    title: 'Permission to Work rules changing from 26 March 2026 — verify eligibility carefully',
    sourceUrl: 'https://www.gov.uk/government/publications/workers-and-temporary-workers-permission-to-work-if-waiting-for-an-asylum-decision',
    sourceType: 'official',
    publishedAt: '2026-03-26',
    lastChecked: '2026-03-22',
    summary:
      'The Permission to Work rules for asylum seekers are changing from 26 March 2026. However, the public guidance has not been fully updated and individual eligibility depends on several factors. Do not assume you are eligible — check the latest Home Office guidance or speak to a solicitor before applying or accepting a job.',
    affectedGroups: [
      'Asylum seekers who have waited 12+ months for a decision',
      'Asylum seekers with degree-level qualifications',
    ],
    whatChanged:
      'Permission to Work eligibility rules for some asylum seekers are expanding, but the full updated guidance is not yet published.',
    whatToDo:
      'Check current Home Office eligibility guidance carefully before applying for permission to work or accepting a job offer. Speak to your solicitor.',
    urgency: 'important',
    relatedGuideIds: ['permission-to-work', 'asylum-waiting', 're-qualify'],
  },
  {
    id: 'move-on-42-day-march-2026',
    title: 'Move-on period reduced: asylum support now ends after 42 days (was 56)',
    sourceUrl: 'https://www.gov.uk/asylum-support/what-youll-get',
    sourceType: 'official',
    publishedAt: '2026-03-01',
    lastChecked: '2026-03-22',
    summary:
      'The period newly recognised refugees have to leave asylum accommodation has been reduced from 56 days to 42 days. Your exact deadline is on your asylum support discontinuation letter — check it immediately. The countdown begins from the date on that letter, not from when you receive it.',
    affectedGroups: [
      'Newly recognised refugees leaving asylum accommodation',
      'People who received refugee status from March 2026',
    ],
    whatChanged:
      'The move-on grace period has been reduced from 56 to 42 days. Check your discontinuation letter for your exact deadline date.',
    whatToDo:
      'Apply for Universal Credit immediately, contact your council housing team, and open a bank account — do not wait. Check the exact date on your discontinuation letter.',
    urgency: 'action-needed',
    relatedGuideIds: ['move-on', 'uc', 'housing-help', 'social-housing'],
  },
  {
    id: 'family-reunion-closed-sept-2025',
    title: 'Refugee family reunion route CLOSED to new applications — pending Government review',
    sourceUrl: 'https://www.gov.uk/family-permit',
    sourceType: 'official',
    publishedAt: '2025-09-04',
    lastChecked: '2026-03-22',
    summary:
      'The refugee family reunion route closed to new applications at 3pm on 4 September 2025, pending a Government review. Applications submitted before that deadline may still be processed. New applicants must use standard family visa routes, which cost £1,538+ per person. Monitor GOV.UK and the Refugee Council for updates on when a revised route may reopen.',
    affectedGroups: [
      'Recognised refugees wishing to bring family to the UK',
      'Family members of refugees applying from abroad',
    ],
    whatChanged:
      'The free refugee family reunion route is closed to new applications. Applications before 3pm on 4 September 2025 may still be processed.',
    whatToDo:
      'If you applied before 3pm on 4 September 2025, contact your solicitor to check your application status. New applicants must use standard family visa routes.',
    urgency: 'action-needed',
    relatedGuideIds: ['family-reunion'],
  },
  {
    id: 'refugee-30-month-protection-march-2026',
    title: '30-month refugee leave for claims decided on or after 2 March 2026',
    sourceUrl: 'https://www.gov.uk/guidance/immigration-rules',
    sourceType: 'rules-change',
    publishedAt: '2026-03-02',
    lastChecked: '2026-03-22',
    summary:
      'Refugee protection duration has changed depending on when your claim was decided. Claims decided BEFORE 1 March 2026: 5-year leave (existing framework). Claims decided ON OR AFTER 2 March 2026: 30 months (2.5 years) initial leave, which must be renewed before applying for ILR. Check your decision letter for your exact leave dates.',
    affectedGroups: [
      'Refugees whose claims were decided on or after 2 March 2026',
      'People planning their path to Indefinite Leave to Remain (ILR)',
    ],
    whatChanged:
      'New refugees (decisions from 2 March 2026) receive 30 months of leave instead of 5 years. Leave must be renewed before applying for ILR.',
    whatToDo:
      'Check your refugee decision letter for your exact leave expiry date. If you received a decision on or after 2 March 2026, you will need to renew your leave before it expires — set a reminder well in advance.',
    urgency: 'important',
    relatedGuideIds: ['ilr', 'evisa', 'move-on'],
  },
]

const URGENCY_ORDER: Record<UpdateUrgency, number> = {
  'action-needed': 0,
  'important':     1,
  'info':          2,
}

/**
 * Returns updates sorted by urgency first (action-needed → important → info),
 * then newest-first by publishedAt date within each urgency tier.
 */
export function getSortedUpdates(): ImmigrationUpdate[] {
  return [...IMMIGRATION_UPDATES].sort((a, b) => {
    const urgencyDiff = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]
    if (urgencyDiff !== 0) return urgencyDiff
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
}

/**
 * Returns the subset of updates that are urgency 'action-needed' or 'important'.
 */
export function getHighPriorityUpdates(): ImmigrationUpdate[] {
  return getSortedUpdates().filter(u => u.urgency !== 'info')
}

/**
 * Returns updates relevant to a given guide ID.
 */
export function getUpdatesForGuide(guideId: string): ImmigrationUpdate[] {
  return getSortedUpdates().filter(u => u.relatedGuideIds.includes(guideId))
}

/** Human-readable source type labels */
export const SOURCE_TYPE_LABELS: Record<UpdateSourceType, string> = {
  official:           'Official — GOV.UK / UKVI',
  'official-factsheet': 'Official factsheet / Home Office update',
  policy:             'Policy direction (not yet in force)',
  'fee-update':       'Official fee update',
  'rules-change':     'Statement of Changes to the Immigration Rules',
}

/** Urgency badge labels and colours */
export const URGENCY_LABELS: Record<UpdateUrgency, { label: string; color: string }> = {
  'info':          { label: 'Info',          color: 'var(--t3)'  },
  'important':     { label: 'Important',     color: '#d97706'    },
  'action-needed': { label: 'Action needed', color: '#dc2626'    },
}
