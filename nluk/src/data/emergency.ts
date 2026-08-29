import type { SosEntry, HelplineEntry } from '../types'

// ─── EMERGENCY ───────────────────────────────────────────────────
export const SOS_NUMBERS: SosEntry[] = [
  { name: "Emergency", num: "999", phone: "999", note: "Police / Fire / Ambulance" },
  { name: "Police Non-Emergency", num: "101", phone: "101", note: "Report crimes · Free" },
  { name: "NHS 111", num: "111", phone: "111", note: "Urgent medical advice · 24/7" },
  { name: "Samaritans", num: "116 123", phone: "116123", note: "Mental health crisis · 24/7" },
  { name: "Modern Slavery", num: "0800 0121 700", phone: "08000121700", note: "24/7 · Anonymous" },
  { name: "Domestic Abuse (England)", num: "0808 2000 247", phone: "08082000247", note: "24/7 · All languages" },
  { name: "Domestic Abuse (Wales)", num: "0808 80 10 800", phone: "08088010800", note: "24/7 · Live Fear Free" },
  { name: "Domestic Abuse (Scotland)", num: "0800 027 1234", phone: "08000271234", note: "24/7" },
  { name: "Domestic Abuse (N. Ireland)", num: "0808 802 1414", phone: "08088021414", note: "24/7" },
  { name: "Migrant Help", num: "0808 801 0503", phone: "08088010503", note: "24/7 · Free" },
];

export const HELPLINES: HelplineEntry[] = [
  { name: "Refugee Council", num: "0808 196 7272", phone: "08081967272", hours: "Mon & Thu 9.30am–12.30pm" },
  { name: "Shelter (Housing)", num: "0808 800 4444", phone: "08088004444", hours: "Mon–Fri 8am–5pm · closed weekends" },
  { name: "Universal Credit", num: "0800 328 5644", phone: "08003285644", hours: "Mon–Fri 8am–6pm" },
  { name: "Citizens Advice", num: "0800 144 8848", phone: "08001448848", hours: "Mon–Fri 9am–5pm" },
  { name: "Bail for Detainees (BID)", num: "020 7456 9750", phone: "02074569750", hours: "Mon–Thu 10am–12pm" },
  { name: "Mind (Mental Health)", num: "0300 123 3393", phone: "03001233393", hours: "Mon–Fri 9am–6pm" },
];

// ─── GitHub ──────────────────────────────────────────────────────
export const GITHUB_URL = 'https://github.com/na7hanw/new-life-uk';