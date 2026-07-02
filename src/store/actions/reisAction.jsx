export const ReisData = (data) => {
  return {
    type: "REIS_DATA",
    payload: data,
  };
};

export const ReisDataNot = () => {
  return {
    type: "REIS_DATA_NOT",
    payload: [],
  };
};
