//npx playwright test --grep "@TC002"
//npx playwright test tests/createCase/tc002_changeOwner.spec.ts
//npx playwright show-report

/**
 * @SF002
 * Scenario: TC002_To Verify the user is able to Change the owner of the case
 *
 * #Given User is able to read data from excel with "SF_002"
 * #When  User has to hit post request for PSM url to submit the case
 * #Then  User verify the status code "200"
 * Given User is able to read data from excel with "SF_002"
 * Given User launches the salesforce URL
 * And   User enters the credentials
 * And   User searches the case number
 * Then  User verifies the case submitted as valid
 * Then  User assign the case to someone
 */

import { test, expect } from '../../page-objects/salesforce/salesforceFixture';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import caseData from '../../data/api/tc002TestData.json';

for (const data of caseData) {

  test(`${data.testName}  @TC002`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage }) => {

    // Given User is able to read data from excel with "SF_002"
    // ✅ Create case via API using SF_002 test data
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

    // Then User assign the case to someone
    // ✅ Change the case owner
    await caseEditPage.changeOwner(myCase.get('OwnerName'));

    // ✅ Verify owner change toast
    await expect(page.getByText(/now owns the record/i)).toBeVisible();
    console.log(`✅ Case ownership successfully transferred`);

    console.log('✅ TC002 Case Object Field Values:');
    for (const [key, value] of myCase) {
      console.log(`→ ${key} = ${value}`);
    }
  });
}


// ✅ FORCE CLOSE BROWSER AFTER ALL TESTS
test.afterAll(async ({ browser }) => {
  await browser.close();
});
