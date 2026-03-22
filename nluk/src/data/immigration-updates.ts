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
    title: 'Permission to Work rules expanded — asylum seekers with degrees can access more jobs',
    sourceUrl: 'https://www.gov.uk/government/publications/workers-and-temporary-workers-permission-to-work-if-waiting-for-an-asylum-decision',
    sourceType: 'official',
    publishedAt: '2026-03-26',
    lastChecked: '2026-03-22',
    summary:
      'From 26 March 2026, asylum seekers who have been waiting 12 months or more for a decision and have a degree-level qualification are eligible for a significantly wider range of graduate-level jobs under the Permission to Work rules. This is a major expansion of the existing "Shortage Occupation List only" restriction.',
    affectedGroups: [
      'Asylum seekers who have waited 12+ months for a decision',
      'Asylum seekers with degree-level qualifications',
    ],
    whatChanged:
      'Asylum seekers with degrees who have waited 12+ months can now apply to a broader range of graduate-level jobs, not just shortage occupations.',
    whatToDo:
      'If you have a degree and have been waiting 12+ months, check the updated Permission to Work guidance on GOV.UK to understand which jobs you can apply for.',
    urgency: 'important',
    relatedGuideIds: ['permission-to-work', 'asylum-waiting', 're-qualify'],
  },
]

/**
 * Returns updates sorted newest-first by publishedAt date.
 */
export function getSortedUpdates(): ImmigrationUpdate[] {
  return [...IMMIGRATION_UPDATES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
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
