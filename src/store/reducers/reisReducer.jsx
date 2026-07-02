const initialState = {
  reisData: [],
};

const reisReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REIS_DATA":
      return { ...state, reisData: action.payload };
    case "REIS_DATA_NOT":
      return { ...state, reisData: action.payload };
    default:
      return state;
  }
};

export default reisReducer;
