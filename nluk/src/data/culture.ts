export interface CultureItem {
  emoji: string
  title: string
  body: string
}

export interface CultureSection {
  id: string
  emoji: string
  heading: string
  items: CultureItem[]
}

// ─── UK CULTURE DATA ─────────────────────────────────────────────
export const CULTURE: CultureSection[] = [
  {
    id: 'politeness',
    emoji: '🫖',
    heading: 'The Art of Politeness — British Translation Guide',
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
    heading: 'Unwritten Rules — Break These at Your Peril',
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
    id: 'bureaucracy',
    emoji: '📄',
    heading: 'Peculiar Bureaucracy — Things That Will Confuse You',
    items: [
      {
        emoji: '📺',
        title: 'The TV Licence (£174.50/year)',
        body: 'You must pay this if you watch ANY live TV or use BBC iPlayer — even on a laptop or phone. It funds the BBC. The fine for non-payment is up to £1,000. If you never watch live TV or iPlayer, you can legally declare you don\'t need one at tv-licensing.co.uk.',
      },
      {
        emoji: '🏘️',
        title: 'Council Tax',
        body: 'A local tax paid to your borough or district council (not central government). It funds local services — rubbish collection, libraries, street lighting. The amount depends on your property band (A–H). Students are usually fully exempt. Apply for a single-person discount (25% off) if you live alone.',
      },
      {
        emoji: '🚗',
        title: 'The MOT',
        body: 'Cars older than 3 years need an annual roadworthiness test (~£55). Fail it and you cannot legally drive the car on public roads. Book at any garage displaying the blue MOT sign. The expiry date is on a small certificate in your car.',
      },
      {
        emoji: '🪪',
        title: 'National Insurance Number (NIN)',
        body: 'Your tax and benefits identity number — format: AB 12 34 56 C. You need it to work, claim benefits, and build a pension. Apply online at gov.uk. Takes 2–8 weeks. You can start work before receiving it but must give it to your employer as soon as it arrives.',
      },
      {
        emoji: '📑',
        title: 'P60 and P45 Forms',
        body: 'Your P60 is your annual tax summary, issued every April by your employer. Keep every one — you will need them for mortgage applications, visa renewals, and benefit claims. A P45 is issued when you leave a job. Give it to your next employer immediately.',
      },
      {
        emoji: '🏥',
        title: 'NHS GP System — How It Works',
        body: 'You register with one local GP surgery for free. Routine appointments are often 2–4 weeks away — book early. For urgent medical advice (not an emergency), call 111 free 24/7, or use 111.nhs.uk. Only go to A&E (999) for genuine emergencies. The NHS App lets you book appointments and order repeat prescriptions.',
      },
      {
        emoji: '📅',
        title: 'Bank Holidays',
        body: 'England has 8 bank holidays per year (Scotland and Northern Ireland have different ones). Shops may close or run reduced hours. Public transport runs Sunday timetables. Everyone travels simultaneously. Plan ahead — supermarkets sell out of food the day before.',
      },
    ],
  },
  {
    id: 'daily-life',
    emoji: '☕',
    heading: 'Daily Life — The Things Nobody Tells You',
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
]
