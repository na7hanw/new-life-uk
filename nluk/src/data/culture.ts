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
    description: 'British English is often indirect. This guide explains what people really mean when they say something polite.',
    items: [
      {
        emoji: '😶',
        title: '"I\'ll bear that in mind"',
        body: 'Real meaning: I will not think about this again. This is a polite way to say no to an idea. They are not interested, but do not want to say so directly.',
      },
      {
        emoji: '🙂',
        title: '"Not bad"',
        body: 'Real meaning: Excellent! Very good work. "Not bad" is high praise from a British person. Do not be disappointed — they are very happy with you.',
      },
      {
        emoji: '🤔',
        title: '"That\'s quite interesting"',
        body: 'Real meaning: I disagree, or I am bored. If someone says "very interesting", they probably think you are wrong.',
      },
      {
        emoji: '🍽️',
        title: '"You must come round for dinner sometime!"',
        body: 'Real meaning: A friendly goodbye — not a real invitation. If it were a real invitation, they would give you a specific date and time.',
      },
      {
        emoji: '🙏',
        title: '"Sorry" (when you bump into them)',
        body: 'Real meaning: An automatic reaction, not a real apology. British people say sorry even when you walked into them. You are expected to also say sorry.',
      },
      {
        emoji: '🧐',
        title: '"Could you possibly...?"',
        body: 'Real meaning: Please do this now. The word "possibly" does not mean optional — it is a polite instruction.',
      },
      {
        emoji: '😤',
        title: '"With respect..."',
        body: 'Real meaning: I think you are wrong, and I am about to tell you why. Be ready for criticism.',
      },
      {
        emoji: '😠',
        title: '"It\'s absolutely fine, don\'t worry!"',
        body: 'Real meaning: It is not fine. They are not happy at all. The more strongly they say "absolutely", the more unhappy they are.',
      },
      {
        emoji: '👋',
        title: '"We should do this again!"',
        body: 'Real meaning: Usually genuine — they enjoyed meeting you. But if they do not make a specific plan at that moment, it may not happen.',
      },
      {
        emoji: '✅',
        title: '"Brilliant!"',
        body: 'Real meaning: This word can mean excellent, OK, I understand, or goodbye. It is the most flexible word in British English.',
      },
    ],
  },
  {
    id: 'unwritten-rules',
    emoji: '📋',
    heading: 'Social Norms',
    description: 'The unwritten rules of British social life. Breaking these will not get you in trouble with the law, but people will notice and disapprove quietly.',
    items: [
      {
        emoji: '🚫',
        title: 'Queuing is Sacred',
        body: 'Jumping a queue (going in front of people who were waiting) is the most serious social problem in Britain. A quiet disapproving sound is the reaction, but people will remember. Always join the back of the line.',
      },
      {
        emoji: '🚶',
        title: 'Stand Right, Walk Left on Escalators',
        body: 'Especially in London. Stand on the right side of the escalator. The left side is for walking. If you stand on the left, people behind you will become very frustrated.',
      },
      {
        emoji: '🚪',
        title: 'Always Hold the Door',
        body: 'If you go through a door and someone is nearby behind you, hold it for them. This means they may have to walk a little faster. Both people should thank each other.',
      },
      {
        emoji: '🤫',
        title: 'No Talking on the Underground (London)',
        body: 'Eye contact is also unusual. Most people look at their phone or at the floor. If you speak loudly or make eye contact with strangers, you will make people feel uncomfortable.',
      },
      {
        emoji: '🌦️',
        title: 'Weather Small-Talk is Very Common',
        body: '"Lovely day, isn\'t it?" is a very common British greeting. Talking about rain, cold, or sunshine is a normal way to start a conversation. It is not strange — it is polite.',
      },
      {
        emoji: '☕',
        title: 'Tea Before Everything',
        body: 'When someone has bad news or needs to talk about something difficult, British people make tea. Saying no to tea when someone offers it to you is considered a little rude.',
      },
      {
        emoji: '💰',
        title: 'Never Ask About Salary or Money',
        body: 'Asking someone directly how much they earn is considered very rude. Age and weight are also topics to avoid. British people usually change the subject if asked.',
      },
      {
        emoji: '😬',
        title: 'Complaining Indirectly',
        body: 'British people rarely say complaints directly to your face. Instead, they might write a polite but unhappy note, give a bad review online, or tell other people. If a British person tells you directly, the problem is very serious.',
      },
      {
        emoji: '🙇',
        title: 'Apologise Often',
        body: 'Saying "sorry" is a normal reaction to almost anything. If someone steps on your foot, you apologise. If you ask a shop worker for help, you start with "sorry to bother you". This is just normal politeness.',
      },
    ],
  },
  {
    id: 'daily-life',
    emoji: '☕',
    heading: 'Survival Essentials',
    description: 'Things you need to know in your first days and weeks — practical information that surprises most new arrivals.',
    items: [
      {
        emoji: '📬',
        title: 'Official Letters — Always Open and Act Immediately',
        body: 'In the UK, HMRC (tax), DWP (benefits), your council, courts, and the Home Office send important messages by post — not by phone or email. Ignoring a letter does not make the problem go away. HMRC gives £100 fines for missed deadlines that were sent only by post. If you ignore Universal Credit letters, your payments can stop. Open every letter on the day it arrives. If you do not understand a letter, take it to Citizens Advice — most offices will read it with you for free.',
      },
      {
        emoji: '💸',
        title: 'Direct Debits and Standing Orders — How UK Bills Work',
        body: 'Most UK bills are paid automatically. A Direct Debit lets a company take money from your account on a fixed date — used for energy, water, council tax, phone, and broadband. A Standing Order is a fixed amount you send out every month — often used for rent savings. Set these up when you move in. Missing a Direct Debit can create a late fee and a mark on your credit file. UK billing is mostly automatic — paying cash by hand is not normal.',
      },
      {
        emoji: '🚑',
        title: 'A&E vs 111 vs GP — When to Use What',
        body: 'Call 999 only for life-threatening emergencies (heart attack, stroke, loss of consciousness, serious bleeding). Call 111 (free, 24 hours) for urgent but not life-threatening problems — they will tell you what to do. Book a GP for ongoing health problems. Do NOT use A&E for colds, small cuts, or stomach aches — you will wait 4–6 hours. Walk-in Centres handle non-emergency problems on the same day. NHS 111 online at 111.nhs.uk is often faster than calling.',
      },
      {
        emoji: '🍵',
        title: 'Tea Is Support — and an Office Tradition',
        body: '"Shall I put the kettle on?" means "I want to help you through this." In the office, when you make a hot drink for yourself, you should ask nearby colleagues if they want one — this is called a "tea round." Accepting tea every time but never making a round yourself is something your colleagues will notice and remember. Saying no to tea when offered is considered a little rude.',
      },
      {
        emoji: '🏧',
        title: 'Britain is Almost Cashless',
        body: 'Contactless card or phone payment is accepted almost everywhere — market stalls, buses, taxis, small shops. Many places now refuse cash. Set up Apple Pay or Google Pay on your first day. The maximum contactless limit is £100 per payment. Tap your card or phone — you rarely need cash.',
      },
      {
        emoji: '🍺',
        title: 'The Pub as a Social and Professional Place',
        body: 'The pub is not just a bar — it is where friendships grow and professional relationships develop. Buying a "round" is an important social rule: if you accept a drink, you buy the next set of drinks when it is your turn. After-work pub time is important for professional relationships even if you do not drink — just order a soft drink and stay for an hour. Saying no to every social invitation can make people see you as unfriendly.',
      },
      {
        emoji: '🤝',
        title: 'Queuing — The Most Important Social Rule',
        body: 'Jumping a queue is the most serious social problem in Britain. Always join the back of any line. At the supermarket checkout, wait for the person at the till to invite you before placing your items. Leave a respectful gap between you and the person ahead. On escalators: stand on the right, walk on the left. Breaking this rule in London will cause genuine anger from people around you.',
      },
    ],
  },
  {
    id: 'money-hacks',
    emoji: '💷',
    heading: 'Money-Saving Hacks',
    description: 'Loyalty schemes, discount tricks, and money-saving strategies that most British people know — but nobody tells new arrivals.',
    items: [
      {
        emoji: '🛒',
        title: 'Tesco Clubcard — Save Money on Every Shop',
        body: 'Get a free Tesco Clubcard (online or in-store, no credit check). Scan it at every Tesco shop. "Clubcard prices" are 30–50% cheaper on many items — the shelf price without it is the full price. Points also convert to Clubcard Vouchers worth 3× their value when used at partner restaurants and cinema chains.',
      },
      {
        emoji: '🟠',
        title: 'Sainsbury\'s Nectar Card — Free and Quick to Set Up',
        body: 'Free Nectar card — get one in seconds at any Sainsbury\'s or online. Scan it at every Sainsbury\'s, Argos, eBay UK, and Caffe Nero purchase. Nectar Points convert to cash at the till. You can also get free coffees and Argos discounts. Use it with Sainsbury\'s own-brand products for the biggest savings.',
      },
      {
        emoji: '🚂',
        title: 'Railcard — One Third Off All Train Tickets',
        body: 'If you are 16–25, get a 16-25 Railcard (£30 per year). If you are 26–30, get the 26-30 Railcard. Both save one third on almost all UK train tickets. Importantly, both cards also give discounts on London Oyster/contactless travel after 10pm and at weekends. A single trip from Norwich to London (normally £30+) becomes about £20. The card pays for itself in 1–2 journeys.',
      },
      {
        emoji: '👔',
        title: 'Charity Shops for Professional Clothes',
        body: 'Before a job interview, visit an Oxfam, Sue Ryder, or British Heart Foundation charity shop. New or barely-used suits, shirts, and professional clothes cost £3–£15. Oxfam in university cities has the best selection. Vinted (the app) is the UK\'s largest second-hand clothing platform — you can find interview suits for under £10. Also see the Free Interview Clothes section in the Resources tab.',
      },
      {
        emoji: '🍱',
        title: 'Too Good To Go — Restaurant Food at Low Prices',
        body: 'Every evening, restaurants, supermarkets, and bakeries sell leftover food at one third of the normal price using the Too Good To Go app. A £12 restaurant meal can become a "Magic Bag" for £3.99. Available in every UK city. Download the app and set your location — there are usually 10–20 options nearby.',
      },
      {
        emoji: '🔌',
        title: 'Social Tariffs — Lower Bills You Have a Right to Ask For',
        body: 'On Universal Credit? Every major energy and water company has a special lower price for people who receive benefits — but they will not tell you unless you ask. Call your energy and water provider and say: "I receive Universal Credit and would like to apply for your social tariff or WaterSure scheme." You can also get lower broadband prices from BT, Sky, and Virgin Media (around £15 per month).',
      },
    ],
  },
  {
    id: 'professional-networking',
    emoji: '🤝',
    heading: 'Professional Networking — UK Style',
    description: 'The unwritten rules of British working life that can help your career — things that most people never explain directly.',
    items: [
      {
        emoji: '☕',
        title: 'Small Talk is a Professional Skill',
        body: 'Before any meeting, interview, or networking event, British professionals spend 3–5 minutes talking about the weather, weekend plans, or local news. This is not wasted time — it is how trust is built. Going directly to business without small talk can seem rude or cold. Prepare 2–3 topics you can use: "I went to [local place] at the weekend", or simply "How was your weekend?"',
      },
      {
        emoji: '🔗',
        title: 'LinkedIn is Where UK Jobs Are Found',
        body: 'Up to 70% of professional jobs in the UK are filled through LinkedIn connections — not job websites. Recruiters actively search for candidates. A complete LinkedIn profile (professional photo, short summary, full work history) is very important for skilled workers. Join industry groups, comment on posts in your area of work, and connect with everyone you meet professionally. Keep notifications on — recruiters send messages.',
      },
      {
        emoji: '☕',
        title: '"Let\'s Grab a Coffee" — A Real Invitation',
        body: '"Let\'s grab a coffee" is a genuine professional invitation in the UK. Unlike "we should meet up sometime" (which often does not happen), a coffee invitation means someone wants to work with you or learn about you. Always say yes. Arrive 5 minutes early. Let them speak most of the time. Send a follow-up email the same evening: "Great to meet you, I enjoyed hearing about [topic]."',
      },
      {
        emoji: '📧',
        title: 'Email Tone — Polite and Friendly',
        body: 'British professional emails usually start with "Hope you\'re well" and end with "Kind regards" or "Best wishes." Avoid starting with just "Hi" in a first email to someone senior. Avoid exclamation marks in formal emails. Reply within 24 hours. If you do not reply for more than 2 working days, people may think you are not interested. Always re-read before sending.',
      },
      {
        emoji: '🏛️',
        title: 'Professional Body Membership — Shows Commitment',
        body: 'For engineers: ICE (Institution of Civil Engineers) has an Associate Member level for international engineers. Membership shows you are working within UK professional standards and gives access to events where you can meet people. For IT professionals: BCS (British Computer Society). For finance: ACCA has a support pathway for refugees. Many offer reduced or free membership for new arrivals.',
      },
    ],
  },
  {
    id: 'workplace',
    emoji: '💼',
    heading: 'Workplace Culture',
    description: 'How British workplaces really work — things no employment contract or welcome meeting will tell you.',
    items: [
      {
        emoji: '🎂',
        title: 'Bring Cake on Your Birthday',
        body: 'In most British offices, the birthday person brings cake for the team — not the other way round. If you forget, your colleagues will notice. Bring enough for everyone. This is taken seriously in many offices.',
      },
      {
        emoji: '📧',
        title: '"As per my last email…"',
        body: 'This is a polite but angry phrase in British work culture. It means: you ignored what I told you before, and I am not happy about it. If you receive this phrase, re-read the original email straight away.',
      },
      {
        emoji: '🫖',
        title: 'The Tea Round',
        body: 'In an office, when you make a hot drink for yourself, you should ask your nearby colleagues if they want one. This is called "doing a tea round." Accepting tea from colleagues every time but never making drinks for others yourself is something people will notice and find impolite.',
      },
      {
        emoji: '🕐',
        title: 'Start Time vs. Actual Start Time',
        body: 'If your shift starts at 9:00, arriving at 9:00 is acceptable. However, people who want to progress in their career often arrive at 8:45. Leaving exactly at 5:00 pm every day is also noticed — even if it is technically within your contract.',
      },
      {
        emoji: '🍻',
        title: 'The Work Night Out',
        body: 'Going to after-work drinks is technically optional, but it is socially important for your career. The first round is usually paid by someone senior. Do not drink too much — the goal is to be friendly and sociable, not to stand out for the wrong reasons.',
      },
      {
        emoji: '🤐',
        title: 'Feedback is Given Indirectly',
        body: 'British managers rarely give direct negative feedback. Instead: "there\'s just one small thing…" means a serious problem. "I wonder if we could perhaps…" means "please change this." "It\'s quite good" means it needs more work. "This is really interesting" in a review often means they are confused or uncertain.',
      },
      {
        emoji: '📱',
        title: 'No Loud Phone Calls in Open-Plan Offices',
        body: 'Taking a loud personal phone call at your desk is considered rude. Go outside, find a meeting room, or keep it very short and quiet. Playing audio from your phone without headphones is very impolite. Wearing headphones is the universal sign for "please do not disturb me."',
      },
    ],
  },
]
