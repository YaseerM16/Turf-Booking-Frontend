"use client";

import React, { useEffect, useRef, useState } from "react";
import { SlotDetails } from "@/utils/type";
import { FaWallet } from "react-icons/fa";
import { SiPyup } from "react-icons/si";
import { BsCurrencyRupee } from "react-icons/bs";
import PayUComponent from "./PayUComponent ";
import { useAppSelector } from "@/store/hooks";
import { BookedData } from "@/utils/constants";
import { bookSlotsByWalletApi, getWalletBalanceApi } from "@/services/userApi";
import Swal from "sweetalert2";
import { generateTxnId } from "@/utils/generateTxnld";
import { useRouter } from "next/navigation";


interface BookingSummaryProps {
    selectedSlots: SlotDetails[];
    onCancel: () => void;
    turfId: string;
    companyId: string
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
    selectedSlots,
    onCancel,
    turfId,
    companyId
}) => {
    // console.log("PRICE inside SUMMary ", price);
    let grandTotal = 0;
    for (const slot of selectedSlots) {
        grandTotal += slot.price!;
    }

    console.log("GRande : ", grandTotal);


    const [selectedPayment, setSelectedPayment] = useState("");

    const userDet = useAppSelector(state => state.users.user)
    // const userDet = JSON.parse(localStorage.getItem("auth") as string);
    const [showPayU, setShowPayU] = useState<boolean>(false)
    const [bookingDets, setBookingDets] = useState<BookedData | null>(null)
    const [walletPay, setWalletPay] = useState<boolean>(false)
    const txnidRef = useRef(generateTxnId(8)); // txnid is created once
    const txnid = txnidRef.current;
    const router = useRouter()
    // let BookingDets: any
    // console.log("bookingDets in BokingSumary :", bookingDets);

    const handlePaymentSelection = (method: string) => {
        setSelectedPayment(method === selectedPayment ? "" : method);
    };

    const handleWalletPayment = async () => {
        try {
            const bookingDets = {
                companyId,
                turfId,
                selectedSlots,
                totalAmount: grandTotal,
                paymentTransactionId: txnid,
            };

            const response = await bookSlotsByWalletApi(userDet?._id as string, bookingDets);

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

    const handlePayWithWallet = async () => {
        try {
            const response = await getWalletBalanceApi(userDet?._id as string, grandTotal)
            // console.log("DAta By the WalletBalance :", response);
            if (response.success) {
                const { data } = response
                if (data.walletBalance.isSufficient) {
                    setWalletPay(true)
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

    const toggleSetPayU = () => {
        setShowPayU(prev => !prev)
        if (userDet) {
            setBookingDets({
                amount: grandTotal,
                productinfo: turfId,
                firstname: userDet.name,
                email: userDet.email,
                userId: userDet._id,
                companyId,
                turfId,
                userDet,
                selectedSlots: selectedSlots,
            })
            // BookingDets = {
            //     amount: grandTotal,
            //     productinfo: turfId,
            //     firstname: userDet.name,
            //     email: userDet.email,
            //     userId: userDet._id,
            //     companyId,
            //     turfId,
            //     userDet,
            //     selectedSlots: selectedSlots,
            // }
        }
    }


    useEffect(() => {
        console.log("Inside useEffect() ::>");

        console.log("SelectedSlots :", selectedSlots);
        console.log("Amount Tot :", grandTotal);
        console.log("ProdINfo turfID :", turfId);


        if (userDet) {
            setBookingDets({
                amount: grandTotal,
                productinfo: turfId,
                firstname: userDet.name,
                email: userDet.email,
                userId: userDet._id,
                companyId,
                turfId,
                userDet,
                selectedSlots: selectedSlots,
            })
            // BookingDets = {
            //     amount: grandTotal,
            //     productinfo: turfId,
            //     firstname: userDet.name,
            //     email: userDet.email,
            //     userId: userDet._id,
            //     companyId,
            //     turfId,
            //     userDet,
            //     selectedSlots: selectedSlots,
            // }
        }
    }, [companyId, grandTotal, selectedSlots, turfId, userDet])

    console.log("SElecte SLOTs: ", selectedSlots);

    return (
        <>
            {/* {showPayU ? <PayUComponent BookedData={BookingDets} /> : } */}
            <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-center">Booking Summary</h1>
                </header>

                <main className="p-6">
                    {/* Selected Slots */}
                    <h3 className="text-2xl flex font-semibold mb-4">
                        Selected Slots

                    </h3>
                    <div className="bg-white flex flex-wrap p-6 rounded-lg shadow-lg mb-6">
                        {selectedSlots.map((slot, ind) => (
                            <div key={ind} className="flex flex-col items-center w-40 h-auto mx-2 my-3">
                                <span className="text-sm text-gray-500 mb-1">
                                    {slot.date &&
                                        new Date(slot.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                </span>
                                <button
                                    className="relative flex flex-col items-center justify-between w-full h-auto rounded-md transition-all duration-300 bg-green-100 text-green-900 hover:shadow-lg hover:scale-105 p-4"
                                >
                                    <p className="text-lg font-bold text-center mb-1">{slot.slot}</p>

                                    <p className="text-xl font-semibold text-green-700 mb-5">
                                        ₹{slot.price}
                                    </p>

                                    <div className="absolute bottom-2 text-xs font-medium px-3 py-1 rounded-full bg-green-500 text-white">
                                        {"Selected"}
                                    </div>
                                </button>

                            </div>
                        ))}
                    </div>


                    {/* Grand Total */}
                    <div className="bg-green-800 flex justify-between items-center p-6 rounded-lg shadow-lg mb-6 w-1/3 mx-auto">
                        <span className="text-white font-semibold">Grand Total:</span>
                        <div className="flex items-center text-white font-bold text-xl">
                            <BsCurrencyRupee className="mr-1" /> {grandTotal}
                        </div>
                    </div>

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
                                    toggleSetPayU()
                                }}
                            >
                                <SiPyup size={24} />
                                <span className="text-lg font-medium">PayU</span>
                            </button>
                        </div>
                    </div>

                    {/* Pay Now Button */}
                    {/* {selectedPayment && (
                        <div className="flex justify-center mt-8">
                            <button
                                className="bg-blue-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                                onClick={() => setShowPayU(true)}
                            >
                                Pay Now
                            </button>
                        </div>
                    )} */}

                    {showPayU && (
                        <PayUComponent BookedData={bookingDets} />
                    )}

                    {walletPay && (<div className="flex justify-center mt-8">
                        <button
                            type="button"
                            className="bg-green-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                            onClick={() => handleWalletPayment()}
                        >
                            Pay with Wallet
                        </button>
                    </div>)}

                    {/* Cancel Booking */}
                    <div className="flex justify-center mt-8">
                        <button
                            className="bg-red-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                            onClick={onCancel}
                        >
                            Cancel Booking
                        </button>
                    </div>

                </main>
            </div>

        </>
    );
};

export default BookingSummary;
