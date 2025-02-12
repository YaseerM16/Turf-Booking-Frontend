import { axiosInstance, BACKEND_NOTIFICATION_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";



// export const getNotifications = async (id: string, type: string) => {
//     try {
//         const response = await axiosInstance.get(`${BACKEND_NOTIFICATION_URL}/get-notifications/${id}?type=${type}`)
//         return response.data
//     } catch (error) {
//         console.log("ERRor while GetMessagesAPi ::: ", error);
//         if (error instanceof AxiosError) {
//             throw new Error(error?.response?.data.message)
//         }
//     }
// }