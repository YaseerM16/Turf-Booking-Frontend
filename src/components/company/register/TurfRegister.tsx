"use client"
import React, { useState } from "react";
import TurfRegisterForm from "./TurfRegisterForm";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import Map from "@/components/map/Map";

interface Marker {
    latitude: number;
    longitude: number;
}

const TurfRegister: React.FC = () => {
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState<Marker | null>(null); // Track selected location
    const [isLocationSelected, setIsLocationSelected] = useState(false);
    const handleLocationRequest = () => {
        toast.info("Please enable location services for a more precise location.");
        setShowMap(true);
    };
    const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();


    const handlePinLocation = (pinnedLocation: Marker) => {
        setLocation(pinnedLocation);
        setIsLocationSelected(true); // Mark location as selected
        toast.success("Location pinned successfully!");
        clearErrors("location");
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setIsLocationSelected(false); // Reset location selection state when closing the map
    };
    const handleFormSubmit = (data: any) => {
        console.log(data);
        // Handle form submission logic here, e.g., API call
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center overflow-auto"
            style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
        >
            <div className="bg-green-200 bg-opacity-60 backdrop-blur-lg shadow-xl rounded-lg p-3 w-full max-w-7xl h-full max-h-[90vh] overflow-y-auto lg:px-8 lg:py-10">
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-6 text-green-800">
                    REGISTER TURF
                </h1>
                <TurfRegisterForm onSubmit={handleFormSubmit} handleLocationRequest={handleLocationRequest} />
            </div>

            {showMap && (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full h-[50%] md:h-[60%] lg:h-[70%] max-w-full md:max-w-3xl rounded-md shadow-lg overflow-hidden">
                        <Map onPinLocation={handlePinLocation} />

                        {/* Button Controls */}
                        <div className="absolute bottom-4 left-4 space-x-2 md:space-x-4">
                            <button
                                onClick={handleCloseMap}
                                className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-red-600 text-sm md:text-base"
                            >
                                Close Map
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default TurfRegister;

