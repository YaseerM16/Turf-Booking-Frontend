import { AxiosError } from "axios";
import { axiosInstance } from "./constants";
import { SlotDetails } from "./type";

export interface PaymentData {
    txnid: string;
    amount: number;
    productinfo: string;
    name: string;
    email: string;
    phone: string;
    udf1?: string;  // Optional fields, adjust if necessary
    udf2?: string;
    udf3?: string | object[];
    udf4?: string;
    udf5?: string;
    udf6?: string;
    udf7?: string;

    slots?: SlotDetails[]; // Or whatever type slots is

}

const paymentService = {
    paymentReq: async function (data: PaymentData) {
        console.log('routikii');
        try {
            const reshash = await axiosInstance.post("/api/v1/user/payment/hashing", JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log({ reshash }, 'ooooooooooooooooooooooo');
            return reshash.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Something went wrong. while getting payment hash ");
            }
        }
    },

    saveBooking: async function (pd: PaymentData, token: string) {
        try {
            const response = await axiosInstance.post("/api/v1/user/payment/save-booking", JSON.stringify(pd), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Send the token in the Authorization header
                },
            });

            console.log("Response by saveBooking :", response);

            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log("Error While saveBookng :", error);
                throw new Error(error.response?.data.message || "Something went wrong while save the booking...!");
            }
        }
    },
}

export default paymentService;

