/**
 * Local services, keyed by area.
 *
 * The app's national content is strong, but nothing in it told a user where to
 * physically go. "Contact your local council housing team" is not actionable
 * when you do not know the number, and a person on day 3 of a 42-day clock
 * should not have to work it out.
 *
 * Bolton/Greater Manchester is populated because that is the app's current
 * dispersal area. The shape is deliberately generic so other areas can be added
 * without touching any component — add an entry, and the Local section fills in.
 *
 * Every entry verified August 2026 against the organisation's own site or
 * Bolton Council. Phone numbers are stored digits-only for tel: links, as
 * emergency.ts does.
 */

export interface LocalService {
  name: string
  what: string
  /** Display form, e.g. "01204 335900". Empty when there is no phone route. */
  num?: string
  /** Digits only, for tel: */
  phone?: string
  email?: string
  url?: string
  address?: string
  hours?: string
  /** Why this matters in the move-on sequence. */
  why: string
  /** Which statuses this is most relevant to. Empty = everyone. */
  statuses?: string[]
}

export interface LocalArea {
  id: string
  name: string
  /** Postcode prefixes that map to this area. */
  prefixes: string[]
  services: LocalService[]
}

export const LOCAL_AREAS: LocalArea[] = [
  {
    id: 'bolton',
    name: 'Bolton',
    prefixes: ['BL'],
    services: [
      {
        name: 'Bolton Council — Housing Options',
        what: 'Make your homelessness application here',
        num: '01204 335900',
        phone: '01204335900',
        email: 'housing.options@bolton.gov.uk',
        url: 'https://www.bolton.gov.uk/homelessness-1/preventing-homelessness/1',
        why: 'This is where you invoke the prevention duty on day 1. Say you are threatened with homelessness within 56 days, and ask for your Personalised Housing Plan in writing.',
        statuses: ['refugee', 'asylum-seeker'],
      },
      {
        name: 'The Bond Board',
        what: 'A written bond instead of a cash deposit',
        num: '01204 546130',
        phone: '01204546130',
        url: 'https://www.thebondboard.org.uk/need-a-home/bond-guarantees/',
        why: 'The deposit is usually the thing that stops a move, not the rent. The Bond Board gives the landlord a written guarantee so you do not need the cash up front. You need to be 18+, homeless or threatened with homelessness, on a low income, and to have a local connection — six months living in the area counts, and time in dispersal accommodation is time living here.',
        statuses: ['refugee'],
      },
      {
        name: 'Bolton Local Welfare Provision',
        what: 'Furniture, a bed, a cooker — as goods, not cash',
        num: '01204 332772',
        phone: '01204332772',
        email: 'housing.benefit@bolton.gov.uk',
        url: 'https://www.bolton.gov.uk/benefits/help-crisis-emergency/3',
        why: 'An unfurnished room is not somewhere you can live. This provides the basics as goods, with nothing to repay, and you do not have to be on benefits to ask. Worth applying before you move rather than after. Note that a Universal Credit Budgeting Advance covers the same things but needs six months on UC first, so it is not available in the move-on window.',
        statuses: ['refugee'],
      },
      {
        name: 'Homes for Bolton',
        what: 'Social housing register and urgent housing',
        num: '01204 335811',
        phone: '01204335811',
        url: 'https://www.homesforbolton.org.uk',
        address: 'Ground Floor, Town Hall, Victoria Square, Bolton BL1 1RU',
        hours: 'Mon–Fri 9am–12pm and 1pm–5pm',
        why: 'Join the housing register in parallel with the homelessness application — they are separate processes and the waiting list is long.',
        statuses: ['refugee'],
      },
      {
        name: 'BRASS — Befriending Refugees and Asylum Seekers',
        what: 'Immigration advice, ESOL, employment support, befriending',
        num: '01204 397152',
        phone: '01204397152',
        url: 'https://brassbolton.org/',
        address: 'The Park Lodge, Bolton BL3 2HX',
        why: 'Bolton-specific and free. They help with public services, run ESOL with trained tutors, and support the move into work — useful as a UK referee too.',
      },
      {
        name: 'Bolton Destitution Project',
        what: 'Practical help for people with no income',
        url: 'https://www.boltondp.org/',
        why: 'A fallback during the five-week Universal Credit wait, when you have no money coming in and no ASPEN card any more.',
      },
      {
        name: 'Bolton DES — ESOL and skills',
        what: 'Free English classes and skills support',
        url: 'https://www.boltondes.org.uk/esolhelpandsupport',
        why: 'ASF-funded ESOL needs 6 months in the UK while awaiting a decision, but with refugee status you are eligible. Also runs the GM Refugee Welcome Bolton Partnership.',
      },
      {
        name: 'Citizens Advice Bolton',
        what: 'Free benefits, debt and housing advice',
        num: '0800 144 8848',
        phone: '08001448848',
        url: 'https://www.citizensadvice.org.uk',
        hours: 'Mon–Fri 9am–5pm (England adviceline)',
        why: 'They hold a national contract to help newly recognised refugees claim Universal Credit, with interpreting available.',
        statuses: ['refugee'],
      },
      {
        name: 'Bolton Central Library — National Databank',
        what: 'Free SIM with mobile data',
        url: 'https://www.bolton.gov.uk/libraries',
        why: 'Free data SIM (typically 20–40GB/month) plus free internet and computers — you need connectivity for the UC journal, which is how DWP contacts you.',
      },
    ],
  },
]

/** Find the area for a postcode, or undefined. Matches on the letter prefix. */
export function areaForPostcode(postcode: string | undefined | null): LocalArea | undefined {
  if (!postcode) return undefined
  const letters = postcode.trim().toUpperCase().match(/^[A-Z]+/)?.[0]
  if (!letters) return undefined
  return LOCAL_AREAS.find(a => a.prefixes.includes(letters))
}

/** Services for an area, filtered to a status when one is set. */
export function servicesFor(area: LocalArea | undefined, status?: string): LocalService[] {
  if (!area) return []
  if (!status) return area.services
  return area.services.filter(s => !s.statuses || s.statuses.includes(status))
}
