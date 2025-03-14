"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setCompany } from '@/store/slices/CompanySlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';
import Image from 'next/image';
import { companyLogOut } from '@/services/companyApi';

const Header: React.FC = () => {
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
            // const { data } = await axiosInstance.get("/api/v1/company/logout");
            const response = await companyLogOut()
            if (response?.success) {
                const { data } = response
                if (data.loggedOut) {
                    dispatch(logout());
                    localStorage.removeItem("companyAuth");
                    setLoading(false);
                    toast.error("You're Logged Out!", {
                        onClose: () => router.replace("/company/login"),
                    });
                }
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || "Failed to Logout.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="bg-yellow-100 p-6 md:p-8 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center mb-4 space-y-6 md:space-y-0">
            {/* Profile & Company Info */}
            <div className="flex flex-col md:flex-row items-center md:space-x-6 text-center md:text-left">
                <Image
                    src="/logo.jpeg"
                    alt="Profile"
                    className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover"
                    width={96}
                    height={96}
                />
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold">{company.company?.companyname || "Company Name"}</h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Here is your company performance summary
                    </p>
                </div>
            </div>

            {/* Logout Button */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
                {loading ? (
                    <Spinner />
                ) : (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 md:px-6 md:py-3 rounded-lg font-medium text-sm md:text-base transition duration-300"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );

};

export default Header;
