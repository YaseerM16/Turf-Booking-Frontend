import Spinner from "@/components/Spinner";
import { editWorkingDayDetails, getDetailsOfDayApi } from "@/services/companyApi";
import { axiosInstance, daysOrder } from "@/utils/constants";
import { TurfData } from "@/utils/type";
import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";


const WorkingDaysManagement: React.FC<{ turf: TurfData, workingDaysArr: string[] }> = ({ turf, workingDaysArr }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditDay, setIsEditDay] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [fromTimeError, setFromTimeError] = useState<string | null>(null);
    const [toTimeError, setToTimeError] = useState<string | null>(null);
    const [dayPriceError, setDayPriceError] = useState<string | null>(null);
    const [workingDaysError, setworkingDaysError] = useState<string | null>(null);
    const [spinLoading, setSpinLoading] = useState<boolean>(false)
    const [dayLoading, setDayLoading] = useState<boolean>(false)
    const [dayPrice, setDayPrice] = useState<number | null>(null)
    const [editFromTime, setEditFromTime] = useState("");
    const [editFromTimeError, setEditFromTimeError] = useState<string | null>(null)
    const [editToTimeError, setEditToTimeError] = useState<string | null>(null)
    const [editPriceError, setEditPriceError] = useState<string | null>(null)
    const [editToTime, setEditToTime] = useState("");
    const [editPrice, setEditPrice] = useState<string | number>("");

    const toggleEdit = () => setIsEditing(!isEditing);
    const toggleDayEdit = () => setIsEditDay(!isEditDay);

    const handleToggleDay = (day: string) => {
        if (workingDays.includes(day)) {
            // Remove the day if already selected
            setWorkingDays(workingDays.filter((d: string) => d !== day));
        } else {
            // Add the day if not selected
            setWorkingDays([...workingDays, day]);
        }
    };

    const handleDayClick = async (day: string) => {
        try {
            setDayLoading(true);
            const data = await getDetailsOfDayApi(turf.turf?._id as string, day);
            console.log("Details of Day:", data.dayDetails.dayDets);
            setEditFromTime(data.dayDetails.dayDets?.fromTime || "");
            setEditToTime(data.dayDetails.dayDets?.toTime || "");
            setEditPrice(data.dayDetails.dayDets?.price || 0);
            setDayLoading(false);
            setSelectedDay(day);
        } catch (error) {
            console.log("Error while getting day details:", error);
        } finally {
            setDayLoading(false);
        }
    };


    const handleSubmit = async () => {
        setFromTimeError(null)
        setToTimeError(null)
        setworkingDaysError(null)
        // Submit new working days and hours
        // console.log("Working Hours:", { fromTime, toTime });
        if (fromTime == "" || fromTime == "00:00") {
            setFromTimeError("Provide the From Time")
            return
        }

        if (toTime == "" || toTime == "00:00") {
            setToTimeError("Provide the To Time")
            return
        }

        if (!dayPrice || dayPrice == null) {
            setDayPriceError("Provide Price for the Day")
            return
        }

        if (workingDays.length == 0) {
            console.log("working day error setted :");
            setworkingDaysError("No Working day were selected")
            return
        }
        // "/:turfId/add-working-days"

        setFromTimeError(null)
        setToTimeError(null)
        setDayPriceError(null)
        setworkingDaysError(null)
        // const workingDaysUpdate = workingDays
        // const formTimeUpdate = fromTime
        // const toTimeUpdate = toTime
        const turfId = turf.turf?._id
        const payload = {
            workingDays: workingDays, // Updated working days
            fromTime: fromTime,      // Updated start time
            toTime: toTime,           // Updated end time
            price: dayPrice
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

    const editDayDetails = async () => {
        try {

            setEditFromTimeError(null)
            setEditToTimeError(null)
            setEditPriceError(null)
            // Submit new working days and hours
            // console.log("Working Hours:", { fromTime, toTime });
            if (editFromTime == "" || editFromTime == "00:00") {
                setEditFromTimeError("Provide the From Time")
                return
            }

            if (editToTime == "" || editToTime == "00:00") {
                setEditToTimeError("Provide the To Time")
                return
            }

            if (!editPrice || editPrice == null || editPrice == 0) {
                setEditPriceError("Provide Price for the Day")
                return
            }

            const updates = {
                fromTime: editFromTime,
                toTime: editToTime,
                price: editPrice,
                day: selectedDay
            }

            const data = await editWorkingDayDetails(turf.turf?._id as string, updates)
            if (data.success) {
                Swal.fire({
                    title: "Success!",
                    text: "The working day details have been updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: data.message || "Something went wrong while updating the working day details.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
            }

            setEditFromTimeError(null)
            setEditToTimeError(null)
            setEditPriceError(null)

        } catch (error) {
            console.log("Error while Edit the Day Details :", error);
        }
    }

    // async function genSlot() {
    //     try {
    //         console.log("GenSlot is Called :");

    //         const response = await axiosInstance.get(`${BACKEND_COMPANY_URL}/example-gen-slots/${turf.turf?._id}`)
    //         console.log("TESPosnw is :", response);

    //     } catch (error) {
    //         console.log("Error while try Gen Slots :", error);
    //     }
    // }

    return (
        (<div className="mb-6 flex flex-col p-4 bg-white rounded-lg shadow-lg">
            {!isEditing ? (
                // Display Mode
                (<>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Add Working days</h3>
                        {/* Working Days */}
                        <div className="flex flex-wrap gap-3">
                            {daysOrder.map((day) => (
                                <span
                                    key={day}
                                    className={`px-3 py-1 rounded-full shadow-md ${workingDaysArr.includes(day)
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
                </>)
            ) : (
                // Edit Mode
                (<div className="mt-4">
                    {/* Weekdays List with Add Option */}
                    <div className="flex flex-wrap gap-3">
                        {daysOrder.map((day) => {
                            const isDayInWorkingSlots = workingDaysArr.includes(day);
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
                        <h3 className="text-lg font-medium mb-2">Add Working Days</h3>
                        <div className="flex items-center gap-4">
                            From time
                            <div>
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
                            <div>
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
                            <label className="block text-gray-700 font-medium mb-1">Price</label>
                            <div className="d-flex">
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-3 py-2 w-40"
                                    value={dayPrice || ""}
                                    onChange={(e) => setDayPrice(Number(e.target.value))}
                                />
                            </div>
                            {/* Error message for priceDay */}
                            {dayPriceError && (
                                <div className="text-red-500 text-sm mt-1">
                                    {dayPriceError} {/* Display the error message here */}
                                </div>
                            )}
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
                </div>)
            )}
            <>
                <div className="mt-4 flex flex-wrap gap-6">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Edit Working Days</h3>
                        <div className="flex flex-wrap gap-3">
                            {(workingDaysArr || []).length > 0 ? (
                                workingDaysArr.map((day, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 font-medium rounded-full shadow-md cursor-pointer transition-all 
                                    ${selectedDay === day
                                                ? "bg-green-700 text-white"
                                                : "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
                                            }`}
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
                </div>
                {/* <div className="mt-3 mx-3 flex items-center justify-between">
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
                </div> */}
            </>

            {dayLoading ? <Spinner /> : <></>}

            {selectedDay && (
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-6">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Working Day</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={selectedDay}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">From Time</label>
                            <input
                                type="time"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={editFromTime}
                                readOnly={!isEditDay}
                                onChange={(e) => setEditFromTime(e.target.value)}
                            />
                            {editFromTimeError && (
                                <div className="text-red-500 text-sm mt-1">
                                    {editFromTimeError} {/* Display the error message here */}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">To Time</label>
                            <input
                                type="time"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={editToTime}
                                readOnly={!isEditDay}
                                onChange={(e) => setEditToTime(e.target.value)}
                            />
                            {editToTimeError && (
                                <div className="text-red-500 text-sm mt-1">
                                    {editToTimeError} {/* Display the error message here */}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Price</label>
                            <input
                                type="number"
                                className="border border-gray-300 rounded px-3 py-2 w-40"
                                value={editPrice || ""}
                                readOnly={!isEditDay}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                            />
                            {editPriceError && (
                                <div className="text-red-500 text-sm mt-1">
                                    {editPriceError} {/* Display the error message here */}
                                </div>
                            )}
                        </div>
                    </div>
                    {isEditDay ? (
                        <div className="flex gap-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded shadow-md"
                                onClick={() => editDayDetails()}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDay(null)
                                    toggleDayEdit()
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded shadow-md"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={toggleDayEdit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded shadow-md"
                        >
                            Edit Day
                        </button>
                    )}
                </form>
            )}
            {/* <button type="button" onClick={() => genSlot()}>srgrenrggenjg</button> */}
        </div>)
    );
};

export default WorkingDaysManagement;
