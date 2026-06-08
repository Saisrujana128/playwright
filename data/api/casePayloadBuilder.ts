export class CasePayloadBuilder {
  private payload: any;

  constructor() {
    this.payload = {
      requestSystem: "EI Apigee",
      RequestFunctionType: "CreateCaseV2",
      caseInfo: {
        submittertype: "General Public",
        email: "default@pge.com",
        companyName: "",
        origin: "Mobile",
        location: {
          streetaddress: "Default St",
          city: "San Francisco",
          county: "San Francisco County",
          state: "California",
          zipcode: "94134",
          geo: {
            latitude: 37.7,
            longitude: -122.4
          }
        },
        safetyissue: "XXXXXX",
        details: ["XXXXX"],
        issuedescription: "XXXXX XXXXXXX",
        fileInfo: []
      }
    };
  }

  setEmail(email: string) {
    this.payload.caseInfo.email = email;
    return this;
  }

  setSafetyIssue(issue: string) {
    this.payload.caseInfo.safetyissue = issue;
    return this;
  }

  setDetails(desc: string) {
    this.payload.caseInfo.details = [desc];
    return this;
  }

  setIssueDescription(desc: string) {
    this.payload.caseInfo.issuedescription = desc;
    return this;
  }

  build() {
    return this.payload;
  }
}