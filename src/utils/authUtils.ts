// import { store } from "@/store/store"; // Import Redux store directly
// import { logout } from "@/store/slices/UserSlice";
import Swal from "sweetalert2";
import { axiosInstance } from "./constants";
// import { axiosInstance } from "@/constants";

export const handleLogout = async () => {
    try {
        const response = await axiosInstance.get("/api/v1/user/logout");

        if (response.data.loggedOut) {
            // store.dispatch(logout()); // Dispatch Redux logout action
            localStorage.removeItem("auth"); // Clear local storage
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Error!",
                text: "You're Blocked.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
            window.location.href = "/login"; // Redirect to login
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
