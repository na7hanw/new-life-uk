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
    pay: "£12.71–£14/hr",
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