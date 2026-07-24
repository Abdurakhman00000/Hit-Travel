const initial = {
  suggest: [],
  hotels: [],
  searchLoading: false,
  searchError: "",
  hotelInfo: null,
  hotelPage: null,
  hotelPageLoading: false,
  hotelPageError: "",
  prebook: null,
  prebookLoading: false,
  prebookError: "",
  book: null,
  bookLoading: false,
  bookError: "",
};

const ratehawkReducer = (state = initial, action) => {
  switch (action.type) {
    case "RH_SUGGEST":
      return { ...state, suggest: action.payload };
    case "RH_SEARCH":
      return { ...state, hotels: action.payload, searchError: "" };
    case "RH_SEARCH_LOADING":
      return { ...state, searchLoading: action.payload };
    case "RH_SEARCH_ERROR":
      return { ...state, searchError: action.payload, searchLoading: false };
    case "RH_HOTEL_INFO":
      return { ...state, hotelInfo: action.payload };
    case "RH_HOTEL_PAGE":
      return { ...state, hotelPage: action.payload, hotelPageError: "" };
    case "RH_HOTEL_PAGE_LOADING":
      return { ...state, hotelPageLoading: action.payload };
    case "RH_HOTEL_PAGE_ERROR":
      return { ...state, hotelPageError: action.payload };
    case "RH_PREBOOK":
      return { ...state, prebook: action.payload, prebookError: "" };
    case "RH_PREBOOK_LOADING":
      return { ...state, prebookLoading: action.payload };
    case "RH_PREBOOK_ERROR":
      return { ...state, prebookError: action.payload };
    case "RH_BOOK":
      return { ...state, book: action.payload, bookError: "" };
    case "RH_BOOK_LOADING":
      return { ...state, bookLoading: action.payload };
    case "RH_BOOK_ERROR":
      return { ...state, bookError: action.payload };
    case "RH_CLEAR":
      return initial;
    default:
      return state;
  }
};

export default ratehawkReducer;
