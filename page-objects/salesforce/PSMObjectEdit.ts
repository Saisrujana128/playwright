// sections/CasePage.ts
import { expect, Page } from '@playwright/test';
import BasePage from '../common/BasePage';
import { CaseDataType } from '../../data/types/submission.types';

export class PSMEditPage extends BasePage{
  
  

  constructor(page: Page, timeout = 60000) {
    super(page, timeout);
  }

// -------- Edit Action --------
  async createPSMNotification() {
    // ✅ Step 1: Click "New" button to create new PSM Notification
    await this.page.getByRole('button', { name: 'New' }).click();

    // ✅ Step 2: Select record type 
    await this.page.locator('.slds-radio--faux').nth(0).click();
    await this.page.getByRole('button', { name: 'Next' }).click();

    // ✅ Step 3: Define Salesforce iframe (dynamic-safe ✅)
    const frame1 = this.page.frameLocator('iframe[name^="vfFrameId"]');

    // ✅ Step 4: Fill notification form
    await frame1.getByLabel('*Notification Type').selectOption('EC');
    await frame1.getByLabel('*Problem Category').selectOption('ECOHE');
    await frame1.getByRole('checkbox', { name: 'Sent to SAP' }).check();
    await frame1.getByLabel('*Priority').selectOption('A');

    // ✅ Step 5: Fill Equipment ID
    await frame1.getByRole('textbox', { name: '* SAP Equipment ID' })
      .fill('114007506');

    // ✅ Step 6: Click Next Button
    await frame1.getByRole('button', { name: 'Next' }).nth(1).click();
    
    // ✅ Step 7:Switch to the 2nd iframe (index = 1)
    const frame2 = this.page.frameLocator('(//iframe[@title="accessibility title"])[2]');

    // ✅ Step 8: Optional wait (instead of Thread.sleep)
    //await this.page.waitForTimeout(5000);
    await frame2.getByRole('checkbox', { name: '* Is Primary' }).check();

    // ✅ Step 9: FDA Matrix logic
    // ✅ Click last image inside link AND capture popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      frame2.locator('(//a//img)[last()]').click()
    ]);

    // ✅ (Optional) Debug current window
    //console.log('Main window:', this.page.url());
    //console.log('Popup window:', popup.url());

    const searchBox = popup.getByRole('textbox');
    await searchBox.fill('FDAM-04944');
    await popup.getByRole('button', { name: 'Go' }).click();
    await popup.getByRole('link', { name: /FDAM-/ }).click();

      
      // ✅ Step 10: Save the Notification
    await this.page.waitForTimeout(1000);
    await frame2.getByRole('button', { name: 'Save', exact: true }).nth(1).click();
      
  }

}