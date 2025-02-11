"use client"
import React, { useState } from "react";
import TurfRegisterForm from "./TurfRegisterForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormSubmitted } from "@/utils/constants";
import { useRouter } from "next/navigation";
import FireLoading from "@/components/FireLoading";
import { useAppSelector } from "@/store/hooks";
import Header from "../CompanyHeader";
import Sidebar from "../CompanySidebar";
import { APIError } from "@/utils/type";
import { registerTurf } from "@/services/TurfApis";



const TurfRegister: React.FC = () => {
    const company = useAppSelector((state) => state.companies);
    // const companyId: any = company.company?._id
    const router = useRouter()
    const [loading, setLoading] = useState(false)


    const handleFormSubmit = async (formSubmitted: FormSubmitted) => {
        try {
            // console.log("formSubmitted : ", formSubmitted);

            const formData = new FormData();

            // Append files (images) to FormData
            if (formSubmitted.images && formSubmitted.images.length > 0) {
                formSubmitted.images.forEach((file: File) => {
                    formData.append(`TurfImages`, file); // Backend should handle multiple files under 'TurfImages'
                });
            }

            // Append other form fields to FormData
            formData.append("location", JSON.stringify({
                latitude: formSubmitted.location?.lat,
                longitude: formSubmitted.location?.lng,
            }));
            formData.append("address", formSubmitted.address || "")
            formData.append("turfName", formSubmitted.turfName);
            formData.append("price", formSubmitted.price);
            formData.append("turfSize", formSubmitted.turfSize);
            formData.append("turfType", formSubmitted.turfType);
            formData.append("workingDays", JSON.stringify(formSubmitted.workingDays));
            formData.append("selectedFacilities", JSON.stringify(formSubmitted.selectedFacilities));
            formData.append("fromTime", formSubmitted.fromTime);
            formData.append("toTime", formSubmitted.toTime);
            formData.append("description", formSubmitted.description);
            formData.append("games", JSON.stringify(formSubmitted.selectedGames))
            formData.append("companyId", company.company?._id as string);

            // console.log("");


            setLoading(true);

            const response = await registerTurf(formData)

            if (response?.success) {
                const { data } = response
                console.log("Response Data:", data);
                setLoading(false);
                toast.success("Turf Registered successfully!");
                setTimeout(() => router.replace("/company/turf-management"), 1500);
                return { success: true }
            }
        } catch (err: unknown) {
            console.error("Error While Register Company:", err);
            const apiError = err as APIError;
            toast.error(apiError?.response?.data?.error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
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
                                />
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TurfRegister;


