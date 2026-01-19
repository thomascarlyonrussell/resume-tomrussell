import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Common page navigation steps
Given('a visitor loads the page', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
});

Given('a visitor navigates to the site', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
});

Given('a new visitor arrives at the site', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
});

When('the page loads', async function (this: CustomWorld) {
  await this.page!.waitForLoadState('domcontentloaded');
});

When('the page finishes loading', async function (this: CustomWorld) {
  await this.page!.waitForLoadState('networkidle');
});

// Common visibility assertions
Then('the page loads with the Hero section visible', async function (this: CustomWorld) {
  const heroSection = this.page!.locator('[data-testid="hero-section"]');
  await expect(heroSection).toBeVisible();
});

// Scrolling steps
Given('the visitor is on any section', async function (this: CustomWorld) {
  // Already on page from previous step
  await this.page!.waitForLoadState('domcontentloaded');
});

When('they scroll down', async function (this: CustomWorld) {
  await this.page!.mouse.wheel(0, 500);
  await this.page!.waitForTimeout(500);
});

Given(
  'a visitor scrolls to the {word} section',
  async function (this: CustomWorld, sectionName: string) {
    const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-');
    await this.page!.locator(`[data-testid="${sectionId}-section"]`).scrollIntoViewIfNeeded();
  }
);

Given('the user scrolls to the visualization section', async function (this: CustomWorld) {
  await this.page!.locator('[data-testid="visualizations-section"]').scrollIntoViewIfNeeded();
});

// Mobile/responsive steps
Given('a visitor on a mobile device', async function (this: CustomWorld) {
  await this.context!.close();
  this.context = await this.browser!.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  this.page = await this.context.newPage();
  await this.page.goto(this.baseUrl);
});

Given('a mobile device with {int}px width', async function (this: CustomWorld, width: number) {
  await this.context!.close();
  this.context = await this.browser!.newContext({
    viewport: { width, height: 667 },
  });
  this.page = await this.context.newPage();
  await this.page.goto(this.baseUrl);
});

// Accessibility steps
Given('a user with a screen reader', async function (this: CustomWorld) {
  // Setup for screen reader testing - can be expanded with axe-core
  await this.page!.goto(this.baseUrl);
});

Given('a keyboard-only user', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
});

When('they tab into the visualization', async function (this: CustomWorld) {
  await this.page!.keyboard.press('Tab');
  await this.page!.keyboard.press('Tab');
  await this.page!.keyboard.press('Tab');
});
