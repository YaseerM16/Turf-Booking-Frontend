"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useState } from 'react'
import EditProfileModal from './EditProfileModal';
import { useRouter } from "next/navigation";
import { User } from '@/utils/type';
import { axiosInstance } from '@/utils/constants';
import { logout, setUser } from '@/store/slices/UserSlice';
import Spinner from './Spinner';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';
import { AxiosError } from 'axios';

const ProfileComponent: React.FC = () => {
    const user = useAppSelector(state => state.users.user)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEditProfile = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    const handleSubmit = async (updatedUser: User) => {
        try {
            setLoading(true)
            const response = await axiosInstance.patch(
                `/api/v1/user/profile/update-details/${user?._id}`,
                JSON.stringify(updatedUser),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            console.log("Respon of update-profile :", response.data);


            if (response.data.success) {
                handleCloseModal()
                toast.success("Profile details updated successfully!");
                localStorage.setItem("auth", JSON.stringify(response.data.user));
                dispatch(setUser(response.data.user));
                setLoading(false)
            } else if (response.data.refreshTokenExpired) {
                setLoading(false)
                const response = await axiosInstance.get("/api/v1/user/logout");
                if (response.data.loggedOut) {
                    dispatch(logout())
                    localStorage.removeItem('auth');
                    router.replace("/")
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.status === 403) {
                    toast.error(`${error?.response?.data.message}` || "Something went wrong during update profile")
                    const response = await axiosInstance.get("/api/v1/user/logout");
                    if (response.data.loggedOut) {
                        dispatch(logout())
                        localStorage.removeItem('auth');
                        setLoading(false)
                        toast.warn("you're Logging Out ...!", { onClose: () => router.replace("/") })
                    }
                } else {
                    console.log("Error While Updating Details :", error);
                }
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
                const response = await axiosInstance.patch(
                    `/api/v1/user/profile/upload-image/${user?._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.success) {
                    toast.success("Profile picture updated successfully!");
                    localStorage.setItem("auth", JSON.stringify(response.data.user));
                    dispatch(setUser(response.data.user));
                    setLoading(false)
                }

            } catch (error) {
                console.error("Error updating profile image:", error);
                toast.error("Failed to update profile image.")
            }
        }
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
            <div className="flex items-center justify-center bg-gradient-to-b from-green-200 to-yellow-100 p-10">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-5xl">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-extrabold text-green-700">Your Turf Booking Profile</h1>
                        <p className="text-sm text-gray-600">Manage your details and find the perfect turf for your next game.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-10">
                        {/* Profile Image Section */}
                        <div className="lg:w-1/3 text-center relative group">
                            <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-green-500 shadow-lg overflow-hidden">
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Image
                                        src={user?.profilePicture ? user.profilePicture : "/logo.jpeg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        width={200} // Adjust the width based on your layout
                                        height={200} // Adjust the height based on your layout
                                        placeholder="blur" // Optional: adds a blur effect while loading
                                        blurDataURL="/logo.jpeg" // Optional: placeholder for the blur effect
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

                        {/* Details Section */}
                        <div className="lg:w-2/3 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Full Name */}
                                <div className="text-center p-4 bg-green-50 rounded-lg shadow-md border border-green-300">
                                    <label className="block text-sm font-bold text-green-800 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.name || ""}
                                        className="w-full px-4 py-2 text-center bg-white border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                                        readOnly
                                    />
                                </div>
                                {/* Email */}
                                <div className="text-center p-4 bg-green-50 rounded-lg shadow-md border border-green-300">
                                    <label className="block text-sm font-bold text-green-800 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        className="w-full px-4 py-2 text-center bg-gray-100 text-gray-600 border border-gray-300 rounded-md shadow focus:outline-none cursor-not-allowed"
                                        readOnly
                                    />
                                </div>

                                {/* Phone */}
                                <div className="text-center p-4 bg-green-50 rounded-lg shadow-md border border-green-300">
                                    <label className="block text-sm font-bold text-green-800 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.phone || "Not Provided"}
                                        className="w-full px-4 py-2 text-center bg-white border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                                        readOnly
                                    />
                                </div>
                                {/* Password */}
                                <div className="text-center p-4 bg-green-50 rounded-lg shadow-md border border-green-300 flex flex-col items-center justify-center">
                                    <label className="block text-sm font-bold text-green-800 mb-2">
                                        Password
                                    </label>
                                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Edit Profile Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </button>
                    </div>
                    {/* Edit Profile Modal (if applicable) */}
                    <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} loading={loading} />
                </div>
            </div>
        </>

    )
}

export default ProfileComponent