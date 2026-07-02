export const PriceData = (data) => {
  return {
    type: "PRICE_DATA",
    payload: data,
  };
};

export const PriceDataNot = () => {
  return {
    type: "PRICE_DATA_NOT",
    payload: null,
  };
};
