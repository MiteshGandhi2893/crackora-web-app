import { Page, Locator } from '@playwright/test';

export class HeaderPage {
  readonly page: Page;
  readonly examsMenuTrigger: Locator;

  constructor(page: Page) {
    this.page = page;
    // ⚠️ adjust once you share Navbar.tsx — guessing text "Exams" for now
    this.examsMenuTrigger = page.locator('li[id="exams"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openExamsMenu() {
    await this.examsMenuTrigger.click();
  }
}