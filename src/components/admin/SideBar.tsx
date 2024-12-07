// Sidebar.tsx
"use client"
import React, { useState } from "react";
import Link from "next/link";
import { axiosInstance } from "@/utils/constants";
import { useAppDispatch } from "@/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "../Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Spinner
useAppDispatch

const Sidebar: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const pathname = usePathname();// Get router instance

    const handleLogout = async () => {
        setLoading(true)
        try {
            const { data } = await axiosInstance.get("/api/v1/admin/logout");
            if (data.loggedOut) {
                setLoading(false)
                toast.error("You're Logged Out!", {
                    onClose: () => router.replace("/admin/login")
                })
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to Logout.")
        }
    }

    const isActive = (route: string) => {
        return pathname.includes(route) ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-green-300';
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <aside className="w-64 bg-green-300 text-white flex flex-col justify-between">
                <div className="p-6">
                    <h1 className="text-2xl text-green-900 font-bold mb-6">Turf Booking</h1>
                    <nav>
                        <ul className="space-y-4">
                            <li
                                className={`${isActive('/admin/dashboard')} px-4 py-2 rounded-md font-medium`}
                            >
                                <Link href="/admin/dashboard">Dashboard</Link>
                            </li>
                            <li
                                className={`${isActive('/admin/bookings')} px-4 py-2 rounded-md font-medium`}
                            >
                                <Link href="/admin/bookings">Bookings</Link>
                            </li>
                            <li
                                className={`${isActive('/admin/user-management')} px-4 py-2 rounded-md font-medium`}
                            >
                                <Link href="/admin/user-management">User Management</Link>
                            </li>
                            <li
                                className={`${isActive('/admin/registered-companies')} px-4 py-2 rounded-md font-medium`}
                            >
                                <Link href="/admin/registered-companies">Registered Companies</Link>
                            </li>
                            <li
                                className={`${isActive('/admin/approved-companies')} px-4 py-2 rounded-md font-medium`}
                            >
                                <Link href="/admin/approved-companies">Registered Companies</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="p-6">
                    {loading ? (<Spinner />) : (<button className="w-full bg-red-500 px-4 py-2 rounded-md font-medium hover:bg-red-600"
                        onClick={() => handleLogout()}
                    >
                        Log Out
                    </button>)}

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
