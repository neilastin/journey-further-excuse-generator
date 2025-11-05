# API Directory

This directory contains Vercel serverless functions that act as backend API endpoints.

## Purpose

Serverless functions are used to:
- Hide API keys from the client-side code
- Securely communicate with external APIs (Anthropic Claude, Google Gemini)
- Handle server-side logic and data processing

## File Naming Convention

- Files should be named with `.ts` extension (TypeScript)
- Each file becomes an API endpoint at `/api/<filename>`
- Example: `api/generate.ts` becomes accessible at `/api/generate`

## Example Function Structure

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
    // Get API key from environment variables
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Your API logic here
    const result = await callExternalAPI(apiKey, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Environment Variables

API functions have access to environment variables configured in:
- `.env.local` (for local development)
- Vercel Dashboard (for production deployments)

Available environment variables:
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `GEMINI_API_KEY` - Google Gemini API key

## Testing Locally

To test serverless functions locally, you can use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This will start a local development server with serverless function support.

## Deployment

When deploying to Vercel:
1. Ensure environment variables are set in Vercel Dashboard
2. Functions are automatically detected and deployed
3. They become available at `https://yourdomain.com/api/<function-name>`
