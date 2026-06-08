// pages/LoginPage.ts
import { Page, expect } from '@playwright/test';
import { salesforceConfig , salesforceUsers} from '../../config/salesforce.config';

export class LoginPage {
  constructor(private page: Page) {}

  async loginToSalesforce() {
    await this.page.goto(salesforceConfig.baseUrl);
    await this.page.getByRole('textbox', { name: 'Username' }).click();
    await this.page.getByRole('textbox', { name: 'Username' }).fill(salesforceUsers.standardUser.username);

    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(salesforceUsers.standardUser.password);

    await this.page.getByRole('button', { name: 'Log In to Sandbox' }).click();
    await this.page.waitForURL('**lightning.force.com/**');
  }

  async getSIDCookieValue() {
  
    const cookies = await this.page.context().cookies();
    const sidCookie = cookies.find(c => c.name === 'sid');
    if (!sidCookie) {
     throw new Error('SID not found after login');
    }
    return sidCookie.value;
  }

  async getCaseIDfromCaseNumber(caseNumber: string,sid : string) {
  
    const soql = `SELECT Id FROM Case WHERE CaseNumber='${caseNumber}' LIMIT 1`;

    const res = await fetch(
      `${salesforceConfig.baseUrl}/services/data/v65.0/query?q=${encodeURIComponent(soql)}`,
      {
        headers: {
          Authorization: `Bearer ${sid}`, // ✅ using SID
        },
      }
    );

    const data = await res.json();
    return data.records?.[0]?.Id ?? null;
  }

}