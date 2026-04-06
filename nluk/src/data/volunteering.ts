/**
 * Volunteering organisations — personalised for a native Amharic speaker
 * in the Bolton/Greater Manchester area who is an asylum seeker.
 *
 * Source: career-ops/portals.yml volunteering_orgs
 * Last verified: April 2026
 */

export interface VolunteerOrg {
  icon: string
  url: string
  location: string
  roles: string[]
  why: string
  tags: string[]
  content: {
    en: { title: string; desc: string }
    am?: { title: string; desc: string }
    ti?: { title: string; desc: string }
  }
}

export const VOLUNTEERING: VolunteerOrg[] = [
  {
    icon: '🤝',
    url: 'https://breaking-barriers.co.uk/get-involved/volunteer/volunteer-opportunities/',
    location: 'Greater Manchester',
    roles: ['Interpreter', 'Mentor', 'Admin'],
    why: 'Supports people in your exact situation — Amharic interpreters are critically rare and valued.',
    tags: [
      'interpreter',
      'Amharic',
      'mentor',
      'admin',
      'employment',
      'Greater Manchester',
    ],
    content: {
      en: {
        title: 'Breaking Barriers — Greater Manchester',
        desc: 'Employment support for refugees. They need Amharic interpreters, mentors, and admin volunteers. Apply via their website.',
      },
    },
  },
  {
    icon: '📋',
    url: 'https://mrsn.org.uk/volunteering/',
    location: 'Greater Manchester',
    roles: ['Admin', 'Interpreter', 'Advice'],
    why: 'Admin volunteer role builds direct UK office experience; they welcome refugees as volunteers.',
    tags: ['admin', 'interpreter', 'advice', 'Microsoft Office', 'refugee support', 'Manchester'],
    content: {
      en: {
        title: 'Manchester Refugee Support Network (MRSN)',
        desc: 'Admin, advice, and interpreting roles. Microsoft Office skills useful. Contact: volunteerapplications@mrsn.org.uk',
      },
    },
  },
  {
    icon: '🗣️',
    url: 'https://cheethamadvice.org.uk/volunteer',
    location: 'Cheetham Hill, Manchester',
    roles: ['Casework Support', 'Interpreter'],
    why: 'Free 9-week training provided — good for casework and advice sector experience.',
    tags: [
      'casework',
      'interpreter',
      'advice',
      'training',
      'free training',
      'Cheetham Hill',
    ],
    content: {
      en: {
        title: 'Cheetham Hill Advice Centre',
        desc: 'Casework support volunteer with free 9-week training. Also accept Amharic speakers for advice and casework roles.',
      },
    },
  },
  {
    icon: '🌍',
    url: 'https://www.refugee-action.org.uk/support-us/volunteers/',
    location: 'Greater Manchester',
    roles: ['Interpreter', 'Casework Support'],
    why: 'National organisation with GM office — strong reference for housing and public sector jobs.',
    tags: ['interpreter', 'casework', 'refugee support', 'national', 'Manchester', 'reference'],
    content: {
      en: {
        title: 'Refugee Action — Greater Manchester',
        desc: 'Refugee support, interpreting, and casework assistance. National organisation — excellent reference for future employment. Apply via their website.',
      },
    },
  },
  {
    icon: '🔴',
    url: 'https://www.redcross.org.uk/get-involved/volunteer/refugee-support-volunteer',
    location: 'Greater Manchester',
    roles: ['Refugee Support', 'Language Assistance', 'Befriending'],
    why: 'Nationally recognised reference; your Amharic language skills directly useful.',
    tags: ['Red Cross', 'refugee support', 'language', 'befriending', 'national', 'recognised'],
    content: {
      en: {
        title: 'British Red Cross — Refugee Support',
        desc: 'Practical support, language assistance, and befriending for refugees. Nationally recognised charity — a Red Cross reference is highly valued by future employers.',
      },
    },
  },
  {
    icon: '🏠',
    url: 'https://www.boaztrust.org.uk/',
    location: 'Manchester',
    roles: ['Housing Support', 'Community Support'],
    why: 'Housing sector experience relevant to your housing officer career path.',
    tags: ['housing', 'asylum seeker', 'destitute', 'Manchester', 'housing officer', 'career'],
    content: {
      en: {
        title: 'Boaz Trust — Manchester',
        desc: 'Support for destitute asylum seekers, focusing on housing. Directly relevant to a housing officer career path — builds sector contacts and experience.',
      },
    },
  },
  {
    icon: '🏙️',
    url: 'https://www.boltondes.org.uk/news/article/26/greater-manchester-refugee-welcome-programme-the-bolton-partnership',
    location: 'Bolton',
    roles: ['Integration Support', 'Employment Support'],
    why: 'Local Bolton programme — builds council and public sector contacts directly.',
    tags: ['Bolton', 'integration', 'employment', 'council', 'public sector', 'local', 'BSCA'],
    content: {
      en: {
        title: 'GM Refugee Welcome — Bolton Partnership',
        desc: 'Integration support and employment barriers for refugees in Bolton. Local programme — builds direct contacts with Bolton Council, BSCA, and BRASS.',
      },
    },
  },
]
