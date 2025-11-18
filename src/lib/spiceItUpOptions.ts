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
    promptText: 'an injured fox with a bandaged paw (Journey Further mascot)'
  },
  {
    id: 'office-dog',
    label: 'Office Dog',
    emoji: '🐕',
    promptText: 'a company office dog causing chaos or getting involved'
  },
  {
    id: 'duck-clipboard',
    label: 'Duck With A Clipboard',
    emoji: '🦆',
    promptText: 'a suspicious duck holding a clipboard, taking notes and observing critically'
  },
  {
    id: 'client-lunch-leftovers',
    label: 'Client Lunch Leftovers',
    emoji: '🍱',
    promptText: 'leftover food from a client lunch or meeting catering gone wrong'
  },
  {
    id: 'broken-coffee-machine',
    label: 'Broken Coffee Machine',
    emoji: '☕',
    promptText: 'a malfunctioning office coffee machine at the worst possible moment'
  },
  {
    id: 'high-vis-person',
    label: 'Mysterious Person in High-Vis',
    emoji: '🦺',
    promptText: 'a mysterious construction worker or contractor in high-visibility clothing appearing at impossible moments'
  },
  {
    id: 'yorkshire-pudding',
    label: 'A Yorkshire Pudding',
    emoji: '🥔',
    promptText: 'a Yorkshire pudding that has achieved consciousness or come to life'
  },
  {
    id: 'transatlantic-flight',
    label: 'Transatlantic Flight',
    emoji: '✈️',
    promptText: 'transatlantic flight chaos, international travel disasters, or timezone confusion'
  },
  {
    id: 'working-fax-machine',
    label: 'A Still Working Fax Machine',
    emoji: '📠',
    promptText: 'an ancient fax machine that mysteriously still works, sending or receiving something important'
  },
  {
    id: 'time-travelling-victorian',
    label: 'A Time-Travelling Victorian Gentleman',
    emoji: '🎩',
    promptText: 'a confused Victorian gentleman from the past, complete with top hat and monocle, bewildered by modern technology'
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
    id: 'new-year-new-me',
    label: 'New Year, New Me',
    emoji: '💪',
    promptText: 'New Year\'s resolutions failing spectacularly, self-improvement attempts going wrong, or January motivation already abandoned',
    startMonth: 1,
    endMonth: 1,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'valentines-day',
    label: 'Valentine\'s Day',
    emoji: '💘',
    promptText: 'Valentine\'s Day romantic mishaps, cupid causing chaos, or love-related disasters',
    startMonth: 2,
    endMonth: 2,
    startDay: 1,
    endDay: 29 // Handles leap years automatically
  },
  {
    id: 'st-patricks-day',
    label: 'St. Patrick\'s Day',
    emoji: '☘️',
    promptText: 'St. Patrick\'s Day celebrations, Guinness-fueled chaos, Irish themes, or leprechauns causing mischief',
    startMonth: 3,
    endMonth: 3,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'easter-bunny',
    label: 'Easter Bunny',
    emoji: '🐰',
    promptText: 'Easter Bunny causing chaos, chocolate-related disasters, or egg hunt mishaps',
    startMonth: 4,
    endMonth: 4,
    startDay: 1,
    endDay: 30
  },
  {
    id: 'cinco-de-mayo',
    label: 'Cinco de Mayo',
    emoji: '🌮',
    promptText: 'Cinco de Mayo celebrations, Mexican food disasters, mariachi bands, or tequila-related incidents',
    startMonth: 5,
    endMonth: 5,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'summer-solstice',
    label: 'Summer Solstice',
    emoji: '☀️',
    promptText: 'Summer solstice phenomena, longest day of the year chaos, or midsummer madness',
    startMonth: 6,
    endMonth: 6,
    startDay: 1,
    endDay: 30
  },
  {
    id: 'independence-day',
    label: 'Independence Day',
    emoji: '🎆',
    promptText: '4th of July celebrations, fireworks disasters, American patriotism gone wild, or BBQ mishaps',
    startMonth: 7,
    endMonth: 7,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'school-holidays',
    label: 'School Holidays',
    emoji: '🏖️',
    promptText: 'summer school holiday chaos, vacation disasters, kids off school causing mayhem, or family holiday mishaps',
    startMonth: 8,
    endMonth: 8,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'oktoberfest',
    label: 'Oktoberfest',
    emoji: '🍺',
    promptText: 'Oktoberfest celebrations, beer festival chaos, German themes, or pretzel-related incidents',
    startMonth: 9,
    endMonth: 9,
    startDay: 1,
    endDay: 30
  },
  {
    id: 'halloween',
    label: 'Halloween',
    emoji: '🎃',
    promptText: 'Halloween spookiness, supernatural events, costume mishaps, or trick-or-treat disasters',
    startMonth: 10,
    endMonth: 10,
    startDay: 1,
    endDay: 31
  },
  {
    id: 'black-friday',
    label: 'Black Friday',
    emoji: '🛒',
    promptText: 'Black Friday shopping chaos, retail madness, e-commerce crashes, or deal-hunting disasters',
    startMonth: 11,
    endMonth: 11,
    startDay: 1,
    endDay: 30
  },
  {
    id: 'christmas',
    label: 'Christmas',
    emoji: '🎅',
    promptText: 'Christmas chaos, Santa Claus mishaps, festive disasters, or elf-related problems',
    startMonth: 12,
    endMonth: 12,
    startDay: 1,
    endDay: 31
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
  | 'passive-aggressive'
  | 'ironic'
  | 'meta'
  | 'paranoid'
  | 'corporate-jargon';

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
  { id: 'passive-aggressive', label: 'Passive-Aggressive', emoji: '😤' },
  { id: 'ironic', label: 'Ironic', emoji: '🔄' },
  { id: 'meta', label: 'Meta', emoji: '🎭' },
  { id: 'paranoid', label: 'Paranoid', emoji: '👁️' },
  { id: 'corporate-jargon', label: 'Corporate Jargon', emoji: '💼' }
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
