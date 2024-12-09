import Spinner from "@/components/Spinner";
import { availableFacilities, availableGames, axiosInstance } from "@/utils/constants";
import { TurfData } from "@/utils/type";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
availableFacilities
availableGames
Spinner

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



const TurfDetailsForm: React.FC<TurfDetailsProps> = ({ turf }) => {
    const [newImages, setNewImages] = useState<File[]>([]);
    const company: any = JSON.parse(localStorage.getItem("companyAuth") as any)
    const { control, handleSubmit, register, setError, clearErrors, reset, watch, setValue, formState: { errors } } = useForm<TurfDetails>({
        defaultValues: {
            turfName: turf.turf?.turfName,
            facilities: turf.turf?.facilities,
            supportedGames: turf.turf?.supportedGames,
            images: [],
            turfType: turf.turf?.turfType,
            turfSize: turf.turf?.turfSize,
            description: turf.turf?.description
        }
    });
    const [isEditable, setIsEditable] = useState(false);
    const [turfDetails, setTurfDetails] = useState<TurfData>(turf);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [existingImages, setExistingImages] = useState<string[]>(turf.turf?.images || []);


    const handleEdit = () => {
        setIsEditable(!isEditable);
    };

    const supportedGames = watch("supportedGames")
    const facilities = watch("facilities")

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
            const formData = { turfId: turf.turf?._id, index }

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

    const handleDeleteNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
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
            formData.append("turfId", JSON.stringify(turf.turf?._id))
            formData.append("turfName", turfDet.turfName);
            formData.append("price", JSON.stringify(turfDet.pricePerHour));
            formData.append("turfSize", turfDet.turfSize);
            formData.append("turfType", turfDet.turfType);
            formData.append("selectedFacilities", JSON.stringify(turfDet.facilities));
            formData.append("games", JSON.stringify(turfDet.supportedGames))
            formData.append("description", turfDet.description);
            formData.append("companyId", company?._id);



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
                                    defaultValue={turfDetails.turf?.turfSize || ""} // Pre-selects the value if available
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
                                    defaultValue={turfDetails.turf?.turfType || ""}
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
                                    defaultValue={turfDetails.turf?.price}
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
                                    defaultValue={turfDetails.turf?.description}
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


                        </div>
                        <div className="mb-4">
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

                            {/* Error display */}
                            {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
                            {loading ? <Spinner /> : ""}

                            {/* Existing Images */}
                            <div className="mt-4">
                                <h4 className="text-gray-700 font-medium mb-2">Existing Images</h4>
                                <div className="flex flex-wrap gap-4">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img
                                                src={image}
                                                alt={`Existing Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border"
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
                            </div>

                            {/* New Images */}
                            <div className="mt-4">
                                <h4 className="text-gray-700 font-medium mb-2">New Images</h4>
                                <div className="flex flex-wrap gap-4">
                                    {newImages.map((image, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img
                                                src={URL.createObjectURL(image)} // Convert File to previewable URL
                                                alt={`New Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setNewImages((prev) => prev.filter((_, i) => i !== index))
                                                }
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
                    {isEditable ? <button
                        type="submit"
                        className="mt-6 w-full py-2 px-4 rounded bg-blue-500 text-white font-semibold"
                        disabled={!isEditable}
                    >
                        Save Turf Details
                    </button> : <></>}

                </form>
            </div>
        </>
    );
};

export default TurfDetailsForm;
