import { parse } from "@fortawesome/fontawesome-svg-core";
import { createSlice } from "@reduxjs/toolkit";

// initialize userToken from local storage
const accessToken =
    typeof window !== "undefined" && localStorage.getItem("user") ? localStorage.getItem("token") : null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {
            username: null,
            email: null,
            token: accessToken,
            isLoggedIn: false,
        },
        pending: null,
        error: false,
    },
    reducers: {
        // logIn: (state, action) => {
        //     const {
        //         user: { username, email, token },
        //         isLoggedIn,
        //     } = action.payload.user;
        //     state.username = username;
        //     state.email = email;
        //     state.token = token;
        //     state.isLoggedIn = isLoggedIn;

        // },
        // logOut: (state, action) => {
        //     state.username = null;
        //     state.email = null;
        //     state.token = null;
        //     state.isLoggedIn = false;
        // },
        logInStart: (state) => {
            state.pending = true;
        },
        logInSuccess: (state, action) => {
            const { isLoggedIn, username, email, token } = action.payload;
            state.user = {
                username: username,
                email: email,
                token: token,
                isLoggedIn: true,
            };
            // state.user = action.payload;
            state.pending = false;
            state.error = false;
        },
        logInError: (state, action) => {
            state.error = action.payload;
            state.pending = false;
        },
        logOut: (state, action) => {
            state.user.username = null;
            state.user.email = null;
            state.user.token = null;
            state.user.isLoggedIn = false;
        },
    },
});

// export const { logIn, logOut } = authSlice.actions;
export const { logInStart, logInSuccess, logInError, logOut } = authSlice.actions;

export default authSlice.reducer;

export const currentUser = (state) => state.auth.user;
export const currentUsername = (state) => state.auth.user.username;
export const currentEmail = (state) => state.auth.user.email;
export const currentToken = (state) => state.auth.user.token;
export const isLoggedIn = (state) => state.auth.user.isLoggedIn;

// export const error = (state) => state.auth.error;
