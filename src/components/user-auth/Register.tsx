
"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../../FireBaseConfig"
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/UserSlice";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { APIError } from "@/utils/type";
import { signupApi, googleSignupApi } from "../../services/userApi"


export type SignupData = {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

const Register: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        watch,
    } = useForm<SignupData>({ mode: "onChange" });
    const [passwordStrength, setPasswordStrength] = useState<string>("");
    const password = watch('password', '');
    const checkPasswordStrength = (password: string) => {
        if (!password) return ""; // No input, no strength
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Strong: 8+ chars, uppercase, lowercase, digit, special char
        const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/; // Medium: 6+ chars, uppercase, lowercase, digit

        if (strongRegex.test(password)) {
            return "Strong"; // Check for strong first
        } else if (mediumRegex.test(password)) {
            return "Medium"; // Check for medium next
        }
        return "Weak"; // Default to weak
    };
    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    const onSubmit: SubmitHandler<SignupData> = async (formData: SignupData) => {
        try {
            setLoading(true);

            const data = await signupApi(formData)
            console.log("SignUpAPI result:", data); // Debugging line
            if (data?.success) {
                setLoading(false);
                toast.success("Verification email sent successfully!", {
                    onClose: () => router.replace(`/checkmail?type=verify`),
                });
            }
        } catch (err: unknown) {
            console.log("Error While Signup :", err);
            const apiError = err as APIError
            console.error('SignUpAPI error:', err); // Debugging line
            setLoading(false);
            toast.error(`${apiError?.response?.data?.error}`);
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
            const response = await googleSignupApi(user)

            if (response) {
                if (response.success) {
                    const { data } = response
                    const user = {
                        _id: data?.user?._id,
                        name: data?.user?.name,
                        email: data?.user?.email,
                        phone: data?.user?.phone,
                        profilePicture: data?.user?.profilePicture,
                        isVerified: data.user?.isVerified,
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
        }
    }



    return (<>
        <ToastContainer
            position="top-center"
            autoClose={2500}
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
                <div className="mt-10 z-10 text-center">
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
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sign Up</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                {...register('name', {
                                    required: 'Name is required', minLength: {
                                        value: 4,
                                        message: "Name must be at least 4 characters long.",
                                    },
                                    pattern: {
                                        value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                        message: "Name cannot have leading/trailing spaces or multiple spaces between words",
                                    },
                                })}  // Register with validation (required)
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                                {...register('email', {
                                    required: 'Email is required',  // Required validation
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Email is invalid',  // Email format validation
                                    },
                                    validate: {
                                        trim: (value) => {
                                            const trimmedValue = value.trim();
                                            setValue('email', trimmedValue); // Set the trimmed value
                                            return trimmedValue.length > 0 || 'Email cannot be empty after trimming';
                                        }
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                        <div className="mb-4">
                            {password && (
                                <p className={`text-sm ${passwordStrength === "Strong" ? 'text-green-600' : passwordStrength === "Medium" ? 'text-yellow-600' : 'text-red-600'}`}>
                                    Password strength: {passwordStrength}
                                </p>
                            )}
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',  // Required validation
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            {/* <span className="absolute right-3 top-3 text-gray-500 cursor-pointer" onClick={() => {
                                // Add functionality to toggle password visibility
                                // const input = document.querySelector('input[type="password"]');
                                // if (input) {
                                //     input.type = input.type === 'password' ? 'text' : 'password';
                                // }
                            }}>
                                👁️
                            </span> */}
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) => value === password || 'Passwords do not match',
                                })}
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-green-500"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        {loading ? (
                            <Spinner />
                        ) : (
                            <button
                                type="submit"
                                disabled={!isValid} // Disable if form is invalid
                                className={`w-full py-3 rounded-md ${!isValid ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-800 text-white'}`}
                            >
                                SignUp
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

                <footer className="mt-8 text-gray-600 text-sm flex items-center justify-between">
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

export default Register;


