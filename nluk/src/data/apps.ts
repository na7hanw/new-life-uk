import type { SaveItem } from '../types'

/**
 * Essential apps every new arrival in the UK should install or bookmark.
 * Linked list displayed on the AppsPage (/saves/apps).
 */
export const APPS: SaveItem[] = [
  {
    icon: "💊",
    cat: "Health",
    content: { en: { title: "NHS App", desc: "Book GP appointments, order repeat prescriptions, and view your health records. Free on iOS and Android. Download on your first day — you will use it regularly." } },
    url: "https://www.nhs.uk/nhs-app/",
  },
  {
    icon: "🏦",
    cat: "Banking",
    content: { en: { title: "Monzo — Free Bank Account", desc: "Open a free UK bank account in minutes using just your eVisa share code and a selfie. No credit checks. Instant account number and sort code for receiving benefits, wages, and paying bills." } },
    url: "https://monzo.com",
  },
  {
    icon: "💳",
    cat: "Banking",
    content: { en: { title: "Revolut — Free Bank Account", desc: "Another free UK bank account popular with new arrivals. Open with your eVisa share code and a selfie. Also supports international money transfers at competitive rates." } },
    url: "https://www.revolut.com",
  },
  {
    icon: "💰",
    cat: "Benefits",
    content: { en: { title: "Universal Credit — Manage Your Claim", desc: "Manage your UC claim via the GOV.UK website: submit journal entries, book Jobcentre appointments, check payment dates, and report changes. Works on any phone browser — bookmark it for easy access." } },
    url: "https://www.gov.uk/sign-in-universal-credit",
  },
  {
    icon: "🆔",
    cat: "Immigration",
    content: { en: { title: "UKVI — Check Your Immigration Status", desc: "View and share your digital immigration status (eVisa). Generate a share code to prove your right to work, rent, or access services. No physical document needed." } },
    url: "https://www.gov.uk/view-prove-immigration-status",
  },
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
    icon: "💼",
    cat: "Jobs",
    content: { en: { title: "Indeed — Job Search", desc: "The UK's most-used job board. Search by job type, location, and salary. Upload your CV and apply in one tap. Set job alerts to receive new matches by email. Completely free." } },
    url: "https://uk.indeed.com",
  },
  {
    icon: "🔗",
    cat: "Jobs",
    content: { en: { title: "LinkedIn — Professional Network", desc: "Build your professional profile, connect with people in your field, and apply for jobs directly. Many UK employers search LinkedIn before hiring. Free basic account." } },
    url: "https://www.linkedin.com",
  },
  {
    icon: "🏠",
    cat: "Housing",
    content: { en: { title: "Rightmove — Find Housing", desc: "Search rental properties across the UK. Filter by price, number of bedrooms, and distance to work. Set instant alerts for new listings in your price range." } },
    url: "https://www.rightmove.co.uk",
  },
  {
    icon: "🌐",
    cat: "Learning",
    content: { en: { title: "Google Translate", desc: "Translate text, speech, photos, and live camera in 100+ languages. Download offline language packs for use without internet. Useful for understanding letters and official documents." } },
    url: "https://translate.google.com",
  },
  {
    icon: "📚",
    cat: "Learning",
    content: { en: { title: "Duolingo — Learn English Free", desc: "Free English lessons in just 5–15 minutes per day. Game-like format keeps you motivated. One of the fastest ways to improve your everyday English. Available on iOS and Android." } },
    url: "https://www.duolingo.com",
  },
  {
    icon: "⚖️",
    cat: "Advice",
    content: { en: { title: "Citizens Advice", desc: "Free advice on benefits, housing, work rights, debt, and legal issues. Find your nearest Citizens Advice bureau or use the online chat. Completely free and confidential." } },
    url: "https://www.citizensadvice.org.uk",
  },
  {
    icon: "🍎",
    cat: "Community",
    content: { en: { title: "Olio — Free Food & Items", desc: "Neighbours share surplus food, furniture, and household items for free. Great for furnishing a new home on a tight budget. Also lists free food from cafés and supermarkets." } },
    url: "https://olioapp.com",
  },
  {
    icon: "📞",
    cat: "Health",
    content: { en: { title: "NHS 111 Online — Urgent Health Advice", desc: "Get urgent (non-emergency) medical advice 24/7. The website asks you questions and tells you exactly what to do next. Faster than A&E for minor problems. Also call 111 free." } },
    url: "https://111.nhs.uk",
  },
  {
    icon: "💬",
    cat: "Community",
    content: { en: { title: "WhatsApp — Free International Calls & Messaging", desc: "Free voice and video calls, messaging, and file sharing with anyone worldwide over Wi-Fi or mobile data. The primary way most diaspora communities stay connected with family back home. Available on iOS and Android." } },
    url: "https://www.whatsapp.com",
  },
  {
    icon: "💸",
    cat: "Transfer",
    content: { en: { title: "Remitly — Send Money Home", desc: "Send money to Ethiopia, Eritrea, Somalia, and 100+ countries — often at better exchange rates than banks. Delivered within minutes to a bank account or mobile money (CBE Birr, Telebirr). First transfer free. Fees from £1.99." } },
    url: "https://www.remitly.com",
  },
  {
    icon: "🛏️",
    cat: "Housing",
    content: { en: { title: "SpareRoom — Find a Room", desc: "The UK's largest room and flatmate finder. Sharing a house or flat is often the only affordable option in London and major cities — far cheaper than renting alone. Free to browse listings and message landlords." } },
    url: "https://www.spareroom.co.uk",
  },
  {
    icon: "📋",
    cat: "Jobs",
    content: { en: { title: "Reed — Professional & Graduate Jobs", desc: "One of the UK's most trusted job boards for office, graduate, engineering, and professional roles. Particularly strong for civil engineering, construction, finance, and management positions. Free to create a profile and apply." } },
    url: "https://www.reed.co.uk",
  },
  {
    icon: "📻",
    cat: "Learning",
    content: { en: { title: "BBC Learning English — Free Professional English", desc: "BBC-quality English lessons for adult learners. Includes professional vocabulary, pronunciation, business English, and British idioms. Trusted globally. Free, no registration needed — works in any browser." } },
    url: "https://www.bbc.co.uk/learningenglish",
  },
  {
    icon: "🎥",
    cat: "Work",
    content: { en: { title: "Microsoft Teams — Workplace Communication", desc: "The standard communication tool used by most UK employers for video meetings, messaging, and file sharing. Install it before your first job interview — many employers run remote interviews and onboarding entirely via Teams. Free for personal use." } },
    url: "https://www.microsoft.com/en-gb/microsoft-teams/download-app",
  },
  {
    icon: "🚗",
    cat: "Transport",
    content: { en: { title: "AutoTrader — Buy & Sell Cars", desc: "The UK's largest used car marketplace. Search by make, model, price, location, and mileage. View full MOT history and dealer reviews. Also lists private sellers. Set alerts for specific models. Free to browse." } },
    url: "https://www.autotrader.co.uk",
  },
  {
    icon: "🛵",
    cat: "Transport",
    content: { en: { title: "Lime — E-Bikes & E-Scooters to Hire", desc: "Hire dockless electric bikes and rental e-scooters in your city. E-bikes need no licence. Rental e-scooters require a provisional or full driving licence in participating UK cities. Typically £1–£2 to unlock + £0.15–£0.20/min. Download the app and add a payment card to start." } },
    url: "https://www.li.me",
  },
  {
    icon: "🔍",
    cat: "Transport",
    content: { en: { title: "MoneySuperMarket — Compare Car Insurance", desc: "Compare hundreds of UK car insurance quotes in minutes. As a new UK driver or new resident you will be quoted high — always compare. Adding an experienced named driver to your policy can cut premiums by 30–50%. Also compares van, motorbike, and learner driver insurance." } },
    url: "https://www.moneysupermarket.com/car-insurance/",
  },
]
