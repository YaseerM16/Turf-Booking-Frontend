"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useRef, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import io, { Socket } from "socket.io-client";


type NotificationUser = {
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
};

type NotificationCompany = {
    companyName: string;
    companyEmail: string;
    phone: string;
    profilePicture: string;
};

type NotificationRoom = {
    roomId: string;
    companyName: string;
    company: NotificationCompany;  // Add company here
    unreadCount: number;
    lastMessage: string | null;
    updatedAt: string;
    user: NotificationUser;
};

type Notifications = Record<string, NotificationRoom>;

const Navbar: React.FC = () => {
    const pathname = usePathname();// Get router instance
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.users?.user)

    const [notifications, setNotifications] = useState<Notifications>({});
    const [showNotifications, setShowNotifications] = useState(false);

    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance


    useEffect(() => {
        // Load notifications from localStorage when the component mounts
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }

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
        }) => {
            if (user?._id !== message.receiverId) {
                return; // Ignore notifications not meant for this user
            }

            setNotifications((prev) => {
                const { companyId, userId, lastMessage, isReadUc, updatedAt, _id } = message.room;

                const updatedNotifications: Notifications = {
                    ...prev,
                    [companyId._id]: prev[companyId._id]
                        ? {
                            ...prev[companyId._id],
                            unreadCount: isReadUc,
                            lastMessage,
                            updatedAt,
                        }
                        : {
                            roomId: _id,
                            companyName: companyId.companyname,
                            company: {  // company is properly typed now
                                companyName: companyId.companyname,
                                companyEmail: companyId.companyemail,
                                phone: companyId.phone,
                                profilePicture: companyId.profilePicture,
                            },
                            unreadCount: isReadUc,
                            lastMessage,
                            updatedAt,
                            user: {
                                name: userId.name,
                                email: userId.email,
                                phone: userId.phone,
                                profilePicture: userId.profilePicture,
                            },
                        },
                };

                // Persist the updated notifications to localStorage
                localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

                return updatedNotifications;
            });
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

    const handleSenderClick = (roomId: string, companyDet: NotificationCompany) => {

        console.log("Notify Msg Clicked :", roomId, companyDet);

        // setNotifications((prev) => {
        //     const updatedSender = {
        //         ...prev[senderId],
        //         unreadCount: 0,
        //     };

        //     return {
        //         ...prev,
        //         [senderId]: updatedSender,
        //     };
        // });
        // "?slots=${encodeURIComponent(JSON.stringify(BookedData?.selectedSlots))}"
        router.push(`/messages?roomId=${encodeURIComponent(JSON.stringify(roomId))}`);
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

    console.log("Notification ;", notifications);



    return (
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
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <span className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                <FiBell size={20} />
                                {Object.values(notifications).some((notif) => notif.unreadCount > 0) && (
                                    <span className="mb-4 absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                                        {Object.values(notifications)
                                            .reduce((count, notif) => count + notif.unreadCount, 0)}
                                    </span>
                                )}
                                <span>Notifications</span>
                            </span>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-80 z-50">
                                    <div className="p-4 border-b">
                                        <h3 className="text-lg font-semibold">Notifications</h3>
                                    </div>
                                    <ul className="max-h-80 overflow-auto">
                                        {Object.keys(notifications).length === 0 ? (
                                            <li className="p-4 text-gray-500 text-sm">No new notifications</li>
                                        ) : (
                                            Object.entries(notifications).map(([companyId, companyData]) => (
                                                <li
                                                    key={companyId}
                                                    className="p-4 border-b hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                                                    onClick={() => handleSenderClick(companyData.roomId, companyData.company)} // Pass roomId here
                                                >
                                                    {/* Company Profile Image */}
                                                    <Image
                                                        src={companyData.user.profilePicture || '/logo.jpeg'} // Fallback to a default image
                                                        alt={`${companyData.companyName} Profile`}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        width={48} // Example: Adjust as per your requirements
                                                        height={48}
                                                    />

                                                    {/* Chat Content */}
                                                    <div className="flex-1">
                                                        {/* Top Row: Company Name and Timestamp */}
                                                        <div className="flex justify-between items-center">
                                                            {/* Company Name */}
                                                            <p className="font-medium text-gray-900 text-sm">{companyData.companyName}</p>

                                                            {/* Timestamp */}
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(companyData.updatedAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>

                                                        {/* Bottom Row: Last Message and Unread Count */}
                                                        <div className="flex justify-between items-center mt-1">
                                                            {/* Last Message */}
                                                            <p className="text-sm text-gray-600 truncate w-3/4">
                                                                {companyData.lastMessage || 'No messages yet'}
                                                            </p>

                                                            {/* Unread Count */}
                                                            {companyData.unreadCount > 0 && (
                                                                <span className="bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                                                    {companyData.unreadCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}

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
    );
};

export default Navbar;