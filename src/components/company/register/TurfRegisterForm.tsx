"use client"

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from 'react-icons/fa';
import FireLoading from "@/components/FireLoading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import MapComponent from "@/components/OlaMapInput";
import { Location } from "@/components/OlaMapInput"
// import {} from "@/components/OlaMapInput"

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
    selectedGames: string[];
    location: Location | null;
    address: string | null;
}

interface TurfRegisterFormProps {
    onSubmit: (data: TurfRegisterFormData) => void;
}

const TurfRegisterForm: React.FC<TurfRegisterFormProps> = ({ onSubmit }) => {
    const router = useRouter()
    const [showMap, setShowMap] = useState(false);
    // const [location, setShowMap] = useState(false);
    const [location, setLocation] = useState<Location | null>(null); // Track selected location
    const [address, setAddress] = useState<string | null>(null)
    const [isLocationSelected, setIsLocationSelected] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility

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
            selectedGames: [],
            location: null,
            address: null
        },
    });
    useEffect(() => {
        if (isLocationSelected) {
            clearErrors("location");
        }
    }, [isLocationSelected]);

    const selectedFacilities = watch("selectedFacilities");
    const selectedGames = watch("selectedGames");
    const workingDays = watch("workingDays");

    const handleFacilityToggle = (facility: string) => {
        const updatedFacilities = selectedFacilities.includes(facility)
            ? selectedFacilities.filter((f) => f !== facility)
            : [...selectedFacilities, facility];

        clearErrors("selectedFacilities")
        setValue("selectedFacilities", updatedFacilities);
    };
    const handleGameToggle = (game: string) => {
        const updatedGames = selectedGames.includes(game)
            ? selectedGames.filter((f) => f !== game)
            : [...selectedGames, game];

        clearErrors("selectedGames")
        setValue("selectedGames", updatedGames);
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
            clearErrors("images");
            const newFiles = Array.from(event.target.files);

            const currentImages = watch("images") || [];

            const updatedImages = [...currentImages, ...newFiles];

            setValue("images", updatedImages);
        }
    };

    const handleDeleteImage = (index: number) => {
        const currentImages = watch("images") || [];
        const updatedImages = currentImages.filter((_: File, i: number) => i !== index);
        setValue("images", updatedImages);
    };

    const handleLocationCofirm = (location: Location | null, address: string | null) => {
        // console.log("LOCate IN GaiN :", location);
        // console.log("And Address : ", address);
        setIsMapVisible(false)
        setLocation(location)
        setAddress(address || null)
        setValue("location", location)
        setValue("address", address)
        clearErrors('location')
    }

    const toggleMapView = () => {
        setIsMapVisible(prev => !prev)
    }

    // const handlePinLocation = (pinnedLocation: Marker) => {
    //     try {
    //         if (!pinnedLocation || !pinnedLocation.latitude || !pinnedLocation.longitude) {
    //             console.error("Invalid location data");
    //             return;
    //         }
    //         setLocation(pinnedLocation);
    //         setValue("location", pinnedLocation)
    //         setIsLocationSelected(true);
    //         toast.success("Location pinned successfully!");
    //         clearErrors("location");
    //     } catch (error) {
    //         console.error("Error while pinning location:", error);
    //         toast.error("An error occurred while selecting the location. Please try again.");
    //     }
    // };


    const handleCloseMap = () => {
        setShowMap(false);
        setIsLocationSelected(false); // Reset location selection state when closing the map
    };

    const handleLocationRequest = () => {
        toast.info("Please enable location services for a more precise location.");
        setShowMap(true);
    };

    const handleFormSubmit = async (data: any) => {
        try {

            if (!data.images || data.images.length === 0) {
                setError("images", { type: "manual", message: "Please upload at least one turf image" });
                return;
            }

            if (!data.workingDays || data.workingDays.length === 0) {
                setError("workingDays", { type: "manual", message: "Select at least one working day!" });
                return;
            }

            if (!data.selectedFacilities || data.selectedFacilities.length === 0) {
                setError("selectedFacilities", { type: "manual", message: "Select at least one facility!" });
                return;
            }

            if (!data.selectedGames || data.selectedGames.length === 0) {
                setError("selectedGames", { type: "manual", message: "Select at least one supported game!" });
                return;
            }

            if (data.images.length > 5) {
                Swal.fire({
                    icon: "warning", // Specifies the warning icon
                    title: "Maximum 5 Turf Images Allowed ..!",
                })
                return
            }

            if (location && address) {
                clearErrors("location");
                const response: any = await onSubmit(data);
                if (response?.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Turf Registered Successfully!',
                        toast: true,
                        position: 'top-start',
                        showConfirmButton: false,
                        timer: 2000, // 2 seconds
                        timerProgressBar: true,
                    });

                    setTimeout(() => {
                        router.replace("/company/turf-management");
                    }, 2000);
                }
            } else {
                setError("location", { type: "manual", message: "Provide turf location!" });
                return
            }
        } catch (error) {
            console.error("Error while submitting the form:", error);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} />
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
                                {...register("description", {
                                    required: "Description is required",
                                    minLength: { value: 10, message: "Description must be at least 10 characters" },
                                    maxLength: { value: 500, message: "Description must be at most 500 characters" }
                                })}
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
                            <label className="block text-sm font-semibold text-green-900 mb-2">Price Per Hour</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                                {...register("price", { required: "Price is required" })}
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="p-4 rounded-lg shadow-lg bg-white w-full max-w-lg">
                                <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">Location</h2>
                                <MapComponent onConfrimAndClose={handleLocationCofirm} mapView={isMapVisible} toggleMapView={toggleMapView} />
                                {errors.location && (
                                    <p className="text-red-500 text-lg mt-2 text-center">{errors.location.message}</p>
                                )}
                                {location && (
                                    <p className="text-green-500 text-lg mt-2 text-center">Location Selected</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Middle Column */}
                <div className="space-y-6">
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
                    <div className="p-4 rounded-lg shadow-lg bg-white">


                        {/* Image */}
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Images</h2>
                        <div className="mb-4">
                            <label htmlFor="turfImages" className="block text-sm font-semibold text-green-900 mb-2">Turf Images</label>
                            <input
                                id="turfImages"
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400"
                                onChange={handleImageUpload}
                            />
                            {errors.images && <p className="text-red-500 text-lg mt-2">{errors.images.message}</p>}
                        </div>
                        {!isMapVisible && ( // Conditionally render based on map state
                            <div className="mt-4 flex flex-wrap relative z-10">
                                {Array.from(watch("images") || []).map((file: File, index: number) => (
                                    <div key={index} className="relative inline-block mr-4 mb-2">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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

                    {/* Supported Games Section */}
                    <div className="p-4 rounded-lg shadow-lg bg-white">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">Supported Games</h2>
                        <div className="flex flex-wrap gap-4">
                            {[
                                "Cricket",
                                "Football",
                                "Multi-purpose",
                                "Basketball",
                                "Tennis",
                                "Badminton",
                                "Hockey",
                                "Volleyball",
                            ].map((game) => (
                                <button
                                    key={game}
                                    type="button"
                                    className={`px-4 py-2 rounded-lg font-bold text-sm ${selectedGames.includes(game)
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-300 text-green-800"
                                        }`}
                                    onClick={() => handleGameToggle(game)}
                                >
                                    {game}
                                </button>
                            ))}
                        </div>
                        {errors.selectedGames && (
                            <p className="text-red-500 text-lg mt-2">
                                {errors.selectedGames.message}
                            </p>
                        )}
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
            {/* Conditional Map Rendering */}
            {/* {showMap && (
                <MapComponent />
            )} */}
        </>

    );
};

export default TurfRegisterForm;
