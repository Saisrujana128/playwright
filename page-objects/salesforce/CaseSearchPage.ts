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

  async clickListViewDropdown() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
    // Java: select_list = "//button[contains(@title,'Select a List View')]"
    const dropdownBtn = this.page.locator("//button[contains(@title,'Select a List View')]");
    await dropdownBtn.waitFor({ state: 'visible', timeout: 30000 });
    await dropdownBtn.click();
  }

  async searchListView(viewName: string) {
    // Java: sendKeys into //input[@placeholder='Search lists...'] or //input[@class='slds-combobox__input slds-input']
    const searchInput = this.page
      .locator("//input[@placeholder='Search lists...']")
      .or(this.page.locator("//input[@class='slds-combobox__input slds-input']"));
    await searchInput.first().waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.first().clear();
    await searchInput.first().fill(viewName);
    await this.page.waitForTimeout(4000);
  }

  async selectFirstListViewResult() {
    // Java: js.executeScript("arguments[0].click();", $("//*[@class='slds-media__body']"))
    const result = this.page.locator('lightning-base-combobox-item[role="option"]').first();
    await result.waitFor({ state: 'visible', timeout: 10000 });
    await result.click();
    await this.page.waitForTimeout(4000);
  }

  async getCaseRowCount(): Promise<number> {
    // Java: getDriver().findElements(By.xpath("//table[@class='slds-table ...']//tbody/tr"))
    const rows = this.page.locator(
      "//table[contains(@class,'slds-table') and contains(@class,'slds-table_header-fixed') and contains(@class,'slds-table_bordered')]//tbody/tr"
    );
    return rows.count();
  }

  async getCaseStatusFromRow(rowIndex: number, colIndex: number): Promise<string> {
    // Java: $(cases_table + "//tbody/tr[" + i + "]/td[" + col + "]//span[text()]")
    const cell = this.page.locator(
      `//table[contains(@class,'slds-table') and contains(@class,'slds-table_header-fixed')]//tbody/tr[${rowIndex}]/td[${colIndex}]//span[text()]`
    ).first();
    try {
      return ((await cell.textContent()) ?? '').trim();
    } catch {
      return '';
    }
  }

  async getListViewOptions(): Promise<string[]> {
    const optionLocator = this.page.locator('.slds-listbox__option span[class*="slds-media__figure--reverse"]');
    await optionLocator.first().waitFor({ state: 'visible' });
    return this.page.locator('.slds-listbox__option').allInnerTexts();
  }

  async selectListViewOption(viewName: string) {
    await this.page.locator('.slds-listbox__option').filter({ hasText: viewName }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getListViewTitle(): Promise<string> {
    const titleLocator = this.page.locator('lightning-list-view-picker').getByRole('button').first();
    return (await titleLocator.textContent()) ?? '';
  }
}