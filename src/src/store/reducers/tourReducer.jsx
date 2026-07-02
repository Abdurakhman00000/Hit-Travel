const initialState = {
  tourData: [],
};

const tourReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOUR_API":
      return { ...state, tourData: action.payload };
    case "TOUR_API_NOT":
      return { ...state, tourData: action.payload };
    default:
      return state;
  }
};

export default tourReducer;
