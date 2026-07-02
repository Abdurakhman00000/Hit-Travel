const initialState = {
  conditions: [],
};

const conditionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONDITIONS":
      return { ...state, conditions: action.payload };
    default:
      return state;
  }
};

export default conditionsReducer;
