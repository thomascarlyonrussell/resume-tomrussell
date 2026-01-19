import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Section order and navigation
Given('a visitor at the top of the page', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  await this.page!.waitForLoadState('domcontentloaded');
});

When('they scroll through the entire page', async function (this: CustomWorld) {
  await this.page!.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await this.page!.waitForTimeout(1000);
});

Then('all sections are accessible via scrolling', async function (this: CustomWorld) {
  const sections = this.page!.locator('[data-testid$="-section"]');
  const count = await sections.count();
  expect(count).toBeGreaterThan(0);
});

Then('they smoothly transition to the next section', async function (this: CustomWorld) {
  // Check that scrolling works
  const scrollY = await this.page!.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
});

Then('they encounter Hero section first', async function (this: CustomWorld) {
  const heroSection = this.page!.locator('[data-testid="hero-section"]');
  await expect(heroSection).toBeInViewport();
});

Then('then About section', async function (this: CustomWorld) {
  const aboutSection = this.page!.locator('[data-testid="about-section"]');
  const isVisible = await aboutSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('then Visualizations section', async function (this: CustomWorld) {
  const visualizationsSection = this.page!.locator('[data-testid="visualizations-section"]');
  const isVisible = await visualizationsSection.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('finally Contact section', async function (this: CustomWorld) {
  const contactSection = this.page!.locator('[data-testid="contact-section"]');
  const isVisible = await contactSection.isVisible();
  expect(isVisible).toBeTruthy();
});

// Hero section
When('the Hero section loads', async function (this: CustomWorld) {
  const heroSection = this.page!.locator('[data-testid="hero-section"]');
  await expect(heroSection).toBeVisible();
});

Then('Tom\'s name is immediately visible', async function (this: CustomWorld) {
  const nameElement = this.page!.locator('h1').first();
  const nameText = await nameElement.textContent();
  expect(nameText?.toLowerCase()).toContain('tom');
});

Then('the visitor understands this is a professional portfolio', async function (this: CustomWorld) {
  const heroSection = this.page!.locator('[data-testid="hero-section"]');
  const heroText = await heroSection.textContent();
  expect(heroText).toBeTruthy();
});

// About section
Given('a visitor wants to contact Tom', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  await this.page!.locator('[data-testid="contact-section"]').scrollIntoViewIfNeeded();
});

When('they read the content', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(500);
});

When('they scroll to the Contact section', async function (this: CustomWorld) {
  const contactSection = this.page!.locator('[data-testid="contact-section"]');
  await contactSection.scrollIntoViewIfNeeded();
});

Then('they understand Tom\'s professional background and focus areas', async function (this: CustomWorld) {
  const aboutSection = this.page!.locator('[data-testid="about-section"]');
  const aboutText = await aboutSection.textContent();
  expect(aboutText?.length).toBeGreaterThan(100);
});

// Contact section
Then('they can find email link', async function (this: CustomWorld) {
  const emailLink = this.page!.locator('a[href^="mailto:"]');
  await expect(emailLink.first()).toBeVisible();
});

Then('they can find LinkedIn link', async function (this: CustomWorld) {
  const linkedinLink = this.page!.locator('a[href*="linkedin.com"]');
  await expect(linkedinLink.first()).toBeVisible();
});

Then('they can find GitHub link', async function (this: CustomWorld) {
  const githubLink = this.page!.locator('a[href*="github.com"]');
  await expect(githubLink.first()).toBeVisible();
});

// Chatbot widget
Given('the visitor is on any section of the page', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  await this.page!.waitForLoadState('domcontentloaded');
});

When('they click the chat widget', async function (this: CustomWorld) {
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
});

Then('they can interact with the AI chatbot', async function (this: CustomWorld) {
  const chatInput = this.page!.locator('[data-testid="chat-input"]');
  await expect(chatInput).toBeVisible();
});

Given('the chat widget is open', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);
});

When('the visitor scrolls the page', async function (this: CustomWorld) {
  await this.page!.mouse.wheel(0, 500);
  await this.page!.waitForTimeout(500);
});

Then('the chat widget remains visible and functional', async function (this: CustomWorld) {
  const chatWindow = this.page!.locator('[data-testid="chat-window"]');
  await expect(chatWindow).toBeVisible();
});

// Responsive design
When('they view the site', async function (this: CustomWorld) {
  await this.page!.waitForLoadState('domcontentloaded');
});

Then('all content is readable and accessible', async function (this: CustomWorld) {
  const body = this.page!.locator('body');
  await expect(body).toBeVisible();
});

Then('visualizations adapt to smaller screens', async function (this: CustomWorld) {
  await this.page!.locator('[data-testid="visualizations-section"]').scrollIntoViewIfNeeded();
  const visualization = this.page!.locator('[data-testid="fibonacci-view"],[data-testid="timeline-view"]');
  await expect(visualization.first()).toBeVisible();
});

Then('the chatbot remains usable', async function (this: CustomWorld) {
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await expect(chatButton).toBeVisible();
});

// Navigation indicators
Given('a visitor is scrolling through the site', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  await this.page!.mouse.wheel(0, 500);
  await this.page!.waitForTimeout(500);
});

When('they are partway through', async function (this: CustomWorld) {
  const scrollY = await this.page!.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
});

Then('they have some indication of their position', async function (this: CustomWorld) {
  // Check for navigation indicators - could be dots, progress bar, etc.
  const nav = this.page!.locator('[data-testid="section-nav"],[data-testid="progress-indicator"]');
  const navExists = await nav.count();
  expect(navExists).toBeGreaterThan(0);
});
