import { expect, Page } from "@playwright/test";

export class ExamMegaMenuPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickEntrances(title: string) {
    const entrance = await this.page.locator(`span[title="${title}"]`);
    if (entrance) {
      await entrance.click();
    }
  }

  async clickExamCard(titleStr: string) {
    const examCard = await this.page.locator(titleStr);
    if (examCard) {
      await examCard.click();
    }
  }

  async isVisible(titleStr: string) {
    const examDetail = await this.page.locator(titleStr);
    await expect(examDetail).toBeVisible();
  }

  // async isExamCardVisible(title: string) {
  //   const examCardTitle = await this.page.locator(
  //     `[data-examcard-title="${title}"]`,
  //   );
  //   await expect(examCardTitle).toBeVisible();
  // }
}
