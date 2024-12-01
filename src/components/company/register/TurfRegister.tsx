"use client"
import React, { useState } from "react";
import TurfRegisterForm from "./TurfRegisterForm";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
// import Map from "@/components/map/Map";
import { axiosInstance } from "@/utils/constants";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });



interface Marker {
    latitude: number;
    longitude: number;
}

const TurfRegister: React.FC = () => {
    const [showMap, setShowMap] = useState(false);
    const router = useRouter()
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

    const handleMapInteraction = (locationData: any) => {
        if (locationData) {
            setIsLocationSelected(true);
        } else {
            setIsLocationSelected(false);
        }
    };
    ///register-turf
    const handleFormSubmit = async (data: any) => {

        // Handle form submission logic here, e.g., API call
        try {
            const formDataWithLocation = {
                ...data,
                location: {
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                },
            };
            console.log("Full Form :-", formDataWithLocation);

            // console.log("From is Submitting in TurfRegister :", data);

            // if (!location) {
            //     toast.error("Please Set the Location :")
            //     setError("location", { type: "manual", message: "Please select a location on the map." });
            //     return;
            // }
            // setLoading(true);
            // const { data } = await axiosInstance.post(
            //     "/api/v1/company/auth/register",

            // );
            // Debugging line
            // if (data?.success) {
            //     // setLoading(false);
            //     toast.success("Verification email sent successfully!", {
            //         onClose: () => router.replace(`/checkmail?type=verify`),
            //     });
            // }

        } catch (err: any) {
            console.log("Error While Register Company :", err);

            console.error('SignUpAPI error:', err); // Debugging line
            // setLoading(false);
            toast.error(err.response.data.error);
        }
    };




    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} />
            <div
                className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center overflow-auto"
                style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
            >
                <div className="bg-green-200 bg-opacity-60 backdrop-blur-lg shadow-xl rounded-lg p-3 w-full max-w-7xl h-full max-h-[90vh] overflow-y-auto lg:px-8 lg:py-10">
                    <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 lg:mb-6 text-green-800">
                        REGISTER TURF
                    </h1>
                    <TurfRegisterForm
                        onSubmit={handleFormSubmit}
                        handleLocationRequest={handleLocationRequest}
                        MapValidate={location}
                        MapIsSelected={isLocationSelected}
                    />
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
        </>

    );
};

export default TurfRegister;


//Spinner
// <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
//     <div className="relative flex justify-center items-center h-32 w-32">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-600 border-solid"></div>
//         <div className="absolute bg-gradient-to-r from-green-500 to-green-700 rounded-full h-20 w-20 flex justify-center items-center">
//             <span className="text-white text-lg font-semibold">Turf</span>
//         </div>
//     </div>
//     <p className="mt-4 text-green-800 text-lg font-medium">Registering your turf...</p>
// </div>