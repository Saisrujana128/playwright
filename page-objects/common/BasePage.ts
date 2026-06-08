import { Page } from '@playwright/test';

export default class BasePage {
  protected page: Page;
  protected defaultTimeout: number;

  constructor(page: Page, timeout = 30000) {
    this.page = page;
    this.defaultTimeout = timeout;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(selector: string) {
    await this.page.locator(selector).click({ timeout: this.defaultTimeout });
  }

  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value, { timeout: this.defaultTimeout });
  }

  async isVisible(selector: string) {
    return await this.page.locator(selector).isVisible({ timeout: this.defaultTimeout }).catch(() => false);
  }

  async waitForSelector(selector: string) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: this.defaultTimeout });
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle', { timeout: this.defaultTimeout }).catch(() => {});
  }

  async getText(selector: string) {
    return await this.page.locator(selector).innerText({ timeout: this.defaultTimeout }).catch(() => '');
  }

  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }
}
