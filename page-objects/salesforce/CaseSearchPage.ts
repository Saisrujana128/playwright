// pages/CaseSearchPage.ts
import { Page } from '@playwright/test';
import { salesforceConfig } from '../../config/salesforce.config';

export class CaseSearchPage {
  constructor(private page: Page) {}

  async navigateToCases() {
    await this.page.goto(salesforceConfig.recentCasesUrl);
    //await this.page.waitForTimeout(20000);
  }

  async openTheCase(caseID: string) {
    await this.page.goto(`${salesforceConfig.openCaseUrl}${caseID}/view`);
    
  }

  async searchAndOpenCase(caseNumber: string) {
    await this.page.getByRole('button', { name: 'Search' }).click();

    await this.page.getByRole('searchbox', { name: 'Search...' }).fill(caseNumber);

    await this.page
      .locator(`//mark[text()='${caseNumber}']/ancestor::div[1]//span[text()='Case']`)
      .click();
  }
}