// sections/CasePage.ts
import { expect, Page } from '@playwright/test';
import BasePage from '../common/BasePage';
import { CaseDataType } from '../../data/types/case.types';

export class CaseEditPage extends BasePage{
  
  private readonly ownerIdXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.OwnerId'] a";

  constructor(page: Page, timeout = 60000) {
    super(page, timeout);
  }

// -------- Edit Action --------
  async editBtn() {
    const editBtn = this.page.getByRole('button', { name: 'Edit', exact: true });
    await editBtn.scrollIntoViewIfNeeded();
    await expect(editBtn).toBeVisible();
    await editBtn.click();
  }

  // -------- Case Info Section --------
  async fillCaseInformationSection(data: CaseDataType) {
    //await this.page.getByRole('combobox', { name: 'Safety Issue Type' }).click();
    //await this.page.getByText('Power Pole').click();
    //await this.page.getByText('Burned').click();
    //await this.page.getByLabel('Details', { exact: true }).getByRole('button', { name: 'Move selection to Chosen' }).click();
    if (data.circuit) {
      
      const combobox = this.page.locator('lightning-base-combobox');
      const clearBtn = combobox.locator('[data-clear-selection-button]');
      try {
        if (await clearBtn.isVisible({ timeout: 3000 })) {
          //const clearBtn =  await this.page.getByRole('button', { name: 'Clear Circuit Selection' })
          console.log(' clearBtn.count() : ' + await clearBtn.count());
          if ( await clearBtn.count() > 0) {
            await clearBtn.click();
            await this.page.waitForLoadState('domcontentloaded');
        console.log('✅ Cleared existing Circuit selection');
          }
        }
      } catch {
        console.log('ℹ️ Clear button not visible, skipping...');
      }


      await this.page.getByRole('combobox', { name: 'Circuit' }).click();
      await this.page.waitForTimeout(1000);
      await this.page.getByRole('combobox', { name: 'Circuit' }).pressSequentially(data.circuit, { delay: 100 }); 
      await this.page.waitForTimeout(2000);
      const option = await this.page.getByRole('option', { name: new RegExp(data.circuit, 'i') }).last();
      await expect(option).toBeVisible();
      await option.click();
    }
    
  }

  // -------- Submitter Info Section --------
  async fillSubmitterInfoSection(data: CaseDataType) {
    if (data.region) {
      await this.page.getByRole('combobox', { name: 'Region' }).click();
      await this.page.getByText(data.region).click();
    }
  }

  // -------- Case Remediation Section --------
  async fillCaseRemediationSection(data: CaseDataType) {
    if (data.photoIdentifiesAProblem) {
      //await this.page.getByRole('combobox', { name: 'Photo Identifies a Problem' }).click();
      //await this.page.getByText(data.photoIdentifiesAProblem, { exact: true }).click();


      const photoProblemComboBox = await this.page.getByRole('combobox', { name: 'Photo Identifies a Problem', exact: true });
      await photoProblemComboBox.click();
      await photoProblemComboBox.pressSequentially(data.photoIdentifiesAProblem, { delay: 100 });
      const option = await this.page.getByRole('option', { name: new RegExp(data.photoIdentifiesAProblem, 'i') }).last();
      await expect(option).toBeVisible();
      await option.click();


    }
    if (data.safetyConcernViolation) {
      await this.page.getByLabel('Safety Concern / Violation', { exact: true }).getByText(data.safetyConcernViolation).click();
      await this.page.getByLabel('Safety Concern / Violation', { exact: true }).getByRole('button', { name: 'Move selection to Chosen' }).click();
    }
    if (data.pgeActionsToRemedyTheMatter) {
      await this.page.getByRole('textbox', { name: 'PG&E’s Actions to Remedy the' }).click();
      await this.page
        .getByRole('textbox', { name: 'PG&E’s Actions to Remedy the' })
        .fill(data.pgeActionsToRemedyTheMatter);
    }
    const todayDate = await new Date().toLocaleDateString('en-US');
    if (data.remedialDate) {
      await this.page.getByRole('textbox', { name: 'Date of Remedial Action' }).clear();
      await this.page
        .getByRole('textbox', { name: 'Date of Remedial Action' })
        .fill(todayDate);
    }
    if (data.hftd) {
      //await this.page.getByRole('combobox', { name: 'HFTD' }).click();
      //await this.page.getByText(data.hftd, {exact: true}).click();

      const hftdComboBox = await this.page.getByRole('combobox', { name: 'HFTD', exact: true });
      await hftdComboBox.click();
      await hftdComboBox.pressSequentially(data.hftd, { delay: 100 });
      const option = await this.page.getByRole('option', { name: new RegExp(data.hftd, 'i') }).last();
      await expect(option).toBeVisible();
      await option.click();

    }
    if (data.safetyConcernAlreadyIdentifiedByPGE) {
      await this.page.getByRole('checkbox', { name: 'Safety Concern already' }).check();
    }
    if (data.priority1Tree) {
      await this.page.getByRole('checkbox', { name: 'Priority 1 Tree' }).check();
    }
    if (data.duplicativeNotification) {
      await this.page.getByRole('textbox', { name: 'Duplicative Notification' }).click();
      await this.page
        .getByRole('textbox', { name: 'Duplicative Notification' })
        .fill(data.duplicativeNotification);
    }
    
  }

  // -------- Submission Assessment Section --------
  async fillSubmissionAssessmentSection(data: CaseDataType) {
    if (data.submissionValid) {
      await this.page.getByRole('checkbox', { name: 'Submission Valid' }).check();
    }
    if (data.submissionInvalid) {
      await this.page.getByRole('checkbox', { name: 'Submission Invalid' }).check();
    }
    if (data.invalidReason) {
      await this.page.getByRole('combobox', { name: 'Invalid - Reason' }).click();
      await this.page.getByText(data.invalidReason, { exact: true }).click();
    }
    if (data.emergencyDescription) {
      await this.page.getByRole('combobox', { name: 'Emergency Description' }).click();
      await this.page.getByText(data.emergencyDescription, { exact: true }).click();
    }
    if (data.invalidSubmissionComments) {
      await this.page.getByRole('textbox', { name: 'Invalid Submission Comments' }).click();
      await this.page.getByRole('textbox', { name: 'Invalid Submission Comments' }).fill(data.invalidSubmissionComments);
    }
    if (data.moreInfoNeeded) {
      await this.page.getByRole('checkbox', { name: 'More Info Needed' }).check();
    }
    if (data.moreInfoReason) {
      await this.page.getByRole('combobox', { name: 'More Information Reason' }).click();
      await this.page.getByText(data.moreInfoReason, { exact: true }).click();
    }
    
    
  }

  //Edit the Information Based on SAP Notes section
  async infoBasedOnSAPNotesSection(data: CaseDataType) {
    if (data.resultedInSiteVisit) {
      await this.page.getByRole('checkbox', { name: 'Resulted in Site Visit' }).check();
    }
    if (data.siteVisitApart) {
      await this.page.getByRole('checkbox', { name: 'Site Visit - Apart from' }).check();
    }
    if (data.na) {
      await this.page.getByRole('checkbox', { name: 'N/A' }).check();
    }
  } 
  // -------- System Info Section --------
  async scrollToSystemInformationSection() {
    const subject = this.page.getByRole('textbox', { name: 'Subject' });
    await subject.scrollIntoViewIfNeeded();
    await expect(subject).toBeVisible();
  }

  // -------- Save Action --------
  async saveCase() {
    const saveBtn = this.page.getByRole('button', { name: 'Save', exact: true });
    await saveBtn.scrollIntoViewIfNeeded();
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await this.page.waitForTimeout(3000);
    
  }

  async changeStatus(caseStatus: string) {
    await this.page.getByRole('button', { name: 'Edit', exact: true }).click();
    const statusComboBox = await this.page.getByRole('combobox', { name: 'Status', exact: true });
    await statusComboBox.click();
    await statusComboBox.pressSequentially(caseStatus, { delay: 100 });
    const option = await this.page.getByRole('option', { name: new RegExp(caseStatus, 'i') }).last();
      await expect(option).toBeVisible();
      await option.click();
   
  }

   async changeOwner(currentOwner: string) {    

    await this.page.getByRole('button', { name: 'Change Owner'}).first().click();
    await this.page.getByRole('combobox', { name: 'Select New Owner' }).click();
    if (currentOwner === "Dilip Selvaraj") {
      //await this.page.getByRole('button', { name: 'Change Owner'}).first().click();
      //await this.page.getByRole('combobox', { name: 'Select New Owner' }).click();
      await this.page.getByRole('combobox', { name: 'Select New Owner' }).pressSequentially("Ananthu GR", { delay: 100 });
      await this.page.getByRole('option', { name: "Ananthu GR", exact: true }).click();
    } else { 
      await this.page.getByRole('combobox', { name: 'Select New Owner' }).pressSequentially("Dilip Selvaraj", { delay: 100 });
      await this.page.getByRole('option', { name: "Dilip Selvaraj", exact: true }).click();
    }
    
      await this.page.getByRole('checkbox', { name: 'Send notification email' }).check();
      await this.page.getByRole('button', { name: 'Submit' }).click();
  }

    async waitForLightningStable() {
    // wait for domcontentloaded
    await this.page.waitForLoadState('domcontentloaded');

    // wait for spinners to disappear
    await this.page.locator('lightning-spinner').first().waitFor({
      state: 'hidden',
      timeout: 15000
    }).catch(() => {});

    // wait for buttons to be usable again
    await this.page.getByRole('button', { name: 'Edit' })
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

}