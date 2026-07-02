import axios from "axios";
import { url } from "../../Api";

export const personalAction =
  ({ headers }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(url + "/profile/personal", { headers });
      dispatch({
        type: "PERSONAL_API",
        payload: response.data.data,
      });
    } catch (error) {
      console.warn("profile unavailable:", error?.message);
      throw error;
    }
  };
