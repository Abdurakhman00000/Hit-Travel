const initialState = {
  dataList: [],
  loading: false,
  login: false,
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LIST_API":
      return { ...state, dataList: action.payload, loading: true };
    case "LOGIN":
      return { ...state, login: action.payload }
    default:
      return state;
  }
};

export default listReducer;
