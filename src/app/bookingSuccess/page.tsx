"use client";

import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BookingSuccess: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingDetsGot = searchParams?.get("bookingDets")
    console.log("Boking Dets Got :", bookingDetsGot);


    // Decode and parse booking details
    const rawDets = decodeURIComponent(searchParams!.get("bookingDets")!);
    console.log("RawDets :", rawDets);

    const bookingDets = JSON.parse(rawDets);
    console.log("Booking Details in Success Page:", bookingDets);

    const [slots, setSlots] = useState<any[]>(bookingDets.selectedSlots || []);

    const handleRedirect = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Booking Confirmation Section */}
            <div className="flex-grow flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200">
                    {/* Booking Success Header */}
                    <h2 className="text-4xl font-extrabold text-green-700 text-center mb-8">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-600 text-center text-lg mb-6">
                        Thank you for choosing our service. Below are your booking details:
                    </p>

                    <div className="space-y-8">
                        {/* User Details */}
                        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                            <h3 className="text-xl font-bold text-green-800 mb-4">User Details</h3>
                            <div className="text-gray-700 space-y-2">
                                <p>
                                    <span className="font-medium">Name:</span> {bookingDets?.booking.userDetails?.name || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span> {bookingDets?.booking.userDetails?.email || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span> {bookingDets?.booking.userDetails?.phone || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
                            <h3 className="text-xl font-bold text-yellow-800 mb-4">Transaction Details</h3>
                            <div className="text-gray-700 space-y-2">
                                <p>
                                    <span className="font-medium">Booking ID:</span> {bookingDets?.booking?._id}
                                </p>
                                <p>
                                    <span className="font-medium">Transaction ID:</span> {bookingDets?.booking?.paymentTransactionId || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Payment Method:</span> {bookingDets?.booking?.paymentMethod || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Total Amount:</span> ₹{bookingDets?.booking?.totalAmount}
                                </p>
                            </div>
                        </div>

                        {/* Booked Slots */}
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">Booked Slots</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {bookingDets?.booking?.selectedSlots.map((slot: any, index: number) => {
                                    // Format the date in 'Day, Month Date, Year' format
                                    const formattedDate = new Date(slot.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div
                                            key={index}
                                            className="p-4 rounded-md bg-blue-700 text-white text-center font-medium shadow-md"
                                        >
                                            <p className="text-lg">{slot.slot}</p>
                                            <p className="text-sm mt-2">{formattedDate}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        {/* Action Button */}
                        <div className="text-center">
                            <button
                                onClick={handleRedirect}
                                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
