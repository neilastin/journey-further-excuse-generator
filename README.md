# Journey Further Excuse Generator

AI-powered excuse generator customized for Journey Further.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Vercel serverless functions
- Anthropic Claude & Google Gemini APIs

## Setup

```bash
git clone https://github.com/neilastin/journey-further-excuse-generator.git
cd journey-further-excuse-generator
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
SLACK_WEBHOOK_URL=your_webhook_url_here  # Optional: For Slack sharing
```

**Note**: For Slack integration setup, see [SLACK-INTEGRATION.md](SLACK-INTEGRATION.md)

## Development

```bash
npm run dev              # Start Vite + API server
npm run build            # Build for production
npm run test:smoke       # Run Playwright smoke tests
```

App runs at `http://localhost:5173`

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables:
   - `ANTHROPIC_API_KEY`
   - `GEMINI_API_KEY`
   - `SLACK_WEBHOOK_URL` (optional, for Slack sharing)
4. Deploy

## Features

- Excuse generation with 10 comedy styles
- Customise mode (comedy styles, narrative elements, excuse focus)
- Image generation with Gemini
- Headshot upload and compositing
- Robin Skidmore blame-shifting
- **Slack integration** - 1-click sharing to Slack channels
- Responsive design

## Security

- API keys in Vercel environment variables
- Serverless functions proxy API calls
- Rate limiting: 20 req/min (excuses), 10 req/min (images)

## Project Structure

```
├── api/            # Serverless functions
├── src/
│   ├── components/ # React components
│   ├── lib/        # Utilities, constants
│   └── index.css   # Tailwind theme
└── tests/          # Playwright tests
```

## Documentation

- `CLAUDE.md` - Detailed development guidance
- `SLACK-INTEGRATION.md` - Slack integration setup and format documentation
