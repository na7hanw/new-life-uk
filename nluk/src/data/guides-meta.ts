// guides-meta.ts — lightweight guide metadata for GuidesPage (list view).
// Contains id, cat, icon, title, and summary only — NO steps, cost, time, bring, or links.
// This keeps the home-page JavaScript bundle significantly smaller.

export type GuideMeta = {
  id: string
  cat: string
  icon: string
  content: Record<string, { title: string; summary: string }>
}

export const CATEGORIES: Record<string, { emoji: string; color: string }> = {
  "Asylum Process": { emoji: "⏳", color: "#7C3AED" },
  "Digital Status": { emoji: "📱", color: "#0D9488" },
  "Money": { emoji: "💷", color: "#16A34A" },
  "Healthcare": { emoji: "🏥", color: "#0891B2" },
  "Housing": { emoji: "🏠", color: "#D97706" },
  "Work": { emoji: "💼", color: "#2563EB" },
  "Transport": { emoji: "🚗", color: "#1D4ED8" },
  "Family & Kids": { emoji: "👨‍👩‍👧", color: "#E11D48" },
  "Documents & ID": { emoji: "📄", color: "#7C3AED" },
  "Travel": { emoji: "✈️", color: "#1D4ED8" },
  "Settle & Stay": { emoji: "🏅", color: "#CA8A04" },
  "Community": { emoji: "🤝", color: "#0D9488" },
}

export const GUIDE_PRIORITY = [
  "asylum-waiting", "aspen-card", "move-on", "bank", "uc", "ni", "evisa", "sharecode", "gp", "housing-help", "work-rights", "permission-to-work", "ctd", "citizen-card", "employment-rights", "re-qualify", "ilr", "renting", "schools", "mental", "safety", "tax", "driving", "vehicle-ownership", "interpreting", "housing-brokerage", "proof-address", "travel", "family-reunion", "nrpf", "women-support", "legal-help", "volunteering", "esol-education", "community"
];

export const GUIDE_KEYWORDS: Record<string, string[]> = {
  "asylum-waiting": ["asylum", "waiting", "decision", "ARC", "ASPEN", "Home Office", "claim", "interview", "reporting", "asylum seeker", "pending", "refused", "appeal", "fresh claim"],
  "aspen-card": ["ASPEN", "asylum support", "Section 95", "weekly payment", "NASS", "Azure card", "Section 4", "maternity grant", "Migrant Help", "prepaid card", "cash", "top up"],
  "gp": ["doctor", "dentist", "hospital", "medicine", "sick", "ill", "health", "nurse", "prescription"],
  "uc": ["benefits", "money", "income", "welfare", "payment", "poverty", "allowance", "JSA", "ESA", "PIP"],
  "ni": ["NINO", "NIN", "tax number", "national insurance number", "employment number"],
  "evisa": ["BRP", "biometric", "visa", "immigration status", "UKVI", "Home Office", "status"],
  "sharecode": ["work permit", "proof", "employer", "landlord", "rent", "right to work", "right to rent"],
  "nrpf": ["benefits", "public funds", "restrictions", "welfare", "cannot claim", "no money"],
  "ilr": ["permanent", "settled status", "indefinite", "citizenship", "remain", "settlement", "stay"],
  "mental": ["depression", "anxiety", "trauma", "therapy", "counselling", "stress", "PTSD", "sad"],
  "bank": ["money", "finance", "account", "card", "savings", "revolut", "monzo", "starling"],
  "housing-help": ["homeless", "shelter", "accommodation", "council house", "social housing", "eviction"],
  "re-qualify": ["degree", "qualifications", "diploma", "university", "professional", "credential"],
  "safety": ["police", "scam", "fraud", "abuse", "crime", "danger", "trafficking", "exploitation"],
  "tax": ["PAYE", "HMRC", "payslip", "income", "self employed", "freelance", "salary"],
  "move-on": ["56 days", "asylum support", "NASS", "hostel", "move out", "transition", "new start"],
  "work-rights": ["job", "work", "employment", "hours", "contract", "permission to work"],
  "permission-to-work": ["asylum seeker work", "permission to work", "work permit asylum", "12 months", "shortage occupation", "immigration salary list", "RQF level 6", "skilled occupations", "asylum work rights", "rule change", "expanded rules", "inadmissibility", "inadmissible", "Rwanda", "safe third country", "NRPSI", "interpreter", "Amharic"],
  "driving": ["car", "licence", "drive", "test", "foreign licence", "provisional", "learner"],
  "vehicle-ownership": ["car", "buy car", "used car", "e-bike", "electric bike", "electric scooter", "e-scooter", "motorcycle", "insurance", "MOT", "road tax", "VED", "DVLA", "V5C", "autotrader", "HPI check", "petrol", "EV", "electric car"],
  "interpreting": ["interpreter", "interpreting", "Amharic", "Tigrinya", "DPSI", "NRPSI", "CIOL", "LanguageLine", "community interpreter", "translation", "bilingual", "NHS interpreter", "court interpreter", "language", "rare language"],
  "housing-brokerage": ["housing help", "find room", "find flat", "community housing", "help find housing", "letting agent", "tenant fees", "Tenant Fees Act", "housing broker", "informal letting"],
  "ctd": ["passport", "travel document", "convention", "abroad", "fly", "flight"],
  "travel": ["abroad", "holiday", "fly", "flight", "passport", "overseas"],
  "renting": ["flat", "house", "rent", "landlord", "tenancy", "deposit", "room"],
  "women-support": ["women", "girls", "female", "domestic abuse", "FGM", "maternity", "pregnancy", "violence"],
  "schools": ["children", "kids", "school", "education", "EAL", "English", "free school meals"],
  "family-reunion": ["family", "spouse", "wife", "husband", "children", "bring family", "reunite"],
  "community": ["friends", "social", "volunteer", "mosque", "church", "library", "activities"],
  "esol-education": ["ESOL", "English classes", "language", "college", "university", "scholarship", "online course", "Coursera", "FutureLearn", "Google certificate", "PRINCE2", "CSCS", "RPL", "recognition of prior learning", "study", "education", "learning", "ARC card", "fee remission"],
  "volunteering": ["volunteer", "volunteering", "charity", "do-it", "reach", "habitat", "ICE", "mentoring", "REMA", "expenses", "unpaid", "work experience"],
  "legal-help": ["legal aid", "lawyer", "solicitor", "OISC", "immigration adviser", "law centre", "citizens advice", "free legal", "legal advice", "rights", "appeal", "tribunal", "Shelter", "ACAS", "employment rights", "housing rights"],
}

export const GUIDE_META: GuideMeta[] = [
  {
    id: "asylum-waiting",
    cat: "Asylum Process",
    icon: "⏳",
    content: {
    "en": { title: "Waiting for Your Asylum Decision", summary: "What to expect while your asylum claim is being processed — your cards, rights, payments, and what happens next." }
    },
  },
  {
    id: "evisa",
    cat: "Digital Status",
    icon: "📱",
    content: {
    "en": { title: "Your eVisa & UKVI Account", summary: "BRPs expired Dec 2024. Your immigration status is now 100% digital." }
    },
  },
  {
    id: "sharecode",
    cat: "Digital Status",
    icon: "🔗",
    content: {
    "en": { title: "Share Codes", summary: "Prove your right to work, rent, or access services." }
    },
  },
  {
    id: "nrpf",
    cat: "Digital Status",
    icon: "⚠️",
    content: {
    "en": { title: "No Recourse to Public Funds (NRPF)", summary: "NRPF restricts most benefits. Know what you CAN still access." }
    },
  },
  {
    id: "bank",
    cat: "Money",
    icon: "🏦",
    content: {
    "en": { title: "Opening a Bank Account", summary: "Asylum seekers: Monese accepts your ARC card directly — no share code needed. Others can use Revolut, Monzo, or Starling with a share code." }
    },
  },
  {
    id: "uc",
    cat: "Money",
    icon: "💷",
    content: {
    "en": { title: "Universal Credit", summary: "Main working-age benefit. Request an Advance on day one." }
    },
  },
  {
    id: "ni",
    cat: "Money",
    icon: "🔢",
    content: {
    "en": { title: "National Insurance Number", summary: "Needed for work and tax. Start working before it arrives." }
    },
  },
  {
    id: "tax",
    cat: "Money",
    icon: "📋",
    content: {
    "en": { title: "Tax & Payslips", summary: "How UK tax works. What to save for visa applications." }
    },
  },
  {
    id: "gp",
    cat: "Healthcare",
    icon: "🏥",
    content: {
    "en": { title: "NHS & GP Registration", summary: "Free NHS care for everyone — regardless of immigration status or address." }
    },
  },
  {
    id: "mental",
    cat: "Healthcare",
    icon: "🧠",
    content: {
    "en": { title: "Mental Health Support", summary: "Free mental health care. Seeking help is strength." }
    },
  },
  {
    id: "renting",
    cat: "Housing",
    icon: "🔑",
    content: {
    "en": { title: "Renting a Home", summary: "Your rights as a renter. Landlords must accept share codes." }
    },
  },
  {
    id: "housing-help",
    cat: "Housing",
    icon: "🏠",
    content: {
    "en": { title: "Council Housing & Homelessness Help", summary: "If homeless or at risk, your local council has a legal duty to help. Refugees have powerful legal protections." }
    },
  },
  {
    id: "move-on",
    cat: "Housing",
    icon: "📦",
    content: {
    "en": { title: "The 56-Day Move-On Period", summary: "Just got refugee status? You have 56 days to leave asylum accommodation and set up your new life." }
    },
  },
  {
    id: "work-rights",
    cat: "Work",
    icon: "💼",
    content: {
    "en": { title: "Your Right to Work", summary: "Know your specific work rights and restrictions before starting any job." }
    },
  },
  {
    id: "permission-to-work",
    cat: "Work",
    icon: "🔓",
    content: {
    "en": { title: "Permission to Work as an Asylum Seeker", summary: "Waited 12+ months since your asylum claim? You may already qualify — even if you've been in the inadmissibility process. Rules expand further from 26 March 2026." }
    },
  },
  {
    id: "employment-rights",
    cat: "Work",
    icon: "⚖️",
    content: {
    "en": { title: "Employment Rights", summary: "Every worker has legal rights from day one regardless of nationality." }
    },
  },
  {
    id: "schools",
    cat: "Family & Kids",
    icon: "🏫",
    content: {
    "en": { title: "Children & Schools", summary: "All children aged 5–16 have the right to a free school place." }
    },
  },
  {
    id: "ctd",
    cat: "Documents & ID",
    icon: "🛂",
    content: {
    "en": { title: "Convention Travel Document (CTD)", summary: "For recognised refugees who cannot use their home country passport." }
    },
  },
  {
    id: "citizen-card",
    cat: "Documents & ID",
    icon: "🪪",
    content: {
    "en": { title: "CitizenCard — Photo ID for £15", summary: "Government-backed PASS-accredited photo ID. No passport needed." }
    },
  },
  {
    id: "driving",
    cat: "Documents & ID",
    icon: "🚗",
    content: {
    "en": { title: "Getting a UK Driving Licence", summary: "Using foreign licences, exchanging, or starting from scratch." }
    },
  },
  {
    id: "proof-address",
    cat: "Documents & ID",
    icon: "📮",
    content: {
    "en": { title: "Proof of Address", summary: "Get accepted proof even without a fixed home." }
    },
  },
  {
    id: "travel",
    cat: "Travel",
    icon: "✈️",
    content: {
    "en": { title: "Travelling Abroad", summary: "How to travel now that BRPs are gone." }
    },
  },
  {
    id: "ilr",
    cat: "Settle & Stay",
    icon: "🏅",
    content: {
    "en": { title: "Indefinite Leave to Remain (ILR)", summary: "Permanent UK residence — the biggest milestone. Refugees use form SET(P) which is completely FREE." }
    },
  },
  {
    id: "safety",
    cat: "Community",
    icon: "🛡",
    content: {
    "en": { title: "Staying Safe", summary: "Know your rights, avoid scams, get help. The UK system has real protections for you." }
    },
  },
  {
    id: "community",
    cat: "Community",
    icon: "🤝",
    content: {
    "en": { title: "Community & Social Life", summary: "Build connections and find support near you." }
    },
  },
  {
    id: "volunteering",
    cat: "Community",
    icon: "🙋",
    content: {
    "en": { title: "Volunteering While Waiting for Your Decision", summary: "As an asylum seeker without permission to work, volunteering is the most important thing you can do. Start now — don't wait for your decision." }
    },
  },
  {
    id: "esol-education",
    cat: "Community",
    icon: "📚",
    content: {
    "en": { title: "Free ESOL & Education While Waiting", summary: "ESOL classes are free for all asylum seekers. Use your waiting time to build qualifications and skills — no decision needed." }
    },
  },
  {
    id: "re-qualify",
    cat: "Work",
    icon: "🎓",
    content: {
    "en": { title: "Recognise Your Qualifications", summary: "Your overseas degree and professional credentials can be recognised in the UK — often for free." }
    },
  },
  {
    id: "family-reunion",
    cat: "Family & Kids",
    icon: "👨‍👩‍👧",
    content: {
    "en": { title: "Family Reunion", summary: "Bring your immediate family to the UK. Know the current rules." }
    },
  },
  {
    id: "legal-help",
    cat: "Community",
    icon: "⚖️",
    content: {
    "en": { title: "Free Legal Advice", summary: "Free legal help is available for immigration, housing, employment, and more. You have the right to legal aid — this guide shows you where to find it." }
    },
  },
  {
    id: "aspen-card",
    cat: "Asylum Process",
    icon: "💳",
    content: {
    "en": { title: "Asylum Support & Your ASPEN Card", summary: "How Section 95 support works, what your ASPEN card covers, and what to do if things go wrong." }
    },
  },
  {
    id: "women-support",
    cat: "Community",
    icon: "♀️",
    content: {
    "en": { title: "Support for Women & Girls", summary: "Specialist services, career paths, safety, and rights for refugee women and girls in the UK." }
    },
  },
  {
    id: "vehicle-ownership",
    cat: "Transport",
    icon: "🚗",
    content: {
    "en": { title: "Buying a Vehicle in the UK", summary: "How to buy a car, e-bike, or e-scooter in the UK — insurance, road tax, MOT, and where to buy." }
    },
  },
  {
    id: "interpreting",
    cat: "Work",
    icon: "🗣️",
    content: {
    "en": { title: "Becoming a Community Interpreter", summary: "Speakers of rare languages like Amharic can build a viable UK career as community or public service interpreters. Here is how to qualify, register, and find work." }
    },
  },
  {
    id: "housing-brokerage",
    cat: "Housing",
    icon: "🤝",
    content: {
    "en": { title: "Helping Others Find Housing (Community Support)", summary: "Many immigrants informally help community members find housing. Here is how to do it legally, ethically, and safely — and what to avoid." }
    },
  },
]

export const GUIDE_META_MAP: Record<string, GuideMeta> = Object.fromEntries(GUIDE_META.map(g => [g.id, g]))

