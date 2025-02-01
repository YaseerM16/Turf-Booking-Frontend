"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
    FiHome,
    FiGrid,
    FiMessageSquare,
    FiBell,
    FiLogOut,
    FiCreditCard,
    FiCalendar,
} from "react-icons/fi";
// import GuestNavbar from "./user-auth/GuestNavbar";
import { axiosInstance } from "@/utils/constants";
import { logout } from "@/store/slices/UserSlice";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
// import Spinner from "./Spinner";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import io, { Socket } from "socket.io-client";
import GuestNavbar from "@/components/user-auth/GuestNavbar";
import Spinner from "@/components/Spinner";
import ChatPage from "@/components/user-component/ChatPage";


export type Notification = {
    roomId: string;
    companyId: string;
    companyname: string;
    company: {
        companyname: string;
        companyEmail: string;
        phone: string;
        profilePicture: string;
    };
    unreadCount: number;
    lastMessage: string | null;
    updatedAt: string;
    user: {
        name: string;
        email: string;
        phone: string;
        profilePicture: string;
    };
};


const Navbar: React.FC = () => {
    const pathname = usePathname();// Get router instance
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.users?.user)

    // const [notifications, setNotifications] = useState<Notification[]>([]); // Change to an array
    // const [showNotifications, setShowNotifications] = useState(false);

    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance

    useEffect(() => {
        // Load notifications from localStorage when the component mounts
        // const savedNotifications = localStorage.getItem("notifications");
        // if (savedNotifications) {
        //     setNotifications(JSON.parse(savedNotifications));
        // }

        if (!socketRef.current) {
            socketRef.current = io("http://localhost:5000");
        }

        const handleNewNotification = (message: {
            room: {
                companyId: { _id: string; companyname: string; companyemail: string; phone: string; profilePicture: string };
                userId: { name: string; email: string; phone: string; profilePicture: string };
                lastMessage: string | null;
                isReadUc: number;
                updatedAt: string;
                _id: string;
            };
            receiverId: string;
            content: string; // Add content for the last message
            timestamp: string;
        }) => {
            if (user?._id !== message.receiverId) {
                return; // Ignore notifications not meant for this user
            }

        };


        socketRef.current?.on("newNotification", handleNewNotification);

        return () => {
            socketRef.current?.off("newNotification", handleNewNotification);
        };
    }, [user?._id]); // Add `user._id` to the dependency array




    // Function to check if the current route is active
    const isActive = (route: string) => {
        return pathname!.includes(route) ? 'text-green-600' : '';
    };



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
        } finally {
            setLoading(false)
        }
    }

    // console.log("Notification ;", notifications);



    return (
        <>
            <nav className="bg-gray-100 shadow-md">
                {user ? (
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
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
                            <span className="font-bold text-2xl text-green-700 tracking-wide">Turf Booking</span>
                        </div>

                        {/* Navigation Tabs */}
                        <ul className="flex items-center space-x-8 text-sm font-medium">

                            <li key={10} className="relative group" onClick={() => router.push("/")}>
                                <span className={`flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer`}>
                                    <FiHome size={20} />
                                    <span>Home</span>
                                </span>
                                <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                            </li>
                            {[
                                { icon: <FiGrid size={20} />, label: "Turfs", route: "/turfs" },
                                { icon: <FiCreditCard size={20} />, label: "Wallet", route: "/my-wallet" },
                                { icon: <FiMessageSquare size={20} />, label: "Messages", route: "/messages" },
                                { icon: <FiCalendar size={20} />, label: "MyBookings", route: "/my-bookings" },
                            ].map((item, index) => (
                                <li key={index} className="relative group" onClick={() => router.push(item.route || "")}>
                                    <span className={`flex items-center ${isActive(item.route as string)} space-x-1 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer`}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </span>
                                    <span className="absolute left-0 right-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                                </li>
                            ))}
                            <li
                                key="notifications"
                                className="relative group"
                            >
                                <span className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                    {/* Bell Icon */}
                                    {/* Notification Badge */}
                                    <span className="relative flex items-center space-x-2 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                        <FiBell size={20} />
                                        {/* {Object.values(notifications).some((notif) => notif.unreadCount > 0) && (
                                            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center transform translate-x-2 -translate-y-2">
                                                {Object.values(notifications).reduce((count, notif) => count + notif.unreadCount, 0)}
                                            </span>
                                        )} */}
                                    </span>

                                    <span>Notifications</span>
                                </span>
                            </li>

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
                            {loading ?
                                <Spinner />
                                :
                                <button
                                    className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 shadow"
                                    onClick={() => handleLogout()}
                                >
                                    <FiLogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            }
                        </div>
                    </div>
                ) : (
                    <GuestNavbar />
                )}
            </nav>
            <Suspense fallback={<div>Loading...</div>}>
                <ChatPage navbarSocket={socketRef} />
            </Suspense >

        </>

    );
};

export default Navbar;