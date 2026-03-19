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
