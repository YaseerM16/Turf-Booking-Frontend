"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Dialog } from "@headlessui/react";
import { FaWallet } from "react-icons/fa";
import { SiPyup } from "react-icons/si";
import Swal from "sweetalert2";
import { getWalletBalanceApi, subscribeByWalletPay } from "@/services/userApi";
import { SubscriptionPlan } from "@/utils/type";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import PayUComponent from "./PayUSubcriptionComp";

export const SubscriptionPlans = ({ plans }: { plans: SubscriptionPlan[] }) => {
    const userDet = useAppSelector(state => state.users.user)
    const router = useRouter()
    const [showPayU, setShowPayU] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [walletPay, setWalletPay] = useState<boolean>(false)
    // const userLogged: User | null = JSON.parse(localStorage.getItem("auth") as string)

    const handleProceedToBooking = (plan: SubscriptionPlan) => {
        if (userDet) {
            if (userDet?.isVerified) {
                // setShowSummary(true); // Show the summary
                setSelectedPlan(plan)

            } else {
                // toast.warn("please Verify your Email to proceed booking !!")
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Error!",
                    text: "please Verify your Email to proceed booking !!",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    timer: 3000,
                    toast: true,
                });
                return
            }
        } else {
            // toast.warn("please Login or sign up to proceed booking !!")
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: "please Login or sign up to proceed Subscription !!",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
            return
        }
    };

    const handlePaymentSelection = (method: string) => {
        setSelectedPayment(method === selectedPayment ? "" : method);
    };

    const handlePayWithWallet = async () => {
        try {
            const response = await getWalletBalanceApi(userDet?._id as string, selectedPlan?.price || 0)
            // console.log("DAta By the WalletBalance :", response);
            if (response.success) {
                const { data } = response
                if (data.walletBalance.isSufficient) {
                    setWalletPay(prev => !prev)
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Insufficient Balance',
                        text: `Your current wallet balance is ₹${data.walletBalance.currentBalance}.`,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // console.log("Hi");
                            setSelectedPayment("")
                        }
                    });
                }
            }
        } catch (error) {
            console.log("Error while checkWalletBalance :", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message || 'An error occurred while checking your wallet balance. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    }

    const handleWalletPayment = async () => {
        try {
            // console.log("Thisi the hnadleWallyet poypo ", selectedPayment, selectedPlan, userDet?._id);
            if (!selectedPlan) {
                return console.log("selectePlan is not getting befor the api ..!");
            }
            const response = await subscribeByWalletPay(userDet?._id as string, selectedPlan)

            if (response.success) {
                const { data } = response
                console.log("THe successful subscribed data :", data)
                Swal.fire({
                    icon: 'success',
                    title: 'Subscription Confirmed!',
                    text: "You're Subscribed to our plan.",
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.replace(`/subscription-success?subscriptionDets=${encodeURIComponent(JSON.stringify(data.subscribe))}`)
                        // console.log("Booking successful!", data.isBookingCompleted)
                        // Add any additional actions after confirmation, like redirecting or updating UI
                        // redirect(`/bookingSuccess?bookingDets=${encodeURIComponent(JSON.stringify(data.isBookingCompleted))}`);
                        // bookingDets
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed!',
                    text: `Failed to book your slot. Reason: ${'Unknown error.'}`,
                    confirmButtonText: 'Try Again',
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("User acknowledged the failure.");
                        // Handle retry logic or additional actions here
                    }
                });
            }
        } catch (error) {
            // console.error("Error during booking:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: (error as Error).message || 'Something went wrong while processing your booking. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    }
    const toggleSetPayU = () => {
        setShowPayU(prev => !prev)
    }

    return (
        <>
            {/* Swiper Slider for Subscription Plans */}
            <div className="relative w-full max-w-5xl mx-auto">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    modules={[Navigation, Pagination]}
                    className="w-full"
                >
                    {plans.map((plan) => (
                        <SwiperSlide key={plan._id}>
                            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 text-center transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-blue-100">
                                {/* Plan Name */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>

                                {/* Duration */}
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <span className="text-gray-600 font-medium">Duration:</span>
                                    <span className="text-gray-800 font-semibold">{plan.duration}</span>
                                </div>

                                {/* Discount */}
                                {plan.discount && (
                                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                                        🎉 Save {plan.discount}%
                                    </div>
                                )}

                                {/* Price */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-4 rounded-lg mb-6">
                                    <p className="text-3xl font-extrabold text-gray-900">₹{plan.price}</p>
                                    <p className="text-sm text-gray-600 mt-1">per month</p>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleProceedToBooking(plan)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                                >
                                    Get Started 🚀
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Pagination Dots Styling */}
                <style jsx>{`
                .swiper-pagination-bullet {
                    background: #9ca3af !important;
                    width: 10px;
                    height: 10px;
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    background: #3b82f6 !important;
                    transform: scale(1.3);
                    opacity: 1;
                }`}
                </style>
            </div>

            {/* Modal for Plan Details */}
            {selectedPlan && (
                <Dialog open={!!selectedPlan} onClose={() => setSelectedPlan(null)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white/90 p-8 rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full transition-all hover:shadow-2xl">
                            {/* Plan Title */}
                            <Dialog.Title className="text-2xl font-bold text-gray-900 text-center">
                                {selectedPlan?.name}
                            </Dialog.Title>
                            <p className="text-gray-600 mt-2 text-center">
                                {selectedPlan?.features || "No description available."}
                            </p>

                            {/* Plan Details */}
                            <div className="relative bg-white p-5 rounded-lg shadow-lg mt-4 border border-gray-300 overflow-hidden">
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 opacity-20 blur-xl rounded-lg"></div>

                                {/* Content */}
                                <div className="relative z-10 space-y-2 text-gray-800">
                                    <p className="flex items-center space-x-2 text-lg font-medium">
                                        📅 <span>Duration:</span>
                                        <span className="font-semibold text-green-600">{selectedPlan?.duration}</span>
                                    </p>

                                    <p className="flex items-center space-x-2 text-lg font-medium">
                                        🎉 <span>Discount:</span>
                                        <span className="font-semibold text-yellow-600">{selectedPlan?.discount || "N/A"}%</span>
                                    </p>

                                    <p className="text-gray-900 font-extrabold text-3xl mt-3 text-center">
                                        <span className="text-green-600">₹</span>{selectedPlan?.price}
                                    </p>
                                </div>
                            </div>


                            {/* Payment Options */}
                            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-lg font-semibold text-center mb-4">Choose Payment Option</h2>
                                <div className="flex justify-center space-x-6">
                                    {/* Wallet Option */}
                                    <button
                                        className={`flex items-center space-x-3 px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-300 hover:shadow-lg ${selectedPayment === "wallet"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => {
                                            handlePaymentSelection("wallet");
                                            handlePayWithWallet();
                                            setShowPayU(false)
                                        }}
                                    >
                                        <FaWallet size={24} />
                                        <span className="text-lg font-medium">Wallet</span>
                                    </button>

                                    {/* PayU Option */}
                                    <button
                                        className={`flex items-center space-x-3 px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-300 hover:shadow-lg ${selectedPayment === "payu"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => { handlePaymentSelection("payu"); toggleSetPayU(); setWalletPay(false); }}
                                    >
                                        <SiPyup size={24} />
                                        <span className="text-lg font-medium">PayU</span>
                                    </button>
                                </div>
                            </div>

                            {/* Pay with Wallet Button */}
                            {walletPay && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
                                        onClick={handleWalletPayment}
                                    >
                                        Pay with Wallet
                                    </button>
                                </div>
                            )}

                            {showPayU && (
                                <PayUComponent BookedData={selectedPlan} />
                            )}


                            {/* Close Button */}
                            <button
                                className="mt-4 text-gray-500 underline text-sm w-full text-center hover:text-gray-700 transition-all"
                                onClick={() => { setSelectedPlan(null); setWalletPay(false); setSelectedPayment(""); setShowPayU(false); }}
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </>
    );
};
