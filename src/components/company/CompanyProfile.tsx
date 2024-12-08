'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, setCompany } from '@/store/slices/CompanySlice';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/utils/constants';
import Header from './CompanyHeader';
import Sidebar from './CompanySidebar';
import Spinner from '../Spinner';
import { Company } from '@/utils/type';
import EditProfileModal from './EditProfileModal';
EditProfileModal


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
    const [isModalOpen, setModalOpen] = useState(false);

    const company = useAppSelector((state) => state.companies);

    useEffect(() => {
        const storedCompany = localStorage.getItem("companyAuth");
        if (storedCompany) {
            dispatch(setCompany(JSON.parse(storedCompany)));
        }
    }, [dispatch]);

    const handleEditProfile = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    const handleSubmit = async (updatedCompany: Company) => {
        try {
            setLoading(true)
            console.log("company ID :", company.company?._id);

            const { data } = await axiosInstance.patch(
                `/api/v1/company/profile/update-details/${company.company?._id}`,
                JSON.stringify(updatedCompany),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            console.log("Respon of update-profile :", data);


            if (data?.success) {
                handleCloseModal()
                toast.success("Profile details updated successfully!");
                localStorage.setItem("companyAuth", JSON.stringify(data?.company));
                dispatch(setCompany(data?.company));
                setLoading(false)
            } else if (data?.refreshTokenExpired) {
                setLoading(false)
                const response: any = await axiosInstance.get("/api/v1/user/logout");
                if (response.data.loggedOut) {
                    dispatch(logout())
                    localStorage.removeItem('auth');
                    router.replace("/")
                }
            }
        } catch (error: any) {
            if (error.status === 403) {
                toast.error(`${error.response.data.message}`)
                const response: any = await axiosInstance.get("/api/v1/company/logout");
                if (response.data.loggedOut) {
                    dispatch(logout())
                    localStorage.removeItem('companyAuth');
                    setLoading(false)
                    toast.warn("you're Logging Out ...!", { onClose: () => router.replace("/company/login") })
                }
            } else {
                console.log("Error While Updating Details :", error);
            }
        }
    };

    const handleFileChangeAndUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("profileImage", file);

            try {
                setLoading(true)
                const { data } = await axiosInstance.patch(
                    `/api/v1/company/profile/upload-image/${company.company?._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (data.success) {
                    toast.success("Profile picture updated successfully!");
                    localStorage.setItem("companyAuth", JSON.stringify(data.company));
                    dispatch(setCompany(data.company));
                    setLoading(false)
                }

            } catch (error) {
                console.error("Error updating profile image:", error);
                toast.error("Failed to update profile image.")
            }
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
                            {/* Profile Image Section */}
                            <div className="lg:w-1/3 text-center relative group">
                                <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-green-500 shadow-lg overflow-hidden">
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        <img
                                            src={company?.company?.profilePicture ? company?.company?.profilePicture : "/logo.jpeg"}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    )}
                                    <label
                                        htmlFor="profileImage"
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                        title="Change Profile Picture"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-10 h-10 text-white"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5L12 12m0 0l-4.5-4.5m4.5 4.5v9" />
                                        </svg>
                                    </label>
                                    <input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChangeAndUpload}
                                        className="hidden"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-gray-600">Click the image to change it.</p>
                            </div>
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
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </button>
                        </div>
                        <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} loading={loading} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyProfile;
