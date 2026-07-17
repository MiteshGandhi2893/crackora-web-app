import { expect, Page } from "@playwright/test";

export class ExamInfoPageTest {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async isExamDetailVisible(titleStr: string) {
    const examDetail = await this.page.locator(titleStr);
    await expect(examDetail).toBeVisible();
  }
}
// `[data-examcard-title="${title}"]`
