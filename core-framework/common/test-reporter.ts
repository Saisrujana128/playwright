import { Page, TestInfo, test } from '@playwright/test';

/**
 * TestReporter class to handle screenshots and reporting in a consistent way
 */
export class TestReporter {
  private page: Page;
  private testInfo: TestInfo;
  private screenshotIndex: number;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.screenshotIndex = 0;
  }

  async takeScreenshot(name: string, description?: string, additionalPath?: string): Promise<string> {
    const safeName = name.replace(/[\\/:"*?<>|]+/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const index = ++this.screenshotIndex;
    const fileName = `${safeName}-${timestamp}-${index}${additionalPath ? `-${additionalPath}` : ''}.png`;
    const filePath = `./test-results/${fileName}`;
    if (description) console.log(description);
    const buffer = await this.page.screenshot({ path: filePath });
    await this.testInfo.attach(fileName, { body: buffer, contentType: 'image/png' });
    return filePath;
  }

  async logStep(message: string, takeScreenshot: boolean = false, screenshotName?: string): Promise<void> {
    await test.step(message, async () => {
      console.log(message);
      if (takeScreenshot && screenshotName) await this.takeScreenshot(screenshotName);
    });
  }

  async logError(message: string, error: any, screenshotName: string, throwError: boolean = false): Promise<void> {
    console.log(message);
    console.error(`ERROR: ${message}`, error.message || error);
    await this.takeScreenshot(screenshotName);
    if (throwError) throw new Error(message);
  }
}