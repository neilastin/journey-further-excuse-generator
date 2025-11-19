# Smoke Test Suite

5 critical tests verifying core functionality. Designed to be simple, reliable, and fast.

**Runtime:** ~8-10 minutes (desktop + mobile)

## Prerequisites

1. API keys in `.env.local` (`ANTHROPIC_API_KEY`, `GEMINI_API_KEY`)
2. Dev server running: `npm run dev`

## Commands

```bash
npm run test:smoke         # Run tests (headless)
npm run test:smoke:headed  # Watch tests in browser
npm run test:smoke:debug   # Step through tests
npm run test:report        # View HTML report
```

Run single test:
```bash
npx playwright test -g "should generate excuses"
```

## Tests

1. **App Loads** - Header, hero, form, footer visible
2. **Excuse Generation** - Full flow with Claude API (90s timeout)
3. **Tab Switching** - Switch between "Believable" and "Risky!" tabs
4. **Form Validation** - Button enables only with valid input (10+ chars)
5. **Image Generation** - Gemini API flow (lenient - passes with error message)

## Configuration

- **Devices:** Desktop (1920x1080) + Mobile (Pixel 5)
- **Execution:** Sequential (1 worker) to avoid rate limits
- **Timeout:** 90s per test
- **On failure:** Screenshots + videos in `test-results/`

## Troubleshooting

**Tests timeout:** Check API keys, dev server running, rate limits

**Button disabled:** Form needs 10+ character scenario

**Element not found:** UI changed, update selectors in `smoke.spec.ts`

**Port in use:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

## When to Run

**Do run:** Before production deploy, after major changes

**Don't run:** Every commit (slow), in CI/CD (requires API keys)
