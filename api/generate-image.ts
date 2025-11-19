import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Serverless function to generate AI images using Gemini API
 *
 * Security: API key accessed via process.env (server-side only)
 * Supports optional headshot compositing
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
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute (lower for image generation)

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
  excuseText: string;
  comedicStyle: string;
  headshotBase64?: string;
  headshotMimeType?: string;
  originalSituation?: string;
  keepSameClothes?: boolean;
  aspectRatio?: string;
  lusciousLocks?: boolean;
  excuseFocus?: string;
}

interface ImageResponse {
  imageUrl: string;
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

const VALID_ASPECT_RATIOS = ['16:9', '4:5', '9:16', '1:1'];

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
      endpoint: '/api/generate-image',
      clientIp: clientIp,
      status: 'rate_limited',
      responseTimeMs: Date.now() - startTime
    }));
    return res.status(429).json({
      error: 'Too many requests. Please try again in a few moments.'
    });
  }

  try {
    const { excuseText, comedicStyle, headshotBase64, headshotMimeType, originalSituation, keepSameClothes = true, aspectRatio = '16:9', lusciousLocks = false, excuseFocus } = req.body as RequestBody;

    // Log request received
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generate-image',
      clientIp: clientIp,
      status: 'request_received',
      metadata: {
        excuseTextLength: excuseText ? excuseText.length : 0,
        comedicStyle: comedicStyle,
        hasHeadshot: !!headshotBase64,
        headshotMimeType: headshotBase64 ? headshotMimeType : undefined
      }
    }));

    // Validate required inputs
    if (!excuseText) {
      return res.status(400).json({
        error: 'Excuse text is required.'
      });
    }

    if (!comedicStyle) {
      return res.status(400).json({
        error: 'Comedic style is required.'
      });
    }

    if (typeof excuseText !== 'string' || excuseText.trim().length === 0) {
      return res.status(400).json({
        error: 'Excuse text must be a non-empty string.'
      });
    }

    // Limit text length to prevent abuse
    if (excuseText.length > 2000) {
      return res.status(400).json({
        error: 'Excuse text is too long. Please limit to 2000 characters.'
      });
    }

    // Validate aspect ratio against whitelist
    if (aspectRatio && !VALID_ASPECT_RATIOS.includes(aspectRatio)) {
      return res.status(400).json({
        error: 'Invalid aspect ratio. Allowed values: 16:9, 4:5, 9:16, 1:1'
      });
    }

    // Validate headshot if provided
    if (headshotBase64) {
      if (!headshotMimeType) {
        return res.status(400).json({
          error: 'Headshot MIME type is required when providing a headshot.'
        });
      }

      // Validate MIME type
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedMimeTypes.includes(headshotMimeType)) {
        return res.status(400).json({
          error: 'Invalid image type. Only JPG and PNG are allowed.'
        });
      }

      // Check base64 size (rough estimate: 5MB = ~6.67MB base64)
      const maxBase64Size = 7 * 1024 * 1024; // 7MB base64 ≈ 5MB file
      if (headshotBase64.length > maxBase64Size) {
        return res.status(400).json({
          error: 'Image is too large. Please use an image under 5MB.'
        });
      }

      // Validate base64 format
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(headshotBase64)) {
        return res.status(400).json({
          error: 'Invalid image format. Please upload a valid image file.'
        });
      }

      // Validate that it's decodable
      try {
        Buffer.from(headshotBase64, 'base64');
      } catch {
        return res.status(400).json({
          error: 'Invalid image format. Please upload a valid image file.'
        });
      }
    }

    // Verify API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({
        error: 'Server configuration error. Please contact support.'
      });
    }

    // Visual style instructions matching comedic styles
    const visualStyleInstructions: Record<string, { withHeadshot: string; withoutHeadshot: string }> = {
      'Absurdist': {
        withHeadshot: `VISUAL STYLE: Absurdist/Surreal Photography
Create a photorealistic image with SURREAL, REALITY-BENDING elements. The subject's face/body must be photorealistic and 100% recognizable, but the scenario should defy logic and physics.

ABSURDIST VISUAL ELEMENTS:
- Impossible physics: floating objects, reversed gravity, size distortions, objects defying natural laws
- Surreal juxtapositions: everyday objects in impossible contexts
- Reality-bending: mirrors showing different realities, impossible perspectives, quantum effects
- Talking/sentient objects or animals (shown through visual cues, NOT text)
- Dreamlike atmosphere while maintaining photo quality

COMPOSITION & CAMERA:
- Slightly Dutch angle or unusual perspective to enhance surreality
- Subject photographed realistically but integrated into impossible scenario
- Natural photo quality with surreal content

LIGHTING:
- Realistic lighting on subject, but may include impossible light sources or shadows
- Dreamlike quality through lighting choices while keeping subject recognizable`,

        withoutHeadshot: `VISUAL STYLE: Absurdist/Surreal Photography
Create photorealistic environmental evidence with SURREAL, REALITY-BENDING elements. No main subject—focus on the aftermath or scenario proving this absurd excuse happened.

ABSURDIST VISUAL ELEMENTS:
- Impossible physics: floating objects, reversed gravity, size distortions
- Surreal juxtapositions: everyday objects in impossible contexts
- Reality-bending visual evidence: quantum effects, dimensional anomalies
- Environmental clues that defy logic
- Dreamlike atmosphere while maintaining photo quality

COMPOSITION:
- Focus on environmental evidence and surreal elements
- Documentary style capturing impossible scenarios
- Unusual angles that enhance surreality`
      },

      'Observational': {
        withHeadshot: `VISUAL STYLE: Modern Life Photography / Perfect Timing
Create a photorealistic image capturing RELATABLE MODERN FRUSTRATIONS with perfect comic timing. The subject must be 100% recognizable, caught in a universally relatable fail moment.

OBSERVATIONAL VISUAL ELEMENTS:
- Technology fails: phone glitches, autocorrect disasters visible on screens
- Modern life ironies: delivery notifications, app notifications at worst time
- Perfect timing captures: mid-spill, mid-trip, moment of realization
- Relatable everyday settings: coffee shop, office, home, public transit
- Small details everyone recognizes: charging cables tangled, "no signal" indicators

COMPOSITION & CAMERA:
- Candid, documentary-style capture of the moment
- Natural angles like smartphone photos or security cameras
- Subject's expression of recognition/frustration/embarrassment clearly visible

LIGHTING:
- Natural, realistic lighting (indoor fluorescent, natural daylight, phone screen glow)
- Authentic photo quality - not posed, caught in the moment`,

        withoutHeadshot: `VISUAL STYLE: Modern Life Photography / Environmental Evidence
Create photorealistic evidence of RELATABLE MODERN FRUSTRATIONS. Focus on environmental details everyone will recognize and relate to.

OBSERVATIONAL VISUAL ELEMENTS:
- Technology fail evidence: cracked phone screens, error messages, dead batteries
- Modern life ironies visible in the scene
- Everyday settings with perfect comic timing details
- Small frustrations made visible: spilled coffee, missed notifications
- Environmental storytelling through relatable objects

COMPOSITION:
- Documentary/candid style capturing aftermath
- Natural, unposed environmental evidence
- Focus on details everyone has experienced`
      },

      'Deadpan': {
        withHeadshot: `VISUAL STYLE: Serious Documentary / Editorial Photography
Create a FORMALLY COMPOSED, PROFESSIONALLY SHOT photograph of absurd content. Treat ridiculous subject matter with absolute seriousness. The subject must be 100% recognizable, photographed with professional gravitas.

DEADPAN VISUAL ELEMENTS:
- Formal composition: centered framing, rule-of-thirds, professional portrait techniques
- Serious documentary style: National Geographic, editorial magazine aesthetic
- Subject maintaining neutral/serious expression while situation is absurd
- Professional lighting and staging of ridiculous scenario
- Contrast between professional photography and silly content

COMPOSITION & CAMERA:
- Formal, professional framing
- Serious portrait photography techniques
- Subject looking dignified despite absurd context
- Clean, uncluttered professional composition

LIGHTING:
- Professional editorial lighting: soft key light, fill light, clean shadows
- Studio quality or professional environmental lighting
- Dramatic but controlled lighting emphasizing formality`,

        withoutHeadshot: `VISUAL STYLE: Serious Documentary / Editorial Photography
Create FORMALLY COMPOSED, PROFESSIONALLY SHOT environmental evidence. Treat absurd scenario with documentary seriousness.

DEADPAN VISUAL ELEMENTS:
- Formal documentary composition
- Professional editorial style treatment of silly evidence
- Serious staging of absurd aftermath
- National Geographic / editorial magazine aesthetic
- Clean, professional presentation of ridiculous scenario

COMPOSITION:
- Formal, symmetrical framing
- Professional documentation style
- Serious treatment of absurd evidence

LIGHTING:
- Professional documentary lighting
- Clean, controlled shadows
- Editorial quality presentation`
      },

      'Hyperbolic': {
        withHeadshot: `VISUAL STYLE: Epic Dramatic / Movie Poster Photography
Create a DRAMATICALLY COMPOSED, CINEMATICALLY LIT photograph treating mundane failure as EPIC CATASTROPHE. The subject must be 100% recognizable, shot like an action movie hero in their moment of defeat.

HYPERBOLIC VISUAL ELEMENTS:
- Extreme dramatic composition: low angle hero shots, epic scale
- Exaggerated destruction or chaos (way beyond what actually happened)
- Cinematic lighting: dramatic rim lighting, god rays, lens flares
- Smoke, sparks, debris, dramatic atmosphere effects
- Movie poster treatment: subject as tragic hero of mundane disaster
- Massive scale: make small problems look world-ending

COMPOSITION & CAMERA:
- Low angle hero shots or high angle disaster shots
- Cinematic wide angles showing epic scope
- Dramatic depth and layering
- Subject positioned like movie protagonist

LIGHTING:
- Dramatic Hollywood lighting: strong rim lights, atmospheric beams
- High contrast, moody shadows
- Cinematic color grading feel
- Epic sunset/explosion/dramatic sky lighting`,

        withoutHeadshot: `VISUAL STYLE: Epic Dramatic / Disaster Photography
Create CINEMATICALLY COMPOSED environmental evidence of EPIC CATASTROPHE from mundane situation. Treat small fail as world-ending disaster.

HYPERBOLIC VISUAL ELEMENTS:
- Extreme destruction scale (way beyond reality)
- Dramatic aftermath: smoke, debris, chaos
- Epic environmental composition
- Cinematic atmosphere effects
- Disaster movie aesthetic for trivial problem

COMPOSITION:
- Epic wide shots showing massive scope
- Dramatic angles emphasizing scale
- Cinematic disaster photography

LIGHTING:
- Dramatic Hollywood disaster lighting
- Epic atmospheric effects
- High contrast, moody cinematography`
      },

      'Ironic': {
        withHeadshot: `VISUAL STYLE: Situational Irony Photography
Create a photorealistic image showcasing VISUAL IRONY and CONTRADICTION. The subject must be 100% recognizable in a situation that's the OPPOSITE of what they intended. Show the ironic twist visually.

IRONIC VISUAL ELEMENTS:
- Visual contradictions: safety equipment causing injury, help making things worse
- Ironic signage or context: "Be Careful" signs in background of accident
- Attempts to fix something making it worse (visible in progression)
- Formal setting for casual fail OR casual setting for formal disaster
- Before/after visual storytelling showing ironic outcome
- Context clues showing good intentions leading to opposite result

COMPOSITION & CAMERA:
- Frame to show the ironic elements clearly
- Include contradictory environmental details
- Subject's expression showing realization of irony
- Compositional elements that highlight the contradiction

LIGHTING:
- Natural, realistic lighting that clearly shows ironic details
- Even lighting so contradictions are visible
- Clear documentation of the ironic situation`,

        withoutHeadshot: `VISUAL STYLE: Situational Irony Photography
Create environmental evidence showcasing VISUAL IRONY. Show how attempting to solve a problem created the opposite result.

IRONIC VISUAL ELEMENTS:
- Visual contradictions in the environment
- Ironic signage or warnings visible
- Evidence of well-intentioned actions backfiring
- Context showing opposite outcome from intention
- Environmental irony clearly visible

COMPOSITION:
- Frame contradictory elements together
- Show ironic context clearly
- Environmental storytelling of backfired plan

LIGHTING:
- Clear, even lighting showing all ironic details
- Natural documentary lighting
- Honest capture of contradictory situation`
      },

      'Meta': {
        withHeadshot: `VISUAL STYLE: Self-Aware / Fourth Wall Breaking Photography
Create a photorealistic image that ACKNOWLEDGES IT'S A STAGED EXCUSE PHOTO. The subject must be 100% recognizable and CLEARLY AWARE they're making an excuse. Break the fourth wall visually.

META VISUAL ELEMENTS:
- Subject making direct eye contact with camera (knowing look)
- Obvious staging visible: props clearly arranged, backdrop visible
- Behind-the-scenes elements visible: lights, crew, equipment edges in frame
- Subject's expression: "yeah, this is clearly fake" acknowledgment
- Visible quotation marks or air quotes gestures
- Self-aware composition: obviously posed, transparently staged
- Photos-within-photos: subject holding evidence they're clearly faking

COMPOSITION & CAMERA:
- Subject looking directly at camera with knowing expression
- Frame includes "backstage" elements showing it's staged
- Obvious posing, transparent setup
- Meta visual layers

LIGHTING:
- Professional studio lighting visible in frame
- Obvious artificial lighting acknowledging the setup
- Light stands or equipment visible at edges`,

        withoutHeadshot: `VISUAL STYLE: Transparently Staged Evidence
Create environmental evidence that OBVIOUSLY LOOKS STAGED. Make it clear this "evidence" was arranged for the excuse.

META VISUAL ELEMENTS:
- Clearly arranged/staged environment
- Props obviously placed
- Behind-the-scenes setup visible
- Transparently fake evidence
- Self-aware staging

COMPOSITION:
- Obvious staging visible
- Arranged elements clearly posed
- Transparent setup

LIGHTING:
- Obvious studio or staged lighting
- Artificial setup clearly visible
- Transparent photographic setup`
      },

      'Paranoid': {
        withHeadshot: `VISUAL STYLE: Conspiracy / Surveillance Photography
Create a photorealistic image with PARANOID, UNDER-SURVEILLANCE aesthetic. The subject must be 100% recognizable, photographed like they're being watched or documented as part of an elaborate conspiracy.

PARANOID VISUAL ELEMENTS:
- Surveillance camera aesthetic: security camera angles, timestamp overlays (short!)
- Dramatic shadows suggesting being watched
- Environmental clues of conspiracy: mysterious figures in background (blurred/distant)
- Red string/conspiracy board aesthetic in background
- Multiple perspectives/cameras suggested
- Ominous tracking or documentation feel
- Hidden camera, caught-on-tape aesthetic

COMPOSITION & CAMERA:
- Surveillance camera angles: high corner angles, security cam POV
- Subject unaware they're being watched (or very aware and paranoid)
- Unsettling framing suggesting observation
- Security footage aesthetic

LIGHTING:
- Harsh, unflattering surveillance lighting
- Dramatic shadows suggesting lurking presence
- Security camera night vision feel OR harsh fluorescent
- Ominous atmospheric lighting`,

        withoutHeadshot: `VISUAL STYLE: Conspiracy / Surveillance Evidence
Create environmental evidence with PARANOID, UNDER-SURVEILLANCE aesthetic. Document the conspiracy scene.

PARANOID VISUAL ELEMENTS:
- Surveillance camera aesthetic
- Security footage style
- Conspiracy evidence scattered in environment
- Ominous tracking/documentation feel
- Hidden camera, caught-on-tape aesthetic
- Mysterious surveillance documentation

COMPOSITION:
- Security camera angles
- Surveillance POV framing
- Evidence documentation style
- Unsettling observation angles

LIGHTING:
- Harsh surveillance lighting
- Security camera aesthetic
- Ominous shadows
- Night vision or harsh fluorescent`
      },

      'Passive-aggressive': {
        withHeadshot: `VISUAL STYLE: Passive-Aggressive / Subtle Hostility Photography
Create a photorealistic image with SUBTLY HOSTILE, PASSIVE-AGGRESSIVE atmosphere. The subject should appear innocent on the surface but with underlying tension and subtle blame-shifting energy.

PASSIVE-AGGRESSIVE VISUAL ELEMENTS:
- Subject with a "helpful" smile that doesn't reach their eyes
- Overly polite body language with subtle hostility
- Strategic positioning that says "I tried to help but..."
- Props showing evidence of others' failures
- Background elements that subtly shift blame

COMPOSITION:
- Subject positioned as the "helpful victim"
- Evidence of others' mistakes prominently displayed
- Sympathetic framing that implies "I did my part"
- Strategic placement of blame-shifting props

LIGHTING:
- Clean, professional lighting (nothing to hide)
- Slightly cold, clinical feel
- Even lighting that says "everything is fine"
- No dramatic shadows (we're being reasonable here)`,

        withoutHeadshot: `VISUAL STYLE: Passive-Aggressive / Subtle Hostility Evidence
Create environmental evidence with PASSIVE-AGGRESSIVE, BLAME-SHIFTING aesthetic. Show a scene that subtly implies someone else is at fault.

PASSIVE-AGGRESSIVE VISUAL ELEMENTS:
- Evidence of "helpful" attempts
- Signs of others' incompetence
- Sticky notes with "helpful reminders"
- Printed emails or documentation
- Evidence arranged to shift blame

COMPOSITION:
- Scene that tells a story of "I tried"
- Props showing others' failures
- Evidence strategically arranged
- Sympathetic victim framing

LIGHTING:
- Clinical, professional lighting
- Everything clearly visible (nothing hidden)
- Cold, sterile feel
- Evidence well-lit for documentation`
      },

      'Corporate-jargon': {
        withHeadshot: `VISUAL STYLE: Corporate / Business Stock Photography
Create a photorealistic image with CORPORATE, BUSINESS PROFESSIONAL aesthetic. The subject should appear as a typical corporate professional in a business environment.

CORPORATE VISUAL ELEMENTS:
- Subject in business attire
- Corporate office environment
- Business props (laptops, charts, whiteboards)
- Meeting room or office setting
- Professional corporate demeanor
- Business buzzword materials (synergy charts, etc.)

COMPOSITION:
- Classic corporate photography angles
- Subject positioned professionally
- Business-appropriate framing
- Stock photo-style composition

LIGHTING:
- Clean corporate office lighting
- Professional, well-lit environment
- Bright, optimistic corporate feel
- Standard office fluorescent or natural light`,

        withoutHeadshot: `VISUAL STYLE: Corporate / Business Environment Evidence
Create environmental evidence with CORPORATE, BUSINESS aesthetic. Show a corporate office scene with business elements.

CORPORATE VISUAL ELEMENTS:
- Corporate office environment
- Business materials and props
- Charts, graphs, whiteboards
- Meeting room or desk setup
- Corporate documentation
- Business buzzword materials

COMPOSITION:
- Corporate stock photo style
- Professional business framing
- Office environment focus
- Business materials prominently displayed

LIGHTING:
- Standard corporate lighting
- Clean, professional feel
- Well-lit office environment
- Bright, corporate aesthetic`
      }
    };

    // Build the appropriate prompt based on style and headshot presence
    const styleInstructions = visualStyleInstructions[comedicStyle];
    if (!styleInstructions) {
      return res.status(400).json({
        error: 'Invalid comedic style provided.'
      });
    }

    let prompt: string;

    // Build clothing instruction based on preference
    const clothingInstruction = keepSameClothes
      ? `CLOTHING: Keep the subject wearing the EXACT same clothes as in the reference photo. Do not change or modify their outfit.`
      : `CLOTHING: Feel free to creatively dress the subject in appropriate attire for the scenario. The outfit should enhance the comedic effect while fitting the situation.`;

    // Build hair instruction based on luscious locks mode
    const hairInstruction = lusciousLocks
      ? `HAIR (LUSCIOUS LOCKS MODE - CRITICAL OVERRIDE):
✓ IGNORE the subject's original hair completely
✓ Give the subject LONG, FLOWING, LUXURIOUS BLONDE HAIR
✓ The hair should be glamorous, voluminous, and flowing dramatically
✓ Think shampoo commercial, golden goddess, fairy tale princess vibes
✓ This supersedes ALL other hair instructions - blonde luscious locks no matter what

CAMERA DISTANCE (CRITICAL FOR LUSCIOUS LOCKS):
✓ Subject MUST be at MIDDLE DISTANCE or CLOSER to camera
✓ Face and flowing blonde hair must be clearly visible and recognizable
✗ NO far shots, wide shots, or distant compositions
✗ Subject cannot be tiny or far away - the hair transformation must be obvious`
      : `HAIR (CRITICAL - DO NOT CHANGE):
✓ HAIR must match EXACTLY from reference photo - same color, length, style, texture
✓ This is NON-NEGOTIABLE - the subject's hair is part of their identity
✗ NEVER change hair color (no darkening, lightening, or color shifts)
✗ NEVER change hair length (no shortening or lengthening)
✗ NEVER change hair style (no curling straight hair, straightening curly hair)
✗ NEVER add or remove facial hair
✗ Treat the hair exactly like the face - it must remain unchanged`;

    if (headshotBase64) {
      // With headshot - composite the person into the scene
      // Include original situation if provided for better context
      const contextSection = originalSituation
        ? `ORIGINAL SITUATION: ${originalSituation}

GENERATED EXCUSE: ${excuseText}

YOUR TASK: Create an image that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation. Focus on making the excuse believable through visual "evidence".`
        : `EXCUSE CONTEXT: ${excuseText}

YOUR TASK: Photograph this person in a scenario visually depicting their excuse.`;

      prompt = `${styleInstructions.withHeadshot}

${contextSection}

The subject's IDENTITY must remain recognizable (same person), but you have creative freedom with their EXPRESSION and BODY LANGUAGE to match the scenario - they can look surprised, guilty, confused, innocent, etc. as appropriate for the excuse.

${clothingInstruction}

═══ CRITICAL RULES ═══

PEOPLE RULES:
✓ ONLY the uploaded person/people may appear
✓ Keep their IDENTITY recognizable (same facial features = same person)
✓ EXPRESSIONS can change to fit scenario (surprised, guilty, innocent, etc.)
✓ Anonymous strangers in functional roles OK if essential (cop, waiter, random crowd)
✗ NEVER: partners, family, friends, coworkers, anyone with personal relationship
✗ When unsure, show subject alone

${hairInstruction}

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words - AI text becomes gibberish
✗ NO documents, newspapers, books, signs with multiple lines
✗ NO speech bubbles with sentences
✓ Single words only if essential ("STOP", "EXIT")
✓ Focus on VISUAL storytelling, not text

PHOTO QUALITY:
- Photorealistic subject integrated naturally into styled scenario
- Proper lighting, shadows, perspective on subject
- Subject appears to genuinely inhabit this world
- ${aspectRatio} aspect ratio`;
    } else {
      // Without headshot - generate generic scenario
      // Include original situation if provided for better context
      const contextSection = originalSituation
        ? `ORIGINAL SITUATION: ${originalSituation}

GENERATED EXCUSE: ${excuseText}

YOUR TASK: Create environmental evidence that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation.`
        : `EXCUSE CONTEXT: ${excuseText}

YOUR TASK: Create environmental evidence proving this excuse happened.`;

      prompt = `${styleInstructions.withoutHeadshot}

${contextSection}

Focus on the scene, aftermath, or objects - NOT people (we don't know what they look like). Photorealistic quality following the visual style.

═══ CRITICAL RULES ═══

PEOPLE RULES:
✗ NO specific identifiable people (we don't know the excuse-maker)
✓ Anonymous generic people OK if essential (distant cop, crowd, stock-photo-style extras)
✗ NEVER: anyone appearing to have personal relationships
✗ When unsure, focus on environment only

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words - AI text becomes gibberish
✗ NO documents, newspapers, books, signs with multiple lines
✗ NO speech bubbles with sentences
✓ Single words only if essential ("STOP", "EXIT")
✓ Focus on VISUAL storytelling, not text

PHOTO QUALITY:
- Photorealistic environmental evidence
- Professional quality following visual style
- Scenario details clearly visible
- ${aspectRatio} aspect ratio`;
    }

    // Call Gemini 2.5 Flash Image API for image generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for image generation

    try {
      // Build the request parts array
      const requestParts: Array<{ inline_data?: { mime_type: string; data: string }; text?: string }> = [];

      // Check if we need to include Robin Skidmore
      const isRobinBlamed = excuseFocus === 'blame-robin-skidmore';
      let robinHeadshotBase64: string | null = null;

      // Debug logging for Robin detection
      console.log(`Robin detection - excuseFocus: ${excuseFocus}, isRobinBlamed: ${isRobinBlamed}`);

      if (isRobinBlamed) {
        // Load Robin's headshot from public folder
        try {
          const robinPath = path.join(process.cwd(), 'public', 'ref-7k2m9x.png');
          console.log(`Attempting to load Robin headshot from: ${robinPath}`);
          const robinBuffer = fs.readFileSync(robinPath);
          robinHeadshotBase64 = robinBuffer.toString('base64');
          console.log(`Successfully loaded Robin headshot, size: ${robinBuffer.length} bytes`);
        } catch (err) {
          console.error('Failed to load Robin Skidmore headshot:', err);
          // Continue without Robin's headshot if it fails
        }
      }

      // Add headshots based on scenario
      if (isRobinBlamed && robinHeadshotBase64) {
        if (headshotBase64 && headshotMimeType) {
          // User + Robin scenario: add user's photo first, then Robin's
          requestParts.push({
            inline_data: {
              mime_type: headshotMimeType,
              data: headshotBase64
            }
          });
          requestParts.push({
            inline_data: {
              mime_type: 'image/png',
              data: robinHeadshotBase64
            }
          });

          // Build prompt for User + Robin scenario
          const userHairInstruction = lusciousLocks
            ? `FIRST PERSON (User) HAIR (LUSCIOUS LOCKS MODE):
✓ Give them LONG, FLOWING, LUXURIOUS BLONDE HAIR
✓ Glamorous, voluminous, flowing dramatically`
            : `FIRST PERSON (User) HAIR (CRITICAL - DO NOT CHANGE):
✓ Match EXACTLY from their reference photo - same color, length, style, texture
✗ NEVER change hair color, length, or style - this is NON-NEGOTIABLE`;

          const robinHairInstruction = lusciousLocks
            ? `SECOND PERSON (Robin) HAIR (LUSCIOUS LOCKS MODE):
✓ Give Robin LONG, FLOWING, LUXURIOUS BLONDE HAIR
✓ Glamorous, voluminous, flowing dramatically`
            : `SECOND PERSON (Robin) HAIR:
✓ Keep Robin's short dark hair exactly as shown`;

          const cameraDistanceInstruction = lusciousLocks
            ? `CAMERA DISTANCE (CRITICAL FOR LUSCIOUS LOCKS):
✓ BOTH subjects MUST be at MIDDLE DISTANCE or CLOSER to camera
✓ Faces and flowing blonde hair must be clearly visible and recognizable
✗ NO far shots, wide shots, or distant compositions

LUSCIOUS LOCKS WITH TWO PEOPLE - FACE PRESERVATION (CRITICAL):
✓ ONLY the hair changes to luscious blonde locks - NOTHING ELSE
✓ Every facial feature must remain EXACTLY as in reference photos
✓ Eyes, nose, mouth, face shape, skin tone - ALL UNCHANGED
✓ The hair transformation is the joke - the faces make it recognizable
✓ If facial features change, the humor is LOST
✗ Do NOT let the blonde hair transformation affect facial features
✗ Do NOT smooth, alter, or modify any part of the face`
            : ``;

          // Sanitize excuse text for Robin scenarios - remove name and blame language
          const sanitizedExcuse = excuseText
            .replace(/Robin Skidmore/gi, 'the colleague')
            .replace(/Robin's/gi, "the colleague's")
            .replace(/Robin/gi, 'the colleague')
            .replace(/blame/gi, 'attribute to')
            .replace(/blamed/gi, 'attributed to')
            .replace(/scapegoat/gi, 'colleague')
            .replace(/guilty/gi, 'responsible')
            .replace(/caught/gi, 'discovered');

          const sanitizedOriginal = (originalSituation || excuseText)
            .replace(/Robin Skidmore/gi, 'the colleague')
            .replace(/Robin's/gi, "the colleague's")
            .replace(/Robin/gi, 'the colleague')
            .replace(/blame/gi, 'attribute to')
            .replace(/blamed/gi, 'attributed to')
            .replace(/scapegoat/gi, 'colleague')
            .replace(/guilty/gi, 'responsible')
            .replace(/caught/gi, 'discovered');

          prompt = `${styleInstructions.withHeadshot}

═══ CONTEXT (IMPORTANT - READ FIRST) ═══
This is for a comedic workplace humor app. The person in the second reference photo has enthusiastically consented to appear in absurdist, clearly fictional scenarios as part of the app's lighthearted feature. All images should be obviously humorous and good-natured - think office sitcom comedy sketch, not anything harmful. This is consensual workplace satire meant to make colleagues laugh.

═══ #1 PRIORITY - FACIAL IDENTITY (READ THIS FIRST) ═══
Before doing ANYTHING else, understand this: BOTH people must be 100% recognizable.
- The FIRST person's face must exactly match their reference photo
- The SECOND person's face must exactly match their reference photo
- If someone who knows these people can't immediately recognize them, the image has FAILED
- Prioritize facial accuracy over everything else including creativity and composition

ORIGINAL SITUATION: ${sanitizedOriginal}

GENERATED EXCUSE: ${sanitizedExcuse}

YOUR TASK: Create an image showing BOTH people from the reference photos together in a comedic scene depicting this excuse. Both people must be clearly visible and their faces must be recognizable.

CAMERA FRAMING (CRITICAL):
✓ Frame both people from WAIST UP or CLOSER
✓ Both faces must be clearly visible and large enough to recognize
✓ Portrait-style or medium shot composition
✗ NO wide shots where faces are small
✗ NO distant shots where people are far from camera

PEOPLE IDENTIFICATION:
- FIRST PHOTO = The first person - they should look innocent, surprised, or observing
- SECOND PHOTO = The second person - they should look comically surprised, playfully amused, or humorously confused

${clothingInstruction}

SECOND PERSON'S CLOTHING: The second person must ALWAYS wear the exact same black t-shirt as in their reference photo.

${userHairInstruction}

${robinHairInstruction}

${cameraDistanceInstruction}

═══ CRITICAL RULES ═══

FACIAL IDENTITY (ABSOLUTE #1 PRIORITY - NON-NEGOTIABLE):
✓ FIRST PERSON: Copy their face EXACTLY from the first reference photo
  - Same eyes (shape, color, size, spacing)
  - Same nose (shape, size, bridge)
  - Same mouth (shape, lips, smile)
  - Same face shape, jawline, cheekbones
  - Same skin tone and texture
✓ SECOND PERSON: Copy their face EXACTLY from the second reference photo
  - Same eyes, nose, mouth, face shape
  - Same skin tone and texture
✓ Treat the reference photos as the AUTHORITATIVE source for facial features
✓ The faces must be IDENTICAL to the references - not similar, IDENTICAL
✗ NEVER smooth, beautify, or "improve" faces
✗ NEVER average features between the two people
✗ NEVER let the scenario influence facial features
✗ If you can't tell who the people are, START OVER

PEOPLE RULES:
✓ BOTH people from the reference photos MUST appear
✓ First person = innocent/observing expression, Second person = comically surprised/playfully amused expression
✓ Dynamic interaction showing comedic scenario
✗ NO other identifiable people with personal relationships

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words
✓ Focus on VISUAL storytelling

PHOTO QUALITY:
- Photorealistic subjects integrated naturally
- Proper lighting, shadows, perspective
- ${aspectRatio} aspect ratio`;
        } else {
          // Robin alone scenario: just add Robin's photo
          requestParts.push({
            inline_data: {
              mime_type: 'image/png',
              data: robinHeadshotBase64
            }
          });

          // Build prompt for Robin alone scenario - use same structure as normal user headshot
          const robinHairInstruction = lusciousLocks
            ? `HAIR (LUSCIOUS LOCKS MODE - CRITICAL OVERRIDE):
✓ IGNORE Robin's original hair completely
✓ Give Robin LONG, FLOWING, LUXURIOUS BLONDE HAIR
✓ The hair should be glamorous, voluminous, and flowing dramatically
✓ Think shampoo commercial, golden goddess, fairy tale princess vibes
✓ This supersedes ALL other hair instructions - blonde luscious locks no matter what

CAMERA DISTANCE (CRITICAL FOR LUSCIOUS LOCKS):
✓ Subject MUST be at MIDDLE DISTANCE or CLOSER to camera
✓ Face and flowing blonde hair must be clearly visible and recognizable
✗ NO far shots, wide shots, or distant compositions
✗ Subject cannot be tiny or far away - the hair transformation must be obvious`
            : `HAIR (CRITICAL - DO NOT CHANGE):
✓ HAIR must match EXACTLY from reference photo - same color, length, style, texture
✓ This is NON-NEGOTIABLE - the subject's hair is part of their identity
✗ NEVER change hair color (no darkening, lightening, or color shifts)
✗ NEVER change hair length (no shortening or lengthening)
✗ NEVER change hair style (no curling straight hair, straightening curly hair)
✗ NEVER add or remove facial hair
✗ Treat the hair exactly like the face - it must remain unchanged`;

          // Use the same context section structure as normal flow
          const contextSection = originalSituation
            ? `ORIGINAL SITUATION: ${originalSituation}

GENERATED EXCUSE: ${excuseText}

YOUR TASK: Create an image that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation. Focus on making the excuse believable through visual "evidence".`
            : `EXCUSE CONTEXT: ${excuseText}

YOUR TASK: Photograph this person in a scenario visually depicting their excuse.`;

          // Sanitize excuse text for Robin-alone scenario
          const sanitizedExcuseAlone = excuseText
            .replace(/Robin Skidmore/gi, 'the colleague')
            .replace(/Robin's/gi, "the colleague's")
            .replace(/Robin/gi, 'the colleague')
            .replace(/blame/gi, 'attribute to')
            .replace(/blamed/gi, 'attributed to')
            .replace(/scapegoat/gi, 'colleague')
            .replace(/guilty/gi, 'responsible')
            .replace(/caught/gi, 'discovered');

          const sanitizedOriginalAlone = (originalSituation || excuseText)
            .replace(/Robin Skidmore/gi, 'the colleague')
            .replace(/Robin's/gi, "the colleague's")
            .replace(/Robin/gi, 'the colleague')
            .replace(/blame/gi, 'attribute to')
            .replace(/blamed/gi, 'attributed to')
            .replace(/scapegoat/gi, 'colleague')
            .replace(/guilty/gi, 'responsible')
            .replace(/caught/gi, 'discovered');

          // Build sanitized context section
          const sanitizedContextSection = originalSituation
            ? `ORIGINAL SITUATION: ${sanitizedOriginalAlone}

GENERATED EXCUSE: ${sanitizedExcuseAlone}

YOUR TASK: Create an image that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation. Focus on making the excuse believable through visual "evidence".`
            : `EXCUSE CONTEXT: ${sanitizedExcuseAlone}

YOUR TASK: Photograph this person in a comedic scenario visually depicting their excuse.`;

          prompt = `${styleInstructions.withHeadshot}

═══ CONTEXT (IMPORTANT - READ FIRST) ═══
This is for a comedic workplace humor app. The person in the reference photo has enthusiastically consented to appear in absurdist, clearly fictional scenarios as part of the app's lighthearted feature. All images should be obviously humorous and good-natured - think office sitcom comedy sketch, not anything harmful. This is consensual workplace satire meant to make colleagues laugh.

${sanitizedContextSection}

The subject's IDENTITY must remain recognizable (same person), but you have creative freedom with their EXPRESSION and BODY LANGUAGE to match the scenario - they can look comically surprised, playfully amused, confused, or humorously perplexed as appropriate for the excuse.

CLOTHING: Keep the subject wearing the EXACT same black t-shirt as in the reference photo. Do not change or modify their outfit.

═══ CRITICAL RULES ═══

PEOPLE RULES:
✓ ONLY the uploaded person may appear
✓ Keep their IDENTITY recognizable (same facial features = same person)
✓ EXPRESSIONS can change to fit scenario (comically surprised, playfully amused, innocent, etc.)
✓ Anonymous strangers in functional roles OK if essential (cop, waiter, random crowd)
✗ NEVER: partners, family, friends, coworkers, anyone with personal relationship
✗ When unsure, show subject alone

${robinHairInstruction}

TEXT RULES (CRITICAL):
✗ NO readable text beyond single words - AI text becomes gibberish
✗ NO documents, newspapers, books, signs with multiple lines
✗ NO speech bubbles with sentences
✓ Single words only if essential ("STOP", "EXIT")
✓ Focus on VISUAL storytelling, not text

PHOTO QUALITY:
- Photorealistic subject integrated naturally into styled scenario
- Proper lighting, shadows, perspective on subject
- Subject appears to genuinely inhabit this world
- ${aspectRatio} aspect ratio`;
        }
      } else {
        // Normal flow: add user headshot if provided
        if (headshotBase64 && headshotMimeType) {
          requestParts.push({
            inline_data: {
              mime_type: headshotMimeType,
              data: headshotBase64
            }
          });
        }
      }

      // Add the text prompt
      requestParts.push({ text: prompt });

      // Gemini 2.5 Flash Image API endpoint
      // Using x-goog-api-key header (recommended by Google for security)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: requestParts
            }],
            generationConfig: {
              responseModalities: ["Image"],
              imageConfig: {
                aspectRatio: aspectRatio
              }
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();

        // Sanitized error logging (only first 200 chars, no sensitive data)
        console.error('Gemini API HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          errorPreview: errorData.substring(0, 200),
          timestamp: new Date().toISOString()
        });

        // Handle specific HTTP error codes
        if (response.status === 400) {
          return res.status(400).json({
            error: 'Invalid request to image generation API. Please try a different prompt.'
          });
        }

        if (response.status === 401 || response.status === 403) {
          console.error('GEMINI_API_KEY authentication failed');
          return res.status(500).json({
            error: 'Server configuration error. Please contact support.'
          });
        }

        if (response.status === 429) {
          return res.status(429).json({
            error: 'Rate limit exceeded. Please try again in a few moments.'
          });
        }

        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const data = await response.json();

      // Extract generated image from Gemini 2.5 Flash Image response
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in Gemini response:', data);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. Please try again.'
        });
      }

      const candidate = data.candidates[0];

      // Check for IMAGE_OTHER or safety filter blocks
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error('Gemini blocked content. Reason:', candidate.finishReason);

        if (candidate.finishReason === 'SAFETY') {
          return res.status(400).json({
            error: 'Image generation blocked by safety filters. Please try a different prompt or image.'
          });
        }

        if (candidate.finishReason === 'IMAGE_OTHER') {
          // Humorous error messages for content restrictions
          const generalContentErrors = [
            "Even our AI needs an excuse for this one. Try a different scenario, or generate without a photo - we promise we won't judge.",
            "The image generator has declined to participate in this particular fiction. Perhaps try a less... ambitious scenario?",
            "Our AI has developed sudden ethical concerns. Try without a photo, or craft an excuse that's slightly less incriminating.",
            "Image generation blocked - apparently some excuses are too good to illustrate. Try a different approach or remove your photo.",
            "The AI has invoked its right to remain silent. Generate without a photo, or try a scenario that's less likely to end up in a tribunal."
          ];

          const robinContentErrors = [
            "Even AI won't go along with blaming Robin for this one. His reputation precedes him - try a different excuse focus.",
            "Robin's lawyers have apparently reached the AI. This excuse might be too spicy even for him - try a different excuse focus or a tamer scenario.",
            "The AI refuses to depict Robin in this scenario - even it knows there are limits to plausible deniability. Try a different excuse focus.",
            "Content blocked - Robin's PR team must have got to our image generator. Try shifting the blame elsewhere.",
            "Our AI has drawn the line at implicating Robin in this particular scheme. Perhaps he's not the scapegoat for this one - try a different excuse focus."
          ];

          // Select random message based on whether Robin is active
          const errorMessages = isRobinBlamed ? robinContentErrors : generalContentErrors;
          const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];

          return res.status(500).json({
            error: randomError
          });
        }

        // Other finish reasons (RECITATION, etc.)
        console.error('Unexpected finish reason:', {
          reason: candidate.finishReason,
          candidate: JSON.stringify(candidate).substring(0, 200)
        });
        return res.status(500).json({
          error: 'Failed to generate image. Please try again with a different prompt.'
        });
      }

      const parts = candidate?.content?.parts;

      if (!parts || parts.length === 0) {
        console.error('No parts in Gemini response. FinishReason:', candidate.finishReason);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. The API returned no content. Please try again.'
        });
      }

      const inlineData = parts[0]?.inlineData;

      if (!inlineData || !inlineData.data) {
        console.error('No image data in Gemini response:', parts[0]);
        clearTimeout(timeoutId);
        return res.status(500).json({
          error: 'Failed to generate image. The model may not support image generation.'
        });
      }

      const imageBase64 = inlineData.data;
      const mimeType = inlineData.mimeType || 'image/png'; // Default to PNG if not specified

      // Return image to browser as data URL
      const imageResponse: ImageResponse = {
        imageUrl: `data:${mimeType};base64,${imageBase64}`
      };

      clearTimeout(timeoutId);

      // Log successful response
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        endpoint: '/api/generate-image',
        clientIp: clientIp,
        status: 'success',
        responseTimeMs: Date.now() - startTime,
        metadata: {
          comedicStyle: comedicStyle,
          hasHeadshot: !!headshotBase64,
          imageMimeType: mimeType,
          imageSizeBytes: imageBase64.length
        }
      }));

      return res.status(200).json(imageResponse);

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      // Handle timeout specifically
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Gemini 2.5 Flash Image API timeout after 60s');
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          endpoint: '/api/generate-image',
          clientIp: clientIp,
          status: 'error_timeout',
          responseTimeMs: Date.now() - startTime
        }));
        return res.status(504).json({
          error: 'Request timed out. Please try again.'
        });
      }

      console.error('Error generating image:', fetchError);
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        endpoint: '/api/generate-image',
        clientIp: clientIp,
        status: 'error_api_call',
        responseTimeMs: Date.now() - startTime
      }));
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error generating image:', error);
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/generate-image',
      clientIp: clientIp,
      status: 'error_unexpected',
      responseTimeMs: Date.now() - startTime
    }));
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.'
    });
  }
}
