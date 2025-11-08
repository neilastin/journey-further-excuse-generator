/**
 * Spice It Up Feature Configuration
 * All custom excuse generation options for advanced mode
 */

// ============================================================================
// NARRATIVE ELEMENTS (Special Ingredients)
// ============================================================================

export interface NarrativeElement {
  id: string;
  label: string;
  emoji: string;
  promptText: string; // How to describe this element in the AI prompt
}

export const ALWAYS_AVAILABLE_ELEMENTS: NarrativeElement[] = [
  {
    id: 'injured-fox',
    label: 'Injured Fox',
    emoji: '🦊',
    promptText: 'an injured fox with a bandaged paw'
  },
  {
    id: 'suspicious-duck',
    label: 'Suspicious Duck',
    emoji: '🦆',
    promptText: 'a suspicious-looking duck'
  },
  {
    id: 'shifty-dog',
    label: 'Dog with Shifty Eyes',
    emoji: '🐕',
    promptText: 'a dog with shifty, suspicious eyes'
  },
  {
    id: 'victorian-gentleman',
    label: 'Victorian Gentleman',
    emoji: '🎩',
    promptText: 'a Victorian gentleman in a top hat and monocle'
  },
  {
    id: 'alien-involvement',
    label: 'Alien Involvement',
    emoji: '👽',
    promptText: 'alien presence or extraterrestrial technology'
  },
  {
    id: 'freak-weather',
    label: 'Freak Weather',
    emoji: '🌧️',
    promptText: 'impossibly specific freak weather event (sideways hail, localized tornado, etc.)'
  },
  {
    id: 'robot-malfunction',
    label: 'Robot Malfunction',
    emoji: '🤖',
    promptText: 'a malfunctioning robot or AI system'
  },
  {
    id: 'time-traveler',
    label: 'Time Traveler',
    emoji: '⏰',
    promptText: 'a confused time traveler from the past or future'
  }
];

export interface LimitedTimeElement extends NarrativeElement {
  startMonth: number; // 1-12 (January = 1)
  endMonth: number;   // 1-12
  startDay: number;   // 1-31
  endDay: number;     // 1-31
}

export const LIMITED_TIME_ELEMENTS: LimitedTimeElement[] = [
  {
    id: 'cupid-revenge',
    label: "Cupid's Revenge",
    emoji: '💘',
    promptText: 'Cupid or Valentine\'s Day-related romantic mishap',
    startMonth: 2,
    endMonth: 2,
    startDay: 1,
    endDay: 14
  },
  {
    id: 'easter-bunny',
    label: 'Easter Bunny Incident',
    emoji: '🐰',
    promptText: 'Easter Bunny causing chaos or mischief',
    startMonth: 3,
    endMonth: 4,
    startDay: 15,
    endDay: 30
  },
  {
    id: 'fireworks-disaster',
    label: 'Fireworks Disaster',
    emoji: '🎆',
    promptText: 'explosive fireworks-related incident',
    startMonth: 7,
    endMonth: 7,
    startDay: 1,
    endDay: 14
  },
  {
    id: 'halloween-chaos',
    label: 'Halloween Chaos',
    emoji: '🎃',
    promptText: 'spooky Halloween-related supernatural event',
    startMonth: 10,
    endMonth: 10,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'santa-fault',
    label: "Santa's Fault",
    emoji: '🎅',
    promptText: 'Santa Claus or Christmas elves causing problems',
    startMonth: 12,
    endMonth: 12,
    startDay: 1,
    endDay: 25
  }
];

/**
 * Get currently active limited time elements based on today's date
 */
export function getActiveLimitedTimeElements(): LimitedTimeElement[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
  const currentDay = now.getDate();

  return LIMITED_TIME_ELEMENTS.filter(element => {
    // Simple date range check (doesn't handle year boundaries)
    if (element.startMonth === element.endMonth) {
      // Same month range
      return currentMonth === element.startMonth &&
             currentDay >= element.startDay &&
             currentDay <= element.endDay;
    } else {
      // Cross-month range
      return (
        (currentMonth === element.startMonth && currentDay >= element.startDay) ||
        (currentMonth === element.endMonth && currentDay <= element.endDay)
      );
    }
  });
}

// ============================================================================
// COMEDIC STYLES
// ============================================================================

export type ComedyStyle =
  | 'surprise-me'
  | 'absurdist'
  | 'observational'
  | 'deadpan'
  | 'hyperbolic'
  | 'self-deprecating'
  | 'ironic'
  | 'meta'
  | 'paranoid';

export interface ComedyStyleOption {
  id: ComedyStyle;
  label: string;
  emoji: string;
}

export const COMEDY_STYLES: ComedyStyleOption[] = [
  { id: 'surprise-me', label: 'Surprise Me', emoji: '🎲' },
  { id: 'absurdist', label: 'Absurdist', emoji: '🌀' },
  { id: 'observational', label: 'Observational', emoji: '🔍' },
  { id: 'deadpan', label: 'Deadpan', emoji: '😐' },
  { id: 'hyperbolic', label: 'Hyperbolic', emoji: '🚀' },
  { id: 'self-deprecating', label: 'Self-Deprecating', emoji: '🤦' },
  { id: 'ironic', label: 'Ironic', emoji: '🔄' },
  { id: 'meta', label: 'Meta', emoji: '🎭' },
  { id: 'paranoid', label: 'Paranoid', emoji: '👁️' }
];

// ============================================================================
// EXCUSE FOCUS
// ============================================================================

export type ExcuseFocus =
  | 'let-ai-decide'
  | 'blame-technology'
  | 'blame-algorithm'
  | 'blame-budget'
  | 'blame-seasonality'
  | 'blame-client'
  | 'blame-competitor'
  | 'blame-meetings'
  | 'blame-universe'
  | 'blame-robin-skidmore';

export interface ExcuseFocusOption {
  id: ExcuseFocus;
  label: string;
  emoji: string;
  promptText: string; // How to inject this focus into the prompt
}

export const EXCUSE_FOCUS_OPTIONS: ExcuseFocusOption[] = [
  {
    id: 'let-ai-decide',
    label: 'Let AI Decide',
    emoji: '✨',
    promptText: '' // No specific direction
  },
  {
    id: 'blame-technology',
    label: 'Blame Technology',
    emoji: '💻',
    promptText: 'The excuse should primarily blame technology, apps, devices, or digital systems.'
  },
  {
    id: 'blame-algorithm',
    label: 'Blame The Algorithm',
    emoji: '📊',
    promptText: 'The excuse should primarily blame algorithm changes, platform updates, Google core updates, Meta algorithm changes, or search engines constantly moving the goalposts.'
  },
  {
    id: 'blame-budget',
    label: 'Blame The Budget',
    emoji: '💰',
    promptText: 'The excuse should primarily blame insufficient budget, cost constraints, champagne expectations on lemonade money, or the client wanting enterprise results with a startup budget.'
  },
  {
    id: 'blame-seasonality',
    label: 'Blame Seasonality',
    emoji: '📅',
    promptText: 'The excuse should primarily blame seasonal trends, Q4 chaos, Black Friday madness, Christmas campaign rushes, or cyclical industry patterns making everything harder.'
  },
  {
    id: 'blame-client',
    label: 'Blame The Client',
    emoji: '🤝',
    promptText: 'The excuse should primarily blame unclear client requirements, contradictory feedback, last-minute changes, scope creep, or the classic "can you make the logo bigger?" requests.'
  },
  {
    id: 'blame-competitor',
    label: 'Blame A Competitor',
    emoji: '🏆',
    promptText: 'The excuse should primarily blame competitors doing something unexpected, competitor campaigns causing disruption, or rival agencies/brands making strategic moves that complicated everything.'
  },
  {
    id: 'blame-meetings',
    label: 'Blame Too Many Meetings',
    emoji: '💼',
    promptText: 'The excuse should primarily blame excessive meetings, syncs, check-ins, all-hands, stand-ups, retrospectives, alignment sessions, or calendar Tetris preventing actual work from getting done.'
  },
  {
    id: 'blame-universe',
    label: 'Blame The Universe',
    emoji: '🌌',
    promptText: 'The excuse should primarily blame cosmic forces, fate, destiny, universal conspiracies, or the fundamental nature of reality conspiring against success.'
  },
  {
    id: 'blame-robin-skidmore',
    label: 'Blame Robin Skidmore',
    emoji: '👔',
    promptText: 'ROBIN_SKIDMORE_PERSONA_PLACEHOLDER' // Will be replaced by API with actual persona
  }
];

// ============================================================================
// VALIDATION
// ============================================================================

export const MAX_NARRATIVE_ELEMENTS = 3;

/**
 * Validate that selected narrative elements don't exceed the maximum
 */
export function validateNarrativeElements(selectedIds: string[]): boolean {
  return selectedIds.length <= MAX_NARRATIVE_ELEMENTS;
}

/**
 * Get all available narrative elements (always available + currently active limited time)
 */
export function getAllAvailableElements(): NarrativeElement[] {
  return [
    ...ALWAYS_AVAILABLE_ELEMENTS,
    ...getActiveLimitedTimeElements()
  ];
}
