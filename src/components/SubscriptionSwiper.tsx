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
import { getWalletBalanceApi } from "@/services/userApi";
import { User } from "@/utils/type";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export interface SubscriptionPlan {
    _id: string;
    name: string;
    duration: string;
    discount?: number;
    price: number;
    description?: string;
}

export const SubscriptionPlans = ({ plans }: { plans: SubscriptionPlan[] }) => {
    const userDet = useAppSelector(state => state.users.user)
    const router = useRouter()

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [walletPay, setWalletPay] = useState<boolean>(false)
    const userLogged: User | null = JSON.parse(localStorage.getItem("auth") as string)

    const handleProceedToBooking = (plan: SubscriptionPlan) => {
        if (userLogged) {
            if (userLogged?.isVerified) {
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
                text: 'An error occurred while checking your wallet balance. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    }
    const handleWalletPayment = async () => {
        try {
            const response: any = { sucess: true }

            if (response.success) {
                const { data } = response
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Confirmed!',
                    text: 'Your slot has been successfully booked.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.replace(`/bookingSuccess?bookingDets=${encodeURIComponent(JSON.stringify(data.isBookingCompleted))}`)
                        console.log("Booking successful!", data.isBookingCompleted)
                        // Add any additional actions after confirmation, like redirecting or updating UI
                        // redirect(`/bookingSuccess?bookingDets=${encodeURIComponent(JSON.stringify(data.isBookingCompleted))}`);

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
            console.error("Error during booking:", error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while processing your booking. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    }

    return (
        <div className="py-10">
            <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>

            {/* Swiper Slider for Subscription Plans */}
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    768: { slidesPerView: 2 }, // Show 2 plans on medium screens
                    1024: { slidesPerView: 3 }, // Show 3 plans on large screens
                }}
                modules={[Navigation, Pagination]}
                className="w-full"
            >
                {plans.map((plan) => (
                    <SwiperSlide key={plan._id}>
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                            <p className="text-gray-600 mt-2">Duration: {plan.duration}</p>
                            <p className="text-gray-600 mt-2">Discount: {plan.discount || "N/A"}%</p>
                            <p className="text-gray-800 font-bold text-lg mt-2">₹{plan.price}</p>

                            <button
                                onClick={() => handleProceedToBooking(plan)}
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                                Get Started
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modal for Plan Details */}
            {selectedPlan && (
                <Dialog open={!!selectedPlan} onClose={() => setSelectedPlan(null)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <Dialog.Title className="text-xl font-bold text-gray-800">{selectedPlan.name}</Dialog.Title>
                            <p className="text-gray-600 mt-2">{selectedPlan.description || "No description available."}</p>
                            <p className="text-gray-600 mt-2">Duration: {selectedPlan.duration}</p>
                            <p className="text-gray-600 mt-2">Discount: {selectedPlan.discount || "N/A"}%</p>
                            <p className="text-gray-800 font-bold text-lg mt-2">₹{selectedPlan.price}</p>

                            {/* Payment Button */}
                            <button
                                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full"
                                onClick={() => console.log("Proceed to payment for:", selectedPlan._id)}
                            >
                                Proceed to Payment
                            </button>

                            {/* Payment Options */}
                            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                                <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
                                <div className="flex space-x-6">
                                    {/* Wallet Option */}
                                    <button
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl ${selectedPayment === "wallet"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => {
                                            handlePaymentSelection("wallet")
                                            handlePayWithWallet()
                                        }
                                        }
                                    >
                                        <FaWallet size={24} />
                                        <span className="text-lg font-medium">Wallet</span>
                                    </button>

                                    {/* PayU Option */}
                                    <button
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl ${selectedPayment === "payu"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => {
                                            handlePaymentSelection("payu")
                                            // toggleSetPayU()
                                        }}
                                    >
                                        <SiPyup size={24} />
                                        <span className="text-lg font-medium">PayU</span>
                                    </button>
                                </div>
                            </div>

                            {/* pay by wallet button */}
                            {walletPay && (<div className="flex justify-center mt-8">
                                <button
                                    type="button"
                                    className="bg-green-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                                    onClick={() => handleWalletPayment()}
                                >
                                    Pay with Wallet
                                </button>
                            </div>)}

                            {/* Close Button */}
                            <button
                                className="mt-2 text-gray-500 underline text-sm w-full"
                                onClick={() => setSelectedPlan(null)}
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </div>
    );
};
