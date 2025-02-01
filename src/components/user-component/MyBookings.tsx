"use client";
import { useCallback, useEffect, useState } from "react";
import FireLoading from "../FireLoading";
import ViewBookingDetails from "./ViewBookingDetails";
import { useAppSelector } from "@/store/hooks";
import { SlotDetails, TurfDetails } from "@/utils/type";
import { getBookingsApi } from "@/services/userApi"
import Pagination from "../Pagination";

export interface Booking {
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    paymentDate: string;
    paymentTransactionId: string;
    _id: string; // Assuming each booking has an ID
    companyId: string; // Assuming each booking has an ID
    turfId: TurfDetails; // A reference to the associated turf object
    selectedSlots: SlotDetails[]; // Array of selected slots (could be strings or another type depending on your structure)
    bookingDate: string | Date; // Booking date (string or Date object)
}

const MyBooking: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [booking, setBooking] = useState<Booking[] | null>([]);
    const user = useAppSelector(state => state.users.user)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalBooking, setTotalBooking] = useState<number | null>(null)
    // const [totalBooking,setTotalB]
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // For toggling between details and booking list
    // const userDet = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth") || "{}") : null;
    const bookingPerPage = 6
    // console.log("Bookings :", booking);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    // Fetch bookings from the server
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            // page = ${ page }& limit=${ turfsPerPage }
            // const { data } = await axiosInstance.get(`/api/v1/user/my-booking?userId=${user?._id}`);
            const response = await getBookingsApi(user?._id as string, currentPage, bookingPerPage)
            if (response?.success) {
                const { data } = response
                // console.log("Destructured DAta of bboks", data);
                setBooking(data.bookings.bookings);
                setTotalBooking(Math.ceil(data.bookings.totalBookings / bookingPerPage))
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    }, [user?._id, currentPage, bookingPerPage])

    useEffect(() => {
        if (user?._id) {
            fetchBookings();
        }
    }, [user?._id, fetchBookings, currentPage]);



    // Conditional rendering: MyBookings list or ViewBookingDetails
    return (
        (<div className="min-h-screen bg-green-50">
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
                        (<ViewBookingDetails
                            booking={selectedBooking}
                            onClose={() => setSelectedBooking(null)} // Return to MyBookings
                            userId={user?._id as string}
                        />)
                    ) : (
                        // Upcoming Bookings List
                        (<>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {booking?.length === 0 || booking === null ? (
                                    <p className="text-center text-gray-600">You have no upcoming bookings.</p>
                                ) : (
                                    booking?.map((b, index) => (
                                        <div
                                            key={index}
                                            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 ease-in-out"
                                        >
                                            {/* Header Section */}
                                            <div className="relative text-yellow-400 rounded-t-lg overflow-hidden">
                                                {/* Background Image */}
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${b?.turfId?.images[0]})`,
                                                    }}
                                                ></div>

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>

                                                {/* Content on Top */}
                                                <div className="relative p-6">
                                                    <h4 className="ml-2 bg-green-700 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md">
                                                        {b?.turfId?.turfName}
                                                    </h4>
                                                    <div className="flex items-center mt-4">
                                                        <span className="font-medium text-sm text-gray-300">No. of Slots Booked:</span>
                                                        <span className="ml-2 bg-green-600 px-4 py-1 rounded-full text-white text-sm font-semibold shadow-sm">
                                                            {b.selectedSlots.length}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <span className="font-medium text-sm text-gray-300">Date:</span>
                                                        <span className="ml-2 bg-green-600 px-4 py-1 rounded-full text-white text-sm font-semibold shadow-sm">
                                                            {new Date(b?.bookingDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body Section */}
                                            <div className="p-6">
                                                {/* Address Section */}
                                                <div className="mb-6">
                                                    <h5 className="font-semibold text-gray-800 text-lg mb-3">Address:</h5>
                                                    <div className="flex items-start bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6 text-green-700 mr-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 2C8.134 2 5 5.134 5 9c0 5.523 7 13 7 13s7-7.477 7-13c0-3.866-3.134-7-7-7z"
                                                            />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                        <p className="text-gray-700 text-sm leading-relaxed">
                                                            {b?.turfId?.address}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Button Section */}
                                                <div className="mt-6 text-center">
                                                    <button
                                                        onClick={() => setSelectedBooking(b)}
                                                        className="bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-8 rounded-lg hover:shadow-lg hover:scale-105 transition-transform duration-300"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                )}
                            </div>
                        </>)
                    )}
                </div>
            </section>
            {/* Pagination */}
            <div className="flex justify-center items-center py-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalBooking!}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>)
    );
};

export default MyBooking;
