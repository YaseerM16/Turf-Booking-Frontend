"use client"

import React from "react";
import { useForm, Controller } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";


const Calendar = dynamic(() => import("react-calendar"), { ssr: false });
interface Marker {
    latitude: number;
    longitude: number;
}
interface TurfRegisterFormData {
    turfName: string;
    description: string;
    turfSize: string;
    turfType: string;
    price: string;
    images: File[];
    workingDays: string[];
    fromTime: string;
    toTime: string;
    selectedFacilities: string[];
    location: Marker | null;
}

interface TurfRegisterFormProps {
    onSubmit: (data: TurfRegisterFormData) => void;
    handleLocationRequest: () => void;
    MapValidate: Marker | null;
}

const TurfRegisterForm: React.FC<TurfRegisterFormProps> = ({ onSubmit, handleLocationRequest, MapValidate }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm<TurfRegisterFormData>({
        defaultValues: {
            turfName: "",
            description: "",
            turfSize: "",
            turfType: "",
            price: "",
            images: [],
            workingDays: [],
            fromTime: "",
            toTime: "",
            selectedFacilities: [],
            location: null
        },
    });

    const selectedFacilities = watch("selectedFacilities");
    const workingDays = watch("workingDays");

    const handleFacilityToggle = (facility: string) => {
        const updatedFacilities = selectedFacilities.includes(facility)
            ? selectedFacilities.filter((f) => f !== facility)
            : [...selectedFacilities, facility];

        clearErrors("selectedFacilities")
        setValue("selectedFacilities", updatedFacilities);
    };

    const handleDayToggle = (day: string) => {
        const updatedDays = workingDays.includes(day)
            ? workingDays.filter((d) => d !== day)
            : [...workingDays, day];

        clearErrors("workingDays")
        setValue("workingDays", updatedDays);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            clearErrors("images")
            const files = Array.from(event.target.files);
            setValue("images", files); // Update the form state manually
        }
    };


    const handleFormSubmit = (data: any) => {
        try {
            // Check if no images are selected
            console.log("MapValidate val:", MapValidate);

            if (!data.images || data.images.length === 0) {
                setError("images", { type: "manual", message: "Please upload at least one turf image" });
            } else if (!data.workingDays || data.workingDays.length === 0) {
                setError("workingDays", { type: "manual", message: "Select Atleast One working day !" })
            } else if (!data.selectedFacilities || data.selectedFacilities.length === 0) {
                setError("selectedFacilities", { type: "manual", message: "Select Atleast One Facility !" })
            }
            //  else if (!MapValidate) {
            //     setError("location", { type: "manual", message: "Provide Turf Location !" })

            // }
            else {
                if (!MapValidate) {
                    setError("location", { type: "manual", message: "Provide Turf Location !" })
                    return
                }
                clearErrors("location")
                onSubmit(data); // If images are selected, submit the form
            }
        } catch (error) {
            console.log("Error While Submitting from the Turf Form :", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
                <div className="p-4 rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">Details</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-green-900 mb-2">Turf Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            {...register("turfName", { required: "Turf name is required" })}
                        />
                        {errors.turfName && <p className="text-red-500 text-sm">{errors.turfName.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-green-900 mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="turfSize" className="block text-sm font-semibold text-green-900 mb-2">
                            Turf Size
                        </label>
                        <select
                            id="turfSize"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            {...register("turfSize", { required: "Please select the turf size" })}
                        >
                            <option value="">Select Size</option>
                            <option value="5s">5s</option>
                            <option value="7s">7s</option>
                            <option value="11s">11s</option>
                        </select>
                        {errors.turfSize && <p className="text-red-500 text-sm">"Please select the turf size"{errors.turfSize.message}</p>}
                    </div>



                    <div className="mb-4">
                        <label htmlFor="turfType" className="block text-sm font-semibold text-green-900 mb-2">
                            Turf Type
                        </label>
                        <select
                            id="turfType"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            {...register("turfType", { required: "Please select the turf type" })}
                        >
                            <option value="">Select Turf Type</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                        {errors.turfType && <p className="text-red-500 text-sm">{errors.turfType.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-green-900 mb-2">Price</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            {...register("price", { required: "Price is required" })}
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>
                </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
                <div className="p-4 rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">Facilities</h2>
                    <div className="mb-4">
                        <label htmlFor="turfImages" className="block text-sm font-semibold text-green-900 mb-2">Turf Images</label>
                        <input
                            id="turfImages"
                            type="file"
                            multiple
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                            onChange={handleImageUpload}
                        />
                        {errors.images && <p className="text-red-500 text-lg mt-2">{errors.images.message}</p>}
                    </div>
                </div>

                <div className="p-4 rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">Facilities</h2>
                    <div className="flex flex-wrap gap-4">
                        {["Lighting", "Seating", "Changing Rooms", "Washrooms", "Parking", "Refreshment Kiosk", "Wi-Fi", "Coaching", "Equipment Rentals", "Rest Areas"].map((facility) => (
                            <button
                                key={facility}
                                type="button"
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${selectedFacilities.includes(facility) ? "bg-green-600 text-white" : "bg-gray-300 text-green-800"}`}
                                onClick={() => handleFacilityToggle(facility)}
                            >
                                {facility}
                            </button>
                        ))}
                    </div>
                    {errors.selectedFacilities && <p className="text-red-500 text-lg mt-2">{errors.selectedFacilities.message}</p>}

                </div>

            </div>

            {/* Right Column (Working Slots) */}
            <div className="space-y-6">
                <div className="p-4 rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">Working Slots</h2>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold text-green-900 mb-2">From</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                                {...register("fromTime", { required: "From time is required" })}
                            />
                            {errors.fromTime && <p className="text-red-500 text-sm">{errors.fromTime.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-semibold text-green-900 mb-2">To</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                                {...register("toTime", { required: "To time is required" })}
                            />
                            {errors.toTime && <p className="text-red-500 text-sm">{errors.toTime.message}</p>}
                        </div>

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-green-900 mb-2">Working Days</label>
                        <div className="flex flex-wrap gap-4">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`px-4 py-2 rounded-lg font-bold text-sm ${workingDays.includes(day) ? "bg-green-600 text-white" : "bg-gray-300 text-green-800"}`}
                                    onClick={() => handleDayToggle(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        {errors.workingDays && <p className="text-red-500 text-lg mt-2">{errors.workingDays.message}</p>}

                    </div>
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="p-4 rounded-lg shadow-lg bg-white">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Location</h2>
                        <button
                            type="button"
                            onClick={handleLocationRequest}
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
                        >
                            Select Location
                        </button>
                        {errors.location && <p className="text-red-500 text-lg mt-2">{errors.location.message}</p>}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center col-span-full">
                <button
                    type="submit"
                    className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg font-semibold text-xl hover:bg-green-700"
                >
                    Register Turf
                </button>
            </div>

        </form>
    );
};

export default TurfRegisterForm;
