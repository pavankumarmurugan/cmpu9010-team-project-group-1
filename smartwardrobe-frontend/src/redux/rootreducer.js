import { combineReducers } from '@reduxjs/toolkit';
import homeReducer from './slices/HomeDataSlice';

const rootReducer = combineReducers({
    homeData: homeReducer,
});

export default rootReducer;
