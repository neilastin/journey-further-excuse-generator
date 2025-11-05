# Monitoring & Analytics Setup Guide

This guide explains how to configure **Vercel Analytics** and **Sentry Error Monitoring** for the Not My Fault application.

## Overview

Both monitoring systems have been integrated into `src/main.tsx`:

- **Vercel Analytics**: Automatic page view and visitor tracking (production only)
- **Sentry Error Monitoring**: Real-time error tracking, performance monitoring, and session replay

---

## 1. Vercel Analytics

### What It Does
- Tracks page views and unique visitors
- Provides real-time analytics dashboard
- Measures Core Web Vitals (performance metrics)
- **Zero configuration required** - works automatically in production

### Setup Steps

**No setup needed!** Vercel Analytics is already integrated and will automatically start tracking once deployed to Vercel.

### How to Verify It's Working

1. **Deploy your app to Vercel** (if not already deployed):
   ```bash
   npm run build
   vercel deploy
   ```

2. **Enable Analytics in Vercel Dashboard**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Navigate to the **Analytics** tab
   - Enable Web Analytics if prompted

3. **View Analytics Data**:
   - Visit your live site a few times
   - Return to the Vercel Analytics tab
   - You should see page views, visitors, and performance metrics

### Important Notes
- Analytics **only run in production** (not on localhost)
- Data may take a few minutes to appear in the dashboard
- No API keys or environment variables needed
- Free tier includes basic analytics for all projects

---

## 2. Sentry Error Monitoring

### What It Does
- Captures JavaScript errors and exceptions in real-time
- Tracks performance with distributed tracing
- Records user sessions with Session Replay (when errors occur)
- Provides detailed stack traces and error context
- Sends email notifications for new errors

### Setup Steps

#### Step 1: Create a Free Sentry Account

1. Go to [sentry.io/signup](https://sentry.io/signup/)
2. Sign up for a free account (supports up to 5,000 errors/month)
3. Create a new project:
   - Platform: **React**
   - Project name: `not-my-fault` (or your preference)
   - Alert frequency: Choose your preference

#### Step 2: Get Your DSN

1. After creating your project, Sentry will display your **DSN** (Data Source Name)
2. It looks like this: `https://abc123xyz@o123456.ingest.sentry.io/7891011`
3. Copy this DSN - you'll need it in the next step

**If you need to find your DSN later:**
- Go to [sentry.io](https://sentry.io)
- Select your project
- Navigate to **Settings > Projects > [Your Project] > Client Keys (DSN)**

#### Step 3: Add DSN to Your Application

Open `src/main.tsx` and replace the placeholder DSN:

**Find this line (line 12):**
```typescript
dsn: 'YOUR_SENTRY_DSN_HERE',
```

**Replace with your actual DSN:**
```typescript
dsn: 'https://abc123xyz@o123456.ingest.sentry.io/7891011',
```

#### Step 4: Test in Development (Optional)

By default, Sentry is disabled in development. To test it locally:

1. **Temporarily enable Sentry in development**:

   In `src/main.tsx`, comment out line 15:
   ```typescript
   // enabled: !import.meta.env.DEV,
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Test error capture**:

   Open browser console and type:
   ```javascript
   throw new Error("Test error for Sentry")
   ```

4. **Check Sentry dashboard**:
   - Go to [sentry.io](https://sentry.io)
   - Select your project
   - Navigate to **Issues**
   - You should see your test error appear within seconds

5. **Re-enable production-only mode** (recommended):

   Uncomment line 15 in `src/main.tsx`:
   ```typescript
   enabled: !import.meta.env.DEV,
   ```

#### Step 5: Deploy to Production

1. **Build and deploy**:
   ```bash
   npm run build
   vercel deploy
   ```

2. **Sentry will now capture errors in production automatically**

### How to Use Sentry

#### View Errors
1. Go to [sentry.io](https://sentry.io)
2. Select your project
3. Navigate to **Issues** to see all captured errors
4. Click any error to see:
   - Full stack trace
   - User context (browser, OS, etc.)
   - Breadcrumbs (user actions leading to error)
   - Session replay (if error occurred during a session)

#### Configure Alerts
1. Go to **Alerts** in your Sentry project
2. Set up email/Slack notifications for:
   - New errors
   - Error frequency spikes
   - Performance degradation

#### View Performance
1. Go to **Performance** tab
2. See:
   - Page load times
   - API response times
   - Transaction traces

### Configuration Options

The current configuration in `src/main.tsx` is optimized for a low-traffic app:

```typescript
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE',
  environment: import.meta.env.DEV ? 'development' : 'production',
  enabled: !import.meta.env.DEV, // Only production
  tracesSampleRate: 1.0,         // 100% performance monitoring
  replaysOnErrorSampleRate: 1.0, // 100% error replays
  replaysSessionSampleRate: 0.1, // 10% general replays
})
```

**If your app gets high traffic**, adjust these rates:
- `tracesSampleRate: 0.1` (10% of transactions)
- `replaysSessionSampleRate: 0.01` (1% of sessions)

### Error Boundary

The app includes a custom error fallback UI that displays when a React error occurs:

- Clean, minimal design matching the app's dark theme
- User-friendly error message
- "Reload Page" button
- Automatically reports error to Sentry

**To test the Error Boundary:**
1. Add a component that throws an error
2. The fallback UI will appear
3. Check Sentry dashboard for the error report

---

## 3. Environment Variables (Optional)

If you prefer to store your Sentry DSN in an environment variable:

### For Local Development

1. Add to `.env.local`:
   ```bash
   VITE_SENTRY_DSN=https://your-dsn-here@o123456.ingest.sentry.io/7891011
   ```

2. Update `src/main.tsx`:
   ```typescript
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     // ... rest of config
   })
   ```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add:
   - **Key**: `VITE_SENTRY_DSN`
   - **Value**: Your Sentry DSN
   - **Environment**: Production (and Preview if desired)
4. Redeploy your app

---

## 4. Troubleshooting

### Vercel Analytics Not Showing Data

**Problem**: No data in Vercel Analytics dashboard

**Solutions**:
1. Ensure you've deployed to Vercel (doesn't work on localhost)
2. Check that Analytics is enabled in Vercel project settings
3. Wait 5-10 minutes for data to appear
4. Verify you're viewing the correct environment (Production vs Preview)

### Sentry Not Capturing Errors

**Problem**: Errors not appearing in Sentry dashboard

**Solutions**:
1. Verify your DSN is correct (check `src/main.tsx` line 12)
2. Check that `enabled: !import.meta.env.DEV` is commented out for local testing
3. Ensure you're testing in the correct environment (dev vs production)
4. Check browser console for Sentry initialization errors
5. Verify you're logged into the correct Sentry organization/project

### "Invalid DSN" Error

**Problem**: Console shows "Invalid DSN" error

**Solutions**:
1. Ensure DSN format is correct: `https://PUBLIC_KEY@ORG_ID.ingest.sentry.io/PROJECT_ID`
2. Remove any extra quotes or whitespace
3. Verify the DSN in your Sentry project settings

### Build Errors After Installing Packages

**Problem**: TypeScript or build errors after installation

**Solutions**:
1. Clear build cache: `rm -rf dist node_modules/.vite`
2. Reinstall dependencies: `npm install`
3. Rebuild: `npm run build`

---

## 5. Cost & Limits

### Vercel Analytics
- **Free Tier**: Unlimited page views, basic metrics
- **Pro**: $20/month for advanced features (funnels, custom events)
- No credit card required for free tier

### Sentry
- **Free Developer Plan**:
  - 5,000 errors/month
  - 10,000 performance units/month
  - 500 replay sessions/month
  - 1 team member
  - 90-day data retention
- **Paid Plans**: Start at $26/month for more capacity
- No credit card required for free tier

For "Not My Fault", the free tiers of both services should be more than sufficient.

---

## 6. Privacy & Data Collection

### What Data Is Collected?

**Vercel Analytics**:
- Page URLs visited
- Referrer sources
- Device type (mobile, desktop, tablet)
- Browser type and version
- Geographic location (country/city level)
- Core Web Vitals performance metrics

**Sentry**:
- Error messages and stack traces
- Browser and OS information
- User IP address (hashed by default)
- URLs where errors occurred
- Console logs and breadcrumbs
- Session replays (video-like recordings) when errors occur

### Privacy Configuration

Both services respect user privacy:

**Vercel Analytics**:
- No cookies used
- GDPR compliant
- Anonymized by default

**Sentry**:
- Sensitive data scrubbing enabled by default
- Session replay masks text and media by default (we've disabled this for better debugging)
- IP addresses are hashed
- Can implement custom data filtering in `beforeSend` callback

**To mask sensitive data in Session Replay**, update `src/main.tsx`:
```typescript
Sentry.replayIntegration({
  maskAllText: true,      // Mask all text content
  blockAllMedia: true,    // Block images/video
})
```

---

## 7. Next Steps

1. **Set up Sentry DSN** (required for error monitoring)
2. **Deploy to Vercel** (required for analytics)
3. **Test error capture** in development
4. **Monitor your dashboards** for the first week
5. **Adjust sample rates** if needed based on usage
6. **Set up alerts** in Sentry for critical errors

---

## 8. Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
- [Sentry Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)

---

## Summary

✅ **Vercel Analytics**: Already configured, will work automatically in production
✅ **Sentry Error Monitoring**: Requires DSN configuration (5 minutes)
✅ **Error Boundary**: Custom fallback UI included
✅ **TypeScript**: Full type safety maintained
✅ **Performance**: Session Replay and performance tracing enabled

Both systems are production-ready and require minimal ongoing maintenance.
