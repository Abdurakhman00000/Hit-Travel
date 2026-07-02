import axios from "axios";
import { url } from "../../Api";

export const searchAction = (getten) => async (dispatch) => {
  try {
    const response = await axios.get(url + "/api/search?" + getten);
    dispatch({
      type: "SEARCH_API",
      payload: response.data,
    });
    dispatch({
      type: "SEARCH_API_LOADING",
      payload: true,
    });
  } catch (error) {
    dispatch({
      type: "SEARCH_API",
      payload: { result: { hotel: [] }, status: { hotelsfound: 0 }, toursfound: 0 },
    });
    dispatch({
      type: "SEARCH_API_LOADING",
      payload: true,
    });
  }
};

export function searchActionNot() {
  return {
    type: "SEARCH_API_NOT",
    payload: [],
  };
}
