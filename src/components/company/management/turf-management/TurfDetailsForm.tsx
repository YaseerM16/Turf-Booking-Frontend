import { TurfData } from "@/utils/type";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

type TurfDetailsProps = {
    turf: TurfData; // Define the type for the props
};

interface TurfDetails {
    turfName: string;
    description: string;
    turfSize: string;
    turfType: string;
    pricePerHour: number;
    facilities: string[];
    supportedGames: string[];
    location: string;
    images: string[];
}

const availableFacilities = [
    "Lighting",
    "Seating",
    "Changing Rooms",
    "Washrooms",
    "Parking",
    "Refreshment Kiosk",
    "Wi-Fi",
    "Coaching",
    "Equipment Rentals",
    "Rest Areas",
];

const availableGames = [
    "Cricket",
    "Football",
    "Multi-purpose",
    "Basketball",
    "Tennis",
    "Badminton",
    "Hockey",
    "Volleyball",
];
const turfDets = {
    turfName: "KovaiArena456",
    description: "A premium turf for all sports activities.",
    turfSize: "Large",
    turfType: "Football Turf",
    pricePerHour: 1200,
    facilities: ["Lighting", "Seating", "Parking"],
    supportedGames: ["Cricket", "Football", "Basketball"],
    location: "123 Turf Lane, Sports City",
    images: [],
}

const TurfDetailsForm: React.FC<TurfDetailsProps> = ({ turf }) => {
    console.log("Turf IN Props ;", turf);
    const { control, handleSubmit, register, setError, clearErrors, watch, setValue, formState: { errors } } = useForm<TurfDetails>({
        defaultValues: {
            turfName: turf.turf?.turfName,
            facilities: turfDets.facilities,
            supportedGames: turfDets.supportedGames,
            images: []
        }
    });
    const [isEditable, setIsEditable] = useState(false);



    const [turfDetails, setTurfDetails] = useState<TurfData>(turf);

    const handleEdit = () => {
        if (isEditable) {
            // Console log the updated details
            // console.log("Updated Turf Details:", turfDetails);
        }
        setIsEditable(!isEditable);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTurfDetails({ ...turfDetails, [name]: value });
    };

    const supportedGames = watch("supportedGames")
    const facilities = watch("facilities")

    const toggleFacility = (facility: string) => {
        const updatedFacilities = facilities.includes(facility)
            ? facilities.filter((f) => f !== facility)
            : [...facilities, facility];

        clearErrors("facilities");
        setValue("facilities", updatedFacilities);
    };

    const toggleGame = (game: string) => {
        const updatedSupportives = supportedGames.includes(game)
            ? supportedGames.filter((g) => g !== game)
            : [...supportedGames, game]

        clearErrors("supportedGames")
        setValue("supportedGames", updatedSupportives)
    };

    const onSubmit = (data: TurfDetails) => {
        setIsEditable(false);
        console.log("onSubmitdata: ", data);

        console.log("Facilities Len :", data.facilities.length);

        if (!data.facilities || data.facilities.length === 0) {
            setError("facilities", { type: "manual", message: "Select at least one facility!" });
            return;
        }
        if (!data.supportedGames || data.supportedGames.length === 0) {
            setError("supportedGames", { type: "manual", message: "Select at least one supported games!" });
            return;
        }

        clearErrors()
        console.log("Form Submitted with data:", data);
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">

            <form onSubmit={handleSubmit(onSubmit)} className={isEditable ? "editable" : "view-only"}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Turf Details</h1>
                    {isEditable ? <></> : <button
                        onClick={handleEdit}
                        className="px-4 py-2 rounded bg-blue-500 text-white"
                    >
                        Edit Turf
                    </button>}

                </div>
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Turf Details */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Turf Name</label>
                            <input
                                {...register("turfName", { required: "Turf name is required" })}
                                type="text"
                                name="turfName"
                                defaultValue={turfDetails.turf?.turfName}
                                // value={turf.turf?.turfName}
                                readOnly={!isEditable}
                                className={`w-full p-2 border rounded ${isEditable ? "border-blue-500" : "bg-gray-100 border-gray-300"}`}
                            />
                            {errors.turfName && <span className="text-red-500 text-sm">{errors.turfName.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Turf Size</label>
                            <input
                                {...register("turfSize", { required: "Turf size is required" })}
                                type="text"
                                name="turfSize"
                                defaultValue={turfDetails.turf?.turfSize}
                                readOnly={!isEditable}
                                className={`w-full p-2 border rounded ${isEditable ? "border-blue-500" : "bg-gray-100 border-gray-300"}`}
                            />
                            {errors.turfSize && <span className="text-red-500 text-sm">{errors.turfSize.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Turf Type</label>
                            <input
                                {...register("turfType", { required: "Turf type is required" })}
                                type="text"
                                name="turfType"
                                defaultValue={turfDetails.turf?.turfSize}
                                readOnly={!isEditable}
                                className={`w-full p-2 border rounded ${isEditable ? "border-blue-500" : "bg-gray-100 border-gray-300"}`}
                            />
                            {errors.turfType && <span className="text-red-500 text-sm">{errors.turfType.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Price Per Hour</label>
                            <input
                                {...register("pricePerHour", { required: "Price per hour is required", valueAsNumber: true })}
                                type="number"
                                name="pricePerHour"
                                defaultValue={turfDetails.turf?.price}
                                readOnly={!isEditable}
                                className={`w-full p-2 border rounded ${isEditable ? "border-blue-500" : "bg-gray-100 border-gray-300"}`}
                            />
                            {errors.pricePerHour && <span className="text-red-500 text-sm">{errors.pricePerHour.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Location</label>
                            <input
                                {...register("location", { required: "Location is required" })}
                                type="text"
                                name="location"
                                defaultValue={turfDetails.turf?.location.latitude}
                                readOnly={!isEditable}
                                className={`w-full p-2 border rounded ${isEditable ? "border-blue-500" : "bg-gray-100 border-gray-300"}`}
                            />
                            {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                        </div>
                    </div>

                    {/* Middle Column - Facilities and Supported Games */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Facilities</label>
                            <div className="flex flex-wrap gap-2">
                                {availableFacilities.map((facility) => (
                                    <button
                                        key={facility}
                                        type="button"
                                        onClick={() => toggleFacility(facility)}
                                        className={`px-3 py-1 rounded-full ${turfDetails.turf?.facilities.includes(facility) // Check directly from the form's facilities value
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-300 text-gray-700"
                                            }`}
                                        disabled={!isEditable} // Disable the button if not editable
                                    >
                                        {facility}
                                    </button>
                                ))}
                            </div>
                            {errors.facilities && (
                                <span className="text-red-500 text-sm">{errors.facilities.message}</span>
                            )}
                        </div>


                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-1">Supported Games</label>
                            <div className="flex flex-wrap gap-2">
                                {availableGames.map((game) => (
                                    <button
                                        key={game}
                                        type="button"
                                        onClick={() => toggleGame(game)}
                                        className={`px-3 py-1 rounded-full ${turfDetails.turf?.facilities.includes(game)
                                            ? "bg-yellow-500 text-white"
                                            : "bg-gray-300 text-gray-700"
                                            }`}
                                        disabled={!isEditable}
                                    >
                                        {game}
                                    </button>
                                ))}
                            </div>
                            {errors.supportedGames && <span className="text-red-500 text-sm">{errors.supportedGames.message}</span>}
                        </div>


                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 font-medium mb-1">Images</label>
                        <input
                            {...register("images", { validate: (value) => value.length > 0 || "Please upload at least one image" })}
                            type="file"
                            name="images"
                            multiple
                            disabled={!isEditable} // Disable the input when not editable
                            className={`w-full p-2 border rounded ${!isEditable ? "bg-gray-200 cursor-not-allowed" : ""}`} // Add visual feedback
                        />
                        {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
                    </div>

                </div>
                {isEditable ? <button
                    type="submit"
                    className="mt-6 w-full py-2 px-4 rounded bg-blue-500 text-white font-semibold"
                    disabled={!isEditable}
                >
                    Save Turf Details
                </button> : <></>}

            </form>
        </div>
    );
};

export default TurfDetailsForm;
