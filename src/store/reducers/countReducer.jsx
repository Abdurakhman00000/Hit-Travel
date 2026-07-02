const initialState = {
  countData: [],
};

const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COUNT":
      return { ...state, countData: action.payload };
    default:
      return state;
  }
};

export default countReducer;
