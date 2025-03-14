"use client";

import { useEffect, useMemo, useState } from "react";
import { daysOrder } from "@/utils/constants";
import { TurfData, SlotDetails } from "@/utils/type";
import SlotDetailsComponent from "./SlotDetailsComponent";
import { RRule, RRuleSet } from 'rrule';
import { ToastContainer } from "react-toastify";
import Calendar from "react-calendar";
import FireLoading from "@/components/FireLoading";
import { FaEdit, FaTimes } from "react-icons/fa";
import WorkingDaysManagement from "./DaysAndHours";
import { mapDayIndexToRRuleDay } from "@/utils/dateUtils";
import { handleSlotAvailability } from "@/utils/companyUtilities";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import { getSlotsByDay } from "@/services/SlotApis";

export interface WorkingSlots {
    fromTime: string;
    toTime: string;
    workingDays: string[];
}


const TurfSlots: React.FC<TurfData> = ({ turf }) => {
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
    const [date, setDate] = useState<Date | string>("");
    const [workingSlots, setWorkingSlots] = useState<SlotDetails[]>([]);
    const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState(false);
    // console.log("THIS si TUref : ", turf);

    const workingDaysArray = useMemo(() => {
        return turf?.workingSlots.workingDays?.map((dayDetails) => dayDetails?.day) || [];
    }, [turf?.workingSlots.workingDays]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (workingDaysArray) {
            const ruleSet = new RRuleSet();

            workingDaysArray.forEach((day: string) => {
                const dayIndex = daysOrder.indexOf(day);

                // Map dayIndex to RRule weekday constants (e.g., 0 = Sunday, 1 = Monday, etc.)
                const rRuleDay = mapDayIndexToRRuleDay(dayIndex);
                const toDateMinusOneDay = new Date(turf?.generatedSlots.toDate || "");
                toDateMinusOneDay.setDate(toDateMinusOneDay.getDate() - 1); // Subtract one day

                const rule = new RRule({
                    freq: RRule.DAILY,
                    byweekday: [rRuleDay], // Use the Weekday constants in byweekday
                    dtstart: new Date(),
                    until: toDateMinusOneDay,
                });
                ruleSet.rrule(rule);
            });
        }
    }, [workingDaysArray, turf?.generatedSlots.toDate]);

    const handleDayClick = (date: Date | null) => {
        if (!date) {
            console.error("Date is null. Cannot handle day click.");
            return; // Exit the function if date is null
        }
        // const selectedDay = workingDays.find((dayObj) => dayObj.date === date);
        const day = date.toLocaleString('en-US', { weekday: 'long' }); // Get full day name (e.g., "Sunday", "Monday")

        // Adjust to local time zone before formatting the date
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateString = offsetDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // console.log("DAyte clicked :", day, dateString);
        setSelectedDay(day);

        fetchSlotsByDay(turf?._id || "", day, dateString);
    };

    // Render the calendar using react-calendar
    const renderCalendar = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Start of today

        // Parse `toDate` from `generatedSlots` or default to end of next month if not available
        const endOfRange = turf?.generatedSlots?.toDate
            ? new Date(turf.generatedSlots.toDate)
            : new Date(today.getFullYear(), today.getMonth() + 2, 0);

        return (
            <div className="w-full">
                <Calendar
                    onChange={(value) => handleDayClick(value as Date | null)} // Handle date selection
                    tileClassName={"bg-green-500 text-black font-bold"}
                    tileDisabled={({ date }) => {
                        // Disable dates before today and non-working days
                        const day = date.toLocaleString('en-US', { weekday: 'long' });
                        return date < startOfToday || !(workingDaysArray || []).includes(day);
                    }}
                    // value={selectedDay ? new Date(selectedDay) : null} // Highlight selected day
                    minDate={startOfMonth} // Allow navigation only from the start of the current month
                    maxDate={endOfRange} // Restrict navigation to the `toDate` from `generatedSlots`
                    view="month" // Keep the calendar in month view
                    navigationLabel={({ label }) => label} // Keep navigation labels
                    next2Label={null} // Hide double forward arrow (yearly)
                    prev2Label={null} // Hide double backward arrow (yearly)
                />
            </div>
        );
    };


    const fetchSlotsByDay = async (turfId: string, day: string, date: string) => {
        try {
            // console.log("turfID :", turfId);
            // console.log("day & date :", day, date)
            setLoading(true);
            const response = await getSlotsByDay(turfId, day, date)
            // console.log("REspone got raw of fetSlotByday :", response);

            if (response?.success) {
                // console.log("Res got successfylly of fetSlotByday :", response);
                const { data } = response
                setDate(data.slots[0]?.date || "");
                // memoizedSlots[day] = data.slots;
                setSelectedDay(day);
                // setSlots(data.slots);
                setWorkingSlots(data.slots);
            }
        } catch (error) {
            console.error("Error fetching Turf's Slot[] data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeUnavailable = (slotId: string | undefined, day: string | undefined) => {
        handleSlotAvailability(
            "unavailable",
            slotId || "",
            day || "",
            turf?._id,
            fetchSlotsByDay,
            setSpinLoading,
            setSelectedSlot
        );
    };

    const handleMakeAvailable = (slotId: string, day: string) => {
        handleSlotAvailability(
            "available",
            slotId,
            day,
            turf?._id,
            fetchSlotsByDay,
            setSpinLoading,
            setSelectedSlot
        );
    };

    // console.log("Memoized Slots :", memoizedSlots)

    return (<>
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

            <>
                <main className="p-6 flex flex-col lg:flex-row gap-8">
                    {/* Calendar Section */}
                    <div className="lg:w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Select a Day</h2>
                        <div className="flex justify-center mt-4">
                            {workingDaysArray.length === 0 ? (
                                <p>Loading working days...</p>
                            ) : (
                                renderCalendar()
                            )}
                        </div>
                    </div>

                    {/* Slots Section */}
                    {selectedSlot ? (
                        <SlotDetailsComponent
                            slot={selectedSlot}
                            onBack={() => {
                                setSelectedSlot(null)
                                setSelectedDay(selectedDay)
                            }}
                            onMakeUnavailable={handleMakeUnavailable}
                            onMakeAvailable={handleMakeAvailable}
                            onCancelSlot={(slotId: string | null) => console.log("Cancel slot:", slotId)}
                            loading={spinLoading}
                        />
                    ) : (
                        <>
                            {selectedDay && (
                                <div className="lg:w-2/3">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center">
                                        Slots of
                                        <span className="text-green-700 bg-yellow-200 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                            {date
                                                ? new Date(date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "No Data Found"}
                                        </span>
                                    </h3>
                                    {loading ? (
                                        <FireLoading renders={"Fetching Slots"} />
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white p-6 rounded-lg shadow-lg">
                                            {workingSlots.length === 0 ? (
                                                (<FireLoading renders={"Loading Slots"} />)
                                                // <p className="col-span-full text-center text-gray-700 text-lg font-medium">
                                                //     Loading available slots...
                                                // </p>
                                            ) : (
                                                workingSlots.map((slot: SlotDetails) => {
                                                    const isUnavailable = slot.isUnavail; // Check for the isUnavail flag

                                                    return (
                                                        <button
                                                            key={slot._id}
                                                            // disabled={slot.isBooked || isUnavailable} // Disable button if booked or unavailable
                                                            className={`relative flex flex-col items-center justify-between w-full max-w-[9rem] h-28 rounded-md transition-all duration-300
                                                                ${slot.isBooked
                                                                    ? "bg-red-300 text-gray-500"
                                                                    : isUnavailable
                                                                        ? "bg-gray-400 text-gray-700"
                                                                        : "bg-green-200 text-green-900 hover:shadow-xl hover:scale-105"
                                                                }`}
                                                            onClick={() => setSelectedSlot(slot)}
                                                        >
                                                            {/* Slot Time */}
                                                            <p className="p-3 text-center font-semibold text-lg">
                                                                {slot.slot}
                                                            </p>

                                                            {/* Status Indicator */}
                                                            <div
                                                                className={`absolute bottom-2 text-xs font-medium px-3 py-1 rounded-full
                                                                    ${slot.isBooked
                                                                        ? "bg-red-600 text-white"
                                                                        : isUnavailable
                                                                            ? "bg-gray-500 text-white"
                                                                            : "bg-green-500 text-white"
                                                                    }`}
                                                            >
                                                                {slot.isBooked ? "Booked" : isUnavailable ? "Unavailable" : "Available"}
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )
                    }

                </main>
            </>

            {/* Down Portion */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-lg position-fixed">
                {/* Title with Edit Icon */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Working Days & Hours</h2>
                    {!isEditing ? (<button
                        onClick={handleEditToggle}
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                        aria-label="Edit Working Days and Hours"
                    >
                        <FaEdit className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Edit</span>
                    </button>) : (<button
                        onClick={handleEditToggle}
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                        aria-label="Edit Working Days and Hours"
                    >
                        <FaTimes className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Close</span>
                    </button>)}

                </div>

                {/* Conditionally Render the Components */}
                {!isEditing ? (
                    <div className="mt-4 flex flex-wrap gap-6">
                        {/* Working Days */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Working Days</h3>
                            <div className="flex flex-wrap gap-3">
                                {(workingDaysArray || []).length > 0 ? (
                                    workingDaysArray.map((day, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full shadow-md"
                                        >
                                            {day}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No working days set.</p>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <WorkingDaysManagement turf={{ turf: turf }} workingDaysArr={workingDaysArray} />
                )}
                {/* Working Hours */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Working Hours</h3>
                    <div className="flex flex-wrap gap-3">
                        {turf?.workingSlots.fromTime && turf?.workingSlots.toTime ? (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 font-medium rounded-full shadow-md">
                                {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                            </span>
                        ) : (
                            <p className="text-gray-600">No working hours set.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    </>);
};

export default TurfSlots;
