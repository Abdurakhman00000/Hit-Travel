const initialState = {
  dataFilter: [],
};

const paramsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PARAMS_API":
      return { ...state, dataFilter: action.payload };
    default:
      return state;
  }
};

export default paramsReducer;
