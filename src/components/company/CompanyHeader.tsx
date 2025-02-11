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
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to Logout.");
        }
    };

    return (
        <div className="bg-yellow-100 p-8 rounded-lg shadow-md flex justify-between items-center mb-2">
            <div className="flex items-center space-x-6">
                <Image
                    src="/logo.jpeg"
                    alt="Profile"
                    className="h-16 w-16 rounded-full"
                    width={64} // Adjust based on your desired dimensions
                    height={64} // Adjust based on your desired dimensions
                />
                <div>
                    <h1 className="text-3xl font-semibold">{company.company?.companyname || "Company Name"}</h1>
                    <p className="text-gray-600 text-lg">Here is your company performance summary</p>
                </div>
            </div>
            {loading ? <Spinner /> : <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium text-lg"
            >
                Logout
            </button>}

        </div>
    );
};

export default Header;
