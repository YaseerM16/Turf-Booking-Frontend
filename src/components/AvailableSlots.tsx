"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TurfDetails } from "@/utils/type";
import { axiosInstance } from "@/utils/constants";
import { SlotDetails } from "@/utils/type";
import FireLoading from "./FireLoading";
import BookingSummary from "./BookingSummary";
import { BsCurrencyRupee } from 'react-icons/bs';



interface TurfDetailsProps {
    turf: TurfDetails | null;
}

export const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailableSlots: React.FC<TurfDetailsProps> = ({ turf }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedDay, setSelectedDay] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [workingSlots, setWorkingSlots] = useState<SlotDetails[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<SlotDetails[]>([]);
    // console.log("Selected Slots :::", selectedSlots);
    // Existing states
    const [showSummary, setShowSummary] = useState(false);

    const handleProceedToBooking = () => {
        setShowSummary(true); // Show the summary
    };

    const handleCancelPayment = () => {
        setShowSummary(false)
        // alert("Payment is Cancelled !!")
    }

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



    const memoizedSlots = useMemo(() => ({} as Record<string, any[]>), []);

    const fetchSlotsByDay = async (turfId: string, day: string) => {
        if (memoizedSlots[day]) {
            setSelectedDay(day);
            setWorkingSlots(memoizedSlots[day]);
            if (memoizedSlots[day].length > 0) {
                setDate(memoizedSlots[day][0]?.date || "");
            }
            return;
        }
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(
                `/api/v1/user/get-slots-by-day?turfId=${turfId}&day=${day}`
            );
            if (data?.success) {
                setDate(data.slots[0]?.date || "");
                memoizedSlots[day] = data.slots;
                setSelectedDay(day);
                setWorkingSlots(data.slots);
            }
        } catch (error) {
            console.error("Error fetching Turf's Slot[] data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSlotSelection = (slot: SlotDetails) => {
        const alreadySelected = selectedSlots.find((s) => s._id === slot._id);

        if (alreadySelected) {
            // Deselect slot
            setSelectedSlots((prev) =>
                prev.filter((s) => s._id !== slot._id)
            );
        } else {
            // Select slot
            setSelectedSlots((prev) => [...prev, slot]);
            let arr = 10
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
            {showSummary ? <BookingSummary selectedSlots={selectedSlots} price={Number(turf?.price)} onCancel={handleCancelPayment} onProceedToPayment={handleProceedToBooking} turfId={turf?._id!} companyId={turf?.companyId!} /> :
                <>
                    <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                        <h1 className="text-3xl font-bold text-center">Available Slots</h1>
                    </header>
                    <main className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Select a Day</h2>
                            <div className="flex space-x-4 mt-4">
                                {workingDays.length === 0 ? (
                                    <p>Loading working days...</p>
                                ) : (
                                    workingDays.map((day, index) => (
                                        <button
                                            key={index}
                                            className={`py-2 px-4 rounded-md bg-green-500 text-white ${selectedDay === day ? "bg-green-700" : ""}`}
                                            onClick={() => fetchSlotsByDay(turf?._id!, day)}
                                        >
                                            <span className="block font-semibold">{day}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        {selectedDay && (
                            <div>
                                <h3 className="text-2xl flex font-semibold mb-4">
                                    Available Slots for
                                    <span className="text-green-700 bg-yellow-200 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                        {new Date(date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <div className="flex text-white bg-green-800 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                        <BsCurrencyRupee className="mr-1" /> {turf?.price} / hour
                                    </div>
                                </h3>
                                {loading ? (
                                    <FireLoading renders={"Fetching Slots"} />
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 max-w-5xl mx-auto bg-[url('./turf-background-image.jpg')] bg-cover bg-center bg-no-repeat p-6 rounded-lg shadow-lg backdrop-blur-md justify-items-center">
                                        {workingSlots.length === 0 ? (
                                            <p className="col-span-full text-center text-gray-700 text-lg font-medium">
                                                Loading available slots...
                                            </p>
                                        ) : (
                                            workingSlots.map((slot: SlotDetails, index: number) => {
                                                const isSelected = selectedSlots.some((s) => s._id === slot._id);
                                                const isUnavailable = slot.isUnavail;  // Check for the isUnavail flag

                                                return (
                                                    <button
                                                        key={slot._id}
                                                        disabled={slot.isBooked || isUnavailable}  // Disable button if booked or unavailable
                                                        onClick={() => toggleSlotSelection(slot)}
                                                        className={`relative flex flex-col items-center justify-between w-36 h-28 rounded-md transition-all duration-300
                        ${slot.isBooked
                                                                ? "bg-red-300 text-gray-500 cursor-not-allowed"
                                                                : isUnavailable
                                                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"  // Grey for unavailable slots
                                                                    : isSelected
                                                                        ? "bg-yellow-400 text-blue-900 shadow-xl scale-105"
                                                                        : "bg-green-200 text-green-900 hover:shadow-xl hover:scale-105"
                                                            }`}
                                                    >
                                                        {/* Slot Time */}
                                                        <p className="p-3 mt-5 text-center font-semibold text-lg">{slot.slot}</p>

                                                        {/* Status Indicator */}
                                                        <div
                                                            className={`absolute bottom-2 text-xs font-medium px-3 py-1 rounded-full
                        ${slot.isBooked
                                                                    ? "bg-red-600 text-white"
                                                                    : isUnavailable
                                                                        ? "bg-gray-500 text-white"  // Status for unavailable slots
                                                                        : isSelected
                                                                            ? "bg-white text-green-700 border border-green-500"
                                                                            : "bg-green-500 text-white"
                                                                }`}
                                                        >
                                                            {slot.isBooked ? "Booked" : isUnavailable ? "Unavailable" : isSelected ? "Selected" : "Available"}
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>


                                )}
                            </div>
                        )}

                        {selectedSlots.length > 0 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleProceedToBooking}
                                    className="bg-gradient-to-r from-green-600 to-yellow-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                                >
                                    Proceed to Booking
                                </button>
                            </div>
                        )}
                    </main>
                </>
            }
        </div>
    );
};

export default AvailableSlots;
