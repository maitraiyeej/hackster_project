import {apiSlice} from './apiSlice';

export const hackathonApi = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        //query to fetch all hackathons
        getHackathons: builder.query({
            query: () => '/hackathons',
            providesTags: ['Hackathon'],
        }),
    }),
});

export const {useGetHackathonsQuery} = hackathonApi;