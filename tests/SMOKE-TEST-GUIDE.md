# Smoke Test Guide

## Overview

This smoke test suite contains **5 critical tests** that verify the core functionality of the "Not My Fault" excuse generator application. These tests are designed to be simple, reliable, and fast.

**Purpose:** Catch major regressions without the overhead of comprehensive testing
**Runtime:** ~8-10 minutes (runs on both desktop and mobile)
**Philosophy:** Test that the app works, not every edge case

---

## Quick Start

### Prerequisites

1. **Environment variables configured:**
   - `ANTHROPIC_API_KEY` in `.env.local` (for excuse generation)
   - `GEMINI_API_KEY` in `.env.local` (for image generation)

2. **Dependencies installed:**
   ```bash
   npm install
   ```

3. **Dev server running:**
   ```bash
   npm run dev
   ```
   - Vite will start on `http://localhost:5173`
   - API server will start on `http://localhost:3001`

### Running Tests

**Default (headless mode on desktop + mobile):**
```bash
npm run test:smoke
```

**Headed mode (watch tests run in browser):**
```bash
npm run test:smoke:headed
```

**Debug mode (step through tests):**
```bash
npm run test:smoke:debug
```

**View test report:**
```bash
npm run test:report
```

---

## What Gets Tested

### Test 1: App Loads Successfully ✅
**What it does:**
- Navigates to homepage
- Verifies header, hero, form, and footer are visible

**Why it matters:**
- Ensures basic app structure renders
- Catches broken imports or build issues

**Expected result:** All core UI elements visible

---

### Test 2: Excuse Generation - Happy Path ✅
**What it does:**
- Fills scenario field with valid text
- Selects audience from dropdown
- Clicks "Generate Excuses"
- Waits for excuse tabs to appear
- Verifies excuse text is displayed

**Why it matters:**
- This is THE core feature of the app
- Tests full excuse generation flow end-to-end
- Validates Claude API integration

**Expected result:** Two excuse tabs ("Believable" and "Risky!") appear with excuse text

**Timeout:** 90 seconds (allows for API latency)

---

### Test 3: Tab Switching Between Excuse Types ✅
**What it does:**
- Generates excuses (using helper function)
- Clicks between "Believable" and "Risky!" tabs
- Verifies different excuse text appears

**Why it matters:**
- Ensures tab navigation works
- Validates that both excuses were generated

**Expected result:** Different excuse text appears when switching tabs

---

### Test 4: Form Validation ✅
**What it does:**
- Verifies button is disabled with empty form
- Tries scenario with <10 characters
- Confirms button stays disabled
- Fills valid scenario (≥10 characters)
- Confirms button becomes enabled

**Why it matters:**
- Prevents invalid API calls
- Ensures UX provides clear feedback

**Expected result:** Button only enables when form is valid

---

### Test 5: Image Generation Basic Flow ✅
**What it does:**
- Generates excuses first (prerequisite)
- Scrolls to "Photo Evidence" section
- Clicks "Generate Photo Evidence"
- Waits for loading state or result
- Accepts either image or error message

**Why it matters:**
- Tests Gemini API integration
- Validates image generation UI flow
- Ensures graceful error handling

**Expected result:** UI responds to generate request (loading → image OR error)

**Timeout:** 90 seconds (image generation is slow)

**Note:** This test is lenient - it passes if the UI responds, even if image generation fails (API quota, rate limits, etc.)

---

## Test Configuration

### Devices Tested

**Desktop:**
- Browser: Chrome
- Viewport: 1920×1080

**Mobile:**
- Device: Pixel 5
- Viewport: 375×667

### Execution Strategy

- **Sequential execution** (1 worker) to avoid API rate limits
- **No retries** - tests should be reliable
- **90-second timeout** per test (allows for API latency)
- **Screenshots on failure** - saved to `test-results/`
- **Videos on failure** - saved to `test-results/`

### Reports

After running tests, view the HTML report:
```bash
npm run test:report
```

This opens an interactive report showing:
- Pass/fail status for each test
- Execution time
- Screenshots/videos of failures
- Console logs

---

## Troubleshooting

### Tests fail with "Button is disabled"

**Cause:** Form validation not passing
**Check:**
- Is scenario field filled with ≥10 characters?
- Is audience selected?

**Fix:** Update test to fill form correctly

---

### Tests timeout waiting for excuses

**Cause:** API call taking too long or failing
**Check:**
- Are API keys set in `.env.local`?
- Is dev server running (`npm run dev`)?
- Are you hitting Anthropic API rate limits?

**Debug:**
```bash
npm run test:smoke:headed
```
Watch the browser to see what's happening

---

### Tests fail with "Element not found"

**Cause:** UI changed but tests weren't updated
**Check:**
- Does the element selector match current UI?
- Did component structure change?

**Fix:** Update selectors in `tests/smoke.spec.ts`

---

### Image generation test fails

**Cause:** Gemini API quota exhausted or rate limited
**Expected:** This test is lenient - it should pass even if image fails, as long as UI shows error

**If it still fails:**
- Check that error message is displayed in UI
- Verify test looks for `text=/error|failed/i`

---

### "Address already in use" error

**Cause:** Dev server port (3001 or 5173) already occupied
**Fix:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

---

## When to Run Tests

**Before deploying:**
- Always run smoke tests before pushing to production
- Ensures core functionality works

**After major changes:**
- New features touching excuse generation
- API integration changes
- Form validation changes

**Don't run:**
- On every tiny commit (too slow, uses API quota)
- In CI/CD (requires API keys, uses quota)

---

## Maintenance

### When UI Changes

If components are renamed or restructured:

1. Run test in headed mode to see what's happening:
   ```bash
   npm run test:smoke:headed
   ```

2. Update selectors in `tests/smoke.spec.ts`:
   ```typescript
   // Example: Tab name changed from "Believable" to "Safe"
   await page.locator('button:has-text("Safe")').click();
   ```

3. Re-run tests to verify

### Adding New Tests

**Don't.** This is a smoke suite - keep it minimal (5 tests max).

If you need comprehensive testing, create a separate suite:
- `tests/comprehensive.spec.ts`
- Update `package.json` with `test:comprehensive` command

---

## FAQ

**Q: Why only 5 tests?**
A: Smoke tests verify the app works, not every edge case. Fast, simple, reliable.

**Q: Why 90-second timeout?**
A: Claude API can be slow, especially with cold starts. Gemini image generation takes 20-60 seconds.

**Q: Why not run in CI/CD?**
A: These tests call real APIs (costs money, uses quota). Better suited for manual pre-deployment checks.

**Q: Can I run just one test?**
A: Yes:
```bash
npx playwright test -g "should generate excuses"
```

**Q: Why test on mobile?**
A: Responsive design issues are common. Mobile viewport catches layout bugs.

---

## Reference

**Test file:** `tests/smoke.spec.ts`
**Config file:** `playwright.config.ts`
**Helper function:** `generateExcuses()` - used by tests 3-5

**Playwright docs:** https://playwright.dev/docs/intro
