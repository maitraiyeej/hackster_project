//this file combines the api slice and authreducer
import { configureStore } from "@reduxjs/toolkit";
import {apiSlice} from '../services/apiSlice';
import authReducer from '../features/auth/authSlice';

//create the redux store
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth:authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true, 
});