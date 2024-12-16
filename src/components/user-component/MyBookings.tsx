"use client";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/constants";
import FireLoading from "../FireLoading";
import ViewBookingDetails from "./ViewBookingDetails";

const MyBooking: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [booking, setBooking] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null); // For toggling between details and booking list
    const userDet = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth") || "{}") : null;

    // Fetch bookings from the server
    async function fetchBookings() {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/api/v1/user/my-booking?userId=${userDet?._id}`);
            if (data?.success) {
                setBooking(data.bookings);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (userDet?._id) {
            fetchBookings();
        }
    }, []);

    // Conditional rendering: MyBookings list or ViewBookingDetails
    return (
        <div className="min-h-screen bg-green-50">
            {/* Header Section */}
            <section
                className="h-64 bg-cover bg-center flex justify-center items-center"
                style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
            >
                <h2 className="text-3xl font-bold text-white bg-black bg-opacity-50 p-4 rounded-lg">
                    My Bookings
                </h2>
            </section>

            {/* Loading State */}
            {loading && <FireLoading renders={"Fetching Bookings"} />}

            {/* Main Content */}
            <section className="py-12 bg-white">
                <div className="max-w-6xl mx-auto">
                    {selectedBooking ? (
                        // Booking Details Section
                        <ViewBookingDetails
                            booking={selectedBooking}
                            onClose={() => setSelectedBooking(null)} // Return to MyBookings
                            onCancelSlot={(slotId) => {
                                // Optional: Slot cancellation logic can be added here
                                console.log("Cancel slot:", slotId);
                            }}
                        />
                    ) : (
                        // Upcoming Bookings List
                        <>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Bookings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {booking.length === 0 ? (
                                    <p className="text-center text-gray-600">You have no upcoming bookings.</p>
                                ) : (
                                    booking.map((b, index) => (
                                        <div
                                            key={index}
                                            className="bg-white shadow-lg rounded-lg overflow-hidden"
                                        >
                                            <div className="bg-green-700 text-white p-4">
                                                <h4 className="font-semibold text-lg">{b?.turfId?.turfName}</h4>
                                                <p className="text-sm">
                                                    {b.slot} - {new Date(b?.bookingDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-gray-600 text-sm">{b?.turfId?.address}</p>
                                                <div className="mt-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedBooking(b)} // Set the selected booking
                                                        className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MyBooking;
