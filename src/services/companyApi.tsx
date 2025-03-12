import { BACKEND_COMPANY_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { RegisterData } from "@/components/company/register/CompanyRegister"
import { LoginData } from "@/components/company/CompanyLogin";
import { Inputs } from "@/components/company/ForgotPassword";
import { handleLogout } from "@/utils/companyAuthUtil";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if ((error.response?.status === 403 || error.response?.status === 401) && window.location.pathname !== "/login") {
            console.log("Redirecting due to 403 error...");
            await handleLogout(); // Call the function
            window.location.href = "/company/login"; // Redirect to login
        }
        return Promise.reject(error);
    }
);


/////////////   Auth   //////////////

export const companyRegisterApi = async (registerData: RegisterData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/auth/register`, registerData);
        console.log("RESpone of companyRegisterApi in api:", response);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
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

export const companyForgotpasswordApi = async (data: Inputs) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/auth/forgot-password`, data);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpForgotPass :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const companyLogOut = async () => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/logout`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
// get("/api/v1/company/auth/verifymail", { params: { type, token, email }, })
export const companyVerifyMail = async (type: string, token: string, email: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/auth/verifymail`, { params: { type, token, email } });
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const companyUpdatePassword = async (data: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/auth/update-password`, data);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};




////    Profile    ////

export const eidtProfileDets = async (companyId: string, updates: object) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/profile/update-details/${companyId}`, updates);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};
// `/api/v1/company/profile/upload-image/${company.company?._id}`,

export const uploadProfileImg = async (companyId: string, formData: FormData) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/profile/upload-image/${companyId}`, formData);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



//////////////   DASHSBoadrd   //////////////

export const companyDashboardData = async (companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-dashboard-data/${companyId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getMonthlyRevenue = async (companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-monthly-revenue/${companyId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getRevenueByRange = async (companyId: string, fromDate: Date, toDate: Date) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-revenue-by-range/${companyId}/?fromDate=${fromDate}&toDate=${toDate}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getRevenuesOfTurf = async (companyId: string, turfId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-turf-overallRevenue/${companyId}/${turfId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpLogApi :", error);
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

export const getNotifications = async (id: string, type: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-notifications/${id}?type=${type}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const updateNotifications = async (data: object, type: string) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/update-notifications?type=${type}`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while upDAte NOtification ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const deleteNotification = async (roomId: string, companyId: string, type: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_COMPANY_URL}/delete-notification/${roomId}/${companyId}/?type=${type}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}


/////Sales Report////

export const getLastMonthRevenues = async (companyId: string, page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-lastmonth-revenue/${companyId}/?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const getRevenuesByInterval = async (companyId: string, fromDate: Date, toDate: Date, page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-revenues-by-interval/${companyId}/?fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        console.log("ERRor while get revenues by range in sales report ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}