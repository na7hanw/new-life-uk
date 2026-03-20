export interface CultureItem {
  emoji: string
  title: string
  body: string
}

export interface CultureSection {
  id: string
  emoji: string
  heading: string
  description?: string
  items: CultureItem[]
}

// ─── UK CULTURE DATA ─────────────────────────────────────────────
export const CULTURE: CultureSection[] = [
  {
    id: 'politeness',
    emoji: '💬',
    heading: 'Communication Style',
    description: 'British English is famously indirect. This guide translates what people actually mean when they say something polite.',
    items: [
      {
        emoji: '😶',
        title: '"I\'ll bear that in mind"',
        body: 'Translation: I will never think about this again. A polite brush-off for ideas or suggestions they have no intention of pursuing.',
      },
      {
        emoji: '🙂',
        title: '"Not bad"',
        body: 'Translation: Excellent! Outstanding work. "Not bad" is very high praise from a Brit. Don\'t be disappointed — they\'re impressed.',
      },
      {
        emoji: '🤔',
        title: '"That\'s quite interesting"',
        body: 'Translation: I disagree completely, or I\'m bored. If they say "very interesting", they probably think you\'re wrong.',
      },
      {
        emoji: '🍽️',
        title: '"You must come round for dinner sometime!"',
        body: 'Translation: A warm farewell — not an actual invitation. If it were real, they would give you a specific date.',
      },
      {
        emoji: '🙏',
        title: '"Sorry" (when you bump into them)',
        body: 'Translation: A reflex, not an admission of guilt. Brits apologise even when you walked into them. You are expected to also say sorry.',
      },
      {
        emoji: '🧐',
        title: '"Could you possibly...?"',
        body: 'Translation: Do this now. The word "possibly" does not mean optional — it is a polite instruction.',
      },
      {
        emoji: '😤',
        title: '"With respect..."',
        body: 'Translation: I think you are wrong, and I am about to explain why. Brace yourself.',
      },
      {
        emoji: '😠',
        title: '"It\'s absolutely fine, don\'t worry!"',
        body: 'Translation: It is not fine. They are very much not fine. The more "absolutely" is stressed, the worse things are.',
      },
      {
        emoji: '👋',
        title: '"We should do this again!"',
        body: 'Translation: Usually genuine — they enjoyed themselves. But without a specific plan being made on the spot, the chances of a repeat are 50/50.',
      },
      {
        emoji: '✅',
        title: '"Brilliant!"',
        body: 'Translation: Can mean excellent, OK, understood, or goodbye. The most versatile word in the British vocabulary.',
      },
    ],
  },
  {
    id: 'unwritten-rules',
    emoji: '📋',
    heading: 'Social Norms',
    description: 'The invisible rules of British social life. Breaking these will not get you in trouble with the law, but will cause very British disapproval.',
    items: [
      {
        emoji: '🚫',
        title: 'Queuing is Sacred',
        body: 'Cutting in a queue is the single most serious social crime in Britain. A quiet "tut" from a stranger is the punishment, but the shame lasts forever. Always join the back of any line.',
      },
      {
        emoji: '🚶',
        title: 'Stand Right, Walk Left on Escalators',
        body: 'Especially in London. Stand on the right side of the escalator. The left is for walking. Blocking the left lane will cause silent rage and audible sighing behind you.',
      },
      {
        emoji: '🚪',
        title: 'Always Hold the Door',
        body: 'If you go through a door and someone is within 10 metres behind you, hold it for them. This now forces them into an awkward jog. Both parties must acknowledge the exchange.',
      },
      {
        emoji: '🤫',
        title: 'No Talking on the Underground (London)',
        body: 'Eye contact is also discouraged. Everyone reads their phone or stares at the floor. If you speak loudly or make eye contact, you will cause widespread discomfort.',
      },
      {
        emoji: '🌦️',
        title: 'Weather Small-Talk is Mandatory',
        body: '"Lovely day, isn\'t it?" is the universal British greeting. Commenting on rain, cold, or unexpected sunshine opens any conversation. It is not strange — it is socially required.',
      },
      {
        emoji: '☕',
        title: 'Tea Before Everything',
        body: 'When someone has bad news, a crisis, or a difficult conversation ahead, the British response is to make tea. Refusing a cup of tea when offered is slightly rude.',
      },
      {
        emoji: '💰',
        title: 'Never Ask About Salary or Money',
        body: 'Asking someone directly how much they earn is considered very rude. Age and weight are also off-limits. If asked, Brits deflect with "oh, I get by" or "not as much as I\'d like!"',
      },
      {
        emoji: '😬',
        title: 'Complaining Indirectly',
        body: 'Brits rarely complain to your face. Instead, they write elaborate passive-aggressive notes, give you a one-star review online, or tell everyone else. If a Brit tells you directly, it\'s very serious.',
      },
      {
        emoji: '🙇',
        title: 'Apologise Constantly',
        body: 'Say "sorry" as a default response to almost anything. If someone steps on your foot, you apologise. If you ask a shop assistant for help, you start with "sorry to bother you". It\'s just politeness.',
      },
    ],
  },
  {
    id: 'daily-life',
    emoji: '☕',
    heading: 'Daily Life',
    description: 'The everyday quirks of life in the UK — customs, traditions, and things you will notice within your first week.',
    items: [
      {
        emoji: '🍵',
        title: 'Tea Is Emotional Support',
        body: '"Shall I put the kettle on?" means "I want to help you through this." The milk debate (in first or last?) divides the nation. Answer carefully. Most Brits: milk last, one sugar.',
      },
      {
        emoji: '🌧️',
        title: 'The Weather Rules Everything',
        body: 'British weather changes four times a day. Always carry a coat, even in summer. A temperature of 20°C (68°F) is considered a heatwave and workplaces may send people home. Snow of 2cm shuts down entire cities.',
      },
      {
        emoji: '🍖',
        title: 'The Sunday Roast',
        body: 'The most important meal of the week. Roast beef, chicken, lamb or pork, with roast potatoes, Yorkshire pudding, gravy, and vegetables. Eaten with family on Sunday afternoons. Being invited to someone\'s Sunday roast is a genuine sign of friendship.',
      },
      {
        emoji: '🎆',
        title: 'Bonfire Night — 5th November',
        body: 'Every year on 5 November, cities across the UK set off large fireworks to commemorate the failed Gunpowder Plot of 1605. If you hear explosions at night in early November, it\'s fireworks, not an emergency. "Remember, remember, the fifth of November."',
      },
      {
        emoji: '🏧',
        title: 'Britain is Almost Cashless',
        body: 'Contactless card or phone payment is accepted almost everywhere — market stalls, buses, taxis, corner shops. Many places now refuse cash entirely. Set up Apple Pay or Google Pay for convenience. The maximum contactless limit for a single transaction is £100.',
      },
      {
        emoji: '🍺',
        title: 'The Pub as a Social Institution',
        body: 'The pub is not just a bar — it\'s where business deals are made, friendships are formed, and celebrations happen. Buying a "round" (buying drinks for your whole group in turn) is a social contract. If you accept a drink, you are expected to buy the next round.',
      },
      {
        emoji: '📝',
        title: 'The Passive-Aggressive Note',
        body: 'British people do not confront neighbours directly about bins, noise, or parking. Instead, they leave elaborate, carefully worded notes. The more polite the note, the more furious the author. "Dear Resident" notes on communal doors are a national art form.',
      },
      {
        emoji: '🤝',
        title: 'Queuing Etiquette Extends to Supermarkets',
        body: 'At the checkout, always wait to be waved forward by the cashier before placing your items. Leave a respectful gap between you and the person ahead. Do not make eye contact with other shoppers unless you wish to start a conversation (which is unusual).',
      },
    ],
  },
  {
    id: 'money-hacks',
    emoji: '💷',
    heading: 'Money-Saving Hacks',
    description: 'The loyalty schemes, stacking tricks, and survival strategies that most Brits take for granted — but nobody tells new arrivals.',
    items: [
      {
        emoji: '🛒',
        title: 'Tesco Clubcard — Stack It Everywhere',
        body: 'Get a free Tesco Clubcard (online or in-store, no credit check). Scan it at every Tesco shop. "Clubcard prices" are 30–50% cheaper on staple items — the shelf price without it is the inflated price. Points also convert to Clubcard Vouchers worth 3× their value when spent at partner restaurants and cinema chains.',
      },
      {
        emoji: '🟠',
        title: 'Sainsbury\'s Nectar Card — Free and Instant',
        body: 'Free Nectar card — apply in seconds in any Sainsbury\'s or online. Scan at every Sainsbury\'s, Argos, eBay UK, and Caffe Nero purchase. Nectar Points convert to cash at the till. Regularly gives free coffees and Argos discounts. Pair with Sainsbury\'s own-brand offers for maximum savings.',
      },
      {
        emoji: '🚂',
        title: 'Railcard Stacking — 1/3 Off All Trains',
        body: 'If you are 16–25, get a 16-25 Railcard (£30/year). 26–30? Get the 26-30 Railcard. Both save 1/3 on almost all UK rail fares. Critically: both cards also apply to London Oyster/contactless travel after 10pm and at weekends. A single trip from Norwich to London (normally £30+) becomes ~£20. The card pays for itself in 1–2 journeys.',
      },
      {
        emoji: '👔',
        title: 'Charity Shops for Professional Clothes',
        body: 'Before a job interview, visit an Oxfam, Sue Ryder, or British Heart Foundation charity shop. Brand-new or barely-worn suits, shirts, and professional clothes sell for £3–£15. Oxfam in university cities has the best selection. Vinted (the app) is the UK\'s largest second-hand clothing platform — find interview suits for under £10. Also see Free Interview Clothes in the Resources tab.',
      },
      {
        emoji: '🍱',
        title: 'Too Good To Go — Restaurant Food at 1/3 Price',
        body: 'Every evening, restaurants, supermarkets, and bakeries sell surplus food at 1/3 price via the Too Good To Go app. A £12 restaurant meal becomes a "Magic Bag" for £3.99. Available in every UK city. Download the app and set your location — there are usually 10–20 options within walking distance in any town.',
      },
      {
        emoji: '🔌',
        title: 'Social Tariffs — Bills You\'re Entitled to Cut',
        body: 'On Universal Credit? Every major energy and water company has a legal social tariff that dramatically reduces bills — but they will not tell you unless you ask. Call your energy and water provider and say: "I receive Universal Credit and would like to apply for your social tariff or WaterSure scheme." You can also get BT, Sky, and Virgin Media\'s broadband social tariffs (around £15/month for full broadband).',
      },
    ],
  },
  {
    id: 'professional-networking',
    emoji: '🤝',
    heading: 'Professional Networking — UK Style',
    description: 'The unwritten rules of British professional culture that determine who gets hired, promoted, and trusted.',
    items: [
      {
        emoji: '☕',
        title: 'Small Talk is a Professional Skill',
        body: 'Before any meeting, interview, or networking event, British professionals spend 3–5 minutes on weather, weekend plans, or local news. This is not wasted time — it is how trust is established. Skipping straight to business signals social inexperience. Prepare 2–3 go-to topics: "I went to [local landmark] at the weekend", "I heard there\'s a new restaurant opening on [street]", or simply "How was your weekend?"',
      },
      {
        emoji: '🔗',
        title: 'LinkedIn is the UK\'s Hiring Backroom',
        body: 'Up to 70% of UK professional jobs are filled through LinkedIn connections — not job boards. Recruiters actively search for candidates. A complete LinkedIn profile (professional photo, summary, full work history) is not optional for skilled workers. Join industry groups, comment on posts in your sector, and connect with everyone you meet professionally. Recruiters send InMail — keep notifications on.',
      },
      {
        emoji: '☕',
        title: '"Let\'s Grab a Coffee" — A Real Invitation',
        body: '"Let\'s grab a coffee" is a genuine UK professional invitation. Unlike "we should meet up sometime" (which rarely happens), a coffee invitation means someone wants to explore working together. Always say yes. Arrive 5 minutes early. Let them speak 60% of the time. Follow up by email the same evening: "Great to meet you, I enjoyed hearing about [X]."',
      },
      {
        emoji: '📧',
        title: 'Email Tone — Formal but Warm',
        body: 'British professional emails start with "Hope you\'re well" and close with "Kind regards" or "Best wishes." Avoid "Hi" in a first email to someone senior. Avoid exclamation marks — they signal desperation. Reply within 24 hours. Silence for more than 2 working days signals disinterest. Always re-read before sending — a single unclear sentence causes significant miscommunication.',
      },
      {
        emoji: '🏛️',
        title: 'Professional Body Membership — Signals Commitment',
        body: 'For engineers: ICE (Institution of Civil Engineers) has an Associate Member grade for international engineers. Membership signals you are operating within UK professional standards and gives access to CPD events where real networking happens. For IT professionals: BCS (British Computer Society). For finance: ACCA has a refugee support pathway. Many offer heavily reduced or free membership for new arrivals.',
      },
    ],
  },
  {
    id: 'workplace',
    emoji: '💼',
    heading: 'Workplace Culture',
    description: 'How British workplaces actually operate — the things no employment contract or induction will ever tell you.',
    items: [
      {
        emoji: '🎂',
        title: 'Bring Cake on Your Birthday',
        body: 'In most British offices, it is tradition for the birthday person to bring cake for the team — not the other way round. Failing to do so will be noticed. Bring enough for everyone. This is not optional in offices that take cake seriously.',
      },
      {
        emoji: '📧',
        title: '"As per my last email…"',
        body: 'The most passive-aggressive phrase in British professional culture. It means: you have ignored what I told you, and I am politely furious. If you receive this, re-read the original email immediately.',
      },
      {
        emoji: '🫖',
        title: 'The Tea Round',
        body: 'In an office, when you make yourself a hot drink, you are expected to ask everyone nearby if they want one. This is called "doing a tea round." Accepting tea and never offering to make any is a slow-burn social crime that colleagues will remember.',
      },
      {
        emoji: '🕐',
        title: 'Start Time vs. Actual Start Time',
        body: 'If your shift starts at 9:00, being there at 9:00 is fine. However, ambitious employees arrive at 8:45. Arriving at exactly 9:00 every single day may be noted. Leaving exactly at 5:00 pm every day is also noticed — even if it is technically acceptable.',
      },
      {
        emoji: '🍻',
        title: 'The Work Night Out',
        body: 'Attendance at after-work drinks is technically optional, but is socially important for career development. The first round is usually paid for by someone senior. Do not get so drunk that you are memorable — the goal is "pleasant and sociable", not "the most interesting story of the quarter."',
      },
      {
        emoji: '🤐',
        title: 'Feedback Is Delivered Sideways',
        body: 'British managers rarely give direct negative feedback. Instead: "there\'s just one small thing…" means a major problem. "I wonder if we could perhaps…" means "change this." "It\'s quite good" means it needs work. "This is really interesting" in a performance review means they are confused.',
      },
      {
        emoji: '📱',
        title: 'No Phone Calls in Open-Plan Offices',
        body: 'Taking a loud personal phone call at your desk is considered rude. Step outside, go to a meeting room, or keep it very brief and quiet. Playing audio from your phone without headphones is a social crime. Headphones are the universal signal for "do not disturb."',
      },
    ],
  },
]
