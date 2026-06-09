// sections/CasePage.ts
import { expect, Page } from '@playwright/test';
import BasePage from '../common/BasePage';
import { CaseDataType } from '../../data/types/case.types';

export class PSMEditPage extends BasePage{
  
  

  constructor(page: Page, timeout = 60000) {
    super(page, timeout);
  }

// -------- Edit Action --------
  async createPSMNotification(data: CaseDataType) {
    // ✅ Step 1: Click "New" button to create new PSM Notification
    await this.page.getByRole('button', { name: 'New' }).click();

    // ✅ Step 2: Select record type 
    if (data.selectRecordType === "EC S9 LC S5") {
      await this.page.locator('.slds-radio--faux').nth(0).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
      // ✅ Step 3: Define Salesforce iframe (dynamic-safe ✅)
      const frame1 = this.page.frameLocator('iframe[name^="vfFrameId"]');

      // ✅ Step 4: Fill notification form
      if (data.notificationType) {
        await frame1.getByLabel('*Notification Type').selectOption(data.notificationType);
      }
      if (data.problemCategory) {
        await frame1.getByLabel('*Problem Category').selectOption(data.problemCategory);
      }
      if (data.senttoSAP) {
        await frame1.getByRole('checkbox', { name: 'Sent to SAP' }).check();
      }
      if (data.priority) {
        await frame1.getByLabel('*Priority').selectOption(data.priority);
      }
      // ✅ Step 5: Fill Equipment ID
      if (data.sapEquipmentID) {
        await frame1.getByRole('textbox', { name: '* SAP Equipment ID' })
        .fill(data.sapEquipmentID);
      }  
      
      if (data.comments) {
        const textarea = frame1.getByRole('textbox', { name: '* Comments' });
        await textarea.fill(data.comments);
      } 

      if (data.statusIndicators) {
        await frame1.getByLabel(/Status Indicators/i).selectOption(data.statusIndicators);
      }

      // ✅ Step 6: Click Next Button
      await frame1.getByRole('button', { name: 'Next' }).nth(1).click();
      
      // ✅ Step 7:Switch to the 2nd iframe (index = 1)
      const frame2 = this.page.frameLocator('(//iframe[@title="accessibility title"])[2]');

      // ✅ Step 8: Optional wait (instead of Thread.sleep)
      //await this.page.waitForTimeout(5000);
      if (data.isPrimary) {
        await frame2.getByRole('checkbox', { name: '* Is Primary' }).check();
      }  
      // ✅ Step 9: FDA Matrix logic
      // ✅ Click last image inside link AND capture popup
      if (data.psmFDAMatrix) {
        const [popup] = await Promise.all([
          this.page.waitForEvent('popup'),
          frame2.locator('(//a//img)[last()]').click()
        ]);

        // ✅ (Optional) Debug current window
        //console.log('Main window:', this.page.url());
        //console.log('Popup window:', popup.url());

        const searchBox = popup.getByRole('textbox');
        await searchBox.fill(data.psmFDAMatrix);
        await popup.getByRole('button', { name: 'Go' }).click();
        await popup.getByRole('link', { name: /FDAM-/ }).click();
      }
      // ✅ Step 10: Save the Notification
      //await this.page.waitForTimeout(1000);
      await frame2.getByRole('button', { name: 'Save', exact: true }).nth(1).click();
    
    } else if (data.selectRecordType === "ECV") {
      await this.page.locator('.slds-radio--faux').nth(1).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
      // ✅ Step 3: Define Salesforce iframe (dynamic-safe ✅)
      const frame1 = this.page.frameLocator('iframe[name^="vfFrameId"]');

      // ✅ Step 4: Fill notification form
      if (data.notificationType) {
        // do nothing , the value is auto populated
      }
      if (data.problemCategory) {
        // do nothing , the value is auto populated
      }
      if (data.senttoSAP) {
        await frame1.getByRole('checkbox', { name: 'Sent to SAP' }).check();
      }
      if (data.priority) {
        await frame1.getByLabel('*Priority').selectOption(data.priority);
      }
      // ✅ Step 5: Fill Equipment ID
      if (data.sapEquipmentID) {
        await frame1.getByRole('textbox', { name: '* SAP Equipment ID' })
        .fill(data.sapEquipmentID);
      }  

      if (data.comments) {
        const textarea = frame1.getByRole('textbox', { name: '* Comments' });
        await textarea.fill(data.comments);
      } 

      if (data.statusIndicators) {
        await frame1.getByLabel(/Status Indicators/i).selectOption(data.statusIndicators);
      }

      // ✅ Step 6: Click Next Button
      await frame1.getByRole('button', { name: 'Next' }).nth(1).click();
      
      // ✅ Step 7:Switch to the 2nd iframe (index = 1)
      const frame2 = this.page.frameLocator('(//iframe[@title="accessibility title"])[2]');

      // ✅ Step 8: Optional wait (instead of Thread.sleep)
      //await this.page.waitForTimeout(5000);
      if (data.isPrimary) {
        await frame2.getByRole('checkbox', { name: '* Is Primary' }).check();
      }  
      
      // ✅ Step 10: Save the Notification
      //await this.page.waitForTimeout(1000);
      await frame2.getByRole('button', { name: 'Save', exact: true }).nth(1).click();

    } else if (data.selectRecordType === "TI(Third Party Utility Incoming)") { 
      await this.page.locator('.slds-radio--faux').nth(2).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
      // ✅ Step 3: Define Salesforce iframe (dynamic-safe ✅)
      const frame1 = this.page.frameLocator('iframe[name^="vfFrameId"]');

      // ✅ Step 4: Fill notification form
      if (data.notificationType) {
        // do nothing , the value is auto populated
      }
      if (data.problemCategory) {
        // do nothing , the value is auto populated
      }
      if (data.partner) {
      await frame1.getByRole('textbox', { name: '* Partner' })
        .fill(data.partner);
      } 
      if (data.senttoSAP) {
        await frame1.getByRole('checkbox', { name: 'Sent to SAP' }).check();
      }
      if (data.priority) {
        await frame1.getByLabel('*Priority').selectOption(data.priority);
      }
      // ✅ Step 5: Fill Equipment ID
      if (data.sapEquipmentID) {
        await frame1.getByRole('textbox', { name: '* SAP Equipment ID' })
        .fill(data.sapEquipmentID);
      }  
      
      if (data.comments) {
        const textarea = frame1.getByRole('textbox', { name: '* Comments' });
        await textarea.fill(data.comments);
      } 

      if (data.statusIndicators) {
        await frame1.getByLabel(/Status Indicators/i).selectOption(data.statusIndicators);
      }

      // ✅ Step 6: Click Next Button
      await frame1.getByRole('button', { name: 'Next' }).nth(1).click();
      
      // ✅ Step 7:Switch to the 2nd iframe (index = 1)
      const frame2 = this.page.frameLocator('(//iframe[@title="accessibility title"])[2]');

      // ✅ Step 8: Optional wait (instead of Thread.sleep)
      //await this.page.waitForTimeout(5000);
      if (data.isPrimary) {
        await frame2.getByRole('checkbox', { name: '* Is Primary' }).check();
      }  
      
      // ✅ Step 10: Save the Notification
      //await this.page.waitForTimeout(1000);
      await frame2.getByRole('button', { name: 'Save', exact: true }).nth(1).click();

    } else if (data.selectRecordType === "TP & TPNU") {
      await this.page.locator('.slds-radio--faux').nth(3).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
      // ✅ Step 3: Define Salesforce iframe (dynamic-safe ✅)
      const frame1 = this.page.frameLocator('iframe[name^="vfFrameId"]');

      // ✅ Step 4: Fill notification form
      if (data.notificationType) {
        await frame1.getByLabel('*Notification Type').selectOption(data.notificationType);
      }
      if (data.problemCategory) {
        await frame1.getByLabel('*Problem Category').selectOption(data.problemCategory);
      }
      if (data.partner) {
      await frame1.getByRole('textbox', { name: '* Partner' })
        .fill(data.partner);
      } 
      if (data.senttoSAP) {
        await frame1.getByRole('checkbox', { name: 'Sent to SAP' }).check();
      }
      if (data.priority) {
        await frame1.getByLabel('*Priority').selectOption(data.priority);
      }
      // ✅ Step 5: Fill Equipment ID
      if (data.sapEquipmentID) {
        await frame1.getByRole('textbox', { name: '* SAP Equipment ID' })
        .fill(data.sapEquipmentID);
      } 
      
      if (data.comments) {
        const textarea = frame1.getByRole('textbox', { name: '* Comments' });
        await textarea.fill(data.comments);
      } 

      if (data.statusIndicators) {
        await frame1.getByLabel(/Status Indicators/i).selectOption(data.statusIndicators);
      } 

      // ✅ Step 6: Click Next Button
      await frame1.getByRole('button', { name: 'Next' }).nth(1).click();
      
      // ✅ Step 7:Switch to the 2nd iframe (index = 1)
      const frame2 = this.page.frameLocator('(//iframe[@title="accessibility title"])[2]');

      // ✅ Step 8: Optional wait (instead of Thread.sleep)
      //await this.page.waitForTimeout(5000);
      if (data.isPrimary) {
        await frame2.getByRole('checkbox', { name: '* Is Primary' }).check();
      }  
      
      // ✅ Step 10: Save the Notification
      //await this.page.waitForTimeout(1000);
      await frame2.getByRole('button', { name: 'Save', exact: true }).nth(1).click();

    }
      
    
      
  }

}