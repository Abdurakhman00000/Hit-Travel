import { combineReducers } from "redux";
import searchReducer from "./searchReducer";
import paramsReducer from "./paramsReducer";
import listReducer from "./listReducer";
import personalReducer from "./personalReducer";
import linkReducer from "./linkReducer";
import tourReducer from "./tourReducer";
import decorReducer from "./decorReducer";
import busReducer from "./busReducer";
import reisReducer from "./reisReducer";
import priceReducer from "./priceReducer";
import airParamsReducer from "./airParamsReducer";
import countReducer from "./countReducer";
import aviaDataReducer from "./aviaDataReduser";
import deepReducer from "./deepReducer";
import aviaDateReducer from "./aviaDateReducer";
import conditionsReducer from "./conditionsReducer";

const rootReducer = combineReducers({
  search: searchReducer,
  filter: paramsReducer,
  list: listReducer,
  personal: personalReducer,
  link: linkReducer,
  tour: tourReducer,
  decor: decorReducer,
  bus: busReducer,
  reis: reisReducer,
  price: priceReducer,
  air_params: airParamsReducer,
  count: countReducer,
  avia: aviaDataReducer,
  deep: deepReducer,
  avia_date: aviaDateReducer,
  conditions: conditionsReducer,
});

export default rootReducer;
