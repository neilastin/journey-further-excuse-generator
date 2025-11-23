/**
 * Slack Sharing API Endpoint
 *
 * Shares generated excuses with images to Slack via incoming webhook.
 *
 * IMPORTANT MESSAGE FORMAT NOTES:
 * - This implementation uses Slack's "attachments" format (NOT Block Kit)
 * - Attachments format is older but more reliable with webhooks
 * - Block Kit format caused persistent "invalid_blocks" errors
 * - Always use Slack emoji codes (e.g., :fox_face:), never Unicode (🦊)
 *
 * See SLACK-INTEGRATION.md for complete documentation.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

// Rate limiting store (in-memory, resets on serverless function cold start)
const rateLimitStore = new Map<string, { shares: number; resetAt: number }>();
const MAX_SHARES_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function getRateLimitKey(req: VercelRequest): string {
  // Use IP address for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || 'unknown';
  return `slack-share:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // No record or expired - allow and create new record
    rateLimitStore.set(key, { shares: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_SHARES_PER_HOUR - 1 };
  }

  if (record.shares >= MAX_SHARES_PER_HOUR) {
    const minutesUntilReset = Math.ceil((record.resetAt - now) / 60000);
    return { allowed: false, remaining: 0 };
  }

  // Increment shares
  record.shares += 1;
  rateLimitStore.set(key, record);
  return { allowed: true, remaining: MAX_SHARES_PER_HOUR - record.shares };
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
        message: 'Share limit reached. Please try again in an hour.'
      });
    }

    // Get request body
    const { scenario, excuseText, excuseType, imageBase64 } = req.body;

    // Validate required fields
    if (!scenario || !excuseText || !excuseType || !imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get Slack webhook URL from environment
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured');
      return res.status(500).json({
        success: false,
        message: 'Slack integration not configured'
      });
    }

    // Handle image upload differently for dev vs production
    let imageUrl: string;

    // Check if we're in development (not running on Vercel)
    const isDevelopment = !process.env.VERCEL;
    console.log('Environment check - VERCEL:', process.env.VERCEL);
    console.log('Environment check - BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'NOT SET');

    if (isDevelopment) {
      // In development, we'll use a workaround since Slack doesn't support base64 in block images
      // We'll use a placeholder message instead
      console.log('Development mode: Skipping Vercel Blob upload');
      imageUrl = 'https://via.placeholder.com/800x450.png?text=Development+Mode+-+Image+Upload+Skipped';
    } else {
      // Production: Upload to Vercel Blob
      try {
        console.log('Production mode: Attempting Vercel Blob upload');
        const base64Match = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
        if (!base64Match) {
          return res.status(400).json({
            success: false,
            message: 'Invalid image format'
          });
        }

        const mimeType = base64Match[1] === 'jpg' ? 'jpeg' : base64Match[1];
        const base64Data = base64Match[2];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        console.log(`Uploading image: ${imageBuffer.length} bytes, type: ${mimeType}`);

        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const filename = `excuse-${timestamp}.${mimeType}`;

        // Upload to Vercel Blob with timeout
        const blob = await put(filename, imageBuffer, {
          access: 'public',
          contentType: `image/${mimeType}`,
        });

        imageUrl = blob.url;
        console.log('Blob upload successful:', imageUrl);
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError);
        // Fallback to placeholder if blob upload fails
        console.log('Falling back to placeholder image');
        imageUrl = 'https://via.placeholder.com/800x450.png?text=Image+Upload+Failed';
      }
    }

    // Format excuse type for display
    const excuseTypeDisplay = excuseType === 'excuse1'
      ? 'Safe Excuse'
      : excuseType === 'excuse2'
      ? 'Risky Excuse'
      : 'Creative Excuse';

    // Truncate text fields to fit Slack's limits (3000 chars per text block)
    const truncateText = (text: string, maxLength: number = 2900): string => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '... (truncated)';
    };

    const truncatedScenario = truncateText(scenario, 500);
    const truncatedExcuse = truncateText(excuseText, 2900);

    // Format excuse type for Slack message
    // IMPORTANT: Use Slack emoji codes (e.g., :red_circle:), NOT Unicode emojis (e.g., 🔴)
    // Unicode emojis cause "invalid_blocks" errors
    const excuseTypeEmoji = excuseType === 'excuse1'
      ? ':green_circle:'
      : excuseType === 'excuse2'
      ? ':red_circle:'
      : ':purple_circle:';

    // Calculate share count (inverse of remaining)
    const shareCount = MAX_SHARES_PER_HOUR - remaining;

    // Log the image URL for debugging
    console.log('Image URL for Slack:', imageUrl);
    console.log('Image URL type:', typeof imageUrl);
    console.log('Image URL length:', imageUrl?.length);

    // Build Slack message using attachments format
    // ⚠️ CRITICAL: Use "attachments" format, NOT Block Kit "blocks" format
    // Block Kit was consistently rejected with "invalid_blocks" error
    // The attachments format is older but more reliable
    // See SLACK-INTEGRATION.md for full documentation
    const slackMessage = {
      text: `:excuseme: *New excuse incoming...*`,
      attachments: [
        {
          color: excuseType === 'excuse1' ? '#00a651' : excuseType === 'excuse2' ? '#e01e5a' : '#9b59b6',
          fields: [
            {
              title: 'Situation',
              value: truncatedScenario,
              short: false
            },
            {
              title: 'Excuse',
              value: truncatedExcuse,
              short: false
            }
          ],
          image_url: imageUrl,
          footer: 'Anonymously shared via the Excuse Generator',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    // Log the complete Slack message for debugging
    console.log('Complete Slack message:', JSON.stringify(slackMessage, null, 2));

    // Post to Slack
    const slackResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error('Slack webhook failed:', errorText);
      console.error('Slack message sent:', JSON.stringify(slackMessage, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Failed to post to Slack'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Shared to Slack successfully',
      remaining
    });

  } catch (error) {
    console.error('Share to Slack error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
