"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BookingDetails } from "@/utils/constants";

const BookingDetailsComponent: React.FC = () => {
    const searchParams = useSearchParams();
    //sfsdf
    const [bookingDets, setBookingDets] = useState<BookingDetails | null>(null);

    useEffect(() => {
        const bookingDetsRaw = searchParams?.get("bookingDets");
        if (bookingDetsRaw) {
            try {
                const decodedDets = decodeURIComponent(bookingDetsRaw);
                setBookingDets(JSON.parse(decodedDets));
            } catch (error) {
                console.error("Failed to parse booking details:", error);
            }
        }
    }, [searchParams]);

    return bookingDets ? (
        <div className="space-y-8">
            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Details */}
                <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4">User Details</h3>
                    <div className="text-gray-700 space-y-2">
                        <p>
                            <span className="font-medium">Name:</span>{" "}
                            {bookingDets?.booking.userDetails?.name || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Email:</span>{" "}
                            {bookingDets?.booking.userDetails?.email || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {bookingDets?.booking.userDetails?.phone || "N/A"}
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
                            <span className="font-medium">Transaction ID:</span>{" "}
                            {bookingDets?.booking?.paymentTransactionId || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Payment Method:</span>{" "}
                            {bookingDets?.booking?.paymentMethod || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Total Amount:</span> ₹
                            {bookingDets?.booking?.totalAmount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Turf Details and Booked Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Turf Details */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Turf Details</h3>
                    <div className="text-gray-700 space-y-2">
                        <p>
                            <span className="font-medium">Name:</span> {bookingDets?.booking?.turfId?.turfName}
                        </p>
                        <p>
                            <span className="font-medium">Type:</span> {bookingDets?.booking?.turfId?.turfType}
                        </p>
                        <p>
                            <span className="font-medium">Size:</span> {bookingDets?.booking?.turfId?.turfSize}
                        </p>
                        <p>
                            <span className="font-medium">Price:</span> ₹{bookingDets?.booking?.turfId?.price} per hour
                        </p>
                        <p>
                            <span className="font-medium">Facilities:</span>{" "}
                            {bookingDets?.booking?.turfId?.facilities.join(", ")}
                        </p>
                        <p>
                            <span className="font-medium">Address:</span> {bookingDets?.booking?.turfId?.address}
                        </p>
                    </div>
                </div>

                {/* Booked Slots */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Booked Slots</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {bookingDets?.booking?.selectedSlots.map((slot, index: number) => {
                            const formattedDate = new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
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
            </div>
        </div>
    ) : (
        <p className="text-center text-gray-500">Loading booking details...</p>
    );
};

const BookingSuccessPage: React.FC = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/my-bookings");
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-50">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-200">
                    <h2 className="text-4xl font-extrabold text-green-700 text-center mb-8">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-600 text-center text-lg mb-6">
                        Thank you for choosing our service. Below are your booking details:
                    </p>

                    <Suspense fallback={<p className="text-center text-gray-500">Loading booking details...</p>}>
                        <BookingDetailsComponent />
                    </Suspense>

                    {/* Action Button */}
                    <div className="text-center mt-6">
                        <button
                            onClick={handleRedirect}
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                        >
                            Go to My Bookings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;