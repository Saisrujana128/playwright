//npx playwright test --grep "@TC004"
//npx playwright test tests/createCase/tc004_changeStatusInProgress.spec.ts
//npx playwright show-report

/**
 * Scenario: TC004_To Verify if the triage team member able to change the status into InProgress
 *
 * #Given User is able to read data from excel with "SF_004"
 * #When  User has to hit post request for PSM url to submit the case
 * #Then  User verify the status code "200"
 * Given User is able to read data from excel with "SF_004"
 * Given User launches the salesforce URL
 * And   User enters the credentials
 * And   User searches the case number
 * Then  User verifies the case submitted as valid
 * And   User assign the case to someone
 * Then  User validate whether the status changed to assigned or not
 * And   User changes the status to InProgress
 * Then  User verify the status changed to InProgress or not
 */

import { test, expect } from '../../page-objects/salesforce/salesforceFixture';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import caseData from '../../data/api/tc004TestData.json';

const statusLocatorXpath =
  "div[data-target-selection-name='sfdc:RecordField.Case.Status'] lightning-formatted-text";

for (const data of caseData) {

  test(`${data.testName}  @TC004`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage }) => {

    // Given User is able to read data from excel with "SF_004"
    // ✅ Create case via API using SF_004 test data
    const caseNumber = await CaseService.createCase(
      new CasePayloadBuilder()
        .setEmail(data.webEmail)
        .setSafetyIssue(data.safetyIssueType)
        .setDetails(data.safetyIssueTypeDetails)
        .setIssueDescription(data.issueDescription)
    );

    // Given User launches the salesforce URL
    // And   User enters the credentials
    // ✅ Handled automatically by salesforceFixture (loginPage.loginToSalesforce())

    // And User searches the case number
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

    // Then User verifies the case submitted as valid
    // ✅ Read Case Object field values and assert Submission Valid = true
    const myCase = await caseObjectPage.getCaseObjectValues();
    expect(myCase.get('submissionValid')).toBe(true);
    console.log(`✅ Submission Valid confirmed: ${myCase.get('submissionValid')}`);

    // And User assign the case to someone
    // ✅ Change Status to 'Assigned' and save, then change owner
    await caseEditPage.changeStatus('Assigned');
    await caseEditPage.saveCase();
    await caseEditPage.waitForLightningStable();
    await caseEditPage.changeOwner(myCase.get('OwnerName'));

    // ✅ Verify owner change toast
    await expect(page.getByText(/now owns the record/i)).toBeVisible();
    console.log(`✅ Case ownership successfully transferred`);

    // Then User validate whether the status changed to assigned or not
    // ✅ Assert the Status field reads 'Assigned'
    const statusLocator = page.locator(statusLocatorXpath).first();
    await expect(statusLocator).toHaveText('Assigned');
    console.log(`✅ Case Status confirmed as 'Assigned'`);

    // And User changes the status to InProgress
    // ✅ Change Status to 'In Progress' and save
    await caseEditPage.changeStatus('In Progress');
    await caseEditPage.saveCase();

    // ✅ CRITICAL: wait for Lightning to stabilize
    await caseEditPage.waitForLightningStable();

    // Then User verify the status changed to InProgress or not
    // ✅ Assert the Status field reads 'In Progress'
    await expect(page.locator(statusLocatorXpath).first()).toHaveText('In Progress');
    console.log(`✅ Case Status confirmed as 'In Progress'`);

    console.log('✅ TC004 Case Object Field Values:');
    for (const [key, value] of myCase) {
      console.log(`→ ${key} = ${value}`);
    }
  });
}


// ✅ FORCE CLOSE BROWSER AFTER ALL TESTS
test.afterAll(async ({ browser }) => {
  await browser.close();
});
