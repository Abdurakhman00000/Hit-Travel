const initialState = {
    decor: [],
};

const decorReducer = (state = initialState, action) => {
    switch (action.type) {
        case "DECOR":
            return { ...state, decor: action.payload };
        default:
            return state;
    }
};

export default decorReducer;
