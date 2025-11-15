# Journey Further Excuse Generator - Prompt Architecture Guide

This document explains exactly how prompts are constructed and sent to the Claude API in different scenarios.

---

## Table of Contents

1. [Overview](#overview)
2. [Scenario 1: Normal "Generate Excuses" Button](#scenario-1-normal-generate-excuses-button)
3. [Scenario 2: With Customization Options](#scenario-2-with-customization-options)
4. [Scenario 3: With Robin Skidmore Persona](#scenario-3-with-robin-skidmore-persona)
5. [How Prompts Are Built Programmatically](#how-prompts-are-built-programmatically)

---

## Overview

The excuse generator sends prompts to Claude Sonnet 4.5 via the Anthropic API. The prompt structure is built dynamically based on:

1. **User inputs**: Scenario and audience (always required)
2. **Comedy style**: Randomly selected from 10 styles OR user-selected via Customise
3. **Custom options** (optional):
   - Narrative elements (up to 3 "special ingredients")
   - Excuse focus (who/what to blame)

The API always generates **TWO excuses**:
- **Excuse 1**: Boring, mundane, realistic (2-5 sentences)
- **Excuse 2**: Comedic, creative, using selected style (3-7 sentences)

---

## Scenario 1: Normal "Generate Excuses" Button

### How It Works

When a user clicks "Generate Excuses" **without** using Customise:

1. User enters scenario (e.g., "I missed the client deadline")
2. User selects audience (e.g., "Your Manager")
3. Backend **randomly selects** one of 10 comedy styles
4. No narrative elements are added
5. No excuse focus is specified
6. Prompt is sent to Claude API

### Example Prompt Sent to Claude API

**User Input:**
- Scenario: "I missed the client deadline"
- Audience: "Your Manager"

**Comedy Style Randomly Selected:** Deadpan

**Exact Prompt Sent:**

```
You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: I missed the client deadline
AUDIENCE: Your Manager

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
EXCUSE 2 - THE RISKY EXCUSE (Deadpan Comedy Style)
═══════════════════════════════════════════════════════════

Use DEADPAN comedy:
- State completely outrageous things in a serious, matter-of-fact tone
- No exclamation marks, no dramatics - just calm delivery of absurd content
- Use formal, professional language to describe ridiculous situations
- The humor comes from the contrast between tone and content
- Examples: "I was engaged in a minor territorial dispute with a swan" or "A series of cascading failures in my morning routine"
- Avoid clichés: Don't be boring - make the content wild but the delivery flat

REQUIREMENTS:
- Length: 3-7 sentences (you have room to develop the comedy)
- Make it FUNNY and highly creative within this comedic style
- Title: Short and punchy (4-6 words max)
- Appropriate for Your Manager but push comedic boundaries
- Be SPECIFIC and VIVID - avoid vague generic humor
- Find FRESH angles - avoid overused tropes for this style

FORMATTING - VERY IMPORTANT:
- If your excuse is 4+ sentences, break it into 2-3 paragraphs for readability
- Use double line breaks (\n\n) to separate paragraphs
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

Remember: The two excuses should be POLAR OPPOSITES - one boring and realistic, one wildly comedic using Deadpan style.

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short boring title (3-5 words)",
    "text": "the mundane believable excuse (2-5 sentences)"
  },
  "excuse2": {
    "title": "short punchy title (4-6 words)",
    "text": "the Deadpan comedy excuse (3-7 sentences)"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.
```

### Key Points

- No custom options = clean, simple prompt
- Comedy style is randomly selected from 10 options
- User has no control over which style is used
- This keeps the free tier exciting and varied

---

## Scenario 2: With Customization Options

### How It Works

When a user clicks "Customise" before generating:

1. User selects comedy style (or "Surprise Me" for random)
2. User selects up to 3 narrative elements (special ingredients)
3. User selects excuse focus (who/what to blame)
4. These options are **added** to the prompt as enhancement sections
5. Prompt is sent to Claude API

### Example Prompt Sent to Claude API

**User Input:**
- Scenario: "I accidentally deleted the client's Google Ads account"
- Audience: "The Client"

**User Customization:**
- Comedy Style: Corporate Jargon
- Narrative Elements: Broken Coffee Machine, Office Dog, Duck With A Clipboard
- Excuse Focus: Blame Technology

**Exact Prompt Sent:**

```
You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: I accidentally deleted the client's Google Ads account
AUDIENCE: The Client

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
EXCUSE 2 - THE RISKY EXCUSE (Corporate-jargon Comedy Style)
═══════════════════════════════════════════════════════════

Use CORPORATE JARGON comedy:
- Drown the excuse in business buzzwords, management speak, and corporate nonsense
- Use phrases like "synergize", "leverage", "circle back", "move the needle", "paradigm shift"
- Turn simple failures into "strategic pivots" or "optimization opportunities"
- Reference frameworks, KPIs, OKRs, and other acronyms excessively
- Examples: "bandwidth constraints impacted deliverable velocity" or "a misalignment of stakeholder expectations created friction in the value stream"
- Avoid clichés: Don't just sprinkle buzzwords - build entire sentences of corporate gibberish that sound professional but mean nothing

SPECIAL INGREDIENTS (Weave these in naturally):
Your excuse should organically incorporate these elements:
- a malfunctioning office coffee machine at the worst possible moment
- a company office dog causing chaos or getting involved
- a suspicious duck holding a clipboard, taking notes and observing critically

These elements should enhance the comedy and fit naturally into your narrative.
Don't force them or make them feel like a checklist - let them arise organically
from the story you're telling. They're seasoning, not the main dish.

EXCUSE FOCUS:
The excuse should primarily blame technology, apps, devices, or digital systems.
This is your comedic angle, but you still have creative freedom in execution.

REQUIREMENTS:
- Length: 3-7 sentences (you have room to develop the comedy)
- Make it FUNNY and highly creative within this comedic style
- Title: Short and punchy (4-6 words max)
- Appropriate for The Client but push comedic boundaries
- Be SPECIFIC and VIVID - avoid vague generic humor
- Find FRESH angles - avoid overused tropes for this style

FORMATTING - VERY IMPORTANT:
- If your excuse is 4+ sentences, break it into 2-3 paragraphs for readability
- Use double line breaks (\n\n) to separate paragraphs
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

Remember: The two excuses should be POLAR OPPOSITES - one boring and realistic, one wildly comedic using Corporate-jargon style.

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short boring title (3-5 words)",
    "text": "the mundane believable excuse (2-5 sentences)"
  },
  "excuse2": {
    "title": "short punchy title (4-6 words)",
    "text": "the Corporate-jargon comedy excuse (3-7 sentences)"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.
```

### Key Points

- **SPECIAL INGREDIENTS section**: Only appears if user selects narrative elements
- **EXCUSE FOCUS section**: Only appears if user selects a focus (not "Let AI Decide")
- These sections are **additive** - they enhance creativity, not constrain it
- Language like "weave these in naturally" and "you still have creative freedom" prevents rigid adherence
- User controls the comedic style instead of random selection

---

## Scenario 3: With Robin Skidmore Persona

### How It Works

When a user selects **"Blame Robin Skidmore"** in Excuse Focus:

1. The `ROBIN_SKIDMORE_PERSONA_PLACEHOLDER` is replaced with actual persona details
2. Special mixing instructions are added to vary the excuses
3. The prompt guides Claude to blend generic CEO stereotypes with Robin-specific details

### Robin Skidmore Persona Content

From `src/lib/personas/robin-skidmore.ts`:

```
ROBIN SKIDMORE - CEO & Founder of Journey Further

Random bits of information about Robin:
- CEO and a founder of Journey Further
- He is high energy, passionate and enthusiastic
- He is an Essex lad
- He used to work in the sales team and fancies himself to be a brilliant salesman and brilliant in pitches
- He is a bit of a neat freak
- He loves his Peloton
- There is a running joke that he gets his hair cut so very regularly, unusually regularly
- He has invested in varied other ventures before (with mixed results)

[More details to be added by colleagues over time]
```

### Example Prompt Sent to Claude API

**User Input:**
- Scenario: "I missed the all-hands meeting"
- Audience: "Your Manager"

**User Customization:**
- Comedy Style: Observational
- Narrative Elements: None
- Excuse Focus: **Blame Robin Skidmore**

**Exact Prompt Sent:**

```
You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: I missed the all-hands meeting
AUDIENCE: Your Manager

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
EXCUSE 2 - THE RISKY EXCUSE (Observational Comedy Style)
═══════════════════════════════════════════════════════════

Use OBSERVATIONAL comedy:
- Point out the ironic, annoying, or contradictory aspects of everyday situations
- "Have you ever noticed..." style observations about modern life
- Highlight the absurdity in normal social conventions or technology
- Make it relatable - focus on universal frustrations everyone experiences
- Examples: smartphone glitches at crucial moments, autocorrect disasters, social media timing fails
- Avoid clichés: Find fresh angles on common annoyances, not tired old "traffic sucks" jokes

EXCUSE FOCUS:
The excuse should blame Robin Skidmore, CEO & Founder of Journey Further.

ROBIN SKIDMORE - CEO & Founder of Journey Further

Random bits of information about Robin:
- CEO and a founder of Journey Further
- He is high energy, passionate and enthusiastic
- He is an Essex lad
- He used to work in the sales team and fancies himself to be a brilliant salesman and brilliant in pitches
- He is a bit of a neat freak
- He loves his Peloton
- There is a running joke that he gets his hair cut so very regularly, unusually regularly
- He has invested in varied other ventures before (with mixed results)

[More details to be added by colleagues over time]

IMPORTANT MIXING INSTRUCTIONS:
- Mix generic CEO/founder stereotypes with Robin-specific details to keep excuses varied
- Sometimes lean heavily on generic CEO tropes: ambitious, workaholic, strategic pivots,
  "synergy" obsession, motivational speaker energy, hustle culture, vision boards, etc.
- Sometimes weave in Robin-specific details from the persona above
- Sometimes combine both approaches for maximum comedy
- Keep the tone affectionate and cheeky, never mean-spirited
- Make it clear the excuse is blaming Robin in a playful way (not genuinely malicious)

This ensures each excuse about Robin feels fresh and unpredictable, not repetitive.
This is your comedic angle, but you still have creative freedom in execution.

REQUIREMENTS:
- Length: 3-7 sentences (you have room to develop the comedy)
- Make it FUNNY and highly creative within this comedic style
- Title: Short and punchy (4-6 words max)
- Appropriate for Your Manager but push comedic boundaries
- Be SPECIFIC and VIVID - avoid vague generic humor
- Find FRESH angles - avoid overused tropes for this style

FORMATTING - VERY IMPORTANT:
- If your excuse is 4+ sentences, break it into 2-3 paragraphs for readability
- Use double line breaks (\n\n) to separate paragraphs
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

Remember: The two excuses should be POLAR OPPOSITES - one boring and realistic, one wildly comedic using Observational style.

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short boring title (3-5 words)",
    "text": "the mundane believable excuse (2-5 sentences)"
  },
  "excuse2": {
    "title": "short punchy title (4-6 words)",
    "text": "the Observational comedy excuse (3-7 sentences)"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.
```

### Key Points About Robin Persona

- **Mixing instructions** prevent repetitive excuses about Robin
- Encourages variety: sometimes generic CEO jokes, sometimes Robin-specific, sometimes both
- **Affectionate tone** - playful blame, not mean-spirited
- Persona file is in `src/lib/personas/robin-skidmore.ts` and can be expanded by colleagues
- The placeholder replacement happens in `buildExcuseFocusPrompt()` function

---

## How Prompts Are Built Programmatically

### Code Flow in `api/generate-excuses.ts`

#### Step 1: Select Comedy Style

```typescript
function selectComedyStyle(customStyle?: string): string {
  // If custom style provided and it's not "surprise-me", use it
  if (customStyle && customStyle !== 'surprise-me') {
    const styleMap: Record<string, string> = {
      'absurdist': 'Absurdist',
      'observational': 'Observational',
      'deadpan': 'Deadpan',
      'hyperbolic': 'Hyperbolic',
      'self-deprecating': 'Self-deprecating',
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

  // Default: random selection
  return VALID_COMEDY_STYLES[Math.floor(Math.random() * VALID_COMEDY_STYLES.length)];
}
```

**Logic:**
- If user selects a specific style → use it
- If user selects "Surprise Me" → random selection
- If no customization (normal button) → random selection

---

#### Step 2: Build Narrative Elements Prompt (Optional)

```typescript
function buildNarrativeElementsPrompt(elementIds: string[]): string {
  if (elementIds.length === 0) return '';

  const allElements = getAllAvailableElements();
  const selectedElements = elementIds
    .map(id => allElements.find(e => e.id === id))
    .filter(e => e !== undefined)
    .map(e => e!.promptText);

  if (selectedElements.length === 0) return '';

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
```

**Logic:**
- If no narrative elements selected → return empty string (omit section)
- If elements selected → build bulleted list with natural weaving instructions

---

#### Step 3: Build Excuse Focus Prompt (Optional + Robin Special Case)

```typescript
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

This ensures each excuse about Robin feels fresh and unpredictable, not repetitive.`;
  }

  return `
EXCUSE FOCUS:
${promptText}
This is your comedic angle, but you still have creative freedom in execution.
`;
}
```

**Logic:**
- If "Let AI Decide" → return empty string (omit section)
- If other focus selected → add EXCUSE FOCUS section
- **Special case for Robin**: Replace placeholder with full persona + mixing instructions

---

#### Step 4: Assemble Final Prompt

```typescript
const selectedStyle = selectComedyStyle(customOptions?.style);

const narrativeElementsPrompt = customOptions?.narrativeElements
  ? buildNarrativeElementsPrompt(customOptions.narrativeElements)
  : '';

const excuseFocusPrompt = customOptions?.excuseFocus
  ? buildExcuseFocusPrompt(customOptions.excuseFocus)
  : '';

const prompt = `You are an expert excuse generator creating highly varied, genuinely funny excuses for comedy entertainment. Generate TWO distinct excuses for the following scenario.

LANGUAGE: Use British English spelling throughout (realise, colour, favour, whilst, etc.)

SCENARIO: ${scenario}
AUDIENCE: ${audience}

Generate TWO excuses - one mundane, one comedic:

[... EXCUSE 1 section ...]

═══════════════════════════════════════════════════════════
EXCUSE 2 - THE RISKY EXCUSE (${selectedStyle} Comedy Style)
═══════════════════════════════════════════════════════════

${STYLE_INSTRUCTIONS[selectedStyle]}
${narrativeElementsPrompt}${excuseFocusPrompt}
REQUIREMENTS:
[... rest of prompt ...]
`;
```

**Logic:**
- Base prompt is always the same (EXCUSE 1 + EXCUSE 2 structure)
- Selected style determines which comedy instructions are inserted
- Optional sections (`narrativeElementsPrompt`, `excuseFocusPrompt`) are either:
  - Empty string (omitted from prompt)
  - Full section with instructions

---

### Validation Before Sending

The API validates all inputs before building the prompt:

```typescript
// Validate comedy style
if (customOptions.style && !validateComedyStyle(customOptions.style)) {
  return res.status(400).json({ error: `Invalid comedy style: ${customOptions.style}` });
}

// Validate narrative elements (max 3)
if (customOptions.narrativeElements) {
  const elementsValidation = validateNarrativeElements(customOptions.narrativeElements);
  if (!elementsValidation.valid) {
    return res.status(400).json({ error: elementsValidation.error });
  }
}

// Validate excuse focus
if (customOptions.excuseFocus && !validateExcuseFocus(customOptions.excuseFocus)) {
  return res.status(400).json({ error: `Invalid excuse focus: ${customOptions.excuseFocus}` });
}
```

---

## Summary Table

| Scenario | Comedy Style | Narrative Elements | Excuse Focus | Robin Persona |
|----------|-------------|-------------------|--------------|---------------|
| **Normal Button** | Random (1 of 10) | None | None | No |
| **Customise: Style Only** | User-selected | None | None | No |
| **Customise: All Options** | User-selected | Up to 3 elements | User-selected | Depends on focus |
| **Customise: Blame Robin** | User-selected | Optional | "Blame Robin" | **YES** |

---

## Key Design Principles

1. **Additive, not constraining**: Custom options enhance creativity, never limit it
2. **Natural language**: "Weave these in naturally", "you still have creative freedom"
3. **Variety through mixing**: Robin persona mixes generic + specific details
4. **British English**: Specified upfront in all prompts
5. **Paragraph formatting**: Auto-breaks longer excuses (4+ sentences) into 2-3 paragraphs
6. **JSON response**: Claude returns structured JSON for easy parsing

---

## Files Involved

- **`api/generate-excuses.ts`**: Main API handler, prompt building logic
- **`src/lib/spiceItUpOptions.ts`**: Comedy styles, narrative elements, excuse focus definitions
- **`src/lib/personas/robin-skidmore.ts`**: Robin Skidmore persona details
- **`src/types/index.ts`**: TypeScript type definitions for custom options

---

## Testing Recommendations

1. **Test normal button**: Should generate varied excuses with random styles
2. **Test each comedy style**: Verify style instructions are working correctly
3. **Test narrative elements**: Check they're woven in naturally, not forced
4. **Test excuse focus**: Verify focus guides the blame correctly
5. **Test Robin persona**: Ensure variety (generic + specific details mixed)
6. **Test combinations**: Style + elements + focus all working together

---

**Document Created:** 2025-11-15
**Author:** Claude Code
**Version:** 1.0
