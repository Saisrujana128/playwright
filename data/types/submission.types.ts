export interface CaseDataType {
  testName: string;
  safetyIssueType?: string;
  safetyIssueTypeDetails?: string;
  issueDescription?: string;
  circuit?: string;
  webEmail?: string;
  region?: string;
  photoIdentifiesAProblem?: string;
  safetyConcernViolation?: string;
  pgeActionsToRemedyTheMatter?: string;
  remedialDate?: string;
  hftd?: string;
  safetyConcernAlreadyIdentifiedByPGE?: boolean;
  priority1Tree?: boolean;
  duplicativeNotification?: string;
  submissionValid?: boolean;
  submissionInvalid?: boolean;
  invalidReason?: string;
  emergencyDescription?: string;
  invalidSubmissionComments?: string;
  moreInfoNeeded?: boolean;
  moreInfoReason?: string;
  resultedInSiteVisit?: boolean;
  siteVisitApart?: boolean;
  na?: boolean;

  // Add more fields anytime without touching your test code
}
