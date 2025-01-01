"use client";

import Spinner from "@/components/Spinner";
import { axiosInstance } from "@/utils/constants";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Location } from "@/components/OlaMapInput"
import MapInput from "@/components/OlaMapInput"
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { APIError } from "@/utils/type";

interface FormInputs {
    companyName: string;
    companyEmail: string;
    phone: number;
    password: string;
    confirmPassword: string;
    location?: { latitude: number; longitude: number };
}

const CompanyRegistration: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm<FormInputs>();
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<Location | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()


    const handleLocationCofirm = (location: Location | null, address: string | null) => {
        setShowMap(false)
        setLocation(location)
        setAddress(address || null)
        clearErrors('location')
    }

    const toggleMapView = () => {
        setShowMap(prev => !prev)
    }

    const onSubmit: SubmitHandler<FormInputs> = async (formData: FormInputs) => {
        try {
            if (!location) {
                setError("location", { type: "manual", message: "Please select a location on the map." });
                return;
            }
            setLoading(true);
            const formDataWithLocation = {
                ...formData,
                companyname: formData.companyName, // Rename 'name' to 'companyname'
                companyemail: formData.companyEmail,
                location: {
                    latitude: location.lat,
                    longitude: location.lng,
                },
                address: address
            };
            const { data } = await axiosInstance.post(
                "/api/v1/company/auth/register",
                formDataWithLocation
            );
            // Debugging line
            if (data?.success) {
                setLoading(false)
                Swal.fire({
                    icon: "success",
                    title: "Verification email sent successfully!",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.replace(`/checkmail?type=verify`);
                    }
                });
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                const apiError = err as APIError
                setLoading(false);
                toast.error(apiError?.response?.data?.error || "Something went wrong while sending Mail...!");
            }
            console.error('SignUpAPI error:', err); // Debugging line
        }
    };


    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} />
            <div className="flex h-screen">
                {/* Left Section */}
                <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center overflow-auto min-h-screen">
                    <div className="text-center pt-12 mt-5">
                        <Image
                            src="/logo.jpeg"
                            alt="Logo"
                            width={64} // Specify width (h-16 = 16 x 4 = 64px)
                            height={64} // Specify height (h-16 = 16 x 4 = 64px)
                            className="mx-auto mb-4"
                            priority // Optional: Ensures the image is preloaded for better performance
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Welcome to <span className="text-green-600">TURF</span>
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Company Registration</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Company Name */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("companyName", { required: "Company name is required." })}
                                />
                                {errors.companyName && (
                                    <p className="text-red-500 text-sm">{errors.companyName.message}</p>
                                )}
                            </div>

                            {/* Company Email */}
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Company Email"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("companyEmail", {
                                        required: "Company email is required.",
                                        pattern: { value: /^\S+@\S+$/, message: "Invalid email address." },
                                    })}
                                />
                                {errors.companyEmail && (
                                    <p className="text-red-500 text-sm">{errors.companyEmail.message}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register('phone', {
                                        required: 'Phone number is required',  // Required validation
                                        pattern: {
                                            value: /^[0-9]{10}$/,  // Regular expression to match 10 digits (adjust as needed)
                                            message: 'Invalid phone number, must be 10 digits',  // Custom error message
                                        },
                                    })}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: { value: 6, message: "Password must be at least 6 characters long." },
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("confirmPassword", {
                                        required: "Confirm Password is required.",
                                        validate: (value) =>
                                            value === watch("password") || "Passwords do not match.",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Location Selection */}
                            <div className="mb-4">
                                <MapInput onConfrimAndClose={handleLocationCofirm} mapView={showMap} toggleMapView={toggleMapView} />
                                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                            </div>

                            {/* Submit Button */}
                            {loading ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full mb-5 bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                                >
                                    Register
                                </button>
                            )}
                        </form>
                    </div>

                    <footer className="mt-8 text-gray-600 text-sm flex items-center justify-between">
                        <p>© 2020 TURF. All rights reserved.</p>
                        <p>
                            <a href="/terms" className="underline">
                                Terms & Conditions
                            </a>
                        </p>
                    </footer>
                </div>

                {/* Right Section */}
                <div
                    className="w-1/2 bg-cover bg-center bg-[url('/turf-background-image.jpg')]"
                >
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                            <Image
                                src="/logo.jpeg"
                                alt="Turf Logo"
                                width={128} // h-32 = 32 x 4 = 128px
                                height={128} // w-32 = 32 x 4 = 128px
                                className="object-cover rounded-full"
                                priority // Optional: Use if this image is critical for above-the-fold content
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CompanyRegistration;
