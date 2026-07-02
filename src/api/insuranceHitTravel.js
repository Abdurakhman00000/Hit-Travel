import axios from "axios";
import { url } from "../Api";
import { getTokenHeaders as getBearerHeaders, getApiErrorMessage } from "./http";

export { getApiErrorMessage };

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function getOsagoUsePurposes() {
  const { data } = await axios.get(`${url}/insurance/nsk/osago/use-purposes/`);
  return normalizeList(data);
}

export async function getKaskoPrograms() {
  const { data } = await axios.get(`${url}/insurance/nsk/kasko/programs/`);
  return normalizeList(data);
}

export async function getVzrRegions() {
  const { data } = await axios.get(`${url}/insurance/nsk/vzr/regions/`);
  return normalizeList(data);
}

export async function getVzrPrograms() {
  const { data } = await axios.get(`${url}/insurance/nsk/vzr/programs/`);
  return normalizeList(data);
}

export async function getVzrActivities() {
  const { data } = await axios.get(`${url}/insurance/nsk/vzr/activities/`);
  return normalizeList(data);
}

export async function calculateOsago(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/osago/calculate/`,
    payload
  );
  return data;
}

export async function calculateKasko(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/kasko/calculate/`,
    payload
  );
  return data;
}

export async function calculateVzr(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/vzr/calculate/`,
    payload
  );
  return data;
}

export async function createOsagoPolicy(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/osago/create/`,
    payload,
    { headers: getBearerHeaders() }
  );
  return data;
}

export async function createKaskoPolicy(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/kasko/create/`,
    payload,
    { headers: getBearerHeaders() }
  );
  return data;
}

export async function createVzrPolicy(payload) {
  const { data } = await axios.post(
    `${url}/insurance/nsk/vzr/create/`,
    payload,
    { headers: getBearerHeaders() }
  );
  return data;
}

export async function submitKaskoInspection(policyId, photos, damageImages = []) {
  const formData = new FormData();
  Object.entries(photos).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });
  damageImages.forEach((file) => {
    if (file) formData.append("damageImages", file);
  });

  const { data } = await axios.post(
    `${url}/insurance/nsk/kasko/${policyId}/inspection/`,
    formData,
    { headers: getBearerHeaders() }
  );
  return data;
}

export async function getPolicyStatus(policyId) {
  const { data } = await axios.get(`${url}/insurance/nsk/${policyId}/`, {
    headers: getBearerHeaders(),
  });
  return data;
}

export async function getPolicyPdf(policyId) {
  const { data } = await axios.get(`${url}/insurance/nsk/${policyId}/pdf/`, {
    headers: getBearerHeaders(),
  });
  return data;
}

export async function getInsuranceHistory() {
  const { data } = await axios.get(`${url}/insurance/nsk/history/`, {
    headers: getBearerHeaders(),
  });
  return normalizeList(data);
}

export async function calculateInsurancePrice(product, payload) {
  if (product === "VZR") return calculateVzr(payload);
  if (product === "KASKO") return calculateKasko(payload);
  return calculateOsago(payload);
}

export async function createInsurancePolicy(product, payload) {
  if (product === "VZR") return createVzrPolicy(payload);
  if (product === "KASKO") return createKaskoPolicy(payload);
  return createOsagoPolicy(payload);
}

export async function loadInsuranceDictionaries(product) {
  if (product === "VZR") {
    const [regions, programs, activities] = await Promise.all([
      getVzrRegions(),
      getVzrPrograms(),
      getVzrActivities(),
    ]);
    return { usePurposes: [], travelRegions: regions, programs, activities };
  }

  if (product === "KASKO") {
    const [usePurposes, programs] = await Promise.all([
      getOsagoUsePurposes(),
      getKaskoPrograms(),
    ]);
    return { usePurposes, travelRegions: [], programs, activities: [] };
  }

  const usePurposes = await getOsagoUsePurposes();
  return { usePurposes, travelRegions: [], programs: [], activities: [] };
}
