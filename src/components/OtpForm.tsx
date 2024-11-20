"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const
    handleResendOtp = () => {
        // Implement your OTP resending logic here
        toast.info('OTP resent successfully!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,

            progress: undefined,
        });
    };

const OtpForm: React.FC = () => {
    const [otp, setOtp] = useState('');

    const handleOtpChange = (event: any) => {
        setOtp(event.target.value);
    };

    //     const handleVerifyOtp = () => {
    //         // Implement your OTP verification logic here
    //         if (otp === '1234') {
    //             toast.success('OTP verified successfully!', {
    //                 position: 'top-center',
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //             });
    //         } else {
    //             toast.error('Invalid   
    //  OTP', {
    //         position: 'top-center',
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,

    //                 progress: undefined,
    //       });
    //     }
    return (
        <>
            <ToastContainer />
            <div
                className="flex h-screen">
                <div className="w-1/2 bg-green-50 flex flex-col justify-center items-center">
                    <div className="text-center pt-8">
                        <Image
                            src="/logo.jpeg"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-xl font-medium text-gray-800">
                            Enter OTP
                        </h2>
                    </div>

                    <div className="mt-8 w-3/4">
                        <div className="mb-4 flex justify-center gap-4">
                            <input
                                type="text"
                                maxLength={1}
                                onChange={handleOtpChange}
                                className="w-12 p-3 rounded-md border border-gray-300 focus:outline-green-500 text-center"
                            />
                            <input
                                type="text"
                                maxLength={1}
                                onChange={handleOtpChange}
                                className="w-12 p-3 rounded-md border border-gray-300 focus:outline-green-500 text-center"
                            />
                            <input
                                type="text"
                                maxLength={1}
                                onChange={handleOtpChange}
                                className="w-12 p-3 rounded-md border border-gray-300 focus:outline-green-500 text-center"
                            />
                            <input
                                type="text"
                                maxLength={1}
                                onChange={handleOtpChange}
                                className="w-12 p-3 rounded-md border border-gray-300 focus:outline-green-500 text-center"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {/* Verify OTP Button */}
                            <button
                                className="w-3/4 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                            >
                                Verify OTP
                            </button>

                            {/* Resend OTP Button */}
                            <button
                                onClick={handleResendOtp}
                                className="w-3/4 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 mt-4"
                            >
                                Resend OTP
                            </button>
                        </div>



                    </div>
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




export default OtpForm;