
"use client";

// import { GoogleLoginAPI, SignUpAPI } from "@/app/services/allAPI";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { axiosInstance } from "@/utils/constants";
Spinner

// import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
// import { app } from "@/firebase/firebase";

type Inputs = {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        watch
    } = useForm<Inputs>();
    const [passwordStrength, setPasswordStrength] = useState("");
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

    // Update the password strength as the user types

    // const [googleLogin, setGoogleLogin] = useState({
    //     username: "",
    //     email: "",
    //     password: "",
    //     profileImage: "",
    //     phone: "",
    // });

    const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post(
                "/api/v1/user/auth/signup",
                formData
            );
            console.log("SignUpAPI result:", data); // Debugging line
            if (data?.success) {
                setLoading(false);
                toast.success("Verification email sent successfully!", {
                    onClose: () => router.replace(`/checkmail?type=verify`),
                });
            }
        } catch (err: any) {
            console.log("Error While Signup :", err);

            console.error('SignUpAPI error:', err); // Debugging line
            setLoading(false);
            toast.error(err.response.data.error);
        }
    };

    // const handleGoogleClick = async () => {
    //     try {
    //         const provider = new GoogleAuthProvider();
    //         const auth = getAuth(app);
    //         const result = await signInWithPopup(auth, provider);
    //         console.log(result);
    //         setGoogleLogin({
    //             email: result.user.email!,
    //             username: result.user.displayName!,
    //             profileImage: result.user.photoURL!,
    //             password: "",
    //             phone: result.user.phoneNumber || "",
    //         });

    //         const googleLoginResult = await GoogleLoginAPI({
    //             email: result.user.email!,
    //             username: result.user.displayName!,
    //             profileImage: result.user.photoURL!,
    //             password: "",
    //             phone: result.user.phoneNumber || "",
    //         });
    //         console.log(googleLoginResult);
    //         if (
    //             googleLoginResult &&
    //             googleLoginResult.user &&
    //             googleLoginResult.token
    //         ) {
    //             localStorage.setItem("token", googleLoginResult.token);
    //             localStorage.setItem("user", JSON.stringify(googleLoginResult.user));
    //             toast.success("Login Successful!");

    //             router.push("/");
    //         } else {
    //             toast.error("Google authentication failed. Please try again.");
    //         }
    //     } catch (error) {
    //         console.log("could not loggin with google: ", error);
    //     }
    // };

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
                            className="h-16 mx-auto mb-4" // Replace with actual logo path
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Welcome to Our <span className="text-green-600">TURF</span>
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
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
                                            value: /\S+@\S+\.\S+/,
                                            message: 'Email is invalid',  // Email format validation
                                        },
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
                                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer" onClick={() => {
                                    // Add functionality to toggle password visibility
                                    const input = document.querySelector('input[type="password"]');
                                    // if (input) {
                                    //     input.type = input.type === 'password' ? 'text' : 'password';
                                    // }
                                }}>
                                    👁️
                                </span>
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
                                <button type="submit"
                                    className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800">
                                    SignUp
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
                        backgroundImage: `url('/turf-background-image.jpg')`, // Replace with actual background image path
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

export default Register;


