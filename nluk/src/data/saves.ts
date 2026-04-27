import type { SaveItem } from '../types'

// ─── SAVES (Free Stuff) ─────────────────────────────────────────
export const SAVES: SaveItem[] = [
  {
    icon: '📱',
    cat: 'Connectivity',
    content: {
      en: {
        title: 'Free SIM Card — 40GB/month',
        desc: 'National Databank: free Vodafone SIM with 40GB data + unlimited calls/texts per month for 6 months. Or O2: 25GB. Available to anyone on low income. No ID checks. Ask at your local library, O2 store, or charity.',
      },
    },
    url: 'https://www.goodthingsfoundation.org/our-services/national-databank',
  },
  {
    icon: '💻',
    cat: 'Connectivity',
    content: {
      en: {
        title: 'Free Laptop or Tablet',
        desc: "Good Things Foundation's National Device Bank distributes free devices through libraries and charities. Ask your Refugee Council caseworker or local library.",
      },
    },
    url: 'https://www.goodthingsfoundation.org/our-services/national-device-bank',
  },
  {
    icon: '💊',
    cat: 'Health',
    guideId: 'gp',
    content: {
      en: {
        title: 'Free Prescriptions',
        desc: 'If you receive UC, Income Support, ESA, or Pension Credit — all NHS prescriptions are FREE. Pregnant women and new mothers also qualify. Get an HC2 certificate if on low income.',
      },
    },
    url: 'https://www.nhs.uk/nhs-services/help-with-health-costs/',
  },
  {
    icon: '🚌',
    cat: 'Transport',
    guideId: 'travel',
    content: {
      en: {
        title: 'Transport Discounts & Railcards',
        desc: '16-25 Railcard: £30/year saves 1/3 on all trains. Works on London Oyster too. 26-30 Railcard also available. National Express Coachcard: £15/year for 1/3 off coaches.',
      },
    },
    url: 'https://www.16-25railcard.co.uk',
  },
  {
    icon: '🚗',
    cat: 'Transport',
    content: {
      en: {
        title: 'Jobcentre Transport Fund',
        desc: 'Your Work Coach can pay for bus/train fares to job interviews and contribute to driving lessons. Ask about the Flexible Support Fund — up to £300 for job-related transport.',
      },
    },
    url: 'https://www.gov.uk/guidance/flexible-support-fund',
  },
  {
    icon: '🔥',
    cat: 'Money',
    guideId: 'uc',
    content: {
      en: {
        title: 'Warm Home Discount — £150 off Electricity',
        desc: 'On UC, Pension Credit, or low income? You may get £150 off your electricity bill automatically each winter. Contact your energy supplier to check.',
      },
    },
    url: 'https://www.gov.uk/the-warm-home-discount-scheme',
  },
  {
    icon: '🏠',
    cat: 'Money',
    guideId: 'housing-help',
    content: {
      en: {
        title: 'Council Tax Reduction — Up to 100% Off',
        desc: 'On UC or low income? Apply to your local council for Council Tax Reduction. Many refugees get 100% — meaning zero council tax.',
      },
    },
    url: 'https://www.gov.uk/council-tax-reduction',
  },
  {
    icon: '🍼',
    cat: 'Health',
    guideId: 'gp',
    content: {
      en: {
        title: 'Healthy Start Vouchers',
        desc: 'Pregnant or have children under 4? On UC, you get free vouchers: £4.25/week per child under 1, £8.50/week if pregnant. Spend on milk, fruit, vegetables.',
      },
    },
    url: 'https://www.healthystart.nhs.uk',
  },
  {
    icon: '👶',
    cat: 'Family',
    guideId: 'uc',
    content: {
      en: {
        title: 'Sure Start Maternity Grant — £500',
        desc: 'One-off £500 payment for your first child if on UC or Pension Credit. Claim within 11 weeks of due date or 6 months after birth. Not repayable.',
      },
    },
    url: 'https://www.gov.uk/sure-start-maternity-grant',
  },
  {
    icon: '🍽',
    cat: 'Food',
    guideId: 'housing-help',
    content: {
      en: {
        title: 'Food Banks — Free Food Parcels',
        desc: 'Trussell Trust runs 1,400+ food banks. Usually need a referral from GP, Jobcentre, or Citizens Advice — but many accept walk-ins. Free emergency food for 3 days.',
      },
    },
    url: 'https://www.trusselltrust.org/get-help/find-a-foodbank/',
  },
  {
    icon: '👕',
    cat: 'Family',
    guideId: 'schools',
    content: {
      en: {
        title: 'Free School Uniforms',
        desc: "Most councils and many schools have free uniform schemes. Some councils give £100+ grants. Check with your child's school or local council.",
      },
    },
    url: 'https://www.gov.uk/help-school-clothing-costs',
  },
  {
    icon: '🏛',
    cat: 'Culture',
    content: {
      en: {
        title: 'Free Museums & Galleries',
        desc: 'British Museum, Natural History Museum, Science Museum, National Gallery, Tate Modern, V&A — all FREE. Great free days out for families.',
      },
    },
    url: 'https://www.museumsassociation.org/campaigns/free-museums/',
  },
  {
    icon: '📚',
    cat: 'Culture',
    content: {
      en: {
        title: 'Library Card — Free Everything',
        desc: "Free books, internet, Wi-Fi, computer access, printing, events, language cafés, children's activities. Some libraries lend museum passes. Just show proof of address.",
      },
    },
    url: 'https://www.gov.uk/local-library-services',
  },
  {
    icon: '🎓',
    cat: 'Education',
    guideId: 'esol-education',
    content: {
      en: {
        title: 'Free English (ESOL) Classes',
        desc: 'ESOL classes at FE colleges are completely free if you receive UC or certain benefits. The fastest way to improve your English.',
      },
    },
    url: 'https://www.gov.uk/improve-english-maths-it-skills',
  },
  {
    icon: '💰',
    cat: 'Money',
    guideId: 'uc',
    content: {
      en: {
        title: 'Budgeting Advance — Up to £812',
        desc: 'Need money for furniture, clothes, or moving costs? Apply via your UC journal. Interest-free. Repaid slowly from UC payments. Must be on UC for 6+ months.',
      },
    },
    url: 'https://www.gov.uk/universal-credit/other-help',
  },
  {
    icon: '🛒',
    cat: 'Money',
    guideId: 'uc',
    content: {
      en: {
        title: 'Amazon Prime — Half Price on UC',
        desc: '£4.49/month instead of £8.99 if you receive UC, JSA, ESA, or Pension Credit. Includes free delivery and Prime Video.',
      },
    },
    url: 'https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=G34EUPKVMYFW8N2U',
  },
  {
    icon: '🚲',
    cat: 'Transport',
    guideId: 'travel',
    content: {
      en: {
        title: 'The Bike Project — Free Bicycle',
        desc: 'If you are an asylum seeker or refugee, The Bike Project will give you a free refurbished bicycle, helmet, and lights. This saves hundreds of pounds in bus fares. Register on their website and join the waiting list. Operates in London, Brighton, Bristol, Birmingham, and Sheffield.',
      },
    },
    url: 'https://thebikeproject.co.uk',
  },
  {
    icon: '👔',
    cat: 'Employment',
    guideId: 'work-rights',
    content: {
      en: {
        title: 'Free Interview Clothes & Suits',
        desc: 'Got a job interview? Charities give you a free professional outfit to keep, plus interview coaching. Women: Smart Works (London, Birmingham, Manchester, Leeds, Edinburgh, Glasgow, Newcastle). Men: Suited & Booted (London) or Working Wardrobe. Call before you go.',
      },
    },
    url: 'https://smartworks.org.uk',
  },
  {
    icon: '💧',
    cat: 'Money',
    guideId: 'uc',
    content: {
      en: {
        title: 'Water Bill Caps — WaterSure & Social Tariffs',
        desc: "Water bills can be very expensive. If you are on Universal Credit, contact your water provider and ask to be put on their 'Social Tariff' or the WaterSure scheme. This can cut your water bill by up to 90%. Every water company offers this but few tell new customers.",
      },
    },
    url: 'https://www.ccwater.org.uk/households/help-with-my-bills/',
  },
]

// ─── GEMS (Hidden Gems — unique items not already in SAVES) ──────
export const GEMS: SaveItem[] = [
  {
    icon: '🎓',
    cat: 'Education',
    guideId: 're-qualify',
    content: {
      en: {
        title: 'Your Foreign Degree IS Valid',
        desc: 'UK ENIC: £49 Statement of Comparability. Refugees with missing docs: refugee@ecctis.com.',
      },
    },
    url: 'https://www.enic.org.uk/Qualifications/SOC/Default.aspx',
  },
  {
    icon: '💎',
    cat: 'Employment',
    guideId: 'work-rights',
    content: {
      en: {
        title: 'Breaking Barriers — Free Career Help',
        desc: "UK's leading refugee employment charity. Free CV, interview coaching, employer introductions. London, Birmingham, Manchester, Glasgow.",
      },
    },
    url: 'https://breaking-barriers.co.uk/',
  },
  {
    icon: '🚀',
    cat: 'Employment',
    guideId: 'work-rights',
    content: {
      en: {
        title: 'Skills Bootcamps — 16 Weeks Free',
        desc: 'Government training in shortage sectors. Guaranteed employer interview. 19+ with right to work.',
      },
    },
    url: 'https://www.gov.uk/guidance/find-a-skills-bootcamp',
  },
  {
    icon: '🎓',
    cat: 'Education',
    guideId: 're-qualify',
    content: {
      en: {
        title: '80+ University Scholarships',
        desc: "Sanctuary scholarships at Edinburgh, Warwick, Bristol, UCL, King's + 80 more. Many cover full tuition + living.",
      },
    },
    url: 'https://star-network.org.uk/access-to-university/scholarships/list/',
  },
  {
    icon: '🔧',
    cat: 'Education',
    guideId: 're-qualify',
    content: {
      en: {
        title: 'Degree Apprenticeships — Free Degree',
        desc: "Full Bachelor's or Master's, £0 tuition, salary £18K–£30K. Engineering, software, management.",
      },
    },
    url: 'https://www.findapprenticeship.service.gov.uk/',
  },
  {
    icon: '💷',
    cat: 'Money',
    guideId: 'uc',
    content: {
      en: {
        title: 'Jobcentre Hidden Funding',
        desc: 'Ask Work Coach: Flexible Support Fund (up to £300), SWAPs (free training + interview), Restart Scheme.',
      },
    },
    url: 'https://www.gov.uk/government/publications/sector-based-work-academies-employer-guide',
  },
  {
    icon: '🏦',
    cat: 'Money',
    guideId: 'bank',
    content: {
      en: {
        title: 'RefuAid — £10K Interest-Free Loans',
        desc: 'Professional requalification: exam fees, registration, training. No UK credit history needed.',
      },
    },
    url: 'https://www.refuaid.org/',
  },
  {
    icon: '⚖️',
    cat: 'Legal',
    guideId: 'legal-help',
    content: {
      en: {
        title: 'Free Legal Advice',
        desc: 'Legal Aid covers most refugee cases. Law Centres Network, Asylum Aid, Citizens Advice. NEVER pay unregistered consultants.',
      },
    },
    url: 'https://www.lawcentres.org.uk/',
  },
  {
    icon: '🪪',
    cat: 'Documents',
    guideId: 'evisa',
    content: {
      en: {
        title: 'CitizenCard — £15 Photo ID',
        desc: 'Government-backed PASS photo ID. Accepted almost everywhere. No passport needed.',
      },
    },
    url: 'https://www.citizencard.com',
  },
  {
    icon: '🏡',
    cat: 'Housing',
    guideId: 'housing-help',
    content: {
      en: {
        title: 'Refugees at Home — Free Spare Room Hosting',
        desc: 'UK volunteers offer free spare rooms to refugees. Matching service — verified hosts across England, Scotland, and Wales. Perfect during the move-on period or while you find permanent housing.',
      },
    },
    url: 'https://www.refugeesathome.org',
  },
  {
    icon: '💼',
    cat: 'Employment',
    guideId: 're-qualify',
    content: {
      en: {
        title: 'Breaking Barriers — Reaccreditation Programme',
        desc: 'Free professional reaccreditation for engineers, doctors, lawyers, teachers, accountants. Career assessment, mentoring by professionals in your field, and liaison with UK regulatory bodies. London, Birmingham, Manchester, Glasgow.',
      },
    },
    url: 'https://breaking-barriers.co.uk/refugee-support/reaccreditation/',
  },
  {
    icon: '👪',
    cat: 'Money',
    guideId: 'housing-help',
    content: {
      en: {
        title: 'RefuAid — Family Reunion Loans',
        desc: 'Zero-interest loans to cover family reunion legal fees and travel costs. Also housing deposit loans. Accessed via partner referrals — ask your Refugee Council caseworker or Breaking Barriers adviser.',
      },
    },
    url: 'https://www.refuaid.org',
  },
  {
    icon: '📞',
    cat: 'Support',
    guideId: 'asylum-waiting',
    content: {
      en: {
        title: 'Migrant Help Helpline — 0808 8010 503',
        desc: 'Free, confidential advice for asylum seekers on accommodation, asylum support, and the asylum process. Government-contracted first point of contact — available 24/7. Free to call from any UK phone.',
      },
    },
    url: 'https://www.migranthelpuk.org/pages/asylum-helpline',
  },
  {
    icon: '🌐',
    cat: 'Support',
    guideId: 'asylum-waiting',
    content: {
      en: {
        title: 'Asylum Help — Online Portal (Migrant Help)',
        desc: 'Migrant Help also runs the Asylum Help online portal at migranthelpuk.org — same free advice on accommodation and support payments. Use the portal to submit queries or call 0808 8010 503.',
      },
    },
    url: 'https://www.migranthelpuk.org',
  },
  {
    icon: '🔴',
    cat: 'Support',
    guideId: 'move-on',
    content: {
      en: {
        title: 'British Red Cross Refugee Services',
        desc: 'Free support including family tracing, destitution emergency payments, orientation on life in the UK, and first aid training. Local branches nationwide — find your nearest at redcross.org.uk.',
      },
    },
    url: 'https://www.redcross.org.uk/get-help/get-help-as-a-refugee',
  },
  {
    icon: '🤝',
    cat: 'Support',
    guideId: 'legal-help',
    content: {
      en: {
        title: 'Refugee Action — Free Asylum Advice & ESOL',
        desc: 'Free specialist asylum legal advice and referrals to ESOL English classes. Offices in London, Manchester, Birmingham, Plymouth, Stoke-on-Trent, Leeds, and Leicester.',
      },
    },
    url: 'https://www.refugee-action.org.uk',
  },
  {
    icon: '🕊️',
    cat: 'Support',
    guideId: 'legal-help',
    content: {
      en: {
        title: 'Helen Bamber Foundation — Specialist Care',
        desc: 'Free specialist support for survivors of trafficking, torture, and extreme cruelty. Therapy, legal advice, and medical care. London-based with national reach — referral via your caseworker or GP.',
      },
    },
    url: 'https://helenbamber.org',
  },
  {
    icon: '👧',
    cat: 'Support',
    guideId: 'asylum-waiting',
    content: {
      en: {
        title: 'Refugee Council — Children & Young People',
        desc: 'Free specialist support if you have children or are under 25 — including unaccompanied children. Includes legal advice, social care referrals, and age-dispute support.',
      },
    },
    url: 'https://www.refugeecouncil.org.uk/our-work/children-young-people/',
  },
  {
    icon: '🎁',
    cat: 'Money',
    guideId: 'housing-help',
    content: {
      en: {
        title: 'Turn2Us — Free Grants Search',
        desc: 'When you move into a new home, it will likely be empty — no fridge, no cooker, no bed. Turn2Us is a huge database of charities and grants that give free cash for white goods, furniture, and household essentials. Search by your situation and postcode.',
      },
    },
    url: 'https://grants-search.turn2us.org.uk',
  },
  {
    icon: '📖',
    cat: 'Legal',
    guideId: 'legal-help',
    content: {
      en: {
        title: 'Right to Remain Toolkit',
        desc: 'The best free step-by-step guide to the UK asylum and immigration system in plain English. Explains every stage of the process, your legal rights, how to prepare for Home Office interviews, and how to appeal decisions.',
      },
    },
    url: 'https://righttoremain.org.uk/toolkit/',
  },
  {
    icon: '💻',
    cat: 'Connectivity',
    content: {
      en: {
        title: 'Solidaritech — Free Refurbished Tech',
        desc: 'A specialist charity that refurbishes donated laptops and smartphones and distributes them to asylum seekers and refugees at no cost. Hugely helpful for studying, job applications, legal cases, and keeping in touch with family.',
      },
    },
    url: 'https://solidaritech.com',
  },
]
