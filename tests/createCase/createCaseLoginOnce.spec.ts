//npx playwright test --grep "@Smoke"
//npx playwright test
//npx playwright test tests/createCase/createCaseLoginOnce.spec.ts
//npx playwright show-report
import { test, expect, Page } from '@playwright/test';
import { LoginPage  } from '../../page-objects/salesforce/LoginPage';
import { CaseSearchPage  } from '../../page-objects/salesforce/CaseSearchPage';
import { CaseEditPage } from '../../page-objects/salesforce/CaseObjectEdit';
import { CaseObjectPage } from '../../page-objects/salesforce/CaseObjectPage';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import { CaseService } from '../../core-framework/common/api/caseService';
import caseData from '../../data/api/caseTestData.json'


let page: Page;
let loginPage: LoginPage;
let caseSearchPage: CaseSearchPage;
let caseEditPage: CaseEditPage;
let caseObjectPage: CaseObjectPage;
let startTime: Date;
let endTime: Date;
let sidCookieValue: string;

test.describe('Submission Assessment Tests', () => {

  // ✅ Runs ONCE before all tests
  test.beforeAll(async ({browser })  => {
    
  startTime = new Date();
  console.log(`🟢 Test Execution Started at: ${startTime.toLocaleString()}`);

    const context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);
    caseSearchPage = new CaseSearchPage(page);
    caseEditPage = new CaseEditPage(page);
    caseObjectPage = new CaseObjectPage(page);
    // ✅ LOGIN ONLY ONCE
    await loginPage.loginToSalesforce();
    sidCookieValue = await loginPage.getSIDCookieValue();
    console.log('✅ Logged in once for all tests');
  });

  for (const data of caseData ) {

    test(`${data.testName} @Smoke`, async ( ) => {

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
        // Change status and Save Case again
        await caseEditPage.changeStatus('Assigned');
        await caseEditPage.saveCase();
    
        // ✅ CRITICAL: wait for Lightning to stabilize
        await caseEditPage.waitForLightningStable();
        
        // ✅ Read the Case data safely
        const myCase = await caseObjectPage.getCaseObjectValues()
        // Change the Owner
        await caseEditPage.changeOwner(myCase.get('OwnerName'));
    
        // ✅ Verify toast
        await expect(page.getByText(/now owns the record/i)).toBeVisible();
    
        console.log('✅ Case Object Field Values:');
        for (const [key, value] of myCase) {
          console.log(`→ ${key} = ${value}`);
        }
      });
  }

  
  // ✅ Cleanup once
  test.afterAll(async () => {
    await page.close();
    endTime = new Date();
    console.log(`🔴 Test Execution Ended at: ${endTime.toLocaleString()}`);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationSec = (durationMs / 1000).toFixed(2);
    console.log(`⏱️ Total Execution Time: ${durationSec} seconds`);
  });


});

