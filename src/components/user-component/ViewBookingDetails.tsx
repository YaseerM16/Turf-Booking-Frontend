import MapComponent from "../OlaMapComponent";
import { useState } from "react";
import { Booking } from "./MyBookings";
import { useAppSelector } from "@/store/hooks";
import { SlotDetails } from "@/utils/type";
import { cancelTheSlot } from "@/services/userApi";
import Spinner from "../Spinner";
import Swal from "sweetalert2";

interface ViewBookingDetailsProps {
    booking: Booking;
    onClose: () => void;
    userId: string;
}

const ViewBookingDetails: React.FC<ViewBookingDetailsProps> = ({ booking, onClose, userId }) => {
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility
    const [bookingDet, setBookingDet] = useState(booking);
    const [loading, setLoading] = useState<boolean>(false)
    console.log("Map is visible :", isMapVisible);

    const company = useAppSelector(state => state.companies.company)

    const toggleMapState = () => {
        setIsMapVisible(prev => !prev)
    }

    const cancelSlot = async (slotId: string, bookingId: string) => {
        try {
            console.log("SLOT ID in Parent :", slotId);
            setLoading(true)
            const data = await cancelTheSlot(userId, slotId, bookingId)
            if (data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Slot Cancelled',
                    text: 'The slot has been cancelled successfully.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    setLoading(false)
                    console.log("Updated & Cancelled Booking : ", data);
                    setBookingDet(data.booking.booking);
                });
            }
        } catch (error) {
            console.error("Error cancelling slot:", error);
            alert("Failed to cancel slot. Please try again.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Section */}
            <header className="bg-green-600 text-white p-6 shadow-md flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{bookingDet?.turfId?.turfName}</h1>
                    <p className="text-gray-200 mt-2">
                        Booking Date: <b>{new Date(bookingDet?.bookingDate).toLocaleDateString()}</b>
                    </p>
                    <p className="text-gray-200 mt-2">
                        <b>Address :</b>  {bookingDet?.turfId?.address}
                    </p>
                </div>
                <div className="flex items-center">
                    <div
                        className="border border-gray-300 rounded-lg shadow-md p-4 relative bg-cover bg-center"
                        style={{ backgroundImage: `url('/map-background.jpg')` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                        <div className="relative">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Turf Location
                            </h3>
                            <MapComponent
                                location={bookingDet?.turfId.location}
                                company={{ images: bookingDet?.turfId.images || [], companyname: company?.companyname || "Turf company", phone: company?.phone || "N/A" }}
                                toggleview={toggleMapState}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Combined Transaction and Pricing Details */}
            <div className="p-3 bg-gray-50 rounded shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Transaction Details */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-800 border-b pb-1">Transaction Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* First Row */}
                            <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
                                <span className="text-xs text-gray-500">Transaction ID</span>
                                <p className="text-sm font-medium text-gray-800">{bookingDet?.paymentTransactionId}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
                                <span className="text-xs text-gray-500">Payment Date</span>
                                <p className="text-sm font-medium text-gray-800">
                                    <b>{new Date(bookingDet?.bookingDate).toLocaleDateString()}</b>
                                </p>
                            </div>
                            {/* Second Row */}
                            <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
                                <span className="text-xs text-gray-500">Payment Method</span>
                                <p className="text-sm font-medium text-gray-800">{bookingDet?.paymentMethod}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded p-2 shadow-sm">
                                <span className="text-xs text-gray-500">Payment Status</span>
                                <p
                                    className={`text-sm font-medium ${bookingDet?.paymentStatus === "completed"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {bookingDet?.paymentStatus}
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Right Column: Pricing Details */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-800 border-b pb-1">Pricing</h3>
                        <div className="space-y-2">
                            {/* Grand Total Highlight */}
                            <div className="bg-green-50 border border-green-500 rounded p-3 shadow">
                                <span className="text-xs text-gray-600">Grand Total</span>
                                <p className="text-base font-bold text-green-700">
                                    ₹{bookingDet?.totalAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content Section */}
            <main className="flex-1 overflow-auto p-4 bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Booked Slots</h2>
                {bookingDet.selectedSlots?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bookingDet.selectedSlots.map((slot: SlotDetails, index: number) => (
                            <div
                                key={index}
                                className={`p-5 bg-white shadow-lg rounded-xl border ${slot.isCancelled ? 'border-red-500' : 'border-gray-200'} transition-all transform hover:scale-105 hover:shadow-2xl`}
                            >
                                {/* Slot Information */}
                                <div className="space-y-3">
                                    <h3
                                        className={`text-xl font-extrabold truncate ${slot.isCancelled ? 'text-red-600' : 'text-green-800'}`}
                                    >
                                        {slot.slot}
                                    </h3>
                                    <div className="text-sm text-gray-700">
                                        <p className="flex items-center gap-1">
                                            <span className="font-medium text-blue-600">📅 Date:</span>
                                            {new Date(slot.date).toLocaleDateString()}
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <span className="font-medium text-blue-600">📆 Day:</span>
                                            {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long' })}
                                        </p>
                                        {/* Price Information */}
                                        <p className="flex items-center gap-1">
                                            <span className="font-medium text-blue-600">💰 Price:</span>
                                            ₹{slot.price}
                                        </p>
                                    </div>
                                </div>

                                {slot.isCancelled ? (
                                    <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
                                        <h4 className="text-lg font-bold text-red-600">Cancelled</h4>
                                        <p className="text-sm text-gray-600">
                                            Refund ID: <span className="font-medium">{slot.refundTransactionId}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Refund Date: <span className="font-medium">{new Date(slot.refundDate).toLocaleDateString()}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Refund Status: <span className="font-medium">Completed</span>
                                        </p>
                                        {/* Price Information */}
                                        <p className="text-sm text-gray-600">
                                            Price: <span className="font-medium">₹{slot.price}</span>
                                        </p>
                                    </div>

                                ) : (
                                    <>
                                        {loading && <Spinner />}
                                        <button
                                            className="mt-4 py-2 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all w-full text-sm"
                                            onClick={() => cancelSlot(slot._id, bookingDet._id)}
                                        >
                                            Cancel Slot
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-6">No slots booked.</p>
                )}
            </main>






            {/* Footer Section */}
            <footer className="bg-gray-200 p-4 text-center">

                <button
                    className="bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-900"
                    onClick={onClose}
                >
                    Close
                </button>
            </footer>
        </div>
    );

};

export default ViewBookingDetails;
