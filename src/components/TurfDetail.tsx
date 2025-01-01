"use client";
import React, { useState } from "react";
import AvailableSlots from "./AvailableSlots";
import { TurfDetails } from "@/utils/type";
import TurfGallery from "./TurfGallery";
import MapComponent from "./OlaMapComponent";
import { useAppSelector } from "@/store/hooks";

interface Review {
    username: string;
    rating: number;
    comment: string;
}

interface TurfDetailsProps {
    turf: TurfDetails | null;
}

const TurfDetail: React.FC<TurfDetailsProps> = ({ turf }) => {
    const company = useAppSelector(state => state.companies.company)
    const [showSlot, setShowSlot] = useState<boolean>(false)
    const [isMapVisible, setIsMapVisible] = useState(false); // State to control map modal visibility
    console.log("MapVisible :", isMapVisible);

    // Fetch data from localStorage after the component is mounted


    const reviews: Review[] = [
        { username: "John Doe", rating: 4, comment: "Great turf, well maintained!" },
        { username: "Jane Smith", rating: 5, comment: "Loved the facilities here!" },
    ]
    // console.log("TURF Details Page");

    const toggleMapState = () => {
        setIsMapVisible(prev => !prev)
    }

    function toggleSlotView(): void {
        // throw new Error("Function not implemented.");
        setShowSlot(prev => !prev)
    }


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                {/* Header */}
                <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg flex justify-center items-center">
                    <h1 className="text-3xl font-bold">{turf?.turfName}</h1>
                </header>

                {/* Main Content */}
                <div className="container mx-auto py-8 px-6">
                    <div
                        className={`grid gap-8 ${showSlot ? "grid-cols-3" : "grid-cols-1 md:grid-cols-2"
                            }`}
                    >
                        {/* Turf Details */}
                        <div
                            className={`${showSlot ? "col-span-1" : "col-span-2"
                                } bg-gradient-to-b from-white to-green-50 rounded-lg shadow-xl p-8 space-y-6`}
                        >
                            <h2 className="text-green-800 text-2xl font-bold border-b-2 border-green-600 pb-2">
                                Turf Details
                            </h2>
                            <p className="text-gray-700 text-lg italic">{turf?.description}</p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Type
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        {turf?.turfType}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Size
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        {turf?.turfSize}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Location
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        {turf?.address}
                                    </p>
                                </div>
                                <div className="flex items-center">
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
                                                location={turf?.location}
                                                company={{ images: turf?.images || [], companyname: company?.companyname || "Turf company", phone: company?.phone || "N/A" }}
                                                toggleview={toggleMapState}
                                            />
                                            {/* <MapComponent location={company.location} company={company} toggleview={toggleMapState} /> */}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            {showSlot ? "" : <div className="bg-green-100 rounded-lg shadow-lg p-6 flex flex-col items-center">
                                <p className="text-green-800 text-3xl font-bold">₹{turf?.price}</p>
                                <p className="text-gray-600 text-lg">Per Hour</p>
                                <button
                                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 shadow-md"
                                    onClick={() => toggleSlotView()}
                                >
                                    Check Availability
                                </button>
                            </div>}

                        </div>

                        {/* Available Slots Section */}
                        {showSlot && (
                            <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
                                <AvailableSlots turf={turf} setShow={setShowSlot} />
                            </div>
                        )}
                    </div>

                    {/* Supported Games and Facilities */}
                    <div className="mt-12 flex gap-8">
                        {/* Supported Games */}
                        <div className="bg-white rounded-lg shadow-lg p-8 flex-1">
                            <h2 className="text-green-800 text-2xl font-bold border-b-2 border-green-600 pb-2">
                                Supported Games
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                {turf?.supportedGames.map((game, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-green-100 text-green-800 font-medium text-lg p-4 rounded-lg shadow-md flex justify-center items-center"
                                    >
                                        {game}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Facilities */}
                        <div className="bg-white rounded-lg shadow-lg p-8 flex-1">
                            <h2 className="text-green-800 text-2xl font-bold border-b-2 border-green-600 pb-2">
                                Facilities
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                                {turf?.facilities.map((facility, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-yellow-100 text-yellow-800 font-medium text-lg p-4 rounded-lg shadow-md flex justify-center items-center"
                                    >
                                        {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    {/* Turf Gallery */}
                    {/* Image Gallery */}
                    <TurfGallery images={turf?.images || []} />

                    {/* Reviews Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-xl font-bold text-green-700">Reviews</h2>
                        <div className="space-y-4 mt-4">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="bg-gray-100 p-4 rounded-md shadow-md">
                                    <p className="text-green-600 font-medium">
                                        {review.username}
                                    </p>
                                    <p className="text-yellow-500">
                                        Rating: {"⭐".repeat(review.rating)}
                                    </p>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TurfDetail;
