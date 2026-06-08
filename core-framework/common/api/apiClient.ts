import { request, APIRequestContext } from '@playwright/test';
import { salesforceConfig } from '../../../config/salesforce.config';
export class ApiClient {
  private requestContext!: APIRequestContext;

  async init() {
    this.requestContext = await request.newContext({
      baseURL: salesforceConfig.apiBaseURL
    });
  }

  getContext() {
    return this.requestContext;
  }
}