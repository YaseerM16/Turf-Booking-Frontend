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