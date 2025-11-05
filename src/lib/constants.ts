import type { AudienceOption } from '@/types';
import { taglineVariations } from './taglineVariations';

// Form dropdown options
export const AUDIENCE_OPTIONS: AudienceOption[] = [
  'My manager',
  'My partner',
  'My parents',
  'My friend',
  'My teacher',
  'My date',
  'A client',
  'A coworker',
  'A police officer',
  'Anyone and everyone',
];

// Loading messages (55 messages from spec)
export const LOADING_MESSAGES = [
  'Consulting the excuse archives...',
  'Crafting your alibi...',
  'Fabricating plausible deniability...',
  'Summoning creative justifications...',
  'Generating bulletproof reasoning...',
  'Weaving a tale of innocence...',
  'Constructing the perfect narrative...',
  'Assembling your defense...',
  'Spinning a web of believability...',
  'Channeling your inner storyteller...',
  'Consulting the council of excuses...',
  'Bending reality to your favor...',
  'Manufacturing reasonable doubt...',
  'Brewing up some plausible scenarios...',
  'Conjuring creative explanations...',
  'Building your case...',
  'Orchestrating a symphony of excuses...',
  'Designing your escape route...',
  'Engineering believable fiction...',
  'Summoning the excuse spirits...',
  'Calculating optimal deflection angles...',
  'Drafting your statement...',
  'Polishing your story...',
  'Consulting Murphy\'s Law...',
  'Invoking creative license...',
  'Generating plausible alternatives...',
  'Constructing reasonable excuses...',
  'Fabricating convenient truths...',
  'Manifesting believable scenarios...',
  'Assembling your narrative...',
  'Weaving circumstantial evidence...',
  'Crafting your testimony...',
  'Building reasonable explanations...',
  'Summoning the excuse muse...',
  'Generating creative solutions...',
  'Consulting the book of alibis...',
  'Drafting your defense strategy...',
  'Manufacturing plausible events...',
  'Constructing your version of events...',
  'Brewing up some tall tales...',
  'Channeling Oscar-worthy performances...',
  'Generating face-saving explanations...',
  'Crafting elaborate justifications...',
  'Summoning convenient coincidences...',
  'Building layers of deniability...',
  'Weaving complex explanations...',
  'Consulting chaos theory...',
  'Generating creative deflections...',
  'Manifesting alternate realities...',
  'Constructing your masterpiece...',
  'Fabricating reasonable circumstances...',
  'Summoning believable scenarios...',
  'Engineering your way out...',
  'Crafting the ultimate excuse...',
  'Building your safety net...',
];

// File upload constraints
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Animation timings
export const LOADING_MESSAGE_INTERVAL = 2000; // 2 seconds per message
export const CARD_STAGGER_DELAY = 0.2; // 0.2s between card animations
export const COPY_SUCCESS_DURATION = 2000; // 2 seconds "Copied!" display

// Randomized excuse titles (20 per category)
export const EXCUSE_TITLES = {
  technical: [
    "The Professor's Defense",
    "The Expert's Analysis",
    "The Technical Breakdown",
    "The Scientific Explanation",
    "The Certified Report",
    "The Academic Paper",
    "The Engineer's Logic",
    "The Doctorate Defense",
    "The Analytical Approach",
    "The Research Findings",
    "The Systems Overview",
    "The Technical Audit",
    "The Scholar's Take",
    "The Laboratory Results",
    "The Quantum Explanation",
    "The Algorithm's Verdict",
    "The Data-Driven Defense",
    "The Peer-Reviewed Story",
    "The Calibrated Response",
    "The Forensic Report"
  ],
  believable: [
    "The Safe Bet",
    "The Straight Story",
    "The Honest Truth",
    "The Reasonable Explanation",
    "The Practical Defense",
    "The Simple Answer",
    "The Credible Account",
    "The Plausible Story",
    "The Common Sense Take",
    "The Rational Response",
    "The Down-to-Earth Excuse",
    "The Realistic Version",
    "The Standard Defense",
    "The Conventional Wisdom",
    "The No-Nonsense Story",
    "The Logical Explanation",
    "The Straightforward Take",
    "The Trustworthy Account",
    "The Reasonable Doubt",
    "The Solid Alibi"
  ],
  outrageous: [
    "The Legendary Tale",
    "The Wild Story",
    "The Conspiracy Theory",
    "The Epic Saga",
    "The Blockbuster Plot",
    "The Hollywood Version",
    "The Myth in the Making",
    "The Urban Legend",
    "The Plot Twist",
    "The Fiction Bestseller",
    "The Fever Dream",
    "The Tall Tale",
    "The Theatrical Performance",
    "The Movie Script",
    "The Fantasy Novel",
    "The Sci-Fi Adventure",
    "The Supernatural Event",
    "The Time Traveler's Log",
    "The Multiverse Incident",
    "The Interdimensional Mix-up"
  ]
};

// Get a random title for a given excuse type
export const getRandomExcuseTitle = (type: 'technical' | 'believable' | 'outrageous'): string => {
  const titles = EXCUSE_TITLES[type];
  return titles[Math.floor(Math.random() * titles.length)];
};

// Hero taglines interface
export interface Tagline {
  line1: string;
  line2: string;
}

// Hero taglines (derived from taglineVariations to avoid duplication)
export const TAGLINES: Tagline[] = taglineVariations.map(v => v.tagline);

/**
 * Get a random tagline from the TAGLINES array
 * @deprecated Use getRandomVariation() from taglineVariations instead for full variation support
 */
export function getRandomTagline(): Tagline {
  const randomIndex = Math.floor(Math.random() * TAGLINES.length);
  return TAGLINES[randomIndex];
}
