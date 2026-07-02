import axios from "axios";
import { url } from "../../Api";

export const airParamsAction = (param) => async (dispatch) => {
  dispatch({
    type: "AIR_PARAMS_API_LOADING",
    payload: true,
  });
  const response = await axios.get(
    url + `/avia/params/${param ? `?from=${param}` : ""}`
  );
  try {
    dispatch({
      type: "AIR_PARAMS_API",
      payload: response.data,
    });
    dispatch({
      type: "AIR_PARAMS_API_LOADING",
      payload: false,
    });
  } catch (error) {
    console.log(error);
  }
};
