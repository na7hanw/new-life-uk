import type { SaveItem } from '../types'

/**
 * Essential apps every new arrival in the UK should install or bookmark.
 * Linked list displayed on the AppsPage (/saves/apps).
 */
export const APPS: SaveItem[] = [
  // ─── Health ───────────────────────────────────────────────────
  {
    icon: "💊",
    cat: "Health",
    content: { en: { title: "NHS App", desc: "Book GP appointments, order repeat prescriptions, and view your health records. Free on iOS and Android. Download on your first day — you will use it regularly." } },
    url: "https://www.nhs.uk/nhs-app/",
  },
  {
    icon: "📞",
    cat: "Health",
    content: { en: { title: "NHS 111 Online — Urgent Health Advice", desc: "Get urgent (non-emergency) medical advice 24/7. The website asks you questions and tells you exactly what to do next. Faster than A&E for minor problems. Also call 111 free." } },
    url: "https://111.nhs.uk",
  },
  // ─── Finance ──────────────────────────────────────────────────
  {
    icon: "🏦",
    cat: "Finance",
    content: { en: { title: "Monzo — Free Bank Account", desc: "Open a free UK bank account in minutes using just your eVisa share code and a selfie. No credit checks. Instant account number and sort code for receiving benefits, wages, and paying bills." } },
    url: "https://monzo.com",
  },
  {
    icon: "💳",
    cat: "Finance",
    content: { en: { title: "Revolut — Free Bank Account", desc: "Another free UK bank account popular with new arrivals. Open with your eVisa share code and a selfie. Also supports international money transfers at competitive rates." } },
    url: "https://www.revolut.com",
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
  },
  // ─── Immigration ──────────────────────────────────────────────
  {
    icon: "🆔",
    cat: "Immigration",
    content: { en: { title: "UKVI — Check Your Immigration Status", desc: "View and share your digital immigration status (eVisa). Generate a share code to prove your right to work, rent, or access services. No physical document needed." } },
    url: "https://www.gov.uk/view-prove-immigration-status",
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
  },
  {
    icon: "🔗",
    cat: "Jobs",
    content: { en: { title: "LinkedIn — Professional Network", desc: "Build your professional profile, connect with people in your field, and apply for jobs directly. Many UK employers search LinkedIn before hiring. Free basic account." } },
    url: "https://www.linkedin.com",
  },
  {
    icon: "📋",
    cat: "Jobs",
    content: { en: { title: "Reed — Job Search", desc: "One of the UK's largest job boards covering all industries and skill levels. Particularly strong for admin, healthcare, and social care roles. Search by location, salary, and contract type. Free to use and apply." } },
    url: "https://www.reed.co.uk",
  },
  {
    icon: "🎯",
    cat: "Jobs",
    content: { en: { title: "TotalJobs — Job Search", desc: "Major UK job board with strong coverage of engineering, construction, and professional services. Good for people with overseas qualifications looking to re-enter their profession. Free to search, upload your CV, and apply." } },
    url: "https://www.totaljobs.com",
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
  },
  // ─── Community ────────────────────────────────────────────────
  {
    icon: "🍎",
    cat: "Community",
    content: { en: { title: "Olio — Free Food & Items", desc: "Neighbours share surplus food, furniture, and household items for free. Great for furnishing a new home on a tight budget. Also lists free food from cafés and supermarkets." } },
    url: "https://olioapp.com",
  },
]
