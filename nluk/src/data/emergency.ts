import type { SosEntry, HelplineEntry } from '../types'

// ─── EMERGENCY ───────────────────────────────────────────────────
export const SOS_NUMBERS: SosEntry[] = [
  { name: "Emergency", num: "999", phone: "999", note: "Police / Fire / Ambulance" },
  { name: "NHS 111", num: "111", phone: "111", note: "Urgent medical advice · 24/7" },
  { name: "Samaritans", num: "116 123", phone: "116123", note: "Mental health crisis · 24/7" },
  { name: "Modern Slavery", num: "0800 0121 700", phone: "08000121700", note: "24/7 · Anonymous" },
  { name: "Domestic Abuse", num: "0808 2000 247", phone: "08082000247", note: "24/7 · All languages" },
  { name: "Migrant Help", num: "0808 801 0503", phone: "08088010503", note: "24/7 · Free" },
];

export const HELPLINES: HelplineEntry[] = [
  { name: "Refugee Council", num: "0808 196 7272", phone: "08081967272", hours: "Mon–Fri 9am–4pm" },
  { name: "Shelter", num: "0808 800 4444", phone: "08088004444", hours: "Mon–Fri 8am–8pm" },
  { name: "Universal Credit", num: "0800 328 5644", phone: "08003285644", hours: "Mon–Fri 8am–6pm" },
  { name: "Citizens Advice", num: "0800 144 8848", phone: "08001448848", hours: "Mon–Fri 9am–5pm" },
];

// ─── GitHub ──────────────────────────────────────────────────────
export const GITHUB_URL = 'https://github.com/na7hanw/new-life-uk';