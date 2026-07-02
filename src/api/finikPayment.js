import axios from "axios";
import { url } from "../Api";
import { getApiErrorMessage, getTokenHeaders as getBearerHeaders, getRedirectUrl } from "./http";

export { getApiErrorMessage };

export async function createFinikPayment(transactionId, redirectPath = "/payment/success") {
  const { data } = await axios.post(
    `${url}/finik/payment/`,
    {
      transaction_id: transactionId,
      redirect_url: getRedirectUrl(redirectPath),
    },
    { headers: getBearerHeaders() }
  );
  return data;
}

export async function bookFlight(payload) {
  const { data } = await axios.post(`${url}/flights/booking`, payload, {
    headers: getBearerHeaders(),
  });
  return data;
}
