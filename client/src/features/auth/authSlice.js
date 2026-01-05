//this file manages saving and deleting the user's token and data
import { createSlice } from "@reduxjs/toolkit";

//reads stored user data - when the user refreshes the page, redux state is lost
const getUserFromStorage = () => {
    try{
        const serializedUser = localStorage.getItem('user');
        if(serializedUser === null) {return {token:null, user:null};}
        const userData = JSON.parse(serializedUser);
        return {token:userData.token, user:userData};       //separates user and token

    }
    catch(e){
        return {token:null, user:null}
    }
}

//redux starts with logged in state (if exists) or logged out state 
const initialState = getUserFromStorage();

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials: (state, action ) => {
            const {token, ...userData} = action.payload;
            state.token = token;
            state.user = userData;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout:(state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('user');
        },

    },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;