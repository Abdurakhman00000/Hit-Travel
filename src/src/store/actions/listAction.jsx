import axios from "axios";
import { url } from "../../Api";

export const listAction =
  ({ headers }) =>
    async (dispatch) => {
      const response = await axios.get(url + "/favorite/list", { headers });
      try {
        dispatch({
          type: "LIST_API",
          payload: response.data,
        });
      } catch (error) {
        console.log(error);
      }
    };
