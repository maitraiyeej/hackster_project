//this file defines the specific routes for login and register
import { apiSlice } from './apiSlice';
import { setCredentials } from '../features/auth/authSlice';

const AUTH_URL = '/auth';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error('Registration failed:', error);
                }
            },
        }),

    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
