"use client";

// import {  }from "@reduxjs/toolkit"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { AuthData } from "../../utils/type"

const initialState: AuthData = {
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = {
                _id: action.payload._id,
                email: action.payload.email,
                name: action.payload.name,
                phone: action.payload.phone,
                profilePicture: action.payload.profilePicture,
                role: action.payload.role,
                token: action.payload.token,
                isVerified: action.payload.isVerified,
                isActive: action.payload.isActive,
            };
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;