import axios from "axios";
import {
  NSK_DOCUMENT_URL,
  NSK_ME_URL,
  NSK_PARTNER_TOKEN,
  NSK_POLICY_URL,
} from "../../NskApi";

function createClient(baseURL, withAuth = true) {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "ru",
    },
  });

  if (withAuth) {
    instance.interceptors.request.use((config) => {
      if (NSK_PARTNER_TOKEN) {
        config.headers.Authorization = `Bearer ${NSK_PARTNER_TOKEN}`;
      }
      return config;
    });
  }

  return instance;
}

export const policyClient = createClient(NSK_POLICY_URL, true);
export const documentClient = createClient(NSK_DOCUMENT_URL, true);
export const meClient = createClient(NSK_ME_URL, false);
export const meAuthClient = createClient(NSK_ME_URL, true);

export function getNskErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Произошла ошибка при обращении к API страхования"
  );
}

export function isNskConfigured() {
  return Boolean(NSK_PARTNER_TOKEN);
}
