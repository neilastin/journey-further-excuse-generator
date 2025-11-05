import { createServer } from 'http';
import { parse } from 'url';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Simple development server that runs Vercel serverless functions locally
 * without requiring Vercel CLI authentication
 */

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local using absolute path
const envPath = join(__dirname, '.env.local');
const result = config({ path: envPath });

if (result.error) {
  console.error('Error loading .env.local:', result.error);
} else {
  const parsed = result.parsed || {};

  // Manually set them in process.env to ensure they're available
  Object.keys(parsed).forEach(key => {
    if (!process.env[key]) {
      process.env[key] = parsed[key];
    }
  });
}

const PORT = 3001;

// Import API handlers (will be loaded dynamically)
async function loadHandler(functionPath) {
  try {
    const module = await import(`./api/${functionPath}.ts`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load handler: ${functionPath}`, error);
    return null;
  }
}

const server = createServer(async (req, res) => {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = parse(req.url, true);

  // Route API requests
  if (parsedUrl.pathname.startsWith('/api/')) {
    const functionName = parsedUrl.pathname.replace('/api/', '');

    // Read request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        // Parse body if it exists
        const parsedBody = body ? JSON.parse(body) : {};

        // Create Vercel-compatible request object
        const vercelReq = {
          method: req.method,
          headers: req.headers,
          body: parsedBody,
          query: parsedUrl.query,
          url: parsedUrl.pathname,
        };

        // Create Vercel-compatible response object
        const vercelRes = {
          status: (code) => {
            res.statusCode = code;
            return vercelRes;
          },
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return vercelRes;
          },
          send: (data) => {
            res.end(data);
            return vercelRes;
          },
        };

        // Load and execute handler
        const handler = await loadHandler(functionName);

        if (!handler) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'API endpoint not found' }));
          return;
        }

        await handler(vercelReq, vercelRes);

      } catch (error) {
        console.error('API Error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'Internal server error',
          message: error.message
        }));
      }
    });

  } else {
    // Not an API route
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Development API server running at http://localhost:${PORT}`);
  console.log(`   API endpoints available at http://localhost:${PORT}/api/*\n`);
});
