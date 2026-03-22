/**
 * Local glossary of UK immigration, benefits, and legal terms.
 *
 * Layer 1 of 3 in the glossary architecture:
 *   1. This file (offline, instant, curated)
 *   2. mediawiki.ts (Wikipedia REST fallback for unknown terms)
 *   3. GlossaryTerm component (inline StepText popovers)
 *
 * Guidelines:
 * - Keep definitions short (1–2 sentences; max ~120 chars for tooltip comfort)
 * - Use plain language — many users have limited English
 * - Include the acronym expansion as the first thing if applicable
 * - Keys are lowercase; match() lowercases before lookup
 */

export interface GlossaryEntry {
  /** Short display name (often the acronym or standard form) */
  term: string
  /** 1–2 sentence plain-language definition */
  definition: string
  /** Optional: URL to an authoritative source (gov.uk preferred) */
  sourceUrl?: string
}

// Keys are lowercase forms used for lookup; aliases share the same entry.
const GLOSSARY_RAW: Record<string, GlossaryEntry> = {
  brp: {
    term: 'BRP',
    definition: 'Biometric Residence Permit — a plastic card proving your right to live, work, or study in the UK. Being replaced by eVisa from 2025.',
    sourceUrl: 'https://www.gov.uk/biometric-residence-permits',
  },
  'biometric residence permit': {
    term: 'BRP',
    definition: 'Biometric Residence Permit — a plastic card proving your right to live, work, or study in the UK. Being replaced by eVisa from 2025.',
    sourceUrl: 'https://www.gov.uk/biometric-residence-permits',
  },
  evisa: {
    term: 'eVisa',
    definition: 'A digital record of your UK immigration status, accessed through a UKVI online account. Replaces the physical BRP card from 2025.',
    sourceUrl: 'https://www.gov.uk/guidance/online-immigration-status-evisa',
  },
  nrpf: {
    term: 'NRPF',
    definition: 'No Recourse to Public Funds — a condition on many visas that prevents you from claiming most UK benefits or social housing.',
    sourceUrl: 'https://www.gov.uk/government/publications/public-funds',
  },
  'no recourse to public funds': {
    term: 'NRPF',
    definition: 'No Recourse to Public Funds — a condition on many visas that prevents you from claiming most UK benefits or social housing.',
    sourceUrl: 'https://www.gov.uk/government/publications/public-funds',
  },
  ilr: {
    term: 'ILR',
    definition: 'Indefinite Leave to Remain — permanent UK residency with no time limit. A key step on the path to British citizenship.',
    sourceUrl: 'https://www.gov.uk/indefinite-leave-to-remain',
  },
  'indefinite leave to remain': {
    term: 'ILR',
    definition: 'Indefinite Leave to Remain — permanent UK residency with no time limit. A key step on the path to British citizenship.',
    sourceUrl: 'https://www.gov.uk/indefinite-leave-to-remain',
  },
  ltr: {
    term: 'LTR',
    definition: 'Leave to Remain — permission to stay in the UK for a specific period under a particular visa category.',
  },
  euss: {
    term: 'EUSS',
    definition: 'EU Settlement Scheme — lets EU, EEA, and Swiss citizens who lived in the UK before 31 Dec 2020 get settled or pre-settled status.',
    sourceUrl: 'https://www.gov.uk/settled-status-eu-citizens-families',
  },
  'eu settlement scheme': {
    term: 'EUSS',
    definition: 'EU Settlement Scheme — lets EU, EEA, and Swiss citizens who lived in the UK before 31 Dec 2020 get settled or pre-settled status.',
    sourceUrl: 'https://www.gov.uk/settled-status-eu-citizens-families',
  },
  aspen: {
    term: 'ASPEN card',
    definition: 'The Asylum Support Payment card — a prepaid card given to asylum seekers for their weekly financial support from the Home Office.',
  },
  'universal credit': {
    term: 'Universal Credit',
    definition: 'The main UK means-tested benefit, replacing six old benefits. Covers living costs, housing, and childcare for people on low or no income.',
    sourceUrl: 'https://www.gov.uk/universal-credit',
  },
  uc: {
    term: 'Universal Credit',
    definition: 'The main UK means-tested benefit, replacing six old benefits. Covers living costs, housing, and childcare for people on low or no income.',
    sourceUrl: 'https://www.gov.uk/universal-credit',
  },
  pip: {
    term: 'PIP',
    definition: 'Personal Independence Payment — a benefit for people with a long-term health condition or disability that affects daily living or mobility.',
    sourceUrl: 'https://www.gov.uk/pip',
  },
  'personal independence payment': {
    term: 'PIP',
    definition: 'Personal Independence Payment — a benefit for people with a long-term health condition or disability that affects daily living or mobility.',
    sourceUrl: 'https://www.gov.uk/pip',
  },
  nino: {
    term: 'NINO',
    definition: 'National Insurance Number — a unique identifier for your UK tax and benefits record. You need one to work, pay tax, or claim benefits.',
    sourceUrl: 'https://www.gov.uk/apply-national-insurance-number',
  },
  'national insurance number': {
    term: 'National Insurance Number',
    definition: 'A unique identifier for your UK tax and benefits record (format AB 12 34 56 C). You need one to work, pay tax, or claim benefits.',
    sourceUrl: 'https://www.gov.uk/apply-national-insurance-number',
  },
  gp: {
    term: 'GP',
    definition: 'General Practitioner — your local family doctor, the first point of contact for NHS healthcare. All residents can register for free.',
    sourceUrl: 'https://www.nhs.uk/nhs-services/gps/',
  },
  nhs: {
    term: 'NHS',
    definition: 'National Health Service — the UK\'s free public healthcare system, funded by taxes. Covers most medical treatment at no direct cost.',
    sourceUrl: 'https://www.nhs.uk',
  },
  dbs: {
    term: 'DBS check',
    definition: 'Disclosure and Barring Service check — a criminal records check required for many jobs working with children or vulnerable adults.',
    sourceUrl: 'https://www.gov.uk/dbs-check-applicant-guidance',
  },
  ukvi: {
    term: 'UKVI',
    definition: 'UK Visas and Immigration — the Home Office department that handles visa applications, immigration status, and border control.',
    sourceUrl: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
  },
  hmrc: {
    term: 'HMRC',
    definition: 'His Majesty\'s Revenue and Customs — the UK tax authority. Handles income tax, National Insurance, and tax credits.',
    sourceUrl: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
  },
  dwp: {
    term: 'DWP',
    definition: 'Department for Work and Pensions — the government department that manages Universal Credit and most other benefits.',
    sourceUrl: 'https://www.gov.uk/government/organisations/department-for-work-pensions',
  },
  oisc: {
    term: 'OISC',
    definition: 'Office of the Immigration Services Commissioner — regulates immigration advisers. Always use an OISC-registered adviser.',
    sourceUrl: 'https://www.gov.uk/find-an-immigration-adviser',
  },
  'right to work': {
    term: 'Right to Work',
    definition: 'Legal permission to work in the UK. Employers must check this for every employee. You can generate a share code to prove yours online.',
    sourceUrl: 'https://www.gov.uk/prove-right-to-work',
  },
  rtw: {
    term: 'Right to Work',
    definition: 'Legal permission to work in the UK. Employers must check this. You can generate a share code to prove yours online.',
    sourceUrl: 'https://www.gov.uk/prove-right-to-work',
  },
  'share code': {
    term: 'Share Code',
    definition: 'A 9-character code generated on gov.uk that proves your immigration status to employers or landlords without giving them your documents.',
    sourceUrl: 'https://www.gov.uk/view-prove-immigration-status',
  },
  bno: {
    term: 'BN(O)',
    definition: 'British National (Overseas) — a type of British nationality for Hong Kong residents and their close family, with a path to UK settlement.',
    sourceUrl: 'https://www.gov.uk/british-national-overseas-bno-visa',
  },
  nrm: {
    term: 'NRM',
    definition: 'National Referral Mechanism — the UK framework for identifying and supporting victims of modern slavery and human trafficking.',
    sourceUrl: 'https://www.gov.uk/government/publications/human-trafficking-victims-referral-and-assessment-forms',
  },
  hmo: {
    term: 'HMO',
    definition: 'House in Multiple Occupation — a property where 3+ unrelated people share facilities. Landlords need a licence and must meet safety standards.',
    sourceUrl: 'https://www.gov.uk/renting-out-a-property/hmo-licences',
  },
  isa: {
    term: 'ISA',
    definition: 'Individual Savings Account — a tax-free savings or investment account. UK residents can save up to £20,000 per year with no tax on returns.',
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
  },
  'asylum seeker': {
    term: 'Asylum Seeker',
    definition: 'Someone who has applied for asylum (refugee protection) and is waiting for a decision. They have specific rights and may receive ASPEN support.',
  },
  refugee: {
    term: 'Refugee',
    definition: 'A person who has been granted asylum and recognised as a refugee under the 1951 Refugee Convention. They have the right to work and access benefits.',
  },
  'settled status': {
    term: 'Settled Status',
    definition: 'The UK immigration status granted to EU/EEA/Swiss citizens under EUSS, giving the right to live and work in the UK indefinitely.',
    sourceUrl: 'https://www.gov.uk/settled-status-eu-citizens-families',
  },
  'pre-settled status': {
    term: 'Pre-Settled Status',
    definition: 'A temporary EU Settlement Scheme status for those with less than 5 years in the UK. Must be upgraded to Settled Status before it expires.',
    sourceUrl: 'https://www.gov.uk/settled-status-eu-citizens-families',
  },
  crs: {
    term: 'CRS',
    definition: 'Community Resettlement Scheme — a UK government programme to resettle refugees from specific countries (e.g. Ukraine, Syria, Afghanistan).',
  },
  'move-on period': {
    term: 'Move-On Period',
    definition: 'The 56-day period after being granted refugee status, during which you must leave asylum accommodation and claim Universal Credit.',
  },
  '56 days': {
    term: '56-Day Move-On',
    definition: 'After being granted refugee status, you have 56 days to leave asylum support and accommodation, and set up independent living.',
  },
  'credit score': {
    term: 'Credit Score',
    definition: 'A number (0–999) used by UK lenders to assess your creditworthiness. Built through registered address, bank accounts, and credit use.',
  },
  'council tax': {
    term: 'Council Tax',
    definition: 'A local tax paid to your council for services like refuse collection and social care. Amount varies by property band and local area.',
    sourceUrl: 'https://www.gov.uk/council-tax',
  },
  'housing benefit': {
    term: 'Housing Benefit',
    definition: 'An older benefit to help with rent costs. Most new claimants now claim the housing element of Universal Credit instead.',
    sourceUrl: 'https://www.gov.uk/housing-benefit',
  },
}

/** All glossary entries (deduplicated by canonical term) */
export const GLOSSARY: Record<string, GlossaryEntry> = GLOSSARY_RAW

/**
 * Look up a term in the local glossary.
 * Matching is case-insensitive.
 * Returns null if not found — caller should fall back to MediaWiki.
 */
export function lookupGlossaryTerm(raw: string): GlossaryEntry | null {
  return GLOSSARY_RAW[raw.toLowerCase().trim()] ?? null
}

/**
 * Returns the set of all known glossary term strings (lowercased).
 * Used by StepText to detect terms in guide content.
 */
export function getGlossaryTermKeys(): string[] {
  return Object.keys(GLOSSARY_RAW)
}
