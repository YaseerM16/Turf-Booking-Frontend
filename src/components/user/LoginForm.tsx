"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { axiosInstance } from "@/utils/constants";

type Inputs = {
    email: string;
    password: string;
};

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post(
                "/api/v1/user/auth/login",
                formData
            );

            if (data?.success) {
                const user = {
                    _id: data?.user?._id,
                    name: data?.user?.name,
                    email: data?.user?.email,
                    phone: data?.user?.phone,
                    profilePicture: data?.user?.profilePicture,
                };
                localStorage.setItem("auth", JSON.stringify(user));
                localStorage.setItem("token", JSON.stringify(data?.token));
                setLoading(false);
                router.replace("/dashboard");
            } else {
                toast.error(data?.message || "Login failed. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error("LoginAPI error:", err);
            toast.error("An error occurred during login. Please try again.");
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
                <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center">
                    <div className="text-center pt-8">
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            className="h-16 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Welcome Back to <span className="text-green-600">TURF</span>
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Log In</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Email is invalid",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                                >
                                    Log In
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

export default LoginForm;
