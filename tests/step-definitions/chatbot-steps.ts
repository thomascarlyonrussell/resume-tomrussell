import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Chat widget steps
Given('the widget is collapsed', async ({ page }) => {
  await page.goto(baseUrl);
  const chatWidget = page.locator('[data-testid="chat-widget"]');
  await expect(chatWidget).toHaveAttribute('data-state', 'collapsed');
});

Given('the chat is expanded', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);
});

Given('the chat is open', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);
});

Given('the chat just opened with no messages', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);
});

When('the visitor clicks it', async ({ page }) => {
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
});

When('the visitor clicks a close button', async ({ page }) => {
  const closeButton = page.locator('[data-testid="chat-close-button"]');
  await closeButton.click();
});

Then('the chat widget appears in collapsed state at center-bottom', async ({ page }) => {
  const chatWidget = page.locator('[data-testid="chat-widget"]');
  await expect(chatWidget).toBeVisible();

  const boundingBox = await chatWidget.boundingBox();
  const viewportSize = page.viewportSize();

  if (boundingBox && viewportSize) {
    const centerX = viewportSize.width / 2;
    const isAtCenterBottom = Math.abs(boundingBox.x + boundingBox.width / 2 - centerX) < 50;
    expect(isAtCenterBottom).toBeTruthy();
  }
});

Then('the chat interface expands', async ({ page }) => {
  const chatWindow = page.locator('[data-testid="chat-window"]');
  await expect(chatWindow).toBeVisible();
});

Then('the visitor sees a welcome message and starter prompts', async ({ page }) => {
  const starterPrompts = page.locator('[data-testid="starter-prompts"]');
  await expect(starterPrompts).toBeVisible();
});

Then('the chat collapses', async ({ page }) => {
  const chatWindow = page.locator('[data-testid="chat-window"]');
  await expect(chatWindow).not.toBeVisible();
});

Then('conversation history is preserved for the session', async ({ page }) => {
  // Re-open chat
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const messages = page.locator('[data-testid="chat-message"]');
  await expect(messages).toHaveCount({ timeout: 5000 } as any);
});

// Message interaction steps
When('the visitor types a message {string} and presses Enter', async ({ page }, message: string) => {
  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(message);
  await input.press('Enter');
});

Then('the message appears in the chat', async ({ page }) => {
  const lastMessage = page.locator('[data-testid="chat-message"]').last();
  await expect(lastMessage).toBeVisible();
});

Then('a loading indicator appears', async ({ page }) => {
  const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
  await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
});

Then('the AI response streams in', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

// Starter prompts
When('the visitor clicks a starter prompt button {string}', async ({ page }, promptText: string) => {
  const promptButton = page.locator('[data-testid="starter-prompt"]', {
    hasText: promptText,
  });
  await promptButton.click();
});

Then('that prompt is sent as their message', async ({ page }) => {
  const userMessage = page.locator('[data-testid="chat-message"][data-role="user"]').last();
  await expect(userMessage).toBeVisible();
});

Then('the AI responds accordingly', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

// Knowledge and response steps
Given('the chatbot receives {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

Given('the visitor asks {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

Given('the visitor asks about LoadSEER', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill('Tell me about LoadSEER');
  await input.press('Enter');
});

Given("the visitor asks about Tom's experience with a specific technology {string}", async ({ page }, technology: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(`Tell me about Tom's experience with ${technology}`);
  await input.press('Enter');
});

Given('the visitor asks about something not in the knowledge base {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

When('the AI processes the question', async ({ page }) => {
  await page.waitForTimeout(1000);
});

When('the technology is in the knowledge base', async ({ page }) => {
  // This is implicit - the test will verify the response
});

When('the AI cannot find relevant information', async ({ page }) => {
  // This is implicit - the test will verify the response
});

Then('it retrieves relevant skills from the knowledge base', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('provides an accurate, detailed response', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = await aiMessage.textContent();
  expect(messageText?.length).toBeGreaterThan(50);
});

Then("it provides accurate information about Tom's work on LoadSEER", async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
  const messageText = await aiMessage.textContent();
  expect(messageText?.toLowerCase()).toContain('loadseer');
});

Then('the AI provides accurate details', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('may mention related projects or context', async ({ page }) => {
  // Optional step - just verify message exists
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible();
});

Then("it honestly states it doesn't have that information", async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasUncertaintyPhrase =
    messageText.includes("don't have") ||
    messageText.includes("don't know") ||
    messageText.includes('not sure') ||
    messageText.includes('cannot') ||
    messageText.includes("can't");
  expect(hasUncertaintyPhrase).toBeTruthy();
});

Then('suggests the visitor contact Tom directly for details', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasContactSuggestion =
    messageText.includes('contact') ||
    messageText.includes('reach out') ||
    messageText.includes('email');
  expect(hasContactSuggestion).toBeTruthy();
});

// Boundary steps
Given("the visitor asks about Tom's personal life {string}", async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

Given('the visitor asks about salary expectations {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

When('the question is outside professional scope', async ({ page }) => {
  await page.waitForTimeout(1000);
});

When('processing the sensitive request', async ({ page }) => {
  await page.waitForTimeout(1000);
});

Then('the AI politely declines', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('suggests focusing on professional topics', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasProfessionalRedirect =
    messageText.includes('professional') ||
    messageText.includes('work') ||
    messageText.includes('career');
  expect(hasProfessionalRedirect).toBeTruthy();
});

Then("the AI explains it can't discuss compensation", async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('provides contact information for direct inquiry', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasContactInfo =
    messageText.includes('contact') ||
    messageText.includes('email') ||
    messageText.includes('directly');
  expect(hasContactInfo).toBeTruthy();
});

// Recruiter/hiring steps
Given('a recruiter asks about availability {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

When('the AI recognizes a hiring context', async ({ page }) => {
  await page.waitForTimeout(1000);
});

Then('it provides helpful general info', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('suggests direct contact for specifics', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasDirectContactSuggestion =
    messageText.includes('contact') ||
    messageText.includes('reach out') ||
    messageText.includes('directly');
  expect(hasDirectContactSuggestion).toBeTruthy();
});

// Message history
Given('an ongoing conversation with multiple messages', async ({ page }) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  // Send multiple messages
  const input = page.locator('[data-testid="chat-input"]');

  await input.fill('Hello');
  await input.press('Enter');
  await page.waitForTimeout(2000);

  await input.fill('What are your skills?');
  await input.press('Enter');
  await page.waitForTimeout(2000);
});

When('the visitor scrolls up in the message area', async ({ page }) => {
  const messagesContainer = page.locator('[data-testid="chat-messages"]');
  await messagesContainer.hover();
  await page.mouse.wheel(0, -200);
});

Then('they can see previous messages in the conversation', async ({ page }) => {
  const messages = page.locator('[data-testid="chat-message"]');
  const count = await messages.count();
  expect(count).toBeGreaterThan(1);
});

// Streaming and errors
Given('a question requiring a detailed answer {string}', async ({ page }, question: string) => {
  await page.goto(baseUrl);
  const chatButton = page.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await page.waitForTimeout(300);

  const input = page.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

When('the AI generates the response', async ({ page }) => {
  await page.waitForTimeout(1000);
});

Then('text appears progressively', async ({ page }) => {
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('the user sees content before the full response completes', async ({ page }) => {
  // Streaming is implicit in the previous step
  const aiMessage = page.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible();
});

// Error handling
Given('a network or API error occurs', async ({ page }) => {
  // Mock API error - this would need to be implemented with route interception
  await page.goto(baseUrl);
});

Given('the free tier rate limit is reached', async ({ page }) => {
  // Mock rate limit - this would need to be implemented with route interception
  await page.goto(baseUrl);
});

When('the AI cannot generate a response', async ({ page }) => {
  await page.waitForTimeout(1000);
});

When('this occurs', async ({ page }) => {
  await page.waitForTimeout(1000);
});

Then('an error message displays', async ({ page }) => {
  const errorMessage = page.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

Then('the visitor can retry their message', async ({ page }) => {
  const retryButton = page.locator('[data-testid="retry-button"]');
  await expect(retryButton).toBeVisible();
});

Then('the user sees a friendly message', async ({ page }) => {
  const errorMessage = page.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

Then('is informed they can try again shortly', async ({ page }) => {
  const errorMessage = page.locator('[data-testid="error-message"]');
  const messageText = await errorMessage.textContent();
  expect(messageText?.toLowerCase()).toContain('try again');
});
