import { BACKEND_COMPANY_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { RegisterData } from "@/components/company/register/CompanyRegister"

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


/////////////   Auth   //////////////

export const companyRegisterApi = async (registerData: RegisterData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/auth/register`, registerData);
        return response.data;
    } catch (error: unknown) {
        // console.log("Error in CmpRegApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
export const getDetailsOfDayApi = async (turfId: string, day: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-details-by-day/${turfId}/${day}`);
        return response.data;
    } catch (error: unknown) {
        // console.log("Error in CmpRegApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



//////////////////// SLOT //////////////////

// /edit-day-details/: turfId

export const editWorkingDayDetails = async (turfId: string, updates: object) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/edit-day-details/${turfId}`, updates);
        return response.data;
    } catch (error: unknown) {
        console.log("Edit WordJay Error !:! :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};