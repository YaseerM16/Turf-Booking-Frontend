"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { setCompany } from "@/store/slices/CompanySlice";
import { companyLoginApi } from "@/services/companyApi";


export type LoginData = {
    email: string;
    password: string;
};

const CompanyLoginForm: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>();

    const onSubmit: SubmitHandler<LoginData> = async (formData: LoginData) => {
        try {
            setLoading(true);
            // const { data } = await axiosInstance.post(
            //     "/api/v1/company/auth/login",
            //     formData
            // );
            const response = await companyLoginApi(formData)
            if (response.success) {
                const { data } = response
                if (data?.loggedIn) {
                    localStorage.setItem("companyAuth", JSON.stringify(data.company));
                    dispatch(setCompany(data.company));
                    setLoading(false);
                    toast.success("Logged In successfully!", {
                        onClose: () => router.replace("/company/dashboard")
                    });

                } else {
                    toast.error(data?.message || "Login failed. Please try again.");
                    setLoading(false);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error((err as Error).message || "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (<>
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
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center">
                <div className="text-center pt-8">
                    <Image
                        src="/logo.jpeg"
                        alt="Logo"
                        width={64} // Specify width (h-16 = 16 x 4 = 64px)
                        height={64} // Specify height (h-16 = 16 x 4 = 64px)
                        className="mx-auto mb-4"
                        priority // Optional: Ensures the image is preloaded for better performance
                    />
                    <h2 className="text-xl font-medium text-gray-800">
                        Welcome Back to <span className="text-green-600">TURF</span>
                    </h2>
                </div>

                <div className="mt-8 w-3/4">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Company Log In</h3>
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
                        <div className="text-right pb-3">
                            <a
                                href="/forgotpassword"
                                className="text-sm text-green-600 hover:underline"
                            >
                                Forgot Password?
                            </a>
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
    </>);
};

export default CompanyLoginForm;
