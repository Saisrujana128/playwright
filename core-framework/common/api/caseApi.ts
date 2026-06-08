import { APIRequestContext } from '@playwright/test';
//import { casePayload } from '../../../data/api/casePayload';

export class CaseApi {
  constructor(private request: APIRequestContext) {}

  async createCase(payload: any): Promise<string> {
    const response = await this.request.post(
      '/salesforce/publicsafety/v1/mobile/CreateCaseV2?requestSystem=EIApigee&source=Web&requestFunctionType=GetApprovalType',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'aKzb7grsd6LzZFxZ7z7Cym5tVXDGfclhu9PcLcHbp3ueUWyG'
        },
        data: payload
      }
    );

    const body = await response.json();

    if (body.Status !== 'SUCCESS') {
      throw new Error(`Failed: ${JSON.stringify(body)}`);
    }

    return body.CaseId;
  }
}