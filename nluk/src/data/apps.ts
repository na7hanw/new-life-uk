import type { SaveItem } from '../types'

/**
 * Essential apps every new arrival in the UK should install or bookmark.
 * Linked list displayed on the AppsPage (/saves/apps).
 *
 * Governance: each high-trust item is cross-referenced in APP_SOURCE_URL
 * and APP_TRUST_LEVEL at the bottom of this file. New official / financial /
 * identity items must be added to both maps when added to APPS.
 */
export const APPS: SaveItem[] = [
  // ─── Health ───────────────────────────────────────────────────
  {
    icon: "💊",
    cat: "Health",
    content: { en: { title: "NHS App", desc: "Book GP appointments, order repeat prescriptions, and view your health records. Free on iOS and Android. Download on your first day — you will use it regularly." } },
    url: "https://www.nhs.uk/nhs-app/",
    guideId: "gp",
  },
  {
    icon: "📞",
    cat: "Health",
    content: { en: { title: "NHS 111 Online — Urgent Health Advice", desc: "Get urgent (non-emergency) medical advice 24/7. The website asks you questions and tells you exactly what to do next. Faster than A&E for minor problems. Also call 111 free." } },
    url: "https://111.nhs.uk",
    guideId: "gp",
  },
  // ─── Finance ──────────────────────────────────────────────────
  {
    icon: "🏦",
    cat: "Finance",
    content: { en: { title: "Monzo — Free Bank Account", desc: "Open a free UK bank account in minutes using just your eVisa share code and a selfie. No credit checks. Instant account number and sort code for receiving benefits, wages, and paying bills. ⚠ Requires eVisa share code — an ARC card alone is NOT accepted." } },
    url: "https://monzo.com",
    guideId: "bank",
  },
  {
    icon: "💳",
    cat: "Finance",
    content: { en: { title: "Revolut — Free Bank Account", desc: "Another free UK bank account popular with new arrivals. Open with your eVisa share code and a selfie. Also supports international money transfers at competitive rates. ⚠ Requires eVisa share code — an ARC card alone is NOT accepted." } },
    url: "https://www.revolut.com",
    guideId: "bank",
  },
  {
    icon: "💱",
    cat: "Finance",
    content: { en: { title: "Wise — International Money Transfers", desc: "Send money abroad at the real exchange rate with very low fees. Widely used by immigrants to send money home to Ethiopia, Eritrea, and across Africa and the Middle East. Supports 80+ currencies. Much cheaper than bank transfers." } },
    url: "https://wise.com",
  },
  // ─── Benefits ─────────────────────────────────────────────────
  {
    icon: "💰",
    cat: "Benefits",
    content: { en: { title: "Universal Credit — Manage Your Claim", desc: "Manage your UC claim via the GOV.UK website: submit journal entries, book Jobcentre appointments, check payment dates, and report changes. Works on any phone browser — bookmark it for easy access." } },
    url: "https://www.gov.uk/sign-in-universal-credit",
    guideId: "uc",
  },
  // ─── Immigration ──────────────────────────────────────────────
  {
    icon: "🆔",
    cat: "Immigration",
    content: { en: { title: "UKVI — Check Your Immigration Status", desc: "View and share your digital immigration status (eVisa). Generate a share code to prove your right to work, rent, or access services. No physical document needed." } },
    url: "https://www.gov.uk/view-prove-immigration-status",
    guideId: "evisa",
  },
  // ─── Transport ────────────────────────────────────────────────
  {
    icon: "🗺️",
    cat: "Transport",
    content: { en: { title: "Citymapper — Public Transport", desc: "Best navigation app for UK buses, tubes, trains, cycling, and walking. Shows real-time delays. Works in London, Manchester, Birmingham, Leeds, Glasgow and 50+ UK cities." } },
    url: "https://citymapper.com",
  },
  {
    icon: "🚂",
    cat: "Transport",
    content: { en: { title: "Trainline — Cheap Train Tickets", desc: "Find and buy the cheapest train and coach tickets across the UK. Book Advance tickets up to 12 weeks ahead for up to 70% off. Also covers National Express coaches." } },
    url: "https://www.thetrainline.com",
  },
  {
    icon: "🚗",
    cat: "Transport",
    content: { en: { title: "Uber — Ride Hailing", desc: "Book a car instantly from your phone in hundreds of UK cities. Shows price upfront before you confirm. Safer than street hailing. Also offers Uber Exec, Uber XL, and cheaper UberX Share options." } },
    url: "https://www.uber.com/gb/en/",
  },
  {
    icon: "⚡",
    cat: "Transport",
    content: { en: { title: "Bolt — Cheaper Rides", desc: "A cheaper alternative to Uber for taxis and ride hailing across UK cities. Often 10–20% less expensive than Uber for the same journey. Available in London, Edinburgh, Manchester, and other major cities." } },
    url: "https://bolt.eu/en-gb/",
  },
  // ─── Housing ──────────────────────────────────────────────────
  {
    icon: "🏠",
    cat: "Housing",
    content: { en: { title: "Rightmove — Find Housing", desc: "Search rental properties across the UK. Filter by price, number of bedrooms, and distance to work. Set instant alerts for new listings in your price range." } },
    url: "https://www.rightmove.co.uk",
  },
  {
    icon: "🏡",
    cat: "Housing",
    content: { en: { title: "Zoopla — Property Search", desc: "Search for rentals and properties to buy across the UK. Shows Zoopla's estimated property value alongside listings — useful for negotiating rent. Also lists rooms and shared houses." } },
    url: "https://www.zoopla.co.uk",
  },
  {
    icon: "🛏️",
    cat: "Housing",
    content: { en: { title: "SpareRoom — Find a Room", desc: "The UK's largest room-finding platform. Search shared houses, flatshares, and rooms in private properties. Perfect when you first arrive and need affordable accommodation quickly. Free to search and respond to ads." } },
    url: "https://www.spareroom.co.uk",
  },
  // ─── Food Delivery ────────────────────────────────────────────
  {
    icon: "🛵",
    cat: "Food Delivery",
    content: { en: { title: "Deliveroo — Food Delivery", desc: "Order food from local restaurants delivered to your door. Available in most UK towns and cities. Useful when you first arrive and don't yet know where to shop. Many restaurants offer deals and discounts for new users." } },
    url: "https://deliveroo.co.uk",
  },
  {
    icon: "🍔",
    cat: "Food Delivery",
    content: { en: { title: "Just Eat — Food Delivery", desc: "The UK's largest food delivery platform with the widest range of restaurants including many African, Middle Eastern, and South Asian options. Often has better selection in smaller towns than Deliveroo or Uber Eats." } },
    url: "https://www.just-eat.co.uk",
  },
  {
    icon: "🍕",
    cat: "Food Delivery",
    content: { en: { title: "Uber Eats — Food Delivery", desc: "Food delivery from local restaurants via the Uber app. Integrated with your Uber account. Offers grocery delivery from Tesco, Aldi, and Morrisons as well as restaurant meals." } },
    url: "https://www.ubereats.com/gb",
  },
  // ─── Jobs ─────────────────────────────────────────────────────
  {
    icon: "💼",
    cat: "Jobs",
    content: { en: { title: "Indeed — Job Search", desc: "The UK's most-used job board. Search by job type, location, and salary. Upload your CV and apply in one tap. Set job alerts to receive new matches by email. Completely free." } },
    url: "https://uk.indeed.com",
    guideId: "work-rights",
  },
  {
    icon: "🔗",
    cat: "Jobs",
    content: { en: { title: "LinkedIn — Professional Network", desc: "Build your professional profile, connect with people in your field, and apply for jobs directly. Many UK employers search LinkedIn before hiring. Free basic account." } },
    url: "https://www.linkedin.com",
    guideId: "uk-cv",
  },
  {
    icon: "📋",
    cat: "Jobs",
    content: { en: { title: "Reed — Job Search", desc: "One of the UK's largest job boards covering all industries and skill levels. Particularly strong for admin, healthcare, and social care roles. Search by location, salary, and contract type. Free to use and apply." } },
    url: "https://www.reed.co.uk",
    guideId: "uk-cv",
  },
  {
    icon: "🎯",
    cat: "Jobs",
    content: { en: { title: "TotalJobs — Job Search", desc: "Major UK job board with strong coverage of engineering, construction, and professional services. Good for people with overseas qualifications looking to re-enter their profession. Free to search, upload your CV, and apply." } },
    url: "https://www.totaljobs.com",
    guideId: "uk-enic",
  },
  // ─── Learning ─────────────────────────────────────────────────
  {
    icon: "🌐",
    cat: "Learning",
    content: { en: { title: "Google Translate", desc: "Translate text, speech, photos, and live camera in 100+ languages including Amharic. Download offline language packs for use without internet. Useful for understanding letters and official documents." } },
    url: "https://translate.google.com",
  },
  {
    icon: "📚",
    cat: "Learning",
    content: { en: { title: "Duolingo — Learn English Free", desc: "Free English lessons in just 5–15 minutes per day. Game-like format keeps you motivated. One of the fastest ways to improve your everyday English. Available on iOS and Android." } },
    url: "https://www.duolingo.com",
  },
  // ─── Advice ───────────────────────────────────────────────────
  {
    icon: "⚖️",
    cat: "Advice",
    content: { en: { title: "Citizens Advice", desc: "Free advice on benefits, housing, work rights, debt, and legal issues. Find your nearest Citizens Advice bureau or use the online chat. Completely free and confidential." } },
    url: "https://www.citizensadvice.org.uk",
    guideId: "legal-help",
  },
  // ─── Shopping ─────────────────────────────────────────────────
  {
    icon: "🍱",
    cat: "Shopping",
    content: { en: { title: "Too Good To Go — Cheap Surplus Food", desc: "Restaurants, supermarkets, and bakeries sell surplus food at 1/3 of the original price every evening. A £12 restaurant meal becomes a 'Magic Bag' for £3.99. Available in every UK city. One of the best ways to eat well on a tight budget." } },
    url: "https://toogoodtogo.com/en-gb",
  },
  {
    icon: "👗",
    cat: "Shopping",
    content: { en: { title: "Vinted — Free Second-Hand Clothes", desc: "UK's largest second-hand clothing marketplace. Free to buy and sell. Find professional suits, interview clothes, winter coats, and children's clothing for £2–£15. No listing fees for sellers. Great alternative to charity shops with wider selection." } },
    url: "https://www.vinted.co.uk",
  },
  // ─── Connectivity ─────────────────────────────────────────────
  {
    icon: "📶",
    cat: "Connectivity",
    content: { en: { title: "Giffgaff — No Credit Check SIM", desc: "Pay-as-you-go and rolling monthly SIMs with no credit check, no contract, and no ID beyond your bank card. Plans from £10/month (40GB+). A key 'gap filler' for the first 12 months before you have enough UK credit history for a contract phone — which would lock you into 24 months you may be rejected for. Free SIM from giffgaff.com." } },
    url: "https://www.giffgaff.com",
  },
  // ─── Health ───────────────────────────────────────────────────
  {
    icon: "🧠",
    cat: "Health",
    content: { en: { title: "NHS Talking Therapies — Self-Refer", desc: "Free NHS talking therapy (CBT, counselling, guided self-help) — no GP referral required. Self-refer online or by phone in your area. Wait times 2–12 weeks depending on location. Available in most languages via interpreter. One of the most underused services in the NHS." } },
    url: "https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/",
    guideId: "mental",
  },
  // ─── Community ────────────────────────────────────────────────
  {
    icon: "🍎",
    cat: "Community",
    content: { en: { title: "Olio — Free Food & Items", desc: "Neighbours share surplus food, furniture, and household items for free. Great for furnishing a new home on a tight budget. Also lists free food from cafés and supermarkets." } },
    url: "https://olioapp.com",
  },
  {
    icon: "🏘️",
    cat: "Community",
    content: { en: { title: "Nextdoor — Your Local Neighbourhood", desc: "Connect with people in your immediate neighbourhood. Neighbours give away free furniture, warn about local scams, share recommendations for local services, and organise community events. The single fastest way to get embedded in your local community." } },
    url: "https://nextdoor.co.uk",
  },
  // ─── Official Identity & Login ────────────────────────────────
  {
    icon: "🔐",
    cat: "Identity & Login",
    content: { en: { title: "GOV.UK One Login", desc: "The UK government's single sign-on system for all GOV.UK services. Use it to prove your identity online for Companies House director verification, HMRC Self Assessment, DWP benefits, and dozens of other services. Create a free account with your email, a password, and a photo ID." } },
    url: "https://www.gov.uk/sign-in",
    guideId: "companies-house-id",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "📋",
    cat: "Identity & Login",
    content: { en: { title: "Companies House — Register & File", desc: "The official UK company registration service. Register a new limited company (£50), file annual accounts and Confirmation Statements, and complete director identity verification. All directors must verify their identity through this service from 2025." } },
    url: "https://www.gov.uk/register-your-company",
    guideId: "limited-company",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  // ─── Digital ID / Proof of Age ────────────────────────────────
  {
    icon: "🪪",
    cat: "Identity & Login",
    content: { en: { title: "Yoti — Digital ID App", desc: "Free UK-accepted digital ID app. Add your passport or driving licence once and use Yoti as a digital proof of age or identity at participating venues, age-restricted purchases, and online services. Accepted by many UK organisations as a valid form of ID." } },
    url: "https://www.yoti.com",
    trustLevel: "commercial",
    lastVerified: "March 2026",
  },
  {
    icon: "🆔",
    cat: "Identity & Login",
    content: { en: { title: "EasyID — Digital Proof of Age", desc: "Free digital ID app for proving your age in UK shops, bars, and online. Add your passport or driving licence. Accepted by many UK retailers and venues under the PASS (Proof of Age Standards Scheme). Useful if you do not carry your passport." } },
    url: "https://easyid.com",
    trustLevel: "commercial",
    lastVerified: "March 2026",
  },
  // ─── Training Platforms ───────────────────────────────────────
  {
    icon: "🎓",
    cat: "Training",
    content: { en: { title: "National Careers Service", desc: "Free government career advice service. Get a personalised action plan, explore career options, find courses and training, and get CV and interview help. Available online or via phone (0800 100 900, free). Also see in-person sessions at Jobcentre Plus." } },
    url: "https://nationalcareers.service.gov.uk",
    guideId: "uk-cv",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "📖",
    cat: "Training",
    content: { en: { title: "Free Courses for Jobs — GOV.UK", desc: "Hundreds of free Level 2 and Level 3 qualifications for adults in England who do not already have A levels or equivalent. Covers healthcare, construction, engineering, digital, business, and more. Funded by the government — free if eligible." } },
    url: "https://www.gov.uk/guidance/free-courses-for-jobs",
    guideId: "esol-education",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "💡",
    cat: "Training",
    content: { en: { title: "Skills Bootcamps — GOV.UK", desc: "Intensive training programmes (typically 12–16 weeks) in digital, green energy, construction, HGV driving, and engineering. Free for adults aged 19+ in England. Guaranteed job interview on completion. Especially good for career changers." } },
    url: "https://www.gov.uk/guidance/find-a-skills-bootcamp",
    guideId: "esol-education",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "🏆",
    cat: "Training",
    content: { en: { title: "Jobskilla — Free Skills Training", desc: "Free skills platform offering short online training in digital marketing, employability, and business skills. Courses take 1–8 hours. Includes a CV builder and job search tools. Particularly useful for people building their first UK work history." } },
    url: "https://www.jobskilla.com",
    trustLevel: "commercial",
    lastVerified: "March 2026",
  },
  // ─── Business Setup / Self-Employment ────────────────────────
  {
    icon: "🧾",
    cat: "Business & Money",
    content: { en: { title: "Register as Self-Employed — HMRC", desc: "Register as a sole trader or self-employed person with HMRC online. Free, takes 30 minutes. Do it as soon as you start trading — you must register by 5 October in your second year of trading or face a fine." } },
    url: "https://www.gov.uk/set-up-sole-trader",
    guideId: "sole-trader",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "🏢",
    cat: "Business & Money",
    content: { en: { title: "Companies House — Register a Company", desc: "Register a UK limited company online for £50. Takes 24 hours. Includes guided setup for company name, address, directors, shareholders, and SIC code. Directors must also complete identity verification via GOV.UK One Login." } },
    url: "https://www.gov.uk/register-your-company",
    guideId: "limited-company",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "🤲",
    cat: "Business & Money",
    content: { en: { title: "Set Up a Social Enterprise / CIC", desc: "Information and application process for setting up a Community Interest Company (CIC) — a limited company structure designed for social enterprises and community businesses. Includes the CIC36 application form and CIC Regulator guidance." } },
    url: "https://www.gov.uk/set-up-a-social-enterprise",
    guideId: "cic",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  // ─── Money Safety ─────────────────────────────────────────────
  {
    icon: "🛡️",
    cat: "Business & Money",
    content: { en: { title: "MoneyHelper — Free Money Guidance", desc: "Free, impartial money and pensions guidance backed by the UK government. Covers budgeting, debt, savings, pensions, scams, and financial planning. Available in multiple languages. Delivered by the Money and Pensions Service (MaPS)." } },
    url: "https://www.moneyhelper.org.uk",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "🔍",
    cat: "Business & Money",
    content: { en: { title: "FCA Financial Services Register", desc: "Check whether a financial firm or adviser is regulated by the FCA (Financial Conduct Authority) before trusting them with your money. Takes 60 seconds. If they are not on this register, do not send them money." } },
    url: "https://register.fca.org.uk",
    guideId: "before-you-invest",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
  {
    icon: "🚨",
    cat: "Business & Money",
    content: { en: { title: "Action Fraud — Report Scams", desc: "The UK's national reporting centre for fraud and cybercrime. Report if you have been scammed or are suspicious of a firm. Call 0300 123 2040 (24/7) or report online. Also check the FCA ScamSmart site for investment fraud." } },
    url: "https://www.actionfraud.police.uk",
    guideId: "scam-warnings",
    trustLevel: "official",
    lastVerified: "March 2026",
  },
]

// ─── Official source URLs for apps/resources ─────────────────────────────────
// Enforced by tests: every high-risk app must appear here.
export const APP_SOURCE_URL: Record<string, string> = {
  'GOV.UK One Login':                       'https://www.gov.uk/sign-in',
  'Companies House — Register & File':       'https://www.gov.uk/register-your-company',
  'National Careers Service':               'https://nationalcareers.service.gov.uk',
  'Free Courses for Jobs — GOV.UK':         'https://www.gov.uk/guidance/free-courses-for-jobs',
  'Skills Bootcamps — GOV.UK':              'https://www.gov.uk/guidance/find-a-skills-bootcamp',
  'Register as Self-Employed — HMRC':       'https://www.gov.uk/set-up-sole-trader',
  'Companies House — Register a Company':   'https://www.gov.uk/register-your-company',
  'Set Up a Social Enterprise / CIC':       'https://www.gov.uk/set-up-a-social-enterprise',
  'MoneyHelper — Free Money Guidance':      'https://www.moneyhelper.org.uk',
  'FCA Financial Services Register':        'https://register.fca.org.uk',
  'Action Fraud — Report Scams':            'https://www.actionfraud.police.uk',
}

// ─── Trust level for apps/resources ──────────────────────────────────────────
// 'official' = GOV.UK / NHS / FCA / statutory body
// 'ngo'       = registered charity or non-profit
// 'charity'   = specifically Charity Commission registered
// 'commercial' = private company (may still be reputable)
export const APP_TRUST_LEVEL: Record<string, 'official' | 'ngo' | 'charity' | 'commercial'> = {
  'GOV.UK One Login':                       'official',
  'Companies House — Register & File':       'official',
  'Yoti — Digital ID App':                  'commercial',
  'EasyID — Digital Proof of Age':          'commercial',
  'National Careers Service':               'official',
  'Free Courses for Jobs — GOV.UK':         'official',
  'Skills Bootcamps — GOV.UK':              'official',
  'Jobskilla — Free Skills Training':       'commercial',
  'Register as Self-Employed — HMRC':       'official',
  'Companies House — Register a Company':   'official',
  'Set Up a Social Enterprise / CIC':       'official',
  'MoneyHelper — Free Money Guidance':      'official',
  'FCA Financial Services Register':        'official',
  'Action Fraud — Report Scams':            'official',
  // Existing apps
  'NHS App':                                'official',
  'NHS 111 Online — Urgent Health Advice':  'official',
  'Universal Credit — Manage Your Claim':   'official',
  'UKVI — Check Your Immigration Status':   'official',
  'Citizens Advice':                        'charity',
  'NHS Talking Therapies — Self-Refer':     'official',
}
