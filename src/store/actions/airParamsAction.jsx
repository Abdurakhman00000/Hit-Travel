import axios from "axios";
import { url } from "../../Api";

export const airParamsAction = (param) => async (dispatch) => {
  dispatch({
    type: "AIR_PARAMS_API_LOADING",
    payload: true,
  });
  try {
    const from =
      typeof param === "string" || typeof param === "number" ? param : "";
    const response = await axios.get(
      url + `/avia/params/${from ? `?from=${from}` : ""}`
    );
    dispatch({
      type: "AIR_PARAMS_API",
      payload: response.data,
    });
  } catch (error) {
    console.warn("avia params unavailable:", error?.message);
  } finally {
    dispatch({
      type: "AIR_PARAMS_API_LOADING",
      payload: false,
    });
  }
};
