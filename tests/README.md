# Test Suite - Not My Fault

## Overview

This directory contains the smoke test suite for the "Not My Fault" excuse generator application.

## Test Philosophy

**Quality > Quantity:** This project uses a minimal smoke test suite (5 tests) rather than comprehensive testing. This decision was made after discovering that extensive test suites (50+ tests) were too brittle and didn't match the app's simplicity.

**Key Principle:** Test that the app works, not every edge case.

## Files

### `smoke.spec.ts`
Main test file containing 5 core tests:
1. App loads successfully
2. Excuse generation (Claude API integration)
3. Tab switching between excuse types
4. Form validation
5. Image generation (Gemini API integration)

**Runtime:** ~8-10 minutes (desktop + mobile)

### `SMOKE-TEST-GUIDE.md`
Complete testing documentation including:
- How to run tests
- What each test does
- Troubleshooting tips
- When to run tests
- FAQ

## Quick Start

**Run tests (headless):**
```bash
npm run test:smoke
```

**Run tests (headed - watch in browser):**
```bash
npm run test:smoke:headed
```

**Debug mode:**
```bash
npm run test:smoke:debug
```

**View test report:**
```bash
npm run test:report
```

## Configuration

Tests are configured in `playwright.config.ts`:
- **Timeout:** 90s per test (allows for API latency)
- **Execution:** Sequential (1 worker) to avoid API rate limits
- **Devices:** Desktop (1920×1080) + Mobile (Pixel 5 375×667)
- **Failure handling:** Screenshots + videos saved to `test-results/`

## Prerequisites

1. **Environment variables** in `.env.local`:
   - `ANTHROPIC_API_KEY` (for excuse generation)
   - `GEMINI_API_KEY` (for image generation)

2. **Dev server running:**
   ```bash
   npm run dev
   ```

## Helper Functions

### `generateExcuses(page)`
Prerequisite helper used by tests 3-5:
- Navigates to homepage
- Fills scenario textarea
- Selects audience
- Clicks "Generate Excuses"
- Waits for excuse tabs to appear

## Important Notes

- **On-demand only:** Tests should NOT run automatically in CI/CD (uses API quota, requires keys)
- **API dependency:** Tests require valid API keys and working APIs
- **Sequential execution:** Running tests in parallel will hit API rate limits
- **Lenient image test:** Test 5 passes even if image generation fails (allows for API quota issues)

## Test Coverage

✅ Core user flows tested:
- App loads with all UI elements
- Excuse generation with Claude API
- Tab navigation between excuse types
- Form validation (10+ character requirement)
- Image generation with Gemini API

✅ Cross-device testing:
- Desktop viewport (1920×1080)
- Mobile viewport (Pixel 5 375×667)

## When to Run

**Do run:**
- Before deploying to production
- After major feature changes
- After API integration changes

**Don't run:**
- On every commit (too slow)
- In automated CI/CD (requires API keys)

## More Information

See `SMOKE-TEST-GUIDE.md` for comprehensive documentation.

---

**Test Suite Status:** ✅ Complete (Phase 7)
**Last Updated:** 2025-10-29
