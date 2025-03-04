"use client";
import Header from "@/components/company/CompanyHeader";
import Sidebar from "@/components/company/CompanySidebar";
import TurfRegisterForm from "@/components/company/register/TurfRegisterForm";
import FireLoading from "@/components/FireLoading";
import { registerTurf } from "@/services/TurfApis";
import { useAppSelector } from "@/store/hooks";
import { FormSubmitted } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";


export default function Register() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const company = useAppSelector((state) => state.companies);

    const handleFormSubmit = async (formSubmitted: FormSubmitted): Promise<{ success: boolean } | undefined> => {
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
            formData.append("address", formSubmitted.address ? formSubmitted.address : "")
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


            setLoading(true);

            // const { data } = await axiosInstance.post("/api/v1/company/register-turf", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            const response = await registerTurf(formData)

            // console.log("Response Data:", data);

            if (response.success) {
                setLoading(false);
                toast.success("Turf Registered successfully!");
                setTimeout(() => router.replace("/company/turf-management"), 1500);
                return { success: true }
            }

            return { success: false }
        } catch (err: unknown) {
            // const apiError = err as APIError
            // console.error("Error While Register Company:", err);
            // toast.error(apiError.response?.data?.error || "Something went wrong!");
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error!",
                text: (err as Error)?.message || "Something went wrong. Please try again.",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timer: 3000,
                toast: true,
            });
            Swal.fire({
                icon: 'error',
                title: 'resigter Failed!',
                text: `${(err as Error).message}` || "Something went wrong while submitting the form",
                confirmButtonText: 'Try Again',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("User acknowledged the failure.");
                    // Handle retry logic or additional actions here
                }
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        // <div className="flex flex-col h-screen overflow-hidden">
        //     <TurfRegister />

        // </div>

        (<>
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
        </>)
    );
}