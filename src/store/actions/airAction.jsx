
export const setDateNightFrom = (date) => {
  if (!(date instanceof Date)) {
    console.log(date);
  }

  return {
    type: "SET_DATE_NIGHT_FROM",
    payload: "",
  };
};

export const setDateNightTo = (date) => {
  if (!(date instanceof Date)) {
    console.log(date);
  }

  return {
    type: "SET_DATE_NIGHT_TO",
    payload: "",
  };
};

export const setRangeStart = (date) => {
  if (!(date instanceof Date)) {
    console.log(date);
  }

  return {
    type: "SET_RANGE_START",
    payload: "",
  };
};

export const setRangeEnd = (date) => {
  if (!(date instanceof Date)) {
    console.log(date);
  }

  return {
    type: "SET_RANGE_END",
    payload: "",
  };
};
