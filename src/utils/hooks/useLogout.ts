
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/UserSlice";
import { axiosInstance } from "../constants";

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logoutUser = async () => {
        try {
            const response = await axiosInstance.get("/api/v1/user/logout");

            if (response.data.loggedOut) {
                dispatch(logout()); // Clear Redux store
                localStorage.removeItem("auth"); // Remove auth details
                toast.warn("You're Logging Out ...!", {
                    onClose: () => router.replace("/"),
                });
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return logoutUser; // Return only the function
};
