'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineWarning } from 'react-icons/ai';

const PaymentFailed = () => {
    const router = useRouter();

    const handleBackHome = () => {
        // Navigate to the home page
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
            <div className="text-center">
                <div className="flex justify-center items-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center shadow-lg">
                        <AiOutlineWarning className="text-red-600 text-4xl" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    Payment Failed
                </h1>
                <p className="text-gray-700 mb-6">
                    Unfortunately, your payment could not be processed. Please try again or contact support for assistance.
                </p>
                <div className="flex justify-center space-x-4">
                    {/* <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                    >
                        Retry Payment
                    </button> */}
                    <button
                        onClick={handleBackHome}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
