import axios from "axios";
import { url } from "../../Api";

export const personalAction =
  ({ headers }) =>
  async (dispatch) => {
    const response = await axios.get(url + "/profile/personal", { headers });
    try {
      dispatch({
        type: "PERSONAL_API",
        payload: response.data.data,
      });
    } catch {}
  };
