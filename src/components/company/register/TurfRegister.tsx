"use client"
import React, { useEffect, useState } from "react";
import TurfRegisterForm from "./TurfRegisterForm";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
// import Map from "@/components/map/Map";
import { axiosInstance } from "@/utils/constants";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import Spinner from "@/components/Spinner";
import FireLoading from "@/components/FireLoading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCompany } from "@/store/slices/CompanySlice";
import Header from "../CompanyHeader";
import Sidebar from "../CompanySidebar";




const Map = dynamic(() => import("@/components/map/Map"), {
    ssr: false, loading: () => (<div className="mb-4" style={{ marginBottom: 100 }}>
        <FireLoading renders={"Loading Map"} />
    </div>)
});



interface Marker {
    latitude: number;
    longitude: number;
}

const TurfRegister: React.FC = () => {
    const company = useAppSelector((state) => state.companies);
    const companyId: any = company.company?._id
    const dispatch = useAppDispatch()
    console.log("Company Id :", companyId);
    useEffect(() => {
        const storedCompany = localStorage.getItem("companyAuth");
        if (storedCompany) {
            dispatch(setCompany(JSON.parse(storedCompany)));
        }
    }, [dispatch]);
    const router = useRouter()
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState<Marker | null>(null); // Track selected location
    const [isLocationSelected, setIsLocationSelected] = useState(false);


    const handleLocationRequest = () => {
        toast.info("Please enable location services for a more precise location.");
        setShowMap(true);
    };
    const { clearErrors } = useForm();


    const handlePinLocation = (pinnedLocation: Marker) => {
        setLocation(pinnedLocation);
        setIsLocationSelected(true);
        toast.success("Location pinned successfully!");
        clearErrors("location");
    };

    const handleCloseMap = () => {
        setShowMap(false);
        localStorage.removeItem("USER_MARKER")
        setIsLocationSelected(false);
    };

    const handleFormSubmit = async (formSubmitted: any) => {
        try {
            console.log("formSubmitted : ", formSubmitted);

            const formData = new FormData();

            // Append files (images) to FormData
            if (formSubmitted.images && formSubmitted.images.length > 0) {
                formSubmitted.images.forEach((file: File, index: number) => {
                    formData.append(`TurfImages`, file); // Backend should handle multiple files under 'TurfImages'
                });
            }

            // Append other form fields to FormData
            formData.append("location", JSON.stringify({
                latitude: location?.latitude,
                longitude: location?.longitude,
            }));
            formData.append("turfName", formSubmitted.turfName);
            formData.append("price", formSubmitted.price);
            formData.append("turfSize", formSubmitted.turfSize);
            formData.append("turfType", formSubmitted.turfType);
            formData.append("workingDays", JSON.stringify(formSubmitted.workingDays));
            formData.append("selectedFacilities", JSON.stringify(formSubmitted.selectedFacilities));
            formData.append("fromTime", formSubmitted.fromTime);
            formData.append("toTime", formSubmitted.toTime);
            formData.append("description", formSubmitted.description);
            formData.append("games", formSubmitted.selectedGames)
            formData.append("companyId", companyId);

            console.log("FormData to Submit:", formData);

            setLoading(true);

            const { data } = await axiosInstance.post("/api/v1/company/register-turf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response Data:", data);

            if (data?.success) {
                setLoading(false);
                toast.success("Turf Registered successfully!", {
                    onClose: () => router.replace("/company/turf-management"),
                });
            }
        } catch (err: any) {
            console.error("Error While Register Company:", err);
            toast.error(err.response?.data?.error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} />
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div
                        className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center overflow-auto m-0 pt-0"
                        style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
                    >
                        <div className="bg-green-200 bg-opacity-60 backdrop-blur-lg shadow-xl rounded-lg w-full max-w-7xl h-full max-h-[90vh] overflow-y-auto lg:px-8 lg:py-10">
                            <h1 className="text-2xl lg:text-3xl font-bold text-center lg:mb-6 text-green-800">
                                REGISTER TURF
                            </h1>
                            {loading ?
                                <FireLoading renders={"Registering Turf"} />
                                : <TurfRegisterForm
                                    onSubmit={handleFormSubmit}
                                    handleLocationRequest={handleLocationRequest}
                                    MapValidate={location}
                                    MapIsSelected={isLocationSelected}
                                />
                            }

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
                </div>
            </div>
        </>
    );
};

export default TurfRegister;


