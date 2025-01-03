"use client";

import React, { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { TurfDetails } from "@/utils/type";
import { axiosInstance, daysOrder } from "@/utils/constants";
// import { IoArrowBack } from 'react-icons/io5'; // Assuming you're using React Icons
import { RRule, RRuleSet, Weekday } from 'rrule';
import { SlotDetails } from "@/utils/type";
import FireLoading from "./FireLoading";
import BookingSummary from "./BookingSummary";
import { BsCurrencyRupee } from 'react-icons/bs';
import { IoArrowBack } from "react-icons/io5";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles for react-calendar
import "react-toastify/dist/ReactToastify.css";

import { toast, ToastContainer } from "react-toastify";



interface TurfDetailsProps {
    turf: TurfDetails | null;
    setShow: Dispatch<SetStateAction<boolean>>
}


const AvailableSlots: React.FC<TurfDetailsProps> = ({ turf, setShow }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const workingDaysThree = turf?.workingSlots.workingDays.map(day => day.slice(0, 3));
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [workingSlots, setWorkingSlots] = useState<SlotDetails[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<SlotDetails[]>([]);
    // Existing states
    const [showSummary, setShowSummary] = useState(false);

    const userLogged = localStorage.getItem("auth")

    const handleProceedToBooking = () => {
        if (userLogged) {
            setShowSummary(true); // Show the summary
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

    const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // console.log(turf?.workingSlots.workingDays);

    useEffect(() => {
        if (turf?.workingSlots?.workingDays) {
            const todayIndex = new Date().getDay(); // Get current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

            const ruleSet = new RRuleSet();

            turf.workingSlots.workingDays.forEach((day: string) => {
                const dayIndex = daysOrder.indexOf(day);

                // Map dayIndex to RRule weekday constants (e.g., 0 = Sunday, 1 = Monday, etc.)
                let rRuleDay: Weekday;
                switch (dayIndex) {
                    case 0:
                        rRuleDay = RRule.SU;
                        break;
                    case 1:
                        rRuleDay = RRule.MO;
                        break;
                    case 2:
                        rRuleDay = RRule.TU;
                        break;
                    case 3:
                        rRuleDay = RRule.WE;
                        break;
                    case 4:
                        rRuleDay = RRule.TH;
                        break;
                    case 5:
                        rRuleDay = RRule.FR;
                        break;
                    case 6:
                        rRuleDay = RRule.SA;
                        break;
                    default:
                        rRuleDay = RRule.SU; // Default to Sunday if there's an issue
                        break;
                }

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
    }, [turf?.workingSlots?.workingDays]);



    const handleDayClick = (date: any) => {
        // const selectedDay = workingDays.find((dayObj) => dayObj.date === date);
        const day = date!.toLocaleString('en-US', { weekday: 'long' }); // Get full day name (e.g., "Sunday", "Monday")

        // Adjust to local time zone before formatting the date
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateString = offsetDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        console.log("DAyte clicked :", day, dateString);
        setSelectedDay(day);
        fetchSlotsByDay(turf?._id!, day, dateString);

    };

    // Render the calendar using react-calendar
    const renderCalendar = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Start of today
        const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        return (
            <div className="w-full">
                <Calendar
                    onChange={(date) => handleDayClick(date)} // Handle date selection
                    tileClassName={({ date }) => {
                        // Apply green background to all dates
                        return "bg-green-500 text-black font-bold"; // Ensure the background is applied here
                    }}
                    tileDisabled={({ date }) => {
                        // Disable dates before today and non-working days
                        const day = date.toLocaleString('en-US', { weekday: 'long' });
                        return date < startOfToday || !turf?.workingSlots.workingDays.includes(day);
                    }}
                    value={selectedDay ? new Date(selectedDay) : null} // Highlight selected day
                    minDate={startOfMonth} // Allow navigation only from the start of the current month
                    maxDate={endOfNextMonth} // Restrict navigation to the end of the next month
                    view="month" // Keep the calendar in month view
                    navigationLabel={({ label }) => label} // Keep navigation labels
                    next2Label={null} // Hide double forward arrow (yearly)
                    prev2Label={null} // Hide double backward arrow (yearly)
                />
            </div>
        );
    };

    // console.log("SelectedSlots :", selectedSlots);





    const memoizedSlots = useMemo(() => ({} as Record<string, any[]>), []);
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
            const { data } = await axiosInstance.get(
                `/api/v1/user/get-slots-by-day?turfId=${turfId}&day=${day}&date=${date}`
            );
            if (data?.success) {
                // setDate(data.slots[0]?.date || "");
                setDate(date)
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
                {showSummary ? <BookingSummary selectedSlots={selectedSlots} price={Number(turf?.price)} onCancel={handleCancelPayment} onProceedToPayment={handleProceedToBooking} turfId={turf?._id!} companyId={turf?.companyId!} /> :
                    <>
                        <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                            <h1 className="text-3xl font-bold text-center">Available Slots</h1>
                        </header>
                        <main className="p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold"><IoArrowBack
                                    className="cursor-pointer"
                                    onClick={() => setShow(false)}
                                /> Select a Day <span></span> </h2>
                                <div className="flex space-x-4 mt-4">
                                    {workingDays.length === 0 ? (
                                        <p>Loading working days...</p>
                                    ) : renderCalendar()}
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
