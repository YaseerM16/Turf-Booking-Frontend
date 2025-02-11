import { BACKEND_COMPANY_URL } from "@/utils/constants";
import { axiosInstance } from "./companyApi";
import { AxiosError } from "axios";





// `/api/v1/company/get-slots-by-day?turfId=${turfId}&day=${day}&date=${date}`
// `/api/v1/company/get-slots-by-day?turfId=${turfId}&day=${day}&date=${date}`


export const getSlotsByDay = async (turfId: string, day: string, date: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-slots-by-day?turfId=${turfId}&day=${day}&date=${date}`);
        return response.data;
    } catch (error: unknown) {
        console.log("get Slots by Day Error !:! :", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const editDayDetails = async (turfId: string, updates: object) => {
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

export const addWorkingDays = async (turfId: string, payload: object) => {
    try {
        // `/api/v1/company/${turfId}/add-working-days`, payload`
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/${turfId}/add-working-days`, payload);
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

export const makeSlotAvailableUrl = (slotId: string, turfId: string): string => {
    return `${BACKEND_COMPANY_URL}/make-slot-available?slotId=${slotId}&turfId=${turfId}`
}

export const makeSlotUnAvailableUrl = (slotId: string, turfId: string): string => {
    return `${BACKEND_COMPANY_URL}/make-slot-unavailable?slotId=${slotId}&turfId=${turfId}`

}