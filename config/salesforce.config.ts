export const salesforceUsers = {
  standardUser: {
    username: 'df1j@pge.com.svc.srvcqa',
    password: 'Salesforce123@'
  }
};

export const salesforceConfig = {
  baseUrl: 'https://pgeservice--srvcqa.sandbox.my.salesforce.com/',
  recentCasesUrl: 'https://pgeservice--srvcqa.sandbox.lightning.force.com/lightning/o/Case/list?filterName=__Recent',
  openCaseUrl: 'https://pgeservice--srvcqa.sandbox.lightning.force.com/lightning/r/Case/',
  apiBaseURL: 'https://api-ext-eimule-test.cloud.pge.com',
};

export default {
  users: salesforceUsers,
  config: salesforceConfig
};