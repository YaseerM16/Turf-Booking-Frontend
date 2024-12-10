import React from "react";

const TurfList = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-green-50">
            {/* Header Section */}
            <header className="bg-green-700 text-white sticky top-0 z-10 p-6 shadow-md">
                <h1 className="text-2xl font-bold text-center">Find Your Perfect Turf</h1>
            </header>

            {/* Search Bar */}
            <div className="container mx-auto flex flex-col items-center py-8">
                <div className="w-11/12 md:w-3/4 flex items-center gap-4 bg-white rounded-lg shadow-lg p-4">
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
            <div className="container mx-auto grid grid-cols-12 gap-6 p-6">
                {/* Filters Sidebar */}
                <aside className="col-span-12 md:col-span-3 bg-white p-6 rounded-lg shadow-md">
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
                <main className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={`https://source.unsplash.com/300x200/?football,turf,${idx}`}
                                    alt="Turf"
                                    className="w-full h-32 object-cover rounded-t-lg"
                                />
                                <span className="absolute top-2 left-2 px-3 py-1 bg-green-700 text-white text-xs font-bold rounded-full">
                                    ₹1000/hour
                                </span>
                            </div>
                            <div className="p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-green-700">Turf Name #{idx + 1}</h3>
                                <p className="text-sm text-gray-500">📍 Location: Turf City #{idx + 1}</p>
                                <p className="text-sm text-gray-500">⏰ Timings: 6:00 AM - 10:00 PM</p>
                                <button className="w-full py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </main>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center py-6">
                <nav className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Previous
                    </button>
                    <button className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded-md">
                        1
                    </button>
                    <button className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded-md">
                        2
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default TurfList;
