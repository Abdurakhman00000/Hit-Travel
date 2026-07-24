import axios from "axios";
import { url } from "../../Api";

export const rhSuggestAction = (q, lang = "ru") => async (dispatch) => {
  if (!q || q.length < 2) {
    dispatch({ type: "RH_SUGGEST", payload: [] });
    return;
  }
  try {
    const res = await axios.get(`${url}/ratehawk/suggest/`, { params: { q, lang } });
    const regions = res.data?.regions || [];
    const hotels = res.data?.hotels || [];
    dispatch({ type: "RH_SUGGEST", payload: [...regions, ...hotels] });
  } catch {
    dispatch({ type: "RH_SUGGEST", payload: [] });
  }
};

export const rhSearchAction = (params) => async (dispatch) => {
  dispatch({ type: "RH_SEARCH_LOADING", payload: true });
  dispatch({ type: "RH_SEARCH", payload: [] });
  try {
    const res = await axios.post(`${url}/ratehawk/search/`, params, { timeout: 45000 });
    dispatch({ type: "RH_SEARCH", payload: res.data?.hotels || [] });
  } catch (e) {
    const msg = e.code === "ECONNABORTED"
      ? "Поиск занял слишком долго. Попробуйте ещё раз."
      : e?.response?.data?.error || "Ошибка поиска отелей";
    dispatch({ type: "RH_SEARCH_ERROR", payload: msg });
  } finally {
    dispatch({ type: "RH_SEARCH_LOADING", payload: false });
  }
};

export const rhHotelInfoAction = (hotelId, lang = "ru") => async (dispatch) => {
  try {
    const res = await axios.get(`${url}/ratehawk/hotel/info/${hotelId}/`, { params: { lang } });
    dispatch({ type: "RH_HOTEL_INFO", payload: res.data });
  } catch {
    dispatch({ type: "RH_HOTEL_INFO", payload: null });
  }
};

export const rhHotelPageAction = (params) => async (dispatch) => {
  dispatch({ type: "RH_HOTEL_PAGE_LOADING", payload: true });
  dispatch({ type: "RH_HOTEL_PAGE", payload: null });
  try {
    const res = await axios.post(`${url}/ratehawk/hotel/page/`, params);
    const hotels = res.data?.hotels || [];
    dispatch({ type: "RH_HOTEL_PAGE", payload: hotels[0] || null });
  } catch (e) {
    dispatch({ type: "RH_HOTEL_PAGE_ERROR", payload: e?.response?.data?.error || "Ошибка" });
  } finally {
    dispatch({ type: "RH_HOTEL_PAGE_LOADING", payload: false });
  }
};

export const rhPrebookAction = (matchHash, token) => async (dispatch) => {
  dispatch({ type: "RH_PREBOOK_LOADING", payload: true });
  try {
    const res = await axios.post(
      `${url}/ratehawk/prebook/`,
      { match_hash: matchHash },
      { headers: { Authorization: `Token ${token}` } }
    );
    dispatch({ type: "RH_PREBOOK", payload: res.data });
    return res.data;
  } catch (e) {
    dispatch({ type: "RH_PREBOOK_ERROR", payload: e?.response?.data?.error || "Ошибка прибукинга" });
    return null;
  } finally {
    dispatch({ type: "RH_PREBOOK_LOADING", payload: false });
  }
};

export const rhBookAction = (payload, token) => async (dispatch) => {
  dispatch({ type: "RH_BOOK_LOADING", payload: true });
  try {
    const res = await axios.post(
      `${url}/ratehawk/book/`,
      payload,
      { headers: { Authorization: `Token ${token}` } }
    );
    dispatch({ type: "RH_BOOK", payload: res.data });
    return res.data;
  } catch (e) {
    dispatch({ type: "RH_BOOK_ERROR", payload: e?.response?.data?.error || "Ошибка бронирования" });
    return null;
  } finally {
    dispatch({ type: "RH_BOOK_LOADING", payload: false });
  }
};

export const rhFinishBookAction = (partnerOrderId, token) => async (dispatch) => {
  try {
    await axios.post(
      `${url}/ratehawk/book/finish/`,
      { partner_order_id: partnerOrderId },
      { headers: { Authorization: `Token ${token}` } }
    );
  } catch {}
};

export const rhBookStatusAction = (partnerOrderId, token) => async () => {
  const res = await axios.get(
    `${url}/ratehawk/book/status/`,
    {
      params: { partner_order_id: partnerOrderId },
      headers: { Authorization: `Token ${token}` },
    }
  );
  return res.data;
};

export const rhClearAction = () => ({ type: "RH_CLEAR" });
