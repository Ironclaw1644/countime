import {
  HOLDING_TYPES,
  type CommissarySection,
  type Facility,
} from '@/types/facility';

/**
 * What a typical federal camp's commissary stocks. Real lists vary week-to-week
 * and facility-to-facility — used as a fallback when a Facility entry has no
 * commissary override of its own. The detail page surfaces a freshness caveat.
 */
export const TYPICAL_CAMP_COMMISSARY: CommissarySection[] = [
  {
    category: 'Hot food & meal-builders',
    items: [
      'Ramen noodle soup (chicken, beef, shrimp, picante)',
      'White rice (instant)',
      'Refried beans / black beans (instant)',
      'Mackerel pouches',
      'Tuna pouches',
      'Chicken pouches',
      'Summer sausage',
      'Peanut butter',
      'Jelly',
      'Squeeze cheese',
      'Tortillas (flour)',
      'Hot sauce',
      'Soy sauce / mayonnaise / mustard packets',
    ],
  },
  {
    category: 'Snacks',
    items: [
      'Chips (Doritos, Cheetos, plain potato)',
      'Honey buns',
      'Sandwich cookies (Oreos, Vienna fingers)',
      'Crackers (Ritz, saltines, graham)',
      'Granola bars',
      'Trail mix / peanuts / cashews',
      'Pretzels',
      'Pop-Tarts',
      'Hard candy & chocolate bars',
    ],
  },
  {
    category: 'Beverages',
    items: [
      'Instant coffee (Folgers, Cafe Bustelo)',
      'Tea bags (Lipton)',
      'Hot chocolate mix',
      'Drink mixes (Crystal Light–style, Kool-Aid–style)',
      'Powdered creamer',
      'Powdered milk',
    ],
  },
  {
    category: 'Hygiene',
    items: [
      'Bar soap (Dial, Irish Spring, generic)',
      'Body wash',
      'Shampoo & conditioner',
      'Deodorant (clear, alcohol-free)',
      'Toothpaste & toothbrush',
      'Dental floss',
      'Disposable razors',
      'Shaving cream',
      'Lotion',
      'Lip balm',
      'Q-tips & cotton balls',
      'Foot powder',
      'Nail clippers (often issued, sometimes purchased)',
    ],
  },
  {
    category: 'Stationery & mail',
    items: [
      'Legal pads & notebooks',
      'Envelopes (security & legal)',
      'Postage stamps',
      'BIC pens (clear, blue/black)',
      'Pencils',
      'Copy paper',
      'Greeting cards',
    ],
  },
  {
    category: 'Electronics',
    items: [
      'AM/FM radio (clear-shell)',
      'BOP-approved MP3 player (SanDisk clear)',
      'Earbuds & headphones',
      'Wristwatch (digital, clear)',
      'AA / AAA batteries',
    ],
  },
  {
    category: 'Clothing & footwear',
    items: [
      'White t-shirts (3-pack)',
      'Athletic socks',
      'Thermal underwear (winter)',
      'Sweatshirt & sweatpants (gray)',
      'Sneakers (Reebok, New Balance — limited models)',
      'Reading glasses',
      'Shower shoes',
    ],
  },
  {
    category: 'Over-the-counter medication',
    items: [
      'Ibuprofen',
      'Acetaminophen',
      'Aspirin',
      'Antacids',
      'Cough drops',
      'Multivitamins',
      'Allergy tablets',
    ],
  },
  {
    category: 'Laundry & misc',
    items: [
      'Laundry detergent (powder, single-use)',
      'Fabric softener sheets',
      'Photo books / albums',
      'Religious items (rosaries, kufis, prayer rugs — varies)',
    ],
  },
];

/** Items added at women's facilities. */
export const WOMENS_COMMISSARY_ADDITIONS: CommissarySection = {
  category: 'Women-specific',
  items: [
    'Tampons & sanitary pads',
    'Pantyliners',
    'Hair ties & headbands (clear)',
    'Bras (sports & soft-cup, white)',
    'Feminine wash',
    "Women's razors",
  ],
};

/** Holding facilities (FDC/MCC/MDC/FTC) typically have a much thinner commissary. */
export const HOLDING_COMMISSARY: CommissarySection[] = [
  {
    category: 'Food (limited)',
    items: [
      'Ramen noodle soup',
      'Tuna / mackerel pouches',
      'Crackers',
      'Peanut butter',
      'Honey buns',
      'Chips',
      'Hard candy',
    ],
  },
  {
    category: 'Beverages',
    items: ['Instant coffee', 'Tea bags', 'Drink mixes', 'Powdered creamer'],
  },
  {
    category: 'Hygiene',
    items: [
      'Bar soap',
      'Toothpaste & toothbrush',
      'Deodorant',
      'Disposable razors',
      'Shampoo',
      'Lotion',
    ],
  },
  {
    category: 'Stationery & mail',
    items: ['Notepad', 'Envelopes', 'Stamps', 'BIC pens'],
  },
  {
    category: 'Clothing',
    items: ['T-shirts', 'Socks', 'Thermals (seasonal)', 'Slip-on sneakers'],
  },
];

/** Typical amenities at a federal prison camp. */
export const TYPICAL_CAMP_AMENITIES: string[] = [
  'Outdoor walking / running track',
  'Recreation yard with cardio equipment (treadmills, ellipticals, bikes)',
  'Limited weight pile / resistance equipment',
  'Basketball court (outdoor or indoor)',
  'Softball or baseball field',
  'Soccer field (some camps)',
  'Bocce, horseshoes, cornhole',
  'Indoor TV rooms (cable news, sports, movies)',
  'Card & board games (chess, cribbage, dominoes, Scrabble)',
  'Library (legal + leisure reading)',
  'Multi-faith chapel',
  'Music room with shared instruments (varies by camp)',
  'Hobby craft area (varies)',
  'TRULINCS terminals (email-style messaging, limited internet)',
  'Visiting room (weekends + federal holidays)',
];

/** Holding facilities are tighter — limited yard, no fields, fewer amenities. */
export const HOLDING_AMENITIES: string[] = [
  'Indoor / rooftop recreation area',
  'Cardio equipment (limited)',
  'Day room with TV',
  'Card & board games',
  'Library (legal access prioritized)',
  'Multi-faith religious services',
  'TRULINCS terminals',
  'Visiting room (typically by appointment, often non-contact)',
];

/** Typical classes & education programs at a federal camp. */
export const TYPICAL_CAMP_CLASSES: string[] = [
  'Adult Continuing Education (ACE) — peer-led classes',
  'GED preparation & testing',
  'English as a Second Language (ESL)',
  'Parenting classes',
  'Anger management',
  'Drug Education',
  'Non-Residential Drug Abuse Program (NR-DAP)',
  'Cognitive Behavioral Therapy groups',
  'Faith-based programs (Bible study, chapel groups, multi-faith)',
  'Narcotics Anonymous / Alcoholics Anonymous',
  'Career Resource Center / job-readiness',
  'Resume writing & interviewing',
  'Money Smart financial literacy',
  'Threshold re-entry preparation',
  'Apprenticeships through Department of Labor (varies — landscaping, food service, building trades)',
];

export const HOLDING_CLASSES: string[] = [
  'GED preparation (limited cohorts)',
  'Drug Education',
  'Faith-based services (Catholic, Protestant, Islamic, Jewish — schedules vary)',
  'Pre-trial legal access programs',
  'ACE classes (when staffing allows)',
  'Career-readiness materials in the law library',
];

function isHoldingType(type: Facility['type']) {
  return HOLDING_TYPES.includes(type);
}

export function getCommissaryFor(f: Facility): CommissarySection[] {
  if (f.commissary && f.commissary.length > 0) return f.commissary;
  if (isHoldingType(f.type)) return HOLDING_COMMISSARY;
  if (f.gender === 'FEMALE') {
    return [...TYPICAL_CAMP_COMMISSARY, WOMENS_COMMISSARY_ADDITIONS];
  }
  return TYPICAL_CAMP_COMMISSARY;
}

export function getAmenitiesFor(f: Facility): string[] {
  if (f.amenities && f.amenities.length > 0) return f.amenities;
  if (isHoldingType(f.type)) return HOLDING_AMENITIES;
  return TYPICAL_CAMP_AMENITIES;
}

export function getClassesFor(f: Facility): string[] {
  if (f.classes && f.classes.length > 0) return f.classes;
  const base = isHoldingType(f.type) ? HOLDING_CLASSES : TYPICAL_CAMP_CLASSES;
  if (f.hasRDAP && !isHoldingType(f.type)) {
    return [...base, 'Residential Drug Abuse Program (RDAP) — 9-month residential cohort'];
  }
  return base;
}

export function commissaryIsTypical(f: Facility): boolean {
  return !f.commissary || f.commissary.length === 0;
}

export function amenitiesAreTypical(f: Facility): boolean {
  return !f.amenities || f.amenities.length === 0;
}

export function classesAreTypical(f: Facility): boolean {
  return !f.classes || f.classes.length === 0;
}
