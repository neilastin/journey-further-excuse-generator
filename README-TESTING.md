# Testing Guide - Not My Fault

This guide explains how to run end-to-end tests for the "Not My Fault" excuse generator application, with a focus on the image generation feature.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)
- [Writing New Tests](#writing-new-tests)

## Overview

The test suite uses [Playwright](https://playwright.dev/) for end-to-end browser automation testing. It covers:

- Complete excuse generation flow
- Image generation with and without headshot upload
- File upload validation (file type, file size)
- API error handling
- Responsive design across different viewports
- Accessibility features

## Prerequisites

Before running tests, ensure you have:

1. **Node.js installed** (version 18 or higher)
2. **Dependencies installed**: `npm install`
3. **Environment variables configured**: `.env.local` file with valid API keys
4. **Playwright installed**: Already included in devDependencies

### Required Environment Variables

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**IMPORTANT:** Without valid API keys, the tests will fail when making API calls.

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies, including `@playwright/test`.

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This downloads the necessary browser binaries (Chromium, Firefox, WebKit).

### 3. Verify Test Fixtures

Ensure test images exist in `tests/fixtures/`:

```bash
# Download test images (if not already present)
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"

# Or run the setup script
node tests/fixtures/create-large-file.js
```

You should have these files:
- `tests/fixtures/test-headshot.jpg` (valid JPEG, < 1MB)
- `tests/fixtures/test-headshot.png` (valid PNG, < 1MB)
- `tests/fixtures/large-file.jpg` (oversized JPEG, > 5MB)
- `tests/fixtures/invalid-file.txt` (text file for error testing)

## Running Tests

### Run All Tests

```bash
npx playwright test
```

This will:
1. Start the development server (`npm run dev`)
2. Wait for it to be ready (Vite on port 5173, API on port 3001)
3. Run all test suites sequentially
4. Generate an HTML report

### Run Specific Test Suite

```bash
# Run only main image generation tests
npx playwright test tests/image-generation.spec.ts

# Run only error handling tests
npx playwright test tests/image-generation-errors.spec.ts

# Run only responsive design tests
npx playwright test tests/image-generation-responsive.spec.ts
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

This opens Playwright's interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute in real-time
- Debug failures with built-in tools

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

This shows the browser window during test execution (useful for debugging).

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

Opens the Playwright Inspector for step-by-step debugging.

### Run Specific Test by Name

```bash
npx playwright test -g "should generate image without headshot"
```

### Run Tests on Specific Browser

```bash
# Run on Chromium only (default)
npx playwright test --project=chromium

# Run on mobile viewport
npx playwright test --project=mobile-chrome

# Run on tablet viewport
npx playwright test --project=tablet
```

### View Test Report

After tests complete:

```bash
npx playwright show-report
```

This opens the HTML report in your browser showing:
- Test results (passed/failed)
- Screenshots of failures
- Traces and videos
- Execution time

## Test Suites

### 1. `tests/image-generation.spec.ts` (Main Test Suite)

**Happy path scenarios:**
- Generate image without headshot
- Generate image with headshot upload
- Remove uploaded headshot
- Switch between excuse tabs and maintain separate images
- Download generated image

**Form validation:**
- Verify Photo Evidence section only appears after excuses are generated
- Verify images reset when new excuses are generated

**Test count:** 7 tests
**Estimated duration:** 15-20 minutes (image generation is slow)

### 2. `tests/image-generation-errors.spec.ts` (Error Handling)

**File upload validation:**
- Reject invalid file type (txt)
- Reject oversized file (> 5MB)
- Accept valid JPG file
- Accept valid PNG file
- Allow re-uploading after validation error
- Display file size in preview

**API error handling:**
- Handle API errors gracefully
- Allow retry after API error
- Handle network timeout gracefully

**Edge cases:**
- Disable upload during image generation
- Prevent multiple simultaneous requests
- Handle missing excuse text gracefully
- Clear error message when uploading new file

**Accessibility:**
- Accessible file upload input
- Accessible remove button
- Accessible download button
- Loading state indication with aria-busy

**Test count:** 14 tests
**Estimated duration:** 10-15 minutes

### 3. `tests/image-generation-responsive.spec.ts` (Responsive Design)

**Mobile (375px):**
- Display Photo Evidence section in mobile layout
- Allow file upload on mobile
- Generate image on mobile
- Touch-friendly buttons

**Tablet (768px):**
- Display Photo Evidence in tablet layout
- Handle touch interactions on tablet
- Proper spacing on tablet

**Desktop (1920px):**
- Display Photo Evidence in desktop two-column layout
- Show hover effects on desktop
- Proper max-width constraints on desktop

**Small Mobile (320px):**
- Remain functional on small mobile screens
- Handle file upload on small screens
- Readable text on small screens

**Landscape orientation:**
- Work in landscape mode
- Scroll properly in landscape

**Cross-viewport consistency:**
- Maintain functionality across all viewports
- Consistent spacing across viewports

**Test count:** 15 tests
**Estimated duration:** 20-25 minutes

## Test Coverage

### Feature Coverage

| Feature | Coverage | Test Location |
|---------|----------|---------------|
| Excuse generation | ✅ Full | All test files (helper function) |
| Image generation without headshot | ✅ Full | `image-generation.spec.ts` |
| Image generation with headshot | ✅ Full | `image-generation.spec.ts` |
| File upload (JPG) | ✅ Full | `image-generation-errors.spec.ts` |
| File upload (PNG) | ✅ Full | `image-generation-errors.spec.ts` |
| File type validation | ✅ Full | `image-generation-errors.spec.ts` |
| File size validation | ✅ Full | `image-generation-errors.spec.ts` |
| Headshot removal | ✅ Full | `image-generation.spec.ts` |
| Image download | ✅ Full | `image-generation.spec.ts` |
| Tab switching | ✅ Full | `image-generation.spec.ts` |
| API error handling | ✅ Full | `image-generation-errors.spec.ts` |
| Mobile responsiveness | ✅ Full | `image-generation-responsive.spec.ts` |
| Tablet responsiveness | ✅ Full | `image-generation-responsive.spec.ts` |
| Desktop responsiveness | ✅ Full | `image-generation-responsive.spec.ts` |
| Accessibility | ✅ Full | `image-generation-errors.spec.ts` |

### User Flow Coverage

- ✅ Complete excuse generation flow (form → loading → results)
- ✅ Photo Evidence section appearance after excuse generation
- ✅ Headshot upload (with preview and file info)
- ✅ Headshot removal
- ✅ Image generation (with and without headshot)
- ✅ Image display and download
- ✅ Tab switching and image caching per tab
- ✅ New excuse generation (image reset)
- ✅ Error scenarios (invalid file, API errors)
- ✅ Responsive layouts (mobile, tablet, desktop)

## Troubleshooting

### Common Issues

#### 1. Tests Fail with "ECONNREFUSED" Error

**Problem:** Development server is not running.

**Solution:**
```bash
# Start dev server manually in separate terminal
npm run dev

# Then run tests with existing server
npx playwright test
```

Or ensure `webServer` configuration in `playwright.config.ts` is correct.

#### 2. Tests Fail with API Errors

**Problem:** Missing or invalid API keys.

**Solution:**
- Verify `.env.local` exists and contains valid keys
- Check that `dev-server.js` is loading environment variables correctly
- Test API endpoints manually: `curl http://localhost:3001/api/generate-excuses`

#### 3. Tests Timeout During Image Generation

**Problem:** Image generation takes longer than expected.

**Solution:**
- Increase timeout in `playwright.config.ts`:
  ```typescript
  timeout: 120000, // 120 seconds instead of 90
  ```
- Or skip slow tests during development:
  ```bash
  npx playwright test --grep-invert "should generate image"
  ```

#### 4. File Upload Tests Fail

**Problem:** Test fixture images are missing.

**Solution:**
```bash
# Re-download test images
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"
node tests/fixtures/create-large-file.js
```

#### 5. Tests Are Flaky (Pass/Fail Randomly)

**Problem:** Race conditions or timing issues.

**Solution:**
- Tests are configured to run sequentially (`fullyParallel: false`)
- Add more explicit waits if needed:
  ```typescript
  await page.waitForTimeout(1000); // Wait for animations
  ```
- Use `test.only()` to isolate flaky test and debug

#### 6. Port Already in Use (EADDRINUSE)

**Problem:** Development server is already running.

**Solution:**
```bash
# Kill existing processes
# Windows:
taskkill /F /IM node.exe

# macOS/Linux:
killall node

# Or find and kill specific port
npx kill-port 5173
npx kill-port 3001
```

#### 7. Browser Not Installed

**Problem:** Playwright browsers not installed.

**Solution:**
```bash
npx playwright install
```

### Debug Mode

For detailed debugging:

```bash
# Enable debug logging
DEBUG=pw:api npx playwright test

# Run with trace
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip
```

## Writing New Tests

### Test Structure Template

```typescript
import { test, expect, type Page } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to page, generate excuses, etc.
  });

  test('should do something specific', async ({ page }) => {
    // Arrange: Set up test data

    // Act: Perform user actions

    // Assert: Verify expected outcomes
  });
});
```

### Best Practices

1. **Use descriptive test names**: `should generate image without headshot` (not `test1`)
2. **Wait for elements properly**: Use `waitFor()`, `toBeVisible()`, not arbitrary `setTimeout()`
3. **Use semantic locators**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over CSS selectors
4. **Test user flows, not implementation**: Focus on what users see and do
5. **Keep tests independent**: Each test should work in isolation
6. **Add timeout comments**: Explain why long timeouts are needed (e.g., "Image generation can take 45s")
7. **Clean up after tests**: Remove files, reset state if needed
8. **Use test fixtures**: Reuse helper functions for common actions

### Adding a New Test

1. Choose the appropriate test file:
   - Happy path → `image-generation.spec.ts`
   - Error handling → `image-generation-errors.spec.ts`
   - Responsive design → `image-generation-responsive.spec.ts`

2. Add test to existing `test.describe()` block or create new one

3. Follow the pattern:
   ```typescript
   test('should do something new', async ({ page }) => {
     await generateExcuses(page); // Reuse helpers
     await scrollToPhotoEvidence(page);

     // Your test logic here

     await expect(somethingNew).toBeVisible();
   });
   ```

4. Run your new test:
   ```bash
   npx playwright test -g "should do something new"
   ```

5. Verify it passes consistently (run 3-5 times)

## Continuous Integration (CI)

### GitHub Actions Example

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables in CI

Add secrets in GitHub repository settings:
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

## Performance

### Test Execution Time

| Test Suite | Estimated Time | Notes |
|------------|----------------|-------|
| Main tests | 15-20 minutes | 7 tests, multiple image generations |
| Error handling | 10-15 minutes | 14 tests, includes API mocking |
| Responsive design | 20-25 minutes | 15 tests, multiple viewports |
| **Total** | **45-60 minutes** | Sequential execution recommended |

### Optimization Tips

1. **Run in parallel on CI**: Use `workers: 4` in CI environment
2. **Mock slow APIs during development**: Use `page.route()` to mock image generation
3. **Use `test.only()` during development**: Focus on specific tests
4. **Skip slow tests locally**: Use `--grep-invert` flag
5. **Cache Playwright browsers**: Speeds up CI runs

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Tests](https://playwright.dev/docs/debug)

## Support

For issues or questions:
1. Check this README first
2. Review Playwright documentation
3. Check browser console logs in test traces
4. Open an issue on GitHub with test output and screenshots

---

**Happy Testing! 🎭**
