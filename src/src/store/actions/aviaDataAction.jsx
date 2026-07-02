import axios from "axios";
import { url } from "../../Api";

export const aviaDataAction = (get) => async (dispatch) => {
  dispatch({
    type: "AVIA_API_LOADING",
    payload: true,
  });
  try {
    const response = await axios.get(url + "/avia/search/?" + get);
    dispatch({
      type: "AVIA_API",
      payload: response.data,
    });
    dispatch({
      type: "AVIA_API_LOADING",
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: "AVIA_API_LOADING",
      payload: false,
    });
    console.log(error);
  }
};

export function aviaDataActionNot() {
  return {
    type: "AVIA_API_NOT",
    payload: [],
  };
}
