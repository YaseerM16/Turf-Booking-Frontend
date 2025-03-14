import { BACKEND_ADMIN_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { SubscriptionFormData } from "@/components/admin/SubscriptionManagement/SubcriptionManagement"
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // console.error("API Error:", error.response?.data || error.message);

        if (error.response?.status === 403) {
            window.location.href = "/admin/login";
        }

        return Promise.reject(error);
    })


//// User - Management ////

// "/api/v1/admin/user-toggle-block?email=${email}&userId=${userId}"

// - Block User
export const toggleUserBlock = async (email: string, userId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/user-toggle-block/${userId}/${email}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

// - Block Company
export const toggleCompanyBlock = async (email: string, companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/company-toggle-block?email=${email}&companyId=${companyId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



//// Dashboard
export const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-dashboard-data`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getMonthlyRevenue = async () => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-monthly-revenues`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getRevenuesByRange = async (fromDate: Date, toDate: Date) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-revenues-by-range?fromDate=${fromDate}&toDate=${toDate}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

///// SALES Report //////

export const getLastMonthRevenues = async (page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-lastMonth-revenues?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getRevenuesByDateRange = async (fromDate: Date, toDate: Date, page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-revenues-by-date-range?fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in CmpRegApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

//// Subscription  //////////

export const addSubcriptionPlan = async (plan: SubscriptionFormData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_ADMIN_URL}/add-subscription-plan`, plan);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in addSubcripitonApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const getSubcriptionPlans = async (page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_ADMIN_URL}/get-subscription-plans?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in addSubcripitonApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const updateSubcriptionPlan = async (plan: SubscriptionFormData, planId: string) => {
    try {

        const response = await axiosInstance.patch(`${BACKEND_ADMIN_URL}/edit-subscription-plan/${planId}`, plan);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in addSubcripitonApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const deleteSubcriptionPlan = async (planId: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_ADMIN_URL}/delete-subscription-plan/${planId}`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in addSubcripitonApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

