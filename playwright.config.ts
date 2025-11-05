import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Not My Fault E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Timeout for each test (90 seconds - allows for API latency)
  timeout: 90000,

  // Expect timeout for assertions (30 seconds)
  expect: {
    timeout: 30000,
  },

  // Run tests sequentially to avoid API rate limits
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // No retries - tests should be reliable
  retries: 0,

  // Single worker to avoid API rate limiting
  workers: 1,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:5173',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'retain-on-failure',

    // Timeout for actions like click, fill, etc
    actionTimeout: 15000,

    // Timeout for navigation
    navigationTimeout: 30000,
  },

  // Configure projects: Desktop + Mobile only
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start both Vite and API servers
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
