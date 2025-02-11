"/api/v1/company/get-turfs?companyId=${companyId}"

import { BACKEND_COMPANY_URL } from "@/utils/constants";
import { axiosInstance } from "./companyApi";
import { AxiosError } from "axios";

export const registerTurf = async (data: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_COMPANY_URL}/register-turf`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while Get the turfs ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const getTurfs = async (companyId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/get-turfs?companyId=${companyId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while Get the turfs ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const blockTurf = async (turfId: string) => {
    try {
        // `/api/v1/company/block-turf?turfId=${turfId}`
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/block-turf?turfId=${turfId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while Block the Turf ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const unbBlockTurf = async (turfId: string) => {
    try {
        // `/api/v1/company/Un-block-turf?turfId=${turfId}`
        const response = await axiosInstance.patch(`${BACKEND_COMPANY_URL}/Un-block-turf?turfId=${turfId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while UnBlock the Turf ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const deleteTurfImage = async (turfId: string, index: number) => {
    try {
        // ("/api/v1/company/delete-turf-image", { data: formData })
        const response = await axiosInstance.delete(`${BACKEND_COMPANY_URL}/delete-turf-image/${turfId}/${index}`)
        return response.data
    } catch (error) {
        console.log("ERRor while Delete Turf Image ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const editTurf = async (data: object) => {
    try {
        // ("/api/v1/company/delete-turf-image", { data: formData })
        const response = await axiosInstance.put(`${BACKEND_COMPANY_URL}/edit-turf`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while Edit the Turf ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

