"use client";

import { TurfDetails } from "@/utils/type";
import { useRouter } from "next/navigation";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
useRouter
interface TurfListProps {
    turfs: TurfDetails[] | null;
}
const TurfList: React.FC<TurfListProps> = ({ turfs }) => {

    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-green-50">
            {/* Header Section */}
            <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-md">
                <h1 className="text-3xl font-bold text-center">Find Your Perfect Turf</h1>
            </header>

            {/* Search Bar */}
            <div className="container w-11/12 md:w-3/4 mx-auto flex flex-col items-center py-8">
                <div className="flex items-center gap-4 bg-white rounded-lg shadow-lg p-4 w-full">
                    <input
                        type="text"
                        placeholder="Search by Turf, Location, or Price"
                        className="flex-grow p-3 border-none rounded-md focus:outline-none text-gray-700"
                    />
                    <button className="px-6 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 shadow-md">
                        Search
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container w-full md:w-5/6 mx-auto grid grid-cols-12 gap-8 p-2">

                {/* Filters Sidebar */}
                <aside className="col-span-12 md:col-span-2 bg-white p-6 rounded-lg shadow-md"> {/* Decreased width here */}
                    <h2 className="text-lg font-bold text-green-700 mb-4">Filters</h2>
                    <div className="space-y-6">
                        {/* Type Filter */}
                        <div>
                            <h3 className="text-green-600 font-medium mb-2">Type</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    Open
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    Indoor
                                </label>
                            </div>
                        </div>
                        {/* Price Filter */}
                        <div>
                            <h3 className="text-green-600 font-medium mb-2">Price Range</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    ₹750 - ₹1000
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    ₹1000 - ₹1500
                                </label>
                            </div>
                        </div>
                        {/* Size Filter */}
                        <div>
                            <h3 className="text-green-600 font-medium mb-2">Size</h3>
                            <div className="space-y-2">
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    5s
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    6s
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    7s
                                </label>
                                <label className="flex items-center text-gray-700">
                                    <input type="checkbox" className="mr-2 text-green-600" />
                                    11s
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Turf Cards Section */}
                <main className="col-span-12 md:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased width here */}
                    {turfs && turfs.length > 0 ? (
                        turfs.map((turf: TurfDetails, idx: number) => (
                            <div
                                key={turf._id || idx}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105 w-full sm:w-60 lg:w-72"
                            >
                                <div className="relative">
                                    <img
                                        src={turf.images[0] || `https://source.unsplash.com/400x250/?football,turf,${idx}`}
                                        alt={turf.turfName || "Turf"}
                                        className="w-full h-32 object-cover rounded-t-lg"
                                    />
                                    <span className="absolute top-2 left-2 px-4 py-2 bg-green-700 text-white text-sm font-bold rounded-full shadow-lg">
                                        ₹{turf.price}/hour
                                    </span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-semibold text-green-700 truncate">
                                        {turf.turfName || `Turf Name #${idx + 1}`}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        {turf.address || `Turf City #${idx + 1}`}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <FaClock className="text-green-500" />
                                        {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                                    </p>
                                    <button className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                                        onClick={() => router.push(`/turfs/${turf._id}`)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-2 text-gray-500">No turfs available</p>
                    )}
                </main>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center py-6">
                <nav className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-md">
                        1
                    </button>
                    <button className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-md">
                        2
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );


};


export default TurfList;
