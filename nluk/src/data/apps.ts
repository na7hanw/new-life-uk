import type { SaveItem } from '../types'

/**
 * Essential apps every new arrival in the UK should install or bookmark.
 * Linked list displayed on the AppsPage (/saves/apps).
 */
export const APPS: SaveItem[] = [
  {
    icon: "💊",
    content: { en: { title: "NHS App", desc: "Book GP appointments, order repeat prescriptions, and view your health records. Free on iOS and Android. Download on your first day — you will use it regularly." } },
    url: "https://www.nhs.uk/nhs-app/",
  },
  {
    icon: "🏦",
    content: { en: { title: "Monzo — Free Bank Account", desc: "Open a free UK bank account in minutes using just your eVisa share code and a selfie. No credit checks. Instant account number and sort code for receiving benefits, wages, and paying bills." } },
    url: "https://monzo.com",
  },
  {
    icon: "💳",
    content: { en: { title: "Revolut — Free Bank Account", desc: "Another free UK bank account popular with new arrivals. Open with your eVisa share code and a selfie. Also supports international money transfers at competitive rates." } },
    url: "https://www.revolut.com",
  },
  {
    icon: "💰",
    content: { en: { title: "Universal Credit — Manage Your Claim", desc: "Manage your UC claim via the GOV.UK website: submit journal entries, book Jobcentre appointments, check payment dates, and report changes. Works on any phone browser — bookmark it for easy access." } },
    url: "https://www.gov.uk/sign-in-universal-credit",
  },
  {
    icon: "🆔",
    content: { en: { title: "UKVI — Check Your Immigration Status", desc: "View and share your digital immigration status (eVisa). Generate a share code to prove your right to work, rent, or access services. No physical document needed." } },
    url: "https://www.gov.uk/view-prove-immigration-status",
  },
  {
    icon: "🗺️",
    content: { en: { title: "Citymapper — Public Transport", desc: "Best navigation app for UK buses, tubes, trains, cycling, and walking. Shows real-time delays. Works in London, Manchester, Birmingham, Leeds, Glasgow and 50+ UK cities." } },
    url: "https://citymapper.com",
  },
  {
    icon: "🚂",
    content: { en: { title: "Trainline — Cheap Train Tickets", desc: "Find and buy the cheapest train and coach tickets across the UK. Book Advance tickets up to 12 weeks ahead for up to 70% off. Also covers National Express coaches." } },
    url: "https://www.thetrainline.com",
  },
  {
    icon: "💼",
    content: { en: { title: "Indeed — Job Search", desc: "The UK's most-used job board. Search by job type, location, and salary. Upload your CV and apply in one tap. Set job alerts to receive new matches by email. Completely free." } },
    url: "https://uk.indeed.com",
  },
  {
    icon: "🔗",
    content: { en: { title: "LinkedIn — Professional Network", desc: "Build your professional profile, connect with people in your field, and apply for jobs directly. Many UK employers search LinkedIn before hiring. Free basic account." } },
    url: "https://www.linkedin.com",
  },
  {
    icon: "🏠",
    content: { en: { title: "Rightmove — Find Housing", desc: "Search rental properties across the UK. Filter by price, number of bedrooms, and distance to work. Set instant alerts for new listings in your price range." } },
    url: "https://www.rightmove.co.uk",
  },
  {
    icon: "🌐",
    content: { en: { title: "Google Translate", desc: "Translate text, speech, photos, and live camera in 100+ languages. Download offline language packs for use without internet. Useful for understanding letters and official documents." } },
    url: "https://translate.google.com",
  },
  {
    icon: "📚",
    content: { en: { title: "Duolingo — Learn English Free", desc: "Free English lessons in just 5–15 minutes per day. Game-like format keeps you motivated. One of the fastest ways to improve your everyday English. Available on iOS and Android." } },
    url: "https://www.duolingo.com",
  },
  {
    icon: "⚖️",
    content: { en: { title: "Citizens Advice", desc: "Free advice on benefits, housing, work rights, debt, and legal issues. Find your nearest Citizens Advice bureau or use the online chat. Completely free and confidential." } },
    url: "https://www.citizensadvice.org.uk",
  },
  {
    icon: "🍎",
    content: { en: { title: "Olio — Free Food & Items", desc: "Neighbours share surplus food, furniture, and household items for free. Great for furnishing a new home on a tight budget. Also lists free food from cafés and supermarkets." } },
    url: "https://olioapp.com",
  },
  {
    icon: "📞",
    content: { en: { title: "NHS 111 Online — Urgent Health Advice", desc: "Get urgent (non-emergency) medical advice 24/7. The website asks you questions and tells you exactly what to do next. Faster than A&E for minor problems. Also call 111 free." } },
    url: "https://111.nhs.uk",
  },
]
