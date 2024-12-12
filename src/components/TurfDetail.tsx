"use client";
import React, { useState } from "react";
import AvailableSlots from "./AvailableSlots";

interface Location {
    latitude: number;
    longitude: number;
}

interface WorkingSlots {
    fromTime: string;
    toTime: string;
}

interface TurfDetailsType {
    turfName: string;
    price: number;
    turfType: string;
    turfSize: string;
    location: Location;
    description: string;
    facilities: string[];
    supportedGames: string[];
    workingSlots: WorkingSlots;
    workingDays: string[];
    images: string[];
}

interface Review {
    username: string;
    rating: number;
    comment: string;
}

const TurfDetail: React.FC = () => {
    const turfDetails: TurfDetailsType = {
        turfName: "POLONIUM_1749",
        price: 560,
        turfType: "Closed",
        turfSize: "11s",
        location: { latitude: 17.406132235158772, longitude: 78.47172403322476 },
        description: "A premium turf offering excellent facilities and services.",
        facilities: ["Equipment Rentals", "Rest Areas"],
        supportedGames: ["Hockey", "Volleyball", "Cricket", "Football"],
        workingSlots: { fromTime: "00:50", toTime: "01:52" },
        workingDays: ["Sunday", "Friday", "Saturday", "Thursday"],
        images: [
            "https://turf-app-bucket.s3.ap-south-1.amazonaws.com/1733745409708",
            "https://turf-app-bucket.s3.ap-south-1.amazonaws.com/1733746359704",
            "https://turf-app-bucket.s3.ap-south-1.amazonaws.com/1733746473865",
            "https://turf-app-bucket.s3.ap-south-1.amazonaws.com/1733746856587",
            "https://turf-app-bucket.s3.ap-south-1.amazonaws.com/1733746856587",
        ],
    };
    const reviews: Review[] = [
        { username: "John Doe", rating: 4, comment: "Great turf, well maintained!" },
        { username: "Jane Smith", rating: 5, comment: "Loved the facilities here!" },
    ]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    console.log("TURF Details Page");


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
                {/* Header */}
                <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-center">{turfDetails.turfName}</h1>
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
                            <p className="text-gray-700 text-lg italic">{turfDetails.description}</p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Type
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        {turfDetails.turfType}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Size
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        {turfDetails.turfSize}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Location
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">
                                        Latitude: {turfDetails.location.latitude}, Longitude:{" "}
                                        {turfDetails.location.longitude}
                                    </p>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-green-100 rounded-lg shadow-lg p-6 flex flex-col items-center">
                                <p className="text-green-800 text-3xl font-bold">₹{turfDetails.price}</p>
                                <p className="text-gray-600 text-lg">Per Hour</p>
                                <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 shadow-md">
                                    Book your Slot
                                </button>
                            </div>
                        </div>

                        {/* Facilities & Supported Games */}
                        <div className="space-y-6">
                            {/* Facilities Section */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-green-600 text-xl font-bold mb-4">Facilities</h3>
                                <div className="flex flex-wrap gap-4">
                                    {turfDetails.facilities.map((facility, idx) => (
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
                                    {turfDetails.supportedGames.map((game, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow font-medium"
                                        >
                                            {game}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Image with clickable */}

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-green-700 text-lg font-bold mb-4">Gallery</h2>

                        {/* Initial Grid View */}
                        {!isExpanded ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {turfDetails.images.map((image, idx) => (
                                    <img
                                        key={idx}
                                        src={image}
                                        alt={`Turf Image ${idx + 1}`}
                                        className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                                        onClick={() => {
                                            setCurrentIndex(idx);
                                            setIsExpanded(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Expanded Carousel View */
                            <div className="relative bg-white rounded-lg shadow-lg p-6">
                                {/* Carousel Container */}
                                <div className="relative overflow-hidden w-full h-80 mx-auto rounded-lg">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{
                                            transform: `translateX(-${currentIndex * 100}%)`,
                                        }}
                                    >
                                        {turfDetails.images.map((image: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className="w-full h-full flex-shrink-0 flex items-center justify-center"
                                                style={{
                                                    minWidth: "100%", // Ensure each image container takes up 100% of the width
                                                    height: "100%", // Match the height of the container
                                                }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Turf Image ${idx + 1}`}
                                                    className="w-full h-full object-contain rounded-lg shadow-md"
                                                />
                                            </div>

                                        ))}

                                    </div>
                                </div>

                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => {
                                        // Move to the previous image or loop to the last one
                                        setCurrentIndex((prevIndex) =>
                                            prevIndex === 0 ? turfDetails.images.length - 1 : prevIndex - 1
                                        );
                                    }}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                                >
                                    &#8592;
                                </button>
                                <button
                                    onClick={() => {
                                        // Move to the next image or loop back to the first one
                                        setCurrentIndex((prevIndex) =>
                                            prevIndex === turfDetails.images.length - 1 ? 0 : prevIndex + 1
                                        );
                                    }}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow-lg hover:bg-green-800"
                                >
                                    &#8594;
                                </button>

                                {/* Dots Navigation */}
                                <div className="flex justify-center mt-4 space-x-2">
                                    {turfDetails.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-3 h-3 rounded-full ${idx === currentIndex ? "bg-green-700" : "bg-gray-300"
                                                }`}
                                        ></button>
                                    ))}
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
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
            </div>
            <AvailableSlots />
        </>
    );
};

export default TurfDetail;
