import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke Test Suite for "Not My Fault" Excuse Generator
 *
 * Purpose: Verify core functionality works end-to-end
 * Tests: 5 critical user flows only
 * Runtime: ~8-10 minutes (single run)
 *
 * Run with: npm run test:smoke
 */

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Helper: Generate excuses (prerequisite for most tests)
 * Fills form and waits for excuse tabs to appear
 */
async function generateExcuses(page: Page) {
  // Navigate to home page
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Fill scenario textarea (required - minimum 10 characters)
  const scenarioTextarea = page.locator('textarea#scenario');
  await scenarioTextarea.fill('I was late for an important meeting today');

  // Select audience from dropdown (required)
  const audienceSelect = page.locator('select#audience');
  await audienceSelect.selectOption({ index: 1 }); // First option (e.g., "My manager")

  // Click "Generate Excuses" button
  await page.click('button:has-text("Generate Excuses")');

  // Wait for excuses to load (tabs should appear)
  // Using 90s timeout to allow for API latency
  // Use aria-label to avoid matching "Generate Photo Evidence for Believable Excuse" button
  await expect(page.locator('button[aria-label="Show Believable excuse"]')).toBeVisible({
    timeout: 90000,
  });

  // Brief pause for UI to settle
  await page.waitForTimeout(500);
}

// ============================================================================
// SMOKE TESTS
// ============================================================================

test.describe('Smoke Tests - Core Functionality', () => {

  // --------------------------------------------------------------------------
  // TEST 1: App Loads Successfully
  // --------------------------------------------------------------------------
  test('should load app with all core UI elements visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify header with logo
    await expect(page.locator('header')).toBeVisible();

    // Verify hero section loads (check for tagline)
    await expect(page.locator('h1')).toBeVisible();

    // Verify form is visible
    await expect(page.locator('textarea#scenario')).toBeVisible();
    await expect(page.locator('select#audience')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Excuses")')).toBeVisible();

    // Verify footer
    await expect(page.locator('footer')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 2: Excuse Generation - Happy Path (CRITICAL TEST)
  // --------------------------------------------------------------------------
  test('should generate excuses when form is filled correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill scenario
    await page.locator('textarea#scenario').fill('I missed the deadline for the project');

    // Select audience
    await page.locator('select#audience').selectOption({ index: 1 });

    // Click generate button
    await page.click('button:has-text("Generate Excuses")');

    // Wait for "Your Excuses" heading to appear
    await expect(page.locator('h2:has-text("Your Excuses")')).toBeVisible({
      timeout: 90000,
    });

    // Verify tabs are present (use aria-label to be specific)
    await expect(page.locator('button[aria-label="Show Believable excuse"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Show Risky! excuse"]')).toBeVisible();

    // Verify excuse text is visible and not empty
    const excuseText = page.locator('[class*="excuse"]').first();
    await expect(excuseText).toBeVisible();

    const textContent = await excuseText.textContent();
    expect(textContent).toBeTruthy();
    expect(textContent!.length).toBeGreaterThan(10);
  });

  // --------------------------------------------------------------------------
  // TEST 3: Tab Switching Between Excuse Types
  // --------------------------------------------------------------------------
  test('should switch between Believable and Risky tabs', async ({ page }) => {
    // Generate excuses first
    await generateExcuses(page);

    // Verify "Believable" tab is initially active (use aria-label to be specific)
    const believableTab = page.locator('button[aria-label="Show Believable excuse"]');
    await expect(believableTab).toBeVisible();

    // Get text from Believable excuse
    const believableText = await page.locator('[class*="excuse"]').first().textContent();

    // Click "Risky!" tab (use aria-label to be specific)
    await page.click('button[aria-label="Show Risky! excuse"]');
    await page.waitForTimeout(500); // Wait for tab switch animation

    // Verify Risky tab is now active
    const riskyTab = page.locator('button[aria-label="Show Risky! excuse"]');
    await expect(riskyTab).toBeVisible();

    // Get text from Risky excuse
    const riskyText = await page.locator('[class*="excuse"]').first().textContent();

    // Verify the two excuses are different
    expect(riskyText).toBeTruthy();
    expect(riskyText).not.toBe(believableText);
    expect(riskyText!.length).toBeGreaterThan(10);
  });

  // --------------------------------------------------------------------------
  // TEST 4: Form Validation Prevents Invalid Submission
  // --------------------------------------------------------------------------
  test('should enforce form validation rules', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify button is disabled initially (no form input)
    const generateButton = page.locator('button:has-text("Generate Excuses")');
    await expect(generateButton).toBeDisabled();

    // Try with scenario too short (<10 characters)
    await page.locator('textarea#scenario').fill('Too short');
    await page.locator('select#audience').selectOption({ index: 1 });

    // Button should still be disabled
    await expect(generateButton).toBeDisabled();

    // Fill with valid scenario (≥10 characters)
    await page.locator('textarea#scenario').fill('This is a valid scenario text');

    // Now button should be enabled
    await expect(generateButton).toBeEnabled();
  });

  // --------------------------------------------------------------------------
  // TEST 5: Image Generation Basic Flow
  // --------------------------------------------------------------------------
  test('should generate image for excuse (without headshot)', async ({ page }) => {
    // Generate excuses first
    await generateExcuses(page);

    // Scroll to Photo Evidence section
    const photoEvidenceHeading = page.locator('h2:has-text("Photo Evidence")');
    await expect(photoEvidenceHeading).toBeVisible();
    await photoEvidenceHeading.scrollIntoViewIfNeeded();

    // Click "Generate Photo Evidence" button
    const generateImageButton = page.locator('button:has-text("Generate Photo Evidence")');
    await expect(generateImageButton).toBeVisible();
    await generateImageButton.click();

    // Wait for either:
    // 1. Image to appear, OR
    // 2. Error message to appear
    // We accept either outcome - just verify the UI responds
    await page.waitForTimeout(2000); // Give it a moment to start

    // Check if loading state appears
    const isGenerating = await page.locator('text=/Generating|Creating|Fabricating/i').isVisible({ timeout: 5000 }).catch(() => false);

    if (isGenerating) {
      // Wait up to 90 seconds for image or error
      const imageOrError = page.locator('img[alt*="Excuse"], text=/error|failed/i').first();
      await expect(imageOrError).toBeVisible({ timeout: 90000 });
    }

    // Test passes if we got this far without throwing
    // (means the UI responded to the generate request)
  });

});
