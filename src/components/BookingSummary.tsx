"use client";

import React, { useState } from "react";
import { SlotDetails } from "@/utils/type";
import { FaWallet } from "react-icons/fa";
import { SiPyup } from "react-icons/si";
import { BsCurrencyRupee } from "react-icons/bs";
import PayUComponent from "./PayUComponent ";

interface BookingSummaryProps {
    selectedSlots: SlotDetails[];
    onCancel: () => void;
    onProceedToPayment: (paymentMethod: string) => void;
    price: number;
    turfId: string;
    companyId: string
}



const BookingSummary: React.FC<BookingSummaryProps> = ({
    selectedSlots,
    onCancel,
    onProceedToPayment,
    price,
    turfId,
    companyId
}) => {
    // console.log("PRICE inside SUMMary ", price);
    const grandTotal = price * selectedSlots.length
    const [selectedPayment, setSelectedPayment] = useState("");
    const userDet = JSON.parse(localStorage.getItem("auth") as string);
    const [showPayU, setShowPayU] = useState<boolean>(false)
    console.log("UserDet in SUMMARY :", userDet);

    const handlePaymentSelection = (method: any) => {
        setSelectedPayment(method === selectedPayment ? "" : method);
    };

    const handlePayNow = () => {
        if (selectedPayment) {
            onProceedToPayment(selectedPayment);
        }
    };


    const BookingDets = {
        amount: grandTotal,
        productinfo: turfId,
        firstname: userDet.name,
        email: userDet.email,
        userId: userDet._id,
        companyId,
        turfId,
        userDet,
        selectedSlots: selectedSlots,
    }
    console.log("SElecte SLOTs: ", selectedSlots);

    return (
        <>
            {showPayU ? <PayUComponent BookedData={BookingDets} /> : <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-center">Booking Summary</h1>
                </header>

                <main className="p-6">
                    {/* Selected Slots */}
                    <h3 className="text-2xl flex font-semibold mb-4">
                        Selected Slots
                        <div className="flex text-white bg-green-800 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                            <BsCurrencyRupee className="mr-1" /> {price} / hour
                        </div>
                    </h3>
                    <div className="bg-white flex flex-wrap p-6 rounded-lg shadow-lg mb-6">
                        {selectedSlots.map((slot, ind) => (
                            <div key={ind}>
                                <span className="text-sm text-gray-500 ml-8">
                                    {slot.date &&
                                        new Date(slot.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                </span>
                                <button
                                    className="relative flex flex-col items-center justify-between w-32 h-24 mx-2 my-2 rounded-md transition-all duration-300 bg-green-100 text-green-900 hover:shadow-lg hover:scale-105"
                                >
                                    <p className="p-3 mt-3 text-l font-bold text-center">{slot.slot}</p>
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
                                onClick={() => handlePaymentSelection("wallet")}
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
                                onClick={() => handlePaymentSelection("payu")}
                            >
                                <SiPyup size={24} />
                                <span className="text-lg font-medium">PayU</span>
                            </button>
                        </div>
                    </div>

                    {/* Pay Now Button */}
                    {selectedPayment && (
                        <div className="flex justify-center mt-8">
                            <button
                                className="bg-blue-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                                onClick={() => setShowPayU(true)}
                            >
                                Pay Now
                            </button>
                        </div>
                    )}

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
            </div>}

        </>
    );
};

export default BookingSummary;
