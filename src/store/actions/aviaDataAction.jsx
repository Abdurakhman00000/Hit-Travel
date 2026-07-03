import axios from "axios";
import { url } from "../../Api";

export const aviaDataAction = (get) => async (dispatch) => {
  dispatch({
    type: "AVIA_API_LOADING",
    payload: true,
  });
  try {
    const response = await axios.get(url + "/avia/search/?" + get);
    // MyAgent: { success, data: { flights, search }, nearest }
    const body = response.data || {};
    const payload = {
      ...(body.data || body),
      nearest: body.nearest || body.data?.nearest || [],
    };
    dispatch({
      type: "AVIA_API",
      payload,
    });
  } catch (error) {
    dispatch({
      type: "AVIA_API",
      payload: { flights: [], search: null },
    });
    console.warn("avia search unavailable:", error?.message);
  } finally {
    dispatch({
      type: "AVIA_API_LOADING",
      payload: false,
    });
  }
};

export function aviaDataActionNot() {
  return {
    type: "AVIA_API_NOT",
    payload: [],
  };
}
