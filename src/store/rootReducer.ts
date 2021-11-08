import { combineReducers } from "@reduxjs/toolkit";
import { reducer as bankReducer } from "../slices/banking";
import { reducer as stockReducer } from "../slices/stocks";
import { reducer as authReducer} from '../slices/auth';
import {reducer as customAssetsReducer} from '../slices/customAssets';

const rootReducer = combineReducers({
    banking: bankReducer,
    stocks: stockReducer,
    auth: authReducer,
    customAssets: customAssetsReducer
});

export default rootReducer;
