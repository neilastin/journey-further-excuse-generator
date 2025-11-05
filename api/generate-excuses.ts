import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  { id: 'barrister-pigeon', promptText: 'a pigeon wearing a barrister\'s wig' },
  { id: 'suspicious-duck', promptText: 'a suspicious-looking duck' },
  { id: 'shifty-dog', promptText: 'a dog with shifty, suspicious eyes' },
  { id: 'victorian-gentleman', promptText: 'a Victorian gentleman in a top hat and monocle' },
  { id: 'alien-involvement', promptText: 'alien presence or extraterrestrial technology' },
  { id: 'freak-weather', promptText: 'impossibly specific freak weather event (sideways hail, localized tornado, etc.)' },
  { id: 'robot-malfunction', promptText: 'a malfunctioning robot or AI system' },
  { id: 'time-traveler', promptText: 'a confused time traveler from the past or future' }
];

interface LimitedTimeElement extends NarrativeElement {
  startMonth: number;
  endMonth: number;
  startDay: number;
  endDay: number;
}

const LIMITED_TIME_ELEMENTS: LimitedTimeElement[] = [
  {
    id: 'cupid-revenge',
    promptText: 'Cupid or Valentine\'s Day-related romantic mishap',
    startMonth: 2, endMonth: 2, startDay: 1, endDay: 14
  },
  {
    id: 'easter-bunny',
    promptText: 'Easter Bunny causing chaos or mischief',
    startMonth: 3, endMonth: 4, startDay: 15, endDay: 30
  },
  {
    id: 'fireworks-disaster',
    promptText: 'explosive fireworks-related incident',
    startMonth: 7, endMonth: 7, startDay: 1, endDay: 14
  },
  {
    id: 'halloween-chaos',
    promptText: 'spooky Halloween-related supernatural event',
    startMonth: 10, endMonth: 10, startDay: 1, endDay: 31
  },
  {
    id: 'santa-fault',
    promptText: 'Santa Claus or Christmas elves causing problems',
    startMonth: 12, endMonth: 12, startDay: 1, endDay: 25
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
  { id: 'blame-technology', promptText: 'The excuse should primarily blame technology, apps, devices, or digital systems.' },
  { id: 'blame-nature', promptText: 'The excuse should primarily blame natural phenomena, weather, or environmental factors.' },
  { id: 'blame-animals', promptText: 'The excuse should primarily blame animals, pets, or wildlife.' },
  { id: 'blame-other-people', promptText: 'The excuse should primarily blame other people, strangers, or human interference.' },
  { id: 'blame-yourself', promptText: 'The excuse should primarily blame your own mistakes, incompetence, or poor judgment.' },
  { id: 'blame-universe', promptText: 'The excuse should primarily blame cosmic forces, fate, destiny, or universal conspiracies.' },
  { id: 'blame-transport', promptText: 'The excuse should primarily blame transportation issues, traffic, public transit, or vehicles.' },
  { id: 'blame-time', promptText: 'The excuse should primarily blame time paradoxes, temporal anomalies, or the nature of time itself.' }
];

// ============================================================================
// COMEDY STYLES & INSTRUCTIONS
// ============================================================================

const VALID_COMEDY_STYLES = [
  'Absurdist',
  'Observational',
  'Deadpan',
  'Hyperbolic',
  'Self-deprecating',
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
- Highlight the absurdity in normal social conventions or technology
- Make it relatable - focus on universal frustrations everyone experiences
- Examples: smartphone glitches at crucial moments, autocorrect disasters, social media timing fails
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

  'Self-deprecating': `Use SELF-DEPRECATING comedy:
- Make yourself the fool/incompetent one
- Highlight your own flaws, mistakes, or poor judgment
- Own the failure completely - you're the problem, not circumstances
- Be specific about your incompetence (can't read clocks, terrible at technology, etc.)
- Examples: "I have the spatial awareness of a concussed pigeon" or "My organizational skills peaked in kindergarten"
- Avoid clichés: Don't just say "I'm bad at things" - be creatively self-critical`,

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
- Avoid clichés: Don't just say "Illuminati" - create specific, silly conspiracies`
};

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
    'self-deprecating': 'Self-deprecating',
    'ironic': 'Ironic',
    'meta': 'Meta',
    'paranoid': 'Paranoid'
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
 */
function buildExcuseFocusPrompt(focusId: string): string {
  if (focusId === 'let-ai-decide' || !focusId) return '';

  const focusOption = EXCUSE_FOCUS_OPTIONS.find(opt => opt.id === focusId);
  if (!focusOption || !focusOption.promptText) return '';

  return `
EXCUSE FOCUS:
${focusOption.promptText}
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
      'self-deprecating': 'Self-deprecating',
      'ironic': 'Ironic',
      'meta': 'Meta',
      'paranoid': 'Paranoid'
    };

    const normalizedStyle = styleMap[customStyle.toLowerCase()] || customStyle;

    if (VALID_COMEDY_STYLES.includes(normalizedStyle)) {
      return normalizedStyle;
    }
  }

  // Default: random selection
  return VALID_COMEDY_STYLES[Math.floor(Math.random() * VALID_COMEDY_STYLES.length)];
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
        excuseFocus: customOptions?.excuseFocus
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
    // API KEY CHECK
    // ========================================================================

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured');
      return res.status(500).json({
        error: 'Server configuration error. Please contact support.'
      });
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

${STYLE_INSTRUCTIONS[selectedStyle]}
${narrativeElementsPrompt}${excuseFocusPrompt}
REQUIREMENTS:
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
    // CALL CLAUDE API
    // ========================================================================

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
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

      clearTimeout(timeoutId);

      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        console.error('Claude API error:', {
          status: apiResponse.status,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({
          error: 'Failed to generate excuses. Please try again.'
        });
      }

      const data = await apiResponse.json();

      // Parse Claude's JSON response
      const excusesText = data.content[0].text;

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

      // Return excuses to browser with the comedic style
      const response = {
        ...excuses,
        comedicStyle: selectedStyle
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
