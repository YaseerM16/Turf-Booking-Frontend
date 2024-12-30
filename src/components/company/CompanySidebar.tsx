
'use client'
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter from next/router
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast, ToastContainer } from 'react-toastify';
import { logout, setCompany } from '@/store/slices/CompanySlice';
import { axiosInstance } from '@/utils/constants';
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Spinner";


const Sidebar: React.FC = () => {
    const pathname = usePathname();// Get router instance
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const company = useAppSelector((state) => state.companies);

    useEffect(() => {
        const storedCompany = localStorage.getItem("companyAuth");
        if (storedCompany) {
            dispatch(setCompany(JSON.parse(storedCompany)));
        }
    }, [dispatch]);
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
                    <img src="/logo.jpeg" alt="Turf Booking Logo" className="h-20 w-auto rounded-lg" />
                    <h1 className="text-2xl font-semibold text-gray-800">Turf Booking</h1>
                </div>

                {/* Sidebar Links */}
                <ul className="space-y-4">
                    <li
                        className={`font-semibold p-2 rounded ${isActive('/company/dashboard')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                        onClick={() => router.replace('/company/dashboard')} // Use router.replace for navigation without history
                    >
                        Dashboard
                    </li>
                    {company.company?.isApproved ? (
                        <>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/bookings')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.replace('/bookings')}
                            >
                                Bookings
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/turf-management')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.replace('/company/turf-management')}
                            >
                                Turf Management
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/slot-management')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.replace('/company/slot-management')}
                            >
                                Slot Management
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/company/profile')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.replace('/company/profile')}
                            >
                                Company Profile
                            </li>
                            <li
                                className={`font-semibold p-2 rounded ${isActive('/messages')} cursor-pointer transition duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:shadow-lg hover:scale-105`}
                                onClick={() => router.replace('/messages')}
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
