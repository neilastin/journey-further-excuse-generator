# Journey Further Excuse Generator

An interactive web application for creative excuse generation using AI, customized for Journey Further.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Deployment:** Vercel with serverless functions
- **AI Integration:** Anthropic Claude & Google Gemini APIs

## Project Structure

```
journey-further-excuse-generator/
├── api/                  # Vercel serverless functions (API routes)
├── public/               # Static assets (logos, favicons)
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utility functions and configuration
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles with Tailwind v4 theme
├── tests/              # Playwright E2E tests
├── .env.local          # Local environment variables (gitignored)
├── .env.example        # Environment variables template
└── vercel.json         # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (from https://console.anthropic.com/)
- Google Gemini API key (from https://aistudio.google.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/neilastin/journey-further-excuse-generator.git
cd journey-further-excuse-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your API keys to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_claude_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Development

Run the development server (starts BOTH frontend and API):
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Important:** Always use `npm run dev` (not `npm run dev:vite`) to run both the Vite dev server and the API server together.

### Available Scripts

```bash
npm run dev              # Start both Vite + API server (use this!)
npm run dev:vite         # Start only Vite (API won't work)
npm run dev:api          # Start only API server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run test:smoke       # Run Playwright smoke tests
npm run test:report      # View test report
```

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Configure environment variables in Vercel project settings:
   - `ANTHROPIC_API_KEY`
   - `GEMINI_API_KEY`
4. Deploy!

Vercel will automatically:
- Build and deploy the frontend
- Deploy serverless functions from `/api`
- Enable Vercel Analytics
- Set up the custom domain (if configured)

## Features

### Core Functionality
- **Excuse Generation**: Generate 2 AI-powered excuses (believable + comedic) using Claude API
- **Customise Mode**: Advanced excuse generation with:
  - 9 comedy styles (Absurdist, Observational, Deadpan, Hyperbolic, Self-deprecating, Ironic, Meta, Paranoid, + Surprise Me)
  - 8 always-available narrative elements + 5 seasonal elements
  - 9 excuse focus options
- **Image Generation**: Generate AI images matching excuse style using Gemini 2.5 Flash Image
- **Headshot Upload**: Optional headshot compositing in generated images
- **Full-Screen Preview**: View and download images with full-screen modal

### UI Features
- Dark theme with Journey Further brand colors
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Tab interface for multiple excuse types
- Loading animations with dynamic messages
- Comprehensive error handling

### Testing
- 5 Playwright smoke tests covering core user flows
- Cross-device testing (desktop + mobile)
- On-demand test execution

## Brand Customization

### Journey Further Branding Applied
- **Colors**: Journey Further brand palette (#2b0573, #6325f4, #00a3b8)
- **Logo**: Journey Further logo (dual symmetrical layout in header)
- **Copy**: "Journey Further" branding throughout
- **Mascot**: "Injured Fox" narrative element (replaces Barrister Pigeon)
- **Theme**: Professional yet comedic tone with British English

### Future Customization
The following can be customized for company-specific needs:
- Tagline variations (20 hero taglines in `src/lib/taglineVariations.ts`)
- Loading messages (55 messages in `src/lib/constants.ts`)
- Narrative elements (in `src/lib/spiceItUpOptions.ts`)
- Audience options (in `src/lib/constants.ts`)
- Seasonal elements and company events

## Security Notes

- Never commit `.env.local` to version control
- API keys are securely stored in Vercel environment variables
- Serverless functions act as a proxy to hide API keys from the client
- Rate limiting implemented (20 req/min for excuses, 10 req/min for images)
- Sentry error monitoring configured for production

## Development Status

**Current Status: Ready for Deployment**

All core features implemented and tested locally. Next step is deployment to Vercel production.

### Completed Phases
- Phase 1: Infrastructure Setup ✅
- Phase 2: UI Components & Local Development ✅
- Phase 3: Comedic Style System & Image Preview Modal ✅
- Phase 4: Customise Feature for Advanced Excuse Generation ✅
- Phase 5: Production Monitoring & Quality Assurance ✅
- Phase 6: Logo Integration & UI Polish ✅
- Phase 7: Smoke Test Suite ✅

### Next Steps
- Upload Journey Further logo files
- Customize company-specific content (taglines, personas, jargon)
- Deploy to Vercel
- Configure custom domain
- Add company-specific features

## License

TBD
