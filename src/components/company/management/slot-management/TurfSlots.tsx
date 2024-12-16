"use client";

import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/utils/constants";
import { TurfData, SlotDetails } from "@/utils/type";
import SlotDetailsComponent from "./SlotDetailsComponent";
import { daysOrder } from "@/components/AvailableSlots";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
// import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import SlotDetailsComponent from "./SlotDetailsComponent";
Spinner
export interface WorkingSlots {
    fromTime: string;
    toTime: string;
    workingDays: string[];
}

const TurfSlots: React.FC<TurfData> = ({ turf }) => {
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [slots, setSlots] = useState<SlotDetails[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [date, setDate] = useState<any>("");
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [spinLoading, setSpinLoading] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (turf?.workingSlots?.workingDays) {
            const todayIndex = new Date().getDay(); // Get the current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

            const sortedDays = [...turf.workingSlots.workingDays].sort((a, b) => {
                const indexA = daysOrder.indexOf(a);
                const indexB = daysOrder.indexOf(b);

                // Calculate days from today
                const daysUntilA = (indexA - todayIndex + 7) % 7;
                const daysUntilB = (indexB - todayIndex + 7) % 7;

                return daysUntilA - daysUntilB;
            });

            setWorkingDays(sortedDays);
        }
    }, [turf?.workingSlots?.workingDays]);

    // const memoizedSlots = useMemo(() => ({} as Record<string, SlotDetails[]>), []);

    const fetchSlotsByDay = async (turfId: any, day: string) => {
        // if (memoizedSlots[day]) {
        //     setSelectedDay(day);
        //     setSlots(memoizedSlots[day]);
        //     if (memoizedSlots[day].length > 0) {
        //         setDate(memoizedSlots[day][0]?.date || "");
        //     }
        //     return;
        // }
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/company/get-slots-by-day?turfId=${turfId}&day=${day}`
            );
            if (data?.success) {
                setDate(data.slots[0]?.date || "");
                // memoizedSlots[day] = data.slots;
                setSelectedDay(day);
                setSlots(data.slots);
            }
        } catch (error) {
            console.error("Error fetching Turf's Slot[] data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelection = (slot: SlotDetails) => {
        setSelectedSlot(slot);
    };

    const handleMakeUnavailable = (slotId: string, day: string) => {
        // console.log("Handling Unvalaible :");
        // console.log("SlotID :", slotId);
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to proceed?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setSpinLoading(true);
                    const { data } = await axiosInstance.get(
                        `/api/v1/company/make-slot-unavailable?slotId=${slotId}&turfId=${turf?._id}`
                    );

                    if (data?.success) {
                        setSpinLoading(false)
                        setSelectedSlot(null)
                        fetchSlotsByDay(turf?._id, day)
                        toast.success("Slot Marked as Unavailble successfully ✅", { onClick: () => setSpinLoading(false) })
                        console.log("Response Data :- ", data);
                    }

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'info',
                        title: 'Action canceled.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });


        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setSpinLoading(false)
        }
    }

    const handleMakeAvailable = (slotId: string, day: string) => {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to proceed?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'No, cancel!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setSpinLoading(true);
                    const { data } = await axiosInstance.get(
                        `/api/v1/company/make-slot-available?slotId=${slotId}&turfId=${turf?._id}`
                    );

                    if (data?.success) {
                        setSpinLoading(false)
                        setSelectedSlot(null)
                        fetchSlotsByDay(turf?._id, day)
                        toast.success("Slot Marked as Availble successfully ✅", { onClick: () => setSpinLoading(false) })
                        console.log("Response Data :- ", data);
                    }

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'info',
                        title: 'Action canceled.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setSpinLoading(false)
        }
    }

    // console.log("Memoized Slots :", memoizedSlots)

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="bg-gray-50 flex-1 p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
                {/* Header */}
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{turf?.turfName}</h1>
                        <p className="text-gray-700 text-lg mt-1">
                            Manage and monitor available slots for your turf.
                        </p>
                    </div>
                </div>

                {/* Slot Details View */}
                {selectedSlot ? (
                    <SlotDetailsComponent
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)} // Return to slots view
                        onMakeUnavailable={handleMakeUnavailable}
                        onMakeAvailable={handleMakeAvailable}
                        onCancelSlot={(slotId: any) => console.log("Cancel slot:", slotId)}
                        loading={spinLoading}
                    />
                ) : (
                    <>
                        {/* Working Days */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-gray-800">Select a Day</h2>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {workingDays.map((day: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => fetchSlotsByDay(turf?._id, day)}
                                        className={`p-4 text-lg font-medium rounded-lg shadow-md ${selectedDay === day
                                            ? "bg-green-100 border-2 border-green-600 text-green-800"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slots */}
                        {selectedDay && (
                            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Available Slots for{" "}
                                    <span className="text-green-700 bg-yellow-200 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                        {new Date(date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {slots.length > 0 ? (
                                        slots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSlotSelection(slot)} // Allow clicking to view the slot details
                                                className={`p-4 rounded-lg shadow-md text-lg font-medium ${slot.isBooked
                                                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                                                    : slot.isUnavail
                                                        ? "bg-gray-300 text-gray-500 cursor-pointer" // Grey color for unavailable but clickable
                                                        : "bg-blue-50 hover:bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {slot.slot}{" "}
                                                {slot.isBooked && (
                                                    <span className="text-xs text-red-600 font-semibold ml-1">
                                                        (Booked)
                                                    </span>
                                                )}
                                                {slot.isUnavail && (
                                                    <span className="text-xs text-gray-600 font-semibold ml-1">
                                                        (Unavailable)
                                                    </span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 text-lg">
                                            No slots available for the selected day.
                                        </p>
                                    )}
                                </div>

                            </div>

                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default TurfSlots;
