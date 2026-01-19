import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (serializedUser === null) {
            return { token: null, user: null };
        }
        const userData = JSON.parse(serializedUser);
        // Ensure we return the flat user object and the token separately
        return { 
            token: userData.token, 
            user: userData // This contains name, role, etc.
        };
    } catch (e) {
        return { token: null, user: null };
    }
}

const initialState = getUserFromStorage();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            // action.payload is the whole object from your backend (including token)
            state.token = action.payload.token;
            state.user = action.payload; // Store the full object so role/name are available
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;