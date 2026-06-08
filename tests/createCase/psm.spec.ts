//npx playwright test --grep "@psm"
//npx playwright test
npx playwright test tests/createCase/psm.spec.ts  --workers=3 
//npx playwright test tests/createCase/psm.spec.ts
//npx playwright show-report
import { test, expect } from '../../page-objects/salesforce/salesforceFixture';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import caseData from '../../data/api/psmTestData.json';

for (const data of caseData) {

  test(`${data.testName}  @psm`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage, psmEditPage }) => {

    // ✅ Create case via API
    const caseNumber = await CaseService.createCase(
      new CasePayloadBuilder()
        .setEmail(data.webEmail)
        .setSafetyIssue(data.safetyIssueType)
        .setDetails(data.safetyIssueTypeDetails)
        .setIssueDescription(data.issueDescription)
    );
    // ✅ Get the Case ID using the Case Number using SOQL query with the session ID for authentication
    const sid = await loginPage.getSIDCookieValue();
    const caseID = await loginPage.getCaseIDfromCaseNumber(caseNumber, sid);

    // ✅ Navigate to Case in UI
    await caseSearchPage.navigateToCases();
    await caseSearchPage.openTheCase(caseID);

    // ✅ Edit Case Object flow
    await caseEditPage.editBtn();
    await caseEditPage.fillCaseInformationSection(data);
    await caseEditPage.fillSubmitterInfoSection(data);
    await caseEditPage.fillCaseRemediationSection(data);
    await caseEditPage.fillSubmissionAssessmentSection(data);
    await caseEditPage.infoBasedOnSAPNotesSection(data);
    // Save the Case
    await caseEditPage.saveCase();
    
    // ✅ CRITICAL: wait for Lightning to stabilize
    await caseEditPage.waitForLightningStable();

    // ✅ Click on PSM Notifications link
    await caseObjectPage.clickPSMNotificationsLink();
    
    // Create PSM Notification
    await psmEditPage.createPSMNotification();


});
}


// ✅ ✅ FORCE CLOSE BROWSER AFTER ALL TESTS
test.afterAll(async ({ browser }) => {
  await browser.close();
});

