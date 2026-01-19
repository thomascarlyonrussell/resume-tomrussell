# E2E Testing with Cucumber.js and Playwright

This directory contains end-to-end tests for Tom Russell's portfolio website using Cucumber.js for BDD (Behavior-Driven Development) and Playwright for browser automation.

## Overview

The test suite is organized around the OpenSpec specifications:
- **Chatbot**: Tests for the AI chatbot widget and interactions
- **Visualizations**: Tests for the Fibonacci spiral and timeline visualizations
- **Site Structure**: Tests for page layout, navigation, and responsiveness
- **Data Model**: Tests for data validation and structure

## Prerequisites

Before running tests, ensure:
1. Node.js is installed
2. Dependencies are installed: `npm install`
3. The development server is running: `npm run dev`

## Directory Structure

```
tests/
├── features/                    # Gherkin feature files
│   ├── chatbot/                # Chatbot feature tests
│   ├── visualizations/         # Visualization feature tests
│   ├── site-structure/         # Site structure feature tests
│   └── data-model/             # Data model feature tests
├── step-definitions/            # TypeScript step definitions
│   ├── common-steps.ts         # Shared steps
│   ├── chatbot-steps.ts        # Chatbot-specific steps
│   ├── visualizations-steps.ts # Visualization-specific steps
│   ├── site-structure-steps.ts # Site structure-specific steps
│   └── data-model-steps.ts     # Data model-specific steps
├── support/                     # Test support files
│   ├── world.ts                # Custom world with Playwright integration
│   └── hooks.ts                # Before/After hooks
├── tsconfig.json               # TypeScript config for tests
└── README.md                   # This file
```

## Running Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Specific Test Categories
```bash
# Chatbot tests only
npm run test:e2e:chatbot

# Visualization tests only
npm run test:e2e:visualizations

# Site structure tests only
npm run test:e2e:site-structure

# Data model tests only
npm run test:e2e:data-model
```

### All Tests (Unit + E2E)
```bash
npm run test:all
```

### With Custom Configuration
```bash
# Run in headed mode (see browser)
HEADLESS=false npm run test:e2e

# Run against a different URL
BASE_URL=http://localhost:4000 npm run test:e2e
```

## Test Configuration

### Environment Variables
Create a `.env.test` file (based on `.env.test.example`) to configure:
- `BASE_URL`: The URL to test against (default: http://localhost:3000)
- `HEADLESS`: Run tests in headless mode (default: true)
- `OPENROUTER_API_KEY`: API key for chatbot tests (optional)
- `CHAT_MODEL`: Model to use for chatbot tests (optional)

### Cucumber Configuration
Test configuration is in `cucumber.js` at the project root:
- Test require paths
- Report formats (progress, HTML, JSON)
- TypeScript support via ts-node

## Writing New Tests

### 1. Create a Feature File
Add a new `.feature` file in the appropriate directory:

```gherkin
Feature: Feature Name
  As a user
  I want to do something
  So that I achieve a goal

  Scenario: Scenario name
    Given some precondition
    When some action occurs
    Then some result is observed
```

### 2. Implement Step Definitions
Add corresponding step definitions in TypeScript:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('some precondition', async function (this: CustomWorld) {
  await this.page!.goto(this.baseUrl);
});

When('some action occurs', async function (this: CustomWorld) {
  await this.page!.locator('[data-testid="button"]').click();
});

Then('some result is observed', async function (this: CustomWorld) {
  const element = this.page!.locator('[data-testid="result"]');
  await expect(element).toBeVisible();
});
```

### 3. Use Data Test IDs
Components should include `data-testid` attributes for reliable selectors:

```tsx
<div data-testid="chat-widget">
  <button data-testid="chat-button">Chat</button>
</div>
```

## Common Test Patterns

### Page Navigation
```typescript
await this.page!.goto(this.baseUrl);
await this.page!.waitForLoadState('domcontentloaded');
```

### Scrolling to Section
```typescript
await this.page!.locator('[data-testid="section-name"]').scrollIntoViewIfNeeded();
```

### Waiting for Elements
```typescript
const element = this.page!.locator('[data-testid="element"]');
await expect(element).toBeVisible({ timeout: 5000 });
```

### Mobile Testing
```typescript
await this.context!.close();
this.context = await this.browser!.newContext({
  viewport: { width: 375, height: 667 },
  isMobile: true,
  hasTouch: true,
});
this.page = await this.context.newPage();
```

## Test Reports

After running tests, reports are generated in the `reports/` directory:
- `cucumber-report.html`: Visual HTML report
- `cucumber-report.json`: JSON report for CI/CD integration

## Known Limitations

1. **Chatbot Tests**: Some chatbot tests require a valid `OPENROUTER_API_KEY` to pass fully
2. **Animation Tests**: Animation timing tests may be flaky and might need adjustment
3. **Network-Dependent Tests**: Tests that interact with external APIs may fail if the network is unavailable
4. **Data-Driven Tests**: Data model tests verify UI rendering rather than raw data validation

## Debugging Tests

### Run in Headed Mode
```bash
HEADLESS=false npm run test:e2e:chatbot
```

### Use Playwright Inspector
```bash
PWDEBUG=1 npm run test:e2e:chatbot
```

### Add Debug Statements
```typescript
await this.page!.pause(); // Pause execution
console.log(await element.textContent()); // Log element content
```

## CI/CD Integration

The test suite is designed to work in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Start dev server
  run: npm run dev &

- name: Wait for server
  run: npx wait-on http://localhost:3000

- name: Run E2E tests
  run: npm run test:e2e
  env:
    HEADLESS: true
```

## Contributing

When adding new features:
1. Write feature files based on OpenSpec specifications
2. Implement step definitions
3. Add appropriate `data-testid` attributes to components
4. Run tests to ensure they pass
5. Update this README if needed

## Troubleshooting

### Tests Fail with "Page not found"
- Ensure the dev server is running: `npm run dev`
- Check the `BASE_URL` environment variable

### Tests Timeout
- Increase timeout in step definitions: `await expect(element).toBeVisible({ timeout: 10000 })`
- Check network connectivity for API-dependent tests

### TypeScript Errors
- Ensure `ts-node` is installed: `npm install --save-dev ts-node`
- Check `tests/tsconfig.json` configuration

### Playwright Errors
- Install Playwright browsers: `npx playwright install`
- Update Playwright: `npm install --save-dev @playwright/test@latest`

## Resources

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [OpenSpec Specifications](../openspec/specs/)
