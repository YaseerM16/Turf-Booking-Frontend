import { axiosInstance } from "./constants";



export default {
    paymentReq: async function (data: any) {
        console.log('routikii');
        try {
            const reshash = await axiosInstance.post("/api/v1/user/payment/hashing", JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log({ reshash }, 'ooooooooooooooooooooooo');
            return reshash.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Something went wrong.");
        }
    },

    saveBooking: async function (pd: any, token: string) {
        try {

            const response = await axiosInstance.post("/api/v1/user/payment/save-booking", JSON.stringify(pd), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Send the token in the Authorization header
                },
            });

            console.log("Response by saveBooking :", response);

            return response.data;
        } catch (error: any) {
            console.log("Error While saveBookng :", error);
            throw new Error(error.response.data.message);
        }
    },
}



// async function paymentReq(data: any) {
//     console.log('routikii');
//     try {
//         const reshash = await axiosInstance.post("/payment", JSON.stringify(data), {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         console.log({ reshash }, 'ooooooooooooooooooooooo');
//         return reshash.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || "Something went wrong.");
//     }
// }

// export default paymentReq;