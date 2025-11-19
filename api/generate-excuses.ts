import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRobinPersona } from '../src/lib/personas/robin-skidmore.js';

/**
 * IMPORTANT NOTE ABOUT PERSONA IMPORT:
 * This import works in both local dev (tsx) and Vercel production:
 * - Local dev: tsx handles .ts files directly
 * - Vercel: Compiles TypeScript during deployment
 * The .js extension is omitted to work in both environments
 */

/**
 * Serverless function to generate 2 creative excuses using Claude API
 * NOW WITH CUSTOM SPICE IT UP OPTIONS
 *
 * Security: API key accessed via process.env (server-side only)
 * No VITE_ prefix - keeps keys hidden from browser
 */

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute

/**
 * Check rate limit for a given client IP
 * Returns { limited: true } if rate limit exceeded
 */
function checkRateLimit(req: VercelRequest): { limited: boolean } {
  // Extract client IP from Vercel headers
  const xRealIp = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];

  let clientIp: string;

  if (xRealIp && typeof xRealIp === 'string') {
    clientIp = xRealIp;
  } else if (xForwardedFor) {
    // x-forwarded-for can be string or string[]
    const forwardedIp = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    // Take first IP from comma-separated list
    clientIp = forwardedIp.split(',')[0].trim();
  } else {
    // Fallback to a default (should rarely happen in Vercel)
    clientIp = 'unknown';
  }

  const now = Date.now();
  const entry = rateLimitStore.get(clientIp);

  // Periodic cleanup (1% chance per request to clean expired entries)
  if (Math.random() < 0.01) {
    const entriesToDelete: string[] = [];
    rateLimitStore.forEach((data, ip) => {
      if (now > data.resetTime) {
        entriesToDelete.push(ip);
      }
    });
    entriesToDelete.forEach(ip => rateLimitStore.delete(ip));
  }

  // If no entry or reset time passed, create new window
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return { limited: false };
  }

  // Check if limit exceeded
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(clientIp, entry);
  return { limited: false };
}

/**
 * Extract client IP for logging
 */
function getClientIp(req: VercelRequest): string {
  const xRealIp = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];

  if (xRealIp && typeof xRealIp === 'string') {
    return xRealIp;
  } else if (xForwardedFor) {
    const forwardedIp = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    return forwardedIp.split(',')[0].trim();
  }
  return 'unknown';
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

const VALID_AUDIENCE_OPTIONS = [
  'A Colleague',
  'Your Manager',
  'A Direct Report',
  'The Client',
  'HR',
  'Finance',
  'A Random Stranger On LinkedIn',
  'Robin Skidmore'
];

// ============================================================================
// TYPES
// ============================================================================

interface RequestBody {
  scenario: string;
  audience: string;
  customOptions?: CustomExcuseOptions;
}

interface CustomExcuseOptions {
  style?: string; // Comedy style ID or "surprise-me"
  narrativeElements?: string[]; // Array of element IDs (max 3)
  excuseFocus?: string; // Focus ID or "let-ai-decide"
  aiModel?: 'claude' | 'gemini'; // AI model to use for generation
}

interface ExcuseItem {
  title: string;
  text: string;
}

interface ExcusesResponse {
  excuse1: ExcuseItem;
  excuse2: ExcuseItem;
  comedicStyle: string; // The style used for excuse2 (Risky excuse)
}

// ============================================================================
// NARRATIVE ELEMENTS (from spiceItUpOptions.ts)
// ============================================================================

interface NarrativeElement {
  id: string;
  promptText: string;
}

const ALWAYS_AVAILABLE_ELEMENTS: NarrativeElement[] = [
  { id: 'injured-fox', promptText: 'an injured fox (Journey Further mascot) - optionally with a bandaged paw and/or missing ear, or just generally injured with unspecified injuries' },
  { id: 'office-dog', promptText: 'a company office dog causing chaos or getting involved' },
  { id: 'duck-clipboard', promptText: 'a suspicious duck holding a clipboard, taking notes and observing critically' },
  { id: 'client-lunch-leftovers', promptText: 'leftover food from a client lunch or meeting catering gone wrong' },
  { id: 'broken-coffee-machine', promptText: 'a malfunctioning office coffee machine at the worst possible moment' },
  { id: 'high-vis-person', promptText: 'a mysterious person in high-visibility clothing appearing at impossible moments' },
  { id: 'yorkshire-pudding', promptText: 'a Yorkshire pudding - optionally sentient/conscious or just a normal Yorkshire pudding involved in the story somehow' },
  { id: 'transatlantic-flight', promptText: 'transatlantic flight chaos, travel mishaps, jet lag, timezone confusion, or international travel comedy (keep it safe for work, no real disasters)' },
  { id: 'working-fax-machine', promptText: 'an ancient fax machine that mysteriously still works, sending or receiving something important' },
  { id: 'time-travelling-victorian', promptText: 'a confused Victorian gentleman from the past, complete with top hat and monocle, bewildered by modern technology' }
];

interface LimitedTimeElement extends NarrativeElement {
  startMonth: number;
  endMonth: number;
  startDay: number;
  endDay: number;
}

const LIMITED_TIME_ELEMENTS: LimitedTimeElement[] = [
  {
    id: 'new-year-new-me',
    promptText: 'New Year\'s resolutions failing spectacularly, self-improvement attempts going wrong, or January motivation already abandoned',
    startMonth: 1, endMonth: 1, startDay: 1, endDay: 31
  },
  {
    id: 'valentines-day',
    promptText: 'Valentine\'s Day romantic mishaps, cupid causing chaos, or love-related disasters',
    startMonth: 2, endMonth: 2, startDay: 1, endDay: 29
  },
  {
    id: 'st-patricks-day',
    promptText: 'St. Patrick\'s Day celebrations, Guinness-fueled chaos, Irish themes, or leprechauns causing mischief',
    startMonth: 3, endMonth: 3, startDay: 1, endDay: 31
  },
  {
    id: 'easter-bunny',
    promptText: 'Easter Bunny causing chaos, chocolate-related disasters, or egg hunt mishaps',
    startMonth: 4, endMonth: 4, startDay: 1, endDay: 30
  },
  {
    id: 'cinco-de-mayo',
    promptText: 'Cinco de Mayo celebrations, Mexican food disasters, mariachi bands, or tequila-related incidents',
    startMonth: 5, endMonth: 5, startDay: 1, endDay: 31
  },
  {
    id: 'summer-solstice',
    promptText: 'Summer solstice phenomena, longest day of the year chaos, midsummer madness, or Stonehenge-related mishaps (optional reference)',
    startMonth: 6, endMonth: 6, startDay: 1, endDay: 30
  },
  {
    id: 'independence-day',
    promptText: '4th of July celebrations, fireworks disasters, American patriotism gone wild, or BBQ mishaps',
    startMonth: 7, endMonth: 7, startDay: 1, endDay: 31
  },
  {
    id: 'school-holidays',
    promptText: 'summer school holiday chaos, vacation disasters, kids off school causing mayhem, or family holiday mishaps',
    startMonth: 8, endMonth: 8, startDay: 1, endDay: 31
  },
  {
    id: 'oktoberfest',
    promptText: 'Oktoberfest celebrations, beer festival chaos, German themes, or pretzel-related incidents',
    startMonth: 9, endMonth: 9, startDay: 1, endDay: 30
  },
  {
    id: 'halloween',
    promptText: 'Halloween spookiness, supernatural events, costume mishaps, or trick-or-treat disasters',
    startMonth: 10, endMonth: 10, startDay: 1, endDay: 31
  },
  {
    id: 'black-friday',
    promptText: 'Black Friday shopping chaos, retail madness, e-commerce crashes, or deal-hunting disasters',
    startMonth: 11, endMonth: 11, startDay: 1, endDay: 30
  },
  {
    id: 'christmas',
    promptText: 'Christmas chaos, Santa Claus mishaps, festive disasters, or elf-related problems',
    startMonth: 12, endMonth: 12, startDay: 1, endDay: 31
  }
];

function getActiveLimitedTimeElements(): LimitedTimeElement[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  return LIMITED_TIME_ELEMENTS.filter(element => {
    if (element.startMonth === element.endMonth) {
      return currentMonth === element.startMonth &&
             currentDay >= element.startDay &&
             currentDay <= element.endDay;
    } else {
      return (
        (currentMonth === element.startMonth && currentDay >= element.startDay) ||
        (currentMonth === element.endMonth && currentDay <= element.endDay)
      );
    }
  });
}

function getAllAvailableElements(): NarrativeElement[] {
  return [...ALWAYS_AVAILABLE_ELEMENTS, ...getActiveLimitedTimeElements()];
}

// ============================================================================
// EXCUSE FOCUS OPTIONS (from spiceItUpOptions.ts)
// ============================================================================

interface ExcuseFocusOption {
  id: string;
  promptText: string;
}

const EXCUSE_FOCUS_OPTIONS: ExcuseFocusOption[] = [
  { id: 'let-ai-decide', promptText: '' },
  { id: 'blame-technology', promptText: 'The excuse should primarily blame technology, apps, devices, or digital systems. Use the examples for flavor but create your own variations - don\'t use these exact phrases.' },
  { id: 'blame-algorithm', promptText: 'The excuse should primarily blame algorithm changes or platform updates - examples include Google core updates, Meta algorithm changes, TikTok algorithm shifts, YouTube recommendation changes, or search engines/social platforms constantly moving the goalposts. Use these as inspiration but vary your language.' },
  { id: 'blame-budget', promptText: 'The excuse should primarily blame insufficient budget or cost constraints - examples include "champagne expectations on lemonade money" or clients wanting enterprise results with startup budgets. Use these concepts as flavor but create your own phrasing.' },
  { id: 'blame-seasonality', promptText: 'The excuse should primarily blame seasonal trends or cyclical patterns. Feel free to reference any seasonal trend you recognize: Q4 chaos, Black Friday madness, Christmas campaign rushes, summer slowdowns, January recovery, back-to-school surges, tax season, holiday periods, end-of-financial-year, or any other cyclical industry patterns making everything harder.' },
  { id: 'blame-client', promptText: 'The excuse should primarily blame typical difficult client behaviors. Examples include unclear requirements, contradictory feedback, last-minute changes, scope creep, or classic requests like "can you make the logo bigger?" - but feel free to reference any typical client behavior that causes issues for agencies. Don\'t just use these examples verbatim.' },
  { id: 'blame-competitor', promptText: 'The excuse should primarily blame competitors doing something unexpected, competitor campaigns causing disruption, or rival agencies/brands making strategic moves that complicated everything. Use this theme as inspiration but vary your approach.' },
  { id: 'blame-meetings', promptText: 'The excuse should primarily blame excessive meetings, syncs, check-ins, all-hands, stand-ups, retrospectives, alignment sessions, or calendar Tetris preventing actual work from getting done. Use these examples for flavor but create varied phrasing.' },
  { id: 'blame-universe', promptText: 'The excuse should primarily blame cosmic forces, fate, destiny, universal conspiracies, or the fundamental nature of reality conspiring against success.' },
  { id: 'blame-robin-skidmore', promptText: 'ROBIN_SKIDMORE_PERSONA_PLACEHOLDER' }
];

// ============================================================================
// COMEDY STYLES & INSTRUCTIONS
// ============================================================================

const VALID_COMEDY_STYLES = [
  'Absurdist',
  'Observational',
  'Deadpan',
  'Hyperbolic',
  'Passive-aggressive',
  'Ironic',
  'Meta',
  'Paranoid',
  'Corporate-jargon'
];

// Styles available for random selection (excludes niche styles like Corporate-jargon and Passive-aggressive)
const RANDOM_COMEDY_STYLES = [
  'Absurdist',
  'Observational',
  'Deadpan',
  'Hyperbolic',
  'Ironic',
  'Meta',
  'Paranoid'
];

const STYLE_INSTRUCTIONS: Record<string, string> = {
  'Absurdist': `Use ABSURDIST comedy:
- Introduce surreal, impossible scenarios that defy logic and physics
- Include talking animals, sentient objects, or things that shouldn't exist
- Make the bizarre feel matter-of-fact (quantum mechanics in daily life, time paradoxes)
- Layer absurdity upon absurdity - don't settle for one weird thing
- Examples of absurdist elements: parallel dimensions, objects with personalities, animals doing human jobs, impossible weather
- Avoid clichés: Don't just say "aliens did it" - be creative and specific`,

  'Observational': `Use OBSERVATIONAL comedy:
- Point out the ironic, annoying, or contradictory aspects of everyday situations
- "Have you ever noticed..." style observations about modern life
- **CRITICAL: Blame the system/design/others who created the situation - never yourself**
- Highlight how the situation was DESIGNED to cause failure or problems
- Make it relatable - focus on universal frustrations caused by external forces
- Examples: smartphone glitches at crucial moments (blame the OS update), autocorrect disasters (blame the algorithm), social media timing fails (blame the platform)
- **The observation should deflect responsibility: "The system/design/people made this inevitable"**
- Avoid clichés: Find fresh angles on common annoyances, not tired old "traffic sucks" jokes`,

  'Deadpan': `Use DEADPAN comedy:
- State completely outrageous things in a serious, matter-of-fact tone
- No exclamation marks, no dramatics - just calm delivery of absurd content
- Use formal, professional language to describe ridiculous situations
- The humor comes from the contrast between tone and content
- Examples: "I was engaged in a minor territorial dispute with a swan" or "A series of cascading failures in my morning routine"
- Avoid clichés: Don't be boring - make the content wild but the delivery flat`,

  'Hyperbolic': `Use HYPERBOLIC comedy:
- Blow everything wildly out of proportion
- Use extreme exaggerations: "worst disaster in human history", "literally impossible"
- Stack superlatives and extremes: epic, catastrophic, unprecedented
- Make small problems into world-ending events
- Examples: missed alarm becomes "apocalyptic chronological failure", traffic becomes "automotive gridlock of biblical proportions"
- Avoid clichés: Don't just add "super" or "really" - go ridiculously over the top`,

  'Passive-aggressive': `Use PASSIVE-AGGRESSIVE comedy:
- Shift blame to others whilst maintaining plausible deniability
- Use phrases like "I would have finished if SOMEONE had...", "Apparently nobody thought to..."
- Imply incompetence or oversight from others without directly stating it
- Make it clear you're the victim of others' failures
- Examples: "I was waiting for the brief that never arrived" or "I assumed SOMEONE would mention the deadline change"
- Avoid clichés: Don't be overtly hostile - keep it subtle and pointed`,

  'Ironic': `Use IRONIC comedy:
- Say the opposite of what you mean to highlight contradictions
- Point out situations where the opposite of what should happen occurs
- Use dramatic irony - when trying to fix something makes it worse
- Highlight hypocrisy or contradictory outcomes
- Examples: "I was trying to be MORE responsible which is exactly why I'm late" or attempting to avoid a problem creates the problem
- Avoid clichés: Find genuine ironic twists, not just sarcasm`,

  'Meta': `Use META comedy:
- Break the 4th wall - acknowledge you're making an excuse
- Reference the fact that this is obviously an excuse
- Be self-aware about how ridiculous/transparent the excuse is
- Comment on the excuse-making process itself
- Examples: "I'm aware this sounds like an excuse, which it absolutely is, but..." or "The beauty of this explanation is that it's technically true while being completely misleading"
- Avoid clichés: Don't just say "I know this sounds fake" - play with the meta-ness creatively`,

  'Paranoid': `Use PARANOID/CONSPIRACY comedy:
- Connect unrelated events into elaborate conspiracy theories
- Everything is suspicious and interconnected
- Use phrases like "it's no coincidence that...", "they don't want you to know..."
- Build increasingly complex chains of cause and effect
- Examples: neighbors are in on it, corporations tracking you, elaborate schemes by mundane organizations
- Avoid clichés: Don't just say "Illuminati" - create specific, silly conspiracies`,

  'Corporate-jargon': `Use CORPORATE JARGON comedy:
- Drown the excuse in business buzzwords, management speak, and corporate nonsense
- Use phrases like "synergize", "leverage", "circle back", "move the needle", "paradigm shift"
- Turn simple failures into "strategic pivots" or "optimization opportunities"
- Reference frameworks, KPIs, OKRs, and other acronyms excessively
- Examples: "bandwidth constraints impacted deliverable velocity" or "a misalignment of stakeholder expectations created friction in the value stream"
- Avoid clichés: Don't just sprinkle buzzwords - build entire sentences of corporate gibberish that sound professional but mean nothing`
};

// ============================================================================
// EXCUSE STRUCTURE FUNDAMENTALS
// ============================================================================

const EXCUSE_STRUCTURE_FUNDAMENTALS = `
╔═══════════════════════════════════════════════════════════════════════════╗
║              EXCUSE STRUCTURE FUNDAMENTALS - READ THIS FIRST              ║
╔═══════════════════════════════════════════════════════════════════════════╗

An EXCUSE shifts blame externally. An EXPLANATION admits fault. You're writing EXCUSES.

✓ GOOD EXCUSE STRUCTURE:
  - Blame is EXTERNAL (technology, other people, circumstances, systems, nature, etc.)
  - You were the VICTIM of forces beyond your control
  - Never admit personal fault or incompetence
  - Address BOTH the action AND its consequences from the scenario

✗ BAD EXCUSE (Self-deprecating explanation):
  - "I ate all the snacks because I was nervous and have boundary issues"
  - This ADMITS fault ("I have boundary issues")
  - This is self-deprecating and doesn't shift blame

✓ GOOD EXCUSE (External blame):
  - "The snacks were strategically positioned by behavioral psychologists to trigger stress-eating responses in high-stakes meetings"
  - This BLAMES the snack positioning and behavioral manipulation
  - This makes you the victim of design choices

CRITICAL RULES:
1. **NEVER be self-deprecating** (unless you're using Passive-aggressive style to blame others)
2. **BLAME must be external** - technology, people, systems, nature, circumstances, conspiracies
3. **Address the FULL scenario** - if they mention consequences (being sick, being late, etc.), your excuse must address both the action AND the consequence
4. **Comedy ENHANCES blame-shifting** - it doesn't replace it. Funny + blame-shifting = great excuse.
5. **START WITH DEFENSIVE FRAMING** - Establish you're not at fault BEFORE explaining what happened

DEFENSIVE FRAMING - Lead with the defense:
An excuse should establish you're not at fault UPFRONT, before diving into the explanation.

Opening patterns to vary your approach (use different ones to avoid repetition):
• "Look, I know how this looks, but..."
• "Before you blame me, you need to know..."
• "This wasn't my fault - [external force] completely..."
• "I was completely blindsided by..."
• "This is entirely down to [external force]..."
• "Let me be clear: this was completely out of my hands..."
• "You're not going to believe this, but I had zero control over..."
• "I know what you're thinking, but..."

✓ GOOD - Defensive framing upfront:
"Look, I know how this looks, but this wasn't my fault. The catering company deployed..."

✗ BAD - Jumps straight to explanation (sounds neutral, not defensive):
"The catering company deployed..." (reads like explanation, not excuse)

Examples showing the difference:

Scenario: "I ate all the snacks and was sick"

❌ BAD (self-deprecating explanation):
"I have no self-control around food, especially when I'm anxious. I turned into a human hoover with boundary issues."

✓ GOOD (external blame with defensive framing):
"Look, I know how this looks, but this wasn't my fault. The catering company arranged those snacks in a pattern that neuroscientists have proven triggers compulsive consumption, and I'm convinced they knew the chocolate would react badly with the coffee temperature they served it at."

Scenario: "I missed the deadline"

❌ BAD (admits fault):
"I'm terrible at time management and got distracted by other things."

✓ GOOD (external blame with defensive framing):
"Before you blame me, you need to know: the calendar sync between Outlook and Slack created a temporal paradox where the deadline existed in two different timezones simultaneously, and I optimized for the wrong one."

Your excuse should make it clear that external forces, not personal failings, caused the problem.
`;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

function validateComedyStyle(style: string): boolean {
  if (style === 'surprise-me') return true;

  // Normalize frontend format to backend format
  const styleMap: Record<string, string> = {
    'absurdist': 'Absurdist',
    'observational': 'Observational',
    'deadpan': 'Deadpan',
    'hyperbolic': 'Hyperbolic',
    'passive-aggressive': 'Passive-aggressive',
    'ironic': 'Ironic',
    'meta': 'Meta',
    'paranoid': 'Paranoid',
    'corporate-jargon': 'Corporate-jargon'
  };

  const normalizedStyle = styleMap[style.toLowerCase()] || style;
  return VALID_COMEDY_STYLES.includes(normalizedStyle);
}

function validateNarrativeElements(elementIds: string[]): { valid: boolean; error?: string } {
  if (elementIds.length > 3) {
    return { valid: false, error: 'Maximum 3 narrative elements allowed' };
  }

  const allAvailable = getAllAvailableElements();
  const validIds = allAvailable.map(e => e.id);

  for (const id of elementIds) {
    if (!validIds.includes(id)) {
      return { valid: false, error: `Invalid narrative element ID: ${id}` };
    }
  }

  return { valid: true };
}

function validateExcuseFocus(focusId: string): boolean {
  return EXCUSE_FOCUS_OPTIONS.some(opt => opt.id === focusId);
}

// ============================================================================
// PROMPT BUILDING HELPERS
// ============================================================================

/**
 * Build the narrative elements section for the prompt
 * This is critical - must feel natural and additive, not constraining
 */
function buildNarrativeElementsPrompt(elementIds: string[]): string {
  if (elementIds.length === 0) return '';

  const allElements = getAllAvailableElements();
  const selectedElements = elementIds
    .map(id => allElements.find(e => e.id === id))
    .filter(e => e !== undefined)
    .map(e => e!.promptText);

  if (selectedElements.length === 0) return '';

  // Build a natural, empowering prompt section
  const elementList = selectedElements.map(text => `- ${text}`).join('\n');

  return `
SPECIAL INGREDIENTS (Weave these in naturally):
Your excuse should organically incorporate these elements:
${elementList}

These elements should enhance the comedy and fit naturally into your narrative.
Don't force them or make them feel like a checklist - let them arise organically
from the story you're telling. They're seasoning, not the main dish.
`;
}

/**
 * Build the excuse focus section for the prompt
 * Frame as comedic angle, not rigid constraint
 * Special handling for Robin Skidmore persona injection
 */
function buildExcuseFocusPrompt(focusId: string): string {
  if (focusId === 'let-ai-decide' || !focusId) return '';

  const focusOption = EXCUSE_FOCUS_OPTIONS.find(opt => opt.id === focusId);
  if (!focusOption || !focusOption.promptText) return '';

  let promptText = focusOption.promptText;

  // Special case: Replace Robin Skidmore placeholder with actual persona
  if (focusId === 'blame-robin-skidmore' && promptText.includes('ROBIN_SKIDMORE_PERSONA_PLACEHOLDER')) {
    const robinPersona = getRobinPersona();

    promptText = `The excuse should blame Robin Skidmore, CEO & Founder of Journey Further.

${robinPersona}

IMPORTANT MIXING INSTRUCTIONS:
- Mix generic CEO/founder stereotypes with Robin-specific details to keep excuses varied
- Sometimes lean heavily on generic CEO tropes: ambitious, workaholic, strategic pivots,
  "synergy" obsession, motivational speaker energy, hustle culture, vision boards, etc.
- Sometimes weave in Robin-specific details from the persona above
- Sometimes combine both approaches for maximum comedy
- Keep the tone affectionate and cheeky, never mean-spirited
- Make it clear the excuse is blaming Robin in a playful way (not genuinely malicious)
- You may refer to him informally as "Robin" if it fits the tone, or use "Robin Skidmore" for more formal excuses

This ensures each excuse about Robin feels fresh and unpredictable, not repetitive.`;
  }

  return `
EXCUSE FOCUS:
${promptText}
This is your comedic angle, but you still have creative freedom in execution.
`;
}

/**
 * Select the comedic style (random or custom)
 */
function selectComedyStyle(customStyle?: string): string {
  // If custom style provided and it's not "surprise-me", use it
  if (customStyle && customStyle !== 'surprise-me') {
    // Validate and normalize (frontend sends lowercase with hyphens, we need capitalized)
    const styleMap: Record<string, string> = {
      'absurdist': 'Absurdist',
      'observational': 'Observational',
      'deadpan': 'Deadpan',
      'hyperbolic': 'Hyperbolic',
      'passive-aggressive': 'Passive-aggressive',
      'ironic': 'Ironic',
      'meta': 'Meta',
      'paranoid': 'Paranoid',
      'corporate-jargon': 'Corporate-jargon'
    };

    const normalizedStyle = styleMap[customStyle.toLowerCase()] || customStyle;

    if (VALID_COMEDY_STYLES.includes(normalizedStyle)) {
      return normalizedStyle;
    }
  }

  // Default: random selection from RANDOM_COMEDY_STYLES (excludes niche styles)
  return RANDOM_COMEDY_STYLES[Math.floor(Math.random() * RANDOM_COMEDY_STYLES.length)];
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Please use POST.'
    });
  }

  // Check rate limit
  const rateLimitResult = checkRateLimit(req);
  if (rateLimitResult.limited) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generate-excuses',
      clientIp: clientIp,
      status: 'rate_limited',
      responseTimeMs: Date.now() - startTime
    }));
    return res.status(429).json({
      error: 'Too many requests. Please try again in a few moments.'
    });
  }

  try {
    const { scenario, audience, customOptions } = req.body as RequestBody;

    // Determine which model to use early (default to Claude)
    const aiModel = customOptions?.aiModel || 'claude';

    // Log request received
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generate-excuses',
      clientIp: clientIp,
      status: 'request_received',
      metadata: {
        scenario: scenario ? scenario.substring(0, 50) + (scenario.length > 50 ? '...' : '') : undefined,
        audience: audience,
        hasCustomOptions: !!customOptions,
        customStyle: customOptions?.style,
        narrativeElementsCount: customOptions?.narrativeElements?.length || 0,
        excuseFocus: customOptions?.excuseFocus,
        aiModel: aiModel
      }
    }));

    // ========================================================================
    // VALIDATION - Basic inputs
    // ========================================================================

    if (!scenario || !audience) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide scenario and audience.'
      });
    }

    if (typeof scenario !== 'string' || scenario.trim().length === 0) {
      return res.status(400).json({
        error: 'Scenario must be a non-empty string.'
      });
    }

    if (typeof audience !== 'string' || audience.trim().length === 0) {
      return res.status(400).json({
        error: 'Audience must be a non-empty string.'
      });
    }

    // Validate audience against whitelist
    if (!VALID_AUDIENCE_OPTIONS.includes(audience)) {
      return res.status(400).json({
        error: 'Invalid audience option.'
      });
    }

    if (scenario.length > 1000) {
      return res.status(400).json({
        error: 'Scenario is too long. Please limit to 1000 characters.'
      });
    }

    // ========================================================================
    // VALIDATION - Custom options
    // ========================================================================

    if (customOptions) {
      // Validate comedy style
      if (customOptions.style && !validateComedyStyle(customOptions.style)) {
        return res.status(400).json({
          error: `Invalid comedy style: ${customOptions.style}`
        });
      }

      // Validate narrative elements
      if (customOptions.narrativeElements) {
        const elementsValidation = validateNarrativeElements(customOptions.narrativeElements);
        if (!elementsValidation.valid) {
          return res.status(400).json({
            error: elementsValidation.error
          });
        }
      }

      // Validate excuse focus
      if (customOptions.excuseFocus && !validateExcuseFocus(customOptions.excuseFocus)) {
        return res.status(400).json({
          error: `Invalid excuse focus: ${customOptions.excuseFocus}`
        });
      }
    }

    // ========================================================================
    // API KEY CHECK & MODEL SELECTION
    // ========================================================================

    // Check for required API key based on model selection
    if (aiModel === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured');
        return res.status(500).json({
          error: 'Gemini API is not configured. Please try with Claude model.'
        });
      }
    } else {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.error('ANTHROPIC_API_KEY is not configured');
        return res.status(500).json({
          error: 'Server configuration error. Please contact support.'
        });
      }
    }

    // ========================================================================
    // STYLE SELECTION & PROMPT BUILDING
    // ========================================================================

    // Select the comedic style (random or custom)
    const selectedStyle = selectComedyStyle(customOptions?.style);

    // Build optional prompt sections
    const narrativeElementsPrompt = customOptions?.narrativeElements
      ? buildNarrativeElementsPrompt(customOptions.narrativeElements)
      : '';

    const excuseFocusPrompt = customOptions?.excuseFocus
      ? buildExcuseFocusPrompt(customOptions.excuseFocus)
      : '';

    // ========================================================================
    // BUILD CLAUDE PROMPT
    // ========================================================================

    const prompt = `You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

${EXCUSE_STRUCTURE_FUNDAMENTALS}

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: ${scenario}
AUDIENCE: ${audience}

Generate TWO excuses - one mundane, one comedic:

═══════════════════════════════════════════════════════════
EXCUSE 1 - THE BELIEVABLE EXCUSE (Mundane & Practical)
═══════════════════════════════════════════════════════════

This is your BORING excuse. Make it:
- Completely mundane and realistic
- Something that actually could have happened
- Short and to the point (2-5 sentences)
- An EXCUSE (explain what prevented you), not an apology
- Title: Short and boring (3-5 words) like "Traffic Delay" or "Phone Battery Died"

Examples of good mundane excuses:
• "My alarm didn't go off"
• "I got stuck in traffic"
• "My phone battery died and I didn't see your message"
• "I had a last-minute family emergency"

The humor comes from how BORING and ORDINARY this is compared to excuse 2.

═══════════════════════════════════════════════════════════
EXCUSE 2 - THE RISKY EXCUSE (${selectedStyle} Comedy Style)
═══════════════════════════════════════════════════════════

**REMEMBER: This is an EXCUSE (shifts blame externally), not an explanation (admits fault).**

${STYLE_INSTRUCTIONS[selectedStyle]}
${narrativeElementsPrompt}${excuseFocusPrompt}
REQUIREMENTS:
- **START WITH DEFENSIVE FRAMING**: Open with a phrase that establishes you're not at fault (e.g., "Look, I know how this looks, but...", "This wasn't my fault -", "Before you blame me..."). Vary your opening - don't use the same defensive phrase repeatedly.
- **CRITICAL: Shift blame externally - make it someone/something else's fault**
- **Address the FULL scenario**: If they mention being sick, late, missing something, etc. - address ALL of it
- Length: 3-7 sentences (you have room to develop the comedy)
- Make it FUNNY and highly creative within this comedic style
- Title: Short and punchy (4-6 words max)
- Appropriate for ${audience} but push comedic boundaries
- Be SPECIFIC and VIVID - avoid vague generic humor
- Find FRESH angles - avoid overused tropes for this style

FORMATTING - VERY IMPORTANT:
- If your excuse is 4+ sentences, break it into 2-3 paragraphs for readability
- Use double line breaks (\\n\\n) to separate paragraphs
- Each paragraph should be 2-3 sentences maximum
- This makes longer excuses easier to read and more impactful

CLOSING REINFORCEMENT (for longer excuses):
- If your excuse is 4+ sentences, consider ending with a final statement that reinforces blame deflection
- This helps remind the reader "this is an excuse, not just a story"
- Keep it natural to your comedy style - don't force it if the excuse already ends strongly
- Example closing types:
  • Blame deflection: "So really, who's to say this was my responsibility?"
  • Rhetorical question: "How was I supposed to know the algorithm would do that?"
  • Matter-of-fact conclusion: "Clearly beyond my control."
  • Victim framing: "If anything, I'm the real victim here."
- This is OPTIONAL - only use if it strengthens the excuse and flows naturally

CREATIVITY GUIDELINES:
✓ Be surprising and unexpected
✓ Layer multiple comedic elements
✓ Use vivid, specific details
✓ Make it distinctly different from generic "outrageous" excuses
✗ Don't rely on shock value alone
✗ Don't use tired clichés
✗ Don't be vague or generic

Remember: The two excuses should be POLAR OPPOSITES - one boring and realistic, one wildly comedic using ${selectedStyle} style.

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short boring title (3-5 words)",
    "text": "the mundane believable excuse (2-5 sentences)"
  },
  "excuse2": {
    "title": "short punchy title (4-6 words)",
    "text": "the ${selectedStyle} comedy excuse (3-7 sentences)"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.`;

    // ========================================================================
    // CALL AI API (CLAUDE OR GEMINI)
    // ========================================================================

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      let apiResponse;
      let excusesText: string;

      if (aiModel === 'gemini') {
        // Use Gemini API
        console.log('Using Gemini API for excuse generation');
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        apiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 4096,
            }
          }),
          signal: controller.signal
        });
      } else {
        // Use Claude API (default)
        console.log('Using Claude API for excuse generation');
        apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          }),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        console.error(`${aiModel === 'gemini' ? 'Gemini' : 'Claude'} API error:`, {
          status: apiResponse.status,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({
          error: 'Failed to generate excuses. Please try again.'
        });
      }

      const data = await apiResponse.json();

      // Parse API response based on model
      if (aiModel === 'gemini') {
        // Gemini response format
        excusesText = data.candidates[0].content.parts[0].text;
      } else {
        // Claude response format
        excusesText = data.content[0].text;
      }

      // Handle potential markdown code blocks
      const cleanedText = excusesText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      let excuses: ExcusesResponse;
      try {
        excuses = JSON.parse(cleanedText);
      } catch {
        console.error('Failed to parse Claude response:', cleanedText.substring(0, 200));
        return res.status(500).json({
          error: 'Failed to process excuses. Please try again.'
        });
      }

      // Validate response structure
      if (!excuses.excuse1 || !excuses.excuse2) {
        console.error('Invalid excuse structure');
        return res.status(500).json({
          error: 'Received invalid response format. Please try again.'
        });
      }

      // Return excuses to browser with the comedic style and excuse focus
      const response = {
        ...excuses,
        comedicStyle: selectedStyle,
        excuseFocus: customOptions?.excuseFocus
      };

      // Log successful response
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        endpoint: '/api/generate-excuses',
        clientIp: clientIp,
        status: 'success',
        responseTimeMs: Date.now() - startTime,
        metadata: {
          comedicStyle: selectedStyle,
          excuse1Length: excuses.excuse1.text.length,
          excuse2Length: excuses.excuse2.text.length
        }
      }));

      return res.status(200).json(response);

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      // Handle timeout specifically
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Claude API timeout after 30s');
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          endpoint: '/api/generate-excuses',
          clientIp: clientIp,
          status: 'error_timeout',
          responseTimeMs: Date.now() - startTime
        }));
        return res.status(504).json({
          error: 'Request timed out. Please try again.'
        });
      }

      console.error('Error calling Claude API:', fetchError);
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        endpoint: '/api/generate-excuses',
        clientIp: clientIp,
        status: 'error_api_call',
        responseTimeMs: Date.now() - startTime
      }));
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error generating excuses:', error);
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generate-excuses',
      clientIp: clientIp,
      status: 'error_unexpected',
      responseTimeMs: Date.now() - startTime
    }));
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}
