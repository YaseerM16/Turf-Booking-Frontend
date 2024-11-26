"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Spinner";
import { logout } from "@/store/slices/UserSlice";
import { axiosInstance } from "@/utils/constants";
import { useAppDispatch } from "@/store/hooks";


type Inputs = {
    newPassword: string;
    confirmPassword: string;
};

interface QueryParams {
    email?: string;
}

const UpdatePassword: React.FC = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<string>("");
    const [queryObj, setQueryObj] = useState<QueryParams | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryObject = Object.fromEntries(searchParams.entries()); // Get query parameters
        setQueryObj(queryObject); // Set query parameters state
    }, []);

    const email = queryObj?.email

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/v1/user/auth/update-password", {
                newPassword: formData.newPassword,
                email: email
            });

            if (data?.success) {
                setLoading(false);
                dispatch(logout())
                localStorage.removeItem('auth');
                toast.success("Password changed successfully! Please Login", {
                    onClose: () => router.replace("/login")
                });

            } else {
                toast.error(data?.message || "Password change failed. Please try again.");
            }
        } catch (err) {
            console.error("PasswordChangeAPI error:", err);
            toast.error("An error occurred while changing the password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const checkPasswordStrength = (password: string) => {
        if (password.length === 0) {
            setPasswordStrength("");
        } else if (password.length < 6) {
            setPasswordStrength("Weak");
        } else if (password.match(/[A-Z]/) && password.match(/\d/) && password.match(/[@$!%*?&]/)) {
            setPasswordStrength("Strong");
        } else {
            setPasswordStrength("Medium");
        }
    };

    const newPassword = watch("newPassword");

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="flex h-screen">
                {/* Left Section */}
                <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center">
                    <div className="text-center pt-8">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="h-16 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Change Your <span className="text-green-600">Password</span>
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Password Change</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                        onChange: (e) => checkPasswordStrength(e.target.value),
                                    })}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                                )}
                                <p
                                    className={`mt-1 text-sm ${passwordStrength === "Weak"
                                        ? "text-red-500"
                                        : passwordStrength === "Medium"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                        }`}
                                >
                                    {passwordStrength && `Strength: ${passwordStrength}`}
                                </p>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your new password",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                                >
                                    Change Password
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
                    className="w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/turf-background-image.jpg')`,
                    }}
                >
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                            <img
                                src="/logo.jpeg"
                                alt="Turf Logo"
                                className="h-32 w-32 object-cover rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatePassword;