const initialState = {
  link: "",
};

const linkReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LINK":
      return { ...state, link: action.payload };
    default:
      return state;
  }
};

export default linkReducer;
