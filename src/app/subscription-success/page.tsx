"use client";
export const dynamic = "force-dynamic"; // ✅ Ensures dynamic rendering


import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Subscription } from "@/utils/type";

const SubscriptionDetailsComponent: React.FC = () => {
    const searchParams = useSearchParams();
    const [subscriptonDets, setSubscriptionDets] = useState<Subscription | null>(null);

    useEffect(() => {
        const subscriptionDetsRaw = searchParams?.get("subscriptionDets");
        if (subscriptionDetsRaw) {
            try {
                const decodedDets = decodeURIComponent(subscriptionDetsRaw);
                setSubscriptionDets(JSON.parse(decodedDets));
            } catch (error) {
                console.error("Failed to parse booking details:", error);
            }
        }
    }, [searchParams]);



    return subscriptonDets ? (
        <div className="space-y-8">
            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Plan Details */}
                <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Subscription Plan</h3>
                    <div className="text-gray-700 space-y-2">
                        <p>
                            <span className="font-medium">Plan Name:</span> {subscriptonDets.planId?.name || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Duration:</span> {subscriptonDets.planId?.duration || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Price:</span> ₹{subscriptonDets.planId?.price || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Features:</span> {subscriptonDets.planId?.features || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Start Date:</span>{" "}
                            {new Date(subscriptonDets.startDate).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-medium">End Date:</span>{" "}
                            {new Date(subscriptonDets.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4">Transaction Details</h3>
                    <div className="text-gray-700 space-y-2">
                        <p>
                            <span className="font-medium">Subscription ID:</span> {subscriptonDets?._id}
                        </p>
                        <p>
                            <span className="font-medium">Transaction ID:</span> {subscriptonDets?.paymentId || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Status:</span> {subscriptonDets?.status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-center text-gray-500">Loading subscription details...</p>
    );
};

const SubscriptionSuccessPage: React.FC = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-50">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-200">
                    <h2 className="text-4xl font-extrabold text-green-700 text-center mb-8">
                        Subscription Confirmed!
                    </h2>
                    <p className="text-gray-600 text-center text-lg mb-6">
                        Thank you for choosing our service. Below are your subscription details:
                    </p>

                    <Suspense fallback={<p className="text-center text-gray-500">Loading subscription details...</p>}>
                        <SubscriptionDetailsComponent />
                    </Suspense>

                    {/* Action Button */}
                    <div className="text-center mt-6">
                        <button
                            onClick={handleRedirect}
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;
