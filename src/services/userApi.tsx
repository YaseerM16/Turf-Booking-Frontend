import { SERVER_USER_URL } from "@/utils/constants";
import axios from "axios";

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


// const { data } = await axiosInstance.post(
//     "/api/v1/user/auth/signup",
//     // formData
// );

export const signupApi = async (reqBody: SignupRequestBody) => {
    try {
        const response = await axiosInstance.post(`${SERVER_USER_URL}/signup`, reqBody);
        return response.data;
    } catch (error: unknown) {
        console.log(error, "from api")
        // throw handleAxiosError(error)
    }
};