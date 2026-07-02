const initialState = {
  search: [],
  loading: false,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_API":
      return { ...state, search: action.payload };
    case "SEARCH_API_LOADING":
      return { ...state, loading: action.payload };
    case "SEARCH_API_NOT":
      return { ...state, search: action.payload, loading: false };
    default:
      return state;
  }
};

export default searchReducer;
