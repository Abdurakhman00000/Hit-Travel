import { policyClient, documentClient, meClient, meAuthClient } from "./client";

export async function calculatePrice(payload) {
  const { data } = await policyClient.post("/v1/partner/contract/price", payload);
  return data;
}

export async function createContract(payload) {
  const { data } = await policyClient.post("/v1/partner/contract", payload);
  return data;
}

export async function getContract(contractId) {
  const { data } = await policyClient.get(`/v1/partner/contract/${contractId}`);
  return data;
}

export async function activateContract(contractId) {
  const { data } = await policyClient.post(
    `/v1/partner/contract/${contractId}/activate`
  );
  return data;
}

export async function uploadInspection(contractId, formData) {
  const { data } = await policyClient.post(
    `/v1/partner/contract/${contractId}/inspection`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function getContractDocument(contractId) {
  const { data } = await documentClient.get(
    `/v1/partner/document/contract/${contractId}`
  );
  return data;
}

export async function fetchDocumentWithRetry(contractId, retries = 5, delayMs = 2000) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await getContractDocument(contractId);
    } catch (error) {
      if (error?.response?.status !== 404 || attempt === retries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
}

export async function getUsePurposes(page = 0, size = 100) {
  const { data } = await policyClient.get("/v1/dictionary/use_purpose", {
    params: { page, size },
  });
  return data?.content || [];
}

export async function getCountries(page = 0, size = 300) {
  const { data } = await meClient.get("/v1/dictionary/country", {
    params: { page, size },
  });
  return data?.content || [];
}

export async function getTravelRegions(page = 0, size = 100) {
  const { data } = await meAuthClient.get("/v1/dictionary/region", {
    params: { page, size },
  });
  return data?.content || [];
}

export async function getInsurancePrograms(page = 0, size = 100) {
  const { data } = await policyClient.get("/v1/dictionary/program", {
    params: { page, size },
  });
  return data?.content || [];
}

export async function getActivityCoefficients(page = 0, size = 100) {
  const { data } = await policyClient.get(
    "/v1/dictionary/coefficient/constant_value",
    { params: { page, size } }
  );
  return data?.content || [];
}
