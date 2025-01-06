"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "@/utils/constants";
import { setUser } from "@/store/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";



interface QueryParams {
    type?: string;
    token?: string;
    email?: string;
}

const EmailVerification: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.users)
    const [loading, setLoading] = useState(false);
    const [queryObj, setQueryObj] = useState<QueryParams | null>(null);
    const [verificationFailed, setVerificationFailed] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryObject = Object.fromEntries(searchParams.entries()); // Get query parameters
        setQueryObj(queryObject); // Set query parameters state
    }, []);
    useEffect(() => {
        // Log the user state whenever it changes to verify updates
        console.log("Updated User State:", user);
    }, [user]); // Dependency on user state

    const handleVerifyEmail = async () => {
        if (!queryObj) {
            toast.error("Invalid or missing verification details.");
            return;
        }

        try {
            setLoading(true);
            const { type, token, email } = queryObj
            if (!type || !token || !email) {
                toast.error("Missing required verification details.");
                setLoading(false);
                return;
            }
            const { data } = await axiosInstance.get("/api/v1/user/auth/verifyemail", { params: { type, token, email }, });
            if (data?.success && data?.forgotMail) {
                setLoading(false);
                toast.success("Email verified successfully!", {
                    onClose: () => router.replace(`/change-password?email=${email}`),
                });
            }
            else if (data?.success) {
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
                toast.success("Email verified successfully!", {
                    onClose: () => router.replace("/"),
                });
            } else {
                setVerificationFailed(true); // Show resend button on failure
                toast.error(data?.message || "Verification failed.");
                setLoading(false);
            }
        } catch (error) {
            console.error("VerifyEmailAPI error:", error);
            setVerificationFailed(true);
            toast.error("An error occurred during verification.");
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        try {
            setLoading(true);
            const userEmail = JSON.parse(localStorage.getItem("auth") || "{}")?.email;

            if (!userEmail) {
                toast.error("User email not found. Please log in again.");
                setLoading(false);
                return;
            }

            const { data } = await axiosInstance.post("/api/v1/user/auth/resend-email", { email: userEmail });

            if (data?.success) {
                toast.success("Verification email resent successfully!");
            } else {
                toast.error(data?.message || "Failed to resend verification email.");
            }
            setLoading(false);
        } catch (err) {
            console.error("ResendEmailAPI error:", err);
            toast.error("An error occurred. Please try again later.");
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
                        <Image
                            src="/logo.jpeg"
                            alt="Logo"
                            width={64} // Specify width (h-16 = 16 x 4 = 64px)
                            height={64} // Specify height (h-16 = 16 x 4 = 64px)
                            className="mx-auto mb-4"
                            priority // Optional: Ensures the image is preloaded for better performance
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Almost There! <span className="text-green-600">TURF</span> Awaits
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Verify Your Email</h3>
                        <p className="text-gray-600 mb-6">
                            Click the below Button to Verify your Email
                        </p>

                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                {!verificationFailed ? (
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800"
                                    >
                                        Verify Email
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleResendEmail}
                                        className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800"
                                    >
                                        Resend Verification Email
                                    </button>
                                )}
                            </>
                        )}
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

export default EmailVerification;
