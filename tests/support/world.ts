import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export interface CustomWorldOptions extends IWorldOptions {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  baseUrl: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async init() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
