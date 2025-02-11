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
import { getNotifications, updateNotifications, deleteNotification } from "@/services/userApi";
import { Company, Notification } from "@/utils/type"



const Navbar: React.FC = () => {
    const pathname = usePathname();// Get router instance
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.users?.user)

    const [notifications, setNotifications] = useState<Notification[]>([]); // Change to an array
    const [showNotifications, setShowNotifications] = useState(false);

    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance

    useEffect(() => {
        // Load notifications from localStorage when the component mounts
        const fetchNotifications = async () => {
            try {
                const response = await getNotifications(user?._id as string)
                if (response.success) {
                    const { data } = response
                    console.log("REsPonsE of DB notifY :: ", data.notifications);
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (user?._id) fetchNotifications();

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

            const { companyId, userId, isReadUc, _id } = message.room;
            const newNotification = {
                userId: user?._id,
                roomId: _id,
                companyId: companyId._id,
                companyname: companyId.companyname,
                lastMessage: message.content,
                unreadCount: isReadUc + 1,
                updatedAt: message.timestamp,
                user: {
                    name: userId.name,
                    email: userId.email,
                    phone: userId.phone,
                    profilePicture: userId.profilePicture,
                },
                company: {
                    companyname: companyId.companyname,
                    companyEmail: companyId.companyemail,
                    phone: companyId.phone,
                    profilePicture: companyId.profilePicture,
                },
            };

            console.log("NEWnotify :", newNotification);


            const saveNotifications = async () => {
                try {
                    const response = await updateNotifications(newNotification)
                    if (response.success) {
                        const { data } = response
                        console.log("DATA BY SaveNotified :: ", data);
                        setNotifications(data.notifications);
                    }
                } catch (error) {
                    console.log("Error while save the notification to DB :: ", error);
                }
            }

            saveNotifications()

            // setNotifications((prevNotifications) => {
            //     const { companyId, userId, lastMessage, isReadUc, updatedAt, _id } = message.room;

            //     const existingIndex = prevNotifications.findIndex((notif) => notif.companyId === companyId._id);

            //     let updatedNotifications = [...prevNotifications];

            //     if (existingIndex > -1) {
            //         // Update the existing notification
            //         updatedNotifications[existingIndex] = {
            //             ...updatedNotifications[existingIndex],
            //             unreadCount: isReadUc,
            //             lastMessage: message.content, // Ensure you use the latest message content
            //             updatedAt: message.timestamp,
            //         };
            //         // console.log("Existing updatedNotify :", upddatedNotifications);
            //     } else {
            //         // Add a new notification
            //         updatedNotifications.push({
            //             roomId: _id,
            //             companyId: companyId._id,
            //             companyname: companyId.companyname,
            //             company: {
            //                 companyname: companyId.companyname,
            //                 companyEmail: companyId.companyemail,
            //                 phone: companyId.phone,
            //                 profilePicture: companyId.profilePicture,
            //             },
            //             unreadCount: isReadUc,
            //             lastMessage: message.content, // Ensure you use the latest message content
            //             updatedAt: message.timestamp,
            //             user: {
            //                 name: userId.name,
            //                 email: userId.email,
            //                 phone: userId.phone,
            //                 profilePicture: userId.profilePicture,
            //             },
            //         });
            //     }

            //     // Sort notifications by `updatedAt` (most recent first)
            //     updatedNotifications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            //     // console.log("Updare notificaiton in the Navbar ;", updatedNotifications);

            //     // Persist to localStorage
            //     localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

            //     return updatedNotifications;
            // });
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

    // const handleSenderClick = (roomId: string, companyDet: NotificationCompany) => {

    //     console.log("Notify Msg Clicked :", roomId, companyDet);

    //     const deleteNotificationFunc = async (roomId: string, companyDet: NotificationCompany) => {
    //         try {
    //             const response = await deleteNotification(roomId,user?._id as string)
    //             if(response.success){
    //                 router.push(`/messages?roomId=${encodeURIComponent(JSON.stringify(roomId))}&company=${encodeURIComponent(JSON.stringify(companyDet))}`);
    //             }
    //         } catch (error) {
    //             console.log("Error While Deleting the Notification :: ",error);
    //         }
    //     }

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
    // };

    const deleteNotificationFunc = async (roomId: string, companyDet: Company) => {
        try {
            const response = await deleteNotification(roomId, user?._id as string)
            if (response.success) {
                console.log("RESponse by DelNotify :: ", response);
                router.push(`/messages?roomId=${encodeURIComponent(JSON.stringify(roomId))}&company=${encodeURIComponent(JSON.stringify(companyDet))}`);
            }
        } catch (error) {
            console.log("Error While Deleting the Notification :: ", error);
        }
    }


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
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <span className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                    <span className="relative flex items-center space-x-2 text-gray-700 hover:text-green-600 transition duration-200 cursor-pointer">
                                        <FiBell size={20} />
                                        {/* {Object.values(notifications).length > 0 &&
                                            Object.values(notifications).reduce((count, notif) => count + (notif.unreadCount || 0), 0) > 0 && (
                                            )} */}
                                        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center transform translate-x-2 -translate-y-2">
                                            {/* {Object.values(notifications).reduce((count, notif) => count + (notif.unreadCount || 0), 0)} */}
                                            {notifications.reduce((sum, notif) => sum + (notif.unreadUserCount || 0), 0)}
                                        </span>

                                    </span>

                                    <span>Notifications</span>
                                </span>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-80 z-50">
                                        <div className="p-4 border-b">
                                            <h3 className="text-lg font-semibold">Notifications</h3>
                                        </div>
                                        <ul className="max-h-80 overflow-auto">
                                            {notifications.length === 0 ? (
                                                <li className="p-4 text-gray-500 text-sm">No new notifications</li>
                                            ) : (
                                                notifications
                                                    .filter((notif) => notif.userLastMessage)
                                                    .map((notif) => (
                                                        <li
                                                            key={notif.roomId}
                                                            className="p-4 border-b hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                                                            onClick={() => deleteNotificationFunc(notif.roomId, notif.company)}
                                                        >
                                                            {/* Company Profile Image */}
                                                            <Image
                                                                src={notif.company.profilePicture || "/logo.jpeg"} // Fallback to a default image
                                                                alt={`${notif.companyname} Profile`}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                                width={48}
                                                                height={48}
                                                            />

                                                            {/* Chat Content */}
                                                            <div className="flex-1">
                                                                {/* Top Row: Company Name and Timestamp */}
                                                                <div className="flex justify-between items-center">
                                                                    <p className="font-medium text-gray-900 text-sm">{notif.companyname}</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(notif.updatedAt).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        })}
                                                                    </p>
                                                                </div>

                                                                {/* Bottom Row: Last Message and Unread Count */}
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <p className="text-sm text-gray-600 truncate w-3/4">
                                                                        {notif.userLastMessage || "No messages yet"}
                                                                    </p>

                                                                    {/* Unread Count */}
                                                                    {notif.unreadUserCount > -1 && (
                                                                        <span className="bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                                                            {notif.unreadUserCount}
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
        </>

    );
};

export default Navbar;