import { BACKEND_USER_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { SignupData } from "@/components/user-auth/Register"
import { LoginData } from "@/components/user-auth/LoginForm"
import { User } from "@/utils/type";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});


/////////////   Auth   //////////////

export const signupApi = async (signupData: SignupData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/signup`, signupData);
        return response.data;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
    }
};

export const googleSignupApi = async (signupData: unknown) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/google-sign-up`, signupData);
        return response;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
        if (error instanceof AxiosError) {
            if (error && error.response?.status === 403) {
                throw new Error(error.response?.data?.message + " try Login")
            } else if (error.response?.status === 409) {
                throw new Error(error.response.data.message)
            }
        }
    }
};

export const loginApi = async (loginData: LoginData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/login`, loginData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const googleLoginApi = async (loginData: unknown) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/google-login`, loginData);
        return response;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
        if (error instanceof AxiosError) {
            if (error && error.response?.status === 403) {
                throw new Error(error.response?.data?.message + " try Signup")
            } else if (error.response?.status === 409) {
                throw new Error(error.response.data.message)
            }
        }
    }
};

export const updateProfileDetsApi = async (userId: string, updatedUser: User) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/profile/update-details/${userId}`, JSON.stringify(updatedUser));
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const uploadProfileImageApi = async (userId: string, formData: FormData) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/profile/upload-image/${userId}`, formData);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

//////////////  Turf  ///////////////

export const getTurfsApi = async (queryObj: unknown) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-turfs?${queryObj}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getTurfDetailsApi = async (turfId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-turf-details/${turfId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


////////////////   Slots   /////////////////

export const getSlotsByDayApi = async (turfId: string, day: string, date: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-slots-by-day?turfId=${turfId}&day=${day}&date=${date}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const cancelTheSlot = async (userId: string, slotId: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_USER_URL}/booking/cancel/${userId}/${slotId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



////////////////   Bookings   /////////////////

export const getBookingsApi = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/my-booking?userId=${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


///////////// Verification //////////////

export const getVerificationMail = async (userId: string) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/get-verification-mail/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


///////////// Wallet /////////

export const getWalletApi = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/my-wallet/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};