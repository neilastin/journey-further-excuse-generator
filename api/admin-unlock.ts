import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

// Rate limiting store (in-memory, resets on serverless function cold start)
const rateLimitStore = new Map<string, { attempts: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

function getRateLimitKey(req: VercelRequest): string {
  // Use IP address for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || 'unknown';
  return `admin-unlock:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // No record or expired - allow and create new record
    rateLimitStore.set(key, { attempts: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  // Increment attempts
  record.attempts += 1;
  rateLimitStore.set(key, record);
  return { allowed: true, remaining: MAX_ATTEMPTS - record.attempts };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Check rate limiting
    const rateLimitKey = getRateLimitKey(req);
    const { allowed, remaining } = checkRateLimit(rateLimitKey);

    if (!allowed) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again in 5 minutes.'
      });
    }

    // Get password from request body
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Get password hash from environment
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!passwordHash) {
      console.error('ADMIN_PASSWORD_HASH not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, passwordHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: `Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
      });
    }

    // Generate session token (24-hour validity)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // In a production app, you'd store this token in a database
    // For now, we'll just return it and validate on the client
    // The frontend will include it in requests, and we'll validate the hash matches

    return res.status(200).json({
      success: true,
      token,
      message: 'Pro mode unlocked successfully'
    });

  } catch (error) {
    console.error('Admin unlock error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
