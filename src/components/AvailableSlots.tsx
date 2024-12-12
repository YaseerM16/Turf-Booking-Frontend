"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface TurfDetailsType {
    workingDays: string[];
}

const AvailableSlots: React.FC = () => {
    const turfDetails: TurfDetailsType = {
        workingDays: ["Sunday", "Friday", "Saturday", "Thursday"], // Example working days
    };



    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [workingSlots, setWorkingSlots] = useState<string[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: string[] }>({}); // Track selected slots by day

    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    useEffect(() => {
        if (currentDate) {
            setWorkingDays(turfDetails.workingDays);
        }
    }, [currentDate]);

    const generateWorkingSlots = () => {
        const startTime = 6;
        const endTime = 23;
        const slotsArray: string[] = [];

        for (let i = startTime; i < endTime; i++) {
            const fromTime = `${i}:00`;
            const toTime = `${i + 1}:00`;
            slotsArray.push(`${fromTime} - ${toTime}`);
        }

        setWorkingSlots(slotsArray);
    };

    useEffect(() => {
        if (selectedDay) {
            generateWorkingSlots();
        }
    }, [selectedDay]);

    const toggleSlotSelection = (slot: string) => {
        setSelectedSlots((prev) => {
            const updatedSlots = { ...prev };

            // Check if the selected day already exists in the state
            if (!updatedSlots[selectedDay]) {
                updatedSlots[selectedDay] = []; // If not, initialize the array
            }

            const currentSlots = updatedSlots[selectedDay];

            // Check if the slot is already selected
            const index = currentSlots.indexOf(slot);
            if (index > -1) {
                // If already selected, remove it
                currentSlots.splice(index, 1);
            } else {
                // Otherwise, add it to the array for that day
                currentSlots.push(slot);
            }

            // Reassign to ensure changes are reflected in the state
            updatedSlots[selectedDay] = [...currentSlots];

            return updatedSlots;
        });
    };

    console.log("Selected Slots :", selectedSlots);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
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
                                    onClick={() => setSelectedDay(day)}
                                >
                                    <span className="block font-semibold">{day}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
                {selectedDay && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Available Slots for {selectedDay}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {workingSlots.length === 0 ? (
                                <p>Loading available slots...</p>
                            ) : (
                                workingSlots.map((slot, index) => {
                                    const isBooked = index % 3 === 0; // Example logic for booked slots
                                    const isSelected = selectedSlots[selectedDay]?.includes(slot);

                                    return (
                                        <button
                                            key={index}
                                            disabled={isBooked}
                                            className={`flex flex-col items-center justify-center p-3 rounded-md shadow-md border-2 transition-all duration-300
                                                ${isBooked
                                                    ? "bg-red-100 border-red-400 cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-blue-200 border-blue-400"
                                                        : "bg-green-100 border-green-400 hover:bg-green-200"
                                                }`}
                                            onClick={() => !isBooked && toggleSlotSelection(slot)}
                                        >
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 font-bold rounded-full mb-2
                                                    ${isBooked
                                                        ? "bg-red-400 text-white"
                                                        : isSelected
                                                            ? "bg-blue-400 text-white"
                                                            : "bg-green-400 text-white"
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">{slot}</p>
                                            <span
                                                className={`text-xs mt-1 ${isBooked ? "text-red-500" : isSelected ? "text-blue-500" : "text-green-500"}`}
                                            >
                                                {isBooked ? "Booked" : isSelected ? "Selected" : "Available"}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                        {selectedSlots[selectedDay]?.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold">Selected Slots</h4>
                                <ul className="list-disc list-inside mt-2">
                                    {selectedSlots[selectedDay].map((slot, index) => (
                                        <li key={index}>{slot}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default dynamic(() => Promise.resolve(AvailableSlots), { ssr: false });