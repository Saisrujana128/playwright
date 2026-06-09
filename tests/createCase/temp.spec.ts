// npx playwright test tests/createCase/temp.spec.ts --workers=3 
// npx playwright test tests/createCase/temp.spec.ts
// npx playwright show-report
// npx playwright test 
// npx playwright test --grep "@health" --workers=3 
import caseData from '../../data/api/caseTestData.json';
import { CaseService } from '../../core-framework/common/api/caseService';
import { CasePayloadBuilder } from '../../data/api/casePayloadBuilder';
import { test, expect } from '../../page-objects/salesforce/salesforceFixture';

test.describe('parallel tests', () => {
    test.describe.configure({ mode: 'parallel' });
      
      const tc1 = caseData.find(d => d.testName.includes("TC 1"));
      const tc2 = caseData.find(d => d.testName.includes("TC 2"));
      const tc3 = caseData.find(d => d.testName.includes("TC 3"));
      
      test(`${tc1?.testName} @health`, async ({ page, loginPage, caseSearchPage, caseEditPage, caseObjectPage, psmEditPage }) => {
        const data = tc1!;
        console.log('TC 1 Data:', data);
        // test logic
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
          
          // ✅ Read the Case data safely
          const myCase = await caseObjectPage.getCaseObjectValues()
          console.log('✅ Case Object Field Values:');
          for (const [key, value] of myCase) {
            console.log(`→ ${key} = ${value}`);
          }
          const parentCaseNumber = myCase.get('ParentCaseId'); 
          const parentCaseID = await loginPage.getCaseIDfromCaseNumber(parentCaseNumber, sid);

          // ✅ Navigate to Case in UI
          await caseSearchPage.navigateToCases();
          await caseSearchPage.openTheCase(parentCaseID);

          const myParentCase = await caseObjectPage.getCaseObjectValues()
          console.log('✅ Parent Case Object Field Values:');
          for (const [key, value] of myParentCase) {
            console.log(`→ ${key} = ${value}`);
          }

          
      });

      test(`${tc2?.testName} @health`, async ({  }) => {
        const data = tc2!;
        console.log('TC 2 Data:', data);
        // test logic
      });

      test(`${tc3?.testName} @health`, async ({  }) => {
        const data = tc3!;
        console.log('TC 3 Data:', data);
        // test logic
      });



   


});


