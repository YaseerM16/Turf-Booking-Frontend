
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter from next/router
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast, ToastContainer } from 'react-toastify';
import { logout, setCompany } from '@/store/slices/CompanySlice';
import { axiosInstance } from '@/utils/constants';
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Spinner";
import { io, Socket } from "socket.io-client";
import Image from 'next/image';
import { FiBell } from 'react-icons/fi';
import { deleteNotification, getNotifications, updateNotifications } from '@/services/companyApi';

type NotificationUser = {
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
};

type Notification = {
    roomId: string;
    companyId: string;
    companyname: string;

    unreadUserCount: number; // Unread messages for the user
    unreadCompanyCount: number; // Unread messages for the company

    userLastMessage: string | null; // Last message from the user
    companyLastMessage: string | null; // Last message from the company

    updatedAt: string;

    user: {
        name: string;
        email: string;
        phone: string;
        profilePicture: string;
    };

    company: {
        companyname: string;
        companyEmail: string;
        phone: string;
        profilePicture: string;
    };
};

const Sidebar: React.FC = () => {
    const pathname = usePathname();// Get router instance
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const company = useAppSelector((state) => state.companies.company);

    useEffect(() => {
        const storedCompany = localStorage.getItem("companyAuth");
        if (storedCompany) {
            dispatch(setCompany(JSON.parse(storedCompany)));
        }
    }, [dispatch]);

    const socketRef = useRef<Socket | null>(null); // Use useRef to persist the socket instance

    useEffect(() => {
        // console.log("HEloe here from the useEffectszx ::");

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications(company?._id as string)
                if (response.success) {
                    const { data } = response
                    console.log("REsPonsE of DB notifY :: ", data.notifications);
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

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
                userId: { _id: string; name: string; email: string; phone: string; profilePicture: string };
                lastMessage: string | null;
                isReadCc: number;
                updatedAt: string;
                _id: string;
            };
            receiverId: string;
            content: string; // Add content for the last message
            timestamp: string;
        }) => {
            if (company?._id !== message.receiverId) {
                console.log("NOTIFY is Arised and not receiverID matched :", "companyId :", company?._id, "receiveID :", message.receiverId);

                return; // Ignore notifications not meant for this user
            }
            console.log("NEW NOtify Arised :", message);
            const { companyId, userId, isReadCc, _id } = message.room;

            const newNotification = {
                userId: userId?._id,
                roomId: _id,
                companyId: companyId._id,
                companyname: companyId.companyname,
                lastMessage: message.content,
                unreadCount: isReadCc + 1,
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

            // setNotifications((prev) => {
            //     const { companyId, userId, lastMessage, isReadCc, updatedAt, _id } = message.room;


            //     const updatedNotifications: Notifications = {
            //         ...prev,
            //         [companyId._id]: {
            //             roomId: _id,
            //             companyName: companyId.companyname,
            //             unreadCount: isReadCc,
            //             lastMessage: lastMessage || null,  // Ensure lastMessage is either string or null
            //             updatedAt,
            //             user: {
            //                 name: userId.name,
            //                 email: userId.email,
            //                 phone: userId.phone,
            //                 profilePicture: userId.profilePicture,
            //             },
            //         },
            //     };



            //     // Persist the updated notifications to localStorage
            //     localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

            //     return updatedNotifications;
            // });
        };

        socketRef.current?.on("newNotification", handleNewNotification);

        return () => {
            socketRef.current?.off("newNotification", handleNewNotification);
        };
    }, [company?._id]); // Add `user._id` to the dependency array

    const deleteNotificationFunc = async (roomId: string, userDet: NotificationUser) => {
        try {
            const response = await deleteNotification(roomId, company?._id as string)
            if (response.success) {
                console.log("RESponse by DelNotify :: ", response);
                router.push(`/company/messages?roomId=${encodeURIComponent(JSON.stringify(roomId))}&user=${encodeURIComponent(JSON.stringify(userDet))}`);
            }
        } catch (error) {
            console.log("Error While Deleting the Notification :: ", error);
        }
    }

    // console.log("Notifications :", notifications);



    const handleLogout = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/api/v1/company/logout");
            if (data.loggedOut) {
                dispatch(logout());
                localStorage.removeItem("companyAuth");
                setLoading(false);
                toast.error("You're Logged Out!", {
                    onClose: () => router.replace("/company/login"),
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to Logout.");
        }
    };

    // Function to check if the current route is active
    const isActive = (route: string) => {
        return pathname!.includes(route) ? 'bg-green-300 text-white' : 'text-gray-700 hover:bg-green-300';
    };


    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="w-1/6 bg-green-200 min-h-screen p-4">
                {/* Logo */}
                <div className="mb-6 flex flex-col items-center space-y-4">
                    <Image
                        src="/logo.jpeg"
                        alt="Turf Booking Logo"
                        width={80} // Adjust dimensions as needed
                        height={80} // Adjust dimensions as needed
                        className="rounded-lg"
                        priority // Optional, to load the image eagerly
                    />

                    <h1 className="text-2xl font-semibold text-gray-800">Turf Booking</h1>
                </div>

                {/* Sidebar Links */}
                <ul className="space-y-4">
                    <li
                        className={`font-semibold p-2 rounded ${isActive('/company/dashboard')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                        onClick={() => router.push('/company/dashboard')} // Use router.push for navigation without history
                    >
                        Dashboard
                    </li>
                    {company?.isApproved ? (
                        <>
                            <li
                                key="notifications"
                                className="font-semibold p-2 rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105 z-[9999]"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <span className="flex items-center space-x-2">
                                    <span className="relative flex items-center space-x-2">
                                        {/* Bell Icon */}
                                        <FiBell size={20} />
                                        {/* Notification Badge */}
                                        {Object.values(notifications).some((notif) => notif.unreadCompanyCount > 0) && (
                                            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center transform translate-x-2 -translate-y-2">
                                                {Object.values(notifications).reduce((count, notif) => count + notif.unreadCompanyCount, 0)}
                                            </span>
                                        )}
                                    </span>

                                    <span>Notifications</span>
                                </span>
                                {showNotifications && (
                                    <div className={`absolute pb-2 mb-4 bg-white shadow-lg rounded-md w-80 z-50 ${!showNotifications ? "hidden" : ""}`}
                                    >
                                        <div className="p-4 border-b">
                                            <h3 className="text-lg font-semibold text-black">Notifications</h3>
                                        </div>
                                        <ul className="max-h-80 overflow-auto">
                                            {Object.keys(notifications).length === 0 ? (
                                                <li className="p-4 text-gray-500 text-sm">No new notifications</li>
                                            ) : (
                                                Object.entries(notifications)
                                                    .filter(([, notificationData]) => notificationData.companyLastMessage !== null)
                                                    .map(([companyId, notificationData]) => (
                                                        <li
                                                            key={companyId}
                                                            className="p-4 border-b hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                                                            onClick={() => deleteNotificationFunc(notificationData.roomId, notificationData.user)}
                                                        >
                                                            {/* User Profile Image */}
                                                            <Image
                                                                src={notificationData.user.profilePicture || '/logo.jpeg'} // Fallback to a default image
                                                                alt={`${notificationData.user.name} Profile`}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                                width={48} // Example: Adjust as per your requirements
                                                                height={48}
                                                            />

                                                            {/* Chat Content */}
                                                            <div className="flex-1">
                                                                {/* Top Row: User Name and Timestamp */}
                                                                <div className="flex justify-between items-center">
                                                                    {/* User Name */}
                                                                    <p className="font-medium text-gray-900 text-sm">{notificationData.user.name}</p>

                                                                    {/* Timestamp */}
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(notificationData.updatedAt).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </p>
                                                                </div>

                                                                {/* Bottom Row: Last Message and Unread Count */}
                                                                <div className="flex justify-between items-center mt-1">
                                                                    {/* Last Message */}
                                                                    <p className="text-sm text-gray-600 truncate w-3/4">
                                                                        {notificationData.companyLastMessage || 'No messages yet'}
                                                                    </p>

                                                                    {/* Unread Count */}
                                                                    {notificationData.unreadCompanyCount > -1 && (
                                                                        <span className="bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                                                            {notificationData.unreadCompanyCount}
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


                            <li
                                className={`font-semibold p-2 rounded ${isActive('/turf-management')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.push('/company/turf-management')}
                            >
                                Turf Management
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/slot-management')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.push('/company/slot-management')}
                            >
                                Slot Management
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/company/profile')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.push('/company/profile')}
                            >
                                Company Profile
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/messages')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.push('/company/messages')}
                            >
                                Messages
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="text-gray-400 bg-gray-300 p-2 rounded cursor-not-allowed">Bookings</li>
                            <li className="text-gray-400 bg-gray-300 p-2 rounded cursor-not-allowed">Turf Management</li>
                            <li className="text-gray-400 bg-gray-300 p-2 rounded cursor-not-allowed">Slot Management</li>
                            <li className="text-gray-400 bg-gray-300 p-2 rounded cursor-not-allowed">Company Profile</li>
                            <li className="text-gray-400 bg-gray-300 p-2 rounded cursor-not-allowed">Messages</li>
                        </>
                    )}
                    {loading ? <Spinner /> : <li
                        onClick={handleLogout}
                        className="text-red-500 font-semibold hover:bg-red-200 p-2 rounded cursor-pointer"
                    >
                        Logout
                    </li>}

                </ul>
            </div>
        </>
    );
};

export default Sidebar;
