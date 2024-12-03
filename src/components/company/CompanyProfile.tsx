'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setCompany } from '@/store/slices/CompanySlice';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/utils/constants';
import Header from './CompanyHeader';
import Sidebar from './CompanySidebar';
Sidebar

// interface CompanyProfileProps {
//     companyName: string;
//     companyDescription: string;
//     companyLogo: string;
//     handleLogout: () => void;
// }

const CompanyProfile: React.FC = () => {
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

    // Handle navigation (optional)
    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    {/* Header */}
                    <Header />
                    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <div className="flex items-center space-x-6 mb-6">
                            <img
                                src={company.company?.profilePicture || "./logo.jpeg"}
                                alt="Company Logo"
                                className="h-24 w-24 rounded-full shadow-lg border-4 border-green-500"
                            />
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-800">{company.company?.companyname}</h1>
                                <p className="text-gray-600 text-lg mt-1">{company.company?.companyname}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-gray-700">Email:</p>
                                    <p className="text-gray-600">{company.company?.companyemail}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold text-gray-700">Phone:</p>
                                    <p className="text-gray-600">{company.company?.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-6">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyProfile;
