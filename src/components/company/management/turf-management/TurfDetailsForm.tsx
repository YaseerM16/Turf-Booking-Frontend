import MapComponent from "@/components/OlaMapComponent";
import Spinner from "@/components/Spinner";
import { availableFacilities, availableGames, axiosInstance } from "@/utils/constants";
import { TurfData } from "@/utils/type";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Sidebar from "../../CompanySidebar";
import Header from "../../CompanyHeader";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

type TurfDetailsProps = {
    turf: TurfData | null; // Define the type for the props
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



const TurfDetailsForm: React.FC<TurfDetailsProps> = ({ turf }) => {
    const [newImages, setNewImages] = useState<File[]>([]);
    const company = useAppSelector(state => state.companies.company)
    const { handleSubmit, register, setError, clearErrors, reset, watch, setValue, formState: { errors } } = useForm<TurfDetails>({
        defaultValues: {
            turfName: turf?.turf?.turfName,
            facilities: turf?.turf?.facilities,
            supportedGames: turf?.turf?.supportedGames,
            images: [],
            turfType: turf?.turf?.turfType,
            turfSize: turf?.turf?.turfSize,
            description: turf?.turf?.description
        }
    });
    const [isEditable, setIsEditable] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [existingImages, setExistingImages] = useState<string[]>(turf?.turf?.images || []);
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility
    const [expandedImage, setExpandedImage] = useState<string | null>(null);


    const handleEdit = () => {
        setIsEditable(!isEditable);
    };

    const supportedGames = watch("supportedGames")
    const facilities = watch("facilities")

    const toggleMapState = () => {
        setIsMapVisible(prev => !prev)
    }

    const handleNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Convert FileList to an array of File objects
            const newFilesArray = Array.from(files);

            // Update the state with new File objects
            setNewImages((prev) => [...prev, ...newFilesArray]);
        }
        clearErrors("images");
    };

    const handleDeleteExistingImage = async (index: number) => {
        try {
            console.log("INdex :", index);
            setLoading(true)
            const formData = { turfId: turf?.turf?._id, index }

            const { data } = await axiosInstance.patch("/api/v1/company/delete-turf-image", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });

            console.log("Response Data:", data);

            if (data?.success) {
                console.log("Result from delete Image :", data);

                // setLoading(false);
                // const updatedImages = existingImages.filter((_, i) => i !== index);
                setExistingImages(data.images);
                setLoading(false)
                toast.success("Turf Image Deleted successfully!");
                // setTimeout(() => router.replace("/company/turf-management"), 1500);
            }
        } catch (error) {
            console.error("Error while Deleting the Existing Image:", error);
        }

    };

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

    const onSubmit = async (turfDet: TurfDetails) => {
        setIsEditable(false);
        if (!turfDet.facilities || turfDet.facilities.length === 0) {
            setError("facilities", { type: "manual", message: "Select at least one facility!" });
            setIsEditable(true)
            return;
        }
        if (!turfDet.supportedGames || turfDet.supportedGames.length === 0) {
            setError("supportedGames", { type: "manual", message: "Select at least one supported games!" });
            setIsEditable(true)
            return;
        }
        if (newImages.length == 0 && existingImages.length == 0) {
            setError("images", { type: "manual", message: "Select atleast one image" })
            setIsEditable(true)
            return
        }
        // console.log("new Images :", newImages);
        clearErrors()
        // console.log("edited Form :-", data);
        // "/api/v1/company/edit-turf"
        try {
            const formData = new FormData()

            // Append files (images) to FormData
            console.log("Data Edited Images :", newImages);


            if (newImages && newImages.length > 0) {
                newImages.forEach((file: File) => {
                    formData.append(`TurfImages`, file); // Backend should handle multiple files under 'TurfImages'
                });
            }
            formData.append("turfId", JSON.stringify(turf?.turf?._id))
            formData.append("turfName", turfDet.turfName);
            formData.append("price", JSON.stringify(turfDet.pricePerHour));
            formData.append("turfSize", turfDet.turfSize);
            formData.append("turfType", turfDet.turfType);
            formData.append("selectedFacilities", JSON.stringify(turfDet.facilities));
            formData.append("games", JSON.stringify(turfDet.supportedGames))
            formData.append("description", turfDet.description);
            formData.append("companyId", company?._id as string);



            const { data } = await axiosInstance.put("/api/v1/company/edit-turf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });
            if (data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Turf Details Updated Successfully!',
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 2000, // 2 seconds
                    timerProgressBar: true,
                });

                console.log("Updated RESULT :", data.turf);
                const updatedTurf: TurfDetails = data.turf
                setExistingImages(updatedTurf.images)
                setNewImages([])
                if (imageInputRef.current) {
                    imageInputRef.current.value = ""; // Reset the file input value
                }
                reset({
                    turfName: updatedTurf.turfName,
                    facilities: updatedTurf.facilities,
                    supportedGames: updatedTurf.supportedGames,
                    turfType: updatedTurf.turfType,
                    turfSize: updatedTurf.turfSize,
                    description: updatedTurf.description
                })
            }
            //if (isRegistered) res.status(200).json({ success: true, turf: isRegistered });


        } catch (error) {
            console.log("Error While Edit Turf : ", error);
        }


    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />
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
                                            defaultValue={turf?.turf?.turfName}
                                            // value={turf.turf?.turfName}
                                            readOnly={!isEditable}
                                            className={`w-full p-2 border rounded ${isEditable ? "border-green-500" : "bg-gray-100 border-gray-300"}`}
                                        />
                                        {errors.turfName && <span className="text-red-500 text-sm">{errors.turfName.message}</span>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="turfSize" className="block text-sm font-semibold text-green-900 mb-2">
                                            Turf Size
                                        </label>
                                        <select
                                            id="turfSize"
                                            {...register("turfSize", { required: "Please select the turf size" })}
                                            defaultValue={turf?.turf?.turfSize || ""} // Pre-selects the value if available
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-400 ${isEditable ? "border-green-500" : "bg-gray-100 border-gray-300"
                                                }`}
                                            disabled={!isEditable} // Disables the dropdown if not editable
                                        >
                                            <option value="">Select Size</option>
                                            <option value="5s">5s</option>
                                            <option value="7s">7s</option>
                                            <option value="11s">11s</option>
                                        </select>
                                        {errors.turfSize && (
                                            <p className="text-red-500 text-sm">{errors.turfSize.message}</p>
                                        )}
                                    </div>


                                    <div className="mb-4">
                                        <label htmlFor="turfType" className="block text-gray-600 font-medium mb-1">
                                            Turf Type
                                        </label>
                                        <select
                                            id="turfType"
                                            {...register("turfType", { required: "Turf type is required" })}
                                            defaultValue={turf?.turf?.turfType || ""}
                                            disabled={!isEditable} // Disable dropdown if not editable
                                            className={`w-full p-2 border rounded ${isEditable ? "border-green-500" : "bg-gray-100 border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select Turf Type</option>
                                            <option value="Closed">Closed</option>
                                            <option value="Open">Open</option>
                                        </select>
                                        {errors.turfType && (
                                            <span className="text-red-500 text-sm">{errors.turfType.message}</span>
                                        )}
                                    </div>


                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium mb-1">Price Per Hour</label>
                                        <input
                                            {...register("pricePerHour", { required: "Price per hour is required", valueAsNumber: true })}
                                            type="number"
                                            name="pricePerHour"
                                            defaultValue={turf?.turf?.price}
                                            readOnly={!isEditable}
                                            className={`w-full p-2 border rounded ${isEditable ? "border-green-500" : "bg-gray-100 border-gray-300"}`}
                                        />
                                        {errors.pricePerHour && <span className="text-red-500 text-sm">{errors.pricePerHour.message}</span>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium mb-1">Turf Description</label>
                                        <textarea
                                            {...register("description", { required: "Turf description is required" })}
                                            name="description"
                                            defaultValue={turf?.turf?.description}
                                            readOnly={!isEditable}
                                            className={`w-full p-2 border rounded resize-none ${isEditable ? "border-green-500" : "bg-gray-100 border-gray-300"}`}
                                            rows={3} // Adjust the rows attribute to control the height of the textarea
                                        />
                                        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
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
                                                    className={`px-3 py-1 rounded-full ${facilities.includes(facility) // Use facilities from watch() for dynamic updates
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
                                                    className={`px-3 py-1 rounded-full ${supportedGames.includes(game)
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
                                    <div
                                        className="border border-gray-300 rounded-lg shadow-md p-4 relative bg-cover bg-center"
                                        style={{ backgroundImage: `url('/map-background.jpg')` }}
                                    >
                                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                                        <div className="relative">
                                            <h3 className="text-lg font-semibold text-white mb-3">
                                                Turf Location
                                            </h3>
                                            <MapComponent
                                                location={turf?.turf?.location}
                                                company={{
                                                    images: turf?.turf?.images || [], // Ensure it's an array
                                                    companyname: company?.companyname || "Default Company Name", // Provide a default fallback
                                                    phone: company?.phone || "N/A", // Provide a default fallback
                                                }}
                                                toggleview={toggleMapState}
                                            />

                                        </div>
                                    </div>

                                </div>
                                <div className="mb-4">
                                    {isEditable && <>
                                        <label className="block text-gray-600 font-medium mb-1">Images</label>
                                        <input
                                            type="file"
                                            name="images"
                                            accept="image/*"
                                            multiple
                                            disabled={!isEditable}
                                            onChange={handleNewImages}
                                            ref={imageInputRef}
                                            className={`w-full p-2 border rounded ${!isEditable ? "bg-gray-200 cursor-not-allowed" : ""}`}
                                        />
                                    </>}

                                    {/* Error display */}
                                    {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
                                    {loading ? <Spinner /> : ""}
                                    <div className="mt-4 flex flex-wrap relative z-10">

                                        {/* Existing Images */}
                                        <div className="mt-4">
                                            <h4 className="text-gray-700 font-medium mb-2">Existing Images</h4>
                                            <div className="flex flex-wrap gap-4">
                                                {existingImages.map((image, index) => (
                                                    <div key={index} className="relative w-24 h-24">
                                                        <Image
                                                            src={image}
                                                            alt={`Existing Image ${index + 1}`}
                                                            width={96}
                                                            height={96}
                                                            className="w-full h-full object-cover rounded-lg border cursor-pointer"
                                                            onClick={() => setExpandedImage(image)} // Set the clicked image
                                                        />
                                                        {isEditable && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteExistingImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                                            >
                                                                ✖
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {expandedImage && (
                                                <div
                                                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                                    onClick={() => setExpandedImage(null)} // Close when clicking outside
                                                >
                                                    <div className="relative">
                                                        <Image
                                                            src={expandedImage}
                                                            alt="Expanded Image"
                                                            width={500}
                                                            height={500}
                                                            className="w-auto h-auto max-w-full max-h-full rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setExpandedImage(null)} // Close button
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                        {/* New Images */}
                                        <div className="mt-4">
                                            {isEditable && <h4 className="text-gray-700 font-medium mb-2">New Images</h4>}
                                            <div className="flex flex-wrap gap-4">
                                                {newImages.map((image, index) => (
                                                    <div key={index} className="relative w-24 h-24">
                                                        <Image
                                                            src={URL.createObjectURL(image)} // Convert File to previewable URL
                                                            alt={`New Image ${index + 1}`}
                                                            className="w-full h-full object-cover rounded-lg border"
                                                            layout="fill" // Makes it responsive within the container
                                                            objectFit="cover" // Ensures the image maintains aspect ratio
                                                            unoptimized // Allows local file URLs without optimization
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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
                </div>
            </div>
            <footer className="bg-green-700 text-white py-4">
                <div className="container mx-auto text-center">
                    <p className="text-sm">© 2024 Turf Booking. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default TurfDetailsForm;
