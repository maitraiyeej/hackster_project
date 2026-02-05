//this file handles all API communicatilns and automatically injects JWT
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl:`${BASE_URL}/api`,          //all api requests start from this base url

  //runs before every api request
  prepareHeaders: (headers, {getState}) => {
    const token = getState().auth.token;
    if(token){
      headers.set('Authorization', `Bearer ${token}`);      //automatically attach jwt to every api request
    }
    return headers;
  }
})

//connects base query logic
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Hackathon', 'Team'],
  endpoints:(builder) => ({}),
});