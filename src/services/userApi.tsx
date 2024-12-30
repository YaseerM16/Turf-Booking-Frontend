import { SERVER_USER_URL } from "@/utils/constants";
import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOST
SERVER_USER_URL
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


const { data } = await axiosInstance.post(
    "/api/v1/user/auth/signup",
    // formData
);

export const signupApi = async (reqBody: Record<string, any>) => {
    try {
        const response = await axiosInstance.post(`${SERVER_USER_URL}/signup`, reqBody);
        return response.data;
    } catch (error: any) {
        console.log(error, "from api")
        // throw handleAxiosError(error)
    }
};