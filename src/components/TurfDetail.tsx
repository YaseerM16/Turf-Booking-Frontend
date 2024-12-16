"use client";
import React, { useState } from "react";
import AvailableSlots from "./AvailableSlots";
import { useParams, useRouter } from "next/navigation";
import { TurfDetails } from "@/utils/type";
import TurfGallery from "./TurfGallery";
useParams

interface Review {
    username: string;
    rating: number;
    comment: string;
}

interface TurfDetailsProps {
    turf: TurfDetails | null;
}

const TurfDetail: React.FC<TurfDetailsProps> = ({ turf }) => {
    const router = useRouter()
    const [showSlot, setShowSlot] = useState<boolean>(false)
    console.log("Turf Details Gainded in TurfDetail Comp :", turf);

    const reviews: Review[] = [
        { username: "John Doe", rating: 4, comment: "Great turf, well maintained!" },
        { username: "Jane Smith", rating: 5, comment: "Loved the facilities here!" },
    ]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    console.log("TURF Details Page");


    function toggleSlotView(): void {
        // throw new Error("Function not implemented.");
        setShowSlot(prev => !prev)
    }

    return (
        <>
            {showSlot ? <AvailableSlots turf={turf} /> : <>
                <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                    {/* Header */}
                    <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                        <h1 className="text-3xl font-bold text-start ml-[280px]">{turf?.turfName}</h1>
                    </header>

                    {/* Main Content */}
                    <div className="container mx-auto py-8 px-6 space-y-8">
                        {/* Turf Details & Facilities Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Turf Details */}
                            <div className="bg-gradient-to-b from-white to-green-50 rounded-lg shadow-xl p-8 space-y-6">
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
                                </div>

                                {/* Price Section */}
                                <div className="bg-green-100 rounded-lg shadow-lg p-6 flex flex-col items-center">
                                    <p className="text-green-800 text-3xl font-bold">₹{turf?.price}</p>
                                    <p className="text-gray-600 text-lg">Per Hour</p>
                                    <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 shadow-md"
                                        onClick={() => toggleSlotView()}
                                    >
                                        Check Availability
                                    </button>
                                </div>
                                {/* Reviews Section */}
                                <div className="bg-white rounded-lg shadow-lg mt-8 p-6">
                                    <h2 className="text-xl font-bold text-green-700">Reviews</h2>
                                    <div className="space-y-4 mt-4">
                                        {reviews.map((review, idx) => (
                                            <div key={idx} className="bg-gray-100 p-4 rounded-md shadow-md">
                                                <p className="text-green-600 font-medium">{review.username}</p>
                                                <p className="text-yellow-500">Rating: {"⭐".repeat(review.rating)}</p>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="text-green-700 font-medium mt-6">Leave a Review</h3>
                                    <form className="mt-4 space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full p-3 border rounded-md focus:outline-none"
                                        />
                                        <textarea
                                            placeholder="Your Review"
                                            className="w-full p-3 border rounded-md focus:outline-none"
                                        />
                                        <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            </div>
                            {/* Facilities & Supported Games */}
                            <div className="space-y-6">
                                {/* Facilities Section */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-green-600 text-xl font-bold mb-4">Facilities</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {turf?.facilities.map((facility, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow font-medium"
                                            >
                                                {facility}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Supported Games Section */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-green-600 text-xl font-bold mb-4">Supported Games</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {turf?.supportedGames.map((game, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow font-medium"
                                            >
                                                {game}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Image Gallery */}
                                <TurfGallery images={turf?.images || []} />
                            </div>
                        </div>

                    </div>
                </div>
            </>}

        </>
    );
};

export default TurfDetail;
