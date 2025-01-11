"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import {
    FiHome,
    FiGrid,
    FiMessageSquare,
    FiBell,
    FiLogOut,
    FiCreditCard,
    FiCalendar,
} from "react-icons/fi";
import GuestNavbar from "./user-auth/GuestNavbar";
import { axiosInstance } from "@/utils/constants";
import { logout } from "@/store/slices/UserSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

const Navbar: React.FC = () => {
    const user = useAppSelector(state => state.users.user)
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const dispatch = useAppDispatch()


    const handleLogout = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get("/api/v1/user/logout");
            if (data.loggedOut) {
                setLoading(false)
                dispatch(logout())
                localStorage.removeItem('auth');
                router.replace("/login")
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to Logout.")
        }
    }

    return (
        <nav className="bg-gray-100 shadow-md">
            {user ? (<div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-4 cursor-pointer">
                    <Image
                        src="/logo.jpeg"
                        alt="Turf Booking Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md shadow-md cursor-pointer"
                        onClick={() => router.replace("/")}
                    />
                    <span className="font-bold text-2xl text-green-700 tracking-wide">
                        Turf Booking
                    </span>
                </div>

                {/* Navigation Tabs */}
                <ul className="flex items-center space-x-8 text-sm font-medium">
                    {[
                        { icon: <FiHome size={20} />, label: "Home", route: "/" },
                        { icon: <FiGrid size={20} />, label: "Turfs", route: "/turfs" },
                        { icon: <FiCreditCard size={20} />, label: "Wallet", route: "/my-wallet" },
                        { icon: <FiMessageSquare size={20} />, label: "Messages" },
                        { icon: <FiBell size={20} />, label: "Notification" },
                        { icon: <FiCalendar size={20} />, label: "MyBookings", route: "/my-bookings" },
                    ].map((item, index) => (
                        <li key={index} className="relative group" onClick={() => router.replace(item.route || "")}>
                            <span className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                {item.icon}
                                <span>{item.label}</span>
                            </span>
                            <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </li>
                    ))}
                </ul>

                {/* Account Section */}
                <div className="flex items-center space-x-6">
                    {/* Profile Icon */}
                    <Image
                        src={user.profilePicture || "/logo.jpeg"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 shadow-md transition-transform transform hover:scale-110 cursor-pointer"
                        onClick={() => router.replace("/profile")}
                    />
                    {/* Logout Button */}
                    {loading ? (
                        <Spinner />
                    ) : (

                        <button
                            className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 shadow"
                            onClick={() => handleLogout()}
                        >
                            <FiLogOut size={18} />
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </div>) : (<GuestNavbar />)}
        </nav>
    );
};

export default Navbar;