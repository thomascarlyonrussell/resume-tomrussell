import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Common page navigation steps
Given('a visitor loads the page', async ({ page }) => {
  await page.goto(baseUrl);
});

Given('a visitor navigates to the site', async ({ page }) => {
  await page.goto(baseUrl);
});

Given('a new visitor arrives at the site', async ({ page }) => {
  await page.goto(baseUrl);
});

When('the page loads', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

When('the page finishes loading', async ({ page }) => {
  await page.waitForLoadState('networkidle');
});

// Common visibility assertions
Then('the page loads with the Hero section visible', async ({ page }) => {
  const heroSection = page.locator('[data-testid="hero-section"]');
  await expect(heroSection).toBeVisible();
});

// Scrolling steps
Given('the visitor is on any section', async ({ page }) => {
  // Already on page from previous step
  await page.waitForLoadState('domcontentloaded');
});

When('they scroll down', async ({ page }) => {
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
});

Given('a visitor scrolls to the {word} section', async ({ page }, sectionName: string) => {
  const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-');
  await page.locator(`[data-testid="${sectionId}-section"]`).scrollIntoViewIfNeeded();
});

Given('the user scrolls to the visualization section', async ({ page }) => {
  await page.locator('[data-testid="visualizations-section"]').scrollIntoViewIfNeeded();
});

// Mobile/responsive steps
Given('a visitor on a mobile device', async ({ page, context }) => {
  await context.close();
  const browser = page.context().browser()!;
  const newContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const newPage = await newContext.newPage();
  await newPage.goto(baseUrl);
});

Given('a mobile device with {int}px width', async ({ page, context }, width: number) => {
  await context.close();
  const browser = page.context().browser()!;
  const newContext = await browser.newContext({
    viewport: { width, height: 667 },
  });
  const newPage = await newContext.newPage();
  await newPage.goto(baseUrl);
});

// Accessibility steps
Given('a user with a screen reader', async ({ page }) => {
  // Setup for screen reader testing - can be expanded with axe-core
  await page.goto(baseUrl);
});

Given('a keyboard-only user', async ({ page }) => {
  await page.goto(baseUrl);
});

When('they tab into the visualization', async ({ page }) => {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
});
