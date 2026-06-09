//npx playwright test --grep "@TC005"
//npx playwright test tests/createCase/tc005_changeStatusMoreInfoNeeded.spec.ts
//npx playwright show-report


import { test, expect } from '../../page-objects/salesforce/salesforceFixture';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import caseData from '../../data/api/tc005TestData.json';

const statusLocatorXpath =
  "div[data-target-selection-name='sfdc:RecordField.Case.Status'] lightning-formatted-text";

for (const data of caseData) {

  test(`${data.testName}  @TC005`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage }) => {

   
    // ✅ Create case via API using SF_005 test data
    const caseNumber = await CaseService.createCase(
      new CasePayloadBuilder()
        .setEmail(data.webEmail)
        .setSafetyIssue(data.safetyIssueType)
        .setDetails(data.safetyIssueTypeDetails)
        .setIssueDescription(data.issueDescription)
    );

    // ✅ Resolve Case ID from Case Number via SOQL and navigate to the Case record
    const sid = await loginPage.getSIDCookieValue();
    const caseID = await loginPage.getCaseIDfromCaseNumber(caseNumber, sid);
    await caseSearchPage.navigateToCases();
    await caseSearchPage.openTheCase(caseID);

    // ✅ Edit Case Object: fill all sections and save
    await caseEditPage.editBtn();
    await caseEditPage.fillCaseInformationSection(data);
    await caseEditPage.fillSubmitterInfoSection(data);
    await caseEditPage.fillCaseRemediationSection(data);
    await caseEditPage.fillSubmissionAssessmentSection(data);
    await caseEditPage.infoBasedOnSAPNotesSection(data);
    await caseEditPage.saveCase();

    // ✅ CRITICAL: wait for Lightning to stabilize
    await caseEditPage.waitForLightningStable();

    // ✅ Read Case Object field values and assert Submission Valid = true
    const myCase = await caseObjectPage.getCaseObjectValues();
    // ✅ Change Status to 'Assigned' and save, then change owner
    await caseEditPage.changeStatus('Assigned');
    await caseEditPage.saveCase();
    await caseEditPage.waitForLightningStable();
    await caseEditPage.changeOwner(myCase.get('OwnerName'));

    // ✅ Verify owner change toast
    await expect(page.getByText(/now owns the record/i)).toBeVisible();
    console.log(`✅ Case ownership successfully transferred`);

    // ✅ Assert the Status field reads 'Assigned'
    const statusLocator = page.locator(statusLocatorXpath).first();
    await expect(statusLocator).toHaveText('Assigned');
    console.log(`✅ Case Status confirmed as 'Assigned'`);

    
    // ✅ Change Status to 'More Information Needed' and save
    await caseEditPage.changeStatus('More Information Needed');
    await caseEditPage.saveCase();

    // ✅ CRITICAL: wait for Lightning to stabilize
    await caseEditPage.waitForLightningStable();

    // ✅ Assert the Status field reads 'More Information Needed'
    await expect(page.locator(statusLocatorXpath).first()).toHaveText('More Information Needed');
    console.log(`✅ Case Status confirmed as 'More Information Needed'`);

    console.log('✅ TC005 Case Object Field Values:');
    for (const [key, value] of myCase) {
      console.log(`→ ${key} = ${value}`);
    }
  });
}


// ✅ FORCE CLOSE BROWSER AFTER ALL TESTS
test.afterAll(async ({ browser }) => {
  await browser.close();
});
