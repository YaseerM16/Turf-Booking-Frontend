import { BACKEND_USER_URL } from "@/utils/constants";
import axios, { AxiosError } from "axios";
import { SignupData } from "@/components/user-auth/Register"
import { LoginData } from "@/components/user-auth/LoginForm"
import { SlotDetails, SubscriptionPlan, User } from "@/utils/type";
import { PaymentData } from "@/utils/PayUApiCalls";
import { handleLogout } from "@/utils/authUtils"; // Import function


export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
    headers: {
        "Cache-Control": "no-store",  // Prevents caching
        "Pragma": "no-cache",
        "Expires": "0",
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if ((error.response?.status === 403 || error.response?.status === 401) && window.location.pathname !== "/login") {
            console.log("Redirecting due to 403 error...");
            await handleLogout(); // Call the function
        }
        return Promise.reject(error);
    }
);

// export const handle403Error = async () => {
//     try {
//         // toast.error("Unauthorized access! Logging out...");
//         const dispatch = useAppDispatch();
//         const router = useRouter();

//         const response = await axiosInstance.get("/api/v1/user/logout");

//         if (response.data.loggedOut) {
//             dispatch(logout());
//             localStorage.removeItem("auth");

//             // toast.warn("You're Logging Out ...!", {
//             //     onClose: () => router.replace("/"),
//             // });
//             Swal.fire({
//                 position: "top-end",
//                 icon: "error",
//                 title: "Error!",
//                 text: "You're Blocked.",
//                 showConfirmButton: true,
//                 confirmButtonText: "OK",
//                 timer: 3000,
//                 toast: true,
//             });
//         }
//     } catch (error) {
//         console.error("Error during logout:", error);
//     }
// };




/////////////   Auth   //////////////

export const signupApi = async (signupData: SignupData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/signup`, signupData);
        console.log("Signup REs in Api :-> ", response.data);
        return response.data;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const googleSignupApi = async (signupData: unknown) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/google-sign-up`, signupData);
        return response.data;
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
        console.log("Respos nsdr by LoginApi ", response);

        return response.data;
    } catch (error: unknown) {
        console.log("ERRpor by LoginApi ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const googleLoginApi = async (loginData: unknown) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/auth/google-login`, loginData);
        return response.data
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
// "/get-top-turfs"
export const getTopTurfs = async () => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-top-turfs`);
        return response.data
    } catch (error: unknown) {
        console.log("from TOP turfs api Call <-:", error)
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
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/profile/update-details/${userId}`, updatedUser);
        console.log("RTeponde by UpdateDetails ::: ", response);

        return response.data;
    } catch (error: unknown) {
        console.log("ERORer by tre updarte Pro Dets :", error);

        if (error instanceof AxiosError) {
            throw error
        }
    }
};

export const uploadProfileImageApi = async (userId: string, formData: FormData) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/profile/upload-image/${userId}`, formData);
        console.log("Res in profileImgApi uploadd :: ", response);
        return response.data;
    } catch (error: unknown) {
        console.log("ERror in profileImgApi uploadd :: ", error);

        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


export const getPreSignedURL = async (files: object[]) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/get-preSignedUrl`, files);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

//////////////// SUBSCRIPTION  //////////////////////

export const subscribeByWalletPay = async (userId: string, plan: SubscriptionPlan) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/subscribe-to-plan/${userId}/?paymentMethod=wallet`, plan);
        return response.data;
    } catch (error: unknown) {
        // console.log(error, "from user subscribe By wallet api Call <-:")
        if (error instanceof AxiosError) {
            if (error && error.response?.status === 403) {
                throw new Error(error.response?.data?.message + " try Login")
            } else if (error.response?.status === 409) {
                throw new Error(error.response.data.message)
            } else {
                throw new Error(error?.response?.data.message)
            }
        }
    }
};

// "/subscription/payment/hash"
export const getSubscriptPaymentHash = async (data: PaymentData) => {
    // console.log('routikii');
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/subscription/payment/hash`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
            },
        });
        // console.log({ response }, 'ooooooooooooooooooooooo');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Something went wrong. while getting payment hash ");
        }
    }
}

export const subscribeByPayU = async (userId: string, plan: SubscriptionPlan, accessToken: string) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/subscribe-to-plan/${userId}/?paymentMethod=payu`, plan, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // Send the token in the Authorization header
            },
        });
        return response.data;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
        if (error instanceof AxiosError) {
            if (error && error.response?.status === 403) {
                throw new Error(error.response?.data?.message + " try Login")
            } else if (error.response?.status === 409) {
                throw new Error(error.response.data.message)
            } else {
                throw new Error(error?.response?.data.message)
            }
        }
    }
};
// "/check-for-subscription/:userId"

export const checkForSubscription = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/check-for-subscription/${userId}`);
        return response.data;
    } catch (error: unknown) {
        console.log(error, "from user signUp api Call <-:")
        if (error instanceof AxiosError) {
            if (error && error.response?.status === 403) {
                throw new Error(error.response?.data?.message + " try Login")
            } else if (error.response?.status === 409) {
                throw new Error(error.response.data.message)
            } else {
                throw new Error(error?.response?.data.message)
            }
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

export const cancelTheSlot = async (userId: string, slotId: string, bookingId: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_USER_URL}/booking/cancel/${userId}/${slotId}/${bookingId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};



////////////////   Bookings   /////////////////

export const getBookingsApi = async (userId: string, page: number, limit: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/my-booking?userId=${userId}&page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

// "/check-slots-availability"
export const checkSlotAvailability = async (slots: SlotDetails[]) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/check-slots-availability`, slots);
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


///////////// Wallet ///////////////

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

export const getWalletBalanceApi = async (userId: string, grandTotal: number) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/wallet/check-balance/${userId}?grandTotal=${grandTotal}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};

export const bookSlotsByWalletApi = async (userId: string, bookingDets: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/book-slots-by-wallet/${userId}`, bookingDets);
        return response.data;
    } catch (error: unknown) {
        console.log("ERRor while BookByWallet ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};


///////////////// Chat ///////////////////

export const createChatRoom = async (userId: string, companyId: string) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/create-chat-room/${userId}/${companyId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while CreateChatRoom ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const onSendMessage = async (userId: string, companyId: string, data: object) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/send-message/${userId}/${companyId}`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while SendMessageAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const onGetMessages = async (roomId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-messages/${roomId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const getChats = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-chats/${userId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const messageDeleteForEveryone = async (messageId: string) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/delete-for-everyone/${messageId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const messageDeleteForMe = async (messageId: string) => {
    try {
        const response = await axiosInstance.patch(`${BACKEND_USER_URL}/delete-for-me/${messageId}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

////// notificaitions //////

export const getNotifications = async (id: string, type: string) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-notifications/${id}?type=${type}`)
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
        const response = await axiosInstance.post(`${BACKEND_USER_URL}/update-notifications?type=${type}`, data)
        return response.data
    } catch (error) {
        console.log("ERRor while upDAte NOtification ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}

export const deleteNotification = async (roomId: string, userId: string, type: string) => {
    try {
        const response = await axiosInstance.delete(`${BACKEND_USER_URL}/delete-notification/${roomId}/${userId}/?type=${type}`)
        return response.data
    } catch (error) {
        console.log("ERRor while GetMessagesAPi ::: ", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
}



//// SUBcription ////

export const getSubcriptionPlans = async () => {
    try {
        const response = await axiosInstance.get(`${BACKEND_USER_URL}/get-subscription-plans`);
        return response.data;
    } catch (error: unknown) {
        console.log("Error in addSubcripitonApi error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
    }
};