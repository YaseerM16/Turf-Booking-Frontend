import Spinner from "@/components/Spinner";
import { SlotDetails } from "@/utils/type";

interface SlotDetailsComponentProps {
    slot: SlotDetails | null;
    onBack: () => void;
    onMakeUnavailable: (slotId: string | undefined, day: string | undefined) => void;
    onMakeAvailable: (slotId: string, day: string) => void
    onCancelSlot: (slotId: string | null) => void;
    loading: boolean;
}

const SlotDetailsComponent: React.FC<SlotDetailsComponentProps> = ({
    slot,
    onBack,
    onMakeUnavailable,
    onMakeAvailable,
    onCancelSlot,
    loading,
}) => {

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
            {/* Slot Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Slot Details</h2>
                <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                        <strong>Time:</strong> {slot?.slot}
                    </p>
                    <p className="text-lg text-gray-700">
                        <strong>Date:</strong> {new Date(slot?.date || "").toLocaleDateString()}
                    </p>
                    <p className="text-lg text-gray-700">
                        <strong>Day:</strong> {new Date(slot?.date || "").toLocaleDateString("en-US", {
                            weekday: "long",
                        })}
                    </p>
                    {slot?.isBooked && (
                        <p className="text-lg text-gray-700">
                            <strong>Booked User:</strong> {slot?.userId?.name || "N/A"}
                        </p>
                    )}
                    {slot?.isUnavail && slot?.isBooked && (
                        <p className="text-lg text-gray-700 text-gray-500">
                            <strong>Status:</strong> Unavailable
                        </p>
                    )}
                </div>
            </div>

            {/* User Details Card */}
            {slot?.isBooked && slot?.userId && (
                <>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Details</h2>
                        <div className="space-y-4">
                            <p className="text-lg text-gray-700">
                                <strong>Name:</strong> {slot?.userId.name}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Email:</strong> {slot?.userId.email}
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Phone:</strong> {slot?.userId.phone || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onCancelSlot(slot?._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Cancel Slot
                    </button>
                </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                {/* Show "Make Unavailable" only if slot is available and not booked */}
                {slot?.isBooked || slot?.isUnavail ? null : (
                    <>
                        {loading ? <Spinner /> : <button
                            onClick={() => onMakeUnavailable(slot?._id, slot?.day)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        >
                            Make Unavailable
                        </button>}

                    </>
                )}

                {/* Show "Make Available" only if slot is unavailable and not booked */}
                {slot?.isUnavail && !slot.isBooked && (
                    <>
                        {loading ? <Spinner /> : <button
                            onClick={() => onMakeAvailable(slot._id, slot.day)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Make Available
                        </button>}

                    </>
                )}

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Back
                </button>
            </div>
        </div>
    );

};

export default SlotDetailsComponent;
