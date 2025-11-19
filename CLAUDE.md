# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Journey Further Excuse Generator** - A customized fork of the "Not My Fault" excuse generator app, rebranded for Journey Further digital marketing agency.

## Journey Further Customizations

### Branding
- **App Name**: "Journey Further Excuse Generator"
- **Repository**: https://github.com/neilastin/journey-further-excuse-generator.git
- **Header**: "Journey Further" with gradient on "Further"
- **Badge**: "Excuse Generator"
- **Mascot**: "Injured Fox" (replaces Barrister Pigeon)

### Brand Colors (in src/index.css)
- Primary Purple: #2b0573
- Secondary Purple: #6325f4
- Teal: #00a3b8
- Light backgrounds: #e8e4ffff, #daf2eeff

### Content Customizations
- British English (realise, colour, whilst)
- 8 audience options (Colleague, Manager, Client, HR, Finance, Robin Skidmore, etc.)
- 10 narrative elements + 12 monthly seasonal elements
- 37 taglines with "we'll help you" pattern
- 16 rotating placeholder examples
- 10 comedy styles (including Corporate Jargon, Passive-Aggressive)

## Tech Stack

- **Frontend**: React 18 + TypeScript 5.6 + Vite 6
- **Styling**: Tailwind CSS 4.1 + Framer Motion 12
- **Icons**: lucide-react
- **Deployment**: Vercel serverless functions
- **AI APIs**: Anthropic Claude & Google Gemini

## Getting Started

### Setup

```bash
git clone https://github.com/neilastin/journey-further-excuse-generator.git
cd journey-further-excuse-generator
npm install
```

Create `.env.local` in project root:
```
ANTHROPIC_API_KEY=your-anthropic-key-here
GEMINI_API_KEY=your-gemini-key-here
```
**Note**: No quotes around values

### Commands

```bash
npm run dev          # Start BOTH Vite + API server (required!)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:smoke   # Run smoke tests
```

**Important**: Always use `npm run dev` to run both servers together.

## Project Structure

```
├── api/                     # Vercel serverless functions
│   ├── generate-excuses.ts  # Claude API (excuse generation)
│   └── generate-image.ts    # Gemini API (image generation)
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utilities, constants, options
│   ├── types/               # TypeScript definitions
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles + Tailwind theme
├── dev-server.js            # Custom local API server
├── .env.local               # API keys (create this!)
└── vercel.json              # Vercel config
```

## Important Technical Notes

### Tailwind CSS v4
- Theme customization in CSS using `@theme` directive, NOT in tailwind.config.js
- Custom theme defined in `src/index.css`
- Uses `@import "tailwindcss"` instead of `@tailwind` directives

### Environment Variables
- `dev-server.js` manually copies parsed values into `process.env`
- Format: `KEY=value` (no quotes, no spaces around `=`)

### Local Development Server
- API runs on port 3001
- Vite auto-selects port (usually 5173+)
- If EADDRINUSE error, kill stale processes on port 3001

## Working Features

- Excuse generation with 10 comedy styles
- Customise modal (comedy styles, narrative elements, excuse focus)
- Image generation with Gemini 2.5 Flash Image
- Robin Skidmore blame-shifting feature (auto-includes his headshot)
- Two-person image generation (user + Robin)
- Aspect ratio selection (16:9, 4:5, 9:16, 1:1)
- Full-screen image preview with download
- Headshot upload with outfit toggle
- Luscious Locks easter egg (rapid toggle 10x)
- Photo evidence disclaimer text
- Error messages display below photo generation
- Responsive design
- Production monitoring (Vercel Analytics, Sentry)

## Known Issues / Pending Work

- [ ] Fix Robin Skidmore image generation (content filter blocking)
- [ ] Robin alone scenario and Robin + user headshot both erroring
- [ ] Improve two-person facial identity preservation
- [ ] Deploy to Vercel production

## Key Files for Customization

- `src/lib/constants.ts` - Audience options, placeholder examples
- `src/lib/spiceItUpOptions.ts` - Comedy styles, narrative elements, excuse focus
- `src/lib/taglineVariations.ts` - Hero taglines
- `api/generate-excuses.ts` - AI prompt engineering
