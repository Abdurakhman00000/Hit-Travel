import axios from "axios";
import { url } from "../../Api";

export const paramsAction = () => async (dispatch) => {
  try {
    const response = await axios.get(url + "/api/filter-params");
    dispatch({
      type: "PARAMS_API",
      payload: response.data.lists,
    });
  } catch (error) {
    console.warn("filter-params unavailable:", error?.message);
  }
};
