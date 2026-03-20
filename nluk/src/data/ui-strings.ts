import type { Lang, UiStrings } from '../types'

export const LANGS: Lang[] = [
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
  home: "Home", guides: "Guides", work: "Work", saves: "Resources", more: "More", culture: "UK Life", profile: "Me",
  search: "Search guides…", noResults: "No results found.", searchWork: "Search jobs, certs, careers…",
  cost: "Cost", time: "Time", bring: "What to bring", steps: "Steps", keyInfo: "Key Info",
  visaQ: "What's your visa situation?", forYou: "For You", quickActions: "Quick Actions", helplines: "Helplines",
  jobsTab: "Jobs", certsTab: "Certs", careerTab: "Careers",
  savesTitle: "Free Resources", savesSub: "Things most new arrivals never find out about.",
  appsTab: "📲 Apps", discoverFreeTab: "🆓 Free", discoverGemsTab: "💎 Gems",
  searchDiscover: "Search resources…",
  heroTitle: "Welcome to\nyour new life. 🤝",
  heroSub: "Step-by-step guides for everything you need in the UK. No tracking. No cost. Ever.",
  heroBadge: "🇬🇧 Free · Private · No account needed",
  brpNotice: "⚠ BRPs expired December 2024. Your immigration status is now digital. Set up your eVisa at GOV.UK before travelling.",
  notFoundTitle: "Page not found",
  notFoundSub: "The page you're looking for doesn't exist.",
  notFoundHome: "Go back home",
  appsTitle: "Essential Apps & Services 📲", appsSub: "Free must-have apps and services for life in the UK.",
  gemsTitle: "Hidden Gems 💎", gemsSub: "Free money, career shortcuts, insider routes.",
  cultureTitle: "🇬🇧 UK Life & Hacks", cultureSub: "Survival hacks, money tricks, and the unwritten rules of life in the UK.",
  searchCulture: "Search tips & hacks…", copyTip: "Copy tip",
  settingsSub: "App preferences, language, and privacy.",
  theme: "Theme", language: "Language", apply: "Apply", freeRoute: "Free route available",
  darkMode: "🌙 Dark", lightMode: "☀️ Light", settings: "Settings",
  share: "Share", shareWhatsapp: "WhatsApp", shareTelegram: "Telegram", shareFacebook: "Facebook", shareCopy: "Copy link",
  copied: "Copied!",
  qaEvisa: "eVisa", qaShare: "Share Code", qaBank: "Bank", qaGP: "GP / NHS", qaBenefits: "Benefits", qaID: "ID Card", qaTravel: "Travel Doc", qaSafety: "Safety",
  status: { refugee: "Refugee", skilled: "Skilled Worker", family: "Family Visa", eu: "EU Settled", student: "Student", other: "Other" },
  statusPickerTitle: "What's your situation in the UK?",
  statusPickerSub: "Optional — helps us show the most relevant guides first. No account needed.",
  statusAsylumSeeker: "⏳ Asylum seeker — waiting for my decision",
  statusRefugee: "✅ Recognised refugee",
  statusOtherVisa: "🛂 Another visa (Skilled Worker, Family, Student…)",
  statusSettled: "🇬🇧 Settled / Pre-Settled Status",
  statusSkip: "Skip for now",
  statusLabel: "My Situation",
  openLink: "Open link", studyLinks: "Study Resources", applyLinks: "Apply / Sign Up", sourceCode: "View Source on GitHub",
  docsNeeded: "What you'll need", jobsApplyTo: "Where to apply",
  privacy: "Privacy & Data", privacyTitle: "Your Privacy",
  privacyBody: "This app stores only your language preference and theme setting locally on your device. No personal data is ever collected, transmitted, or shared. No analytics. No cookies. No tracking. No servers. Fully GDPR compliant.",
  privacyLocal: "Stored locally on your device only:", privacyNone: "Nothing ever sent to any server.",
  gdprRights: "GDPR rights: right to access, rectify, erase. Clear your browser/app data at any time to remove all stored preferences.",
  disclaimer: "This is not legal advice and is not affiliated with the UK Government. For official information, visit GOV.UK or consult an OISC-registered immigration adviser.",
  // PR #11 — a11y
  ttsListen: "🔊 Listen", ttsStop: "⏹ Stop",
  skipToContent: "Skip to content", loading: "Loading…",
  // PR #14 — auto-translate + PWA
  autoTranslated: "🌐 Auto-translated", translating: "Translating…",
  installApp: "📲 Install App", installDone: "Installed!",
  langSuggest: "We detected your browser language:", langSuggestUse: "Use this language", langSuggestDismiss: "Keep English",
  // PR #23 — privacy / GDPR
  privacyKeyLang: "Language preference", privacyKeyTheme: "Dark / light mode",
  privacyKeyTab: "Last work tab viewed", privacyKeyConsent: "Your crash-report consent choice",
  privacyCrashTitle: "🐛 Anonymous crash reports",
  privacyCrashBody: "With your permission, the app sends anonymous error reports to Sentry when it crashes. No personal information is included. No session recordings.",
  privacyCrashOn: "✅ Crash reports: on", privacyCrashOff: "❌ Crash reports: off",
  privacyCrashEnable: "Turn on", privacyCrashDisable: "Turn off",
  privacyCrashSentry: "Sentry is an independent service. See",
  gdprRightsTitle: "⚖️ Your UK GDPR rights",
  gdprRightsBody: "Under UK GDPR you have the right to access, correct, and erase your data. Use the button below to delete all locally stored data at any time. To exercise rights over crash-report data held by Sentry, contact us at hello@newlifeuk.org. You also have the right to complain to the ICO at ico.org.uk.",
  gdprIco: "ICO — make a complaint →",
  privacyControllerTitle: "🏢 Data controller",
  privacyControllerBody: "New Life UK · hello@newlifeuk.org · Open-source, non-commercial project.",
  clearData: "Clear all app data",
  consentTitle: "A note on privacy",
  consentBody: "To help us fix bugs faster, this app can send anonymous crash reports to Sentry. No personal information is included. You can change this at any time in More → Privacy.",
  consentAccept: "✓ OK, that's fine",
  consentDecline: "No thanks",
  // UX improvements
  pullToRefresh: "Release to refresh",
  backToTop: "Back to top",
  bookmark: "Save guide",
  unbookmark: "Remove saved",
  bookmarksTitle: "📌 Saved Guides",
  bookmarksSub: "Your saved guides appear here.",
  onboardingSkip: "Skip",
  onboardingNext: "Next",
  onboardingDone: "Get started",
  readingProgress: "Reading progress",
  // Quick actions — housing and legal additions
  qaHousing: "Housing",
  qaLegal: "Legal Help",
  // My Checklist feature
  myChecklist: "My Progress",
  checklistIntro: "Track the key steps to settling in the UK.",
  // Profile / Me tab
  nextSteps: "⚡ Next Steps",
  relatedGuides: "Related Guides",
  settingsSub2: "Language, theme, privacy",
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
export const UI: Record<string, UiStrings> = {};
LANGS.forEach(({ code }) => {
  const ov = (UI_OVERRIDES as Record<string, Partial<UiStrings>>)[code] || {};
  UI[code] = { ...BASE_UI, ...ov, status: { ...BASE_UI.status, ...(ov.status || {}) } };
});

export const TIPS = {
  asylum: [
    "Volunteering is ALWAYS allowed — no permission from the Home Office needed.",
    "Waited 12+ months for a decision? You may be able to apply for Permission to Work.",
    "Rules expand from 26 March 2026 — this week — asylum seekers with degrees become eligible for a much wider range of graduate-level jobs.",
    "Register with a GP — free NHS care for everyone, regardless of immigration status.",
    "Your ARC card is your main ID while your claim is active. Keep it safe.",
    "Citizens Advice: 0800 144 8848 — free help with benefits, housing, and legal issues.",
    "Freedom from Torture: free mental health support — 020 7697 7777.",
    "Never pay anyone to check your case status — it is always free.",
  ],
  refugee: ["Register with a GP — no address or ID needed.", "Request a UC Advance on day one.", "Revolut, Monzo, Starling: open with share code + selfie.", "Download the NHS App for GP bookings.", "Move-on period is now 56 days.", "Apply for a CitizenCard (£15) — photo ID accepted everywhere.", "National Databank: free SIM with 40GB/month from Vodafone.", "ESOL classes free if you receive UC."],
  skilled: ["Your employer cannot hold your passport.", "60 days to find new sponsorship if you lose your job.", "Revolut, Monzo, Starling: open with share code.", "Download the NHS App.", "You can switch visa without leaving UK.", "16-25 Railcard: 1/3 off all train fares for £30/year.", "Save every payslip and P60 for ILR.", "Check eVisa expiry — extend 3 months early."],
  family: ["Check eVisa conditions — NRPF affects benefits.", "Domestic abuse victims can switch visa.", "Revolut, Monzo, Starling: share code + selfie.", "Download the NHS App.", "CitizenCard £15 for photo ID.", "Free prescriptions if on UC.", "Most family visas allow work — check eVisa.", "Citizens Advice: free immigration advice."],
  eu: ["EU Settled Status is digital — use share code.", "Pre-Settled expires — upgrade before deadline.", "EU Settled OUT of scope of 2025 white paper.", "Revolut, Monzo, Starling: share code + selfie.", "Download the NHS App.", "Your EU driving licence is valid in UK.", "the3million charity for Settled Status support.", "16-25 or 26-30 Railcard saves 1/3 on trains."],
  student: ["Graduate visa: 2 years (3 PhD) to work any job.", "Max 20hrs/week term time.", "Download the NHS App — free for students.", "Revolut or Monzo for student banking.", "TOTUM student card: discounts everywhere.", "Switch Student to Skilled Worker without leaving.", "CitizenCard £15 for cheap photo ID.", "Save financial records for future visa apps."],
  other: ["Check eVisa conditions — they define your rights.", "Migrant Help: 0808 801 0503 — free, 24/7.", "Revolut, Monzo, Starling: share code + selfie.", "Modern Slavery: 0800 0121 700 — 24/7.", "CitizenCard £15 for photo ID.", "National Databank: free SIM card.", "Never pay unregistered 'immigration consultants'.", "Citizens Advice: free help with everything."],
};
