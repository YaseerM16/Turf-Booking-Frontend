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
        <div className="bg-yellow-100 p-6 md:p-8 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center mb-2 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
                <Image
                    src="/logo.jpeg"
                    alt="Profile"
                    className="h-16 w-16 rounded-full"
                    width={64}
                    height={64}
                />
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">{company.company?.companyname || "Company Name"}</h1>
                    <p className="text-gray-600 text-base md:text-lg">Here is your company performance summary</p>
                </div>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-base md:text-lg"
                >
                    Logout
                </button>
            )}
        </div>

    );
};

export default Header;
