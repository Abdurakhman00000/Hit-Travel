import axios from "axios";
import { url } from "../../Api";

export const paramsAction = () => async (dispatch) => {
  const response = await axios.get(url + "/api/filter-params");
  try {
    dispatch({
      type: "PARAMS_API",
      payload: response.data.lists,
    });
  } catch (error) {
    console.log(error);
  }
};
