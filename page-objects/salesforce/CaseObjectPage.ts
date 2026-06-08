import { Page } from '@playwright/test';

export class CaseObjectPage {
  readonly page: Page;
  
// ✅ ✅ Locator variables go here (class-level)

  private readonly safetyIssueTypeXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Safety_Issue_Type__c'] lightning-formatted-text";

  private readonly psmDetailsXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Details__c'] lightning-formatted-text";

  private readonly ownerIdXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.OwnerId'] a";

  private readonly priorityXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.Priority'] lightning-formatted-text";

  private readonly parentIdXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.ParentId'] a";

  private readonly safetyconcernalreadyidentifiedby_AppXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Safetyconcernalreadyidentifiedby_App__c'] lightning-icon";

  private readonly childCasesXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.Child_Cases__c'] lightning-formatted-text";

  private readonly webEmailXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.SuppliedEmail'] a";

  private readonly submitterTypeXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Submitter_Type__c'] lightning-formatted-text";
  
  //More Information Correspondence Section fields
  private readonly customerRespondedToEmailXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Customer_Responded_to_Email__c'] lightning-icon"; 
  
  //Case Remediation Section fields
  private readonly photoIdentifiesProblemXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Photo_Identifies_a_Problem__c'] lightning-formatted-text";
  
  private readonly safetyConcernViolationXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Safety_Concern_Violation__c'] lightning-formatted-text";

  private readonly pgeActionsToRemedyTheMatterXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_PG_E_s_Actions_to_Remedy_the_Matter__c'] lightning-formatted-text";

  private readonly dateOfRemedialActionXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Date_of_Remedial_Action__c'] lightning-formatted-text";

  private readonly psmCPUFlagXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_CPUC_Flag__c'] lightning-formatted-text";

  private readonly psmHFTDXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_HFTD__c'] lightning-formatted-text";

  private readonly safetyconcernalreadyidentifiedby_PGEXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Safetyconcernalreadyidentifiedby_PGE__c'] lightning-icon";

  private readonly priority1TreeXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Priority_1_Tree__c'] lightning-icon";

  private readonly psmDuplicativeNotificationXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Duplicative_Notification__c'] lightning-formatted-text";

  private readonly psmVegRXXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Veg_RX__c'] lightning-formatted-text";

  private readonly vegetationPOCEmailXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Vegetation_POC_Email__c'] a";
    
  private readonly additionalVegPOCEmailXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Additional_Veg_POC_Email__c'] a";

  //Submission Assessment Section fields
  private readonly submissionValidXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Submission_Valid__c'] lightning-icon";

  private readonly submissionInvalidXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Submission_Invalid__c'] lightning-icon";

  private readonly moreInfoNeededXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_More_Info_Needed__c'] lightning-icon";

  private readonly invalidReasonXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Invalid_Reason__c'] lightning-formatted-text";
  
  private readonly emergencyDescriptionXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Emergency_Description__c'] lightning-formatted-text";

  private readonly invalidSubmissionCommentsXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Invalid_Submission_Comments__c'] lightning-formatted-text";

  private readonly OISFOXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_OIS__c'] lightning-formatted-text";

  private readonly serviceDropInvolvedXpath =
    "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Service_Drop_Involved__c'] lightning-icon";

  private readonly serviceDropRequiredWorkXpath =
  "div[data-target-selection-name='sfdc:RecordField.Case.PSM_Service_Drop_Required_Work__c'] lightning-icon";

  
  constructor(page: Page) {
    this.page = page;
  }

  async getCaseObjectValues(): Promise<Map<string, any>> {
    const caseObjectMap = new Map<string, any>();
    
    //safetyIssueType    
    const safetyIssueTypelocator = this.page.locator(this.safetyIssueTypeXpath).first();
    let safetyIssueTypevalue: string | null = null;
    if (await safetyIssueTypelocator.count() > 0) {
      safetyIssueTypevalue = await safetyIssueTypelocator.innerText(); // or textContent()
      caseObjectMap.set('safetyIssueType',safetyIssueTypevalue);
    }

    //psmDetails    
    const psmDetailsLocator = this.page.locator(this.psmDetailsXpath).first();
    let psmDetailsValue: string | null = null;
    if (await psmDetailsLocator.count() > 0) {
      psmDetailsValue = await psmDetailsLocator.innerText(); // or textContent()
      caseObjectMap.set('psmDetails',psmDetailsValue);
    }
    
    //ownerId    
    const ownerIdLocator = this.page.locator(this.ownerIdXpath).first();
    let ownerIdValue: string | null = null;
    if (await ownerIdLocator.count() > 0) {
      ownerIdValue = await ownerIdLocator.innerText(); // or textContent()
      caseObjectMap.set('ownerId',ownerIdValue);
    }
    
    //priority    
    const priorityLocator = this.page.locator(this.priorityXpath).first();
    let priorityValue: string | null = null;
    if (await priorityLocator.count() > 0) {
      priorityValue = await priorityLocator.innerText(); // or textContent()
      caseObjectMap.set('priority',priorityValue);
    }
    

  // ParentID  
  const parentLocator = this.page.locator(this.parentIdXpath).first();
  if (await parentLocator.count() > 0) {
    const parentId = await parentLocator.innerText();
    caseObjectMap.set('parentId', parentId);
  }

    

    // Safety Concern already identified by App
    const safetyconcernalreadyidentifiedby_App = this.page.locator(this.safetyconcernalreadyidentifiedby_AppXpath);
    const safetyconcernalreadyidentifiedby_Apptitle = await safetyconcernalreadyidentifiedby_App.getAttribute('title');
    const isSafetyconcernalreadyidentifiedby_AppCheck = safetyconcernalreadyidentifiedby_Apptitle === 'True';
    caseObjectMap.set('Safetyconcernalreadyidentifiedby_App',isSafetyconcernalreadyidentifiedby_AppCheck);

    //child Cases
    const childCasesLocator = this.page.locator(this.childCasesXpath).first();
    let childCasesValue: string | null = null;
    if (await childCasesLocator.count() > 0) {
      childCasesValue = await childCasesLocator.innerText(); // or textContent()
      caseObjectMap.set('childCases',childCasesValue);
    }
    
    //Web Email
    const webEmailXpathlocator = this.page.locator(this.webEmailXpath).first();
    let webEmailValue: string | null = null;
    if (await webEmailXpathlocator.count() > 0) {
      webEmailValue = await webEmailXpathlocator.innerText();
      caseObjectMap.set('webEmail', webEmailValue);
    }

    //Submitted Type
    const submitterTypeLocator = this.page.locator(this.submitterTypeXpath).first();
    let submitterTypeValue: string | null = null;
    if (await submitterTypeLocator.count() > 0) {
      submitterTypeValue = await submitterTypeLocator.innerText(); // or textContent()
      caseObjectMap.set('submitterType',submitterTypeValue);
    }
    
    // Customer Responded to Email
    const customerRespondedToEmail = this.page.locator(this.customerRespondedToEmailXpath);
    const customerRespondedToEmailTitle = await customerRespondedToEmail.getAttribute('title');
    const isCustomerRespondedToEmailCheck = customerRespondedToEmailTitle === 'True';
    caseObjectMap.set('CustomerRespondedToEmail',isCustomerRespondedToEmailCheck);

    // Photo Identifies Problem
    const photoIdentifiesProblemLocator = this.page.locator(this.photoIdentifiesProblemXpath).first();
    let photoIdentifiesProblemValue: string | null = null;
    if (await photoIdentifiesProblemLocator.count() > 0) {
      photoIdentifiesProblemValue = await photoIdentifiesProblemLocator.innerText(); // or textContent()
      caseObjectMap.set('photoIdentifiesProblem',photoIdentifiesProblemValue);
    }
    
    // Safety Concern / Violation
    const safetyConcernViolationLocator = this.page.locator(this.safetyConcernViolationXpath).first();
    let safetyConcernViolationValue: string | null = null;
    if (await safetyConcernViolationLocator.count() > 0) {
      safetyConcernViolationValue = await safetyConcernViolationLocator.innerText(); // or textContent()
      caseObjectMap.set('safetyConcernViolation',safetyConcernViolationValue);
    }
    
    //PG&E’s Actions to Remedy the Matter
    const pgeActionsToRemedyTheMatterLocator = this.page.locator(this.pgeActionsToRemedyTheMatterXpath).first();
    let pgeActionsToRemedyTheMatterValue: string | null = null;
    if (await pgeActionsToRemedyTheMatterLocator.count() > 0) {
      pgeActionsToRemedyTheMatterValue = await pgeActionsToRemedyTheMatterLocator.innerText(); // or textContent()
      caseObjectMap.set('pgeActionsToRemedyTheMatter',pgeActionsToRemedyTheMatterValue);
    }
    
    //Date of Remedial Action
    const dateOfRemedialActionLocator = this.page.locator(this.dateOfRemedialActionXpath).first();
    let dateOfRemedialActionValue: string | null = null;
    if (await dateOfRemedialActionLocator.count() > 0) {
      dateOfRemedialActionValue = await dateOfRemedialActionLocator.innerText(); // or textContent()
      caseObjectMap.set('dateOfRemedialAction',dateOfRemedialActionValue);
    }
    
    //CPUC Flag 
    const cpuFlagLocator = this.page.locator(this.psmCPUFlagXpath).first();
    let cpuFlagValue: string | null = null;
    if (await cpuFlagLocator.count() > 0 && await cpuFlagLocator.isVisible()) {
      cpuFlagValue = await cpuFlagLocator.innerText();
      caseObjectMap.set('CPUFlag',cpuFlagValue);
    }

    //HFTD
    const hftdLocator = this.page.locator(this.psmHFTDXpath).first();
    let hftdValue: string | null = null;
    if (await hftdLocator.count() > 0) {
      hftdValue = await hftdLocator.innerText(); // or textContent()
      caseObjectMap.set('psmHFTD',hftdValue);
    }
    
    // Safety Concern already identified by PGE
    const safetyconcernalreadyidentifiedby_PGE = this.page.locator(this.safetyconcernalreadyidentifiedby_PGEXpath);
    const safetyconcernalreadyidentifiedby_PGEtitle = await safetyconcernalreadyidentifiedby_PGE.getAttribute('title');
    const isSafetyconcernalreadyidentifiedby_PGECheck = safetyconcernalreadyidentifiedby_PGEtitle === 'True';
    caseObjectMap.set('Safetyconcernalreadyidentifiedby_PGE',isSafetyconcernalreadyidentifiedby_PGECheck);

    // priority 1 Tree
    const priority1Tree = this.page.locator(this.priority1TreeXpath);
    const priority1TreeTitle = await priority1Tree.getAttribute('title');
    const priority1TreeCheck = priority1TreeTitle === 'True';
    caseObjectMap.set('priority1Tree',priority1TreeCheck);
    
    //Duplicative Notification\
    const duplicativeNotificationLocator = this.page.locator(this.psmDuplicativeNotificationXpath).first();
    let duplicativeNotificationValue: string | null = null;
    if (await duplicativeNotificationLocator.count() > 0) {
      duplicativeNotificationValue = await duplicativeNotificationLocator.innerText(); // or textContent()
      caseObjectMap.set('psmDuplicativeNotification',duplicativeNotificationValue);
    }
    caseObjectMap.set('psmDuplicativeNotification',await this.page.locator(this.psmDuplicativeNotificationXpath).first().textContent());
    
    //Veg RX
    const vegRXLocator = this.page.locator(this.psmVegRXXpath).first();
    let vegRXValue: string | null = null;
    if (await vegRXLocator.count() > 0) {
      vegRXValue = await vegRXLocator.innerText(); // or textContent()
      caseObjectMap.set('psmVegRX',vegRXValue);
    }
    
    //Vegetation POC Email
    const vegetationPOCEmailXpathlocator = this.page.locator(this.vegetationPOCEmailXpath).first();
    let vegetationPOCEmailValue: string | null = null;
    if (await vegetationPOCEmailXpathlocator.count() > 0) {
      vegetationPOCEmailValue = await vegetationPOCEmailXpathlocator.innerText();
      caseObjectMap.set('vegetationPOCEmail', vegetationPOCEmailValue);
    }

    //Additional Veg POC Email
    const additionalVegPOCEmailXpathlocator = this.page.locator(this.additionalVegPOCEmailXpath).first();
    let additionalVegPOCEmailValue: string | null = null;
    if (await additionalVegPOCEmailXpathlocator.count() > 0) {
      additionalVegPOCEmailValue = await additionalVegPOCEmailXpathlocator.innerText();
      caseObjectMap.set('additionalVegPOCEmail', additionalVegPOCEmailValue);
    }

    // Submission Valid
    const submissionValid = this.page.locator(this.submissionValidXpath);
    const submissionValidTitle = await submissionValid.getAttribute('title');
    const submissionValidCheck = submissionValidTitle === 'True';
    caseObjectMap.set('submissionValid',submissionValidCheck);
    
    // Submission Invalid
    const submissionInvalid = this.page.locator(this.submissionInvalidXpath);
    const submissionInvalidTitle = await submissionInvalid.getAttribute('title');
    const submissionInvalidCheck = submissionInvalidTitle === 'True';
    caseObjectMap.set('submissionInvalid',submissionInvalidCheck);

    // More Info Needed
    const moreInfoNeeded = this.page.locator(this.moreInfoNeededXpath);
    const moreInfoNeededTitle = await moreInfoNeeded.getAttribute('title');
    const moreInfoNeededCheck = moreInfoNeededTitle === 'True';
    caseObjectMap.set('moreInfoNeeded',moreInfoNeededCheck);

    caseObjectMap.set('invalidReason',await this.page.locator(this.invalidReasonXpath).first().textContent());
    caseObjectMap.set('emergencyDescription',await this.page.locator(this.emergencyDescriptionXpath).first().textContent());
    caseObjectMap.set('invalidSubmissionComments',await this.page.locator(this.invalidSubmissionCommentsXpath).first().textContent());
    caseObjectMap.set('OISFO',await this.page.locator(this.OISFOXpath).first().textContent());    
    // Service Drop Involved
    const serviceDropInvolved = this.page.locator(this.serviceDropInvolvedXpath);
    const serviceDropInvolvedTitle = await serviceDropInvolved.getAttribute('title');
    const serviceDropInvolvedCheck = serviceDropInvolvedTitle === 'True';
    caseObjectMap.set('serviceDropInvolved',serviceDropInvolvedCheck);  
    // Service Drop Required Work
    const serviceDropRequiredWork = this.page.locator(this.serviceDropRequiredWorkXpath);
    const serviceDropRequiredWorkTitle = await serviceDropRequiredWork.getAttribute('title');
    const serviceDropRequiredWorkCheck = serviceDropRequiredWorkTitle === 'True';
    caseObjectMap.set('serviceDropRequiredWork',serviceDropRequiredWorkCheck);

    return caseObjectMap;
  }

  async clickPSMNotificationsLink() {
      await this.page
  .getByRole('link', { name: /PSM Notifications/ }).filter({ hasText: 'PSM Notifications' }).nth(1).click();
    }
}