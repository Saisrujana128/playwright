import { Browser, BrowserContext, Page } from '@playwright/test';
/**
 * Uses the injected Playwright browser instance, creates a new context and page.
 * Returns { context, page }.
 * Pass the browser instance from the test's beforeAll or as a fixture argument.
 */
export async function getContextPage(browser: Browser): Promise<{ context: BrowserContext, page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  return { context, page };
}


/**
 * Closes the given browser instance.
 */
export async function closeBrowser(browser: Browser) {
  await browser.close();
}