# Quick Start - Playwright Tests

## Setup (First Time Only)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Verify test fixtures exist
ls tests/fixtures/
# Should see: test-headshot.jpg, test-headshot.png, large-file.jpg, invalid-file.txt

# 4. Ensure .env.local has API keys
# ANTHROPIC_API_KEY=...
# GEMINI_API_KEY=...
```

## Common Commands

```bash
# Run all tests (takes 45-60 minutes)
npm test

# Run in interactive UI mode (RECOMMENDED for development)
npm run test:ui

# Run and see browser in action
npm run test:headed

# Run specific test file
npx playwright test tests/image-generation.spec.ts

# Run specific test by name
npx playwright test -g "should generate image without headshot"

# Debug a failing test
npm run test:debug

# View latest test report
npm run test:report
```

## Quick Tips

- **First time?** Use `npm run test:ui` - it's interactive and shows you what's happening
- **Test failing?** Use `npm run test:headed` to see the browser
- **Need to debug?** Use `npm run test:debug` for step-by-step execution
- **Tests slow?** Run single file: `npx playwright test tests/image-generation-errors.spec.ts`
- **API errors?** Check your `.env.local` has valid API keys

## Test Files Overview

- `image-generation.spec.ts` - Main happy path tests (7 tests, ~15 min)
- `image-generation-errors.spec.ts` - Error handling (17 tests, ~10 min)
- `image-generation-responsive.spec.ts` - Responsive design (18 tests, ~20 min)

## Troubleshooting

### "ECONNREFUSED" error
Dev server not running. The tests should auto-start it, but if not:
```bash
npm run dev  # In separate terminal
```

### Tests timeout
Image generation is slow (30-45s). This is normal. If it keeps timing out:
- Check API keys in `.env.local`
- Verify API rate limits

### File not found errors
Test fixtures missing:
```bash
curl -o tests/fixtures/test-headshot.jpg "https://dummyimage.com/500x500/4a90e2/fff.jpg"
curl -o tests/fixtures/test-headshot.png "https://dummyimage.com/500x500/9b59b6/fff.png"
node tests/fixtures/create-large-file.js
```

## More Help

See `README-TESTING.md` for complete documentation.
