import { combineReducers } from "@reduxjs/toolkit";
import { reducer as bankReducer } from "../slices/banking";
import { reducer as stockReducer } from "../slices/stocks";

const rootReducer = combineReducers({
    banking: bankReducer,
    stocks: stockReducer,
});

export default rootReducer;
