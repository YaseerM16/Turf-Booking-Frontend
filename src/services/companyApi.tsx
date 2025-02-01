import { BACKEND_COMPANY_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { RegisterData } from "@/components/company/register/CompanyRegister"
import { LoginData } from "@/components/company/CompanyLogin";

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

export const companyLoginApi = async (loginData: LoginData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/auth/login`, loginData);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



//////////////////// SLOT /////////////////////

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


/////////////// Chat ///////////////

export const getChatLists = async (companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-chat-lists/${companyId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error Getting ChatLIsts !:! :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


export const getChatMessages = async (roomId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-chat-messages/${roomId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error Getting ChatLIsts !:! :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const onSendMessage = async (companyId: string, userId: string, data: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/send-message/${companyId}/${userId}`, data);
        return response.data;
    } catch (error: unknown) {
        console.log("Error Getting ChatLIsts !:! :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }

};

////// notificaitions //////

export const getNotifications = async (companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-notifications/${companyId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const updateNotifications = async (data: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/update-notifications`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while upDAte NOtification ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const deleteNotification = async (roomId: string, companyId: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_COMPANY_URL}/delete-notification/${roomId}/${companyId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}