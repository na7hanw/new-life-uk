// ─── i18n-Ready Data Architecture ─────────────────────────────────
// Every content object uses: { en: {...}, ar: {...}, ... }
// Components resolve: content[lang] || content.en
// To add a translation: add a new language key to any content object

export const LANGS = [
  { code: "en", native: "English", flag: "🇬🇧", rtl: false },
  { code: "ar", native: "العربية", flag: "🇸🇦", rtl: true, ar: true },
  { code: "fa", native: "فارسی", flag: "🇮🇷", rtl: true, ar: true },
  { code: "ur", native: "اردو", flag: "🇵🇰", rtl: true, ar: true },
  { code: "am", native: "አማርኛ", flag: "🇪🇹", eth: true },
  { code: "ti", native: "ትግርኛ", flag: "🇪🇷", eth: true },
  { code: "so", native: "Soomaali", flag: "🇸🇴" },
  { code: "om", native: "Afaan Oromoo", flag: "🇪🇹" },
  { code: "uk", native: "Українська", flag: "🇺🇦" },
  { code: "ro", native: "Română", flag: "🇷🇴" },
  { code: "pl", native: "Polski", flag: "🇵🇱" },
  { code: "fr", native: "Français", flag: "🇫🇷" },
];

// ─── UI Strings (fully translated) ───────────────────────────────
const BASE_UI = {
  app: "New Life UK", tag: "Your free guide to life in the UK",
  sos: "SOS", close: "Close", back: "Back", change: "Change",
  home: "Home", guides: "Guides", work: "Work", saves: "Free Stuff", more: "More",
  search: "Search guides…", noResults: "No results found.",
  cost: "Cost", time: "Time", bring: "What to bring", steps: "Steps", keyInfo: "Key Info",
  visaQ: "What's your visa situation?", forYou: "For You", quickActions: "Quick Actions", helplines: "Helplines",
  jobsTab: "Jobs", certsTab: "Certs", careerTab: "Careers",
  savesTitle: "Free Stuff & Discounts", savesSub: "Things most new arrivals never find out about.",
  gemsTitle: "Hidden Gems 💎", gemsSub: "Free money, career shortcuts, insider routes.",
  theme: "Theme", language: "Language", apply: "Apply", freeRoute: "Free route available",
  darkMode: "🌙 Dark", lightMode: "☀️ Light", settings: "Settings",
  share: "Share", shareWhatsapp: "WhatsApp", shareTelegram: "Telegram", shareFacebook: "Facebook", shareCopy: "Copy link",
  copied: "Copied!",
  qaEvisa: "eVisa", qaShare: "Share Code", qaBank: "Bank", qaGP: "GP / NHS", qaBenefits: "Benefits", qaID: "ID Card", qaTravel: "Travel Doc", qaSafety: "Safety",
  status: { refugee: "Refugee", skilled: "Skilled Worker", family: "Family Visa", eu: "EU Settled", student: "Student", other: "Other" },
  openLink: "Open link", studyLinks: "Study Resources", applyLinks: "Apply / Sign Up", sourceCode: "View Source on GitHub",
  docsNeeded: "What you'll need", jobsApplyTo: "Where to apply",
  privacy: "Privacy & Data", privacyTitle: "Your Privacy",
  privacyBody: "This app stores only your language preference and theme setting locally on your device. No personal data is ever collected, transmitted, or shared. No analytics. No cookies. No tracking. No servers. Fully GDPR compliant.",
  privacyLocal: "Stored locally on your device only:", privacyNone: "Nothing ever sent to any server.",
  gdprRights: "GDPR rights: right to access, rectify, erase. Clear your browser/app data at any time to remove all stored preferences.",
  disclaimer: "This is not legal advice and is not affiliated with the UK Government. For official information, visit GOV.UK or consult an OISC-registered immigration adviser.",
};

const UI_OVERRIDES = {
  ar: { app: "حياة جديدة UK", tag: "دليلك المجاني للحياة في بريطانيا", sos: "طوارئ", close: "إغلاق", back: "رجوع", change: "تغيير", home: "الرئيسية", guides: "الأدلة", work: "العمل", saves: "مجاني", more: "المزيد", search: "ابحث…", noResults: "لا نتائج.", cost: "التكلفة", time: "المدة", bring: "أحضر معك", steps: "الخطوات", keyInfo: "معلومات", visaQ: "ما وضع تأشيرتك؟", forYou: "لك", quickActions: "إجراءات سريعة", helplines: "خطوط المساعدة", jobsTab: "وظائف", certsTab: "شهادات", careerTab: "مسارات", savesTitle: "مجاني وخصومات", gemsTitle: "جواهر مخفية 💎", theme: "المظهر", language: "اللغة", apply: "تقدّم", freeRoute: "مسار مجاني", darkMode: "🌙 داكن", lightMode: "☀️ فاتح", settings: "الإعدادات", share: "مشاركة", shareWhatsapp: "واتساب", shareCopy: "نسخ الرابط", copied: "تم النسخ!", qaEvisa: "تأشيرة", qaShare: "رمز المشاركة", qaBank: "البنك", qaGP: "الطبيب", qaBenefits: "الإعانات", qaID: "هوية", qaTravel: "وثيقة سفر", qaSafety: "الأمان", status: { refugee: "لاجئ", skilled: "عامل ماهر", family: "تأشيرة عائلية", eu: "مستوطن EU", student: "طالب", other: "أخرى" }, openLink: "افتح الرابط", disclaimer: "هذا ليس استشارة قانونية وغير تابع لحكومة المملكة المتحدة." },
  fa: { app: "زندگی نو UK", tag: "راهنمای رایگان بریتانیا", sos: "اضطراری", close: "بستن", back: "بازگشت", home: "خانه", guides: "راهنما", work: "کار", saves: "رایگان", more: "بیشتر", search: "جستجو…", forYou: "برای شما", quickActions: "اقدامات سریع", helplines: "خطوط کمک", jobsTab: "مشاغل", certsTab: "گواهینامه‌ها", careerTab: "مسیرها", savesTitle: "رایگان و تخفیف", gemsTitle: "نکات طلایی 💎", theme: "پوسته", language: "زبان", apply: "درخواست", settings: "تنظیمات", share: "اشتراک", copied: "کپی شد!", status: { refugee: "پناهنده", skilled: "ماهر", family: "خانواده", eu: "EU", student: "دانشجو", other: "سایر" }, openLink: "باز کردن" },
  ur: { app: "نئی زندگی UK", tag: "برطانیہ کے لیے مفت گائیڈ", sos: "ایمرجنسی", close: "بند", back: "واپس", home: "ہوم", guides: "گائیڈز", work: "کام", saves: "مفت", more: "مزید", search: "تلاش…", forYou: "آپ کے لیے", quickActions: "فوری اقدامات", helplines: "ہیلپ لائنز", jobsTab: "نوکریاں", certsTab: "سرٹیفکیٹس", careerTab: "کیریئر", savesTitle: "مفت چیزیں", gemsTitle: "چھپے خزانے 💎", theme: "تھیم", language: "زبان", apply: "درخواست", settings: "ترتیبات", share: "شیئر", copied: "کاپی ہو گیا!", status: { refugee: "پناہ گزین", skilled: "ماہر", family: "خاندان", eu: "EU", student: "طالب علم", other: "دیگر" }, openLink: "لنک کھولیں" },
  am: { app: "አዲስ ህይወት UK", tag: "ለዩኬ ነፃ መምሪያ", sos: "አደጋ", close: "ዝጋ", back: "ተመለስ", home: "መነሻ", guides: "መመሪያ", work: "ሥራ", saves: "ነፃ", more: "ተጨማሪ", search: "ፈልግ…", forYou: "ለእርስዎ", quickActions: "ፈጣን", helplines: "መስመሮች", jobsTab: "ሥራ", certsTab: "ምስክርነት", careerTab: "ሙያ", savesTitle: "ነፃ ነገሮች", gemsTitle: "ምስጢሮች 💎", theme: "ገጽታ", language: "ቋንቋ", apply: "ያመልክቱ", settings: "ቅንብሮች", share: "ያጋሩ", copied: "ተቀድቷል!", status: { refugee: "ስደተኛ", skilled: "ሠራተኛ", family: "ቤተሰብ", eu: "EU", student: "ተማሪ", other: "ሌላ" }, openLink: "ክፈት" },
  ti: { app: "ሓድሽ ህይወት UK", tag: "ንዩኬ ነጻ መምርሒ", sos: "ህጹጽ", close: "ዕጸው", back: "ተመለስ", home: "መበገሲ", guides: "መምርሒ", work: "ስራሕ", saves: "ነጻ", more: "ተወሳኺ", search: "ድለ…", forYou: "ንዓኻ", quickActions: "ቅልጡፍ", helplines: "መስመራት", jobsTab: "ስራሕ", certsTab: "ምስክር", careerTab: "ሞያ", savesTitle: "ነጻ ነገራት", gemsTitle: "ፍሉይ 💎", theme: "ገጽታ", language: "ቋንቋ", apply: "ኣመልክት", settings: "ቅጥዒታት", share: "ኣካፍል", status: { refugee: "ስደተኛ", skilled: "ሰራሕተኛ", family: "ስድራ", eu: "EU", student: "ተምሃሪ", other: "ካልእ" }, openLink: "ክፈት" },
  so: { app: "Nolosha Cusub UK", tag: "Hagaha UK oo bilaash ah", sos: "Degdeg", close: "Xir", back: "Dib u noqo", home: "Hoyga", guides: "Hagaha", work: "Shaqo", saves: "Bilaash", more: "Dheeraad", search: "Raadi…", forYou: "Adiga", quickActions: "Degdeg", helplines: "Caawinta", jobsTab: "Shaqo", certsTab: "Shahaado", careerTab: "Xirfad", savesTitle: "Bilaash", gemsTitle: "Qarsoon 💎", theme: "Muuqaal", language: "Luuqad", apply: "Codso", settings: "Dejinta", share: "La wadaag", status: { refugee: "Qaxooti", skilled: "Xirfad", family: "Qoys", eu: "EU", student: "Arday", other: "Kale" }, openLink: "Fur" },
  om: { app: "Jireenya Haaraa UK", tag: "Qajeelfama UK bilisaa", sos: "Hatattama", close: "Cufi", back: "Duuba", home: "Mana", guides: "Qajeelfama", work: "Hojii", saves: "Bilisaan", more: "Dabalata", search: "Barbaadi…", forYou: "Siif", quickActions: "Ariifataa", helplines: "Gargaarsa", jobsTab: "Hojii", certsTab: "Waraqaa", careerTab: "Ogummaa", savesTitle: "Bilisaa", gemsTitle: "Dhoksaa 💎", theme: "Bifa", language: "Afaan", apply: "Iyyaadhu", settings: "Qindaa'ina", share: "Qoodi", status: { refugee: "Baqataa", skilled: "Hojjataa", family: "Maatii", eu: "EU", student: "Barattuu", other: "Biraa" }, openLink: "Bani" },
  uk: { app: "Нове Життя UK", tag: "Безкоштовний гід для UK", sos: "SOS", close: "Закрити", back: "Назад", home: "Головна", guides: "Посібники", work: "Робота", saves: "Безкоштовно", more: "Ще", search: "Пошук…", forYou: "Для вас", quickActions: "Швидкі дії", helplines: "Лінії допомоги", jobsTab: "Робота", certsTab: "Сертифікати", careerTab: "Кар'єра", savesTitle: "Безкоштовне", gemsTitle: "Поради 💎", theme: "Тема", language: "Мова", apply: "Подати", settings: "Налаштування", share: "Поділитися", copied: "Скопійовано!", status: { refugee: "Біженець", skilled: "Кваліфікований", family: "Сімейна", eu: "EU", student: "Студент", other: "Інше" }, openLink: "Відкрити" },
  ro: { app: "Viață Nouă UK", tag: "Ghid gratuit pentru UK", sos: "SOS", close: "Închide", back: "Înapoi", home: "Acasă", guides: "Ghiduri", work: "Muncă", saves: "Gratuit", more: "Mai mult", search: "Caută…", forYou: "Pentru tine", quickActions: "Acțiuni rapide", helplines: "Linii ajutor", jobsTab: "Slujbe", certsTab: "Certificate", careerTab: "Carieră", savesTitle: "Gratuit", gemsTitle: "Sfaturi 💎", theme: "Temă", language: "Limba", apply: "Aplică", settings: "Setări", share: "Distribuie", status: { refugee: "Refugiat", skilled: "Calificat", family: "Familie", eu: "EU", student: "Student", other: "Alt" }, openLink: "Deschide" },
  pl: { app: "Nowe Życie UK", tag: "Bezpłatny przewodnik UK", sos: "SOS", close: "Zamknij", back: "Wstecz", home: "Start", guides: "Poradniki", work: "Praca", saves: "Za darmo", more: "Więcej", search: "Szukaj…", forYou: "Dla ciebie", quickActions: "Szybkie akcje", helplines: "Pomoc", jobsTab: "Praca", certsTab: "Certyfikaty", careerTab: "Kariera", savesTitle: "Za darmo", gemsTitle: "Wskazówki 💎", theme: "Motyw", language: "Język", apply: "Aplikuj", settings: "Ustawienia", share: "Udostępnij", copied: "Skopiowano!", status: { refugee: "Uchodźca", skilled: "Pracownik", family: "Rodzinna", eu: "EU", student: "Student", other: "Inne" }, openLink: "Otwórz" },
  fr: { app: "Nouvelle Vie UK", tag: "Guide gratuit pour le UK", sos: "SOS", close: "Fermer", back: "Retour", home: "Accueil", guides: "Guides", work: "Travail", saves: "Gratuit", more: "Plus", search: "Chercher…", noResults: "Aucun résultat.", forYou: "Pour vous", quickActions: "Actions rapides", helplines: "Numéros utiles", jobsTab: "Emplois", certsTab: "Certificats", careerTab: "Carrière", savesTitle: "Gratuit et réductions", gemsTitle: "Astuces 💎", theme: "Thème", language: "Langue", apply: "Postuler", settings: "Paramètres", share: "Partager", copied: "Copié!", status: { refugee: "Réfugié", skilled: "Qualifié", family: "Familial", eu: "EU", student: "Étudiant", other: "Autre" }, openLink: "Ouvrir" },
};

// Build merged UI object
export const UI = {};
LANGS.forEach(({ code }) => {
  const ov = UI_OVERRIDES[code] || {};
  UI[code] = { ...BASE_UI, ...ov, status: { ...BASE_UI.status, ...(ov.status || {}) } };
});

// ─── Status Types ─────────────────────────────────────────────────
export const STATUSES = [
  { id: "refugee", emoji: "🕊" },
  { id: "skilled", emoji: "💼" },
  { id: "family", emoji: "👨‍👩‍👧" },
  { id: "eu", emoji: "🌍" },
  { id: "student", emoji: "🎓" },
  { id: "other", emoji: "❓" },
];

export const CATEGORIES = {
  "Digital Status": { emoji: "📱", color: "#0D9488" },
  "Money": { emoji: "💷", color: "#16A34A" },
  "Healthcare": { emoji: "🏥", color: "#0891B2" },
  "Housing": { emoji: "🏠", color: "#D97706" },
  "Work": { emoji: "💼", color: "#2563EB" },
  "Family & Kids": { emoji: "👨‍👩‍👧", color: "#E11D48" },
  "Documents & ID": { emoji: "📄", color: "#7C3AED" },
  "Travel": { emoji: "✈️", color: "#1D4ED8" },
  "Settle & Stay": { emoji: "🏅", color: "#CA8A04" },
  "Community": { emoji: "🤝", color: "#0D9488" },
};

export const RECS = {
  refugee: ["move-on", "evisa", "sharecode", "bank", "uc", "gp", "housing-help", "ni", "work-rights", "schools", "ctd", "citizen-card", "driving", "mental", "safety"],
  skilled: ["evisa", "sharecode", "bank", "ni", "work-rights", "employment-rights", "tax", "gp", "renting", "driving", "ilr"],
  family: ["evisa", "sharecode", "nrpf", "bank", "gp", "renting", "work-rights", "schools", "citizen-card", "driving", "ilr"],
  eu: ["evisa", "sharecode", "bank", "gp", "uc", "renting", "work-rights", "employment-rights", "schools", "driving", "ilr"],
  student: ["evisa", "bank", "ni", "gp", "renting", "work-rights", "tax", "driving", "citizen-card"],
  other: ["evisa", "sharecode", "nrpf", "bank", "gp", "work-rights", "renting", "citizen-card", "driving", "safety"],
};

export const TIPS = {
  refugee: ["Register with a GP — no address or ID needed.", "Request a UC Advance on day one.", "Revolut, Monzo, Starling: open with share code + selfie.", "Download the NHS App for GP bookings.", "Move-on period is now 56 days.", "Apply for a CitizenCard (£15) — photo ID accepted everywhere.", "National Databank: free SIM with 40GB/month from Vodafone.", "ESOL classes free if you receive UC."],
  skilled: ["Your employer cannot hold your passport.", "60 days to find new sponsorship if you lose your job.", "Revolut, Monzo, Starling: open with share code.", "Download the NHS App.", "You can switch visa without leaving UK.", "16-25 Railcard: 1/3 off all train fares for £30/year.", "Save every payslip and P60 for ILR.", "Check eVisa expiry — extend 3 months early."],
  family: ["Check eVisa conditions — NRPF affects benefits.", "Domestic abuse victims can switch visa.", "Revolut, Monzo, Starling: share code + selfie.", "Download the NHS App.", "CitizenCard £15 for photo ID.", "Free prescriptions if on UC.", "Most family visas allow work — check eVisa.", "Citizens Advice: free immigration advice."],
  eu: ["EU Settled Status is digital — use share code.", "Pre-Settled expires — upgrade before deadline.", "EU Settled OUT of scope of 2025 white paper.", "Revolut, Monzo, Starling: share code + selfie.", "Download the NHS App.", "Your EU driving licence is valid in UK.", "the3million charity for Settled Status support.", "16-25 or 26-30 Railcard saves 1/3 on trains."],
  student: ["Graduate visa: 2 years (3 PhD) to work any job.", "Max 20hrs/week term time.", "Download the NHS App — free for students.", "Revolut or Monzo for student banking.", "TOTUM student card: discounts everywhere.", "Switch Student to Skilled Worker without leaving.", "CitizenCard £15 for cheap photo ID.", "Save financial records for future visa apps."],
  other: ["Check eVisa conditions — they define your rights.", "Migrant Help: 0808 801 0503 — free, 24/7.", "Revolut, Monzo, Starling: share code + selfie.", "Modern Slavery: 0800 0121 700 — 24/7.", "CitizenCard £15 for photo ID.", "National Databank: free SIM card.", "Never pay unregistered 'immigration consultants'.", "Citizens Advice: free help with everything."],
};

// ─── GUIDES (i18n-ready: content.en, with verified links) ────────
export const GUIDES = [
  { id: "evisa", cat: "Digital Status", icon: "📱", content: { en: { title: "Your eVisa & UKVI Account", summary: "BRPs expired Dec 2024. Your immigration status is now 100% digital.", steps: ["All BRPs expired 31 December 2024. Your status hasn't changed — only how you prove it.", "You can still use an expired BRP to access the online share code service for up to 18 months after its expiry date (until June 2026 for most people).", "Since June 2025, expired BRPs are NOT accepted for travel by airlines.", "Check your email for noreply@notifications.service.gov.uk — your UKVI account may already exist.", "No account? Visit gov.uk/evisa — free, takes 10 minutes.", "Link your passport to your UKVI account BEFORE travelling.", "From 25 Feb 2026, all new visa applicants receive eVisas only — no more vignette stickers.", "Screenshot your eVisa status page and save offline — essential without internet.", "⚠ ~300,000 UK residents still haven't set up their eVisa. Do it now."] } }, cost: "Free", time: "10 min", bring: ["Email address", "Passport or BRP number"], links: [{ name: "Set up eVisa (GOV.UK)", url: "https://www.gov.uk/evisa" }, { name: "Update UKVI details", url: "https://www.gov.uk/evisa/update-your-ukvi-account-details" }, { name: "eVisa help videos", url: "https://www.gov.uk/government/publications/updates-on-the-move-to-evisas/updates-on-the-move-to-evisas" }] },
  { id: "sharecode", cat: "Digital Status", icon: "🔗", content: { en: { title: "Share Codes", summary: "Prove your right to work, rent, or access services.", steps: ["Log in to UKVI → 'Prove your status'. Choose: Right to Work, Right to Rent, or General.", "Right to Work codes start with 'W'. Right to Rent codes start with 'R'. Don't mix them up.", "Codes valid 90 days. Generate a new one each time you need it.", "Give the code + your date of birth to your employer or landlord. They verify online.", "EU Settled Status: share code is your ONLY proof. No physical card exists.", "⚠ Never pay anyone for a share code. The GOV.UK service is always free."] } }, cost: "Free", time: "2 min", bring: ["UKVI account login"], links: [{ name: "Prove right to work (GOV.UK)", url: "https://www.gov.uk/prove-right-to-work" }, { name: "Prove right to rent (GOV.UK)", url: "https://www.gov.uk/prove-right-to-rent" }, { name: "Check someone's status (GOV.UK)", url: "https://www.gov.uk/view-right-to-work" }] },
  { id: "nrpf", cat: "Digital Status", icon: "⚠️", content: { en: { title: "No Recourse to Public Funds (NRPF)", summary: "NRPF restricts most benefits. Know what you CAN still access.", steps: ["NRPF means you cannot claim: Universal Credit, Housing Benefit, Child Tax Credit.", "You CAN still access: full NHS care, state schools, Statutory Sick Pay, child protection.", "Destitute with children? Your council MUST help under Section 17, Children Act 1989.", "Changed circumstances (illness, domestic abuse)? Apply to have NRPF removed.", "NRPF Network provides free specialist advice."] } }, cost: "Free", time: "Read now", bring: [], links: [{ name: "NRPF Network", url: "https://www.nrpfnetwork.org.uk" }, { name: "Find immigration adviser (GOV.UK)", url: "https://www.gov.uk/find-an-immigration-adviser" }] },
  { id: "bank", cat: "Money", icon: "🏦", content: { en: { title: "Opening a Bank Account", summary: "Most digital banks accept share code + face scan. No credit history, no fixed address needed.", steps: ["Revolut, Monzo, and Starling all accept share code + selfie/face scan. Approved in hours — often same day.", "Monese also accepts an ARC card or passport without a fixed address — good option if your share code isn't ready yet.", "Revolut accepts just a passport photo if you have no share code yet.", "If digital banks decline: go to Barclays, NatWest, Lloyds, or HSBC in person and ask specifically for a 'basic bank account'.", "You do NOT need a fixed address. A hostel address, friend's address, or charity office address is fine.", "Credit unions accept members without UK credit history — useful for borrowing small amounts later.", "⚠ Never pay anyone to open a bank account. It is always free. Any fee request is a scam."] } }, cost: "Free", time: "Same day", bring: ["Share code or passport", "Smartphone"], links: [{ name: "Revolut", url: "https://www.revolut.com" }, { name: "Monzo", url: "https://monzo.com" }, { name: "Starling", url: "https://www.starlingbank.com" }, { name: "Monese", url: "https://monese.com" }, { name: "Basic bank account (GOV.UK)", url: "https://www.gov.uk/apply-basic-bank-account" }] },
  { id: "uc", cat: "Money", icon: "💷", content: { en: { title: "Universal Credit", summary: "Main working-age benefit. Request an Advance on day one.", steps: ["Apply online or call 0800 328 5644 (free).", "Request UC Advance on day one — interest-free loan for the 5-week wait.", "Report full housing costs so Housing Element is included.", "Claim Child Benefit separately — after 7 Apr 2025, backdated to refugee grant date (max 3 months).", "Update your UC journal every assessment period — missed updates pause payments.", "NRPF on your eVisa? You cannot claim UC. See the NRPF guide."] } }, cost: "Free", time: "5 weeks — Advance covers wait", bring: ["Share code", "Bank details", "Rent info"], links: [{ name: "Apply for UC (GOV.UK)", url: "https://www.gov.uk/universal-credit/how-to-claim" }, { name: "Child Benefit (GOV.UK)", url: "https://www.gov.uk/child-benefit" }] },
  { id: "ni", cat: "Money", icon: "🔢", content: { en: { title: "National Insurance Number", summary: "Needed for work and tax. Start working before it arrives.", steps: ["Apply online — free, takes 20 minutes.", "You CAN work and claim benefits while waiting — tell employer it's pending.", "Format: AB 12 34 56 C. Yours for life.", "Never share your NI number on social media."] } }, cost: "Free", time: "4–16 weeks", bring: ["Passport"], links: [{ name: "Apply for NI number (GOV.UK)", url: "https://www.gov.uk/apply-national-insurance-number" }] },
  { id: "tax", cat: "Money", icon: "📋", content: { en: { title: "Tax & Payslips", summary: "How UK tax works. What to save for visa applications.", steps: ["Tax is deducted automatically via PAYE. Check your payslip monthly.", "Personal Allowance: £12,570/year tax-free. Basic rate 20% up to £50,270.", "Save every P60 and P45 — critical for future visa applications.", "Self-employed? Register with HMRC within 3 months of starting.", "⚠ Not all visas allow self-employment — check your eVisa conditions first."] } }, cost: "Free", time: "Ongoing", bring: ["NI number"], links: [{ name: "Income tax guide (GOV.UK)", url: "https://www.gov.uk/income-tax" }, { name: "Register as self-employed (GOV.UK)", url: "https://www.gov.uk/set-up-self-employed" }] },
  { id: "gp", cat: "Healthcare", icon: "🏥", content: { en: { title: "NHS & GP Registration", summary: "Free NHS care for everyone — regardless of immigration status or address.", steps: ["Find your nearest GP on the NHS website.", "GPs legally CANNOT refuse you — no address, no ID, any immigration status.", "Download the NHS App (free) — book appointments, repeat prescriptions, NHS number, health records.", "NHS 111 for urgent medical advice (free, 24/7). 999 for emergencies.", "Free dental if you're on UC — tell the dentist before any treatment."] } }, cost: "Free", time: "Same day", bring: ["Passport (helpful, not required)"], links: [{ name: "Find a GP (NHS)", url: "https://www.nhs.uk/service-search/find-a-gp" }, { name: "NHS App", url: "https://www.nhs.uk/nhs-app/" }, { name: "Find a dentist (NHS)", url: "https://www.nhs.uk/service-search/find-a-dentist" }] },
  { id: "mental", cat: "Healthcare", icon: "🧠", content: { en: { title: "Mental Health Support", summary: "Free mental health care. Seeking help is strength.", steps: ["Self-refer to NHS Talking Therapies — free CBT, no GP referral needed.", "Freedom from Torture: free therapy for survivors — 020 7697 7777.", "Crisis: Samaritans 116 123 (free 24/7) or text SHOUT to 85258.", "Domestic Abuse: 0808 2000 247 (free, 24/7, all languages)."] } }, cost: "Free", time: "Self-refer or via GP", bring: [], links: [{ name: "NHS Talking Therapies", url: "https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/" }, { name: "Freedom from Torture", url: "https://www.freedomfromtorture.org" }] },
  { id: "renting", cat: "Housing", icon: "🔑", content: { en: { title: "Renting a Home", summary: "Your rights as a renter. Landlords must accept share codes.", steps: ["Give landlords a Right to Rent share code + your date of birth. They verify online.", "Landlords CANNOT discriminate by nationality — it's unlawful.", "Search: SpareRoom, Rightmove, Zoopla. Filter by distance and budget.", "Maximum deposit is 5 weeks' rent. Must be in a government protection scheme.", "Always get a written tenancy agreement before paying anything.", "⚠ Landlords cannot evict without a court order. Changing locks illegally is a criminal offence."] } }, cost: "Deposit + 1st month", time: "Start searching now", bring: ["Right-to-rent share code"], links: [{ name: "SpareRoom", url: "https://www.spareroom.co.uk" }, { name: "Rightmove", url: "https://www.rightmove.co.uk" }, { name: "Deposit protection (GOV.UK)", url: "https://www.gov.uk/tenancy-deposit-protection" }] },
  { id: "housing-help", cat: "Housing", icon: "🏠", content: { en: { title: "Council Housing & Homelessness Help", summary: "If homeless or at risk, your local council has a legal duty to help. Refugees have powerful legal protections.", steps: ["Contact your local council housing department immediately. You are a priority need as a newly recognised refugee.", "You have a PERMANENT local connection to the council area where your refugee decision was made — this right can NEVER be lost and is critical for your housing application. Moving away from your dispersal area may affect this.", "Apply for the social housing waiting list as early as possible — long waits in most cities, but being on the list is essential.", "Claim UC Housing Element immediately — this helps cover rent in private accommodation while you wait.", "Refugees at Home: free matching service connecting refugees with UK hosts who have a spare room. Especially useful during the move-on period (refugeesathome.org).", "NACCOM: national network of refugee accommodation charities — lists 90+ organisations across the UK (naccom.org.uk).", "Shelter helpline: 0808 800 4444 (free, Mon–Fri 8am–8pm) — specialist housing advice.", "Crisis charity: homelessness services across England, Scotland, and Wales (crisis.org.uk).", "⚠ Your council MUST give you emergency accommodation if you are homeless — do not accept 'we can't help' as an answer."] } }, cost: "Free", time: "Apply immediately", bring: ["Refugee decision letter", "Share code"], links: [{ name: "Find your council (GOV.UK)", url: "https://www.gov.uk/find-local-council" }, { name: "Shelter", url: "https://www.shelter.org.uk" }, { name: "Refugees at Home", url: "https://www.refugeesathome.org" }, { name: "NACCOM", url: "https://naccom.org.uk" }, { name: "Crisis", url: "https://www.crisis.org.uk" }] },
  { id: "move-on", cat: "Housing", icon: "📦", content: { en: { title: "The 56-Day Move-On Period", summary: "Just got refugee status? You have 56 days to leave asylum accommodation and set up your new life.", steps: ["When you receive your refugee decision letter, the 56-day countdown begins immediately. Do not wait — start today.", "IMMEDIATELY apply for Universal Credit online. The 5-week wait starts from your application date — every day of delay costs money. Citizens Advice has a national contract to help newly-recognised refugees apply, with translation available (0800 144 8848).", "Open a bank account the same day — Revolut, Monzo, Starling, or Monese all accept share code + selfie with no fixed address required.", "Apply for your National Insurance number online. You can work while waiting for it to arrive (takes 4–16 weeks).", "Contact your local council housing team immediately. Explain you are a newly recognised refugee. You have a PERMANENT local connection to this council area — this is an irrevocable legal right and key to your housing application.", "If you had your passport surrendered to the Home Office at Croydon or any UKVI office, apply for a Convention Travel Document (CTD) — £75. This is your travel document for any international travel.", "Register with a GP. Download the NHS App. No address, ID, or immigration status check is required.", "Apply for a CitizenCard (£15) for photo ID while you wait for your CTD. Apply at citizencard.com — arrives in 2–3 weeks.", "Get a free SIM card from the National Databank — 40GB/month from Vodafone, free at any library, O2 store, or partner charity.", "Ask your Jobcentre Work Coach about the Flexible Support Fund — up to £300 for deposits, transport, and work clothes.", "Your ASPEN payment card remains usable for 28 days AFTER your asylum support formally ends — keep using it during this grace period.", "If you cannot find housing by day 56, show 'reasonable efforts' to NASS — UC application, council contact, housing search evidence. Support can be extended.", "Free furniture: British Heart Foundation shops, Freecycle.org, Facebook Marketplace 'Free' section, local refugee charities, Emmaus communities.", "After 6 months on UC: apply for a Budgeting Advance (up to £812 for furniture and household items) via your UC journal.", "⚠ Do NOT wait. Start everything on day 1. Every day of delay on Universal Credit is money lost."] } }, cost: "Free", time: "Start immediately — day 1", bring: ["Refugee decision letter", "eVisa / share code details"], links: [{ name: "Apply for UC (GOV.UK)", url: "https://www.gov.uk/universal-credit/how-to-claim" }, { name: "Citizens Advice", url: "https://www.citizensadvice.org.uk" }, { name: "Shelter — move-on help", url: "https://www.shelter.org.uk" }, { name: "Refugees at Home (spare rooms)", url: "https://www.refugeesathome.org" }, { name: "NACCOM refugee housing network", url: "https://naccom.org.uk" }, { name: "Freecycle (free furniture)", url: "https://www.freecycle.org" }] },
  { id: "work-rights", cat: "Work", icon: "💼", content: { en: { title: "Your Right to Work", summary: "Know your specific work rights and restrictions before starting any job.", steps: ["Refugees & ILR holders: NO restrictions. Any job, any hours.", "Skilled Worker visa: must work for the named sponsor employer only.", "Family visa: usually full work rights — verify on your eVisa.", "Student visa: max 20hrs/week during term. Full-time only in vacations.", "EU Settled Status: full unrestricted work rights.", "Give employers a Right to Work share code before your start date."] } }, cost: "Free", time: "Check before any job", bring: ["Right-to-work share code"], links: [{ name: "Prove right to work (GOV.UK)", url: "https://www.gov.uk/prove-right-to-work" }, { name: "Skilled Worker visa rules (GOV.UK)", url: "https://www.gov.uk/skilled-worker-visa" }] },
  { id: "employment-rights", cat: "Work", icon: "⚖️", content: { en: { title: "Employment Rights", summary: "Every worker has legal rights from day one regardless of nationality.", steps: ["National Living Wage (21+): £12.71/hr from April 2026 (was £12.21). Illegal to pay less.", "Day one rights: 28 days paid leave, written contract, rest breaks.", "Statutory Sick Pay: £116.75/week after 4 consecutive sick days.", "After 2 years: unfair dismissal protection.", "Discrimination by race, religion, or nationality is illegal. ACAS: 0300 123 1100.", "New: Fair Work Agency launches April 2026 — stronger enforcement of wage and holiday rights."] } }, cost: "Free", time: "Know before you start", bring: [], links: [{ name: "Minimum wage rates (GOV.UK)", url: "https://www.gov.uk/national-minimum-wage-rates" }, { name: "ACAS (free workplace advice)", url: "https://www.acas.org.uk" }, { name: "Citizens Advice work rights", url: "https://www.citizensadvice.org.uk/work/" }] },
  { id: "schools", cat: "Family & Kids", icon: "🏫", content: { en: { title: "Children & Schools", summary: "All children aged 5–16 have the right to a free school place.", steps: ["Contact your local council school admissions team immediately.", "Schools CANNOT refuse children who don't speak English.", "Free EAL (English as Additional Language) support in all state schools.", "Free school meals if parents receive UC.", "Free childcare: 15–30 hours/week for ages 3–4."] } }, cost: "Free", time: "Within 20 school days", bring: ["Immunisation records (if available)"], links: [{ name: "Find your council (GOV.UK)", url: "https://www.gov.uk/find-local-council" }, { name: "Free school meals (GOV.UK)", url: "https://www.gov.uk/apply-free-school-meals" }, { name: "Free childcare (GOV.UK)", url: "https://www.gov.uk/get-childcare" }] },
  { id: "ctd", cat: "Documents & ID", icon: "🛂", content: { en: { title: "Convention Travel Document (CTD)", summary: "For recognised refugees who cannot use their home country passport.", steps: ["If you're a recognised refugee, you can apply for a CTD to travel internationally.", "Apply online. Cost: £75. Processing: usually 1–3 months.", "The CTD allows travel to most countries except your country of origin.", "⚠ NEVER travel to your country of origin — this can result in loss of refugee status.", "From 11 March 2026, Home Office travel documents (CTD, Certificate of Travel) automatically link to your UKVI account — airlines and border staff verify digitally.", "You can also apply for a Certificate of Travel if you have Humanitarian Protection.", "Get passport photos at any Post Office (about £12) or use a phone app."] } }, cost: "£75", time: "1–3 months", bring: ["UKVI account", "Passport-size photos", "Completed form"], links: [{ name: "Apply for travel document (GOV.UK)", url: "https://www.gov.uk/apply-home-office-travel-document" }, { name: "Passport photo rules (GOV.UK)", url: "https://www.gov.uk/photos-for-passports" }] },
  { id: "citizen-card", cat: "Documents & ID", icon: "🪪", content: { en: { title: "CitizenCard — Photo ID for £15", summary: "Government-backed PASS-accredited photo ID. No passport needed.", steps: ["A CitizenCard is a UK government-backed PASS-accredited photo ID card.", "Accepted as proof of age and identity in shops, banks, pubs, Post Offices, most organisations.", "Apply online. Cost: £15. Arrives in 2–3 weeks.", "You need: a passport-size photo, proof of address, and any document showing your date of birth.", "No passport? A Home Office decision letter + proof of address is enough.", "This is NOT an immigration document — use your share code for work/rent.", "Most affordable photo ID for anyone without a passport."] } }, cost: "£15", time: "2–3 weeks", bring: ["Photo", "Proof of address", "Any age proof"], links: [{ name: "Apply for CitizenCard", url: "https://www.citizencard.com" }, { name: "PASS scheme info", url: "https://www.pass-scheme.org.uk" }] },
  { id: "driving", cat: "Documents & ID", icon: "🚗", content: { en: { title: "Getting a UK Driving Licence", summary: "Using foreign licences, exchanging, or starting from scratch.", steps: ["You can drive on a valid foreign licence for 12 months from when you became UK resident.", "After 12 months you MUST get a UK licence or stop driving.", "Some countries have exchange agreements — swap licence directly without a test. Check GOV.UK.", "Ethiopia is NOT a designated exchange country — you must take theory + practical tests.", "Apply for UK provisional licence: £34 online, £43 by post. Need passport/share code + proof of address.", "With a provisional: must drive with a supervising driver (full UK licence 3+ years), display L plates.", "Theory test: £23. Book online. Multiple choice + hazard perception video.", "Practical test: £62 weekday, £75 weekend. Book online.", "Driving lessons: £25–£40/hour average. Some councils fund lessons for refugees on UC.", "Car insurance is required by law. Compare at MoneySuperMarket, GoCompare, CompareTheMarket.", "International Driving Permits are NOT valid for UK residents — only for visitors.", "No documentation at all? You can still apply for a UK provisional from scratch."] } }, cost: "£34–£43 provisional", time: "Varies", bring: ["Foreign licence (if any)", "Passport or share code", "Proof of address"], links: [{ name: "Apply for provisional (GOV.UK)", url: "https://www.gov.uk/apply-first-provisional-driving-licence" }, { name: "Exchange foreign licence (GOV.UK)", url: "https://www.gov.uk/exchange-foreign-driving-licence" }, { name: "Designated countries list (GOV.UK)", url: "https://www.gov.uk/driving-nongb-licence" }, { name: "Book theory test (GOV.UK)", url: "https://www.gov.uk/book-theory-test" }, { name: "Book practical test (GOV.UK)", url: "https://www.gov.uk/book-driving-test" }] },
  { id: "proof-address", cat: "Documents & ID", icon: "📮", content: { en: { title: "Proof of Address", summary: "Get accepted proof even without a fixed home.", steps: ["Accepted documents: UC letter, HMRC letter, utility bill, bank statement (within 3 months).", "No fixed address? A letter from your hostel or support organisation works.", "Register to vote — the confirmation letter counts as proof of address.", "Royal Mail PO Box from £12 for 6 months gives you a stable mailing address."] } }, cost: "Free–£12", time: "1–5 days", bring: [], links: [{ name: "Register to vote (GOV.UK)", url: "https://www.gov.uk/register-to-vote" }, { name: "Royal Mail PO Box", url: "https://www.royalmail.com/receiving/po-box" }] },
  { id: "travel", cat: "Travel", icon: "✈️", content: { en: { title: "Travelling Abroad", summary: "How to travel now that BRPs are gone.", steps: ["Travel with your passport linked to your eVisa in UKVI. Link it BEFORE you travel.", "Since June 2025, expired BRPs are NOT accepted for travel.", "Refugees without a passport: apply for a Convention Travel Document (see CTD guide).", "⚠ Refugees: NEVER travel to your country of origin. Risk losing your status.", "From 11 March 2026, Home Office travel documents auto-link to your UKVI account — no need to carry a separate letter.", "EU citizens: your EU passport is still valid for EU travel."] } }, cost: "CTD £75 if needed", time: "Apply 3+ months ahead", bring: ["Passport linked to UKVI"], links: [{ name: "Travel with eVisa (GOV.UK)", url: "https://www.gov.uk/evisa/travel-with-evisa" }, { name: "Apply for travel document (GOV.UK)", url: "https://www.gov.uk/apply-home-office-travel-document" }] },
  { id: "ilr", cat: "Settle & Stay", icon: "🏅", content: { en: { title: "Indefinite Leave to Remain (ILR)", summary: "Permanent UK residence — the biggest milestone. Refugees use form SET(P) which is completely FREE.", steps: ["Refugees: apply using form SET(P) after 5 years of lawful residence. This form has NO FEE — saving you £2,885 compared to other routes.", "Standard routes (Skilled Worker, Family, etc.) pay £2,885. As a refugee, you are exempt from this fee.", "⚠ 2025 white paper proposals may change settlement timelines. Check GOV.UK regularly.", "Pass the Life in the UK Test (£50) — 24 questions on UK history, culture, laws. Most people pass with 2–3 weeks of free online practice.", "Prove English at level B1 — ESOL qualification, degree from a UK university, or a Secure English Language Test (SELT).", "Keep ALL documents for 5+ years: payslips, P60s, bank statements, tenancy agreements, travel records.", "After ILR, apply for British citizenship after just 1 year — requires English language, Life in the UK Test, and good character.", "Citizenship by naturalisation costs £1,500 but opens a UK passport, visa-free travel, and full civic rights.", "⚠ Avoid any absence from the UK exceeding 180 days in a year — this can break continuity and delay your ILR."] } }, cost: "FREE via SET(P) for refugees / £2,885 other routes", time: "After 5 years of residence", bring: ["5 years of documents (payslips, bank statements, tenancy)", "Passport or travel document"], links: [{ name: "ILR information (GOV.UK)", url: "https://www.gov.uk/indefinite-leave-to-remain" }, { name: "SET(P) form for refugees (GOV.UK)", url: "https://www.gov.uk/settle-in-the-uk/y/you-have-refugee-status-or-humanitarian-protection" }, { name: "Life in the UK Test", url: "https://www.gov.uk/life-in-the-uk-test" }, { name: "Apply for British citizenship (GOV.UK)", url: "https://www.gov.uk/becoming-a-british-citizen" }] },
  { id: "safety", cat: "Community", icon: "🛡", content: { en: { title: "Staying Safe", summary: "Know your rights, avoid scams, get help. The UK system has real protections for you.", steps: ["Police and immigration are SEPARATE. The police have an official firewall policy — they do NOT share information with the Home Office or immigration enforcement. You can report crimes, seek help, and be a witness without fear of immigration action.", "Police: 999 for emergencies, 101 for non-emergencies. Always call — your safety is protected by UK law regardless of your immigration status.", "Modern Slavery Helpline: 0800 0121 700 — free, 24/7, anonymous. If someone is controlling your movements, work, or money, this is illegal and they can help.", "If someone holds your passport, charges you for housing/work, or controls your bank account — this is modern slavery. Call 0800 0121 700.", "Domestic Abuse: 0808 2000 247 — free, 24/7, all languages. Safehouses are available — you will not be deported for leaving an abusive situation.", "Immigration scams: NEVER pay unregistered 'immigration consultants'. Always check the OISC register at gov.uk/find-an-immigration-adviser. Unregistered advice is a criminal offence.", "Online scams: job offers requiring payment upfront, 'fast track' visa services, requests for your share code — all scams. Report to Action Fraud: 0300 123 2040.", "Housing scams: landlords cannot demand more than 5 weeks' deposit. Never pay before viewing a property in person.", "⚠ Keep copies of all your important documents — decision letter, eVisa screenshot, NI number — in a secure app like Google Drive."] } }, cost: "Free", time: "Read now", bring: [], links: [{ name: "Find immigration adviser (GOV.UK)", url: "https://www.gov.uk/find-an-immigration-adviser" }, { name: "Modern Slavery Helpline", url: "https://www.modernslaveryhelpline.org" }, { name: "Action Fraud (report scams)", url: "https://www.actionfraud.police.uk" }] },
  { id: "community", cat: "Community", icon: "🤝", content: { en: { title: "Community & Social Life", summary: "Build connections and find support near you.", steps: ["Libraries: free internet, books, events, language cafés, computer access.", "Mosques, churches, temples, gurdwaras: community support regardless of your faith.", "Volunteering builds UK experience and references. Try do-it.org.", "Refugee Council: 0808 196 7272.", "Citizens Advice: free help with any issue you're facing."] } }, cost: "Free", time: "Start today", bring: [], links: [{ name: "Do-it volunteering", url: "https://www.do-it.org" }, { name: "Citizens Advice", url: "https://www.citizensadvice.org.uk" }, { name: "Refugee Council", url: "https://www.refugeecouncil.org.uk" }] },
  { id: "re-qualify", cat: "Work", icon: "🎓", content: { en: { title: "Recognise Your Qualifications", summary: "Your overseas degree and professional credentials can be recognised in the UK — often for free.", steps: ["UK ENIC (formerly UK NARIC): get a Statement of Comparability for your overseas degree — £49. Accepted by employers, universities, and professional bodies across the UK.", "Refugees without original documents: email refugee@ecctis.com — reduced-cost or waived assessment available. Your institution may also provide a replacement certificate.", "Breaking Barriers Reaccreditation Programme: free professional assessment, mentoring, and liaison with UK regulatory bodies. Covers engineering, healthcare, teaching, law, finance, and trades. Apply at breaking-barriers.co.uk.", "RefuAid interest-free loans: up to £10,000 to cover exam fees, registration costs, course materials for re-qualifying. Zero interest, repayable once you're earning. Access via RefuAid's partner network at refuaid.org.", "Civil Engineers (BSc/BEng/MEng): ICE Refugee Support programme — free mentoring and chartership (MICE → CEng) pathway. The Engineering Council registers all UK engineers. Target CEng status within 3–5 years for £50K–£80K+ salaries.", "For an MBA: APM (Association for Project Management) and CMI (Chartered Management Institute) recognise business qualifications. A Chartered Manager Degree Apprenticeship is a free route to CMI Level 6.", "Doctors: GMC registration + PLAB Part 1 & 2 exams. Many NHS trusts fund OSCE exams for overseas doctors. Breaking Barriers healthcare track provides mentors.", "Nurses: NMC registration + OSCE (Objective Structured Clinical Examination) for overseas-trained nurses. NHS trusts commonly fund this.", "Teachers: qualified teacher status via School Direct or Assessment Only route. UK ENIC recognition helps. Contact the DfE and Refugee Education UK.", "Lawyers: Solicitors Qualification Examination (SQE) is the new route. Some law firms and charities (e.g. Refugee Legal Aid) run bursary programmes.", "⚠ Never pay unregistered agencies to 'certify' your qualifications. Use only UK ENIC, your UK professional body, or GOV.UK."] } }, cost: "£49 UK ENIC + professional body fees (often funded)", time: "Weeks to years depending on profession", bring: ["Degree certificate (original or copy)", "Academic transcripts", "Professional registration certificates"], links: [{ name: "UK ENIC Statement of Comparability", url: "https://www.enic.org.uk/Qualifications/SOC/Default.aspx" }, { name: "Breaking Barriers Reaccreditation", url: "https://breaking-barriers.co.uk/refugee-support/reaccreditation/" }, { name: "RefuAid Interest-Free Loans", url: "https://www.refuaid.org" }, { name: "ICE Refugee Support (Engineers)", url: "https://www.ice.org.uk/about-ice/what-we-do/social-mobility/refugee-support/" }, { name: "Engineering Council (UK)", url: "https://www.engc.org.uk" }] },
  { id: "family-reunion", cat: "Family & Kids", icon: "👨‍👩‍👧", content: { en: { title: "Family Reunion", summary: "Bring your immediate family to the UK. Know the current rules.", steps: ["⚠ The refugee family reunion route is currently PAUSED (as of 4 September 2025). New rules are expected Spring 2026. Check gov.uk/refugee-family-reunion regularly.", "During the pause: your spouse/partner and children under 18 must apply through standard family visa routes. These cost £1,538+ per person.", "A refugee family reunion application was previously free — the pause is temporary. Once new rules are published, apply immediately.", "RefuAid interest-free loans can help cover family reunion costs including legal fees and travel expenses. Contact via refuaid.org.", "Legal aid is available for refugee family reunion cases — contact a Legal Aid solicitor via the Law Centres Network (lawcentres.org.uk).", "Family tracing help: the Refugee Council (0808 196 7272) and the British Red Cross (redcross.org.uk) both provide family tracing services.", "Keep evidence of your family relationship: photos, messages, marriage/birth certificates (or sworn statements if documents are unavailable).", "⚠ NEVER travel to your country of origin to collect family members — this risks your refugee status.", "⚠ Family reunion is paused but NOT abolished. Your right will return under new rules — prepare your documents now."] } }, cost: "Free (refugee route) / £1,538+ per person (standard visa route)", time: "3–12+ months once route reopens", bring: ["Proof of family relationship", "Evidence of refugee status"], links: [{ name: "Refugee family reunion (GOV.UK)", url: "https://www.gov.uk/refugee-family-reunion" }, { name: "Refugee Council — family reunion", url: "https://www.refugeecouncil.org.uk/information/refugee-asylum-facts/family-reunion/" }, { name: "Law Centres Network (legal aid)", url: "https://www.lawcentres.org.uk" }, { name: "RefuAid loans", url: "https://www.refuaid.org" }] },
  { id: "women-support", cat: "Community", icon: "♀️", content: { en: { title: "Support for Women & Girls", summary: "Specialist services, career paths, safety, and rights for refugee women and girls in the UK.", steps: ["Women for Refugee Women: free support, legal advice, campaigning, community for women asylum seekers and refugees. Helpline: 020 7250 1239 (womenforrefugeewomen.org.uk).", "Asylum Aid: specialist legal help for women with complex asylum claims. Free, based in London, national reach.", "Refugee Women Connect (Birmingham): employment support, social activities, training specifically for refugee women.", "Survivors of sexual and gender-based violence: Freedom from Torture provides specialist free therapy — referral via GP or self-referral at freedomfromtorture.org.", "Domestic abuse: call 0808 2000 247 (free, 24/7, all languages). Safehouses are available. You WILL NOT be deported or have your case affected for leaving an abusive situation.", "Maternity care is free on the NHS from the moment you arrive — register with a GP or midwife immediately. The Maternity Action helpline advises on rights: 0808 802 0029.", "Child benefit: claim from your refugee grant date (max 3 months back). If you are a lone parent, you automatically have priority need for housing.", "Career paths with strong demand for women from refugee backgrounds: Social Work (excellent progression, good pay from day one), Healthcare (Band 2 HCA: start within weeks), Childcare and Early Years Education, Teaching Assistants, Translation & Interpreting (rare language speakers are paid well).", "Free vocational training targeted at women: ESOL with childcare (many colleges offer this together), Care Certificate (care home funded), Skills Bootcamps (government-funded, open to all genders).", "Safety planning: if you feel unsafe, contact the police on 101 (non-emergency) or 999 (emergency). Police do NOT report to immigration enforcement. Your safety always comes first.", "Girls aged 16–18: dedicated support through the Prince's Trust (free education, employment and life-skills programmes) and Catch22 (mentoring and training for young women).", "⚠ Female Genital Mutilation (FGM): illegal in the UK. Anyone threatened with FGM can call the NSPCC FGM helpline: 0800 028 3550 (free, 24/7). You will be protected, not prosecuted."] } }, cost: "Free", time: "Access services immediately", bring: [], links: [{ name: "Women for Refugee Women", url: "https://www.womenforrefugeewomen.org.uk" }, { name: "Freedom from Torture", url: "https://www.freedomfromtorture.org" }, { name: "Domestic Abuse Helpline", url: "https://www.nationaldahelpline.org.uk" }, { name: "Maternity Action", url: "https://www.maternityaction.org.uk" }, { name: "Prince's Trust (young women 16–30)", url: "https://www.princes-trust.org.uk" }, { name: "FGM NSPCC Helpline", url: "https://www.nspcc.org.uk/what-is-child-abuse/types-of-abuse/female-genital-mutilation-fgm/" }] },
];

// ─── Precomputed guide map ──────────────────────────────────────
export const GUIDE_MAP = Object.fromEntries(GUIDES.map(g => [g.id, g]));

// ─── Priority order for Guides tab (refugee-first) ─────────────
export const GUIDE_PRIORITY = [
  'move-on', 'bank', 'uc', 'ni', 'evisa', 'sharecode', 'gp', 'housing-help',
  'work-rights', 'ctd', 'citizen-card', 'employment-rights', 're-qualify', 'ilr',
  'renting', 'schools', 'mental', 'safety', 'tax', 'driving',
  'proof-address', 'travel', 'family-reunion', 'nrpf', 'women-support', 'community',
];

// ─── SAVES (Free Stuff) ─────────────────────────────────────────
export const SAVES = [
  { icon: "📱", content: { en: { title: "Free SIM Card — 40GB/month", desc: "National Databank: free Vodafone SIM with 40GB data + unlimited calls/texts per month for 6 months. Or O2: 25GB. Available to anyone on low income. No ID checks. Ask at your local library, O2 store, or charity." } }, url: "https://www.goodthingsfoundation.org/our-services/national-databank" },
  { icon: "💻", content: { en: { title: "Free Laptop or Tablet", desc: "Good Things Foundation's National Device Bank distributes free devices through libraries and charities. Ask your Refugee Council caseworker or local library." } }, url: "https://www.goodthingsfoundation.org/our-services/national-device-bank" },
  { icon: "💊", content: { en: { title: "Free Prescriptions", desc: "If you receive UC, Income Support, ESA, or Pension Credit — all NHS prescriptions are FREE. Pregnant women and new mothers also qualify. Get an HC2 certificate if on low income." } }, url: "https://www.nhs.uk/nhs-services/help-with-health-costs/" },
  { icon: "🚌", content: { en: { title: "Transport Discounts & Railcards", desc: "16-25 Railcard: £30/year saves 1/3 on all trains. Works on London Oyster too. 26-30 Railcard also available. National Express Coachcard: £15/year for 1/3 off coaches." } }, url: "https://www.16-25railcard.co.uk" },
  { icon: "🚗", content: { en: { title: "Jobcentre Transport Fund", desc: "Your Work Coach can pay for bus/train fares to job interviews and contribute to driving lessons. Ask about the Flexible Support Fund — up to £300 for job-related transport." } }, url: "https://www.gov.uk/guidance/flexible-support-fund" },
  { icon: "🔥", content: { en: { title: "Warm Home Discount — £150 off Electricity", desc: "On UC, Pension Credit, or low income? You may get £150 off your electricity bill automatically each winter. Contact your energy supplier to check." } }, url: "https://www.gov.uk/the-warm-home-discount-scheme" },
  { icon: "🏠", content: { en: { title: "Council Tax Reduction — Up to 100% Off", desc: "On UC or low income? Apply to your local council for Council Tax Reduction. Many refugees get 100% — meaning zero council tax." } }, url: "https://www.gov.uk/council-tax-reduction" },
  { icon: "🍼", content: { en: { title: "Healthy Start Vouchers", desc: "Pregnant or have children under 4? On UC, you get free vouchers: £4.25/week per child under 1, £8.50/week if pregnant. Spend on milk, fruit, vegetables." } }, url: "https://www.healthystart.nhs.uk" },
  { icon: "👶", content: { en: { title: "Sure Start Maternity Grant — £500", desc: "One-off £500 payment for your first child if on UC or Pension Credit. Claim within 11 weeks of due date or 6 months after birth. Not repayable." } }, url: "https://www.gov.uk/sure-start-maternity-grant" },
  { icon: "🍽", content: { en: { title: "Food Banks — Free Food Parcels", desc: "Trussell Trust runs 1,400+ food banks. Usually need a referral from GP, Jobcentre, or Citizens Advice — but many accept walk-ins. Free emergency food for 3 days." } }, url: "https://www.trusselltrust.org/get-help/find-a-foodbank/" },
  { icon: "👕", content: { en: { title: "Free School Uniforms", desc: "Most councils and many schools have free uniform schemes. Some councils give £100+ grants. Check with your child's school or local council." } }, url: "https://www.gov.uk/help-school-clothing-costs" },
  { icon: "🏛", content: { en: { title: "Free Museums & Galleries", desc: "British Museum, Natural History Museum, Science Museum, National Gallery, Tate Modern, V&A — all FREE. Great free days out for families." } }, url: "https://www.museumsassociation.org/campaigns/free-museums/" },
  { icon: "📚", content: { en: { title: "Library Card — Free Everything", desc: "Free books, internet, Wi-Fi, computer access, printing, events, language cafés, children's activities. Some libraries lend museum passes. Just show proof of address." } }, url: "https://www.gov.uk/local-library-services" },
  { icon: "🎓", content: { en: { title: "Free English (ESOL) Classes", desc: "ESOL classes at FE colleges are completely free if you receive UC or certain benefits. The fastest way to improve your English." } }, url: "https://www.gov.uk/improve-english-maths-it-skills" },
  { icon: "💰", content: { en: { title: "Budgeting Advance — Up to £812", desc: "Need money for furniture, clothes, or moving costs? Apply via your UC journal. Interest-free. Repaid slowly from UC payments. Must be on UC for 6+ months." } }, url: "https://www.gov.uk/universal-credit/other-help" },
  { icon: "🛒", content: { en: { title: "Amazon Prime — Half Price on UC", desc: "£4.49/month instead of £8.99 if you receive UC, JSA, ESA, or Pension Credit. Includes free delivery and Prime Video." } }, url: "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=G34EUPKVMYFW8N2U" },
];

// ─── JOBS ────────────────────────────────────────────────────────
// Each job has applyLinks[] with per-employer apply links + docs[] required
export const JOBS = [
  {
    icon: "🛵",
    content: { en: { role: "Delivery Rider / Driver", desc: "App-based food and parcel delivery. You choose your own hours. Start earning within days of signing up. Bike, scooter, or car accepted. ⚠ You must have full right to work in the UK (check your eVisa/share code). Asylum seekers usually cannot work until refugee status is granted. Gig platforms enforce strict checks — no account sharing allowed." } },
    pay: "£10–£18/hr",
    tags: ["Flexible hours", "Bike / Scooter / Car"],
    docs: ["Share code (Right to Work)", "Bank account details", "Bike, scooter, or car", "Proof of age (18+)", "Smartphone"],
    applyLinks: [
      { name: "Deliveroo Riders", url: "https://riders.deliveroo.co.uk" }, // kept — verified working March 2026
      { name: "Uber Eats — Deliver with Uber", url: "https://www.uber.com/gb/en/deliver/" }, // kept — verified working March 2026
      { name: "Just Eat — Become a courier", url: "https://couriers.just-eat.co.uk/" }, // re-added March 2026 - verified current signup flow
      { name: "Bolt Food — Become a courier", url: "https://bolt.eu/en-gb/couriers/" }, // Added March 2026 - major UK platform
      { name: "Stuart Couriers", url: "https://couriers.stuart.com/apply" }, // Updated March 2026 - verified current app-based flow
      { name: "Gophr Couriers", url: "https://app.gophr.com/register" }, // Updated March 2026 - verified current app-based flow
    ],
  },
  {
    icon: "🚐",
    content: { en: { role: "Courier / Parcel Delivery (Van)", desc: "Drive a van delivering parcels for major carriers. Full-time and self-employed routes available. Some companies provide the van. ⚠ You must have full right to work in the UK (check your eVisa/share code). Asylum seekers usually cannot work until refugee status is granted. Gig platforms enforce strict checks — no account sharing allowed." } },
    pay: "£13–£18/hr",
    tags: ["Car or Van needed", "Full-time or Flexible"],
    docs: ["Share code (Right to Work)", "Full UK or valid foreign driving licence", "Bank account", "Own car or van (some companies provide)"],
    applyLinks: [
      { name: "Amazon Flex — sign up", url: "https://flex.amazon.co.uk/" }, // Updated March 2026 - verified current app-based flow
      { name: "Amazon Flex — download app", url: "https://flex.amazon.co.uk/download-app" }, // Added March 2026 - app required to register; 18+, right to work, UK driving licence, insurance
      { name: "DPD Drivers", url: "https://drivers.dpd.co.uk/" }, // Updated March 2026 - verified current app-based flow
      { name: "Evri — become a courier", url: "https://www.evri.com/careers/be-a-courier" }, // Updated March 2026 - verified current app-based flow
      { name: "Yodel Self-Employed Drivers", url: "https://www.yodel.co.uk/drivers" }, // kept — verified working March 2026
      { name: "DHL UK Jobs", url: "https://careers.dhl.com/global/en/uk-jobs" }, // kept — verified working March 2026
    ],
  },
  {
    icon: "📦",
    content: { en: { role: "Warehouse Operative", desc: "Picking, packing, and sorting goods. No experience needed. Amazon, supermarkets, and logistics firms are always hiring. Overtime and night shifts available." } },
    pay: "£12.71–£14/hr",
    tags: ["No experience needed", "Overtime available"],
    docs: ["Share code (Right to Work)", "Proof of address", "Safety boots (some sites provide them)", "Proof of NI number (helpful)"],
    applyLinks: [
      { name: "Amazon Jobs UK", url: "https://hiring.amazon.co.uk" },
      { name: "Royal Mail Jobs", url: "https://www.royalmailgroup.com/en/careers/" },
      { name: "Ocado Warehouse Jobs", url: "https://jobs.ocado.com" },
      { name: "Lidl Warehouse Jobs", url: "https://www.careers.lidl.co.uk" },
      { name: "Search all warehouse jobs (Indeed)", url: "https://uk.indeed.com/jobs?q=warehouse+operative&l=United+Kingdom" },
    ],
  },
  {
    icon: "🧡",
    content: { en: { role: "Healthcare Assistant (HCA)", desc: "Support patients and residents in NHS hospitals, GP surgeries, or care homes. Care Certificate training is FREE from your employer. Visa sponsorship available for eligible candidates." } },
    pay: "£11.44–£14/hr",
    tags: ["Visa sponsorship available", "Career path to nursing"],
    docs: ["Share code (Right to Work)", "Enhanced DBS check (employer arranges, usually free)", "Two references", "Care Certificate (employer funds this for you)"],
    visa: true,
    applyLinks: [
      { name: "NHS Jobs — Band 2/3 HCA roles", url: "https://www.jobs.nhs.uk/candidate/search?keywords=healthcare+assistant&radius=20" },
      { name: "Care UK", url: "https://jobs.careuk.com" },
      { name: "HC-One Care Homes", url: "https://www.hc-one.co.uk/join-hc-one/our-opportunities/" },
      { name: "Barchester Healthcare", url: "https://www.barchester.com/jobs" },
      { name: "Reed Health & Care", url: "https://www.reed.co.uk/jobs/health-care-jobs" },
    ],
  },
  {
    icon: "🏗",
    content: { en: { role: "Construction Labourer", desc: "Entry-level site work. CSCS Green Card required — but training is fully funded via a free Skills Bootcamp. No prior experience needed." } },
    pay: "£13–£16/hr",
    tags: ["CSCS card needed", "Free funded training available"],
    docs: ["Share code (Right to Work)", "CSCS Green Card (get free via Skills Bootcamp)", "Safety boots and hi-vis (often provided on site)", "Photo ID"],
    applyLinks: [
      { name: "Free CSCS Training — CITB", url: "https://www.citb.co.uk/courses-and-qualifications/cscs-health-safety-and-environment-test/" },
      { name: "Find a free Skills Bootcamp (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
      { name: "Hays Construction Jobs", url: "https://www.hays.co.uk/construction-jobs" },
      { name: "Manpower Construction Jobs", url: "https://www.manpower.co.uk" },
      { name: "Indeed Construction Labourer Jobs", url: "https://uk.indeed.com/jobs?q=construction+labourer" },
    ],
  },
  {
    icon: "🚛",
    content: { en: { role: "HGV / LGV Driver", desc: "Critical national shortage — UK needs 60,000+ drivers. Skills Bootcamp covers 100% of training and licence costs. No experience or existing licence required." } },
    pay: "£14–£20/hr",
    tags: ["Critical shortage", "100% funded training"],
    docs: ["Share code (Right to Work)", "Provisional UK driving licence (or full)", "D4 medical form (DVLA approved doctor, ~£80 — sometimes funded)", "CPC qualification (funded via bootcamp)"],
    applyLinks: [
      { name: "Free HGV Training — Skills Bootcamp (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
      { name: "Driver Hire Jobs", url: "https://www.driverhire.co.uk" },
      { name: "Eddie Stobart Careers", url: "https://www.eddiestobart.com/careers" },
      { name: "Indeed HGV Driver Jobs", url: "https://uk.indeed.com/jobs?q=hgv+driver" },
    ],
  },
  {
    icon: "🍴",
    content: { en: { role: "Kitchen Porter / Food Production", desc: "Washing up, cleaning, and basic food prep in restaurants, hotels, and food factories. Free Food Hygiene Level 2 certificate available via Jobcentre." } },
    pay: "£12.71–£13/hr",
    tags: ["No experience needed", "Free Food Hygiene cert via Jobcentre"],
    docs: ["Share code (Right to Work)", "Food Hygiene Level 2 certificate (free via Jobcentre)", "References (helpful but rarely required)"],
    applyLinks: [
      { name: "Caterer.com Kitchen Jobs", url: "https://www.caterer.com/jobs/kitchen-porter" },
      { name: "McDonald's UK Jobs", url: "https://people.mcdonalds.co.uk" },
      { name: "Pret a Manger Jobs", url: "https://jobs.pret.com/jobs/gb" },
      { name: "Greggs Jobs", url: "https://jobs.greggs.co.uk" },
      { name: "Indeed Kitchen / Food Production Jobs", url: "https://uk.indeed.com/jobs?q=kitchen+porter" },
    ],
  },
  {
    icon: "🧹",
    content: { en: { role: "Cleaning / Facilities Operative", desc: "Hotels, offices, hospitals, schools, and transport hubs always need cleaning staff. Large agencies hire immediately — often start same week." } },
    pay: "£12.71–£13.50/hr",
    tags: ["No experience needed", "Flexible hours"],
    docs: ["Share code (Right to Work)", "References (helpful but not always required)", "DBS check for some roles (healthcare / schools — employer arranges)"],
    applyLinks: [
      { name: "OCS Group Jobs", url: "https://www.ocsgroup.com/join-us/" },
      { name: "ISS UK Careers", url: "https://www.uk.issworld.com/en-gb/careers" },
      { name: "Mitie Careers", url: "https://www.mitie.com/careers/" },
      { name: "Sodexo UK Jobs", url: "https://uk.sodexo.com/home/careers.html" },
      { name: "Indeed Cleaning Jobs", url: "https://uk.indeed.com/jobs?q=cleaning+operative" },
    ],
  },
  {
    icon: "🛡",
    content: { en: { role: "Security Officer (SIA Licensed)", desc: "Shopping centres, events, hospitals, and offices. SIA licence required. Companies like G4S and Securitas fund training for the right candidates." } },
    pay: "£12–£15/hr",
    tags: ["SIA licence required", "Training often funded"],
    docs: ["Share code (Right to Work)", "SIA Door Supervisor or Security Guarding licence (companies can fund this)", "Enhanced DBS (employer arranges)", "5-year checkable history"],
    applyLinks: [
      { name: "G4S UK Careers", url: "https://www.g4s.com/en-gb/careers" },
      { name: "Securitas UK Jobs", url: "https://www.securitas.com/gb/en/careers/" },
      { name: "Corps Security Careers", url: "https://www.corpssecurity.co.uk/careers/" },
      { name: "Compass Group Security Jobs", url: "https://www.compass-group.co.uk/careers/" },
      { name: "Indeed Security Officer Jobs", url: "https://uk.indeed.com/jobs?q=security+officer" },
    ],
  },
  {
    icon: "🏫",
    content: { en: { role: "Teaching Assistant (TA)", desc: "Support children in state schools. Multilingual skills are highly valued — especially Arabic, Somali, Amharic, Tigrinya, Urdu. Many schools support TAs through on-the-job qualifications." } },
    pay: "£12–£15/hr",
    tags: ["Multilingual skills valued", "DBS required"],
    docs: ["Share code (Right to Work)", "Enhanced DBS (school arranges)", "Two references", "Any relevant qualifications (helpful but not always required)"],
    visa: true,
    applyLinks: [
      { name: "TeachVac (free job board)", url: "https://www.teachvac.co.uk" },
      { name: "TES Teaching Jobs", url: "https://www.tes.com/jobs/teaching-assistants" },
      { name: "Hays Education", url: "https://www.hays.co.uk/education-jobs" },
      { name: "Reed Education Jobs", url: "https://www.reed.co.uk/jobs/teaching-assistant-jobs" },
    ],
  },
  {
    icon: "☕",
    content: { en: { role: "Barista / Café Staff", desc: "Coffee shops, cafés, and quick-service restaurants. Full training provided on the job. Starbucks, Costa, Caffè Nero, and Pret hire frequently." } },
    pay: "£12.71–£13.50/hr",
    tags: ["No experience needed", "Training provided"],
    docs: ["Share code (Right to Work)", "Food Hygiene cert (helpful — free via Jobcentre)", "Smart/uniform appearance"],
    applyLinks: [
      { name: "Starbucks UK Jobs", url: "https://www.starbucks.co.uk/careers" },
      { name: "Costa Coffee Jobs", url: "https://www.costacoffee.com/jobs" },
      { name: "Caffè Nero Jobs", url: "https://www.caffenero.com/uk/careers" },
      { name: "Pret a Manger Jobs", url: "https://jobs.pret.com/jobs/gb" },
      { name: "Indeed Barista Jobs", url: "https://uk.indeed.com/jobs?q=barista" },
    ],
  },
  {
    icon: "🏨",
    content: { en: { role: "Hotel & Hospitality Staff", desc: "Housekeeping, reception, and food service in hotels. Housekeeping needs no experience. Reception benefits from English skills. Tips possible in many roles." } },
    pay: "£12.71–£14/hr",
    tags: ["No experience for housekeeping", "Tips possible"],
    docs: ["Share code (Right to Work)", "References (helpful)", "Smart appearance"],
    applyLinks: [
      { name: "Premier Inn Jobs", url: "https://careers.premierinn.com" },
      { name: "Travelodge Jobs", url: "https://www.travelodgejobs.co.uk" },
      { name: "IHG (Holiday Inn / Crowne Plaza) Jobs", url: "https://careers.ihg.com" },
      { name: "Marriott UK Careers", url: "https://careers.marriott.com" },
      { name: "Caterer.com Hotel Jobs", url: "https://www.caterer.com/jobs/hotel" },
    ],
  },
  {
    icon: "🫂",
    content: { en: { role: "Support Worker / Care Worker", desc: "One of the most in-demand and beginner-friendly jobs in the UK. Support people with disabilities, mental health challenges, or elderly care needs in residential homes, supported housing, or in the community. No prior UK experience needed — your employer trains you fully via the free Care Certificate. Visa sponsorship widely available." } },
    pay: "£12.71–£15/hr",
    tags: ["No experience needed", "Visa sponsorship available", "Career progression"],
    docs: ["Share code (Right to Work)", "Enhanced DBS check (employer arranges, free)", "Two references", "Care Certificate (fully employer-funded on the job)"],
    visa: true,
    applyLinks: [
      { name: "NHS Jobs — Support Worker", url: "https://www.jobs.nhs.uk/candidate/search?keywords=support+worker&radius=20" },
      { name: "Indeed — Support Worker Jobs", url: "https://uk.indeed.com/jobs?q=support+worker" },
      { name: "Mencap Careers", url: "https://www.mencap.org.uk/support-us/work-mencap" },
      { name: "National Autistic Society Jobs", url: "https://www.autism.org.uk/what-we-do/employment/working-for-us" },
      { name: "Turning Point Careers", url: "https://www.turning-point.co.uk/about-us/work-for-us.html" },
      { name: "Voyage Care Jobs", url: "https://www.voyagecare.com/recruitment/" },
    ],
  },
  {
    icon: "🛒",
    content: { en: { role: "Supermarket / Retail Assistant", desc: "Tesco, Sainsbury's, Asda, Aldi, and Lidl are always hiring. Shelf stacking, checkout, click-and-collect, or bakery. Most roles start immediately with no UK experience. Night shifts and weekend premium pay available." } },
    pay: "£12.71–£14.50/hr",
    tags: ["No experience needed", "Immediate start", "Shift premiums"],
    docs: ["Share code (Right to Work)", "Proof of age (18+ for alcohol sections)", "Bank account details"],
    applyLinks: [
      { name: "Tesco Jobs", url: "https://www.tesco-careers.com/en/search/" },
      { name: "Sainsbury's Jobs", url: "https://jobs.sainsburys.co.uk" },
      { name: "Asda Jobs", url: "https://www.asda.jobs" },
      { name: "Aldi UK Jobs", url: "https://www.aldi.co.uk/about-aldi/careers" },
      { name: "Lidl UK Jobs", url: "https://www.careers.lidl.co.uk" },
      { name: "Morrisons Careers", url: "https://www.morrisons.jobs" },
      { name: "M&S Jobs", url: "https://careers.marksandspencer.com" },
      { name: "Indeed — Supermarket Jobs", url: "https://uk.indeed.com/jobs?q=supermarket+assistant" },
    ],
  },
  {
    icon: "🚕",
    content: { en: { role: "Private Hire / Taxi Driver (Uber, Bolt, Addison Lee)", desc: "Flexible driving work — use your own car or lease one. Requires a local council PHV licence (4–12 weeks to get). Uber and Bolt pay bonuses during your first months. Good English helpful for ratings. ⚠ You must have full right to work in the UK. Standard car insurance is NOT valid — you need hire and reward cover." } },
    pay: "£13–£20/hr (after costs)",
    tags: ["Own car or lease", "PHV licence required", "Flexible hours"],
    docs: ["Share code (Right to Work)", "Full UK or valid foreign driving licence (3+ years)", "PHV council licence (see Certs tab)", "Hire and reward insurance", "Enhanced DBS (council arranges)", "D4 medical (council arranges)"],
    applyLinks: [
      { name: "Drive with Uber UK", url: "https://www.uber.com/gb/en/drive/" },
      { name: "Drive with Bolt UK", url: "https://bolt.eu/en-gb/drive/" },
      { name: "Addison Lee Driver Jobs", url: "https://www.addisonlee.com/drive-for-us/" },
      { name: "Ola UK Drivers", url: "https://driver.olacabs.com/gb/en/registration" },
      { name: "Apply for PHV licence (GOV.UK)", url: "https://www.gov.uk/apply-for-taxi-licence" },
    ],
  },
  // Added March 2026 - refugee-friendly job agencies / agency link
  {
    icon: "🤝",
    content: { en: { role: "Refugee Employment Support Organisations", desc: "Specialist organisations that connect refugees directly to employers and free employment support. These are some of the fastest routes into work — start here before applying cold. Free CV help, interview coaching, and employer introductions." } },
    pay: "Free support",
    tags: ["Free service", "Refugee-specific", "Employer introductions"],
    docs: ["Refugee status document or BRP", "Share code (Right to Work)", "CV (they will help you build one)"],
    applyLinks: [
      { name: "Refugee Employment Network", url: "https://refugeeemploymentnetwork.org/" }, // Added March 2026 - agency link
      { name: "Breaking Barriers — Jobs & Training", url: "https://breaking-barriers.co.uk/refugee-support/employment/" }, // Added March 2026 - agency link
      { name: "Tent UK — Major Employers Hiring Refugees", url: "https://www.tent.org/uk" }, // Added March 2026 - agency link
      { name: "IRC UK — Employment Support", url: "https://www.rescue.org/uk/employment-support-refugees-uk" }, // Added March 2026 - agency link
    ],
  },
];

// ─── CERTS ───────────────────────────────────────────────────────
export const CERTS = [
  {
    icon: "🔍",
    content: { en: { title: "DBS Check", sector: "Care, education, childcare, security" } },
    time: "24–72 hrs", cost: "£18 basic / Free enhanced",
    freeRoute: "FREE Enhanced DBS for volunteers — your organisation applies on your behalf.",
    steps: { en: [
      "Decide which level you need: Basic (£18, any job), Standard (criminal record checks), Enhanced (care, education, NHS).",
      "Basic DBS: apply yourself on GOV.UK — result in 24–72 hours.",
      "Standard/Enhanced DBS: your employer applies via an umbrella body — you cannot apply yourself.",
      "Volunteers: your organisation applies for FREE Enhanced DBS — just ask them.",
      "DBS Update Service (£13/yr): keep your certificate live and shareable with multiple employers.",
      "⚠ Most employers only need Basic DBS. Never pay more than £18 unless your role specifically requires Enhanced.",
    ]},
    links: [
      { name: "Apply Basic DBS (GOV.UK)", url: "https://www.gov.uk/request-copy-criminal-record" },
      { name: "DBS Update Service (GOV.UK)", url: "https://www.gov.uk/dbs-update-service" },
    ],
    studyLinks: [
      { name: "Which DBS check do you need? (GOV.UK)", url: "https://www.gov.uk/find-out-dbs-check" },
    ],
  },
  {
    icon: "🍴",
    content: { en: { title: "Food Hygiene Level 2", sector: "Catering, food retail, hospitality" } },
    time: "1 day (online: 2–4 hrs)", cost: "£10–£25 / Free via Jobcentre",
    freeRoute: "FREE if you're on Universal Credit — ask your Work Coach to fund it via the Flexible Support Fund.",
    steps: { en: [
      "Ask your Jobcentre Work Coach about the Flexible Support Fund — can cover the full cost.",
      "Online option (cheapest): Highfield or Virtual College — 2–4 hours, costs £10–£25.",
      "In-person option: local college or training centre — 1 full day.",
      "Certificate valid for 3 years. Every UK food business legally requires staff to hold Level 2.",
      "Level 3 Supervisor: upgrade later for £60–£100 — opens supervisor and management roles.",
      "⚠ Always confirm your employer accepts your specific awarding body before booking.",
    ]},
    links: [
      { name: "Highfield Food Safety L2", url: "https://www.highfield.co.uk/qualifications/food-safety/" },
      { name: "Flexible Support Fund (GOV.UK)", url: "https://www.gov.uk/flexible-support-fund" },
    ],
    studyLinks: [
      { name: "Food safety basics — Food Standards Agency", url: "https://www.food.gov.uk/business-guidance/food-safety" },
      { name: "Free practice test (Virtual College)", url: "https://www.virtual-college.co.uk/resources/food-hygiene-test" },
    ],
  },
  {
    icon: "🏗",
    content: { en: { title: "CSCS Card", sector: "Construction, civil engineering, trades" } },
    time: "1–2 weeks", cost: "£58.50 total (or fully FREE)",
    freeRoute: "Skills Bootcamp: fully funded training + guaranteed employer interview on completion.",
    steps: { en: [
      "FREE route: Search 'Construction Skills Bootcamp' at gov.uk/guidance/find-a-skills-bootcamp.",
      "Standard Step 1: Complete a Health & Safety course with a CITB-approved provider.",
      "Standard Step 2: Book and pass the CITB Health, Safety & Environment test (£22.50).",
      "Standard Step 3: Apply for your CSCS card — select card type based on your qualification (£36).",
      "Green Labourer Card: cheapest and quickest entry — for general labouring work.",
      "Card valid 5 years. Required to enter most UK construction sites by law.",
      "⚠ Do NOT pay agencies more than £58.50 total. Common scam targeting new arrivals.",
    ]},
    links: [
      { name: "Find Skills Bootcamp (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
      { name: "Apply for CSCS card", url: "https://www.cscs.uk.com/applying-for-a-card/" },
      { name: "Book CITB test", url: "https://www.citb.co.uk/standards-and-delivering-training/health-safety-environment-hse-test/" },
    ],
    studyLinks: [
      { name: "Free CITB mock test (CITB)", url: "https://www.citb.co.uk/standards-and-delivering-training/health-safety-environment-hse-test/mock-test/" },
      { name: "Which CSCS card do you need?", url: "https://www.cscs.uk.com/applying-for-a-card/which-card/" },
    ],
  },
  {
    icon: "🛡",
    content: { en: { title: "SIA Security Licence", sector: "Security, door supervision, retail" } },
    time: "6–10 weeks", cost: "£1,400+ training + £190 SIA fee / Free via SWAPs",
    freeRoute: "Jobcentre SWAPs: fully funded Door Supervisor training + guaranteed employer interview.",
    steps: { en: [
      "FREE route: Ask your Jobcentre Work Coach about 'SWAPs in Security' — covers full training cost.",
      "Step 1: Complete the Level 2 Award for Door Supervisors at an SIA-approved provider (4–6 weeks).",
      "Step 2: Apply for your SIA licence online — £190 fee — allow 6–8 weeks for processing.",
      "SIA licence valid 3 years. Renewal costs £190.",
      "Door Supervisor licence covers: pubs, clubs, event security, retail, and close protection support.",
      "CCTV Operator licence: shorter course (5 days), lower cost — great alternative entry route.",
      "⚠ You cannot legally work in licensable security without a valid SIA licence.",
    ]},
    links: [
      { name: "Apply for SIA Licence", url: "https://www.sia.homeoffice.gov.uk/Pages/licensing-apply.aspx" },
      { name: "SWAPs programme (GOV.UK)", url: "https://www.gov.uk/government/publications/sector-based-work-academies-employer-guide" },
      { name: "Find SIA-approved trainers", url: "https://www.sia.homeoffice.gov.uk/Pages/training-providers.aspx" },
    ],
    studyLinks: [
      { name: "SIA licence courses guide", url: "https://www.sia.homeoffice.gov.uk/Pages/licensing-courses.aspx" },
      { name: "Check a licence (SIA)", url: "https://www.sia.homeoffice.gov.uk/Pages/licence-checker.aspx" },
    ],
  },
  {
    icon: "🩹",
    content: { en: { title: "First Aid Certificate", sector: "All sectors (care, construction, education)" } },
    time: "1 day (EFAW) or 3 days (FAW)", cost: "£80–£300 / Free via Red Cross",
    freeRoute: "British Red Cross runs FREE first aid training specifically for refugees and asylum seekers.",
    steps: { en: [
      "FREE route: Contact your local British Red Cross branch and ask about free first aid for refugees.",
      "Emergency First Aid at Work (EFAW): 1 day — covers basics and meets most employer requirements.",
      "First Aid at Work (FAW): 3 days — required for designated first aiders, earns higher pay.",
      "St John Ambulance: community courses from £50, often subsidised for low income.",
      "Certificate valid 3 years. Many employers pay for renewal once you are working.",
      "First aid on your CV is valued in care, education, hospitality, construction, and retail.",
    ]},
    links: [
      { name: "Red Cross First Aid Training (free for refugees)", url: "https://www.redcross.org.uk/get-help/get-first-aid-training" },
      { name: "St John Ambulance Courses", url: "https://www.sja.org.uk/courses/first-aid-courses/" },
    ],
    studyLinks: [
      { name: "NHS First Aid basics (free)", url: "https://www.nhs.uk/conditions/first-aid/" },
      { name: "Red Cross: learn first aid online (free)", url: "https://www.redcross.org.uk/first-aid/learn-first-aid" },
    ],
  },
  {
    icon: "🏭",
    content: { en: { title: "Forklift Licence (FLT)", sector: "Warehousing, logistics, manufacturing" } },
    time: "3–5 days", cost: "£200–£500 / Often free via agency",
    freeRoute: "Many agencies (Manpower, Staffline) train you free in exchange for working with them. Skills Bootcamps too.",
    steps: { en: [
      "FREE via agency: Register with Manpower, Staffline, or Pertemps — tell them you want FLT training.",
      "FREE via government: Search 'Logistics Skills Bootcamp' at gov.uk/guidance/find-a-skills-bootcamp.",
      "Training covers: counterbalance forklift (most common), reach truck, or both — start with counterbalance.",
      "Pass theory test and practical assessment at end of the course.",
      "Get RTITB or ITSSAR certificate — both nationally recognised by all employers.",
      "Card valid 5 years. Keep your certificate card — employers will always ask to see it.",
      "FLT operators earn £12–£16/hr. Night shifts and bank holidays attract premium pay.",
    ]},
    links: [
      { name: "Find FLT training centres (RTITB)", url: "https://www.rtitb.com/find-a-training-centre/" },
      { name: "Skills Bootcamps — Logistics (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
    ],
    studyLinks: [
      { name: "Preparing for forklift test (RTITB guide)", url: "https://www.rtitb.com/news/preparing-forklift-licence-test/" },
      { name: "ITSSAR approved instructors", url: "https://www.itssar.org.uk/approved-instructors" },
    ],
  },
  {
    icon: "🚛",
    content: { en: { title: "HGV / LGV Licence", sector: "Haulage, logistics, supermarket delivery" } },
    time: "2–6 months", cost: "£1,000–£3,000 / FULLY FREE via Skills Bootcamp",
    freeRoute: "Skills Bootcamp covers every cost: D4 medical, theory tests, CPC modules, and practical test.",
    steps: { en: [
      "FULLY FUNDED: Search 'HGV Skills Bootcamp' at gov.uk/guidance/find-a-skills-bootcamp.",
      "Step 1: D4 medical exam (GP or private, ~£100 — often covered by the bootcamp).",
      "Step 2: Apply to DVLA for provisional HGV licence entitlement.",
      "Step 3: Pass Category C theory test + hazard perception test (book at GOV.UK).",
      "Step 4: Pass 4 Driver CPC modules (2 theory + 2 practical).",
      "Step 5: Pass HGV Category C practical driving test.",
      "Starting pay: £28K–£35K. Agency, nights, and fridge work: £35K–£45K.",
      "⚠ You need the right to work in the UK to obtain an HGV licence.",
    ]},
    links: [
      { name: "Find HGV Bootcamp (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
      { name: "Become a lorry driver (GOV.UK)", url: "https://www.gov.uk/become-lorry-bus-driver" },
      { name: "Book your theory test (GOV.UK)", url: "https://www.gov.uk/book-theory-test" },
    ],
    studyLinks: [
      { name: "LGV theory test practice (GOV.UK)", url: "https://www.gov.uk/take-practice-theory-test" },
      { name: "Driver CPC explained (GOV.UK)", url: "https://www.gov.uk/driver-cpc-training" },
      { name: "Official Highway Code (GOV.UK)", url: "https://www.gov.uk/highway-code" },
    ],
  },
  {
    icon: "🧡",
    content: { en: { title: "Care Certificate", sector: "Social care, NHS, domiciliary care" } },
    time: "6–12 weeks (on the job, fully paid)", cost: "FREE — employer funds 100%",
    freeRoute: "100% employer-funded. You earn full wage during training. No prior experience needed.",
    steps: { en: [
      "Apply for any entry-level care role: Healthcare Assistant, Support Worker, or Care Worker.",
      "Your employer delivers the Care Certificate on the job — 15 mandatory standards to complete.",
      "No written exam. Assessed through observation, reflective accounts, and discussions with your manager.",
      "Eligible for the Health & Social Care Worker Visa — employers can sponsor you.",
      "Starting pay: Band 2–3 NHS (£23K–£27K). Progress to Band 4–5 with experience.",
      "Apply via NHS Jobs for NHS roles. Private care: local agencies or national care home chains.",
      "⚠ Never pay for a Care Certificate. It is always free — legally, the employer must pay.",
    ]},
    links: [
      { name: "NHS Jobs — Healthcare Assistant roles", url: "https://www.jobs.nhs.uk/" },
      { name: "Health & Social Care Worker Visa (GOV.UK)", url: "https://www.gov.uk/health-care-worker-visa" },
    ],
    studyLinks: [
      { name: "Care Certificate standards (Skills for Care)", url: "https://www.skillsforcare.org.uk/Developing-your-workforce/Care-Certificate/Care-Certificate.aspx" },
      { name: "Free care training resources (Skills for Care)", url: "https://www.skillsforcare.org.uk/Learning-development/learning-and-development-resources/Learning-and-development-resources.aspx" },
    ],
  },
  {
    icon: "🍺",
    content: { en: { title: "Personal Licence (APLH)", sector: "Pubs, bars, supermarkets, off-licences" } },
    time: "4–8 weeks", cost: "£135–£255 total / Sometimes free via employer",
    freeRoute: "Some pub chains (Wetherspoons, Greene King) fund everything in management trainee schemes.",
    steps: { en: [
      "Step 1: Pass the APLH qualification online — approximately 4 hours, costs from £80.",
      "Step 2: Apply for a Basic DBS check (£18) — must be under 1 month old when you apply.",
      "Step 3: Apply to your local council for a Personal Licence — £37 fee.",
      "Licence is issued for life — no renewal needed.",
      "Required for the Designated Premises Supervisor (DPS) role: the named person responsible for alcohol.",
      "⚠ You need the right to work and must be 18+ to hold a Personal Licence.",
    ]},
    links: [
      { name: "Apply for Personal Licence (GOV.UK)", url: "https://www.gov.uk/apply-for-a-premises-licence-to-sell-alcohol" },
      { name: "APLH qualification (Highfield)", url: "https://www.highfield.co.uk/qualifications/alcohol/" },
    ],
    studyLinks: [
      { name: "APLH revision (British Institute of Innkeeping)", url: "https://www.bii.org/Qualifications/APLH" },
      { name: "Licensing Act 2003 — plain English guide (GOV.UK)", url: "https://www.gov.uk/government/publications/summary-of-the-licensing-act-2003" },
    ],
  },
  {
    icon: "🚕",
    content: { en: { title: "PHV / Taxi Licence", sector: "Private hire, minicabs, Uber, Bolt" } },
    time: "4–12 weeks", cost: "£250–£600 (varies by council)",
    freeRoute: "Some councils offer fee waivers. Uber and Bolt may reimburse costs after your first trips.",
    steps: { en: [
      "Step 1: Apply to YOUR LOCAL COUNCIL — rules and costs vary significantly by area.",
      "Step 2: Enhanced DBS check — council arranges this, cost is usually included in application fee.",
      "Step 3: Group 2 DVLA medical exam (your GP or a private doctor, ~£80–£150). Must meet full D4 standard.",
      "Step 4: Topographic knowledge test — local streets and landmarks (difficulty varies by council).",
      "Step 5: Complete a safeguarding / child protection awareness course — usually free online.",
      "Step 6: Vehicle must be council-approved — check age limit and pass a vehicle inspection.",
      "London (TfL PCO): separate process — Knowledge of London test required. Much more intensive.",
      "⚠ Your vehicle insurance MUST include Public Hire cover — standard car insurance is invalid.",
    ]},
    links: [
      { name: "Taxi licensing guidance (GOV.UK)", url: "https://www.gov.uk/taxi-driver-licence" },
      { name: "Apply for taxi licence via your council (GOV.UK)", url: "https://www.gov.uk/apply-for-taxi-licence" },
      { name: "TfL Taxi & Private Hire (London only)", url: "https://tfl.gov.uk/info-for/taxis-and-private-hire/" },
    ],
    studyLinks: [
      { name: "Knowledge of London preparation (TfL)", url: "https://tfl.gov.uk/info-for/taxis-and-private-hire/licensing/learn-the-knowledge-of-london" },
      { name: "D4 medical form info (DVLA)", url: "https://www.gov.uk/government/publications/d4-medical-examination-report-for-a-lorry-bus-driver" },
    ],
  },
  {
    icon: "🚗",
    content: { en: { title: "Driving Theory Test", sector: "All drivers — required before UK practical test" } },
    time: "Theory: 1 day / Practical: 1 day (booked separately)", cost: "£23 theory / £62–£75 practical",
    freeRoute: "Jobcentre Flexible Support Fund can cover theory and practical test fees. Ask your Work Coach.",
    steps: { en: [
      "Step 1: Get a DVLA provisional driving licence if you don't have one — apply online for £34.",
      "Step 2: Book your theory test at gov.uk/book-theory-test — £23 fee.",
      "Part 1: 50 multiple choice questions (need 43/50 to pass). Part 2: 14 hazard perception clips (need 44/75).",
      "Both parts must pass in one sitting. You receive your result immediately.",
      "Theory pass valid for 2 years — book your practical test within this window.",
      "Step 3: Take driving lessons with a DVSA-approved instructor (BSM, AA, local instructor).",
      "Step 4: Book the practical driving test at gov.uk/book-driving-test — £62 weekday / £75 evening/weekend.",
      "Already drive? Overseas licences from some countries can be exchanged for UK licence — check GOV.UK.",
    ]},
    links: [
      { name: "Book Theory Test (GOV.UK)", url: "https://www.gov.uk/book-theory-test" },
      { name: "Book Practical Driving Test (GOV.UK)", url: "https://www.gov.uk/book-driving-test" },
      { name: "Apply for provisional licence (GOV.UK)", url: "https://www.gov.uk/apply-first-provisional-driving-licence" },
      { name: "Exchange overseas driving licence (GOV.UK)", url: "https://www.gov.uk/exchange-foreign-driving-licence" },
    ],
    studyLinks: [
      { name: "Official Highway Code — FREE (GOV.UK)", url: "https://www.gov.uk/highway-code" },
      { name: "Free theory test practice (GOV.UK)", url: "https://www.gov.uk/take-practice-theory-test" },
      { name: "Hazard perception test guide (GOV.UK)", url: "https://www.gov.uk/hazard-perception-test" },
    ],
  },
];

// ─── CAREER PATHS ───────────────────────────────────────────────
export const CAREERS = [
  { icon: "🏗", content: { en: { title: "Civil Engineering", salary: "£28K–£80K+" } }, tags: ["CEng", "CSCS", "ICE"], steps: { en: ["Get UK ENIC Statement of Comparability for your BSc/BEng/MEng — £49. Refugees without original documents: email refugee@ecctis.com for a waived or reduced assessment.", "Contact ICE (Institution of Civil Engineers) Refugee Support — free mentoring programme pairing you with a UK-based chartered engineer. This is one of the most valuable connections you can make.", "Register with the Engineering Council as your career progresses. Your overseas degree is assessed against UK standards. Target: EngTech → IEng → CEng.", "Get a CSCS Green Card via a free government Skills Bootcamp — this lets you enter any UK construction site immediately and start building UK experience.", "Entry-level roles: site engineer, assistant engineer, technical assistant, BIM technician. UK experience = the bridge to chartered status.", "RefuAid interest-free loans (up to £10,000) can fund ICE membership fees, chartership assessment costs, and any top-up qualifications.", "Breaking Barriers 'built environment' track provides career assessment, interview coaching, and employer introductions specifically for refugee engineers.", "Target employers: Atkins, Arup, Mott MacDonald, Jacobs, Stantec, Network Rail, Transport for London, HS2, local councils.", "CEng MICE takes typically 3–5 years from UK graduation or equivalent experience recognition. Salary at CEng level: £55K–£80K+."] }, links: [{ name: "ICE Refugee Support", url: "https://www.ice.org.uk/about-ice/what-we-do/social-mobility/refugee-support/" }, { name: "UK ENIC (degree recognition)", url: "https://www.enic.org.uk/Qualifications/SOC/Default.aspx" }, { name: "Engineering Council (UK)", url: "https://www.engc.org.uk" }, { name: "Breaking Barriers (refugee employment)", url: "https://breaking-barriers.co.uk/refugee-support/reaccreditation/" }, { name: "RefuAid interest-free loans", url: "https://www.refuaid.org" }] },
  { icon: "💻", content: { en: { title: "Technology & Digital", salary: "£28K–£90K+" } }, tags: ["Google", "AWS", "Coding"], steps: { en: ["Google Career Certificates (free): IT, Data, Cyber, UX.", "AWS/Azure via Skills Bootcamp.", "Code Your Future: free coding programme for refugees.", "Degree Apprenticeships — earn £20K+ while qualifying."] }, links: [{ name: "Google Certificates", url: "https://grow.google/certificates/" }, { name: "Code Your Future", url: "https://codeyourfuture.io/" }, { name: "Skills Bootcamps (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" }] },
  { icon: "💷", content: { en: { title: "Finance & Accountancy", salary: "£25K–£70K+" } }, tags: ["ACCA", "CIMA", "AAT"], steps: { en: ["ACCA refugee bursary — covers first exam fees.", "AAT Level 2 free if earning under £25,734.", "Bank of England, KPMG, Deloitte refugee programmes."] }, links: [{ name: "ACCA", url: "https://www.accaglobal.com/" }, { name: "AAT", url: "https://www.aat.org.uk/" }] },
  { icon: "📊", content: { en: { title: "Project & Business Management", salary: "£30K–£75K+" } }, tags: ["APM", "CMI", "MBA"], steps: { en: ["Your MBA from a recognised university is a major asset. Get UK ENIC recognition (£49) so UK employers can verify it.", "APM (Association for Project Management) offers refugee support and mentoring. The APM PMQ qualification (£200–£400) is the UK industry standard for project managers.", "CMI (Chartered Management Institute) is the UK's leading management body. A Chartered Manager Degree Apprenticeship delivers a free CMI Level 6 qualification while earning £20K–£25K.", "PMP (Project Management Professional) is globally recognised and directly complements an MBA — study online, exam ~£300.", "Prince2 Foundation + Practitioner (£500 total) is used across UK government and public sector projects.", "Target roles: project coordinator → project manager → programme manager → director. Your MBA positions you for management fast-track at most employers.", "Key sectors hiring project managers: infrastructure (aligned with your engineering background), construction, energy, IT, financial services.", "Target employers: Mott MacDonald, Atkins, Jacobs, Amey, BAM, Transport for London, NHS, HMRC digital."] }, links: [{ name: "APM (project management)", url: "https://www.apm.org.uk/" }, { name: "CMI (management institute)", url: "https://www.managers.org.uk/" }, { name: "UK ENIC (degree recognition)", url: "https://www.enic.org.uk/Qualifications/SOC/Default.aspx" }, { name: "Find a degree apprenticeship", url: "https://www.findapprenticeship.service.gov.uk/" }] },
  { icon: "🏥", content: { en: { title: "Healthcare & Nursing", salary: "£22K–£50K+" } }, tags: ["NMC", "NHS", "Band 2–7"], steps: { en: ["HCA (Band 2–3): no experience, Care Cert free, ~£22K.", "NHS Refugee Employment Programme.", "Overseas nurses: NMC + OSCE exam. Many trusts fund it."] }, links: [{ name: "NHS Jobs", url: "https://www.jobs.nhs.uk/" }, { name: "NMC Registration", url: "https://www.nmc.org.uk/registration/joining-the-register/" }] },
  { icon: "🌱", content: { en: { title: "Green Energy & Retrofit", salary: "£28K–£65K+" } }, tags: ["Heat Pumps", "Solar", "EV"], steps: { en: ["UK needs 250K+ green workers by 2030.", "Heat pump installation: £35K–£65K+. Free CITB training.", "No previous experience needed for many entry routes."] }, links: [{ name: "CITB", url: "https://www.citb.co.uk/" }, { name: "Skills Bootcamps (GOV.UK)", url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" }] },
  { icon: "🗣", content: { en: { title: "Translation & Interpreting", salary: "£25K–£60K+" } }, tags: ["CIOL", "NRPSI", "Amharic"], steps: { en: ["Amharic and Tigrinya are critically rare in the UK — demand far exceeds supply in NHS hospitals, courts, local authorities, and the asylum system. Your language alone is a significant professional asset.", "Start immediately (no qualification required): Language Line, thebigword, and Capita Translation hire telephone and video interpreters now. Your language skills are enough to begin earning.", "NHS interpreting: contact your local NHS trust's interpreter services directly. The NHS is legally required to provide interpreting and always needs rare language speakers urgently.", "Court and legal interpreting: the highest paid work (£35–£65/hr for rare languages). Register with the National Register of Public Service Interpreters (NRPSI) at nrpsi.org.uk — this unlocks NHS, police, and court bookings.", "CIOL (Chartered Institute of Linguists): UK's leading professional body. The Diploma in Translation (DipTrans) is the gold-standard qualification — prepare with CIOL study guides.", "ITI (Institute of Translation and Interpreting): professional membership and directory listing. Associate membership available while building your portfolio.", "Your engineering and business background opens premium niches: technical translation (engineering specs, contracts), financial/commercial translation, and expert witness interpreting — all command higher rates.", "Freelance profile: list on ProZ.com, Translators Cafe, and the ITI directory. Amharic–English specialists can charge £0.10–£0.20 per word for written translation.", "Long-term: a Language Service Provider (LSP) of your own is a realistic business route given the scarcity of Amharic professionals in the UK."] }, links: [{ name: "NRPSI (public service register)", url: "https://www.nrpsi.org.uk" }, { name: "CIOL (Chartered Institute of Linguists)", url: "https://www.ciol.org.uk" }, { name: "ITI (Institute of Translation)", url: "https://www.iti.org.uk" }, { name: "Language Line — become an interpreter", url: "https://www.languageline.com/uk/interpreters/" }] },
  { icon: "🏘", content: { en: { title: "Property Valuation & Surveying", salary: "£35K–£80K+" } }, tags: ["RICS", "MRICS", "APC"], steps: { en: ["Overseas property valuation experience (e.g. bank valuations, residential, commercial) is directly relevant. RICS explicitly recognises international professional experience and has a dedicated pathway for overseas-qualified surveyors.", "RICS (Royal Institution of Chartered Surveyors) is the UK gold standard. MRICS status unlocks the best roles. Email international@rics.org to discuss your route — they actively recruit internationally experienced professionals.", "Senior Professional APC Route: if overseas experience is substantial, you may qualify for this accelerated route — bypassing the standard 24-month structured training. Significant valuation backgrounds make this realistic.", "Step 1: UK ENIC recognition of your degree (£49) — establishes academic equivalence for RICS assessment.", "Step 2: Register with RICS as an Associate (AssocRICS) first — this is achievable quickly and lets you work as a surveyor while pursuing full MRICS.", "Entry roles while working toward MRICS: assistant valuer, estates officer, property consultant at councils, housing associations, CBRE, JLL, Savills, Knight Frank, or any mortgage lender.", "Bank/lender-panel valuer roles are a strong match for overseas valuation experience. UK banks require Red Book valuations. Target: Countrywide Surveying, e.surv, LSL Property Services.", "MRICS salary: £45K–£75K. Senior Registered Valuer or Director: £65K–£100K+.", "RefuAid loans can fund RICS assessment and APC costs. Breaking Barriers may also have employer connections in the built environment sector."] }, links: [{ name: "RICS — routes to membership", url: "https://www.rics.org/surveying-profession/join-rics/" }, { name: "RICS Senior Professional APC", url: "https://www.rics.org/surveying-profession/join-rics/assessment-of-professional-competence-apc/" }, { name: "RICS International routes", url: "https://www.rics.org/surveying-profession/join-rics/international-routes-to-membership/" }, { name: "UK ENIC (degree recognition)", url: "https://www.enic.org.uk/Qualifications/SOC/Default.aspx" }] },
  { icon: "🤝", content: { en: { title: "Social Work & Support Work", salary: "£22K–£45K+" } }, tags: ["HCPC", "Social Work England", "Care Cert"], steps: { en: ["Support Worker is one of the most accessible, high-demand entry roles in the UK — no prior UK experience required. Start within weeks of getting refugee status.", "The Care Certificate (15-standard induction, free from employer) is your entry credential. NHS, care homes, charities, and councils all hire Support Workers immediately.", "Support Worker salary: £22K–£28K. Senior Support Worker: £28K–£35K. Many roles offer shift premiums, overtime, and free training.", "If you have a relevant overseas degree (social sciences, psychology, health, education), you can train as a qualified Social Worker. Social Work England is the UK regulator.", "The ASYE (Assessed and Supported Year in Employment) is a paid first year of practice after qualifying — all employers provide this automatically.", "Qualifying routes: MA Social Work (2 years, funded bursary available), or fast-track Frontline/Step Up programmes for graduates (salaried, competitive).", "High-demand specialisms with better pay: mental health, learning disabilities, children's services (CYPS), domestic abuse support, refugee resettlement (directly relevant).", "Organisations specifically hiring refugees and people with lived experience: Nacro, St Mungo's, Shelter, Mind, Rethink, local councils.", "Overseas social work qualifications: assessed by Social Work England — contact them at socialworkengland.org.uk for your specific route.", "HCPC (Health and Care Professions Council) regulates social workers in some devolved nations — check requirements for Scotland, Wales, Northern Ireland separately."] }, links: [{ name: "Social Work England", url: "https://www.socialworkengland.org.uk/" }, { name: "Frontline (fast-track social work)", url: "https://thefrontline.org.uk/" }, { name: "Step Up to Social Work", url: "https://www.gov.uk/guidance/step-up-to-social-work" }, { name: "NHS Jobs — Support Worker", url: "https://www.jobs.nhs.uk/" }] },
];

// ─── GEMS ────────────────────────────────────────────────────────
export const GEMS = [
  { icon: "🎓", content: { en: { title: "Your Foreign Degree IS Valid", desc: "UK ENIC: £49 Statement of Comparability. Refugees with missing docs: refugee@ecctis.com." } }, url: "https://www.enic.org.uk/Qualifications/SOC/Default.aspx" },
  { icon: "💎", content: { en: { title: "Breaking Barriers — Free Career Help", desc: "UK's leading refugee employment charity. Free CV, interview coaching, employer introductions. London, Birmingham, Manchester, Glasgow." } }, url: "https://breaking-barriers.co.uk/" },
  { icon: "🚀", content: { en: { title: "Skills Bootcamps — 16 Weeks Free", desc: "Government training in shortage sectors. Guaranteed employer interview. 19+ with right to work." } }, url: "https://www.gov.uk/guidance/find-a-skills-bootcamp" },
  { icon: "🎓", content: { en: { title: "80+ University Scholarships", desc: "Sanctuary scholarships at Edinburgh, Warwick, Bristol, UCL, King's + 80 more. Many cover full tuition + living." } }, url: "https://star-network.org.uk/access-to-university/scholarships/list/" },
  { icon: "🔧", content: { en: { title: "Degree Apprenticeships — Free Degree", desc: "Full Bachelor's or Master's, £0 tuition, salary £18K–£30K. Engineering, software, management." } }, url: "https://www.findapprenticeship.service.gov.uk/" },
  { icon: "💷", content: { en: { title: "Jobcentre Hidden Funding", desc: "Ask Work Coach: Flexible Support Fund (up to £300), SWAPs (free training + interview), Restart Scheme." } }, url: "https://www.gov.uk/government/publications/sector-based-work-academies-employer-guide" },
  { icon: "🏦", content: { en: { title: "RefuAid — £10K Interest-Free Loans", desc: "Professional requalification: exam fees, registration, training. No UK credit history needed." } }, url: "https://www.refuaid.org/" },
  { icon: "⚖️", content: { en: { title: "Free Legal Advice", desc: "Legal Aid covers most refugee cases. Law Centres Network, Asylum Aid, Citizens Advice. NEVER pay unregistered consultants." } }, url: "https://www.lawcentres.org.uk/" },
  { icon: "🪪", content: { en: { title: "CitizenCard — £15 Photo ID", desc: "Government-backed PASS photo ID. Accepted almost everywhere. No passport needed." } }, url: "https://www.citizencard.com" },
  { icon: "📱", content: { en: { title: "Free 40GB SIM — National Databank", desc: "Vodafone donates 40GB/month + calls for 6 months. O2 gives 25GB. Ask at any library or O2 store." } }, url: "https://www.goodthingsfoundation.org/our-services/national-databank" },
  { icon: "🚌", content: { en: { title: "16-25 Railcard — 1/3 Off Trains", desc: "£30/year. Works on London Oyster too. Average saving £145/year. Also 26-30 Railcard available." } }, url: "https://www.16-25railcard.co.uk" },
  { icon: "🏠", content: { en: { title: "Warm Home Discount — £150 Free", desc: "£150 off electricity bill. Automatic on Pension Credit. Others: contact your energy supplier." } }, url: "https://www.gov.uk/the-warm-home-discount-scheme" },
  { icon: "💻", content: { en: { title: "Free Laptops & Devices", desc: "Good Things Foundation National Device Bank. Available through libraries and community organisations." } }, url: "https://www.goodthingsfoundation.org/our-services/national-device-bank" },
  { icon: "🏛", content: { en: { title: "Free Museums & Days Out", desc: "British Museum, Natural History, Tate Modern, V&A — all FREE. Hundreds of free parks and festivals." } }, url: "https://www.museumsassociation.org/campaigns/free-museums/" },
  { icon: "🛒", content: { en: { title: "Amazon Prime Half Price on UC", desc: "£4.49/month instead of £8.99 if on UC, JSA, or ESA. Free delivery + Prime Video." } }, url: "https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=G34EUPKVMYFW8N2U" },
  { icon: "🏅", content: { en: { title: "ILR is FREE for Refugees — Save £2,885", desc: "Refugees use form SET(P) which has no application fee. Everyone else pays £2,885. Apply after 5 years — this is one of the biggest financial benefits of refugee status." } }, url: "https://www.gov.uk/settle-in-the-uk/y/you-have-refugee-status-or-humanitarian-protection" },
  { icon: "⚖️", content: { en: { title: "Unity Project — Remove NRPF Conditions", desc: "78% success rate removing No Recourse to Public Funds conditions. Free specialist help. If your eVisa says NRPF and your situation has changed (illness, abuse, destitution), apply to have it removed." } }, url: "https://unity-project.org.uk" },
  { icon: "🏠", content: { en: { title: "Permanent Local Connection Right", desc: "You have an irrevocable local connection to the council area where your refugee decision was made. This right can NEVER be lost — critical for social housing applications even if you move cities temporarily." } }, url: "https://www.shelter.org.uk/housing_advice/homelessness/rules/local_connection" },
  { icon: "📂", content: { en: { title: "Subject Access Request — Get Your Home Office Records", desc: "Request all personal data the Home Office holds about you — free, within 1 month. Covers immigration history since 2000, all applications, decisions, and interview records. Useful if you've lost documents." } }, url: "https://www.gov.uk/government/organisations/home-office/about/personal-information-charter" },
  { icon: "🏡", content: { en: { title: "Refugees at Home — Free Spare Room Hosting", desc: "UK volunteers offer free spare rooms to refugees. Matching service — verified hosts across England, Scotland, and Wales. Perfect during the move-on period or while you find permanent housing." } }, url: "https://www.refugeesathome.org" },
  { icon: "💼", content: { en: { title: "Breaking Barriers — Reaccreditation Programme", desc: "Free professional reaccreditation for engineers, doctors, lawyers, teachers, accountants. Career assessment, mentoring by professionals in your field, and liaison with UK regulatory bodies. London, Birmingham, Manchester, Glasgow." } }, url: "https://breaking-barriers.co.uk/refugee-support/reaccreditation/" },
  { icon: "👪", content: { en: { title: "RefuAid — Family Reunion Loans", desc: "Zero-interest loans to cover family reunion legal fees and travel costs. Also housing deposit loans. Accessed via partner referrals — ask your Refugee Council caseworker or Breaking Barriers adviser." } }, url: "https://www.refuaid.org" },
];

// ─── EMERGENCY ───────────────────────────────────────────────────
export const SOS_NUMBERS = [
  { name: "Emergency", num: "999", phone: "999", note: "Police / Fire / Ambulance" },
  { name: "NHS 111", num: "111", phone: "111", note: "Urgent medical advice · 24/7" },
  { name: "Samaritans", num: "116 123", phone: "116123", note: "Mental health crisis · 24/7" },
  { name: "Modern Slavery", num: "0800 0121 700", phone: "08000121700", note: "24/7 · Anonymous" },
  { name: "Domestic Abuse", num: "0808 2000 247", phone: "08082000247", note: "24/7 · All languages" },
  { name: "Migrant Help", num: "0808 801 0503", phone: "08088010503", note: "24/7 · Free" },
];

export const HELPLINES = [
  { name: "Refugee Council", num: "0808 196 7272", phone: "08081967272", hours: "Mon–Fri 9am–4pm" },
  { name: "Shelter", num: "0808 800 4444", phone: "08088004444", hours: "Mon–Fri 8am–8pm" },
  { name: "Universal Credit", num: "0800 328 5644", phone: "08003285644", hours: "Mon–Fri 8am–6pm" },
  { name: "Citizens Advice", num: "0800 144 8848", phone: "08001448848", hours: "Mon–Fri 9am–5pm" },
];

// ─── GitHub ──────────────────────────────────────────────────────
export const GITHUB_URL = 'https://github.com/na7hanw/new-life-uk';
