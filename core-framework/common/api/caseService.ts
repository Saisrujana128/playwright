import { CasePayloadBuilder } from "../../../data/api/casePayloadBuilder";
import { ApiClient } from "./apiClient";
import { CaseApi } from "./caseApi";

export class CaseService {
  static async createCase(payloadBuilder: CasePayloadBuilder): Promise<string> {
    const apiClient = new ApiClient();
    await apiClient.init();

    const caseApi = new CaseApi(apiClient.getContext());

    return await caseApi.createCase(payloadBuilder.build());
  }
}
``