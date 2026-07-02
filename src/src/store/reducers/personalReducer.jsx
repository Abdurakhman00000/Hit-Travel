const initialState = {
  personal: [],
};

const personalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PERSONAL_API":
      return { ...state, personal: action.payload };
    default:
      return state;
  }
};

export default personalReducer;
