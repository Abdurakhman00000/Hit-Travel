// function getTodayDate() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

const initialState = {
  dateNightFrom: "",
  dateNightTo: "",
  rangeStart: null,
  rangeEnd: null,
};

const airReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATE_NIGHT_FROM':
      return {
        ...state,
        dateNightFrom: action.payload,
      };
    case "SET_DATE_NIGHT_TO":
      return {
        ...state,
        dateNightTo: action.payload,
      };
    case "SET_RANGE_START":
      return {
        ...state,
        rangeStart: action.payload,
      };
    case "SET_RANGE_END":
      return {
        ...state,
        rangeEnd: action.payload,
      };
    default:
      return state;
  }
};

export default airReducer;
