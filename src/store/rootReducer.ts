import { combineReducers } from "@reduxjs/toolkit";
import { reducer as bankReducer } from "../slices/banking";
import { reducer as stockReducer } from "../slices/stocks";
import { reducer as authReducer} from '../slices/auth';

const rootReducer = combineReducers({
    banking: bankReducer,
    stocks: stockReducer,
    auth: authReducer
});

export default rootReducer;
