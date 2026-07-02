const initialState = {
  dataAirFilter: [],
  loading_param: false,
};

const airParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AIR_PARAMS_API":
      return { ...state, dataAirFilter: action.payload };
    case "AIR_PARAMS_API_LOADING":
      return { ...state, loading_param: action.payload };
    default:
      return state;
  }
};

export default airParamsReducer;
