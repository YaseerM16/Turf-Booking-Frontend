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
    const [reviews, setReviews] = useState<Review[]>([
        { username: "John Doe", rating: 4, comment: "Great experience!" },
        { username: "Jane Smith", rating: 5, comment: "Absolutely loved it!" },
    ]);

    const [hoverRating, setHoverRating] = useState<number>(0); // State to track hover
    // console.log("HOverRating :", hoverRating);


    const [showForm, setShowForm] = useState(false); // For toggling the form modal
    const [formData, setFormData] = useState({ username: "", rating: 0, comment: "" });
    const [errors, setErrors] = useState({ username: false, rating: false, comment: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: false }); // Clear error on input change
    };

    // Handle star rating selection
    const handleRating = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating: rating }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { username, rating, comment } = formData;
        const newErrors = {
            username: !username.trim(),
            rating: !rating || Number(rating) < 1 || Number(rating) > 5,
            comment: !comment.trim(),
        };

        setErrors(newErrors);

        // If there are no errors, add the review
        if (!Object.values(newErrors).some((error) => error)) {
            setReviews((prevReviews) => [
                ...prevReviews,
                { username, rating: Number(rating), comment },
            ]);

            // Clear the form
            setFormData({ username: "", rating: 0, comment: "" });
        }
    };
    // console.log("TURF Details Page");

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
                    <div className={`flex gap-8 ${showSlot ? "flex-col" : "flex-row"}`}>
                        {/* Turf Details */}
                        <div
                            className={`flex-1 bg-gradient-to-b from-white to-green-50 rounded-lg shadow-xl p-8 space-y-6`}
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
                                    <p className="ml-3 text-gray-800 text-lg font-medium">{turf?.turfType}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Size
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">{turf?.turfSize}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                        Location
                                    </span>
                                    <p className="ml-3 text-gray-800 text-lg font-medium">{turf?.address}</p>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="border border-gray-300 rounded-lg shadow-md p-4 relative bg-cover bg-center"
                                        style={{ backgroundImage: `url('/map-background.jpg')` }}
                                    >
                                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                                        <div className="relative">
                                            <h3 className="text-lg font-semibold text-white mb-3">Turf Location</h3>
                                            <MapComponent
                                                location={turf?.location}
                                                company={{
                                                    images: turf?.images || [],
                                                    companyname: company?.companyname || "Turf company",
                                                    phone: company?.phone || "N/A",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            {!showSlot && (
                                <div className="bg-green-100 rounded-lg shadow-lg p-6 flex flex-col items-center">
                                    <p className="text-green-800 text-3xl font-bold">₹{turf?.price}</p>
                                    <p className="text-gray-600 text-lg">Per Hour</p>
                                    <button
                                        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 shadow-md"
                                        onClick={() => toggleSlotView()}
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Available Slots Section */}
                        {showSlot && (
                            <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
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
                    <div className="p-3 mt-3">
                        <TurfGallery images={turf?.images || []} />
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                        {/* Reviews Section */}
                        <h2 className="text-xl font-bold text-green-700">Reviews</h2>
                        <div className="space-y-4 mt-4">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="bg-gray-100 p-4 rounded-md shadow-md">
                                    <p className="text-green-600 font-medium">{review.username}</p>
                                    <p className="text-yellow-500">
                                        {"⭐".repeat(review.rating)} {/* Display stars */}
                                    </p>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Give Review Button */}
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800"
                        >
                            Give Review
                        </button>

                        {/* Review Form Modal */}
                        {showForm && (
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                    <h3 className="text-lg font-bold text-green-700">Submit Your Review</h3>
                                    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                                        {/* Username Input */}
                                        <div>
                                            <label className="block text-gray-700 font-medium" htmlFor="username">
                                                Name:
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`w-full p-2 border rounded ${errors.username ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter your name"
                                            />
                                            {errors.username && (
                                                <p className="text-red-500 text-sm mt-1">Name is required.</p>
                                            )}
                                        </div>

                                        {/* Star Rating Input */}
                                        <div>
                                            <label className="block text-gray-700 font-medium" htmlFor="rating">
                                                Rating:
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`cursor-pointer text-2xl ${star <= hoverRating
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                            }`}
                                                        onClick={() => handleRating(star)} // Click to select the star
                                                        onMouseEnter={() => setHoverRating(star)} // Hover to highlight stars
                                                        onMouseLeave={() => setHoverRating(0)} // Reset hover when leaving
                                                    >
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>

                                            {errors.rating && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    Rating must be between 1 and 5.
                                                </p>
                                            )}
                                        </div>


                                        {/* Comment Input */}
                                        <div>
                                            <label className="block text-gray-700 font-medium" htmlFor="comment">
                                                Comment:
                                            </label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                value={formData.comment}
                                                onChange={handleChange}
                                                className={`w-full p-2 border rounded ${errors.comment ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                placeholder="Write your review here..."
                                            />
                                            {errors.comment && (
                                                <p className="text-red-500 text-sm mt-1">Comment is required.</p>
                                            )}
                                        </div>

                                        {/* Submit and Cancel Buttons */}
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </>
    );
};

export default TurfDetail;
