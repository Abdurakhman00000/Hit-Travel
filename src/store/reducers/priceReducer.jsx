const initialState = {
  price: null,
};

const priceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRICE_DATA":
      return { ...state, price: action.payload };
    case "PRICE_DATA_NOT":
      return { ...state, price: action.payload };
    default:
      return state;
  }
};

export default priceReducer;
