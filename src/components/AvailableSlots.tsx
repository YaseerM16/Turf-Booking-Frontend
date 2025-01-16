"use client";

import React, { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { TurfDetails, User } from "@/utils/type";
import { daysOrder } from "@/utils/constants";
import { mapDayIndexToRRuleDay } from "@/utils/dateUtils";
import { RRule, RRuleSet } from 'rrule';
import { SlotDetails } from "@/utils/type";
import FireLoading from "./FireLoading";
import BookingSummary from "./BookingSummary";
import { BsCurrencyRupee } from 'react-icons/bs';
import { IoArrowBack } from "react-icons/io5";
import Calendar from "react-calendar";
import { getSlotsByDayApi } from "@/services/userApi"
import "react-calendar/dist/Calendar.css"; // Default styles for react-calendar
import "react-toastify/dist/ReactToastify.css";

import { toast, ToastContainer } from "react-toastify";

interface TurfDetailsProps {
    turf: TurfDetails | null;
    setShow: Dispatch<SetStateAction<boolean>>
}

const AvailableSlots: React.FC<TurfDetailsProps> = ({ turf, setShow }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [workingSlots, setWorkingSlots] = useState<SlotDetails[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<SlotDetails[]>([]);
    const [showSummary, setShowSummary] = useState(false);
    const [price, setPrice] = useState<number>(turf?.price || 0)

    const workingDaysArray = useMemo(() => {
        return turf?.workingSlots.workingDays?.map((dayDetails) => dayDetails?.day) || [];
    }, [turf?.workingSlots.workingDays]);

    console.log("workingDaysArray :", workingDaysArray);


    const userLogged: User | null = JSON.parse(localStorage.getItem("auth") as string)

    const handleProceedToBooking = () => {
        if (userLogged) {
            if (userLogged?.isVerified) {
                setShowSummary(true); // Show the summary
            } else {
                toast.warn("please Verify your Email to proceed booking !!")
                return
            }
        } else {
            toast.warn("please Login or sign up to proceed booking !!")
            return
        }
    };

    const handleCancelPayment = () => {
        setShowSummary(false)
        setSelectedDay("")
        // alert("Payment is Cancelled !!")
    }

    const [workingDays, setWorkingDays] = useState<{ day: string; date: string }[]>([]);


    useEffect(() => {
        if (workingDaysArray) {

            const ruleSet = new RRuleSet();

            workingDaysArray.forEach((day: string) => {
                const dayIndex = daysOrder.indexOf(day);

                // Map dayIndex to RRule weekday constants (e.g., 0 = Sunday, 1 = Monday, etc.)
                const rRuleDay = mapDayIndexToRRuleDay(dayIndex);

                const rule = new RRule({
                    freq: RRule.DAILY,
                    byweekday: [rRuleDay], // Use the Weekday constants in byweekday
                    dtstart: new Date(),
                    until: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Limit to the next month
                });
                ruleSet.rrule(rule);
            });

            // Get working dates
            const workingDates = ruleSet.all();

            // Map working dates to day and formatted date
            const daysWithDates = workingDates.map((date) => ({
                day: daysOrder[date.getDay()],
                date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            }));

            setWorkingDays(daysWithDates);
        }
    }, [workingDaysArray]);



    const handleDayClick = (date: Date | null) => {
        if (!date) {
            console.error("Date is null. Cannot handle day click.");
            return; // Exit the function if date is null
        }
        // const selectedDay = workingDays.find((dayObj) => dayObj.date === date);
        const day = date!.toLocaleString('en-US', { weekday: 'long' }); // Get full day name (e.g., "Sunday", "Monday")

        // Adjust to local time zone before formatting the date
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateString = offsetDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        console.log("DAyte clicked :", day, dateString);
        setSelectedDay(day);
        fetchSlotsByDay(turf?._id || "day", day, dateString);

    };

    // Render the calendar using react-calendar
    const renderCalendar = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Start of today
        // const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        const endOfRange = turf?.generatedSlots?.toDate
            ? new Date(turf.generatedSlots.toDate)
            : new Date(today.getFullYear(), today.getMonth() + 2, 0);

        return (
            <>
                <div className="w-full flex flex-col justify-center items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <IoArrowBack
                            className="cursor-pointer"
                            onClick={() => setShow(false)}
                        />
                        Select a Day
                    </h2>
                    <Calendar
                        onChange={(value) => handleDayClick(value as Date | null)} // Handle date selection
                        tileClassName="bg-green-500 text-black font-bold"
                        tileDisabled={({ date }) => {
                            // Disable dates before today and non-working days
                            const day = date.toLocaleString('en-US', { weekday: 'long' });
                            return date < startOfToday || !workingDaysArray!.includes(day);
                        }}
                        minDate={startOfMonth} // Allow navigation only from the start of the current month
                        maxDate={endOfRange} // Restrict navigation to the end of the next month
                        view="month" // Keep the calendar in month view
                        navigationLabel={({ label }) => label} // Keep navigation labels
                        next2Label={null} // Hide double forward arrow (yearly)
                        prev2Label={null} // Hide double backward arrow (yearly)
                    />
                </div>
            </>
        );

    };

    // console.log("SelectedSlots :", selectedSlots);
    // const memoizedSlots = useMemo(() => ({} as Record<string, any[]>), []);
    // console.log("Memoized Slots :::", memoizedSlots);

    const fetchSlotsByDay = async (turfId: string, day: string, date: string) => {
        // if (memoizedSlots[day]) {
        //     setSelectedDay(day);
        //     setWorkingSlots(memoizedSlots[day]);
        //     // if (memoizedSlots[day].length > 0) {
        //     //     setDate(memoizedSlots[day][0]?.date || "");
        //     // }
        //     setDate(date)
        //     return;
        // }

        try {
            setLoading(true);
            const response = await getSlotsByDayApi(turfId, day, date)
            if (response?.success) {
                const { data } = response
                // setDate(data.slots[0]?.date || "");
                setDate(date)
                // memoizedSlots[day] = data.slots;
                setSelectedDay(day);
                setWorkingSlots(data.slots.slots);
                console.log("SLOTSSSSLOTSS", data.slots.slots);

                setPrice(data.slots.price)
                console.log("PRiceddd :", data.slots.price);

            }
        } catch (error) {
            console.error("Error fetching Turf's Slot[] data:", error);
        } finally {
            setLoading(false)
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
            slot.price = price
            setSelectedSlots((prev) => [...prev, slot]);
        }
    };

    const handleSlotRemove = (slotToRemove: SlotDetails) => {
        setSelectedSlots((prevSlots) =>
            prevSlots.filter((slot) => slot !== slotToRemove)
        );
    };


    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                {showSummary ? <BookingSummary selectedSlots={selectedSlots} onCancel={handleCancelPayment} turfId={turf?._id || ""} companyId={turf?.companyId || ""} /> :
                    <>
                        <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                            <h1 className="text-3xl font-bold text-center">Available Slots</h1>
                        </header>

                        <main className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Calendar Section (Left Side) */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Day</h2>
                                    <div className="flex flex-wrap">
                                        {workingDays.length === 0 ? (
                                            <p>Loading working days...</p>
                                        ) : (
                                            renderCalendar()
                                        )}
                                    </div>
                                </div>
                                {selectedDay && (
                                    <div>
                                        <h3 className="text-2xl flex font-semibold mb-4">
                                            Available Slots for
                                            <span className="text-green-700 bg-yellow-200 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                                {date ? new Date(date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                }) : <div>loading..</div>}
                                            </span>
                                            <div className="flex text-white bg-green-800 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                                <BsCurrencyRupee className="mr-1" /> {price} / hour
                                            </div>
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 max-w-5xl mx-auto bg-[url('./turf-background-image.jpg')] bg-cover bg-center bg-no-repeat p-6 rounded-lg shadow-lg backdrop-blur-md justify-items-center">
                                            {loading ? (
                                                <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-lg p-8" style={{ height: '50vh' }}>
                                                    <FireLoading renders={"Fetching Slots"} />
                                                </div>
                                            ) : (
                                                <>
                                                    {workingSlots.length === 0 ? (
                                                        <p className="col-span-full text-center text-gray-700 text-lg font-medium">
                                                            Loading available slots...
                                                        </p>
                                                    ) : (
                                                        workingSlots.map((slot: SlotDetails) => {
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedSlots.length > 0 && (
                                <>
                                    <div className="bg-white flex flex-col p-6 rounded-lg shadow-lg mb-6">
                                        <div className="flex text-white bg-green-800 font-bold px-3 py-2 rounded-full ml-2 shadow-lg">
                                            Selected Slots
                                        </div>
                                        <div className="bg-white flex flex-wrap p-6 rounded-lg shadow-lg mb-6">
                                            {selectedSlots.map((slot, ind) => (
                                                <div key={ind}>
                                                    <span className="text-sm text-gray-500 ml-8">
                                                        {slot.date &&
                                                            new Date(slot.date).toLocaleDateString("en-US", {
                                                                weekday: "short",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                    </span>
                                                    <button
                                                        className="relative flex flex-col items-center justify-between w-32 h-24 mx-2 my-2 rounded-md transition-all duration-300 bg-green-100 text-green-900 hover:shadow-lg hover:scale-105"
                                                        onClick={() => handleSlotRemove(slot)}
                                                    >
                                                        <p className="p-3 mt-3 text-l font-bold text-center">{slot.slot}</p>
                                                        <div className="absolute bottom-2 text-xs font-medium px-3 py-1 rounded-full bg-green-500 text-white">
                                                            {"Selected"}
                                                        </div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={handleProceedToBooking}
                                            className="bg-gradient-to-r from-green-600 to-yellow-500 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
                                        >
                                            Proceed to Booking
                                        </button>
                                    </div>
                                </>
                            )}

                        </main>
                    </>
                }
            </div>
        </>
    );
};

export default AvailableSlots;
