const initialState = {
  avia_date: "",
  start: "",
};

const aviaDateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AVIA_DATE":
      return { ...state, avia_date: action.payload };
    case "AVIA_START":
      return { ...state, start: action.payload };
    default:
      return state;
  }
};

export default aviaDateReducer;
