import { useState } from "react";
import { RRule } from "rrule";

interface WorkingSlots {
    fromTime: string;
    toTime: string;
    workingDays: string[];
}

const TurfSlots = ({ workingSlots }: { workingSlots: any }) => {
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [slots, setSlots] = useState<string[]>([]);

    const generateSlots = (day: string) => {
        const { fromTime, toTime } = workingSlots;

        // Parse fromTime and toTime
        const [fromHour, fromMinute] = fromTime.split(":").map(Number);
        const [toHour, toMinute] = toTime.split(":").map(Number);

        const slotsArray: string[] = [];
        let currentHour = fromHour;

        while (currentHour < toHour || (currentHour === toHour && fromMinute < toMinute)) {
            const nextHour = currentHour + 1;
            slotsArray.push(`${currentHour % 12 || 12}:00 ${currentHour >= 12 ? "PM" : "AM"} - ${nextHour % 12 || 12}:00 ${nextHour >= 12 ? "PM" : "AM"}`);
            currentHour = nextHour;
        }

        setSlots(slotsArray);
        setSelectedDay(day);
    };

    return (
        <div className="bg-gray-100 flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-gray-800">Turf Slots</h1>
                <p className="text-gray-600 text-lg mt-2">Select a day to view available slots</p>
            </div>

            {/* Working Days */}
            <div className="mt-8 grid grid-cols-3 gap-4">
                {workingSlots.workingDays.map((day: string, index: number) => (
                    <button
                        key={index}
                        onClick={() => generateSlots(day)}
                        className={`p-4 bg-green-50 rounded-lg shadow-md hover:bg-green-100 text-lg font-medium ${selectedDay === day ? "border-2 border-green-500" : ""
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Slots */}
            {selectedDay && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Available Slots for {selectedDay}
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {slots.length > 0 ? (
                            slots.map((slot, index) => (
                                <button
                                    key={index}
                                    className="p-4 bg-blue-50 rounded-lg shadow-md hover:bg-blue-100 text-center text-lg font-medium"
                                >
                                    {slot}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-600 text-lg">No slots available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TurfSlots;
