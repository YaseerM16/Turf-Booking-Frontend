"use client";

import AuthNavbar from "@/components/user-auth/AuthNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';

interface QueryParams {
    type?: string;
    message?: string;
}



const LoginEmailSent: React.FC = () => {
    const [queryObj, setQueryObj] = useState<QueryParams | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryObject = Object.fromEntries(searchParams.entries()); // Get query parameters
        setQueryObj(queryObject); // Set query parameters state
    }, []);

    const type = queryObj?.type

    // console.log("Type is getting correctly :-", type);


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
            <AuthNavbar />
            <div className="flex h-screen">
                {/* Left Section */}
                <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center">
                    <div className="text-center pt-8">
                        <Image
                            src="/logo.jpeg"
                            alt="Logo"
                            className="h-16 mx-auto mb-4"
                            width={64} // Specify the width
                            height={64} // Specify the height
                            priority // Optionally add priority for above-the-fold images
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Email Sent! <span className="text-green-600">Check Your Inbox</span>
                        </h2>
                    </div>
                    {type === "verify"
                        ? <div className="mt-8 w-3/4 text-center">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Verify Your Email
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a verification email to your registered email address.
                                Please check your inbox and follow the link to proceed.
                            </p>
                            <p className="text-gray-600">
                                If you didn&apos;t receive the email, please check your spam folder or try again later.
                            </p>
                        </div>
                        : <div className="mt-8 w-3/4 text-center">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Reset Password Email Sent
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset email to your registered email address.
                                Please check your inbox and follow the link to reset your password.
                            </p>
                            <p className="text-gray-600">
                                If you didn&apos;t receive the email, please check your spam folder or try again later.
                            </p>
                        </div>
                    }
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
                            <Image
                                src="/logo.jpeg"
                                alt="Turf Logo"
                                width={128} // Match the size of h-32 (32 * 4 = 128px)
                                height={128} // Match the size of w-32 (32 * 4 = 128px)
                                className="object-cover rounded-full"
                                priority // Use this for above-the-fold images to prioritize loading
                            />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginEmailSent;
