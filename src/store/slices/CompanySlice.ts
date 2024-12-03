"use client";

// import {  }from "@reduxjs/toolkit"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { CompanyData } from "../../utils/type"

const initialState: CompanyData = {
    company: null
}

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        setCompany: (state, action: PayloadAction<CompanyData['company']>) => {
            console.log("stated company");

            state.company = action.payload
        },
        logout: (state) => {
            state.company = null;
        },
    },
});

export const { setCompany, logout } = companySlice.actions;

export default companySlice.reducer;