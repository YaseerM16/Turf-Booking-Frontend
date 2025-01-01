import { axiosInstance } from "@/utils/constants";
import MapComponent from "../OlaMapComponent";
import { useState } from "react";
import { Booking } from "./MyBookings";
import { useAppSelector } from "@/store/hooks";
import { SlotDetails } from "@/utils/type";

interface ViewBookingDetailsProps {
    booking: Booking;
    onClose: () => void;
    onCancelSlot: (slotId: string) => void;
}

const ViewBookingDetails: React.FC<ViewBookingDetailsProps> = ({ booking, onClose, onCancelSlot }) => {
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility
    console.log("Map is visible :", isMapVisible);
    const company = useAppSelector(state => state.companies.company)
    const cancelSlot = async (slotId: string) => {
        try {
            const { data } = await axiosInstance.delete(`/api/v1/user/cancel-slot/${slotId}`);
            if (data?.success) {
                alert("Slot cancelled successfully.");
                onCancelSlot(slotId); // Inform parent component
            }
        } catch (error) {
            console.error("Error cancelling slot:", error);
            alert("Failed to cancel slot. Please try again.");
        }
    };

    const toggleMapState = () => {
        setIsMapVisible(prev => !prev)
    }

    console.log("Booing : ", booking.selectedSlots);


    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Section */}
            <header className="bg-green-600 text-white p-6 shadow-md flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{booking?.turfId?.turfName}</h1>
                    <p className="text-gray-200 mt-2">
                        Booking Date: <b>{new Date(booking?.bookingDate).toLocaleDateString()}</b>
                    </p>
                    <p className="text-gray-200 mt-2">
                        <b>Address :</b>  {booking?.turfId?.address}
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
                                location={booking?.turfId.location}
                                company={{ images: booking?.turfId.images || [], companyname: company?.companyname || "Turf company", phone: company?.phone || "N/A" }}
                                toggleview={toggleMapState}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="flex-1 overflow-auto p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Booked Slots</h2>
                {booking.selectedSlots?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {booking.selectedSlots.map((slot: SlotDetails, index: number) => (
                            <div
                                key={index}
                                className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                            >
                                <h3 className="text-lg font-bold text-green-700">{slot.slot}</h3>
                                <p className="text-gray-600 mt-1">
                                    <span className="font-semibold">Date:</span>{" "}
                                    {new Date(slot.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <span className="font-semibold">Day:</span>{" "}
                                    {new Date(slot.date).toLocaleDateString(undefined, { weekday: "long" })}
                                </p>
                                <button
                                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full"
                                    onClick={() => cancelSlot(slot._id)}
                                >
                                    Cancel Slot
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center mt-6">No slots booked.</p>
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
