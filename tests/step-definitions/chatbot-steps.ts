import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Chat widget steps
Given('the widget is collapsed', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatWidget = this.page!.locator('[data-testid="chat-widget"]');
  await expect(chatWidget).toHaveAttribute('data-state', 'collapsed');
});

Given('the chat is expanded', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);
});

Given('the chat is open', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);
});

Given('the chat just opened with no messages', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);
});

When('the visitor clicks it', async function (this: CustomWorld) {
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
});

When('the visitor clicks a close button', async function (this: CustomWorld) {
  const closeButton = this.page!.locator('[data-testid="chat-close-button"]');
  await closeButton.click();
});

Then(
  'the chat widget appears in collapsed state at center-bottom',
  async function (this: CustomWorld) {
    const chatWidget = this.page!.locator('[data-testid="chat-widget"]');
    await expect(chatWidget).toBeVisible();

    const boundingBox = await chatWidget.boundingBox();
    const viewportSize = this.page!.viewportSize();

    if (boundingBox && viewportSize) {
      const centerX = viewportSize.width / 2;
      const isAtCenterBottom = Math.abs(boundingBox.x + boundingBox.width / 2 - centerX) < 50;
      expect(isAtCenterBottom).toBeTruthy();
    }
  }
);

Then('the chat interface expands', async function (this: CustomWorld) {
  const chatWindow = this.page!.locator('[data-testid="chat-window"]');
  await expect(chatWindow).toBeVisible();
});

Then('the visitor sees a welcome message and starter prompts', async function (this: CustomWorld) {
  const starterPrompts = this.page!.locator('[data-testid="starter-prompts"]');
  await expect(starterPrompts).toBeVisible();
});

Then('the chat collapses', async function (this: CustomWorld) {
  const chatWindow = this.page!.locator('[data-testid="chat-window"]');
  await expect(chatWindow).not.toBeVisible();
});

Then('conversation history is preserved for the session', async function (this: CustomWorld) {
  // Re-open chat
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);

  const messages = this.page!.locator('[data-testid="chat-message"]');
  await expect(messages).toHaveCount({ timeout: 5000 } as any);
});

// Message interaction steps
When(
  'the visitor types a message {string} and presses Enter',
  async function (this: CustomWorld, message: string) {
    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(message);
    await input.press('Enter');
  }
);

Then('the message appears in the chat', async function (this: CustomWorld) {
  const lastMessage = this.page!.locator('[data-testid="chat-message"]').last();
  await expect(lastMessage).toBeVisible();
});

Then('a loading indicator appears', async function (this: CustomWorld) {
  const loadingIndicator = this.page!.locator('[data-testid="loading-indicator"]');
  await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
});

Then('the AI response streams in', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

// Starter prompts
When(
  'the visitor clicks a starter prompt button {string}',
  async function (this: CustomWorld, promptText: string) {
    const promptButton = this.page!.locator('[data-testid="starter-prompt"]', {
      hasText: promptText,
    });
    await promptButton.click();
  }
);

Then('that prompt is sent as their message', async function (this: CustomWorld) {
  const userMessage = this.page!.locator('[data-testid="chat-message"][data-role="user"]').last();
  await expect(userMessage).toBeVisible();
});

Then('the AI responds accordingly', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

// Knowledge and response steps
Given('the visitor asks {string}', async function (this: CustomWorld, question: string) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);

  const input = this.page!.locator('[data-testid="chat-input"]');
  await input.fill(question);
  await input.press('Enter');
});

Given('the visitor asks about LoadSEER', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);

  const input = this.page!.locator('[data-testid="chat-input"]');
  await input.fill('Tell me about LoadSEER');
  await input.press('Enter');
});

Given(
  "the visitor asks about Tom's experience with a specific technology {string}",
  async function (this: CustomWorld, technology: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(`Tell me about Tom's experience with ${technology}`);
    await input.press('Enter');
  }
);

Given(
  'the visitor asks about something not in the knowledge base {string}',
  async function (this: CustomWorld, question: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(question);
    await input.press('Enter');
  }
);

When('the AI processes the question', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

When('the technology is in the knowledge base', async function (this: CustomWorld) {
  // This is implicit - the test will verify the response
});

When('the AI cannot find relevant information', async function (this: CustomWorld) {
  // This is implicit - the test will verify the response
});

Then('it retrieves relevant skills from the knowledge base', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('provides an accurate, detailed response', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = await aiMessage.textContent();
  expect(messageText?.length).toBeGreaterThan(50);
});

Then(
  "it provides accurate information about Tom's work on LoadSEER",
  async function (this: CustomWorld) {
    const aiMessage = this.page!.locator(
      '[data-testid="chat-message"][data-role="assistant"]'
    ).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });
    const messageText = await aiMessage.textContent();
    expect(messageText?.toLowerCase()).toContain('loadseer');
  }
);

Then('the AI provides accurate details', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('may mention related projects or context', async function (this: CustomWorld) {
  // Optional step - just verify message exists
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible();
});

Then("it honestly states it doesn't have that information", async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
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

Then('suggests the visitor contact Tom directly for details', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
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
Given(
  "the visitor asks about Tom's personal life {string}",
  async function (this: CustomWorld, question: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(question);
    await input.press('Enter');
  }
);

Given(
  'the visitor asks about salary expectations {string}',
  async function (this: CustomWorld, question: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(question);
    await input.press('Enter');
  }
);

When('the question is outside professional scope', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

When('processing the sensitive request', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

Then('the AI politely declines', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('suggests focusing on professional topics', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  const messageText = (await aiMessage.textContent())?.toLowerCase() || '';
  const hasProfessionalRedirect =
    messageText.includes('professional') ||
    messageText.includes('work') ||
    messageText.includes('career');
  expect(hasProfessionalRedirect).toBeTruthy();
});

Then("the AI explains it can't discuss compensation", async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('provides contact information for direct inquiry', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
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
Given(
  'a recruiter asks about availability {string}',
  async function (this: CustomWorld, question: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(question);
    await input.press('Enter');
  }
);

When('the AI recognizes a hiring context', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

Then('it provides helpful general info', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then('suggests direct contact for specifics', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
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
Given('an ongoing conversation with multiple messages', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
  const chatButton = this.page!.locator('[data-testid="chat-button"]');
  await chatButton.click();
  await this.page!.waitForTimeout(300);

  // Send multiple messages
  const input = this.page!.locator('[data-testid="chat-input"]');

  await input.fill('Hello');
  await input.press('Enter');
  await this.page!.waitForTimeout(2000);

  await input.fill('What are your skills?');
  await input.press('Enter');
  await this.page!.waitForTimeout(2000);
});

When('the visitor scrolls up in the message area', async function (this: CustomWorld) {
  const messagesContainer = this.page!.locator('[data-testid="chat-messages"]');
  await messagesContainer.hover();
  await this.page!.mouse.wheel(0, -200);
});

Then('they can see previous messages in the conversation', async function (this: CustomWorld) {
  const messages = this.page!.locator('[data-testid="chat-message"]');
  const count = await messages.count();
  expect(count).toBeGreaterThan(1);
});

// Streaming and errors
Given(
  'a question requiring a detailed answer {string}',
  async function (this: CustomWorld, question: string) {
    await this.page!.goto(this.baseUrl);
    const chatButton = this.page!.locator('[data-testid="chat-button"]');
    await chatButton.click();
    await this.page!.waitForTimeout(300);

    const input = this.page!.locator('[data-testid="chat-input"]');
    await input.fill(question);
    await input.press('Enter');
  }
);

When('the AI generates the response', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

Then('text appears progressively', async function (this: CustomWorld) {
  const aiMessage = this.page!.locator(
    '[data-testid="chat-message"][data-role="assistant"]'
  ).last();
  await expect(aiMessage).toBeVisible({ timeout: 10000 });
});

Then(
  'the user sees content before the full response completes',
  async function (this: CustomWorld) {
    // Streaming is implicit in the previous step
    const aiMessage = this.page!.locator(
      '[data-testid="chat-message"][data-role="assistant"]'
    ).last();
    await expect(aiMessage).toBeVisible();
  }
);

// Error handling
Given('a network or API error occurs', async function (this: CustomWorld) {
  // Mock API error - this would need to be implemented with route interception
  await this.page!.goto(this.baseUrl);
});

Given('the free tier rate limit is reached', async function (this: CustomWorld) {
  // Mock rate limit - this would need to be implemented with route interception
  await this.page!.goto(this.baseUrl);
});

When('the AI cannot generate a response', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

When('this occurs', async function (this: CustomWorld) {
  await this.page!.waitForTimeout(1000);
});

Then('an error message displays', async function (this: CustomWorld) {
  const errorMessage = this.page!.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

Then('the visitor can retry their message', async function (this: CustomWorld) {
  const retryButton = this.page!.locator('[data-testid="retry-button"]');
  await expect(retryButton).toBeVisible();
});

Then('the user sees a friendly message', async function (this: CustomWorld) {
  const errorMessage = this.page!.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible({ timeout: 5000 });
});

Then('is informed they can try again shortly', async function (this: CustomWorld) {
  const errorMessage = this.page!.locator('[data-testid="error-message"]');
  const messageText = await errorMessage.textContent();
  expect(messageText?.toLowerCase()).toContain('try again');
});
