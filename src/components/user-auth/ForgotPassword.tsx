"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../Spinner";
import { axiosInstance } from "@/utils/constants";

type Inputs = {
    email: string;
};

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
        try {
            setLoading(true);

            const { data } = await axiosInstance.post(
                "/api/v1/user/auth/forgot-password",
                formData
            );
            console.log("respone data : ", data);


            if (data?.success) {
                setLoading(false);
                toast.success("Verification email sent successfully!", {
                    onClose: () => router.replace(`/checkmail?type=forgotpassword`),
                });
            } else {
                toast.error(data?.message || "Failed to send reset link. Try again.");
            }
        } catch (err: any) {
            console.error("ForgotPasswordAPI error:", err);
            const errorMessage =
                err.response?.data?.message || // Message from the server
                "An unexpected error occurred. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="w-1/2 bg-yellow-50 flex flex-col justify-center items-center">
                    <div className="text-center pt-8">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="h-16 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Trouble Logging In? <span className="text-green-600">We Got You</span>
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            Forgot Password
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Enter your email to receive a password reset link.
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-yellow-500"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Email is invalid",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                                >
                                    Send Reset Link
                                </button>
                            )}
                        </form>
                        <div className="mt-4 text-gray-600 text-sm">
                            <a href="/login" className="underline">
                                Back to Log In
                            </a>
                        </div>
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

export default ForgotPassword;