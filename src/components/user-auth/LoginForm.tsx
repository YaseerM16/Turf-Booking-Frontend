"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { setUser } from "@/store/slices/UserSlice"
import { useAppDispatch } from "@/store/hooks";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../../FireBaseConfig"
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { loginApi, googleLoginApi } from "@/services/userApi"

export type LoginData = {
    email: string;
    password: string;
};

const LoginForm: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>();

    const onSubmit: SubmitHandler<LoginData> = async (formData: LoginData) => {
        try {
            setLoading(true);
            const { data } = await loginApi(formData)
            console.log("DTA By LoginApi : ", data);

            console.log("(VERifIResd) USer DATA of Login :", data.user?.isVerified);

            if (data?.loggedIn) {
                const user = {
                    _id: data?.user?._id,
                    name: data?.user?.name,
                    email: data?.user?.email,
                    phone: data?.user?.phone,
                    profilePicture: data?.user?.profilePicture,
                    isVerified: data.user?.isVerified,
                };
                localStorage.setItem("auth", JSON.stringify(user));
                dispatch(setUser(data.user));
                toast.success("Logged In successfully!");
                setLoading(false);
                router.replace("/");
            } else {
                toast.error(data?.message || "Login failed. Please try again.");
                setLoading(false);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.warn(error.message || "An unexpected error occurred.")
            } else {
                toast.error("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);

        }
    };

    // Google signup functionality
    const handleGoogleSignUp = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            const response = await googleLoginApi(user)

            if (response) {
                if (response.success) {
                    // const googleUser = response.data.user;
                    // console.log("GooleUser ", googleUser);
                    const { data } = response

                    const user = {
                        _id: data?.user?._id,
                        name: data?.user?.name,
                        email: data?.user?.email,
                        phone: data?.user?.phone,
                        profilePicture: data?.user?.profilePicture,
                    };
                    localStorage.setItem("auth", JSON.stringify(user));
                    setLoading(false);

                    dispatch(setUser(data.user));
                    toast.success("You were Logged successfully redirecting to home!", {
                        onClose: () => router.replace("/"),
                    });
                }
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.warn(error.message || "An unexpected error occurred.")
            } else {
                toast.error("An unknown error occurred. Please try again.");
            }
            // console.log(error)
        }
    }

    return (<>
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
        <div className="h-screen w-full sm:flex">
            {/* Left Section - Form with Dynamic Background */}
            <div
                className="relative flex flex-col justify-center items-center p-6 w-full h-screen 
               sm:w-1/2 sm:bg-green-50 bg-cover bg-center sm:bg-none 
               bg-[url('/turf-background-image.jpg')]"
            >
                {/* Overlay for better text visibility on small screens */}
                <div className="absolute inset-0 bg-black/30 sm:hidden"></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <Image
                        src="/logo.jpeg"
                        alt="Logo"
                        width={64}
                        height={64}
                        className="mx-auto mb-4"
                        priority
                    />
                    <h2 className="text-xl font-medium text-gray-800 sm:text-gray-900">
                        Welcome Back to <span className="text-green-600">TURF</span>
                    </h2>
                </div>

                {/* Form or Additional Content */}
                <div className="relative z-10 mt-8 w-3/4">
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
                        {/* Google Login Button */}
                        <div className="flex justify-center items-center mt-6 mb-6">
                            <button
                                onClick={handleGoogleSignUp}
                                type="button"
                                className="flex justify-center items-center px-4 py-2 rounded-md border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
                            >
                                <div className="w-6 h-6 mr-2 relative">
                                    <Image
                                        src="/images/glogo.jpeg"
                                        alt="Google logo"
                                        layout="fill"
                                        objectFit="contain"
                                        className="rounded-md"
                                    />
                                </div>
                                <span className="text-sm font-medium">Login with Google</span>
                            </button>
                        </div>

                    </form>
                </div>

                <footer className="mt-8 text-gray-600 text-sm flex flex-col sm:flex-row items-center sm:justify-between w-full max-w-xs sm:max-w-md">
                    <p>© 2020 TURF. All rights reserved.</p>
                    <p>
                        <a href="/terms" className="underline">
                            Terms & Conditions
                        </a>
                    </p>
                </footer>
            </div>

            {/* Right Section (Hidden on Small Screens) */}
            <div className="hidden sm:flex w-1/2 bg-cover bg-center bg-[url('/turf-background-image.jpg')]">
                <div className="flex justify-center items-center h-full w-full">
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

export default LoginForm;