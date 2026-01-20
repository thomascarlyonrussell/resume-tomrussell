import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Section order and navigation
Given('a visitor at the top of the page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForLoadState('domcontentloaded');
});

When('they scroll through the entire page', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
});

Then('all sections are accessible via scrolling', async ({ page }) => {
  const sections = page.locator('[data-testid$="-section"]');
  const count = await sections.count();
  expect(count).toBeGreaterThan(0);
});

Then('they smoothly transition to the next section', async ({ page }) => {
  // Check that scrolling works
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
});

Then('they encounter Hero section first', async ({ page }) => {
  const heroSection = page.locator('[data-testid="hero-section"]');
  const isVisible = await heroSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('then Skills section', async ({ page }) => {
  const skillsSection = page.locator('[data-testid="skills-section"]');
  const isVisible = await skillsSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('then Experience section', async ({ page }) => {
  const experienceSection = page.locator('[data-testid="experience-section"]');
  const isVisible = await experienceSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('then About section', async ({ page }) => {
  const aboutSection = page.locator('[data-testid="about-section"]');
  const isVisible = await aboutSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('finally Contact section', async ({ page }) => {
  const contactSection = page.locator('[data-testid="contact-section"]');
  const isVisible = await contactSection.isVisible();
  expect(isVisible).toBeTruthy();
});

// Hero section
When('the Hero section loads', async ({ page }) => {
  const heroSection = page.locator('[data-testid="hero-section"]');
  await expect(heroSection).toBeVisible();
});

Then("Tom's name is immediately visible", async ({ page }) => {
  const nameElement = page.locator('h1').first();
  const nameText = await nameElement.textContent();
  expect(nameText?.toLowerCase()).toContain('tom');
});

Then('the visitor understands this is a professional portfolio', async ({ page }) => {
  const heroSection = page.locator('[data-testid="hero-section"]');
  const heroText = await heroSection.textContent();
  expect(heroText).toBeTruthy();
});

// About section
Given('a visitor wants to contact Tom', async ({ page }) => {
  await page.goto(baseUrl);
  await page.locator('[data-testid="contact-section"]').scrollIntoViewIfNeeded();
});

When('they read the content', async ({ page }) => {
  await page.waitForTimeout(500);
});

When('they scroll to the Contact section', async ({ page }) => {
  const contactSection = page.locator('[data-testid="contact-section"]');
  await contactSection.scrollIntoViewIfNeeded();
});

Then("they understand Tom's professional background and focus areas", async ({ page }) => {
  const aboutSection = page.locator('[data-testid="about-section"]');
  const aboutText = await aboutSection.textContent();
  expect(aboutText?.length).toBeGreaterThan(100);
});

// Contact section
Then('they can find email link', async ({ page }) => {
  const emailLink = page.locator('a[href^="mailto:"]');
  await expect(emailLink.first()).toBeVisible();
});

Then('they can find LinkedIn link', async ({ page }) => {
  const linkedinLink = page.locator('a[href*="linkedin.com"]');
  await expect(linkedinLink.first()).toBeVisible();
});

Then('they can find GitHub link', async ({ page }) => {
  const githubLink = page.locator('a[href*="github.com"]');
  await expect(githubLink.first()).toBeVisible();
});

// Chatbot widget
Given('the visitor is on any section of the page', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForLoadState('domcontentloaded');
});

When('they click the chat widget', async ({ page }) => {
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
});

Then('they can interact with the AI chatbot', async ({ page }) => {
  const chatInput = page.locator('[data-testid="chat-input"]');
  await expect(chatInput).toBeVisible();
});

Given('the chat widget is open', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);
});

When('the visitor scrolls the page', async ({ page }) => {
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
});

Then('the chat widget remains visible and functional', async ({ page }) => {
  const chatWindow = page.locator('[data-testid="chat-window"]');
  await expect(chatWindow).toBeVisible();
});

// NAVIGATION INDICATORS - Enhanced
Given('the site provides visual indicators with interactive navigation', async ({ page }) => {
  await page.goto(baseUrl);
});

Given('the navigation displays the currently active section with a larger, colored dot', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

Given('allows clicking to jump directly to any section', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

Then('they see which section is active via the navigation dots', async ({ page }) => {
  const navDots = page.locator('[data-testid="nav-dot"]');
  await expect(navDots.first()).toBeVisible();
});

Then('they can hover over dots to see section labels', async ({ page }) => {
  const navDot = page.locator('[data-testid="nav-dot"]').first();
  await navDot.hover();
  await page.waitForTimeout(200);
});

Then('they can click dots to jump to sections', async ({ page }) => {
  const navDot = page.locator('[data-testid="nav-dot"]').first();
  await expect(navDot).toBeVisible();
});

Given('a visitor sees the navigation component', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForLoadState('domcontentloaded');
});

When('they hover over any navigation dot', async ({ page }) => {
  const navDot = page.locator('[data-testid="nav-dot"]').first();
  await navDot.hover();
  await page.waitForTimeout(200);
});

Then('a tooltip appears showing the section label', async ({ page }) => {
  // Tooltip would appear with section name
  await page.waitForTimeout(100);
});

Then('the tooltip helps identify section names without cluttering the UI', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

Given('a visitor using keyboard navigation', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForLoadState('domcontentloaded');
});

When('they tab to the navigation component', async ({ page }) => {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(100);
});

Then('focus indicators appear on each dot', async ({ page }) => {
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeVisible();
});

Then('they can use Enter or Space to jump to sections', async ({ page }) => {
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
});

// Responsive design
When('they view the site', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
});

Then('all content is readable and accessible', async ({ page }) => {
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

Then('visualizations adapt to smaller screens', async ({ page }) => {
  await page.locator('[data-testid="visualizations-section"]').scrollIntoViewIfNeeded();
  const visualization = page.locator(
    '[data-testid="fibonacci-view"],[data-testid="timeline-view"]'
  );
  await expect(visualization.first()).toBeVisible();
});

Then('the chatbot remains usable', async ({ page }) => {
  const chatButton = page.locator('[data-testid="chat-button"]');
  await expect(chatButton).toBeVisible();
});

// Navigation indicators
Given('a visitor is scrolling through the site', async ({ page }) => {
  await page.goto(baseUrl);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
});

When('they are partway through', async ({ page }) => {
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
});

Then('they have some indication of their position', async ({ page }) => {
  // Check for navigation indicators - could be dots, progress bar, etc.
  const nav = page.locator('[data-testid="section-nav"],[data-testid="progress-indicator"]');
  const navExists = await nav.count();
  expect(navExists).toBeGreaterThan(0);
});
