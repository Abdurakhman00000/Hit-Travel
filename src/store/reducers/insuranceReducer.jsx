import {
  INSURANCE_DICTIONARIES_ERROR,
  INSURANCE_DICTIONARIES_LOADING,
  INSURANCE_DICTIONARIES_SUCCESS,
  INSURANCE_RESET,
  INSURANCE_SET_CONTRACT,
  INSURANCE_SET_DOCUMENT,
  INSURANCE_SET_PRICE,
} from "../actions/insuranceAction";

const initialState = {
  loadingDictionaries: false,
  dictionariesError: null,
  usePurposes: [],
  travelRegions: [],
  programs: [],
  activities: [],
  contract: null,
  price: null,
  document: null,
};

const insuranceReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSURANCE_DICTIONARIES_LOADING:
      return { ...state, loadingDictionaries: true, dictionariesError: null };
    case INSURANCE_DICTIONARIES_SUCCESS:
      return {
        ...state,
        loadingDictionaries: false,
        dictionariesError: null,
        ...action.payload,
      };
    case INSURANCE_DICTIONARIES_ERROR:
      return {
        ...state,
        loadingDictionaries: false,
        dictionariesError: action.payload,
      };
    case INSURANCE_SET_CONTRACT:
      return { ...state, contract: action.payload };
    case INSURANCE_SET_PRICE:
      return { ...state, price: action.payload };
    case INSURANCE_SET_DOCUMENT:
      return { ...state, document: action.payload };
    case INSURANCE_RESET:
      return { ...initialState };
    default:
      return state;
  }
};

export default insuranceReducer;
