//npx playwright test --grep "@TC007"
//npx playwright test tests/createCase/tc007_submissionInvalid.spec.ts
//npx playwright show-report



import { test, expect } from '../../page-objects/salesforce/salesforceFixture';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import caseData from '../../data/api/tc007TestData.json';

for (const data of caseData) {

  test(`${data.testName}  @TC007`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage }) => {

    
    // ✅ Create case via API using SF_007 test data
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

    // ✅ Edit Case Object: fill all sections (submissionInvalid = true) and save
    await caseEditPage.editBtn();
    await caseEditPage.fillCaseInformationSection(data);
    await caseEditPage.fillSubmitterInfoSection(data);
    await caseEditPage.fillCaseRemediationSection(data);
    await caseEditPage.fillSubmissionAssessmentSection(data);
    await caseEditPage.infoBasedOnSAPNotesSection(data);
    await caseEditPage.saveCase();

    // ✅ CRITICAL: wait for Lightning to stabilize
    await caseEditPage.waitForLightningStable();

  
    // ✅ Read Case Object field values and assert Submission Invalid = true
    const myCase = await caseObjectPage.getCaseObjectValues();
    expect(myCase.get('submissionInvalid')).toBe(true);
    console.log(`✅ Submission Invalid confirmed: ${myCase.get('submissionInvalid')}`);

    console.log('✅ TC007 Case Object Field Values:');
    for (const [key, value] of myCase) {
      console.log(`→ ${key} = ${value}`);
    }
  });
}


// ✅ FORCE CLOSE BROWSER AFTER ALL TESTS
test.afterAll(async ({ browser }) => {
  await browser.close();
});
