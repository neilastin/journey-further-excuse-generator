# Not My Fault - Project Brief
## The Excuse Generator

**Version:** 1.0 MVP (Secure Vercel Architecture)  
**Created:** October 2025  
**Updated:** October 2025 - Added serverless functions for API security  
**Domain:** notmyfault.app  
**Hosting:** Vercel with Serverless Functions

---

## 🔒 Security Architecture Overview

**This project uses Vercel Serverless Functions to keep API keys secure and hidden from users.**

Traditional web apps that call APIs directly from the browser expose API keys to anyone who opens DevTools. This project solves that problem:

- **Frontend (Browser)** → Public, visible to users
- **Serverless Functions (Vercel)** → Secure backend, API keys hidden
- **External APIs (Claude/Gemini)** → Called only from serverless functions

This architecture ensures your API keys are never exposed and cannot be stolen.

---

## 👥 Development Team Structure

This project leverages specialized AI agents, each expert in their domain:

### 🎨 Frontend Architect (`@frontend`)
**Role:** Builds all React components, manages state, handles TypeScript types  
**Tools:** Read, Write, Edit, Bash, Grep, Glob, Context7 MCP  
**Model:** Sonnet 4.5  
**Focus:** Component architecture, hooks, form handling, type safety

### 💅 Styling & Animation Specialist (`@stylist`)
**Role:** Implements design system, animations, responsive layouts  
**Tools:** Read, Write, Edit, Bash, View, Context7 MCP  
**Model:** Sonnet 4.5  
**Focus:** Tailwind CSS, shadcn/ui, Framer Motion, accessibility

### 🔧 Backend & Serverless Expert (`@backend`)
**Role:** Creates secure serverless functions in /api directory  
**Tools:** Read, Write, Edit, Bash, Grep, Context7 MCP  
**Model:** Sonnet 4.5  
**Focus:** Vercel functions, API security, environment variables

### 🔒 Security Guardian (`@security`)
**Role:** Audits code for vulnerabilities, ensures API keys are secure  
**Tools:** Read, Grep, Glob, Context7 MCP (READ-ONLY access)  
**Model:** Opus 4 (deep reasoning for security analysis)  
**Focus:** API key protection, input validation, error message safety

### 🧪 Testing Engineer (`@tester`)
**Role:** Writes and runs comprehensive tests using Playwright  
**Tools:** Read, Write, Edit, Bash, Playwright MCP, Context7 MCP  
**Model:** Sonnet 4.5  
**Focus:** E2E testing, form validation, error handling, responsive testing

### 🚀 DevOps & Deployment Specialist (`@devops`)
**Role:** Manages Git workflow, Vercel deployment, domain configuration  
**Tools:** Read, Write, Edit, Bash, GitHub MCP, Context7 MCP  
**Model:** Sonnet 4.5  
**Focus:** Repository setup, CI/CD, environment variables, production deployment

---

## 🛠️ Available MCP Servers

### GitHub MCP
**Purpose:** Version control, repository management, commits, pull requests  
**Used by:** `@devops` agent  
**Tools:** Create repos, manage branches, commit code, configure GitHub

### Playwright MCP  
**Purpose:** Browser automation and end-to-end testing  
**Used by:** `@tester` agent  
**Tools:** Automate browser, test UI flows, validate forms, check responsive design

### Context7 MCP
**Purpose:** Real-time access to latest documentation (React, Tailwind, Vercel, etc.)  
**Used by:** All agents via `use context7` in prompts  
**Benefit:** Always uses current API methods, no hallucinated deprecated code

---

## Project Overview

**Not My Fault** is a comedy web application that generates three levels of creative excuses for any situation using Claude AI. Users input their scenario, and the app returns three distinct excuses with different tones - from overly formal to outrageously absurd. The Level 3 excuse includes an optional "Photographic Evidence" feature that generates AI images placing the user in their fabricated scenario.

**Purpose:** Entertainment, comedy, creative writing practice  
**Target Audience:** Anyone who needs a laugh or creative excuse inspiration

---

## Tech Stack

### Core Framework
- **React 18+** with TypeScript
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety and better DX

### Deployment & Backend
- **Vercel** - Hosting platform with serverless functions
- **Vercel Serverless Functions** - Secure API proxy layer (CRITICAL for security)
  - Keeps API keys secret on the server
  - Prevents client-side key exposure
  - Enables rate limiting and authentication

### Styling & UI
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built React components
  - Button, Card, Input, Textarea, Select, Label components
- **Custom CSS** - For specific animations and effects

### Animation
- **Framer Motion** - All animations and transitions
  - Card entrance animations
  - Button hover effects
  - Loading state animations
  - Smooth transitions

### APIs (Server-side only)
- **Anthropic Claude API** - Excuse generation (claude-sonnet-4-20250514)
- **Google Gemini API** - Image generation with headshot compositing

### Additional Libraries
- **React** hooks for state management
- **Lucide React** - Icon library

---

## Design Specifications

### Color Palette
```
Background: #0a0a0a (deep black)
Card Background: #1a1a1a (dark charcoal)
Input Fields: #2a2a2a (lighter charcoal)

Accent Colors:
- Primary Green: #00ff88 (neon green) - Main CTA button
- Electric Blue: #00d9ff - Level 1 accent
- Vibrant Purple: #b57bff - Level 2 accent, logo
- Neon Green: #00ff88 - Level 3 accent

Text:
- Primary: #ffffff (white)
- Secondary: #a0a0a0 (gray)
- Muted: #666666 (dark gray)
```

### Typography
- **Font Family:** System font stack for performance
  - Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Headings:** Bold, large, clear hierarchy
- **Body:** Readable size (16px base), comfortable line-height

### Layout & Spacing
- **Max Width:** 1400px centered container
- **Padding:** Generous white space (24px mobile, 48px desktop)
- **Border Radius:** 12px for cards, 8px for inputs/buttons
- **Shadows:** Subtle elevation with colored glows

### Responsive Breakpoints
```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

---

## User Interface Structure

### Header
- **Left:** Logo (purple triangle icon) + "Not My Fault" text
- **Right:** "Generate Excuses" navigation link (scrolls to form)
- **Styling:** Fixed/sticky header, minimal height, dark background
- **Mobile:** Scales appropriately, maintains branding

### Hero Section
- **Headline:** "Craft the Perfect Excuse"
- **Subheadline:** "Generate believable excuses tailored to your situation. Simply input the details, and let us handle the rest."
- **Alignment:** Center-aligned
- **Spacing:** Large padding top/bottom

### Input Section (The Form)
- **Container:** Centered card with subtle shadow
- **Width:** Max 800px on desktop, full-width on mobile
- **Inputs (in order):**

#### 1. What's not your fault? (Required)
- **Type:** Textarea
- **Placeholder:** "I was late to the meeting because..."
- **Rows:** 4-5
- **Validation:** Required field
- **Styling:** Dark input field with light text

#### 2. Who needs to believe this? (Required)
- **Type:** Dropdown/Select
- **Options:**
  - My manager
  - My partner
  - My parents
  - My friend
  - My teacher
  - My date
  - A client
  - A coworker
  - A police officer
  - Anyone and Everyone
- **Default:** First option or placeholder "Select..."
- **Styling:** Custom-styled dropdown with arrow icon

#### 3. How important is this? (Required)
- **Type:** Dropdown/Select
- **Options:**
  - Not a massive deal
  - Somewhat important
  - Really important
  - Absolutely critical
- **Default:** First option or placeholder "Select..."
- **Styling:** Matches dropdown style above

#### 4. Generate Excuses Button
- **Text:** "Generate Excuses"
- **Color:** Neon green (#00ff88) with gradient
- **Size:** Large, prominent, full-width of form
- **Hover Effect:** Glow effect, slight scale up (1.02)
- **States:**
  - Default: Solid color
  - Hover: Glow + scale
  - Loading: Disabled with animated text
  - Disabled: Grayed out when form incomplete

### Output Section (Excuse Cards)

#### Desktop Layout (> 768px)
- **Grid:** 3 columns, equal width
- **Gap:** 24px between cards
- **Positioning:** Below input section

#### Mobile Layout (< 768px)
- **Stack:** Single column (3 rows)
- **Gap:** 20px between cards

#### Individual Excuse Card Design
```
┌─────────────────────────────────┐
│ [Title Badge]            [Copy] │
│                                 │
│ Excuse text content here...     │
│ Multiple paragraphs if needed   │
│                                 │
└─────────────────────────────────┘
```

**Card Styling:**
- Background: #1a1a1a
- Border: 2px solid with accent color glow
- Border Radius: 12px
- Padding: 24px
- Box Shadow: Colored glow matching accent

**Title Badge:**
- Small pill/badge at top of card
- Text: Dynamic title from API (e.g., "The Professional Paradox")
- Background: Accent color with opacity
- Position: Top-left of card

**Copy Button:**
- Icon: Copy/clipboard icon
- Position: Top-right of card
- Behavior: Copies excuse text to clipboard
- Feedback: Shows "Copied!" tooltip for 2 seconds
- Styling: Subtle, only visible on hover

**Accent Colors by Position:**
- Left card (Formal): Electric Blue (#00d9ff)
- Middle card (Believable): Vibrant Purple (#b57bff)
- Right card (Outrageous): Neon Green (#00ff88)

### Level 3 Special Features (Right/Bottom Card)

#### Photographic Evidence Button
- **Position:** Below excuse text, inside the Level 3 card
- **Text:** "📸 Generate Photographic Evidence"
- **Styling:** Secondary button style, neon green accent
- **Behavior:** 
  - Click to generate image
  - Shows file upload for headshot (optional)
  - Generates image with or without headshot

#### Headshot Upload (Optional Feature)
- **Type:** File input (hidden, triggered by button)
- **Button Text:** "Upload Your Headshot (Optional)"
- **Accepted Formats:** .jpg, .jpeg, .png
- **Max Size:** 5MB
- **Position:** Appears when "Generate Evidence" clicked
- **Styling:** Small, subtle button below main button

#### Generated Image Display
- **Position:** Below buttons, expands card height
- **Aspect Ratio:** 16:9
- **Styling:** 
  - Rounded corners (12px)
  - Subtle border
  - Loading state: Skeleton/shimmer
- **Features:**
  - Download button overlay (top-right)
  - Full-size view on click (modal)

---

## Loading States & Animations

### Form Validation
- Real-time validation on required fields
- Disabled button state when incomplete
- Subtle red border on empty required fields (on submit attempt)

### Loading Animation (While Generating Excuses)
- **Type:** Animated cycling text
- **Position:** Centered below "Generate Excuses" button
- **Styling:** Purple text, fade in/out transitions
- **Duration:** Each message displays for 2 seconds before cycling

#### Loading Messages (50+ options)
Use these messages in random order while the API generates excuses:

1. "Consulting the excuse archives..."
2. "Crafting your alibi..."
3. "Fabricating plausible deniability..."
4. "Summoning creative justifications..."
5. "Generating bulletproof reasoning..."
6. "Weaving a tale of innocence..."
7. "Constructing the perfect narrative..."
8. "Assembling your defense..."
9. "Spinning a web of believability..."
10. "Channeling your inner storyteller..."
11. "Consulting the council of excuses..."
12. "Bending reality to your favor..."
13. "Manufacturing reasonable doubt..."
14. "Brewing up some plausible scenarios..."
15. "Conjuring creative explanations..."
16. "Building your case..."
17. "Orchestrating a symphony of excuses..."
18. "Designing your escape route..."
19. "Engineering believable fiction..."
20. "Summoning the excuse spirits..."
21. "Calculating optimal deflection angles..."
22. "Drafting your statement..."
23. "Polishing your story..."
24. "Consulting Murphy's Law..."
25. "Invoking creative license..."
26. "Generating plausible alternatives..."
27. "Constructing reasonable excuses..."
28. "Fabricating convenient truths..."
29. "Manifesting believable scenarios..."
30. "Assembling your narrative..."
31. "Weaving circumstantial evidence..."
32. "Crafting your testimony..."
33. "Building reasonable explanations..."
34. "Summoning the excuse muse..."
35. "Generating creative solutions..."
36. "Consulting the book of alibis..."
37. "Drafting your defense strategy..."
38. "Manufacturing plausible events..."
39. "Constructing your version of events..."
40. "Brewing up some tall tales..."
41. "Channeling Oscar-worthy performances..."
42. "Generating face-saving explanations..."
43. "Crafting elaborate justifications..."
44. "Summoning convenient coincidences..."
45. "Building layers of deniability..."
46. "Weaving complex explanations..."
47. "Consulting chaos theory..."
48. "Generating creative deflections..."
49. "Manifesting alternate realities..."
50. "Constructing your masterpiece..."
51. "Fabricating reasonable circumstances..."
52. "Summoning believable scenarios..."
53. "Engineering your way out..."
54. "Crafting the ultimate excuse..."
55. "Building your safety net..."

### Card Entrance Animations (Framer Motion)
When excuses appear:
1. **Stagger Effect:** Cards appear sequentially (not all at once)
2. **Animation:** Fade in + slide up from below
3. **Timing:** 0.2s delay between each card
4. **Easing:** Smooth spring animation

### Micro-interactions
- **Buttons:** Hover lift + glow
- **Cards:** Hover subtle elevation increase
- **Inputs:** Focus state with accent color border
- **Copy Button:** Success checkmark animation

---

## API Integration

### ⚠️ CRITICAL SECURITY ARCHITECTURE

**DO NOT call Claude/Gemini APIs directly from the browser.** This would expose your API keys in client-side code, allowing anyone to steal them and rack up charges on your account.

**Instead, use Vercel Serverless Functions as a secure proxy layer:**

```
Browser (Public) → Vercel Function (Secure) → Claude/Gemini APIs
                   [API keys hidden here]
```

### Environment Variables Setup

**For Local Development:**
Create `.env.local` file in project root (for serverless functions):
```env
ANTHROPIC_API_KEY=your_claude_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**For Production (Vercel):**
Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY` 
3. Add `GEMINI_API_KEY`
4. These are only accessible server-side (secure!)

**Security Notes:**
- Never commit `.env.local` to git
- Add `.env.local` to `.gitignore`
- Never use `VITE_` prefix (that exposes vars to browser)
- API keys only exist on server (Vercel functions)

---

## Serverless Function Architecture

### File Structure
```
not-my-fault/
├── api/                          # Vercel serverless functions
│   ├── generate-excuses.ts       # Proxies Claude API
│   └── generate-image.ts         # Proxies Gemini API
├── src/                          # React frontend
│   └── (existing structure)
```

---

### Serverless Function 1: Generate Excuses

**File:** `/api/generate-excuses.ts`

This function receives the excuse request from the browser, calls Claude API securely, and returns the results.

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scenario, audience, importance } = req.body;

    // Validate inputs
    if (!scenario || !audience || !importance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build the Claude prompt
    const prompt = `You are an expert excuse generator creating humorous excuses for comedy purposes. Generate THREE distinct excuses for the following scenario, each with a different tone and style.

SCENARIO: ${scenario}
AUDIENCE: ${audience}
IMPORTANCE: ${importance}

Generate exactly THREE excuses with the following characteristics:

EXCUSE 1 - THE OVERLY FORMAL EXCUSE:
- Tone: Extremely formal, academic, unnecessarily complicated
- Language: Complex vocabulary, long sentences, technical jargon
- Comedy: Derives from how ridiculously over-complicated it is
- Length: 3-4 sentences
- Title: A short, pompous-sounding title (4-6 words max) like "The Quantum Temporal Displacement Theory" or "An Exercise in Circumstantial Inevitability"

EXCUSE 2 - THE BELIEVABLE EXCUSE:
- Tone: Reasonable, sensible, somewhat mundane
- Language: Clear, straightforward, relatable
- Comedy: Derives from how boring and ordinary it is (might be slightly humorous in its mundanity)
- Length: 2-3 sentences
- Title: A short, boring title (3-5 words max) like "Traffic Issues" or "Simple Miscommunication"

EXCUSE 3 - THE OUTRAGEOUS EXCUSE:
- Tone: Absurd, far-fetched, fantastical, uses extreme hyperbole
- Language: Dramatic, vivid, storytelling style
- Comedy: Derives from how ridiculous and unbelievable it is
- Length: 3-5 sentences
- Title: A short, dramatic title (4-6 words max) like "The Great Alpaca Incident" or "When Pigeons Attack"

IMPORTANT INSTRUCTIONS:
1. Each excuse must be DISTINCTLY DIFFERENT in tone and content
2. All excuses should be humorous but appropriate for ${audience}
3. Adjust formality/absurdity based on ${importance}
4. Titles must be SHORT and punchy (never more than 6 words)
5. Return ONLY valid JSON, no other text

Return your response as a JSON object with this EXACT structure:
{
  "excuse1": {
    "title": "short formal title here",
    "text": "the overly formal excuse text here"
  },
  "excuse2": {
    "title": "short boring title here",
    "text": "the believable excuse text here"
  },
  "excuse3": {
    "title": "short dramatic title here",
    "text": "the outrageous excuse text here"
  }
}

DO NOT include any text outside the JSON object. DO NOT use markdown code blocks. Return ONLY the raw JSON.`;

    // Call Claude API (API key is secure on server)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse Claude's JSON response
    const excusesText = data.content[0].text;
    
    // Handle potential markdown code blocks
    const cleanedText = excusesText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const excuses = JSON.parse(cleanedText);

    // Return excuses to browser
    return res.status(200).json(excuses);

  } catch (error) {
    console.error('Error generating excuses:', error);
    return res.status(500).json({ 
      error: 'Failed to generate excuses. Please try again.' 
    });
  }
}
```

---

### Serverless Function 2: Generate Image

**File:** `/api/generate-image.ts`

This function receives the excuse text (and optional headshot), calls Gemini API securely, and returns the generated image.

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { excuseText, headshotBase64, headshotMimeType } = req.body;

    if (!excuseText) {
      return res.status(400).json({ error: 'Excuse text is required' });
    }

    // Build Gemini prompt
    let prompt: string;
    const parts: any[] = [];

    if (headshotBase64) {
      // With headshot
      prompt = `I'm providing you with a headshot photo of a person. Create a photorealistic 16:9 image that places THIS SPECIFIC PERSON into the following humorous excuse scenario:

EXCUSE: ${excuseText}

CRITICAL REQUIREMENTS:
1. PERSON CONTINUITY: The person in the generated image MUST look exactly like the person in the provided headshot. Maintain their facial features, hair, skin tone, and general appearance. This is absolutely critical.
2. Scene Integration: Place this person naturally into the absurd scenario described in the excuse
3. Photorealistic Style: The image should look like a real photograph, not a cartoon or illustration
4. Aspect Ratio: 16:9 (landscape orientation)
5. Humor: The scenario should be visually funny and absurd, making the excuse obviously ridiculous
6. Quality: High-quality, well-lit, professionally composed shot

Make sure the person from the headshot is clearly the main subject in the scenario. The image should make viewers laugh at how ridiculous the situation is while featuring the actual person from the uploaded photo.`;

      parts.push(
        { text: prompt },
        {
          inline_data: {
            mime_type: headshotMimeType,
            data: headshotBase64
          }
        }
      );
    } else {
      // Without headshot
      prompt = `Create a photorealistic 16:9 image that humorously depicts the following excuse scenario:

EXCUSE: ${excuseText}

REQUIREMENTS:
- Style: Photorealistic, high-quality, cinematic
- Aspect Ratio: 16:9 (landscape)
- Tone: Funny, absurd, visually captures the ridiculousness of the excuse
- Scene: Show the scenario in action, with visual elements that match the excuse narrative
- Details: Rich environmental details that support the story
- Lighting: Dramatic, professional photography lighting
- Composition: Well-framed, visually interesting

Make this image obviously absurd and humorous while maintaining photorealistic quality. The image should make someone laugh when they see it because of how ridiculous the scenario is.`;

      parts.push({ text: prompt });
    }

    // Call Gemini API (API key is secure on server)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract generated image
    const generatedContent = data.candidates[0].content.parts[0];
    
    if (!generatedContent.inline_data) {
      throw new Error('No image generated');
    }

    const imageBase64 = generatedContent.inline_data.data;
    const mimeType = generatedContent.inline_data.mime_type;

    // Return image to browser
    return res.status(200).json({
      imageUrl: `data:${mimeType};base64,${imageBase64}`
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ 
      error: 'Failed to generate image. Please try again.' 
    });
  }
}
```

---

### Frontend API Calls

**In your React app**, call YOUR serverless functions (not Claude/Gemini directly):

#### Call 1: Generate Excuses

```typescript
// In your React component
const generateExcuses = async () => {
  try {
    setIsGeneratingExcuses(true);
    
    const response = await fetch('/api/generate-excuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: userScenario,
        audience: selectedAudience,
        importance: selectedImportance
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate excuses');
    }

    const excuses = await response.json();
    
    // Now you have:
    // excuses.excuse1.title
    // excuses.excuse1.text
    // excuses.excuse2.title
    // excuses.excuse2.text
    // excuses.excuse3.title
    // excuses.excuse3.text
    
    setExcuses(excuses);
    setIsGeneratingExcuses(false);
    
  } catch (error) {
    console.error('Error:', error);
    setError('Failed to generate excuses. Please try again.');
    setIsGeneratingExcuses(false);
  }
};
```

#### Call 2: Generate Image (Without Headshot)

```typescript
const generateImage = async () => {
  try {
    setIsGeneratingImage(true);
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        excuseText: excuses.excuse3.text
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const { imageUrl } = await response.json();
    setGeneratedImage(imageUrl);
    setIsGeneratingImage(false);
    
  } catch (error) {
    console.error('Error:', error);
    setError('Failed to generate image. Please try again.');
    setIsGeneratingImage(false);
  }
};
```

#### Call 3: Generate Image (With Headshot)

```typescript
const generateImageWithHeadshot = async (headshotFile: File) => {
  try {
    setIsGeneratingImage(true);
    
    // Convert headshot to base64
    const headshotBase64 = await convertImageToBase64(headshotFile);
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        excuseText: excuses.excuse3.text,
        headshotBase64: headshotBase64,
        headshotMimeType: headshotFile.type
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const { imageUrl } = await response.json();
    setGeneratedImage(imageUrl);
    setIsGeneratingImage(false);
    
  } catch (error) {
    console.error('Error:', error);
    setError('Failed to generate image. Please try again.');
    setIsGeneratingImage(false);
  }
};

// Helper function
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

---

## Error Handling

### API Call Failures

**Scenario 1: Claude API Fails**
- **Message:** "Oops! Our excuse generator is taking a break. Please try again in a moment."
- **Action:** Show error toast/banner, re-enable generate button
- **Retry:** Allow user to try again immediately

**Scenario 2: Gemini API Fails**
- **Message:** "Couldn't generate photographic evidence. Try again or continue without it."
- **Action:** Show error in image area, keep button active for retry
- **Fallback:** User can still see and use the excuse text

**Scenario 3: Network Error**
- **Message:** "Connection hiccup! Check your internet and try again."
- **Action:** Show error state, re-enable all buttons

### Form Validation Errors

**Scenario 1: Empty Required Field**
- **Trigger:** User clicks "Generate Excuses" with empty "What's not your fault?" field
- **Message:** Red border on field + "Please describe what's not your fault"
- **Action:** Focus on empty field

**Scenario 2: No Dropdowns Selected**
- **Trigger:** Dropdowns at default/empty state
- **Message:** "Please select an audience and importance level"
- **Action:** Highlight dropdown fields

### File Upload Errors

**Scenario 1: File Too Large**
- **Trigger:** Uploaded image > 5MB
- **Message:** "Image is too large. Please use an image under 5MB."
- **Action:** Clear upload, allow retry

**Scenario 2: Invalid File Type**
- **Trigger:** User uploads non-image file
- **Message:** "Please upload a valid image (JPG or PNG)"
- **Action:** Clear upload, allow retry

### Rate Limiting

**Scenario: API Rate Limit Hit**
- **Message:** "Whoa there! Too many excuses too fast. Please wait a moment."
- **Action:** Disable button for 10 seconds, show countdown timer
- **Visual:** "Try again in {countdown} seconds..."

---

## State Management

### React State Structure

```typescript
// Main app state
interface AppState {
  // Form inputs
  scenario: string;
  audience: string;
  importance: string;
  
  // Loading states
  isGeneratingExcuses: boolean;
  isGeneratingImage: boolean;
  
  // Generated content
  excuses: {
    excuse1: { title: string; text: string } | null;
    excuse2: { title: string; text: string } | null;
    excuse3: { title: string; text: string } | null;
  };
  
  // Image generation
  uploadedHeadshot: File | null;
  generatedImage: string | null; // Base64 data URL
  
  // UI state
  currentLoadingMessage: string;
  showExcuses: boolean;
  copySuccess: { [key: string]: boolean }; // Track copy status per excuse
  
  // Error state
  error: string | null;
}
```

### Key User Flows

**Flow 1: Generate Excuses**
1. User fills form
2. Clicks "Generate Excuses"
3. Validate inputs → Show error if invalid
4. Set `isGeneratingExcuses: true`
5. Start cycling loading messages
6. Call Claude API
7. Parse response
8. Set excuses state
9. Set `isGeneratingExcuses: false`, `showExcuses: true`
10. Animate cards in (stagger effect)

**Flow 2: Generate Image (No Headshot)**
1. User clicks "Generate Photographic Evidence"
2. Set `isGeneratingImage: true`
3. Show loading state in image area
4. Call Gemini API with excuse text
5. Parse image response
6. Set `generatedImage` state
7. Set `isGeneratingImage: false`
8. Display image with fade-in animation

**Flow 3: Generate Image (With Headshot)**
1. User clicks "Upload Your Headshot"
2. File picker opens
3. User selects image
4. Validate file (size, type)
5. Set `uploadedHeadshot` state
6. Show preview
7. User clicks "Generate Photographic Evidence"
8. Set `isGeneratingImage: true`
9. Convert headshot to base64
10. Call Gemini API with excuse text + headshot
11. Parse image response
12. Set `generatedImage` state
13. Set `isGeneratingImage: false`
14. Display image with fade-in

**Flow 4: Copy Excuse**
1. User clicks copy button on excuse card
2. Copy excuse text to clipboard
3. Set `copySuccess[excuseId]: true`
4. Show "Copied!" feedback
5. After 2s, reset copy state

---

## File Structure

```
not-my-fault/
├── api/                          # ⭐ Vercel serverless functions
│   ├── generate-excuses.ts      # Secure Claude API proxy
│   └── generate-image.ts        # Secure Gemini API proxy
├── public/
│   └── (favicon, any static assets)
├── src/
│   ├── components/
│   │   ├── Header.tsx              # App header with logo
│   │   ├── Hero.tsx                # Hero section with headline
│   │   ├── ExcuseForm.tsx          # Input form component
│   │   ├── ExcuseCard.tsx          # Individual excuse card
│   │   ├── ExcuseCards.tsx         # Container for all 3 cards
│   │   ├── LoadingAnimation.tsx    # Cycling loading messages
│   │   ├── PhotoEvidence.tsx       # Image generation component
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── select.tsx
│   │       └── label.tsx
│   ├── lib/
│   │   ├── utils.ts                # Utility functions
│   │   └── constants.ts            # Constants (dropdown options, loading messages, etc.)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind
├── .env.local                      # Environment variables for serverless functions (gitignored)
├── .env.example                    # Example env file
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json                     # Vercel configuration (if needed)
├── tailwind.config.js
├── components.json                 # shadcn/ui config
└── README.md
```

---

## Implementation Checklist

### Phase 1: Project Setup & Foundation
**Lead Agent:** `@devops` with `@backend` support

- [ ] **@devops:** Initialize Git repository using GitHub MCP
- [ ] **@devops:** Create project structure with Vite + React + TypeScript
- [ ] **@devops:** Install all dependencies (including @vercel/node, @types/node)
- [ ] **@stylist:** Configure Tailwind with custom colors from design spec
- [ ] **@frontend:** Set up TypeScript types and interfaces
- [ ] **@devops:** Create .env.local and .env.example files
- [ ] **@stylist:** Initialize shadcn/ui components

### Phase 2: Serverless Functions & API Security
**Lead Agent:** `@backend` with `@security` review

- [ ] **@backend:** Create /api directory structure
- [ ] **@backend:** Build /api/generate-excuses.ts with full Claude integration
- [ ] **@backend:** Build /api/generate-image.ts with full Gemini integration
- [ ] **@security:** Audit both functions for security vulnerabilities
- [ ] **@backend:** Implement input validation in serverless functions
- [ ] **@security:** Verify API keys only exist server-side (no VITE_ prefix)
- [ ] **@backend:** Test functions locally with `vercel dev`

### Phase 3: Core UI Components
**Lead Agent:** `@frontend` with `@stylist` support

- [x] **@frontend:** Build Header component with logo and navigation
- [x] **@frontend:** Build Hero section with headline and subheadline
- [x] **@stylist:** Style Header and Hero to match design spec
- [x] **@frontend:** Build ExcuseForm with all inputs and validation
- [x] **@stylist:** Style form inputs with Tailwind (exact colors)
- [x] **@frontend:** Create ExcuseCard component with copy functionality
- [x] **@stylist:** Add card styling and hover effects
- [x] **@frontend:** Build ExcuseCards container with responsive grid
- [x] **@frontend:** Create LoadingAnimation with cycling messages
- [x] **@stylist:** Add Framer Motion animations to LoadingAnimation

### Phase 4: Frontend API Integration
**Lead Agent:** `@frontend` with `@security` review

- [x] **@frontend:** Wire form submission to /api/generate-excuses
- [x] **@frontend:** Implement excuse generation flow with error handling
- [x] **@frontend:** Add excuse state management (useState)
- [x] **@security:** Verify NO direct API calls to Claude/Gemini from browser
- [x] **@stylist:** Add card entrance animations with Framer Motion
- [x] **@frontend:** Implement copy-to-clipboard with success feedback
- [x] **@frontend:** Add loading states with cycling messages

### Phase 5: Photo Evidence Feature *(Completed 2025-10-27)*
**Lead Agent:** `@frontend` with `@backend` support

- [x] **@frontend:** Build file upload component for headshots (HeadshotUpload.tsx)
- [x] **@frontend:** Implement image-to-base64 conversion in frontend
- [x] **@frontend:** Wire image generation to /api/generate-image endpoint
- [x] **@backend:** Ensure image endpoint handles both scenarios (with/without headshot)
- [x] **@frontend:** Build image display component (ImageDisplay.tsx)
- [x] **@stylist:** Add image loading states and animations
- [x] **@frontend:** Implement image download functionality with full-screen modal (ImageModal.tsx)
- [x] **@backend:** Implement 8 comedic styles with random rotation system
- [x] **@backend:** Create 8 visual styles matching excuse comedic styles
- [x] **@backend:** Add withHeadshot/withoutHeadshot image generation variants
- [x] **@frontend:** Implement modal with auto-close after download (800ms delay)

### Phase 6: Polish, Testing & Accessibility
**Lead Agents:** `@stylist` and `@tester`

- [ ] **@stylist:** Add all micro-interactions and hover effects
- [ ] **@stylist:** Test responsive behavior at all breakpoints
- [ ] **@tester:** Write Playwright tests for excuse generation flow (use Playwright MCP)
- [ ] **@tester:** Test image generation with and without headshots
- [ ] **@tester:** Test all error states and validation
- [ ] **@tester:** Test form validation feedback
- [ ] **@tester:** Test accessibility (keyboard navigation, screen readers)
- [ ] **@frontend:** Performance optimization
- [ ] **@security:** Final security audit of entire codebase

### Phase 7: Deployment to Production
**Lead Agent:** `@devops`

- [ ] **@devops:** Test all flows locally with `vercel dev`
- [ ] **@devops:** Create Vercel project using GitHub MCP
- [ ] **@devops:** Set environment variables in Vercel dashboard (ANTHROPIC_API_KEY, GEMINI_API_KEY)
- [ ] **@devops:** Deploy to Vercel
- [ ] **@tester:** Test production deployment thoroughly
- [ ] **@devops:** Configure custom domain (notmyfault.app)
- [ ] **@tester:** Verify production site works end-to-end
- [ ] **@security:** Final production security check

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Test serverless functions locally (requires Vercel CLI)
vercel dev
```

---

## Vercel Deployment

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Have a Vercel account (free tier works)
3. Have your API keys ready (Anthropic Claude & Google Gemini)

### Local Testing with Serverless Functions

```bash
# Install Vercel CLI globally
npm install -g vercel

# Run local development with serverless functions
vercel dev
```

This starts a local server that mimics Vercel's production environment, allowing you to test your serverless functions at `/api/*` endpoints.

### Initial Deployment

```bash
# Login to Vercel
vercel login

# Deploy (first time - will prompt for configuration)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? not-my-fault
# - Directory? ./
# - Override settings? No
```

### Environment Variables Setup

**Critical: Set these in Vercel Dashboard, NOT in code**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   ```
   ANTHROPIC_API_KEY = your_claude_api_key_here
   GEMINI_API_KEY = your_gemini_api_key_here
   ```
5. Select all environments (Production, Preview, Development)
6. Click Save

**Important:** After adding environment variables, you must redeploy for them to take effect.

### Custom Domain Setup

1. In Vercel Dashboard → Project Settings → Domains
2. Add `notmyfault.app`
3. Follow Vercel's DNS instructions
4. Update your domain registrar's nameservers or add CNAME/A records
5. Wait for DNS propagation (can take up to 48 hours)

### Deployment Workflow

```bash
# Deploy to production
vercel --prod

# Or simply push to main branch (if GitHub integration is set up)
git push origin main
```

### Continuous Deployment

**Recommended:** Connect your GitHub repository to Vercel for automatic deployments:

1. Import project from GitHub in Vercel Dashboard
2. Every push to `main` → Automatic production deployment
3. Every PR → Automatic preview deployment with unique URL

### Monitoring & Logs

View serverless function logs in Vercel Dashboard:
- Go to Deployments → Select deployment → Functions
- See real-time logs and errors
- Monitor API usage and performance

---

## Dependencies

### Required NPM Packages
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.0.0",
    "@vercel/node": "^3.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## API Rate Limits & Costs

### Claude API (Anthropic)
- **Model:** claude-sonnet-4-20250514
- **Estimated cost per request:** ~$0.015 (2000 tokens)
- **Rate limits:** Depends on your API tier
- **Optimization:** Single call for all 3 excuses

### Gemini API (Google)
- **Model:** gemini-2.0-flash-exp
- **Image generation:** Check current pricing
- **Rate limits:** Depends on your API quota
- **Optimization:** Optional feature, only on user request

---

## Security Considerations

### 🔒 Critical Security Architecture
This project uses **Vercel Serverless Functions** to keep API keys secure. The architecture ensures:
- API keys NEVER appear in browser/client code
- API keys stored only on Vercel's servers (environment variables)
- All API calls proxied through secure serverless functions
- Users cannot access or steal API keys

### Security Best Practices

1. **API Keys (CRITICAL):**
   - ✅ **DO:** Store in Vercel environment variables
   - ✅ **DO:** Access via `process.env` in serverless functions only
   - ❌ **DON'T:** Use `VITE_` prefix (exposes to browser)
   - ❌ **DON'T:** Hardcode keys anywhere
   - ❌ **DON'T:** Commit `.env.local` to git

2. **Input Validation:**
   - Validate all user inputs in serverless functions before API calls
   - Sanitize text to prevent injection attacks
   - Check file types and sizes before processing
   - Limit text length to prevent abuse

3. **File Uploads:**
   - Validate file types (only allow .jpg, .jpeg, .png)
   - Enforce 5MB max file size
   - Convert to base64 on client side, validate on server
   - Never execute uploaded files

4. **Rate Limiting:**
   - Implement client-side rate limiting (basic)
   - Consider Vercel's Edge Middleware for advanced rate limiting
   - Monitor usage in Vercel dashboard
   - Set reasonable API timeout limits

5. **Error Messages:**
   - Don't expose API keys or internal errors to users
   - Return generic error messages to frontend
   - Log detailed errors server-side for debugging
   - Never show stack traces to users

6. **CORS:**
   - Vercel functions handle CORS automatically
   - Only allow requests from your domain in production
   - Test CORS with custom domain before launch

---

## Future Enhancement Ideas (Post-MVP)

- [ ] Save/share generated excuses
- [ ] Social media sharing (Twitter, Instagram)
- [ ] Email excuse directly
- [ ] Excuse history (localStorage)
- [ ] More excuse levels or styles
- [ ] Custom image styles (cartoon, sketch, etc.)
- [ ] Multiple image generations per excuse
- [ ] User accounts and saved excuses
- [ ] API rate limiting dashboard
- [ ] Analytics and usage tracking
- [ ] A/B testing different prompts

---

## Success Metrics

- **Primary:** Users generate excuses and laugh
- **Secondary:** Users share their excuses on social media
- **Tertiary:** Users generate photographic evidence
- **Technical:** <2s loading time for excuses, <5s for images

---

## Notes for Claude Code

When building this project:

1. **Start with setup:** Create project structure, install dependencies, configure Tailwind
2. **Build serverless functions FIRST:** Create `/api/generate-excuses.ts` and `/api/generate-image.ts` before frontend API calls - this ensures security from the start
3. **Never call APIs directly from browser:** All API calls must go through serverless functions at `/api/*` endpoints
4. **Test with `vercel dev`:** Use `vercel dev` instead of `npm run dev` when testing API functionality locally
5. **Build incrementally:** Start with static UI, then add interactivity, then wire up serverless endpoints
6. **Test frequently:** Test each component in isolation before integrating
7. **Use TypeScript:** Proper typing will catch bugs early, especially for API responses
8. **Follow the design:** Stick to the color palette and spacing specifications
9. **Optimize prompts:** The Claude and Gemini prompts in the serverless functions are critical - use them exactly as written
10. **Handle errors gracefully:** User experience during failures is important - implement all error states
11. **Animate thoughtfully:** Framer Motion animations should be smooth and purposeful
12. **Mobile-first:** Build responsive from the start
13. **Security first:** Remember - API keys live ONLY in serverless functions, accessed via `process.env`, never in frontend
14. **Have fun:** This is a comedy app - the code should be clean but the output should be hilarious

### Critical Architecture Reminder
```
❌ WRONG: Browser → Claude/Gemini APIs (exposes keys)
✅ RIGHT: Browser → Vercel Function → Claude/Gemini APIs (keys safe)
```

---

---

## 🚀 Getting Started in Claude Code

### Prerequisites Checklist

Before you begin, ensure you have:

- ✅ **API Keys Ready:**
  - Anthropic Claude API key (from https://console.anthropic.com/)
  - Google Gemini API key (from https://aistudio.google.com/)

- ✅ **MCPs Configured:**
  - GitHub MCP (with personal access token)
  - Playwright MCP
  - Context7 MCP

- ✅ **Agents Created:**
  - @frontend (Sonnet 4.5)
  - @stylist (Sonnet 4.5)
  - @backend (Sonnet 4.5)
  - @security (Opus 4)
  - @tester (Sonnet 4.5)
  - @devops (Sonnet 4.5)

---

### Step 1: Start Claude Code in Project Directory

```bash
cd C:\Users\neila\OneDrive\Desktop\claude-projects\notmyfault
claude
```

---

### Step 2: Initialize the Project

**First message to Claude Code:**

```
I'm ready to build "Not My Fault" - a comedy excuse generator web app.

Project Overview:
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Framer Motion
- Vercel serverless functions for secure API calls
- Claude API for excuse generation
- Gemini API for AI image generation

I have 6 specialized agents ready:
- @frontend - React/TypeScript components
- @stylist - Tailwind/animations
- @backend - Serverless functions
- @security - Security auditing
- @tester - Playwright testing
- @devops - Git/Vercel deployment

I need you to coordinate these agents to build this app following the comprehensive project brief I'm about to share.

Before we start building, please:
1. Confirm you can see all 6 agents
2. Confirm GitHub, Playwright, and Context7 MCPs are available
3. Review the high-level architecture approach

Ready?
```

**Wait for confirmation, then proceed to Step 3.**

---

### Step 3: Share the Complete Project Brief

**Copy the ENTIRE contents of this brief (NOT-MY-FAULT-PROJECT-BRIEF.md) and paste it into Claude Code.**

Then say:

```
This is the complete project specification. Please review it carefully and confirm you understand:

1. The secure serverless architecture (no API keys in browser)
2. The three excuse types (formal, believable, outrageous)
3. The exact color palette and design specifications
4. The image generation feature (with optional headshot)
5. The workflow using our specialized agents

Once you've reviewed it, let's start with Phase 1: Project Setup & Foundation.

Assign @devops to initialize the Git repository and create the initial Vite + React + TypeScript project structure.
```

---

### Step 4: Progressive Development Strategy

**Follow this conversation flow:**

#### Phase 1-2: Foundation & Security (Days 1-2)
```
@devops - Set up the project structure, Git repo, and install dependencies.
@backend - Create both serverless functions (/api/generate-excuses.ts and /api/generate-image.ts)
@security - Audit the serverless functions to ensure API keys are secure

use context7 for latest Vercel, Node.js, and TypeScript documentation
```

#### Phase 3-4: Core UI & Integration (Days 3-4)
```
@frontend - Build all core components (Header, Hero, ExcuseForm, ExcuseCard, ExcuseCards, LoadingAnimation)
@stylist - Implement the exact design system (colors: #00ff88, #00d9ff, #b57bff, backgrounds: #0a0a0a, #1a1a1a)
@frontend - Wire up the form to /api/generate-excuses endpoint
@security - Verify no direct API calls to external services from browser

use context7 for latest React, Tailwind, and Framer Motion documentation
```

#### Phase 5: Photo Evidence (Day 5)
```
@frontend - Build file upload and image generation features
@backend - Ensure /api/generate-image handles both scenarios (with/without headshot)
@stylist - Add image loading states and display animations
```

#### Phase 6: Testing & Polish (Day 6)
```
@tester - Write comprehensive Playwright tests for all user flows (use Playwright MCP)
@stylist - Add final animations, responsive polish, and micro-interactions
@security - Final security audit of entire codebase
```

#### Phase 7: Deployment (Day 7)
```
@devops - Deploy to Vercel, configure environment variables, set up notmyfault.app domain (use GitHub MCP)
@tester - Test production deployment end-to-end
@security - Verify production security (API keys hidden, HTTPS, etc.)
```

---

### Step 5: Key Commands During Development

**Agent Delegation:**
```
@frontend - [specific task]
@backend - [specific task]
```

**Get Latest Docs:**
```
use context7
# Automatically pulls current React/Tailwind/Vercel documentation
```

**Test Locally:**
```
Run these commands:
npm run dev          # Vite dev server (port 5173)
vercel dev          # Test serverless functions (port 3000)
```

**Check Progress:**
```
/todos              # View current task list
/status            # Check system status
```

**Switch Agents:**
```
Let's bring in @security to audit this code
@tester - run Playwright tests on the form flow
```

---

### Step 6: Critical Reminders Throughout Build

**When Backend Work Happens:**
```
@security - Please audit this serverless function before we continue.
Verify:
1. API keys accessed via process.env (not passed from frontend)
2. No VITE_ prefix on environment variables
3. Input validation on all user data
4. Generic error messages (no sensitive info leaked)
```

**When Frontend Calls APIs:**
```
@security - Confirm this frontend code calls OUR /api/* endpoints, not external APIs directly
```

**Before Testing:**
```
@tester - Write Playwright tests using the Playwright MCP for:
1. Form submission and excuse generation
2. Image generation with and without headshots
3. Error handling (empty fields, API failures)
4. Responsive design on mobile/tablet/desktop
```

**Before Deployment:**
```
@devops - Using GitHub MCP:
1. Create repository
2. Push all code
3. Configure Vercel project
4. Set environment variables in Vercel dashboard (not in code!)
5. Deploy and configure notmyfault.app domain
```

---

### Step 7: Environment Variables Setup

**When @backend creates serverless functions, you'll need to:**

1. **Create `.env.local` in project root:**
```env
ANTHROPIC_API_KEY=your_claude_key_here
GEMINI_API_KEY=your_gemini_key_here
```

2. **Add to `.gitignore`:**
```
.env.local
```

3. **For Vercel Production (done by @devops):**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add both keys there (NOT in code)

---

### Step 8: Success Criteria

**You'll know you're done when:**

- ✅ Form accepts input and generates 3 distinct excuses
- ✅ Each excuse has correct tone (formal/believable/outrageous)
- ✅ Copy button works on each excuse card
- ✅ Image generation works with and without headshots
- ✅ All loading states show cycling messages
- ✅ Error handling works (empty fields, API failures)
- ✅ Design matches spec (exact colors, spacing, animations)
- ✅ Responsive on mobile/tablet/desktop
- ✅ @security confirms no API keys exposed
- ✅ @tester confirms all Playwright tests pass
- ✅ Deployed to notmyfault.app with HTTPS

---

### Workflow Tips

**Incremental Progress:**
Build → Review → Test → Refine → Move to next feature

**Agent Collaboration:**
```
@frontend built the form. @stylist, please style it to match the design spec.
@security, audit the styling code for any issues.
```

**Use Context7 Liberally:**
```
use context7
# Before implementing any feature with external libraries
# Ensures you're using latest React/Tailwind/Framer Motion patterns
```

**Version Control:**
```
@devops - commit this progress:
"feat: Add excuse generation form and API integration"
```

---

### Emergency Troubleshooting

**If API calls fail:**
1. Check `.env.local` exists and has correct keys
2. Verify running `vercel dev` (not just `npm run dev`)
3. @security - audit for any key exposure

**If styling looks wrong:**
1. @stylist - verify Tailwind config has exact colors from brief
2. Check responsive breakpoints match spec

**If tests fail:**
1. @tester - review test scenarios
2. Ensure dev server is running
3. Check Playwright MCP is connected

**If deployment fails:**
1. @devops - verify environment variables set in Vercel dashboard
2. Check build logs for errors
3. Ensure GitHub repo is connected to Vercel

---

## Final Pre-Flight Checklist

Before you type your first message in Claude Code:

- [ ] Claude Code is running in `/notmyfault` directory
- [ ] You can see all 6 agents when you type `@`
- [ ] `/mcp` shows GitHub, Playwright, and Context7 connected
- [ ] You have this brief ready to paste
- [ ] You have your API keys ready
- [ ] You're excited to build! 🎉

---

**Now go build something amazing!** 🚀

Remember: Start with Step 2, get confirmation, share the brief, and let the agents work their magic. You're the conductor of this talented orchestra!

---

## Support & Questions

For any questions or clarifications during development, refer back to this brief. All design decisions, API implementations, and user flows are documented here.

**Good luck building Not My Fault! May your excuses be creative and your bugs be few.** 🚀
