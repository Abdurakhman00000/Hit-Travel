export const INSURANCE_DICTIONARIES_LOADING = "INSURANCE_DICTIONARIES_LOADING";
export const INSURANCE_DICTIONARIES_SUCCESS = "INSURANCE_DICTIONARIES_SUCCESS";
export const INSURANCE_DICTIONARIES_ERROR = "INSURANCE_DICTIONARIES_ERROR";
export const INSURANCE_SET_CONTRACT = "INSURANCE_SET_CONTRACT";
export const INSURANCE_SET_PRICE = "INSURANCE_SET_PRICE";
export const INSURANCE_SET_DOCUMENT = "INSURANCE_SET_DOCUMENT";
export const INSURANCE_RESET = "INSURANCE_RESET";

export const insuranceDictionariesLoading = () => ({
  type: INSURANCE_DICTIONARIES_LOADING,
});

export const insuranceDictionariesSuccess = (payload) => ({
  type: INSURANCE_DICTIONARIES_SUCCESS,
  payload,
});

export const insuranceDictionariesError = (message) => ({
  type: INSURANCE_DICTIONARIES_ERROR,
  payload: message,
});

export const insuranceSetContract = (contract) => ({
  type: INSURANCE_SET_CONTRACT,
  payload: contract,
});

export const insuranceSetPrice = (price) => ({
  type: INSURANCE_SET_PRICE,
  payload: price,
});

export const insuranceSetDocument = (document) => ({
  type: INSURANCE_SET_DOCUMENT,
  payload: document,
});

export const insuranceReset = () => ({
  type: INSURANCE_RESET,
});
