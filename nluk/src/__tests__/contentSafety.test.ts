/**
 * Content safety regression guards.
 *
 * This app gives life-changing advice to people facing legal deadlines,
 * homelessness and, in some cases, danger. The August 2026 audit found several
 * claims that were confidently stated and factually wrong — each of which had
 * passed the existing 486-test suite, because nothing asserted *correctness*,
 * only *presence*.
 *
 * Every test here encodes a specific error that was actually shipped. They are
 * deliberately blunt string assertions: the point is that a future edit (or a
 * future model) cannot silently reintroduce them.
 *
 * Sources are cited per-test so the assertion can be re-verified, not trusted.
 */
import { describe, it, expect } from 'vitest'
import { GUIDES, GUIDE_SOURCE_URL } from '../data/guides.ts'
import { JOBS, CERTS, CAREERS } from '../data/jobs.ts'
import { SAVES, GEMS } from '../data/saves.ts'
import { APPS } from '../data/apps.ts'
import { SOS_NUMBERS, HELPLINES } from '../data/emergency.ts'

/** Every user-visible string in the data layer, concatenated once. */
const ALL_CONTENT = JSON.stringify([GUIDES, JOBS, CERTS, CAREERS, SAVES, GEMS, APPS, GUIDE_SOURCE_URL])

describe('safety: police and immigration data sharing', () => {
  // There is NO firewall. The Domestic Abuse Commissioner found every police
  // force in England and Wales had shared migrant victims' data with
  // Immigration Enforcement, and the Home Office rejected the firewall
  // recommendation. Telling an undocumented survivor otherwise can lead
  // directly to detention or removal.
  // https://www.endviolenceagainstwomen.org.uk/home-office-rejects-recommendation-to-introduce-a-firewall-to-protect-migrant-survivors/
  it('never claims police have an immigration "firewall"', () => {
    expect(ALL_CONTENT).not.toMatch(/firewall polic/i)
    expect(ALL_CONTENT).not.toMatch(/do NOT share information with the Home Office/i)
  })

  it('never claims police do not report to immigration enforcement', () => {
    expect(ALL_CONTENT).not.toMatch(/[Pp]olice do NOT report to immigration/)
    expect(JSON.stringify(SOS_NUMBERS)).not.toMatch(/No immigration reporting/i)
  })
})

describe('safety: the move-on deadline', () => {
  // 42 days from decision NOTIFICATION (decisions on/after 9 March 2026), plus
  // a separate 28-day minimum from the discontinuation letter. It was 56 at one
  // point; stating 56 today gives someone two weeks they do not have.
  // https://homeless.org.uk/news/new-42-day-asylum-move-on-period-confirmed/
  it('never states the move-on period as 56 days', () => {
    expect(ALL_CONTENT).not.toMatch(/56[- ]day move.on/i)
    expect(ALL_CONTENT).not.toMatch(/56 days to leave/i)
  })

  it('still states the 42-day period somewhere prominent', () => {
    expect(ALL_CONTENT).toMatch(/42[- ]days?/i)
  })
})

describe('safety: settlement is fee-free for refugees', () => {
  // GOV.UK: "There's no fee if you have protection status (permission to stay
  // as a refugee or person with humanitarian protection) or section 67 leave."
  // Telling a destitute refugee ILR costs £2,885 can stop them applying at all.
  // https://www.gov.uk/settlement-refugee-or-humanitarian-protection
  it('never presents an ILR fee as payable by refugees', () => {
    // The figure may appear as a contrast ("free, saving you £X") but must never
    // be stated as the fee a refugee pays.
    expect(ALL_CONTENT).not.toMatch(/ILR fee is £[\d,]+ per person/i)
    expect(ALL_CONTENT).not.toMatch(/apply for Indefinite Leave to Remain[^"]{0,120}The fee is £/i)
  })
})

describe('emergency contacts', () => {
  it('has the four life-safety numbers', () => {
    const nums = SOS_NUMBERS.map(s => s.phone)
    for (const n of ['999', '111', '116123']) expect(nums).toContain(n)
  })

  it('every phone is dialable digits and matches its display form', () => {
    for (const e of [...SOS_NUMBERS, ...HELPLINES]) {
      expect(e.phone, `${e.name} phone must be digits only`).toMatch(/^[0-9]+$/)
      expect(e.phone, `${e.name}: phone must equal num without spaces`).toBe(e.num.replace(/\s/g, ''))
    }
  })

  it('does not carry the superseded Migrant Help number', () => {
    // 0808 8000 631 is the legacy Asylum Help line; GOV.UK gives 0808 801 0503.
    expect(ALL_CONTENT).not.toContain('0808 8000 631')
    expect(JSON.stringify([SOS_NUMBERS, HELPLINES])).not.toContain('08088000631')
  })

  it('does not link the dead Women for Refugee Women domain', () => {
    // womenforrefugeewomen.org.uk no longer resolves (NXDOMAIN); it is refugeewomen.co.uk.
    expect(ALL_CONTENT).not.toContain('womenforrefugeewomen')
  })
})

describe('claims about availability', () => {
  // A helpline advertised as 24/7 that closes at 8pm sends someone in crisis
  // to a dead line with no fallback.
  it('does not advertise the NSPCC FGM line as 24/7', () => {
    expect(ALL_CONTENT).not.toMatch(/0800 028 3550 \(free, 24\/7\)/)
  })

  it('does not advertise Action Fraud as 24/7', () => {
    // 24/7 applies only to organisations under live cyber attack.
    expect(ALL_CONTENT).not.toMatch(/0300 123 2040 \(24\/7\)/)
  })
})

describe('no relative-time phrasing in shipped copy', () => {
  // "this week" was still rendered five months after the week in question.
  // Dates must be absolute so they age visibly rather than silently lying.
  it('contains no relative-time phrases', () => {
    const banned = /\b(this|next|last) (week|month)\b|\bcoming weeks\b|\bin a few days\b/i
    const hit = ALL_CONTENT.match(banned)
    expect(hit, `banned relative-time phrase: ${hit?.[0]}`).toBeNull()
  })
})

describe('benefit entitlements state their conditions', () => {
  // NHS prescription/dental exemption on UC has an earnings test; getting it
  // wrong is a penalty of up to £100, and 150,000+ were issued in 2024/25.
  // https://www.nhsbsa.nhs.uk/universal-credit-help-your-patients-avoid-costly-mistakes
  it('does not claim UC alone gives free prescriptions or dental care', () => {
    expect(ALL_CONTENT).not.toMatch(/Free dental if you're on UC — tell the dentist/i)
    expect(ALL_CONTENT).not.toMatch(/If you receive UC, Income Support, ESA, or Pension Credit — all NHS prescriptions are FREE/i)
  })
})
