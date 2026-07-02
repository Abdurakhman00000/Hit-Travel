const initialState = {
  tickets: [],
  loading: true,
};

const aviaDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AVIA_API":
      return { ...state, tickets: action.payload };
    case "AVIA_API_LOADING":
      return { ...state, loading: action.payload };
    case "AVIA_API_NOT":
      return { ...state, tickets: action.payload, loading: false };
    default:
      return state;
  }
};

export default aviaDataReducer;
