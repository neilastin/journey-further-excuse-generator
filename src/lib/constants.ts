import type { AudienceOption } from '@/types';
import { taglineVariations } from './taglineVariations';

// Form dropdown options
export const AUDIENCE_OPTIONS: AudienceOption[] = [
  'A Colleague',
  'Your Manager',
  'A Direct Report',
  'The Client',
  'HR',
  'Finance',
  'A Random Stranger On LinkedIn',
  'Robin Skidmore',
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

// Randomized excuse titles (20 per excuse type)
// Note: App generates 2 excuses - Believable (excuse1) and Risky (excuse2)
export const EXCUSE_TITLES = {
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
  risky: [
    "The Bold Gambit",
    "The Creative Interpretation",
    "The Inspired Defense",
    "The Unexpected Angle",
    "The Strategic Narrative",
    "The Calculated Risk",
    "The Artistic License",
    "The Audacious Claim",
    "The Daring Explanation",
    "The Unconventional Truth",
    "The Imaginative Account",
    "The Spirited Defense",
    "The Colorful Story",
    "The Ambitious Take",
    "The Vivid Recollection",
    "The Elaborate Theory",
    "The Distinctive Version",
    "The Original Perspective",
    "The Adventurous Alibi",
    "The Dramatic Retelling"
  ]
};

// Get a random title for a given excuse type
export const getRandomExcuseTitle = (type: 'believable' | 'risky'): string => {
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

// Form placeholder examples (16 examples)
export const PLACEHOLDER_EXAMPLES = [
  "I missed the client deadline that everyone's been working towards for three months",
  "The tracking broke three weeks ago and I only just noticed",
  "I accidentally set the daily budget to £10,000 instead of £100 and spent the entire monthly budget overnight",
  "I forgot to exclude existing customers from the acquisition campaign and wasted £5k targeting people who already bought",
  "The landing page has been linking to a 404 error for two weeks",
  "I've been reporting on vanity metrics for six months and just realised we've generated no actual revenue",
  "I ran A/B test for 4 months, but both versions were exactly the same",
  "The campaign has been running for 6 weeks targeting Austria instead of Australia. Hoppla!",
  "I accidentally replied-all to a client email with my honest opinion about their awful brand guidelines",
  "I've been billing the client for 20 hours a week but actually spending 4 hours and hoping nobody asks questions",
  "I accidentally shared the screen showing my personal chat where I was complaining about the client's bad haircut",
  "I quoted the client £5k for a project that's going to cost us £15k to deliver",
  "I've been marked as 'in a meeting' on Teams for 4 hours but I'm actually at the gym",
  "I submitted my timesheet claiming I worked 60 hours last week but 30 of those were watching Netflix",
  "I missed half a day for a 'doctor's appointment' that was actually a job interview",
  "I've been expensing my daily Pret lunches as 'client entertainment' for three months"
];

/**
 * Get a random placeholder example from the PLACEHOLDER_EXAMPLES array
 */
export function getRandomPlaceholder(): string {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length);
  return PLACEHOLDER_EXAMPLES[randomIndex];
}
