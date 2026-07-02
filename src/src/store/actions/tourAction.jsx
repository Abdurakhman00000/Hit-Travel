import axios from "axios";
import { url } from "../../Api";

export const tourAction =
  ({ headers, tour }) =>
    async (dispatch) => {
      try {
        const response = await axios.get(url + `/api/detail/tour/${tour}`, {
          headers,
        });
        dispatch({
          type: "TOUR_API",
          payload: response.data,
        });
      } catch (error) {
        console.log(error);
      }
    };

export function tourActionNot() {
  return {
    type: "TOUR_API_NOT",
    payload: [],
  };
}
