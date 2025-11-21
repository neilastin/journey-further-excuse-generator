# Slack Integration Documentation

## Overview

The Excuse Generator includes 1-click Slack sharing functionality that posts generated excuses (with images) to a designated Slack channel.

## Setup

### Environment Variables

Add to `.env.local`:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Creating a Slack Webhook

1. Go to https://api.slack.com/apps
2. Create a new app or select existing app
3. Navigate to "Incoming Webhooks"
4. Activate Incoming Webhooks
5. Click "Add New Webhook to Workspace"
6. Select the channel (e.g., #excuses)
7. Copy the webhook URL
8. Add to `.env.local`

## Message Format

### ⚠️ IMPORTANT: Use Attachments Format (Not Block Kit)

**The working implementation uses Slack's attachments format, NOT Block Kit.**

During development, we tried multiple approaches:
- ❌ Block Kit with Unicode emojis → `invalid_blocks` error
- ❌ Block Kit with Slack emoji codes → `invalid_blocks` error
- ✅ **Attachments format with emoji codes** → SUCCESS

### Working Message Structure

```typescript
const slackMessage = {
  text: ':fox_face: *New Excuse Generated*',
  attachments: [
    {
      color: '#e01e5a',  // Hex color for sidebar (red/green/purple)
      fields: [
        {
          title: 'Type',
          value: ':red_circle: Risky Excuse',
          short: true  // Display side-by-side
        },
        {
          title: 'Shares This Hour',
          value: '1/10',
          short: true  // Display side-by-side
        },
        {
          title: 'Situation',
          value: 'User-provided scenario text',
          short: false  // Full width
        },
        {
          title: 'Excuse',
          value: 'Generated excuse text',
          short: false  // Full width
        }
      ],
      image_url: 'https://url-to-image.png',
      footer: 'Anonymously shared via the Excuse Generator',
      ts: Math.floor(Date.now() / 1000)  // Unix timestamp
    }
  ]
};
```

## Key Implementation Details

### 1. Rate Limiting

- **Limit**: 10 shares per hour per IP address
- **Implementation**: In-memory Map-based storage
- **Reset**: Automatically after 1 hour
- **Response**: Returns remaining shares count

### 2. Image Handling

**Development Mode** (no `BLOB_READ_WRITE_TOKEN`):
- Uses placeholder image URL
- Skips Vercel Blob upload
- Allows testing without blob storage

**Production Mode** (with `BLOB_READ_WRITE_TOKEN`):
- Uploads base64 image to Vercel Blob
- Generates public URL
- Includes in Slack message

### 3. Text Truncation

Slack has character limits:
- **Scenario**: Truncated to 500 chars
- **Excuse**: Truncated to 2900 chars
- Adds "... (truncated)" suffix if needed

### 4. Color Coding

Excuse types have color-coded sidebars:
- `excuse1` (Safe): `#00a651` (green)
- `excuse2` (Risky): `#e01e5a` (red)
- `excuse3` (Creative): `#9b59b6` (purple)

### 5. Emoji Format

**CRITICAL**: Use Slack emoji codes, not Unicode:
- ✅ `:fox_face:` (correct)
- ❌ `🦊` (will cause errors)
- ✅ `:red_circle:` (correct)
- ❌ `🔴` (will cause errors)

## File Structure

### Backend
- `api/share-to-slack.ts` - Main serverless function
  - Handles POST requests
  - Validates input
  - Enforces rate limiting
  - Uploads images (production)
  - Posts to Slack webhook

### Frontend
- `src/components/ImageDisplay.tsx` - Share button UI
  - Displays "Share to Slack #excuses" button
  - Shows loading/success/error states
  - Handles API calls

- `src/components/PhotoEvidence.tsx` - Prop passing
  - Passes scenario and excuse text to ImageDisplay

- `src/types/index.ts` - TypeScript interfaces
  - `ShareToSlackRequest`
  - `ShareToSlackResponse`

## Testing Locally

1. Generate an excuse
2. Generate photo evidence
3. Click "Share to Slack #excuses"
4. Check your Slack channel

**Note**: In development mode, images will show as placeholder. This is expected behavior.

## Production Deployment

### Required Environment Variables

Set in Vercel Dashboard:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx (auto-configured by Vercel)
```

## Future Modifications

### Changing Message Format

If you need to modify the Slack message format:

**✅ SAFE to change**:
- Text content in `fields[].value`
- Color values
- Footer text
- Adding/removing fields (keep structure)

**⚠️ DO NOT change**:
- Use of `attachments` format (stay away from Block Kit)
- Emoji format (must use `:emoji_code:` not Unicode)
- Top-level message structure

**Example: Adding a new field**
```typescript
fields: [
  // ... existing fields ...
  {
    title: 'New Field Name',
    value: 'Field content here',
    short: false  // true for side-by-side, false for full width
  }
]
```

### Testing Format Changes

1. Use Slack's Message Builder: https://api.slack.com/docs/messages/builder
2. Test with attachments format
3. Verify locally before deploying

## Troubleshooting

### Error: "invalid_blocks"
- You likely have Unicode emojis instead of emoji codes
- Check for any `🦊` → replace with `:fox_face:`
- Ensure you're using attachments, not Block Kit

### Error: "Slack integration not configured"
- Missing `SLACK_WEBHOOK_URL` in `.env.local`
- Verify webhook URL is correct

### Error: "Share limit reached"
- Rate limit hit (10 shares/hour per IP)
- Wait 1 hour or restart server (clears in-memory store)

### Images not showing
- **Development**: Expected behavior (placeholder shown)
- **Production**: Check `BLOB_READ_WRITE_TOKEN` is configured
- Verify image URL is publicly accessible

## API Reference

### POST /api/share-to-slack

**Request Body**:
```typescript
{
  scenario: string;        // User's situation
  excuseText: string;      // Generated excuse
  excuseType: 'excuse1' | 'excuse2' | 'excuse3';
  imageBase64: string;     // Base64 data URL
}
```

**Success Response** (200):
```typescript
{
  success: true,
  message: 'Shared to Slack successfully',
  remaining: 9  // Shares remaining this hour
}
```

**Error Responses**:
- `400`: Missing required fields
- `429`: Rate limit exceeded
- `500`: Slack webhook failed or internal error

## Security Notes

- Webhook URL must be kept secret
- Rate limiting prevents abuse
- Sharing is anonymous (no user identification)
- IP-based rate limiting (not user-based)
- In-memory storage (resets on serverless cold start)
