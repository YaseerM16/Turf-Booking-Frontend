import { axiosInstance } from "@/utils/constants";

interface ViewBookingDetailsProps {
    booking: any;
    onClose: () => void;
    onCancelSlot: (slotId: string) => void;
}

const ViewBookingDetails: React.FC<ViewBookingDetailsProps> = ({ booking, onClose, onCancelSlot }) => {
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

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">{booking?.turfId?.turfName}</h3>
                <p className="text-gray-600 mb-2">
                    Date: {new Date(booking?.bookingDate).toLocaleDateString()}
                </p>
                <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">Booked Slots:</h4>
                    {booking.selectedSlots?.length > 0 ? (
                        booking.selectedSlots.map((slot: any, index: number) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-2 rounded-lg mb-2"
                            >
                                <div className="text-gray-700">
                                    <p>
                                        <span className="font-semibold">Slot:</span> {slot.slot}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Date:</span>{" "}
                                        {new Date(slot.date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Day:</span>{" "}
                                        {new Date(slot.date).toLocaleDateString(undefined, { weekday: "long" })}
                                    </p>
                                </div>
                                <button
                                    className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-800 mt-2 md:mt-0"
                                    onClick={() => cancelSlot(slot.slotId)}
                                >
                                    Cancel Slot
                                </button>
                            </div>

                        ))
                    ) : (
                        <p className="text-gray-600">No slots booked.</p>
                    )}
                </div>
                <button
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewBookingDetails;
