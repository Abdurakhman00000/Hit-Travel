const initialState = {
    bus: [],
};

const busReducer = (state = initialState, action) => {
    switch (action.type) {
        case "BUS":
            return { ...state, bus: action.payload };
        default:
            return state;
    }
};

export default busReducer;
