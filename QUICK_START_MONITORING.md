# Quick Start: Monitoring Setup

**5-Minute Setup Guide** for Vercel Analytics & Sentry Error Monitoring

---

## ✅ Already Done

Both monitoring systems are already integrated in `src/main.tsx`. You just need to configure them!

---

## 🚀 Step 1: Vercel Analytics (30 seconds)

**No setup required!** It works automatically once deployed.

1. Deploy to Vercel: `vercel deploy`
2. Enable Analytics in your [Vercel Dashboard](https://vercel.com/dashboard)
3. Done! 🎉

---

## 🚀 Step 2: Sentry Error Monitoring (5 minutes)

### Get Your Sentry DSN

1. **Sign up**: [sentry.io/signup](https://sentry.io/signup/) (free)
2. **Create project**: Choose "React" as the platform
3. **Copy your DSN**: It looks like this:
   ```
   https://abc123xyz@o123456.ingest.sentry.io/7891011
   ```

### Add DSN to Your App

Open `src/main.tsx` (line 12) and replace:

```typescript
// BEFORE:
dsn: 'YOUR_SENTRY_DSN_HERE',

// AFTER (use your actual DSN):
dsn: 'https://abc123xyz@o123456.ingest.sentry.io/7891011',
```

### Deploy

```bash
npm run build
vercel deploy
```

Done! 🎉

---

## 🧪 Test Locally (Optional)

### Test Sentry Error Capture

1. **Enable in development** (temporarily):

   In `src/main.tsx` (line 15), comment out:
   ```typescript
   // enabled: !import.meta.env.DEV,
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Trigger a test error** in browser console:
   ```javascript
   throw new Error("Test error for Sentry")
   ```

4. **Check Sentry dashboard**: [sentry.io](https://sentry.io) → Issues

5. **Re-enable production-only mode**:
   ```typescript
   enabled: !import.meta.env.DEV,  // Uncomment this line
   ```

---

## 📊 Where to View Data

| Service | URL | What You'll See |
|---------|-----|-----------------|
| **Vercel Analytics** | [vercel.com/dashboard](https://vercel.com/dashboard) → Your Project → Analytics | Page views, visitors, performance metrics |
| **Sentry Errors** | [sentry.io](https://sentry.io) → Your Project → Issues | Real-time errors with stack traces |
| **Sentry Performance** | [sentry.io](https://sentry.io) → Your Project → Performance | Page load times, transaction traces |

---

## ⚙️ Configuration Summary

**Current settings in `src/main.tsx`:**

```typescript
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE',           // ← REPLACE THIS
  environment: 'production' | 'development',
  enabled: !import.meta.env.DEV,         // Production only
  tracesSampleRate: 1.0,                 // 100% performance tracking
  replaysOnErrorSampleRate: 1.0,         // 100% error replays
  replaysSessionSampleRate: 0.1,         // 10% general session replays
})
```

**These settings are optimized for low-traffic apps.** No changes needed unless you have high traffic.

---

## 💰 Cost

| Service | Free Tier | Sufficient? |
|---------|-----------|-------------|
| **Vercel Analytics** | Unlimited page views | ✅ Yes |
| **Sentry** | 5,000 errors/month | ✅ Yes for most apps |

Both are **free** and require **no credit card**.

---

## 🆘 Troubleshooting

### Vercel Analytics not showing data
- ✅ Deployed to Vercel? (doesn't work on localhost)
- ✅ Enabled in Vercel Dashboard?
- ✅ Waited 5-10 minutes for data?

### Sentry not capturing errors
- ✅ DSN correct in `src/main.tsx` line 12?
- ✅ Deployed to production?
- ✅ Using the correct Sentry project?

### "Invalid DSN" error
- ✅ Format: `https://KEY@ORG.ingest.sentry.io/PROJECT`
- ✅ No extra quotes or whitespace

---

## 📖 Full Documentation

For detailed setup, privacy settings, and advanced configuration, see:
- **[MONITORING_SETUP.md](./MONITORING_SETUP.md)** (comprehensive guide)

---

## ✨ Features You Get

### Vercel Analytics
- ✅ Real-time visitor tracking
- ✅ Page view analytics
- ✅ Performance monitoring (Core Web Vitals)
- ✅ Geographic insights

### Sentry
- ✅ Real-time error tracking
- ✅ Full stack traces
- ✅ User session replays (video-like)
- ✅ Performance monitoring
- ✅ Email alerts for new errors
- ✅ Custom error boundary fallback UI

---

**That's it! You're now monitoring both analytics and errors in production.** 🚀
