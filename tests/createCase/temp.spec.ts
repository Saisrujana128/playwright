// npx playwright test tests/createCase/temp.spec.ts --workers=3 
// npx playwright test tests/createCase/temp.spec.ts
// npx playwright show-report
// npx playwright test 
// npx playwright test --grep "@health" --workers=3 
import caseData from '../../data/api/caseTestData.json';
import { test, expect } from '../../page-objects/salesforce/salesforceFixture';

test.describe('parallel tests', () => {
    test.describe.configure({ mode: 'parallel' });
      
      const tc1 = caseData.find(d => d.testName.includes("TC 1"));
      const tc2 = caseData.find(d => d.testName.includes("TC 2"));
      const tc3 = caseData.find(d => d.testName.includes("TC 3"));
      
      test(`${tc1?.testName} @health`, async ({ }) => {
        const data = tc1!;
        console.log('TC 1 Data:', data);
        // test logic
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


