# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Overview

**Journey Further Excuse Generator** - Customized fork of "Not My Fault" for Journey Further digital marketing agency.

## Tech Stack

- **Frontend**: React 18 + TypeScript 5.6 + Vite 6
- **Styling**: Tailwind CSS 4.1 + Framer Motion 12
- **Deployment**: Vercel serverless functions
- **AI APIs**: Anthropic Claude (excuses) & Google Gemini (images)

## Quick Start

```bash
git clone https://github.com/neilastin/journey-further-excuse-generator.git
cd journey-further-excuse-generator
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your-key-here
GEMINI_API_KEY=your-key-here
```
**Note**: No quotes around values

```bash
npm run dev          # Start BOTH Vite + API server (required!)
npm run build        # Build for production
npm run test:smoke   # Run smoke tests
```

## Project Structure

```
├── api/                     # Vercel serverless functions
│   ├── generate-excuses.ts  # Claude API
│   └── generate-image.ts    # Gemini API
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utilities, constants, options
│   └── index.css            # Global styles + Tailwind theme
├── dev-server.js            # Local API server
└── .env.local               # API keys (create this!)
```

## Technical Notes

### Tailwind CSS v4
- Theme in CSS using `@theme` directive (in `src/index.css`), NOT tailwind.config.js
- Uses `@import "tailwindcss"` instead of `@tailwind` directives

### Local Development
- API: port 3001
- Vite: auto-selects port (usually 5173)
- If EADDRINUSE, kill stale processes on port 3001

## Brand Customizations

### Colors (in src/index.css)
- Primary Purple: #2b0573
- Secondary Purple: #6325f4
- Teal: #00a3b8

### Content
- British English throughout
- 8 audience options including Robin Skidmore
- Mascot: "Injured Fox" (replaces Barrister Pigeon)

## Key Files

- `src/lib/constants.ts` - Audience options, placeholder examples
- `src/lib/spiceItUpOptions.ts` - Comedy styles, narrative elements
- `src/lib/taglineVariations.ts` - Hero taglines
- `api/generate-excuses.ts` - AI prompt engineering

## Known Issues

- Robin Skidmore image generation blocked by content filter
- Two-person facial identity preservation needs improvement
