const initialState = {
    deep: [],
};

const deepReducer = (state = initialState, action) => {
    switch (action.type) {
        case "DEEP":
            return { ...state, deep: action.payload };
        default:
            return state;
    }
};

export default deepReducer;
