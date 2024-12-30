import Spinner from "@/components/Spinner";
import { axiosInstance } from "@/utils/constants";
import { TurfData } from "@/utils/type";
import { useState } from "react";
import { FaCheck, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WorkingDaysManagement: React.FC<{ turf: TurfData, onClose: () => void }> = ({ turf, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditDay, setIsEditDay] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null)
    const [workingDays, setWorkingDays] = useState<any>([]);
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [fromTimeError, setFromTimeError] = useState<string | null>(null);
    const [toTimeError, setToTimeError] = useState<string | null>(null);
    const [workingDaysError, setworkingDaysError] = useState<string | null>(null);
    const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [price, setPrice] = useState<any>(null)
    const conflictingSlots: any[] = []
    const toggleEdit = () => setIsEditing(!isEditing);
    const toggleDayEdit = () => setIsEditDay(!isEditDay);
    const toggleIsEditDay = () => setIsEditDay(!isEditDay);

    const handleToggleDay = (day: string) => {
        if (workingDays.includes(day)) {
            // Remove the day if already selected
            setWorkingDays(workingDays.filter((d: any) => d !== day));
        } else {
            // Add the day if not selected
            setWorkingDays([...workingDays, day]);
        }
    };

    const handleDayClick = (day: string) => {
        console.log(`Selected day: ${day}`);
        // Perform further actions like setting the day for editing or fetching related data
        setSelectedDay(day);
    };


    const handleSubmit = async () => {
        setFromTimeError(null)
        setToTimeError(null)
        setworkingDaysError(null)
        // Submit new working days and hours
        // console.log("Working Hours:", { fromTime, toTime });
        if (fromTime == "") {
            setFromTimeError("Provide the From Time")
            return
        }

        if (toTime == "") {
            setToTimeError("Provide the To Time")
            return
        }

        if (workingDays.length == 0) {
            console.log("working day error setted :");
            setworkingDaysError("No Working day were selected")
            return
        }
        // "/:turfId/add-working-days"

        setworkingDaysError(null)
        setFromTimeError(null)
        setToTimeError(null)
        // const workingDaysUpdate = workingDays
        // const formTimeUpdate = fromTime
        // const toTimeUpdate = toTime
        const turfId = turf.turf?._id
        const payload = {
            workingDays: workingDays, // Updated working days
            fromTime: fromTime,      // Updated start time
            toTime: toTime           // Updated end time
        };
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
                    const { data } = await axiosInstance.patch(
                        `/api/v1/company/${turfId}/add-working-days`, payload
                    );

                    console.log("Comone DATA :", data);


                    if (data?.success) {
                        console.log("DAta inside IF STATE :", data);

                        setSpinLoading(false)
                        // setSelectedSlot(null)
                        // fetchSlotsByDay(turf?._id, day, "sdfd")
                        Swal.fire({
                            icon: 'success',
                            title: 'Working days has been updated successfully ✅',
                            timer: 2000, // Display for 2 seconds
                            showConfirmButton: false, // No buttons
                            timerProgressBar: true, // Optional: Show a progress bar
                            willClose: () => window.location.reload(), // Callback before the pop-up closes
                        });
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

        // console.log("Updated Working Days:", workingDays);

        // console.log("Tryin to Submit :");
        // toggleEdit();
    };

    return (
        <div className="mb-6 flex flex-col p-4 bg-white rounded-lg shadow-lg">
            {!isEditing ? (
                // Display Mode
                <>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Add Working days</h3>
                        {/* Working Days */}
                        <div className="flex flex-wrap gap-3">
                            {daysOrder.map((day) => (
                                <span
                                    key={day}
                                    className={`px-3 py-1 rounded-full shadow-md ${turf.turf?.workingSlots?.workingDays.includes(day)
                                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-3 mx-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleEdit} // Define the add functionality in the handler
                                className="text-gray-500 hover:text-white transition-colors flex items-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full shadow-lg transform hover:scale-105"
                                aria-label="Add Working Day"
                            >
                                <FaPlus className="w-5 h-5 text-white" />
                                <span className="text-sm font-medium text-white">Add Day</span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                // Edit Mode
                <div className="mt-4">
                    {/* Weekdays List with Add Option */}
                    <div className="flex flex-wrap gap-3">
                        {daysOrder.map((day) => {
                            const isDayInWorkingSlots = turf.turf?.workingSlots?.workingDays.includes(day);
                            const isDaySelected = workingDays.includes(day);

                            return (
                                <div
                                    key={day}
                                    className={`flex items-center justify-between px-3 py-1 rounded-full shadow-md ${isDayInWorkingSlots
                                        ? "bg-green-600 text-white cursor-not-allowed"
                                        : isDaySelected
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    <span>{day}</span>
                                    {isDayInWorkingSlots ? (
                                        <button
                                            className="bg-green-200 text-green-700 cursor-not-allowed"
                                            aria-label={`Locked ${day}`}
                                        >
                                            {/* <FaCheck className="w-4 h-4" /> */}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleDay(day)} // Toggling effect for all days
                                            className={`ml-2 text-gray-500 hover:text-gray-700 ${isDaySelected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                                                }`}
                                            aria-label={`Toggle ${day}`}
                                        >
                                            {isDaySelected ? (
                                                <FaTimes className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <FaPlus className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <div className="mt-3 mx-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleEdit} // Define the close functionality in the handler
                                    className="text-gray-500 hover:text-white transition-colors flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-lg transform hover:scale-105"
                                    aria-label="Close"
                                >
                                    <FaTimes className="w-5 h-5 text-white" />
                                    <span className="text-sm font-medium text-white">Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error message for WorkingDays */}
                    {workingDaysError && (
                        <div className="text-red-500 text-sm mt-1">
                            {workingDaysError} {/* Display the error message here */}
                        </div>
                    )}

                    {/* Form for Adding Working Hours */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Set Working Hours</h3>
                        <div className="flex items-center gap-4">
                            From time
                            <div className="w-full">
                                {/* <label htmlFor=""></label> */}
                                <input
                                    type="time"
                                    value={fromTime}
                                    onChange={(e) => setFromTime(e.target.value)}
                                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                    placeholder="From Time"
                                />
                                {/* Error message for fromTime */}
                                {fromTimeError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {fromTimeError} {/* Display the error message here */}
                                    </div>
                                )}
                            </div>
                            To time
                            <div className="w-full">
                                <input
                                    type="time"
                                    value={toTime}
                                    onChange={(e) => setToTime(e.target.value)}
                                    className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                    placeholder="To Time"
                                />
                                {/* Error message for toTime */}
                                {toTimeError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {toTimeError} {/* Display the error message here */}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            {spinLoading ? <Spinner /> : <button
                                onClick={handleSubmit}
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Add Working Days
                            </button>}
                        </div>
                    </div>
                </div>
            )}

            <>
                <div className="mt-4 flex flex-wrap gap-6">
                    {/* Working Days */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Edit Working Days</h3>
                        <div className="flex flex-wrap gap-3">
                            {(turf?.turf?.workingSlots.workingDays || []).length > 0 ? (
                                turf?.turf?.workingSlots.workingDays.map((day, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full shadow-md cursor-pointer transition-all hover:bg-green-700 hover:text-white"
                                        onClick={() => handleDayClick(day)} // Function to handle day click
                                    >
                                        {day}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600">No working days set.</p>
                            )}
                        </div>
                    </div>


                    {/* Working Hours */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Working Hours</h3>
                        <div className="flex flex-wrap gap-3">
                            {turf?.turf?.workingSlots.fromTime && turf?.turf.workingSlots.toTime ? (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 font-medium rounded-full shadow-md">
                                    {turf.turf.workingSlots.fromTime} - {turf.turf.workingSlots.toTime}
                                </span>
                            ) : (
                                <p className="text-gray-600">No working hours set.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-3 mx-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleDayEdit} // Define the edit functionality in the handler
                            className="text-gray-500 hover:text-white transition-colors flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full shadow-lg transform hover:scale-105"
                            aria-label="Edit"
                        >
                            <FaEdit className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">Edit</span>
                        </button>

                    </div>
                </div>
            </>
            {selectedDay && (<div className="mt-4 flex flex-col gap-6">
                {/* Editable Fields */}
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Working Day</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded px-3 py-2 w-40"
                            value={"selectedDay"}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">From Time</label>
                        <input
                            type="time"
                            className="border border-gray-300 rounded px-3 py-2 w-40"
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">To Time</label>
                        <input
                            type="time"
                            className="border border-gray-300 rounded px-3 py-2 w-40"
                            value={toTime}
                            onChange={(e) => setToTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Price</label>
                        <input
                            type="number"
                            className="border border-gray-300 rounded px-3 py-2 w-40"
                            value={price || 89}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Check Conflict Button */}
                <button
                    // onClick={checkConflicts}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded shadow-md"
                >
                    Check Conflict Bookings
                </button>

                {/* Conflict Slots */}
                {(conflictingSlots || []).length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Conflicting Slots</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {conflictingSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className="border border-red-300 bg-red-50 rounded p-2 text-sm text-red-700 shadow"
                                >
                                    {slot.fromTime} - {slot.toTime}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>)}

            {isEditDay ? (
                <div className="mt-4 flex flex-col gap-6">
                    {/* Editable Fields */}
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Working Day</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={"selectedDay"}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">From Time</label>
                            <input
                                type="time"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">To Time</label>
                            <input
                                type="time"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Price</label>
                            <input
                                type="number"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={price || 89}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Check Conflict Button */}
                    <button
                        // onClick={checkConflicts}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded shadow-md"
                    >
                        Check Conflict Bookings
                    </button>

                    {/* Conflict Slots */}
                    {(conflictingSlots || []).length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Conflicting Slots</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {conflictingSlots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="border border-red-300 bg-red-50 rounded p-2 text-sm text-red-700 shadow"
                                    >
                                        {slot.fromTime} - {slot.toTime}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div></div>
            )}

        </div>
    );
};

export default WorkingDaysManagement;
