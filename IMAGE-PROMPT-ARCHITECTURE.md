# Image Prompt Architecture

This document explains how image generation prompts are built in `api/generate-image.ts`.

---

## Overview

The image generation API receives:
- **excuseText** - The generated excuse text
- **comedicStyle** - Comedy style from excuse generation (e.g., "Absurdist", "Deadpan")
- **headshotBase64** (optional) - User's uploaded headshot
- **headshotMimeType** (optional) - MIME type of headshot
- **originalSituation** (optional) - User's original input describing what happened
- **keepSameClothes** (optional, default: true) - Whether to keep subject's original outfit
- **aspectRatio** (optional, default: "16:9") - Image aspect ratio for different platforms

---

## Prompt Structure

### With Headshot

```
[VISUAL STYLE INSTRUCTIONS - withHeadshot variant]

ORIGINAL SITUATION: [originalSituation - if provided]

GENERATED EXCUSE: [excuseText]

YOUR TASK: Create an image that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation. Focus on making the excuse believable through visual "evidence".

The subject's IDENTITY must remain recognizable (same person), but you have creative freedom with their EXPRESSION and BODY LANGUAGE to match the scenario - they can look surprised, guilty, confused, innocent, etc. as appropriate for the excuse.

CLOTHING: [Keep exact same clothes OR Get creative with outfit - based on user toggle]

═══ CRITICAL RULES ═══

PEOPLE RULES:
✓ ONLY the uploaded person/people may appear
✓ Keep their IDENTITY recognizable (same facial features = same person)
✓ EXPRESSIONS can change to fit scenario (surprised, guilty, innocent, etc.)
✓ Anonymous strangers in functional roles OK if essential (cop, waiter, random crowd)
✗ NEVER: partners, family, friends, coworkers, anyone with personal relationship
✗ When unsure, show subject alone

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
- 16:9 aspect ratio
```

### Without Headshot

```
[VISUAL STYLE INSTRUCTIONS - withoutHeadshot variant]

ORIGINAL SITUATION: [originalSituation - if provided]

GENERATED EXCUSE: [excuseText]

YOUR TASK: Create environmental evidence that visually supports this excuse while referencing what actually happened. The image should be humorous (matching the excuse's tone) but grounded in the original situation.

Focus on the scene, aftermath, or objects - NOT people (we don't know what they look like). Photorealistic quality following the visual style.

═══ CRITICAL RULES ═══

PEOPLE RULES:
✗ NO specific identifiable people (we don't know the excuse-maker)
✓ Anonymous generic people OK if essential (distant cop, crowd, stock-photo-style extras)
✗ NEVER: anyone appearing to have personal relationships
✗ When unsure, focus on environment only

TEXT RULES (CRITICAL):
[Same as above]

PHOTO QUALITY:
- Photorealistic environmental evidence
- Professional quality following visual style
- Scenario details clearly visible
- 16:9 aspect ratio
```

---

## Visual Styles by Comedy Style

Each comedy style has specific visual instructions for both variants:

### 1. Absurdist
- **With Headshot:** Surreal/reality-bending photography. Impossible physics, floating objects, dreamlike atmosphere. Subject photorealistic but scenario defies logic.
- **Without Headshot:** Environmental evidence with impossible physics, dimensional anomalies, surreal juxtapositions.

### 2. Observational
- **With Headshot:** Modern life "perfect timing" captures. Relatable frustrations (tech fails, notifications at worst time). Candid documentary style.
- **Without Headshot:** Environmental evidence of modern frustrations (cracked screens, error messages, spilled coffee).

### 3. Deadpan
- **With Headshot:** Serious documentary/editorial style. Formal composition treating absurd content with professional gravitas. National Geographic aesthetic.
- **Without Headshot:** Formally composed documentary evidence. Professional editorial treatment of silly scenarios.

### 4. Hyperbolic
- **With Headshot:** Epic dramatic/movie poster style. Low angle hero shots, cinematic lighting, smoke/debris. Treat mundane failure as epic catastrophe.
- **Without Headshot:** Disaster photography. Epic scale destruction, dramatic aftermath, cinematic composition.

### 5. Ironic
- **With Headshot:** Situational irony photography. Visual contradictions (safety equipment causing injury). Good intentions leading to opposite result.
- **Without Headshot:** Environmental irony. Evidence of backfired plans, contradictory signage.

### 6. Meta
- **With Headshot:** Fourth-wall breaking. Subject aware they're making a staged excuse photo. Obvious props, behind-the-scenes elements visible.
- **Without Headshot:** Transparently staged evidence. Obviously arranged props, visible setup.

### 7. Paranoid
- **With Headshot:** Surveillance/conspiracy aesthetic. Security camera angles, timestamps, mysterious figures in background.
- **Without Headshot:** Surveillance evidence. Security footage style, conspiracy documentation.

### 8. Passive-aggressive
- **With Headshot:** Subtle hostility. "Helpful" smile that doesn't reach eyes. Props showing others' failures. Blame-shifting composition.
- **Without Headshot:** Blame-shifting evidence. Sticky notes with "helpful reminders", printed emails, documentation of others' incompetence.

### 9. Corporate-jargon
- **With Headshot:** Corporate stock photography. Business attire, office environment, meeting rooms.
- **Without Headshot:** Corporate office evidence. Charts, whiteboards, business materials.

---

## How Customisation Affects Images

### Excuse Focus Options
The excuse focus affects the **excuse text content** (generated by Claude), which then influences the image through `EXCUSE CONTEXT`.

| Focus | Effect on Image |
|-------|-----------------|
| Blame Technology | Images will feature tech elements based on excuse content |
| Blame Nature | Natural disasters/weather in excuse affects image |
| Blame Animals | Animal-related scenarios |
| Blame Other People | Scenes with (anonymous) others at fault |
| Blame Yourself | Self-deprecating scenarios |
| Blame Universe | Cosmic/fate-related imagery |
| Blame Transport | Transit/vehicle scenarios |
| Blame Time Itself | Time-related imagery |

### Narrative Elements (Special Ingredients)
These are mentioned in the **excuse text** and appear in images organically:

- Injured Fox, Office Dog, Duck with Clipboard → Animals in image
- Victorian Gentleman, High-Vis Person → Specific character types
- Yorkshire Pudding, Client Lunch Leftovers → Food elements
- Transatlantic Flight → Aviation/airport settings
- Working Fax Machine, Broken Coffee Machine → Office equipment
- Black Friday, etc. → Seasonal/event context

### Comedy Style
Directly determines which visual style instructions are used (see styles above).

---

## Current Limitations

1. **No Robin Skidmore Detection**
   - Currently no logic to detect when Robin is the excuse focus
   - His headshot is not automatically included

2. **People Rules May Be Too Strict**
   - "Anonymous strangers OK if essential" - could be clearer
   - Functional roles (cop, waiter) allowed but not well defined

---

## Clothing Toggle Feature

When a headshot is uploaded, users see a toggle:
- **Default (Off):** "Keep the same clothes from your photo" - Prompt includes instruction to preserve exact outfit
- **Toggle On:** "Get creative with the outfit" - Prompt allows AI to dress subject appropriately for scenario

---

## Aspect Ratio Options

Users can select an image format optimized for different platforms:

| Ratio | Label | Best For |
|-------|-------|----------|
| **16:9** | Best for Desktop and General Web | YouTube, Twitter/X, LinkedIn, presentations |
| **4:5** | Best for Instagram and LinkedIn | Instagram feed, Facebook feed, Pinterest |
| **9:16** | Best for TikTok, Stories and Reels | TikTok, Instagram Stories/Reels, YouTube Shorts |
| **1:1** | Best for People Scared Of Rectangles | Universal format, works everywhere |

Default is 16:9 for backward compatibility.

---

## Expression & Identity Guidance

The prompts clarify:
- **IDENTITY** = Same facial features (must remain recognizable as the same person)
- **HAIR** = Must match exactly (same color, length, style, texture from reference photo)
- **EXPRESSION** = Can change freely (surprised, guilty, innocent, confused, etc.)
- **BODY LANGUAGE** = Can change to match scenario

This allows creative freedom while maintaining recognizability. Hair preservation is explicitly enforced to prevent the AI from generating wildly different hairstyles.

---

## API Flow

```
1. Receive request with excuseText, comedicStyle, headshot (optional)
2. Validate inputs (size limits, file types)
3. Look up visualStyleInstructions[comedicStyle]
4. Select withHeadshot or withoutHeadshot variant
5. Build prompt:
   - Visual style instructions
   - EXCUSE CONTEXT: excuseText
   - YOUR TASK section
   - CRITICAL RULES
6. Send to Gemini 2.5 Flash Image API
7. Return base64 image as data URL
```

---

## Files

- **API:** `api/generate-image.ts`
- **Visual styles:** Lines 234-671
- **Prompt building:** Lines 673-740
- **Gemini API call:** Lines 742-891
