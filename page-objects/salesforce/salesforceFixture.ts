import { test as base } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { CaseEditPage } from './CaseObjectEdit';
import { CaseSearchPage } from './CaseSearchPage';
import { CaseObjectPage } from './CaseObjectPage';
import { PSMEditPage } from './PSMObjectEdit';

type MyFixtures = {
  loginPage: LoginPage;
  caseEditPage: CaseEditPage;
  caseSearchPage: CaseSearchPage;
  caseObjectPage: CaseObjectPage;
  psmEditPage: PSMEditPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToSalesforce();
    await use(loginPage);
  },

  caseEditPage: async ({ page }, use) => {
    await use(new CaseEditPage(page));
  },

  caseSearchPage: async ({ page }, use) => {
    await use(new CaseSearchPage(page));
  },

  caseObjectPage: async ({ page }, use) => {
    await use(new CaseObjectPage(page));
  },

  psmEditPage: async ({ page }, use) => {
    await use(new PSMEditPage(page));
  },
});

export { expect } from '@playwright/test';
